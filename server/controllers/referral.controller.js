const Referral = require('../models/Referral.model');
const Campaign = require('../models/Campaign.model');
const { calculateCommission } = require('../utils/referral.utils');

/**
 * Track a referral click
 * @route   POST /api/referrals/track-click
 * @access  Public
 */
exports.trackClick = async (req, res) => {
  try {
    const { referralCode, ip, userAgent } = req.body;

    // Find the referral
    const referral = await Referral.findOne({ referralCode });
    if (!referral) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code'
      });
    }

    // Update the click count and add click details
    referral.clicks += 1;
    referral.referralDetails.push({
      ip,
      userAgent,
      timestamp: Date.now(),
      converted: false
    });

    await referral.save();

    res.status(200).json({
      success: true,
      data: { message: 'Click tracked successfully' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Register a conversion
 * @route   POST /api/referrals/conversion
 * @access  Public
 */
exports.registerConversion = async (req, res) => {
  try {
    const { referralCode, conversionValue, ip, userAgent } = req.body;

    // Find the referral
    const referral = await Referral.findOne({ referralCode });
    if (!referral) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code'
      });
    }

    // Find the campaign to get commission details
    const campaign = await Campaign.findById(referral.campaign);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Calculate commission
    const commissionEarned = calculateCommission(
      campaign.commissionType,
      campaign.commissionValue,
      conversionValue || campaign.product.price,
      campaign.maxCommission
    );

    // Update conversion data
    referral.conversions += 1;
    referral.earnings += commissionEarned;

    // Find the last click from this IP (or create new entry if not found)
    const clickIndex = referral.referralDetails.findIndex(
      detail => detail.ip === ip && !detail.converted
    );

    if (clickIndex !== -1) {
      // Update existing click entry
      referral.referralDetails[clickIndex].converted = true;
      referral.referralDetails[clickIndex].conversionTimestamp = Date.now();
      referral.referralDetails[clickIndex].conversionValue = conversionValue || campaign.product.price;
      referral.referralDetails[clickIndex].commissionEarned = commissionEarned;
    } else {
      // Create new conversion entry
      referral.referralDetails.push({
        ip,
        userAgent,
        timestamp: Date.now(),
        converted: true,
        conversionTimestamp: Date.now(),
        conversionValue: conversionValue || campaign.product.price,
        commissionEarned
      });
    }

    await referral.save();

    res.status(200).json({
      success: true,
      data: { message: 'Conversion registered successfully' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get all referrals for an affiliate
 * @route   GET /api/referrals/affiliate
 * @access  Private/Affiliate
 */
exports.getAffiliateReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ affiliate: req.user.id })
      .populate('campaign', 'name product commissionType commissionValue')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: referrals.length,
      data: referrals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get all referrals for admin
 * @route   GET /api/referrals
 * @access  Private/Admin
 */
exports.getAllReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate('campaign', 'name product commissionType commissionValue')
      .populate('affiliate', 'firstName lastName email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: referrals.length,
      data: referrals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get affiliate stats
 * @route   GET /api/referrals/stats/affiliate
 * @access  Private/Affiliate
 */
exports.getAffiliateStats = async (req, res) => {
  try {
    const referrals = await Referral.find({ affiliate: req.user.id });

    // Calculate stats
    const stats = {
      totalReferrals: referrals.length,
      totalClicks: referrals.reduce((sum, ref) => sum + ref.clicks, 0),
      totalConversions: referrals.reduce((sum, ref) => sum + ref.conversions, 0),
      totalEarnings: referrals.reduce((sum, ref) => sum + ref.earnings, 0),
      conversionRate: 0
    };

    // Calculate conversion rate
    if (stats.totalClicks > 0) {
      stats.conversionRate = (stats.totalConversions / stats.totalClicks) * 100;
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get global stats for admin
 * @route   GET /api/referrals/stats/admin
 * @access  Private/Admin
 */
exports.getAdminStats = async (req, res) => {
  try {
    const referrals = await Referral.find();

    // Calculate stats
    const stats = {
      totalReferrals: referrals.length,
      totalClicks: referrals.reduce((sum, ref) => sum + ref.clicks, 0),
      totalConversions: referrals.reduce((sum, ref) => sum + ref.conversions, 0),
      totalCommissions: referrals.reduce((sum, ref) => sum + ref.earnings, 0),
      conversionRate: 0
    };

    // Calculate conversion rate
    if (stats.totalClicks > 0) {
      stats.conversionRate = (stats.totalConversions / stats.totalClicks) * 100;
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
}; 