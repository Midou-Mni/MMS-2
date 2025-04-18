const User = require('../models/User.model');
const Campaign = require('../models/Campaign.model');
const Referral = require('../models/Referral.model');
const Payout = require('../models/Payout.model');

/**
 * Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Update user
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, isActive, payoutDetails } = req.body;
    
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (payoutDetails) user.payoutDetails = payoutDetails;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if the user being deleted is an admin
    if (user.role === 'admin') {
      // Count total number of admin users
      const adminCount = await User.countDocuments({ role: 'admin' });
      
      // Prevent deletion if this is the last admin
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }
    
    await user.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get dashboard stats
 * @route   GET /api/admin/stats/dashboard
 * @access  Private/Admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const userCount = await User.countDocuments();
    const affiliateCount = await User.countDocuments({ role: 'affiliate' });
    const campaignCount = await Campaign.countDocuments();
    
    // Get referral data
    const referrals = await Referral.find();
    const totalClicks = referrals.reduce((sum, ref) => sum + ref.clicks, 0);
    const totalConversions = referrals.reduce((sum, ref) => sum + ref.conversions, 0);
    const totalCommissions = referrals.reduce((sum, ref) => sum + ref.earnings, 0);
    
    // Get payout data
    const payouts = await Payout.find();
    const totalPaidOut = payouts
      .filter(payout => payout.status === 'completed')
      .reduce((sum, payout) => sum + payout.amount, 0);
    
    const pendingPayouts = payouts
      .filter(payout => payout.status === 'pending' || payout.status === 'processing')
      .reduce((sum, payout) => sum + payout.amount, 0);
    
    // Get recent activity
    const recentCampaigns = await Campaign.find()
      .sort('-createdAt')
      .limit(5)
      .select('name product createdAt');
    
    const recentAffiliates = await User.find({ role: 'affiliate' })
      .sort('-createdAt')
      .limit(5)
      .select('firstName lastName email createdAt');
    
    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: userCount,
          affiliates: affiliateCount,
          campaigns: campaignCount
        },
        referrals: {
          clicks: totalClicks,
          conversions: totalConversions,
          commissions: totalCommissions,
          conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
        },
        payouts: {
          paid: totalPaidOut,
          pending: pendingPayouts
        },
        recent: {
          campaigns: recentCampaigns,
          affiliates: recentAffiliates
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