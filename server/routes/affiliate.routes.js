const express = require('express');
const router = express.Router();
const { 
  updateProfile,
  updatePassword,
  getDashboard
} = require('../controllers/affiliate.controller');
const { 
  getAffiliateReferrals,
  getAffiliateStats 
} = require('../controllers/referral.controller');
const { 
  getAffiliateCampaigns 
} = require('../controllers/campaign.controller');
const { 
  getAffiliatePayouts,
  getAffiliatePendingAmount 
} = require('../controllers/payout.controller');
const { protect, affiliate } = require('../middleware/auth.middleware');

// All affiliate routes are protected
router.use(protect);
router.use(affiliate);

// Profile routes
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

// Dashboard
router.get('/dashboard', getDashboard);

// Campaigns
router.get('/campaigns', getAffiliateCampaigns);

// Referrals
router.get('/referrals', getAffiliateReferrals);
router.get('/stats', getAffiliateStats);

// Payouts
router.get('/payouts', getAffiliatePayouts);
router.get('/payouts/pending', getAffiliatePendingAmount);

module.exports = router; 