import React, { useState } from "react";
import {
    AppBar,
    Box,
    Breadcrumbs,
    Button,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link as MuiLink,
    Toolbar,
    Typography,
    CircularProgress, createTheme,
} from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppService } from "./services/api.js";
import {ThemeProvider} from "@mui/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#0078D4", // Microsoft blue
        },
        secondary: {
            main: "#107C10", // Microsoft green
        },
        error: {
            main: "#D83B01", // Microsoft red
        },
        background: {
            default: "#F3F2F1", // Light grey
            paper: "#FFFFFF", // White for cards
        },
        text: {
            primary: "#323130", // Dark grey for text
            secondary: "#605E5C", // Light grey for secondary text
        },
        accent: {
            yellow: "#FFD700", // Highlight yellow
            purple: "#5C2D91", // Highlight purple
        },
    },
    typography: {
        fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
        h1: {
            fontSize: "2.25rem",
            fontWeight: 600,
        },
        h2: {
            fontSize: "1.75rem",
            fontWeight: 600,
        },
        body1: {
            fontSize: "1rem",
        },
        button: {
            textTransform: "none", // Keep button text lowercase
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "4px", // Square buttons
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Fluent shadow
                    ":hover": {
                        backgroundColor: "#005A9E", // Darker blue on hover
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#0078D4", // Primary Microsoft blue
                    color: "#FFFFFF",
                    boxShadow: "none", // Clean look
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "8px", // Slightly rounded edges
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
                    backgroundColor: "#FFFFFF",
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: "#323130", // Primary text color
                },
            },
        },
    },
});


const App = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const pathnames = location.pathname.split("/").filter((x) => x);

    const handleDialogOpen = () => setDialogOpen(true);
    const handleDialogClose = () => setDialogOpen(false);

    const handleConfirmReload = async () => {
        setLoading(true);
        await AppService.reloadData();
        setLoading(false);
        setDialogOpen(false);
        navigate("/");
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="h6" sx={{ mr: 2 }}>
                            My Application
                        </Typography>
                        {pathnames.length > 0 && (
                            <Breadcrumbs aria-label="breadcrumb" sx={{ color: "inherit" }}>
                                <MuiLink component={Link} to="/" underline="hover" color="inherit">
                                    Home
                                </MuiLink>
                                {pathnames.map((value, index) => {
                                    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                                    return (
                                        <MuiLink
                                            key={to}
                                            component={Link}
                                            to={to}
                                            underline="hover"
                                            color="inherit"
                                        >
                                            {value}
                                        </MuiLink>
                                    );
                                })}
                            </Breadcrumbs>
                        )}
                    </Box>
                    <Button
                        color="inherit"
                        variant="outlined"
                        onClick={handleDialogOpen}
                        sx={{
                            borderColor: "white",
                            color: "white",
                            textTransform: "none",
                            ":hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                        }}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Reload Data"}
                    </Button>
                </Toolbar>
            </AppBar>

            <Container sx={{ flexGrow: 1, py: 3 }}>
                <Outlet />
            </Container>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Confirm Data Reload</DialogTitle>
                <DialogContent>
                    <Typography>
                        Reloading will clear all existing data and replace it with fresh data.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmReload}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

export default App;
