const express = require('express');
const router = express.Router();
const Reminder = require('../models/reminderModel');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all reminders for a user
// @route   GET /api/reminders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ date: 'asc' });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a new reminder
// @route   POST /api/reminders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, date, type } = req.body;
    const reminder = new Reminder({
      user: req.user.id,
      title,
      date,
      type,
    });
    const createdReminder = await reminder.save();
    res.status(201).json(createdReminder);
  } catch (error) {
    res.status(400).json({ message: 'Invalid reminder data' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (reminder && reminder.user.toString() === req.user.id) {
      reminder.title = req.body.title || reminder.title;
      reminder.date = req.body.date || reminder.date;
      reminder.type = req.body.type || reminder.type;
      const updatedReminder = await reminder.save();
      res.json(updatedReminder);
    } else {
      res.status(404).json({ message: 'Reminder not found or user not authorized' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid reminder data' });
  }
});

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (reminder && reminder.user.toString() === req.user.id) {
      await reminder.deleteOne();
      res.json({ message: 'Reminder removed' });
    } else {
      res.status(404).json({ message: 'Reminder not found or user not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;