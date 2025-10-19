import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import userSchema from "../models/user.model.js";

export const registerController = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await userService.createUser(req);
    return res.status(201).send({ user});
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid Credentials");
    }
    const isPasswordMatch = await userService.isValidPassword(password, user);
    if(!isPasswordMatch){
        return res.status(400).send("Invalid Credentials");
    }
    const token = await userService.generateJwt(user);
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
