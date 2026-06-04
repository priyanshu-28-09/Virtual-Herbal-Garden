// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ MONGO_URI or MONGODB_URI not set — skipping DB connection.');
    return {
      connected: false,
      host: null,
      error: 'MONGO_URI not configured',
    };
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return {
      connected: true,
      host: conn.connection.host,
      error: null,
    };
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    return {
      connected: false,
      host: null,
      error: error.message,
    };
  }
};

module.exports = connectDB;