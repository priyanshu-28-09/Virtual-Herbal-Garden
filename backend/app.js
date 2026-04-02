const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const herbRoutes = require('./routes/herbRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();

const app = express();

// CORS configuration for development environment
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'userid'],
};

app.use(cors(corsOptions));

// For logging HTTP requests (useful for development)
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// 🆕 Serve static files (images and videos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route (doesn't require DB)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api', herbRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling middleware for unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong, please try again later' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});