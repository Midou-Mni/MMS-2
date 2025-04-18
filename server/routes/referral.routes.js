const express = require('express');
const router = express.Router();
const {
  trackClick,
  registerConversion,
  getAllReferrals,
  getAdminStats
} = require('../controllers/referral.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// Public routes for tracking
router.post('/track-click', trackClick);
router.post('/conversion', registerConversion);

// Admin-only routes with protection
router.get('/', protect, admin, getAllReferrals);
router.get('/stats/admin', protect, admin, getAdminStats);

module.exports = router; 