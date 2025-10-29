// server/index.js (WITH node-cron SCHEDULER)

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const aiRoutes = require('./routes/aiRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const cron = require('node-cron'); // Import node-cron
const User = require('./models/userModel'); // Import User model

// Load .env ONLY for local development. Render uses its own dashboard variables.
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  console.log('LOADING .env file for local development.');
}

connectDB(); // Connect to MongoDB

const app = express();

// Trust proxy - important for Render
app.set('trust proxy', 1);

// --- START CORS CONFIGURATION ---

const allowedOrigins = [
  process.env.YOUR_SITE_URL,
  process.env.NETLIFY_SITE_URL,
];

const allowed = new Set(
  allowedOrigins
    .filter(Boolean)
    .map(url => url.replace(/\/$/, ''))
);

console.log('SERVER STARTING: Allowed Origins Set ->', allowed);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        console.log('CORS: Request has no origin (e.g., Postman). Allowed.');
        return callback(null, true);
      }
      console.log('CORS: Incoming Request Origin ->', origin);
      const originWithoutSlash = origin.replace(/\/$/, '');
      if (allowed.has(originWithoutSlash)) {
        console.log('CORS: Origin IS in the allowed set. Allowing request.');
        callback(null, true);
      } else {
        console.error(`CORS: Blocked Origin -> ${origin}. It is NOT in the allowed set:`, allowed);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
// --- END CORS CONFIGURATION ---


app.use(express.json({ limit: '1mb' })); // Middleware to parse JSON bodies

// --- START CRON JOB SCHEDULING ---
// Schedule to run every day at midnight IST ('0 0 * * *' in Asia/Kolkata timezone)
cron.schedule('0 0 * * *', async () => {
  console.log('CRON: Running daily prompt count reset (Midnight IST)...');
  try {
    const result = await User.updateMany(
      {}, // Update all users that match the filter (empty filter means all)
      { $set: { promptCount: 0 } } // Set their promptCount back to 0
    );
    console.log(`CRON: Successfully reset prompt count for ${result.modifiedCount} users.`);
  } catch (error) {
    console.error('CRON: Error resetting prompt counts:', error);
  }
}, {
  scheduled: true,
  timezone: "Asia/Kolkata" // Set the timezone to Indian Standard Time
});
console.log('CRON: Daily prompt reset job scheduled for midnight IST.');
// --- END CRON JOB SCHEDULING ---


// Health check and basic routes
app.get('/', (req, res) => res.send('Server is healthy!'));
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the Rupee Wise backend!' });
});

// API routes - Must come AFTER CORS middleware
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reminders', reminderRoutes);

// 404 Handler - If no routes matched
app.use((req, res) => res.status(404).json({ error: 'API route not found' }));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS Error: Origin not allowed.' });
  }
  res.status(500).json({ message: 'Something went wrong on the server!' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server successfully started and listening on port ${PORT}`));