// verifyAndCreateUser.js
// Run this script to check if user exists and create if needed

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Herb" }]
});

const User = mongoose.model('User', userSchema);

async function verifyAndCreateUser() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if user exists
    const email = 'creator@test.com';
    let user = await User.findOne({ email });

    if (user) {
      console.log('✅ User EXISTS in database!');
      console.log('📋 User Details:');
      console.log('   - Email:', user.email);
      console.log('   - Username:', user.username);
      console.log('   - Role:', user.role);
      console.log('   - Password Hash:', user.password.substring(0, 30) + '...');
      
      // Test password
      console.log('\n🔐 Testing password...');
      const isMatch = await bcrypt.compare('Password123!', user.password);
      console.log('   Password "Password123!" matches:', isMatch ? '✅ YES' : '❌ NO');
      
      if (!isMatch) {
        console.log('\n⚠️ Password does NOT match!');
        console.log('Let me update the password...');
        
        const hashedPassword = await bcrypt.hash('Password123!', 10);
        user.password = hashedPassword;
        await user.save();
        
        console.log('✅ Password updated successfully!');
        
        // Test again
        const isMatchNow = await bcrypt.compare('Password123!', user.password);
        console.log('   Password now matches:', isMatchNow ? '✅ YES' : '❌ NO');
      }
      
    } else {
      console.log('❌ User does NOT exist in database');
      console.log('Creating user now...\n');
      
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      const newUser = new User({
        username: 'Test Creator',
        email: 'creator@test.com',
        password: hashedPassword,
        role: 'content-creator',
        bookmarks: []
      });
      
      await newUser.save();
      console.log('✅ User created successfully!');
      console.log('📋 New User Details:');
      console.log('   - Email:', newUser.email);
      console.log('   - Username:', newUser.username);
      console.log('   - Role:', newUser.role);
    }
    
    // Show all users
    console.log('\n📊 All users in database:');
    const allUsers = await User.find({}, 'email username role');
    allUsers.forEach((u, index) => {
      console.log(`   ${index + 1}. ${u.email} - ${u.username} (${u.role})`);
    });
    
    console.log('\n✅ Verification complete!');
    console.log('🎯 Now try logging in with:');
    console.log('   Email: creator@test.com');
    console.log('   Password: Password123!');
    console.log('   Role: Content Creator');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

verifyAndCreateUser();
