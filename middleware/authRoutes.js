import express from "express";
import User from "../models/UserSchema.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    const user = await User.create({ name, email, phone, password, role });
    const token = jwt.sign({ id: user._id }, "SECRET_KEY");
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, "SECRET_KEY");
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;