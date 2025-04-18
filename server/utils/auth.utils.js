const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {Object} user - User object 
 * @returns {String} JWT token
 */
exports.generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: '30d' 
    }
  );
};

/**
 * Generate response with user data and token
 * @param {Object} user - User document from MongoDB
 * @returns {Object} Response object with user data and token
 */
exports.generateAuthResponse = (user) => {
  const token = this.generateToken(user);
  
  return {
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }
  };
}; 