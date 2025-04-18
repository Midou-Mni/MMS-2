const Payout = require('../models/Payout.model');
const Referral = require('../models/Referral.model');
const User = require('../models/User.model');

/**
 * Create a new payout
 * @route   POST /api/payouts
 * @access  Private/Admin
 */
exports.createPayout = async (req, res) => {
  try {
    const { 
      affiliate,
      amount,
      paymentMethod, 
      paymentDetails,
      period,
      referrals 
    } = req.body;

    // Validate affiliate
    const affiliateUser = await User.findById(affiliate);
    if (!affiliateUser || affiliateUser.role !== 'affiliate') {
      return res.status(400).json({
        success: false,
        message: 'Invalid affiliate user'
      });
    }

    // Create payout
    const payout = await Payout.create({
      affiliate,
      amount,
      paymentMethod,
      paymentDetails,
      period,
      referrals,
      processedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: payout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get all payouts (admin)
 * @route   GET /api/payouts
 * @access  Private/Admin
 */
exports.getPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find()
      .populate('affiliate', 'firstName lastName email')
      .populate('processedBy', 'firstName lastName email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: payouts.length,
      data: payouts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get affiliate's payouts
 * @route   GET /api/payouts/affiliate
 * @access  Private/Affiliate
 */
exports.getAffiliatePayouts = async (req, res) => {
  try {
    const payouts = await Payout.find({ affiliate: req.user.id })
      .populate('processedBy', 'firstName lastName email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: payouts.length,
      data: payouts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Update payout status
 * @route   PUT /api/payouts/:id/status
 * @access  Private/Admin
 */
exports.updatePayoutStatus = async (req, res) => {
  try {
    const { status, paymentDetails } = req.body;
    
    let payout = await Payout.findById(req.params.id);
    
    if (!payout) {
      return res.status(404).json({
        success: false,
        message: 'Payout not found'
      });
    }
    
    // Update fields
    payout.status = status;
    if (paymentDetails) {
      payout.paymentDetails = {
        ...payout.paymentDetails,
        ...paymentDetails
      };
    }
    
    // If status is completed, set processedAt
    if (status === 'completed' && !payout.processedAt) {
      payout.processedAt = Date.now();
    }
    
    await payout.save();
    
    res.status(200).json({
      success: true,
      data: payout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Calculate pending payouts for an affiliate
 * @route   GET /api/payouts/pending-amount/:affiliateId
 * @access  Private/Admin
 */
exports.calculatePendingAmount = async (req, res) => {
  try {
    const { affiliateId } = req.params;
    
    // Validate affiliate
    const affiliate = await User.findById(affiliateId);
    if (!affiliate || affiliate.role !== 'affiliate') {
      return res.status(400).json({
        success: false,
        message: 'Invalid affiliate user'
      });
    }
    
    // Find referrals not included in completed payouts
    const paidReferralIds = await Payout.find({ 
      affiliate: affiliateId,
      status: 'completed'
    }).distinct('referrals');
    
    // Get unpaid referrals
    const unpaidReferrals = await Referral.find({
      affiliate: affiliateId,
      _id: { $nin: paidReferralIds }
    });
    
    // Calculate total unpaid amount
    const pendingAmount = unpaidReferrals.reduce((sum, ref) => sum + ref.earnings, 0);
    
    res.status(200).json({
      success: true,
      data: {
        pendingAmount,
        referralCount: unpaidReferrals.length,
        unpaidReferrals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get affiliate's pending amount
 * @route   GET /api/payouts/affiliate/pending-amount
 * @access  Private/Affiliate
 */
exports.getAffiliatePendingAmount = async (req, res) => {
  try {
    // Find referrals not included in completed payouts
    const paidReferralIds = await Payout.find({ 
      affiliate: req.user.id,
      status: 'completed'
    }).distinct('referrals');
    
    // Get unpaid referrals
    const unpaidReferrals = await Referral.find({
      affiliate: req.user.id,
      _id: { $nin: paidReferralIds }
    }).populate('campaign', 'name');
    
    // Calculate total unpaid amount
    const pendingAmount = unpaidReferrals.reduce((sum, ref) => sum + ref.earnings, 0);
    
    res.status(200).json({
      success: true,
      data: {
        pendingAmount,
        referralCount: unpaidReferrals.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
}; 