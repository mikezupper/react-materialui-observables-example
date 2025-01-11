import Dexie, {liveQuery} from "dexie";
import {BehaviorSubject, combineLatest, from} from "rxjs";
import {map, shareReplay, tap} from "rxjs/operators";
import {API_BASE_URL} from "../config.js";

// Initialize Dexie database
const db = new Dexie("AppDatabase");
db.version(1).stores({
    users: "id++, name, email, phone, website,last_updated",
    posts: "id++, userId, title, body,last_updated",
    comments: "id++, postId, name, email, body,last_updated",
});

const sortByLastUpdated = (data) => data.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));

// app state stream
const appStateSubject = new BehaviorSubject(null);

// Live queries for each partition
const fromLiveQuery = (tableName) => liveQuery(() => db.table(tableName).toArray().then(sortByLastUpdated) || [])

const usersLiveQuery = fromLiveQuery("users");
const postsLiveQuery = fromLiveQuery("posts");
const commentsLiveQuery = fromLiveQuery("comments");

usersLiveQuery.subscribe(users => console.log("usersLiveQuery updated:", users.length));
postsLiveQuery.subscribe(posts => console.log("postsLiveQuery updated:", posts.length));
commentsLiveQuery.subscribe(comments => console.log("commentsLiveQuery updated:", comments.length));

// DATA STREAMS
const posts$ = combineLatest([from(usersLiveQuery), from(postsLiveQuery), from(commentsLiveQuery)]).pipe(
    map(([users, posts, comments]) =>
        posts.map((post) => ({
            ...post,
            user: users.find((user) => user.id === post.userId),
            comments: comments.filter((comment) => comment.postId === post.id),
        }))
    ),
    shareReplay(1)
);
// posts$.subscribe({
//     next: (users) => console.log("[Debug] posts$ emitted:", users),
//     error: (err) => console.error("[Debug] posts$ error:", err),
//     complete: () => console.log("[Debug] posts$ completed"),
// });

const users$ = combineLatest([from(usersLiveQuery)]).pipe(
    map(([users]) => [...users]),
    shareReplay(1)
);

// users$.subscribe({
//     next: (users) => console.log("[Debug] users$ emitted:", users),
//     error: (err) => console.error("[Debug] users$ error:", err),
//     complete: () => console.log("[Debug] users$ completed"),
// });

const appState$ = combineLatest([posts$, users$])
    .pipe(
        map(([posts, users]) => ({
            users, posts
        }))
    );

// appState$.subscribe({
//     next: (state) => {
//         console.log("[api] appState$ Combined state sent to appStateSubject", state);
//         appStateSubject.next(state);
//     },
// });

// ACTION STREAMS
const selectedPost = (id) => posts$.pipe(
    map((data) => data.find((d) => d.id === id)),
    tap((d) => {
        if (!d) {
            console.warn(`[Debug] Post with ID ${id} not found`);
        }
    }),
    shareReplay(1)
)

const selectedUser = (id) => users$.pipe(
    map((data) => data.find((d) => d.id === id)),
    tap((d) => {
        if (!d) {
            console.warn(`[Debug] user with ID ${id} not found`);
        }
    }),
    shareReplay(1)
)

// Service interface
export const AppService = {
    getPosts: () => posts$,
    getUsers: () => users$,
    getUser: (id) => {
        if (isNaN(id))
            return;
        return selectedUser(id);
    },
    addUser: async (user) => {
        try {
            await db.users.add({...user, last_updated: new Date().toISOString()});
        } catch (error) {
            console.error('[AppService] Error adding user:', error);
        }
    },
    getPost: (id) => {
        if (isNaN(id))
            return;
        return selectedPost(id);

    },
    addPost: async (post) => {
        try {
            await db.posts.add({...post, last_updated: new Date().toISOString()}); // Add post to Dexie
        } catch (error) {
            console.error('[AppService] Error adding post:', error);
        }
    },
    addComment: async (comment) => {
        try {
            await db.comments.add(comment);
            console.log("[AppService] Comment added:", comment);
        } catch (error) {
            console.error("[AppService] Error adding comment:", error);
            throw error;
        }
    },
    reloadData: async () => {
        try {
            // Fetch and cache fresh data
            const fetchAndCache = async (url, tableName) => {
                console.log(`[api] Fetching and caching: ${url}`);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data from ${url}`);
                }
                const data = await response.json();
                await db.transaction("rw", db.table(tableName), async () => {
                    const newData = data.map((item) => ({
                        ...item,
                        last_updated: new Date().toISOString(),
                    }));
                    console.log("[Debug] Clearing data table");
                    await db.table(tableName).clear();
                    console.log("[Debug] Adding new data");
                    await db.table(tableName).bulkPut(newData);
                });
            };

            await fetchAndCache(`${API_BASE_URL}/users`, "users");
            await fetchAndCache(`${API_BASE_URL}/posts`, "posts");
            await fetchAndCache(`${API_BASE_URL}/comments`, "comments");

            console.log("[AppService] Data reloaded successfully");
        } catch (error) {
            console.error("[AppService] Error reloading data:", error);
        }
    },
};
