// server/index.js (CORRECTED + DEBUG LOGS)

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const aiRoutes = require('./routes/aiRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

// Load .env ONLY for local development. Render uses its own dashboard variables.
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  console.log('LOADING .env file for local development.');
}

connectDB();

const app = express();

// Trust proxy - important for Render
app.set('trust proxy', 1);

// --- START CORS CONFIGURATION ---

// Define the origins allowed to access the backend
const allowedOrigins = [
  process.env.YOUR_SITE_URL,      // Should be your Netlify URL on Render
  process.env.NETLIFY_SITE_URL,   // Should also be your Netlify URL on Render
  // Add localhost for local development if needed, but Render ignores .env
  // 'http://localhost:5173'
];

// Clean up the list: remove undefined/null, remove trailing slashes
const allowed = new Set(
  allowedOrigins
    .filter(Boolean) // Remove undefined/null entries
    .map(url => url.replace(/\/$/, '')) // Remove trailing slash if any
);

// Log the final set of allowed origins when the server starts
console.log('SERVER STARTING: Allowed Origins Set ->', allowed);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('CORS: Request has no origin (e.g., Postman). Allowed.');
        return callback(null, true);
      }

      console.log('CORS: Incoming Request Origin ->', origin);
      const originWithoutSlash = origin.replace(/\/$/, ''); // Clean incoming origin

      if (allowed.has(originWithoutSlash)) {
        console.log('CORS: Origin IS in the allowed set. Allowing request.');
        callback(null, true); // Allow the request
      } else {
        console.error(`CORS: Blocked Origin -> ${origin}. It is NOT in the allowed set:`, allowed);
        callback(new Error('Not allowed by CORS')); // Block the request
      }
    },
    credentials: true, // Allow cookies/authorization headers
  })
);
// --- END CORS CONFIGURATION ---


app.use(express.json({ limit: '1mb' })); // Middleware to parse JSON bodies

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

// Global Error Handler (Optional but good practice)
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  // Specifically handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS Error: Origin not allowed.' });
  }
  res.status(500).json({ message: 'Something went wrong on the server!' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server successfully started and listening on port ${PORT}`));