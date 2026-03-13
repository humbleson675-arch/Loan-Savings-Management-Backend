import mongoose from "mongoose";

const repaymentSchema = new mongoose.Schema(
{
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
  },

  amount: {
    type: Number,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  }

});

export default mongoose.model("Repayment", repaymentSchema);