// createPremPaswan.js
// Script to create Prem Paswan as Content Creator

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

async function createPremPaswan() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if user already exists
    const email = 'prempaswan@gmail.com';
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('⚠️ User already exists!');
      console.log('📋 Existing User Details:');
      console.log('   - Email:', existingUser.email);
      console.log('   - Username:', existingUser.username);
      console.log('   - Role:', existingUser.role);
      
      // Ask if you want to update
      console.log('\n🔄 Updating user details and password...');
      
      const hashedPassword = await bcrypt.hash('prempaswan', 10);
      existingUser.username = 'Prem Paswan';
      existingUser.password = hashedPassword;
      existingUser.role = 'content-creator';
      
      await existingUser.save();
      console.log('✅ User updated successfully!');
      
    } else {
      console.log('Creating new Content Creator...\n');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('prempaswan', 10);
      
      // Create new user
      const newUser = new User({
        username: 'Prem Paswan',
        email: 'prempaswan@gmail.com',
        password: hashedPassword,
        role: 'content-creator',
        bookmarks: []
      });
      
      await newUser.save();
      console.log('✅ Content Creator created successfully!');
    }
    
    // Verify the user
    const user = await User.findOne({ email });
    console.log('\n📋 Final User Details:');
    console.log('   - Username:', user.username);
    console.log('   - Email:', user.email);
    console.log('   - Role:', user.role);
    console.log('   - Password Hash:', user.password.substring(0, 30) + '...');
    
    // Test password
    console.log('\n🔐 Testing password...');
    const isMatch = await bcrypt.compare('prempaswan', user.password);
    console.log('   Password "prempaswan" matches:', isMatch ? '✅ YES' : '❌ NO');
    
    // Show all users
    console.log('\n📊 All users in database:');
    const allUsers = await User.find({}, 'email username role');
    allUsers.forEach((u, index) => {
      console.log(`   ${index + 1}. ${u.email} - ${u.username} (${u.role})`);
    });
    
    console.log('\n✅ Setup complete!');
    console.log('\n🎯 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Email:    prempaswan@gmail.com');
    console.log('   Password: prempaswan');
    console.log('   Role:     Content Creator');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

createPremPaswan();