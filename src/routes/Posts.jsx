import React, { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography,
    CircularProgress,
    Alert,
    Divider,
    Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import { Link, useLoaderData } from "react-router-dom";
import { useObservable } from "rxjs-hooks";
import { AppService } from "../services/api.js";
import "../styles/App.css";

const Posts = () => {
    const { posts$, users$ } = useLoaderData();
    const posts = useObservable(() => posts$, []);
    const users = useObservable(() => users$, []);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", body: "" });
    const [notification, setNotification] = useState({ open: false, message: "", severity: "" });
    const [loading, setLoading] = useState(false);

    const handleDialogOpen = () => setDialogOpen(true);
    const handleDialogClose = () => setDialogOpen(false);

    const handleSelectChange = (e) => {
        setNewPost((prev) => ({ ...prev, userId: e.target.value }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddPost = async () => {
        setLoading(true);
        try {
            await AppService.addPost(newPost);
            setNotification({ open: true, message: "Post added successfully!", severity: "success" });
        } catch (error) {
            setNotification({ open: true, message: "Failed to add post.", severity: "error" });
        } finally {
            setLoading(false);
            setDialogOpen(false);
            setNewPost({ title: "", body: "" });
        }
    };

    const handleNotificationClose = () => setNotification((prev) => ({ ...prev, open: false }));

    return (
        <Box
            className="glass"
            sx={{
                maxWidth: 800,
                mx: "auto",
                mt: 4,
                py: 4,
                px: 3,
                position: "relative", // Ensures child positioning
            }}
        >
            {/* Floating Action Button at the top-right */}
            <Fab
                color="primary"
                aria-label="add"
                className="interactive"
                sx={{
                    position: "absolute", // Position relative to the component
                    top: 16, // Distance from the top
                    right: 16, // Distance from the right
                    zIndex: 1000,
                }}
                onClick={handleDialogOpen}
                disabled={users.length === 0 || loading}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : <AddIcon />}
            </Fab>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }} // Aligns top-right
            >
                <Alert onClose={handleNotificationClose} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>

            <Typography variant="h4" gutterBottom sx={{ color: "primary.main" }}>
                Posts
            </Typography>

            {!posts.length ? (
                <Box sx={{ textAlign: "center", my: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                        No posts available. Add a post using the button above.
                    </Typography>
                </Box>
            ) : (
                <List>
                    {posts.map((post) => (
                        <React.Fragment key={post.id}>
                            <ListItem
                                component={Link}
                                to={`/posts/${post.id}`}
                                alignItems="flex-start"
                                className="interactive"
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: "primary.main" }}>
                                        <ArticleIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={post.title}
                                    secondary={`By: ${post.user?.name || "Unknown"}`}
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
            )}

            {users.length === 0 && (
                <Box sx={{ textAlign: "center", my: 3 }}>
                    <Typography variant="body1" color="error">
                        No users found. Please{" "}
                        <Link to="/users" style={{ textDecoration: "none", color: "blue" }}>
                            add a user
                        </Link>{" "}
                        before creating posts.
                    </Typography>
                </Box>
            )}

            {/* Add Post Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle sx={{ color: "primary.main" }}>Add New Post</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="user-select-label">User</InputLabel>
                        <Select
                            labelId="user-select-label"
                            value={newPost.userId || ""}
                            onChange={handleSelectChange}
                        >
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Title"
                        name="title"
                        value={newPost.title}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        className="interactive"
                    />
                    <TextField
                        label="Body"
                        name="body"
                        value={newPost.body}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        className="interactive"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDialogClose}
                        color="secondary"
                        className="interactive"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddPost}
                        color="primary"
                        variant="contained"
                        disabled={!newPost.userId || loading}
                        className="interactive"
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Posts;
