import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import useAuth from "../store/useAuth";

const NavBar = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.user); 

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "";

  const navLinks = [
    { name: "Home", href: "#", active: true },
    { name: "About", href: "#", active: false },
    { name: "Features", href: "#", active: false },
    { name: "How It Works", href: "#", active: false },
    { name: "Contact", href: "#", active: false },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="bg-gradient-to-r from-teal-700 to-teal-500"
    >
      <Container maxWidth="lg">
        <Toolbar className="flex justify-between items-center py-3">
          <Box className="flex items-center space-x-3 select-none">
            <Avatar className="bg-gradient-to-r from-teal-400 to-teal-600 w-10 h-10 shadow-lg p-2">
              <BarChart3 className="w-6 h-6 text-white" />
            </Avatar>
            <Typography
              variant="h5"
              className="font-semibold text-white tracking-tight capitalize"
            >
              SocialSense
            </Typography>
          </Box>

          <Box className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                href={link.href}
                disableRipple
                className={`relative font-bold normal-case text-base transition-all duration-300 ${
                  link.active
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-white"
                }`}
                sx={{
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: link.active ? "#FACC15" : "#FFFFFF",
                  },
                  color: link.active ? "#FACC15" : "#D1D5DB",
                  transform: link.active ? "scale(1.05)" : "none",
                }}
              >
                {link.name}
                {link.active && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></span>
                )}
              </Button>
            ))}
          </Box>
          {isAuthenticated && user ? (
            <Box
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <Avatar className="bg-teal-600 text-white w-10 h-10 font-sans">
                {initials}
              </Avatar>
              <Typography className="text-white font-medium">
                {user.firstName} {user.lastName}
              </Typography>
            </Box>
          ) : (
            <Button
              variant="contained"
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 normal-case px-6 py-2 rounded-xl shadow-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105"
              sx={{
                backgroundColor: "#4F7B7F",
                "&:hover": {
                  background: "linear-gradient(90deg, #1D4D4F, #0E3A3B)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  color: "#ffffff",
                },
              }}
              onClick={() =>
                isAuthenticated ? navigate("/dashboard") : navigate("/login")
              }
            >
              Get Started
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
