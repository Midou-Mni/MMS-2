const express = require('express');
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign
} = require('../controllers/campaign.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// All campaign routes require authentication
router.use(protect);

// Admin-only routes
router.post('/', admin, createCampaign);
router.get('/', admin, getCampaigns);
router.put('/:id', admin, updateCampaign);
router.delete('/:id', admin, deleteCampaign);

// Routes accessible to both admin and affiliates
router.get('/:id', getCampaign);

module.exports = router;