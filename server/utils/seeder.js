const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User.model');
const Campaign = require('../models/Campaign.model');
const Referral = require('../models/Referral.model');
const Payout = require('../models/Payout.model');
const { generateReferralCode } = require('./referral.utils');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample data for seeding
const seedUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'affiliate',
    payoutDetails: {
      bankName: 'Chase Bank',
      accountNumber: '123456789',
      routingNumber: '987654321',
      preferredMethod: 'bank'
    }
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'affiliate',
    payoutDetails: {
      paypalEmail: 'jane@paypal.com',
      preferredMethod: 'paypal'
    }
  },
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'affiliate'
  }
];

// Import data into the database
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Campaign.deleteMany();
    await Referral.deleteMany();
    await Payout.deleteMany();

    console.log('Previous data cleared');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      seedUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return user;
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    
    console.log(`${createdUsers.length} users created`);

    // Create sample campaigns
    const adminUser = createdUsers.find(user => user.role === 'admin');
    
    const campaigns = [
      {
        name: 'Summer Software Sale',
        description: 'Promote our latest software products during the summer sale event.',
        product: {
          name: 'Development Suite Pro',
          price: 199.99,
          imageUrl: 'https://via.placeholder.com/150'
        },
        commissionType: 'percentage',
        commissionValue: 15,
        maxCommission: 100,
        startDate: new Date(),
        trackingUrl: 'https://example.com/products/dev-suite-pro',
        isActive: true,
        createdBy: adminUser._id,
        allowedAffiliates: []
      },
      {
        name: 'Digital Marketing Course',
        description: 'Promote our comprehensive digital marketing course.',
        product: {
          name: 'Marketing Mastery 101',
          price: 299.99,
          imageUrl: 'https://via.placeholder.com/150'
        },
        commissionType: 'fixed',
        commissionValue: 50,
        startDate: new Date(),
        trackingUrl: 'https://example.com/courses/marketing-mastery',
        isActive: true,
        createdBy: adminUser._id,
        allowedAffiliates: []
      }
    ];

    const createdCampaigns = await Campaign.insertMany(campaigns);
    
    console.log(`${createdCampaigns.length} campaigns created`);

    // Create referrals and simulate some activity
    const affiliates = createdUsers.filter(user => user.role === 'affiliate');
    let referrals = [];

    for (const affiliate of affiliates) {
      for (const campaign of createdCampaigns) {
        const referralCode = generateReferralCode(affiliate._id, campaign._id);
        
        const clicksCount = Math.floor(Math.random() * 100) + 20;
        const conversionsCount = Math.floor(Math.random() * 20);
        
        const referralDetails = [];
        let totalEarnings = 0;
        
        // Generate referral click details
        for (let i = 0; i < clicksCount; i++) {
          const detail = {
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
            converted: i < conversionsCount
          };
          
          if (detail.converted) {
            detail.conversionTimestamp = new Date(detail.timestamp.getTime() + Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000);
            detail.conversionValue = campaign.product.price;
            
            // Calculate commission based on campaign settings
            let commission;
            if (campaign.commissionType === 'percentage') {
              commission = (campaign.commissionValue / 100) * detail.conversionValue;
              if (campaign.maxCommission && commission > campaign.maxCommission) {
                commission = campaign.maxCommission;
              }
            } else {
              commission = campaign.commissionValue;
            }
            
            detail.commissionEarned = parseFloat(commission.toFixed(2));
            totalEarnings += detail.commissionEarned;
          }
          
          referralDetails.push(detail);
        }
        
        referrals.push({
          campaign: campaign._id,
          affiliate: affiliate._id,
          referralCode,
          clicks: clicksCount,
          conversions: conversionsCount,
          earnings: parseFloat(totalEarnings.toFixed(2)),
          referralDetails
        });
      }
    }

    const createdReferrals = await Referral.insertMany(referrals);
    
    console.log(`${createdReferrals.length} referrals created`);

    // Create some payouts
    const payouts = [];
    const statusOptions = ['pending', 'processing', 'completed'];
    
    for (const affiliate of affiliates) {
      // Get affiliate's referrals
      const affiliateReferrals = createdReferrals.filter(
        ref => ref.affiliate.toString() === affiliate._id.toString()
      );
      
      if (affiliateReferrals.length > 0) {
        // Calculate total earnings
        const totalEarnings = affiliateReferrals.reduce((sum, ref) => sum + ref.earnings, 0);
        
        // Create a completed payout for part of the earnings
        const paidAmount = parseFloat((totalEarnings * 0.6).toFixed(2));
        
        if (paidAmount > 0) {
          payouts.push({
            affiliate: affiliate._id,
            amount: paidAmount,
            status: 'completed',
            paymentMethod: affiliate.payoutDetails?.preferredMethod || 'bank',
            paymentDetails: {
              transactionId: `TXID-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
              notes: 'Regular monthly payout'
            },
            processedBy: adminUser._id,
            processedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            referrals: affiliateReferrals.slice(0, Math.ceil(affiliateReferrals.length / 2)).map(ref => ref._id),
            period: {
              startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
              endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
            }
          });
        }
        
        // Create a pending payout for the remaining earnings
        const pendingAmount = parseFloat((totalEarnings * 0.4).toFixed(2));
        
        if (pendingAmount > 0) {
          payouts.push({
            affiliate: affiliate._id,
            amount: pendingAmount,
            status: 'pending',
            paymentMethod: affiliate.payoutDetails?.preferredMethod || 'bank',
            referrals: affiliateReferrals.slice(Math.ceil(affiliateReferrals.length / 2)).map(ref => ref._id),
            period: {
              startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
              endDate: new Date()
            }
          });
        }
      }
    }

    const createdPayouts = await Payout.insertMany(payouts);
    
    console.log(`${createdPayouts.length} payouts created`);

    console.log('Data import complete!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data from the database
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Campaign.deleteMany();
    await Referral.deleteMany();
    await Payout.deleteMany();

    console.log('All data deleted!');
    process.exit();
  } catch (error) {
    console.error(`Error deleting data: ${error.message}`);
    process.exit(1);
  }
};

// Run the appropriate action based on command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please provide proper command: -i (import) or -d (delete)');
  process.exit();
} 