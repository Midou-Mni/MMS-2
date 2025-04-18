const Campaign = require('../models/Campaign.model');
const Referral = require('../models/Referral.model');
const { generateReferralCode, generateTrackingUrl } = require('../utils/referral.utils');

/**
 * Create a new campaign
 * @route   POST /api/campaigns
 * @access  Private/Admin
 */
exports.createCampaign = async (req, res) => {
  try {
    const {
      name,
      description,
      product,
      commissionType,
      commissionValue,
      maxCommission,
      startDate,
      endDate,
      trackingUrl,
      allowedAffiliates
    } = req.body;

    const campaign = await Campaign.create({
      name,
      description,
      product,
      commissionType,
      commissionValue,
      maxCommission,
      startDate,
      endDate,
      trackingUrl,
      allowedAffiliates,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get all campaigns
 * @route   GET /api/campaigns
 * @access  Private/Admin
 */
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('createdBy', 'firstName lastName email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get campaigns available to affiliate
 * @route   GET /api/campaigns/affiliate
 * @access  Private/Affiliate
 */
exports.getAffiliateCampaigns = async (req, res) => {
  try {
    // Find campaigns where the affiliate is allowed
    const campaigns = await Campaign.find({
      $or: [
        { allowedAffiliates: { $in: [req.user.id] } },
        { allowedAffiliates: { $size: 0 } } // Empty array means all affiliates are allowed
      ],
      isActive: true
    }).populate('createdBy', 'firstName lastName email');

    // Get the referral codes for each campaign
    const campaignsWithReferralCodes = await Promise.all(
      campaigns.map(async (campaign) => {
        // Check if a referral already exists
        const existingReferral = await Referral.findOne({
          campaign: campaign._id,
          affiliate: req.user.id
        });

        if (existingReferral) {
          return {
            ...campaign._doc,
            referralCode: existingReferral.referralCode,
            referralLink: generateTrackingUrl(campaign.trackingUrl, existingReferral.referralCode)
          };
        } else {
          // Generate new referral code
          const referralCode = generateReferralCode(req.user.id, campaign._id);
          
          // Create new referral record
          const newReferral = await Referral.create({
            campaign: campaign._id,
            affiliate: req.user.id,
            referralCode
          });

          return {
            ...campaign._doc,
            referralCode,
            referralLink: generateTrackingUrl(campaign.trackingUrl, referralCode)
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      count: campaignsWithReferralCodes.length,
      data: campaignsWithReferralCodes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get a single campaign
 * @route   GET /api/campaigns/:id
 * @access  Private
 */
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email');

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Check if user is admin or authorized affiliate
    if (
      req.user.role !== 'admin' &&
      campaign.allowedAffiliates.length > 0 &&
      !campaign.allowedAffiliates.includes(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this campaign'
      });
    }

    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Update a campaign
 * @route   PUT /api/campaigns/:id
 * @access  Private/Admin
 */
exports.updateCampaign = async (req, res) => {
  try {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Delete a campaign
 * @route   DELETE /api/campaigns/:id
 * @access  Private/Admin
 */
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    await campaign.remove();

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