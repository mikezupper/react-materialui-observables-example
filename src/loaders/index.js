// src/loaders/index.js
import {AppService} from "../services/api.js";

export const postsLoader = () => {
    const posts$ = AppService.getPosts();
    const users$ = AppService.getUsers();
    return {posts$, users$};
};

export const postLoader = ({params}) => {
    const postId = parseInt(params.id, 10);
    const post$ = AppService.getPost(postId);
    const users$ = AppService.getUsers();

    return {post$,users$};
};

export const usersLoader = () => {
    const users$ = AppService.getUsers();
    return {users$};
};

export const userLoader = ({params}) => {
    const userId = parseInt(params.id, 10);
    const user$ = AppService.getUser(userId);
    return {user$};
};
