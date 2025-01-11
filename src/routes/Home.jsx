import React from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import "../styles/App.css"; // Import styles

const Home = () => {
    return (
        <Box
            className="glass"
            sx={{
                textAlign: "center",
                mt: 4,
                py: 6,
                maxWidth: "600px",
                mx: "auto",
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ color: "primary.main" }}>
                Welcome to the Application
            </Typography>
            <Typography
                variant="body1"
                sx={{ mb: 4, color: "text.secondary", fontSize: "1.1rem" }}
            >
                Use the options below to navigate the application.
            </Typography>
            <Box sx={{ my: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/posts"
                    className="interactive"
                    sx={{ m: 1 }}
                >
                    View Posts
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/users"
                    className="interactive"
                    sx={{ m: 1 }}
                >
                    View Users
                </Button>
            </Box>
        </Box>
    );
};

export default Home;
