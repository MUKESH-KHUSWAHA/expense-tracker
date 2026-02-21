import Expense from "../models/Expense.js";

/**
 * CREATE EXPENSE
 */
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      user: req.user._id, // ✅ OWNER
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET EXPENSES (USER-SCOPED + FILTER + PAGINATION)
 * Always filters by req.user._id so users only see their own expenses.
 */
export const getExpenses = async (req, res) => {
  try {
    const { category, page = 1, limit = 5 } = req.query;

    // SaaS-level isolation: only return expenses owned by logged-in user
    const filter = { user: req.user._id };

    if (category) {
      filter.category = category;
    }

    const skip = (page - 1) * limit;

    const expenses = await Expense.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Expense.countDocuments(filter);

    res.status(200).json({
      success: true,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE EXPENSE (ONLY OWNER)
 * Returns 403 if expense exists but belongs to another user.
 */
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Ownership check: 403 if user tries to delete another user's expense (or legacy doc without user)
    if (!expense.user || expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this expense",
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE EXPENSE (ONLY OWNER)
 * Returns 403 if expense exists but belongs to another user.
 */
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Ownership check: 403 if user tries to update another user's expense (or legacy doc without user)
    if (!expense.user || expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this expense",
      });
    }

    expense.title = title ?? expense.title;
    expense.amount = amount ?? expense.amount;
    expense.category = category ?? expense.category;
    expense.date = date ?? expense.date;

    const updatedExpense = await expense.save();

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};