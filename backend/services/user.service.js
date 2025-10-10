import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

export const createUser = async (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    return user;
  }
  throw new Error("User already exists");
};

export const generateJwt = async (user) => {
  return jwt.sign(
    { _id: user._id.toString() ,email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export const isValidPassword = async (password, user) => {
  return await bcrypt.compare(password, user.password)
}