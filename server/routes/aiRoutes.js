const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateFinancialInsights } = require('../controllers/aiController');

// @desc    Generate AI financial insights
// @route   GET /api/ai/insights
// @access  Private
// server/routes/aiRoutes.js
router.post('/chat', protect, generateFinancialInsights); // Changed from GET /insights to POST /chat

module.exports = router;
