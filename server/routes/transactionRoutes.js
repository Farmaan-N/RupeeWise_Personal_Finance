const express = require('express');
const router = express.Router();
const Transaction = require('../models/transactionModel');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user's transactions
// @route   GET /api/transactions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { type, category, amount, date } = req.body;
    const transaction = new Transaction({
      user: req.user.id,
      type,
      category,
      amount,
      date,
    });
    const createdTransaction = await transaction.save();
    res.status(201).json(createdTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- NEW ROUTE ---
// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    // Check if transaction exists
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if the transaction belongs to the logged-in user
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// --- END NEW ROUTE ---

module.exports = router;