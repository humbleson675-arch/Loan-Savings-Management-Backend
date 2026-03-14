// import express from "express";
// import Loan from "../middleware/models/Loan.js";
// import Deposit from "../middleware/models/Deposit.js";
// import { protect } from "../middleware/authmiddleware.js";
// import Transaction from "../middleware/models/Transactions.js";
// import User from "../middleware/models/UserSchema.js";

// const router = express.Router();

// router.use(protect);

// //GET FULL MEMBER DASHBOARD DATA

// router.get("/dashboard", async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const deposits = await Deposit.find({ userId });
//     const loans = await Loan.find({ userId });

//     const approvedDeposits = deposits.filter(d => d.status === "approved");
//     const approvedLoans = loans.filter(l => l.status === "approved");

//     const totalSavings = approvedDeposits.reduce((sum, d) => sum + d.amount, 0);
//     const totalLoanAmount = approvedLoans.reduce((sum, l) => sum + l.amount, 0);

//     const totalInterest = approvedLoans.reduce(
//       (sum, l) => sum + (l.amount * l.monthlyRate * l.duration),
//       0
//     );

//     const balance = totalLoanAmount + totalInterest;

//     const creditScore =
//       totalSavings > 0
//         ? Math.min(850, 300 + (totalSavings / 1000) * 50)
//         : 300;

//     res.json({
//       deposits,
//       loans,
//       totalSavings,
//       totalLoanAmount,
//       totalInterest,
//       balance,
//       creditScore,
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });



// router.post("/deposit", async (req, res) => {
//   try {

//     const { amount, method } = req.body;

//     if (!amount) {
//       return res.status(400).json({
//         message: "Amount is required"
//       });
//     }

//     const transaction = await Transaction.create({
//       userId: req.user.id,
//       type: "deposit",
//       amount,
//       method
//     });

//     res.json({
//       message: "Deposit successful",
//       transaction
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server error"
//     });
//   }
// });

// //REQUEST LOAN
// router.post("/loan", async (req, res) => {
//   try {
//     const { amount, duration } = req.body;

//     const loan = await Loan.create({
//       userId: req.user.id,
//       amount,
//       duration,
//       monthlyRate: 0.05,
//       status: "pending",
//     });

//     res.json({ message: "Loan request submitted", loan });

//   } catch (error) {
//     res.status(500).json({ message: "Error submitting loan" });
//   }
// });


// export default router;



// import express from "express";
// import Loan from "../middleware/models/Loan.js";
// import Deposit from "../middleware/models/Deposit.js";
// import { protect } from "../middleware/authmiddleware.js";
// import Transaction from "../middleware/models/Transactions.js";

// const router = express.Router();
// router.use(protect);

// // Helper function to calculate flat interest
// const calculateLoan = (amount) => {
//   const interest = amount * 0.15; // 15% flat
//   const totalRepayable = amount + interest;
//   return { interest, totalRepayable };
// };

// // GET MEMBER DASHBOARD
// router.get("/dashboard", async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const deposits = await Deposit.find({ userId });
//     const loans = await Loan.find({ userId });

//     const totalGroupSavings = deposits
//       .filter(d => d.type === "group_savings" && d.status === "approved")
//       .reduce((sum, d) => sum + d.amount, 0);

//     const totalLoanRepayment = deposits
//       .filter(d => d.type === "loan_repayment" && d.status === "approved")
//       .reduce((sum, d) => sum + d.amount, 0);

//     const approvedLoans = loans.filter(l => l.status === "approved");
//     const totalLoanAmount = approvedLoans.reduce((sum, l) => sum + l.amount, 0);
//     const totalInterest = approvedLoans.reduce((sum, l) => sum + l.interest, 0);

//     const balance = totalGroupSavings + totalLoanRepayment - (totalLoanAmount + totalInterest);

//     const creditScore = totalGroupSavings > 0 ? Math.min(850, 300 + (totalGroupSavings / 1000) * 50) : 300;

//     res.json({
//       deposits,
//       loans,
//       totalSavings: totalGroupSavings,
//       totalLoanAmount,
//       totalInterest,
//       balance,
//       creditScore
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST DEPOSIT
// router.post("/deposit", async (req, res) => {
//   try {
//     const { amount, method, type } = req.body;
//     if (!amount || !type) return res.status(400).json({ message: "Amount and type are required" });

//     const deposit = await Deposit.create({
//       userId: req.user.id,
//       amount,
//       method,
//       type,
//       status: "approved",
//     });

//     res.json({ message: "Deposit successful", deposit });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST LOAN
// router.post("/loan", async (req, res) => {
//   try {
//     const { amount, duration } = req.body;
//     if (!amount || !duration) return res.status(400).json({ message: "Amount and duration required" });

//     const { interest, totalRepayable } = calculateLoan(amount);

//     const loan = await Loan.create({
//       userId: req.user.id,
//       amount,
//       duration,
//       interest,
//       totalRepayable,
//       status: "pending",
//     });

//     res.json({ message: "Loan request submitted", loan });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error submitting loan" });
//   }
// });

// export default router;




import express from "express";
import { protect, authorizeRole } from "../middleware/authmiddleware.js";
import Transaction from "../middleware/models/Transactions.js";
import Loan from "../middleware/models/Loan.js";

const router = express.Router();

// Protect all routes for members
router.use(protect);
router.use(authorizeRole("member"));

// Member dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const userId = req.user._id;

    const totalSavings = await Transaction.aggregate([
      { $match: { userId, type: "deposit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalLoanAmount = await Loan.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalSavings: totalSavings[0]?.total || 0,
      totalLoanAmount: totalLoanAmount[0]?.total || 0,
      balance: (totalSavings[0]?.total || 0) - (totalLoanAmount[0]?.total || 0),
      totalInterest: 0,
      creditScore: 75,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Deposit
router.post("/deposit", async (req, res) => {
  try {
    const { amount, type, method } = req.body;
    const deposit = await Transaction.create({
      userId: req.user._id,
      amount,
      type: type || "deposit",
      method: method || "mpesa",
    });
    res.json(deposit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Deposit failed" });
  }
});

// Request Loan
router.post("/loan", async (req, res) => {
  try {
    const { amount, duration } = req.body;

    if (!amount || !duration) {
      return res.status(400).json({ message: "Amount and duration are required" });
    }

    // Calculate interest (example: 5% per week)
    const interestRate = 0.05;
    const interest = amount * interestRate * Number(duration);

    const totalRepayable = amount + interest;

    const loan = await Loan.create({
      userId: req.user._id,
      amount,
      duration: Number(duration),
      interest,
      totalRepayable,
      status: "pending",
    });

    res.status(201).json({ message: "Loan requested successfully", loan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Loan request failed" });
  }
});

// Withdraw
router.post("/withdraw", async (req, res) => {
  try {
    const { amount } = req.body;

    const deposits = await Transaction.aggregate([
      { $match: { userId: req.user._id, type: "deposit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const withdrawals = await Transaction.aggregate([
      { $match: { userId: req.user._id, type: "withdraw" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const balance = (deposits[0]?.total || 0) - (withdrawals[0]?.total || 0);

    if (amount > balance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const withdraw = await Transaction.create({
      userId: req.user._id,
      amount,
      type: "withdraw",
    });

    res.json(withdraw);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Withdraw failed" });
  }
});

export default router;