import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { campaignApi } from '../../services/api';
import { Campaign } from '../../types';

// Mock data for affiliate campaigns
const campaignData = [
  {
    id: 1,
    name: 'Summer Sale',
    description: '20% off on all summer products',
    commissionType: 'percentage',
    commissionValue: 10,
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    referrals: 43,
    conversions: 12,
    conversionRate: 27.91,
    earnings: 250.50,
    status: 'active',
  },
  {
    id: 2,
    name: 'Product Launch',
    description: 'New product line launch campaign',
    commissionType: 'percentage',
    commissionValue: 15,
    startDate: '2025-05-15',
    endDate: '2025-07-15',
    referrals: 28,
    conversions: 6,
    conversionRate: 21.43,
    earnings: 180.75,
    status: 'active',
  },
  {
    id: 3,
    name: 'Membership',
    description: 'Monthly membership promotion',
    commissionType: 'fixed',
    commissionValue: 25,
    startDate: '2025-04-01',
    endDate: '2025-12-31',
    referrals: 35,
    conversions: 12,
    conversionRate: 34.29,
    earnings: 300.00,
    status: 'active',
  },
  {
    id: 4,
    name: 'Course Promo',
    description: 'Online course promotion',
    commissionType: 'percentage',
    commissionValue: 30,
    startDate: '2025-03-15',
    endDate: '2025-05-15',
    referrals: 56,
    conversions: 10,
    conversionRate: 17.86,
    earnings: 450.00,
    status: 'inactive',
  },
  {
    id: 5,
    name: 'Holiday Special',
    description: 'End of year holiday promotion',
    commissionType: 'percentage',
    commissionValue: 20,
    startDate: '2025-11-15',
    endDate: '2025-12-31',
    referrals: 0,
    conversions: 0,
    conversionRate: 0,
    earnings: 0,
    status: 'upcoming',
  },
];

const AffiliateCampaigns: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await campaignApi.getAffiliateCampaigns();
      setCampaigns(response.data.data);
    } catch (err: any) {
      console.error('Error fetching campaigns:', err);
      setError(err.message || 'Failed to load campaigns');
      // Fall back to mock data if API fails
      setCampaigns(campaignData.map(c => ({
        _id: c.id.toString(),
        name: c.name,
        description: c.description,
        product: { name: 'Product', price: 99.99 },
        commissionType: c.commissionType as 'percentage' | 'fixed',
        commissionValue: c.commissionValue,
        startDate: c.startDate,
        endDate: c.endDate,
        trackingUrl: 'https://example.com',
        isActive: c.status === 'active',
        createdBy: '',
        allowedAffiliates: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        referralCode: `REF-${c.id}-${Math.random().toString(36).substring(2, 8)}`,
        referralLink: `https://example.com/ref/${user?.id}/${c.id}`
      })));
    } finally {
      setLoading(false);
    }
  };

  // Filter campaigns based on search and filter criteria
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && campaign.isActive) || 
                         (filterStatus === 'inactive' && !campaign.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // Function to copy referral link
  const copyReferralLink = (campaign: Campaign) => {
    if (campaign.referralLink) {
      navigator.clipboard.writeText(campaign.referralLink);
      setCopiedLink(campaign._id);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedLink(null);
      }, 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Campaigns</h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-2">
          Browse available campaigns and share your referral links
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="mb-8 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="text-red-700 dark:text-red-400">
            <p>{error}</p>
            <Button 
              size="sm" 
              variant="danger" 
              outlined 
              className="mt-2"
              onClick={() => setError('')}
            >
              Dismiss
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-8" bordered>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
          </div>
          <div className="w-full md:w-64">
            <select
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-secondary-900 dark:text-white bg-white dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10">
          <svg 
            className="animate-spin mx-auto h-10 w-10 text-primary-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-3 text-secondary-500 dark:text-secondary-400">Loading campaigns...</p>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-secondary-500 dark:text-secondary-400">No campaigns found that match your search.</p>
        </Card>
      ) : (
        /* Campaign Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCampaigns.map((campaign) => (
            <motion.div
              key={campaign._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                bordered
                hover
                elevation="md"
                className="h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    {campaign.name}
                  </h3>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        campaign.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                  >
                    {campaign.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                  {campaign.description}
                </p>
                
                <div className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                  <div className="flex justify-between mb-1">
                    <span>Commission:</span>
                    <span className="font-semibold text-secondary-900 dark:text-white">
                      {campaign.commissionType === 'percentage' ? campaign.commissionValue + '%' : '$' + campaign.commissionValue}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Product:</span>
                    <span>${campaign.product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Period:</span>
                    <span>
                      {new Date(campaign.startDate).toLocaleDateString()} 
                      {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>

                {campaign.referralCode && (
                  <div className="mb-4">
                    <div className="text-xs text-secondary-500 dark:text-secondary-400 mb-1">Your Referral Code:</div>
                    <div className="bg-secondary-50 dark:bg-secondary-800 p-2 rounded text-center font-mono text-sm">
                      {campaign.referralCode}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-secondary-50 dark:bg-secondary-800 p-2 rounded text-center">
                    <div className="text-xs text-secondary-500 dark:text-secondary-400">Referrals</div>
                    <div className="text-lg font-semibold text-secondary-900 dark:text-white">0</div>
                  </div>
                  <div className="bg-secondary-50 dark:bg-secondary-800 p-2 rounded text-center">
                    <div className="text-xs text-secondary-500 dark:text-secondary-400">Conv. Rate</div>
                    <div className="text-lg font-semibold text-secondary-900 dark:text-white">0%</div>
                  </div>
                  <div className="bg-secondary-50 dark:bg-secondary-800 p-2 rounded text-center">
                    <div className="text-xs text-secondary-500 dark:text-secondary-400">Earnings</div>
                    <div className="text-lg font-semibold text-secondary-900 dark:text-white">$0</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant={copiedLink === campaign._id ? "success" : "primary"}
                    fullWidth
                    size="sm"
                    disabled={!campaign.isActive || !campaign.referralLink}
                    onClick={() => copyReferralLink(campaign)}
                  >
                    {copiedLink === campaign._id ? "Copied!" : "Copy Referral Link"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    outlined
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                  >
                    View
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tips Card */}
      <Card
        bordered
        elevation="sm"
        className="bg-primary-50 dark:bg-primary-900 border-primary-200 dark:border-primary-700"
      >
        <div className="flex flex-wrap md:flex-nowrap items-center">
          <div className="w-full md:w-auto p-2 md:mr-6">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto md:mx-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary-600 dark:text-primary-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 p-2 text-center md:text-left">
            <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-1">
              Maximize Your Affiliate Earnings
            </h3>
            <p className="text-sm text-primary-700 dark:text-primary-300">
              Share your referral links on social media, create content around the products, and engage with your audience to increase conversions. Combine multiple campaigns for the best results!
            </p>
          </div>
          <div className="w-full md:w-auto p-2 mt-4 md:mt-0 text-center">
            <Button variant="primary" outlined size="sm">
              Learn More
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AffiliateCampaigns; 