const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Middleware to verify JWT token
exports.protect = async (req, res, next) => {
  let token;
  
  // Get token from the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // Check if token exists
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token' 
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from the token
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    if (!req.user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'User account is inactive' 
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token failed' 
    });
  }
};

// Middleware for admin access only
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Not authorized as an admin'
    });
  }
};

// Middleware for affiliate access only
exports.affiliate = (req, res, next) => {
  if (req.user && req.user.role === 'affiliate') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Not authorized as an affiliate'
    });
  }
}; 