const User = require('../models/User.model');
const { generateAuthResponse } = require('../utils/auth.utils');

/**
 * Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }
    
    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'affiliate' // Default to affiliate unless specified
    });
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user data' 
      });
    }
    
    // Return user data with token
    res.status(201).json({
      success: true,
      data: generateAuthResponse(user)
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

/**
 * Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is inactive. Please contact support.' 
      });
    }
    
    // Return user data with token
    res.status(200).json({
      success: true,
      data: generateAuthResponse(user)
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

/**
 * Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          payoutDetails: user.payoutDetails,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server Error' 
    });
  }
}; 