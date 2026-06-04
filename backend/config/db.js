// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI not set — skipping DB connection.');
      return false;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;


// mongodb+srv://priyanshuvishwakarma3133_db_user:<db_password>@cluster0.xqb5bsx.mongodb.net/?appName=Cluster0cd bac