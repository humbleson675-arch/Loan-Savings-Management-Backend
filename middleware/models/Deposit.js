// import mongoose from "mongoose";

// const depositSchema = new mongoose.Schema(
// {
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },

//   amount: {
//     type: Number,
//     required: true
//   },

//   method: {
//     type: String,
//     enum: ["mpesa", "airtel", "paypal"],
//     required: true
//   },

//   status: {
//     type: String,
//     default: "completed"
//   }
// },
// { timestamps: true }
// );

// export default mongoose.model("Deposit", depositSchema);

import mongoose from "mongoose";

const depositSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["group_savings", "loan_repayment"], required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["mpesa", "airtel", "paypal"], required: true },
  status: { type: String, enum: ["pending", "approved"], default: "approved" },
  createdAt: { type: Date, default: Date.now },
});

const Deposit = mongoose.model("Deposit", depositSchema);
export default Deposit;