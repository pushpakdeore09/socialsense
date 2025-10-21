import React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { BarChart3, Info, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/useAuth";
const HeroSection = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  return (
    <Box
      sx={{
        bgcolor: "linear-gradient(to bottom right, #ffffff, #f1fef4)",
        py: { xs: 8, md: 12 },
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            minHeight: { xs: 300, md: 400 },
            flexWrap: "nowrap",
          }}
        >
          <Box
            sx={{
              flex: "1 1 50%",
              maxWidth: 600,
              textAlign: "left",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              fontWeight={800}
              gutterBottom
              sx={{ lineHeight: 1.2 }}
            >
              Early Detection,{" "}
              <Box component="span" sx={{ color: "success.main" }}>
                Better Support
              </Box>
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              mb={5}
              sx={{ lineHeight: 1.5 }}
            >
              SocialSense uses advanced AI to analyze text patterns and identify
              potential depression indicators, helping you take the first step
              toward mental wellness.
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-start"
              alignItems="center"
              mb={3}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<BarChart3 size={20} />}
                sx={{
                  bgcolor: "teal.main",
                  color: "#fff",
                  px: 4,
                  "&:hover": {
                    bgcolor: "teal.dark",
                  },
                }}
                onClick={() => 
                  isAuthenticated ? navigate("/dashboard") : navigate("/login")
                }
              >
                Start Analysis
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Info size={20} />}
                sx={{
                  px: 4,
                  borderColor: "grey.300",
                  color: "text.primary",
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                }}
                onClick={() => navigate('/more-info')}
              >
                Learn More
              </Button>
            </Stack>

            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={1}
            >
              <Lock size={16} color="#9ca3af" />
              <Typography variant="body2" color="text.secondary">
                100% Private & Confidential
              </Typography>
            </Stack>
          </Box>

          {/* Image */}
          <Box
            component="img"
            src="/images/homepage.png"
            alt="Illustration"
            sx={{
              flexShrink: 0,
              width: 400,
              maxWidth: "40vw",
              height: "auto",
              borderRadius: 3,
              boxShadow: 3,
              userSelect: "none",
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
