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

// ✅ FIXED PORT (Frontend expects 5001)
const PORT = process.env.PORT || 5001;

// ✅ Connect DB safely
if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.log("⚠️ MONGODB_URI not set — skipping DB connection.");
}

// ✅ Middleware
app.use(express.json());
app.use(morgan('dev'));

// ✅ Improved CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175' // ✅ ADD THIS
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

// ✅ Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server running successfully 🚀'
  });
});

// ✅ Routes (clean structure)
app.use('/api/users', userRoutes);
app.use('/api/herbs', herbRoutes); // FIXED (was '/api')
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);

// ❌ 404 handler (NEW)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ❌ Global Error Handler (Improved)
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});