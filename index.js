// index.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Load env FIRST
dotenv.config();

// Routes
import userRoutes from "./routes/userRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import treasurerRoutes from "./routes/treasurerRoutes.js";

const app = express();

// Environment variables
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

//  Debug (REMOVE LATER)
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/treasurer", treasurerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/users", userRoutes);

//  Check Mongo URL
if (!MONGO_URL) {
  console.error(" MONGO_URL is not defined in .env");
  process.exit(1);
}

// Connect MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.log(" MongoDB error:", err));

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});