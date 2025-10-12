import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(email, password);
    
  }

  return (
    <section className="bg-gradient-to-br from-white to-green-50 min-h-screen flex items-center justify-center px-4 py-20">
      <Container maxWidth="sm">
        <Paper elevation={4} className="p-10 rounded-2xl shadow-xl bg-white">
          {/* Header */}
          <div className="mb-6">
            <Typography
              variant="h4"
              className="text-teal-700 font-bold text-center mb-2"
            >
              Login to SocialSense
            </Typography>
            <Typography variant="body1" className="text-gray-600 text-center">
              Login to your SocialSense account
            </Typography>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="!bg-teal-600 hover:!bg-teal-700 text-white py-3 font-semibold text-base rounded-lg shadow-md transition duration-300"
            >
              Login
            </Button>
          </form>

          {/* Bottom Text */}
          <div className="mt-4 text-center">
            <Typography variant="body2" className="text-gray-600">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-teal-600 hover:underline font-medium"
              >
                Register
              </a>
            </Typography>
          </div>
        </Paper>
      </Container>
    </section>
  );
};

export default Login;
