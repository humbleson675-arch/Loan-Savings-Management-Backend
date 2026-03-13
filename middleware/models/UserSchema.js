
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "member", "treasurer"],
    default: "member",
  },

  approved: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

export default mongoose.model("User", userSchema);