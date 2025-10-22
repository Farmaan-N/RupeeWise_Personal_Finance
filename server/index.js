// server/index.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Make sure this is imported
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes'); 
const aiRoutes = require('./routes/aiRoutes'); 
const reminderRoutes = require('./routes/reminderRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors()); // << MUST BE HERE
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.use('/api/users', userRoutes); // Routes are used AFTER cors
app.use('/api/transactions', transactionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reminders', reminderRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));