const mongoose = require('mongoose');
require('dotenv').config();

async function testDB() {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ Connected: ${conn.connection.host}`);
    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

testDB();