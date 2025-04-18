const express = require('express');
const router = express.Router();
const {
  createPayout,
  getPayouts,
  updatePayoutStatus,
  calculatePendingAmount
} = require('../controllers/payout.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// All payout routes are protected
router.use(protect);

// Admin-only routes
router.post('/', admin, createPayout);
router.get('/', admin, getPayouts);
router.put('/:id/status', admin, updatePayoutStatus);
router.get('/pending-amount/:affiliateId', admin, calculatePendingAmount);

module.exports = router; 