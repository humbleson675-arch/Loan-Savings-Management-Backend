import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan" },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["deposit", "repayment", "fine", "contribution"], required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", transactionSchema);