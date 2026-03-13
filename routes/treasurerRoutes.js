/// routes/treasurerRoutes.js
// import express from "express";
// import { protect, authorizeRole } from "../middleware/authmiddleware.js"; 

// const router = express.Router();

// // Protect all routes for treasurer
// router.use(protect);
// router.use(authorizeRole("treasurer"));

// // GET all users
// router.get("/users", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // GET all loans
// router.get("/loans", async (req, res) => {
//   try {
//     const loans = await Loan.find();
//     res.json(loans);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // GET all repayments
// router.get("/repayments", async (req, res) => {
//   try {
//     const repayments = await Transaction.find({ type: "repayment" });
//     res.json(repayments);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // GET all transactions
// router.get("/transactions", async (req, res) => {
//   try {
//     const transactions = await Transaction.find();
//     res.json(transactions);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // POST record repayment
// router.post("/repayments", async (req, res) => {
//   try {
//     const { loanId, amount } = req.body;
//     const loan = await Loan.findById(loanId);
//     if (!loan) return res.status(404).json({ message: "Loan not found" });

//     const repayment = new Transaction({
//       loanId,
//       userId: loan.userId,
//       amount,
//       type: "repayment",
//     });

//     await repayment.save();
//     res.json(repayment);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });


// // GET financial report
// router.get("/financial-report", async (req, res) => {
//   try {
//     const loans = await Loan.find({ status: "approved" });
//     const transactions = await Transaction.find();

//     const totalLoans = loans.reduce((sum, l) => sum + l.amount, 0);
//     const totalRepayments = transactions
//       .filter((t) => t.type === "repayment")
//       .reduce((sum, r) => sum + r.amount, 0);
//     const totalFines = transactions
//       .filter((t) => t.type === "fine")
//       .reduce((sum, f) => sum + f.amount, 0);
//     const totalContributions = transactions
//       .filter((t) => t.type === "contribution")
//       .reduce((sum, c) => sum + c.amount, 0);
//     const outstandingBalance = totalLoans - totalRepayments + totalFines;

//     res.json({
//       totalLoans,
//       totalRepayments,
//       totalFines,
//       totalContributions,
//       outstandingBalance,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });
// // POST record fine
// router.post("/fines", async (req, res) => {
//   try {
//     const { loanId, amount } = req.body;
//     const loan = await Loan.findById(loanId);
//     if (!loan) return res.status(404).json({ message: "Loan not found" });

//     const fine = new Transaction({
//       loanId,
//       userId: loan.userId,
//       amount,
//       type: "fine",
//     });

//     await fine.save();
//     res.json(fine);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // POST record contribution
// router.post("/contributions", async (req, res) => {
//   try {
//     const { userId, amount } = req.body;
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const contribution = new Transaction({
//       userId,
//       amount,
//       type: "contribution",
//     });

//     await contribution.save();
//     res.json(contribution);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// export default router;


import express from "express";
import { protect, authorizeRole } from "../middleware/authmiddleware.js";
import User from "../middleware/models/UserSchema.js";
import Loan from "../middleware/models/Loan.js";
import Transaction from "../middleware/models/Transactions.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("treasurer"));

// Get all users
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get all loans
router.get("/loans", async (req, res) => {
  const loans = await Loan.find();
  res.json(loans);
});

// Get all repayments
router.get("/repayments", async (req, res) => {
  const repayments = await Transaction.find({ type: "repayment" });
  res.json(repayments);
});

// Get all transactions
router.get("/transactions", async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});

// Record repayment
router.post("/repayments", async (req, res) => {
  const { loanId, amount } = req.body;
  const loan = await Loan.findById(loanId);
  if (!loan) return res.status(404).json({ message: "Loan not found" });

  const repayment = await Transaction.create({ loanId, userId: loan.userId, amount, type: "repayment" });
  res.json(repayment);
});

// Record fine
router.post("/fines", async (req, res) => {
  const { loanId, amount } = req.body;
  const loan = await Loan.findById(loanId);
  if (!loan) return res.status(404).json({ message: "Loan not found" });

  const fine = await Transaction.create({ loanId, userId: loan.userId, amount, type: "fine" });
  res.json(fine);
});

// Record contribution
router.post("/contributions", async (req, res) => {
  const { userId, amount } = req.body;
  const contribution = await Transaction.create({ userId, amount, type: "contribution" });
  res.json(contribution);
});

// Financial report
router.get("/financial-report", async (req, res) => {
  const loans = await Loan.find({ status: "approved" });
  const transactions = await Transaction.find();
  const totalLoans = loans.reduce((sum, l) => sum + l.amount, 0);
  const totalRepayments = transactions.filter(t => t.type === "repayment").reduce((sum, r) => sum + r.amount, 0);
  const totalFines = transactions.filter(t => t.type === "fine").reduce((sum, f) => sum + f.amount, 0);
  const totalContributions = transactions.filter(t => t.type === "contribution").reduce((sum, c) => sum + c.amount, 0);
  const outstandingBalance = totalLoans - totalRepayments + totalFines;
  res.json({ totalLoans, totalRepayments, totalFines, totalContributions, outstandingBalance });
});

export default router;