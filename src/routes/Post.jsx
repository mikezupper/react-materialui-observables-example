import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
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
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import { useObservable } from "rxjs-hooks";
import { AppService } from "../services/api.js";
import "../styles/App.css";

function Post() {
    const { post$, users$ } = useLoaderData();
    const post = useObservable(() => post$, undefined);
    const users = useObservable(() => users$, []);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [newComment, setNewComment] = useState({
        userId: "",
        body: "",
    });
    const [notification, setNotification] = useState({ open: false, message: "", severity: "" });

    if (!post || users.length === 0) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <Typography variant="h6">Loading...</Typography>
            </Box>
        );
    }

    const handleDialogOpen = () => setDialogOpen(true);
    const handleDialogClose = () => setDialogOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewComment((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e) => {
        setNewComment((prev) => ({ ...prev, userId: e.target.value }));
    };

    const handleAddComment = async () => {
        try {
            const user = users.find((u) => u.id === parseInt(newComment.userId, 10));
            await AppService.addComment({
                ...newComment,
                name: user.name,
                email: user.email,
                postId: post.id,
                last_updated: new Date().toISOString(),
            });
            setNotification({ open: true, message: "Comment added successfully!", severity: "success" });
        } catch (error) {
            console.error("[Post] Error adding comment:", error);
            setNotification({ open: true, message: "Failed to add comment.", severity: "error" });
        }
        setDialogOpen(false);
        setNewComment({ userId: "", body: "" });
    };

    const handleNotificationClose = () => {
        setNotification((prev) => ({ ...prev, open: false }));
    };

    return (
        <Box
            className="glass"
            sx={{
                maxWidth: 800,
                mx: "auto",
                mt: 4,
                py: 4,
                px: 3,
                position: "relative",
            }}
        >
            {/* Post Content */}
            <Card
                className="interactive"
                sx={{
                    mb: 4,
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                            <DescriptionIcon />
                        </Avatar>
                    }
                    title={<Typography variant="h6">{post.title}</Typography>}
                    subheader={`By: ${post.user.name} (${post.user.email})`}
                />
                <Divider />
                <CardContent>
                    <Typography variant="body1" paragraph>
                        {post.body}
                    </Typography>
                </CardContent>
            </Card>

            {/* Comments Section */}
            <Box>
                <Typography variant="h5" gutterBottom>
                    Comments
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {post.comments.length > 0 ? (
                    <List>
                        {post.comments.map((comment) => (
                            <React.Fragment key={comment.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    className="interactive"
                                    sx={{
                                        borderRadius: "8px",
                                        mb: 1,
                                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: "secondary.main" }}>
                                            {comment.email[0]}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={comment.body}
                                        secondary={`By: ${comment.name} (${comment.email})`}
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1" color="textSecondary" align="center" sx={{ my: 2 }}>
                        No comments available. Add a comment using the button above.
                    </Typography>
                )}
            </Box>

            {/* Add Comment Floating Button */}
            <Fab
                color="primary"
                aria-label="add"
                className="interactive"
                sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 1000,
                }}
                onClick={handleDialogOpen}
            >
                <AddIcon />
            </Fab>

            {/* Add Comment Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle sx={{ color: "primary.main" }}>Add New Comment</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="user-select-label">User</InputLabel>
                        <Select
                            labelId="user-select-label"
                            value={newComment.userId || ""}
                            onChange={handleSelectChange}
                        >
                            {users.map((user) => (
                                <MenuItem key={`comment-user-${user.id}`} value={user.id}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Comment"
                        name="body"
                        value={newComment.body}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        className="interactive"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} className="interactive">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddComment}
                        variant="contained"
                        disabled={!newComment.userId || !newComment.body}
                        className="interactive"
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: "100%" }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Post;
