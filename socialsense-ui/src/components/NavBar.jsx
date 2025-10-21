import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Typography,
  Button,
  Container,
  Menu,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import useAuth from "../store/useAuth";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Analysis", href: "/dashboard" },
    { name: "History", href: "/history" },
    { name: "Statistics", href: "/statistics" },
    { name: "More Info", href: "/more-info" },
  ];

  const handleMenuOpen = (event) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    useAuth.getState().logout();
    setAnchorEl(null);
    navigate("/login");
  };

  const activePath = location.pathname;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="bg-gradient-to-r from-teal-700 to-teal-500 shadow-lg"
    >
      <Container maxWidth="lg">
        <Toolbar className="flex justify-between items-center py-3">
          {/* Logo Section */}
          <Box
            className="flex items-center space-x-3 select-none cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Avatar className="bg-gradient-to-r from-teal-400 to-teal-600 w-10 h-10 shadow-md p-2">
              <BarChart3 className="w-6 h-6 text-white" />
            </Avatar>
            <Typography
              variant="h5"
              className="font-sans font-semibold text-white tracking-tight capitalize"
            >
              SocialSense
            </Typography>
          </Box>

          <Box className="hidden md:flex items-center space-x-20">
            {navLinks.map((link) => {
              const isActive = activePath === link.href;
              return (
                <Button
                  key={link.name}
                  disableRipple
                  onClick={() => navigate(link.href)}
                  className="relative font-sans font-bold normal-case text-base tracking-tight transition-all duration-300"
                  sx={{
                    gap: "4rem",
                    backgroundColor: "transparent",
                    color: isActive ? "#FACC15" : "#F5F5F5", 
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#FACC15",
                    },
                  }}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-full bg-yellow-400 shadow-[0_0_8px_#FACC15]"
                        : "w-0 bg-transparent"
                    }`}
                  ></span>
                </Button>
              );
            })}
          </Box>

          {isAuthenticated && user ? (
            <Box
              className="flex items-center space-x-3 cursor-pointer"
              onClick={handleMenuOpen}
            >
              <Avatar className="bg-teal-600 text-white w-10 h-10 font-sans shadow-md hover:scale-105 transition-transform duration-200">
                {initials}
              </Avatar>
              <Typography className="text-white font-sans font-medium tracking-wide">
                {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
              </Typography>
            </Box>
          ) : (
            <Button
              variant="contained"
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 normal-case px-6 py-2 rounded-xl shadow-md font-sans font-semibold text-sm transition-all duration-300 transform hover:scale-105"
              onClick={() =>
                isAuthenticated ? navigate("/dashboard") : navigate("/login")
              }
            >
              Get Started
            </Button>
          )}
        </Toolbar>
      </Container>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "10px",
            backgroundColor: "#ffffff",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
            padding: "0.5rem",
          },
        }}
      >
        <List>
          <ListItem
            onClick={() => {
              navigate("/dashboard");
              handleMenuClose();
            }}
            className="hover:bg-teal-50 rounded-lg transition-all"
          >
            <ListItemText
              primary="Dashboard"
              className="text-teal-600 cursor-pointer"
            />
          </ListItem>

          <ListItem
            onClick={() => {
              handleLogout();
              handleMenuClose();
            }}
            className="hover:bg-red-50 rounded-lg transition-all"
          >
            <ListItemText
              primary="Logout"
              className="text-red-600 cursor-pointer"
            />
          </ListItem>
        </List>
      </Menu>
    </AppBar>
  );
};

export default NavBar;
