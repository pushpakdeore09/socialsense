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
import { BarChart3 } from "lucide-react";

const NavBar = () => {
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
          {/* Left: Logo */}
          <Box className="flex items-center space-x-2 select-none">
            <Avatar className="bg-white w-9 h-9 shadow-md">
              <BarChart3 className="w-5 h-5 text-teal-600" />
            </Avatar>
            <Typography
              variant="h5"
              className="font-bold text-white tracking-tight"
            >
              SocialSense
            </Typography>
          </Box>

          {/* Middle: Nav Links */}
          <Box className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                href={link.href}
                disableRipple
                className={`font-medium normal-case text-base transition-all duration-200 ${
                  link.active
                    ? "text-white font-semibold border-b-2 border-white"
                    : "text-gray-100 hover:text-white"
                }`}
                sx={{
                  backgroundColor: "transparent",
                  "&:hover": { backgroundColor: "transparent" },
                  color: link.active ? "#fff" : "#f0fdf4",
                }}
              >
                {link.name}
              </Button>
            ))}
          </Box>

          {/* Right: CTA Button */}
          <Button
            variant="contained"
            className="bg-white text-teal-700 hover:bg-gray-100 normal-case px-6 py-2 rounded-xl shadow-md font-semibold text-sm transition-all duration-200"
            sx={{
              "&:hover": { backgroundColor: "#3f4f6f" },
            }}
            onClick={() => console.log("Get Started clicked")}
          >
            Get Started
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
