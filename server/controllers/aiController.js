const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const axios = require('axios');

const generateFinancialInsights = async (req, res) => {
  const { history } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const lastPromptDay = user.lastPromptDate ? new Date(user.lastPromptDate).setHours(0, 0, 0, 0) : null;

    if (today !== lastPromptDay) {
      user.promptCount = 0;
    }

    if (user.promptCount >= 5) {
      return res.status(429).json({ message: "You have reached your daily limit of 5 questions. Please try again tomorrow." });
    }

    // --- Financial Analysis Logic (No Changes Here) ---
    const transactions = await Transaction.find({ user: req.user.id });
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const savings = totalIncome - totalExpenses;
    const recentExpenses = transactions
      .filter(t => t.type === 'expense')
      .slice(0, 10)
      .map(t => ({ category: t.category, amount: t.amount }));

    // --- NEW & IMPROVED System Prompt with Formatting Rules ---
    const systemPrompt = {
      role: "system",
      content: `You are FinBot, a helpful financial suggestion bot from India.

  Here is the user's financial summary:
  - Total Income: ₹${totalIncome.toLocaleString('en-IN')}
  - Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}
  - Balance/Savings: ₹${savings.toLocaleString('en-IN')}
  - Recent expenses: ${JSON.stringify(recentExpenses)}

  Your primary role is to provide educational suggestions based on this data, focusing on the **Indian financial context**.

  The user has ${5 - user.promptCount} questions left for today.

  ------------------------------------------
  ✨ **FORMATTING RULES (STRICTLY FOLLOW THESE):**
  ------------------------------------------
  - Give answers based on the questions asked by user, using the financial data provided.
  ✅ **Structure & Layout**
  - Use proper Markdown formatting with section dividers "---" between major sections.
  - Add **blank lines** between paragraphs, bullets, and sections for readability.

  ✅ **Headings & Lists**
  - Use level-3 headings for sections:  
    "### 🏦 1. Emergency Fund (₹50,000 — 3 months’ expenses)"
  - Each section must contain **2–3 short bullet points**, each starting with a dash (-).
  - Keep sentences short and informative.
  - Use relevant emojis before section numbers (🏦, 📈, 💳, 📊, 🧓, 🎉, ✅).

  ✅ **Styling**
  - Highlight financial terms in **bold** (like **SIPs**, **PPF**,**ETF's**, **Mutual Funds**, **Bonds**, **Index Funds**).
  - Use ~tildes~ for approximate values (~7–8%).
  - Maintain a friendly and educational tone.

  ✅ **Closing Section**
  - Always include a section titled "### ✅ Next Steps" before the disclaimer.
  - After the final section, leave **3–4 blank lines**.
  - End with the disclaimer, formatted exactly like this:

  ⚠️ **Disclaimer:** I am an AI bot and this is not financial advice.  
  Please consult a professional financial advisor.
  `
    };


    const body = {
      model: "meta-llama/llama-3.1-70b-instruct", // Note: Changed to a more recent model
      messages: [systemPrompt, ...history]
    };

    const config = {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': `${process.env.YOUR_SITE_URL || 'http://localhost'}`, // Added fallback
        'X-Title': 'Personal Finance Hub',
      }
    };

    const { data } = await axios.post('https://openrouter.ai/api/v1/chat/completions', body, config);

    user.promptCount += 1;
    user.lastPromptDate = new Date();
    await user.save();

    res.json(data.choices[0].message);

  } catch (error) {
    console.error('AI chat error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error communicating with AI.' });
  }
};

module.exports = { generateFinancialInsights };
