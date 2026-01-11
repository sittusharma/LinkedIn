import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;

    // Check if email exists
    let existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Check if username exists
    let existUsername = await User.findOne({ userName });
    if (existUsername) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    // Password length validation
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    // Hash password
    let hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });

    // Generate token
    let token = await genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // fixed
    });

    // Send success response
    return res.status(201).json({
      message: "Signup successful",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ message: `Signup failed: ${error.message}` });
  }
};
