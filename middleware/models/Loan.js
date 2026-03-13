// import mongoose from "mongoose";

// const loanSchema = new mongoose.Schema(
// {
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },

//   amount: {
//     type: Number,
//     required: true,
//   },

//   status: {
//     type: String,
//     enum: ["pending", "approved", "rejected", "paid"],
//     default: "pending",
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
// });

// export default mongoose.model("Loan", loanSchema);

import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  duration: { type: Number, required: true }, // in weeks or months
  interest: { type: Number, required: true },
  totalRepayable: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "repaid"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Loan = mongoose.model("Loan", loanSchema);
export default Loan;