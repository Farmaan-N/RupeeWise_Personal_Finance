// server/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const aiRoutes = require('./routes/aiRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

dotenv.config();
connectDB();

const app = express();

// Trust proxy (important when you add Nginx/HTTPS later)
app.set('trust proxy', 1);

// CORS: allow your Netlify site and local dev
const allowed = new Set(
  [
    process.env.YOUR_SITE_URL || 'https://rupeewisefin.netlify.app',
  ]
    .filter(Boolean)
    .map((s) => s.replace(/\/$/, ''))
);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow curl/Postman
      const o = origin.replace(/\/$/, '');
      return cb(null, allowed.has(o));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// Root + health (must be above routers)
app.get('/', (req, res) => res.send('OK'));
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Example hello
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reminders', reminderRoutes);

// 404 (keep last)
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
