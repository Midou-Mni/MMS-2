const User = require('../models/User.model');
const Referral = require('../models/Referral.model');
const Campaign = require('../models/Campaign.model');
const Payout = require('../models/Payout.model');

/**
 * Update affiliate profile
 * @route   PUT /api/affiliate/profile
 * @access  Private/Affiliate
 */
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, payoutDetails } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (payoutDetails) user.payoutDetails = {
      ...user.payoutDetails,
      ...payoutDetails
    };
    
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Update affiliate password
 * @route   PUT /api/affiliate/password
 * @access  Private/Affiliate
 */
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get affiliate dashboard data
 * @route   GET /api/affiliate/dashboard
 * @access  Private/Affiliate
 */
exports.getDashboard = async (req, res) => {
  try {
    // Get campaign count
    const campaigns = await Campaign.find({
      $or: [
        { allowedAffiliates: { $in: [req.user.id] } },
        { allowedAffiliates: { $size: 0 } }
      ],
      isActive: true
    });
    
    // Get referral data
    const referrals = await Referral.find({ affiliate: req.user.id });
    const totalClicks = referrals.reduce((sum, ref) => sum + ref.clicks, 0);
    const totalConversions = referrals.reduce((sum, ref) => sum + ref.conversions, 0);
    const totalEarnings = referrals.reduce((sum, ref) => sum + ref.earnings, 0);
    
    // Get payout data
    const payouts = await Payout.find({ affiliate: req.user.id });
    const completedPayouts = payouts.filter(payout => payout.status === 'completed');
    const totalPaidOut = completedPayouts.reduce((sum, payout) => sum + payout.amount, 0);
    
    // Calculate pending amount
    const pendingAmount = totalEarnings - totalPaidOut;
    
    // Get recent activity
    const recentReferrals = await Referral.find({ affiliate: req.user.id })
      .sort('-createdAt')
      .limit(5)
      .populate('campaign', 'name');
    
    const recentPayouts = await Payout.find({ affiliate: req.user.id })
      .sort('-createdAt')
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        counts: {
          campaigns: campaigns.length,
          referrals: referrals.length
        },
        performance: {
          clicks: totalClicks,
          conversions: totalConversions,
          earnings: totalEarnings,
          paidOut: totalPaidOut,
          pending: pendingAmount,
          conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
        },
        recent: {
          referrals: recentReferrals,
          payouts: recentPayouts
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