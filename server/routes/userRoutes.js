const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');
const Transaction = require('../models/transactionModel'); // Make sure this is imported
const Reminder = require('../models/reminderModel');

// @desc    Register a new user
// @route   POST /api/users/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body; // Add username

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      promptCount: user.promptCount,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        promptCount: user.promptCount,
        lastPromptDate: user.lastPromptDate, // Send lastPromptDate on login
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- NEW ROUTES FOR PROFILE MANAGEMENT ---

// @desc    Update user profile (name)
// @route   PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        promptCount: updatedUser.promptCount,
        lastPromptDate: updatedUser.lastPromptDate,
        token: req.headers.authorization.split(' ')[1], // Send back the same token
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update user password
// @route   PUT /api/users/change-password
router.put('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide current and new passwords.'})
  }

  try {
    const user = await User.findById(req.user.id);
    if (user && (await bcrypt.compare(currentPassword, user.password))) {
      user.password = newPassword; // The pre-save hook in userModel will hash this
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    console.error('Password Change Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete user account and all data
// @route   DELETE /api/users/profile
router.delete('/profile', protect, async (req, res) => {
  try {
    // 1. Delete all transactions associated with the user
    await Transaction.deleteMany({ user: req.user.id });

    // 2. Delete all reminders associated with the user
    await Reminder.deleteMany({ user: req.user.id });

    // 3. Delete the user themselves
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'User account and all associated data deleted successfully. We are sorry to see you go' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ message: 'Server error while deleting account.' });
  }
});

module.exports = router;

