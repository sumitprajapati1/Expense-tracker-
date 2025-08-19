import express from 'express';
import { check, validationResult } from 'express-validator';
import auth from '../middlewares/auth.js';
import Expense from '../models/Expense.js';
import mongoose from 'mongoose';

const router = express.Router();

// POST api/expenses
// Add new expense
router.post(
  '/',
  [
    auth,
    [
      check('amount', 'Amount is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { amount, category, date, description } = req.body;

      const newExpense = new Expense({
        amount,
        category,
        date,
        description,
        user: req.user.id
      });

      const expense = await newExpense.save();
      res.json(expense);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// GET api/expenses
// Get all expenses for a month
router.get('/', auth, async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ msg: 'Month parameter is required' });
    }

    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/expenses/summary
// Get category-wise summary for a month
router.get('/summary', auth, async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ msg: 'Month parameter is required' });
    }

    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    const summary = await Expense.aggregate([
  {
    $match: {
      user: new mongoose.Types.ObjectId(req.user.id),
      date: { $gte: startDate, $lte: endDate }
    }
  },
  {
    $group: {
      _id: '$category',
      total: { $sum: '$amount' }
    }
  },
  {
    $project: {
      category: '$_id',
      total: 1,
      _id: 0
    }
  },
  {
    $sort: { total: -1 }
  }
]);


    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT api/expenses/:id
// Update expense
router.put('/:id', auth, async (req, res) => {
  const { amount, category, date, description } = req.body;

  const expenseFields = {};
  if (amount) expenseFields.amount = amount;
  if (category) expenseFields.category = category;
  if (date) expenseFields.date = date;
  if (description) expenseFields.description = description;

  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }

    // Make sure user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: expenseFields },
      { new: true }
    );

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE api/expenses/:id
// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }

    // Make sure user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Expense.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/expenses/export
// Export monthly expenses as JSON
router.get('/export', auth, async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ msg: 'Month parameter is required' });
    }

    const [year, monthNum] = month.split('-');
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=expenses-${month}.json`);

    res.send(JSON.stringify(expenses, null, 2));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;