import User from "../models/auth.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password, address } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    !address ||
    username === "" ||
    email === "" ||
    password === ""||
    !address.street || address.street === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    address: {
      street: address.street
    }
  });

  try {
    await newUser.save();
    res.json("Signup sucessful");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are requied"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    const token = jwt.sign({ id: validUser._id}, process.env.JWT_SECRET);

    const {password:pass, ...rest} = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};


export const adminSignin = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if all fields are provided
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // Find the user by email
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if the user is an admin
    if (!validUser.isAdmin) {
      return next(errorHandler(403, "Access denied. Admins only."));
    }

    // Validate password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    // Generate JWT token
    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    // Send response with cookie containing the token
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};