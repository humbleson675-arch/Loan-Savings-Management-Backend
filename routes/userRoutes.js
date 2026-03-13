import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../middleware/models/UserSchema.js"

const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  try {
    console.log("the resgister request is" , req.body)
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required", status: "01"});

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" , status: "01" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role: role || "member" });

    res.status(201).json({ message: "User registered successfully" , status: "00"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" , status: "01"});
  }
});

// LOGIN USER 
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        status: "01",
        message: "email and password are required", 
      });
    }

    router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      status: "01",
      message: "User not found",
    });
  }

  return res.json({
    status: "00",
    message: "Password reset link sent to email",
  });
});

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: "01",
        message: "Invalid email or password",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: "01",
        message: "Invalid email or password",
      });
    }

    // Log the user's role for debugging
    console.log("User role:", user.role); // <-- added here

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send success response
    return res.status(200).json({
      status: "00",
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      status: "01",
      message: "Server error. Please try again later.",
    });
  }
});
export default router;