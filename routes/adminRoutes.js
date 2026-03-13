import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import User from "../middleware/models/UserSchema.js";
import Loan from "../middleware/models/Loan.js";
import Repayment from "../middleware/models/Repayment.js";
import Transaction from "../middleware/models/Transactions.js";


const router = express.Router();

router.use(protect);

/* ==========================
   ADMIN ONLY MIDDLEWARE
========================== */
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

/* ==========================
   GET ALL USERS
========================== */
router.get("/users", adminOnly, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

/* ==========================
   APPROVE MEMBER
========================== */
router.put("/users/:id/approve", adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { approved: true });
  res.json({ message: "Member approved" });
});

/* ==========================
   DELETE MEMBER
========================== */
router.delete("/users/:id", adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Member deleted" });
});

/* ==========================
   GET ALL LOANS
========================== */
router.get("/loans", adminOnly, async (req, res) => {
  const loans = await Loan.find().populate("userId", "name email");
  res.json(loans);
});

/* ==========================
   APPROVE LOAN
========================== */
router.put("/loans/:id/approve", adminOnly, async (req, res) => {
  await Loan.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.json({ message: "Loan approved" });
});

/* ==========================
   REJECT LOAN
========================== */
router.put("/loans/:id/reject", adminOnly, async (req, res) => {
  await Loan.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ message: "Loan rejected" });
});

/* ==========================
   RECORD REPAYMENT
========================== */
// router.post("/repayments", adminOnly, async (req, res) => {
//   const { loanId, amount } = req.body;

//   const repayment = await Repayment.create({
//     loanId,
//     amount,
//   });

//   res.json(repayment);
// });

router.post("/repayments", adminOnly, async (req, res) => {
  const { loanId, amount } = req.body;

  const loan = await Loan.findById(loanId);

  if (!loan) {
    return res.status(404).json({ message: "Loan not found" });
  }

  await Repayment.create({
    loanId,
    amount,
  });

  if (amount >= loan.amount) {
    loan.status = "paid";
  }

  await loan.save();

  res.json({ message: "Repayment recorded" });
});

/* ==========================
   GET ALL TRANSACTIONS
========================== */

router.get("/transactions", adminOnly, async (req, res) => {
  try {

    const transactions = await Transaction
      .find()
      .populate("userId", "name email");

    res.json(transactions);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});


/* ==========================
   GET REPORT DATA
========================== */
router.get("/reports", adminOnly, async (req, res) => {
  const approvedLoans = await Loan.find({ status: "approved" });
  const repayments = await Repayment.find();

  const totalLoans = approvedLoans.reduce((sum, l) => sum + l.amount, 0);
  const totalRepayments = repayments.reduce((sum, r) => sum + r.amount, 0);

  res.json({
    totalLoans,
    totalRepayments,
    outstanding: totalLoans - totalRepayments,
  });
});

export default router;