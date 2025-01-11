import React, { useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Fab,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Typography,
    CircularProgress,
    Alert,
    Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import { useObservable } from "rxjs-hooks";
import { Link, useLoaderData } from "react-router-dom";
import { AppService } from "../services/api.js";
import "../styles/App.css";

const Users = () => {
    const { users$ } = useLoaderData();
    const users = useObservable(() => users$, []);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", website: "" });
    const [notification, setNotification] = useState({ open: false, message: "", severity: "" });
    const [loading, setLoading] = useState(false);

    const handleDialogOpen = () => setDialogOpen(true);
    const handleDialogClose = () => setDialogOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddUser = async () => {
        setLoading(true);
        try {
            await AppService.addUser(newUser);
            setNotification({ open: true, message: "User added successfully!", severity: "success" });
        } catch (error) {
            setNotification({ open: true, message: "Failed to add user.", severity: "error" });
        } finally {
            setLoading(false);
            setDialogOpen(false);
            setNewUser({ name: "", email: "", phone: "", website: "" });
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
                position: "relative",
            }}
        >
            {/* Floating Action Button */}
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
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : <AddIcon />}
            </Fab>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleNotificationClose} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>

            <Typography variant="h4" gutterBottom sx={{ color: "primary.main" }}>
                Users
            </Typography>

            {!users.length ? (
                <Box sx={{ textAlign: "center", my: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                        No users available. Add a user using the button above.
                    </Typography>
                </Box>
            ) : (
                <List>
                    {users.map((user) => (
                        <React.Fragment key={user.id}>
                            <ListItem
                                component={Link}
                                to={`/users/${user.id}`}
                                alignItems="flex-start"
                                className="interactive"
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.name}
                                    secondary={`${user.email} | ${user.phone}`}
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
            )}

            {/* Add User Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle sx={{ color: "primary.main" }}>Add New User</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        name="name"
                        value={newUser.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        className="interactive"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        className="interactive"
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        value={newUser.phone}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        className="interactive"
                    />
                    <TextField
                        label="Website"
                        name="website"
                        value={newUser.website}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
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
                        onClick={handleAddUser}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                        className="interactive"
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Users;
