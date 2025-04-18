const crypto = require('crypto');

/**
 * Generate a unique referral code
 * @param {String} affiliateId - Affiliate's ID
 * @param {String} campaignId - Campaign ID
 * @returns {String} Unique referral code
 */
exports.generateReferralCode = (affiliateId, campaignId) => {
  const uniqueString = `${affiliateId}-${campaignId}-${Date.now()}`;
  const hash = crypto.createHash('md5').update(uniqueString).digest('hex');
  
  // Return a shorter version (first 8 characters) for user-friendliness
  return hash.substring(0, 8);
};

/**
 * Calculate commission amount based on commission type and value
 * @param {String} commissionType - 'percentage' or 'fixed'
 * @param {Number} commissionValue - Commission value
 * @param {Number} saleAmount - Sale amount
 * @param {Number} maxCommission - Maximum commission amount (for percentage type)
 * @returns {Number} Commission amount to be paid
 */
exports.calculateCommission = (commissionType, commissionValue, saleAmount, maxCommission = null) => {
  let commission;
  
  if (commissionType === 'percentage') {
    commission = (commissionValue / 100) * saleAmount;
    
    // Apply maximum commission cap if provided
    if (maxCommission !== null && commission > maxCommission) {
      commission = maxCommission;
    }
  } else {
    // Fixed commission regardless of sale amount
    commission = commissionValue;
  }
  
  return parseFloat(commission.toFixed(2)); // Round to 2 decimal places
};

/**
 * Generate tracking URL for affiliate
 * @param {String} baseURL - Base URL for the campaign 
 * @param {String} referralCode - Unique referral code
 * @returns {String} Complete tracking URL
 */
exports.generateTrackingUrl = (baseURL, referralCode) => {
  // Ensure baseURL doesn't have trailing slash
  const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  
  // Add referral code as query parameter
  return `${cleanBaseURL}?ref=${referralCode}`;
}; 