import express from "express";
import {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} from "../controllers/expense.controllers.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect); // 🔐 MUST be here

router.post("/", createExpense);
router.get("/", getExpenses);
router.delete("/:id", deleteExpense);
router.put("/:id", updateExpense);

export default router;