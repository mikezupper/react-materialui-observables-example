import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom';
import App from './App';
import {Box, CircularProgress} from "@mui/material";
import Typography from "@mui/material/Typography";
import {postLoader, postsLoader, userLoader, usersLoader} from "./loaders/index.js";
import Posts from "./routes/Posts.jsx";
import Post from "./routes/Post.jsx";
import Home from "./routes/Home.jsx";
import Users from "./routes/Users.jsx";
import User from "./routes/User.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App/>}>
            <Route
                index
                element={<Home/>}
                hydrateFallbackElement={<CircularProgress/>}
            />
            <Route path="posts/:id" element={<Post/>} loader={postLoader}/>
            <Route
                path={"posts"}
                element={<Posts/>}
                loader={postsLoader}
                hydrateFallbackElement={<CircularProgress/>}
            />
            <Route path="users/:id" element={<User/>} loader={userLoader} hydrateFallbackElement={<CircularProgress/>}/>
            <Route
                path={"users"}
                element={<Users/>}
                loader={usersLoader}
                hydrateFallbackElement={<CircularProgress/>}
            />
            {/* Catch-all route for undefined paths */}
            <Route
                path="*"
                element={
                    <Box p={4}>
                        <Typography variant="h4">404 - Not Found</Typography>
                        <Typography variant="body1">
                            The page you are looking for does not exist.
                        </Typography>
                    </Box>
                }>
            </Route>
        </Route>
    )
);
ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router}/>);
