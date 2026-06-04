const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();

const connectDB = require('./config/db');
const seedHerbs = require('./seed/seedHerbs');
const userRoutes = require('./routes/userRoutes');
const herbRoutes = require('./routes/herbRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

let dbStatus = {
  connected: false,
  host: null,
  error: null,
  checkedAt: null,
};

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

app.use(express.json());
app.use(morgan('dev'));

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5174',
  'http://127.0.0.1:5174'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy blocked this origin.'));
      }
    },
    credentials: true,
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Virtual Herbal Garden backend is running',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend health check passed',
    database: {
      connected: dbStatus.connected,
      host: dbStatus.host,
      error: dbStatus.error,
      checkedAt: dbStatus.checkedAt,
    },
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/users', userRoutes);
app.use('/api/herbs', herbRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Express error handler:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: err.stack ? err.stack.split('\n')[0] : undefined,
  });
});

const startServer = async () => {
  try {
    const result = await connectDB();
    dbStatus = {
      connected: result.connected,
      host: result.host || null,
      error: result.error || null,
      checkedAt: new Date().toISOString(),
    };

    if (result.connected) {
      await seedHerbs();
    } else {
      console.warn('⚠️ MongoDB could not connect. Backend is running in limited mode.');
    }

    app.listen(PORT, () => {
      console.log(`✅ Backend running on http://localhost:${PORT}`);
      if (dbStatus.connected) {
        console.log('✅ MongoDB connected successfully');
      } else {
        console.log('⚠️ MongoDB connection not available. Check MONGO_URI and database status.');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();