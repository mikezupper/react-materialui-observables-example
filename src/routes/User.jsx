import React from "react";
import { useLoaderData } from "react-router-dom";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Divider,
    Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useObservable } from "rxjs-hooks";
import "../styles/App.css";

function User() {
    const { user$ } = useLoaderData();
    const user = useObservable(() => user$, undefined);

    if (!user) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    console.log(`User: ${JSON.stringify(user)}`);

    return (
        <Box
            className="glass"
            sx={{
                maxWidth: 600,
                mx: "auto",
                mt: 4,
                py: 4,
                px: 3,
            }}
        >
            {/* User Card */}
            <Card
                className="interactive"
                sx={{
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: "secondary.main" }}>
                            <PersonIcon />
                        </Avatar>
                    }
                    title={<Typography variant="h6">{user.name}</Typography>}
                    subheader={<Typography variant="body2">Email: {user.email}</Typography>}
                />
                <Divider />
                <CardContent>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Phone:</strong> {user.phone}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Website:</strong>{" "}
                        <a
                            href={`https://${user.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#1976d2", textDecoration: "none" }}
                        >
                            {user.website}
                        </a>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default User;
