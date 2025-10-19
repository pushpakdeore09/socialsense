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
import {registerUser} from "../api/authApi";
import { toast } from "react-hot-toast";
import {useNavigate} from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate()
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      firstName,
      lastName,
      email,
      password,
    };
    try {
        const response = await registerUser(userData);
        if (response.user){
            toast.success("Registered Successfully")
            navigate('/login')
        }else{
            toast.error("Some error occured!")
        }
    } catch (error) {
        console.log(error);
    }

  };
  return (
    <section className="bg-gradient-to-br from-white to-green-50 py-20 px-4 min-h-screen flex items-center justify-center">
      <Container maxWidth="sm">
        <Paper elevation={4} className="p-10 rounded-2xl shadow-xl bg-white">
          <div className="mb-6">
            <Typography
              variant="h4"
              className="text-teal-700 font-bold text-center mb-2"
            >
              Register to SocialSense
            </Typography>
            <Typography variant="body1" className="text-gray-600 text-center">
              Create your SocialSense account
            </Typography>
          </div>
          <form onSubmit={handleSubmit}>
            {/* First and Last Name */}
            <div className="flex mb-6">
              <div className="mr-6 w-1/2">
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6">
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-8">
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="!bg-teal-600 hover:!bg-teal-700 text-white py-3 font-semibold text-base rounded-lg shadow-md transition duration-300 "
            >
              Register
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Typography variant="body2" className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-teal-600 hover:underline font-medium"
              >
                Login
              </a>
            </Typography>
          </div>
        </Paper>
      </Container>
    </section>
  );
};

export default Register;
