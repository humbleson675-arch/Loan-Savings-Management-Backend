// index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import treasurerRoutes from "./routes/treasurerRoutes.js"

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/treasurer", treasurerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/users", userRoutes);


// MongoDB connection
const mongoURI = process.env.MONGO_URL;

 if (!MONGO_URL) {
 console.error("Error: MONGO_URI is not defined in your .env file");
  process.exit(1); // Stop server if URI missing
 }

mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
