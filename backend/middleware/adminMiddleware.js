const User = require("../models/userModel");

const isAdmin = async (req, res, next) => {
  try {
    // Use req.userId instead of req.user
    const user = await User.findById(req.userId);  // ✅ Correct
    // OR you can just use the user object that's already attached
    // const user = req.user;  // Even better - no need for another DB query
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only" });
    }
    
    console.log('Admin access granted to user:', user._id);
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const isContentCreator = async (req, res, next) => {
  try {
    // Use req.userId instead of req.user
    const user = await User.findById(req.userId);  // ✅ Correct
    // OR: const user = req.user;
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== 'content-creator' && user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Only Content Creators and Admins can access this" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { isAdmin, isContentCreator };