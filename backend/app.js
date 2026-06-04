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
const seedHerbs = require('./seed/seedHerbs');

const startServer = async () => {
  const dbConnected = await connectDB();

  if (dbConnected) {
    await seedHerbs();
  } else {
    console.log("⚠️ Running without MongoDB. API plant data will use fallback samples if needed.");
  }

  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
};

// ✅ Middleware
app.use(express.json());
app.use(morgan('dev'));

// ✅ Simple CORS for local frontend
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
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

// Root
app.get('/', (req, res) => {
  res.status(200).send('Backend is running');
});

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
startServer();