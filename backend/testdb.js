const mongoose = require('mongoose');
require('dotenv').config();

async function testDB() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(uri);
    console.log(`✅ Connected: ${conn.connection.host}`);
    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

testDB();