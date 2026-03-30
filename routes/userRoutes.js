import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/email.js"; 
import User from "../middleware/models/UserSchema.js";

const router = express.Router();

// ---------------------- REGISTER USER ----------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "All fields are required",
        status: "01"
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
        status: "01"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "member",
      isVerified: false
    });

    // send verification email
    await sendVerificationEmail(newUser.email);

    res.status(201).json({
      status: "00",
      message: "User registered successfully. Please verify your email."
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      status: "01",
      message: "Server error"
    });
  }
});

router.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(404).json({ status: "01", message: "User not found" });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ status: "00", message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify Error:", err);
    res.status(400).json({ status: "01", message: "Invalid or expired token" });
  }
});

// ---------------------- LOGIN USER ----------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "01",
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: "01",
        message: "Invalid email or password"
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        status: "01",
        message: "Please verify your email first"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: "01",
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      status: "00",
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      status: "01",
      message: "Server error. Try again later."
    });
  }
});

export default router;