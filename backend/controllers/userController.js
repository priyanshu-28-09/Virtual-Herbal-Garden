const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Herb = require("../models/herbModel");
const mongoose = require("mongoose");
const { logActivity } = require("../utils/activityLogger");

// User Registration
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE ADMIN USER
exports.createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({
      username: username || "Admin",
      email: email,
      password: hashedPassword,
      role: "admin"
    });

    await adminUser.save();
    
    res.status(201).json({ 
      message: "Admin user created successfully",
      user: {
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE CONTENT CREATOR
exports.createContentCreator = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const creatorUser = new User({
      username: username || "Content Creator",
      email: email,
      password: hashedPassword,
      role: "content-creator"
    });

    await creatorUser.save();
    
    res.status(201).json({ 
      message: "Content Creator user created successfully",
      user: {
        username: creatorUser.username,
        email: creatorUser.email,
        role: creatorUser.role
      }
    });
  } catch (error) {
    console.error("Error creating content creator:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// User Login - FIXED VERSION WITH ISACTIVE CHECK
exports.login = async (req, res) => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      return res.status(503).json({ message: "Service temporarily unavailable: database not configured" });
    }
    
    let { email, password, role } = req.body;
    
    // Normalize email
    email = email?.trim().toLowerCase();
    
    // Normalize role mapping
    const roleMap = {
      'admin': 'admin',
      'Admin': 'admin',
      'content-creator': 'content-creator',
      'content creator': 'content-creator',
      'Content Creator': 'content-creator',
      'contentcreator': 'content-creator',
      'ContentCreator': 'content-creator',
      'user': 'user',
      'User': 'user'
    };
    
    const normalizedRole = role ? roleMap[role] || role.toLowerCase().replace(/\s+/g, '-') : null;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    
    // ✅ CHECK IF USER IS BLOCKED - IMPORTANT!
    if (user.isActive === false) {
      return res.status(403).json({ 
        message: "Your account has been blocked. Please contact support." 
      });
    }
    
    // Check if role matches
    if (normalizedRole && user.role !== normalizedRole) {
      return res.status(400).json({ 
        message: `This email is registered as ${user.role}, not ${normalizedRole}. Please select the correct role.` 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );
    
    // Return success
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      bookmarks: user.bookmarks,
      isActive: user.isActive
    };

    req.user = user;
    await logActivity('user_login', req, {
      targetName: user.username,
    });
    
    res.status(200).json({ token, user: userResponse });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    
    if (error.message && /E(host|failed|failed to connect)|Mongo|topology|ECONNREFUSED/i.test(error.message)) {
      return res.status(503).json({ message: "Service temporarily unavailable: database error" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// User Logout
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const userdata = await User.findOne({ _id: userId }).select("-password");

    if (!userdata) {
      return res.status(404).json({ message: "User not found in the database" });
    }

    res.status(200).json(userdata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// bookmark
exports.bookmark = async (req, res) => {
  try {
    const { plantId } = req.body;
    const userId = req.user?._id || req.userId;

    if (!userId || !plantId) {
      return res.status(400).json({ message: "User ID and Herb ID are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.bookmarks.includes(plantId)) {
      return res.status(400).json({ message: "Herb already bookmarked" });
    }

    user.bookmarks.push(plantId);
    await user.save();

    res.status(200).json({ message: "Bookmark added successfully", bookmarks: user.bookmarks });
  } catch (error) {
    console.error("Error in bookmark function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.removebookmark = async (req, res) => {
  try {
    const { plantId } = req.body;
    const userId = req.user?._id || req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== plantId);

    await user.save();

    res.json({ success: true, message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Error in removeBookmark:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getCount = async (req, res) => {
  try {
    const contentCreatorCount = await User.countDocuments({ role: 'content-creator' });
    const userCount = await User.countDocuments({ role: 'user' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    res.status(200).json({
      contentCreators: contentCreatorCount,
      users: userCount,
      admins: adminCount
    });
  } catch (err) {
    console.error('Error in getCount:', err);
    res.status(500).json({ error: 'Failed to fetch counts' });
  }
};

// fetch all users data 
exports.userData = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ['user', 'content-creator'] },
    }).select('-password');
    
    res.status(200).json(users);
  } catch (err) {
    console.error('Error in userData:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// ============= ENHANCED USER MANAGEMENT FUNCTIONS =============

// Delete user - ENHANCED VERSION
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }
    
    // Find the user first
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Prevent deletion of admin accounts
    if (user.role === 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Cannot delete admin accounts' 
      });
    }
    
    // Prevent users from deleting themselves (if logged in user ID matches)
    if (req.user && req.user._id.toString() === id) {
      return res.status(403).json({ 
        success: false,
        message: 'You cannot delete your own account' 
      });
    }
    
    // Delete the user
    await User.findByIdAndDelete(id);
    
    await logActivity('deleted_user', req, {
      targetType: 'user',
      targetId: user._id.toString(),
      targetName: user.username,
    });
    
    res.status(200).json({ 
      success: true,
      message: 'User deleted successfully', 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting user', 
      error: error.message 
    });
  }
};

// Block/Unblock user - ENHANCED VERSION
exports.blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }
    
    // Validate isActive is a boolean
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ 
        success: false,
        message: 'isActive must be a boolean value (true or false)' 
      });
    }
    
    // Find the user first
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Prevent blocking admin accounts
    if (user.role === 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Cannot block/unblock admin accounts' 
      });
    }
    
    // Prevent users from blocking themselves
    if (req.user && req.user._id.toString() === id) {
      return res.status(403).json({ 
        success: false,
        message: 'You cannot block/unblock your own account' 
      });
    }
    
    // Update the user's active status
    user.isActive = isActive;
    await user.save();
    
    const action = isActive ? 'unblocked (activated)' : 'blocked (deactivated)';

    await logActivity(isActive ? 'activated_user' : 'blocked_user', req, {
      targetType: 'user',
      targetId: user._id.toString(),
      targetName: user.username,
    });
    
    res.status(200).json({ 
      success: true,
      message: `User ${action} successfully`, 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating user status', 
      error: error.message 
    });
  }
};

// ============= USER ACCOUNT MANAGEMENT =============

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Change email
exports.changeEmail = async (req, res) => {
  try {
    const userId = req.userId;
    const { newEmail, password } = req.body;

    if (!newEmail || !password) {
      return res.status(400).json({ message: "New email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const existing = await User.findOne({ email: newEmail.toLowerCase() });
    if (existing && existing._id.toString() !== userId) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    user.email = newEmail.toLowerCase();
    await user.save();

    res.status(200).json({ message: "Email changed successfully", email: user.email });
  } catch (error) {
    console.error("Error changing email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile (username, bio, phone)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, bio, phone } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username !== undefined) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    const updated = await User.findById(userId).select("-password");
    res.status(200).json({ message: "Profile updated successfully", user: updated });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot password (generates reset token)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ message: "If an account exists with this email, a reset link has been sent." });
    }

    const resetToken = jwt.sign(
      { userId: user._id, purpose: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // In production, send email here. For now return token for dev/testing.
    res.status(200).json({
      message: "If an account exists with this email, a reset link has been sent.",
      ...(process.env.NODE_ENV !== "production" && { resetToken }),
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Public stats (no auth required)
exports.getPublicStats = async (req, res) => {
  try {
    const Herb = require("../models/herbModel");
    const Category = require("../models/categoryModel");

    const [herbCount, userCount, categoryCount] = await Promise.all([
      Herb.countDocuments({ status: "approved" }),
      User.countDocuments({ role: "user" }),
      Category.countDocuments(),
    ]);

    res.status(200).json({
      herbs: herbCount || 0,
      users: userCount || 0,
      categories: categoryCount || 0,
    });
  } catch (error) {
    console.error("Error fetching public stats:", error);
    res.status(200).json({ herbs: 0, users: 0, categories: 0 });
  }
};