const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Middleware to authenticate user using JWT token
 * Attaches user information to req.user
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: 'No token provided. Access denied.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found. Invalid token.' 
      });
    }

    // Check if user is active
    if (user.isActive === false) {
      return res.status(403).json({ 
        message: 'Your account has been blocked. Please contact support.' 
      });
    }

    // Attach user to request object
    req.user = user;
    req.userId = user._id;
    req.token = token;
    console.log('User authenticated:', user._id);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired. Please login again.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during authentication.' 
    });
  }
};

module.exports = authenticateUser;