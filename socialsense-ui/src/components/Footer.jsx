import React from "react";
import { Container, Grid, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-white to-green-50 py-12 mt-16 border-t border-teal-200">
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Left Section - Brand */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component="div"
              className="text-teal-700 font-bold mb-2"
            >
              SocialSense
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className="text-teal-800 max-w-xs"
            >
              Empowering you to understand mental health through social media
              analysis.
            </Typography>
          </Grid>

          {/* Middle Section - Links */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              className="text-teal-700 font-semibold mb-2 text-center md:text-left"
            >
              Quick Links
            </Typography>
            <nav className="flex justify-center md:justify-start">
              <ul className="flex flex-wrap gap-x-8">
                <li>
                  <Link href="#" underline="hover" color="inherit">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" underline="hover" color="inherit">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" underline="hover" color="inherit">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" underline="hover" color="inherit">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </Grid>

          {/* Right Section - Social Icons */}
          <Grid item xs={12} md={4} className="text-center md:text-right">
            <Typography
              variant="subtitle1"
              className="text-teal-700 font-semibold mb-2"
            >
              Follow Us
            </Typography>
            <div className="flex justify-center md:justify-end space-x-4">
              <IconButton
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-teal-500 hover:text-teal-700"
              >
                <Facebook size={24} />
              </IconButton>
              <IconButton
                component="a"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-teal-500 hover:text-teal-700"
              >
                <Twitter size={24} />
              </IconButton>
              <IconButton
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-teal-500 hover:text-teal-700"
              >
                <Instagram size={24} />
              </IconButton>
              <IconButton
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-teal-500 hover:text-teal-700"
              >
                <Linkedin size={24} />
              </IconButton>
            </div>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          className="mt-20 text-teal-600"
        >
          © {new Date().getFullYear()} SocialSense. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
