import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { referralApi } from '../../services/api';
import { Referral } from '../../types';

// Mock data for referrals
const mockReferrals = [
  {
    _id: '1',
    campaign: {
      _id: '1',
      name: 'Summer Sale'
    },
    affiliate: {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    },
    referralCode: 'REF123456',
    clicks: 76,
    conversions: 15,
    earnings: 225.50,
    createdAt: '2025-04-01T12:00:00Z',
    updatedAt: '2025-04-15T18:30:00Z'
  },
  {
    _id: '2',
    campaign: {
      _id: '2',
      name: 'Product Launch'
    },
    affiliate: {
      _id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com'
    },
    referralCode: 'REF789012',
    clicks: 55,
    conversions: 8,
    earnings: 120.00,
    createdAt: '2025-04-05T09:15:00Z',
    updatedAt: '2025-04-16T14:45:00Z'
  },
  {
    _id: '3',
    campaign: {
      _id: '1',
      name: 'Summer Sale'
    },
    affiliate: {
      _id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike@example.com'
    },
    referralCode: 'REF345678',
    clicks: 124,
    conversions: 22,
    earnings: 330.75,
    createdAt: '2025-03-25T16:30:00Z',
    updatedAt: '2025-04-17T11:20:00Z'
  }
];

const AdminReferrals: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalEarnings: 0,
    conversionRate: 0
  });

  // Fetch referrals on component mount
  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const response = await referralApi.getAllReferrals();
      setReferrals(response.data.data);
      
      // Fetch stats
      const statsResponse = await referralApi.getAdminStats();
      setStats(statsResponse.data.data);
    } catch (err: any) {
      console.error('Error fetching referrals:', err);
      setError(err.message || 'Failed to load referrals');
      // Fall back to mock data
      setReferrals(mockReferrals as any);
      
      // Mock stats
      setStats({
        totalReferrals: mockReferrals.length,
        totalClicks: mockReferrals.reduce((sum, r) => sum + r.clicks, 0),
        totalConversions: mockReferrals.reduce((sum, r) => sum + r.conversions, 0),
        totalEarnings: mockReferrals.reduce((sum, r) => sum + r.earnings, 0),
        conversionRate: Math.round((mockReferrals.reduce((sum, r) => sum + r.conversions, 0) / 
                                    mockReferrals.reduce((sum, r) => sum + r.clicks, 0)) * 100 * 100) / 100
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply all filters and sorting
  const filteredReferrals = referrals
    .filter(ref => {
      // Campaign filter
      if (campaignFilter !== 'all' && 
          (typeof ref.campaign === 'string' ? ref.campaign : ref.campaign._id) !== campaignFilter) {
        return false;
      }
      
      // Search term (affiliate name or referral code)
      const affiliateName = typeof ref.affiliate === 'string' 
        ? '' 
        : `${ref.affiliate.firstName} ${ref.affiliate.lastName}`.toLowerCase();
      const campaignName = typeof ref.campaign === 'string' ? '' : ref.campaign.name.toLowerCase();
      
      if (searchTerm && 
          !affiliateName.includes(searchTerm.toLowerCase()) && 
          !ref.referralCode.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !campaignName.includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Date range filter
      if (dateRange.startDate) {
        const startDateObj = new Date(dateRange.startDate);
        const refDate = new Date(ref.createdAt);
        if (refDate < startDateObj) {
          return false;
        }
      }
      
      if (dateRange.endDate) {
        const endDateObj = new Date(dateRange.endDate);
        endDateObj.setHours(23, 59, 59, 999); // End of day
        const refDate = new Date(ref.createdAt);
        if (refDate > endDateObj) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortOrder === 'asc' 
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'clicks':
          return sortOrder === 'asc' ? a.clicks - b.clicks : b.clicks - a.clicks;
        case 'conversions':
          return sortOrder === 'asc' ? a.conversions - b.conversions : b.conversions - a.conversions;
        case 'earnings':
          return sortOrder === 'asc' ? a.earnings - b.earnings : b.earnings - a.earnings;
        default:
          return 0;
      }
    });

  // Get unique campaigns for filter
  const campaigns = Array.from(new Set(referrals.map(ref => 
    typeof ref.campaign === 'string' ? ref.campaign : ref.campaign._id
  )))
  .map(campaignId => {
    const refWithCampaign = referrals.find(ref => 
      (typeof ref.campaign === 'string' ? ref.campaign : ref.campaign._id) === campaignId
    );
    return {
      id: campaignId,
      name: typeof refWithCampaign?.campaign === 'string' 
        ? 'Unknown' 
        : refWithCampaign?.campaign.name || 'Unknown'
    };
  });

  // Toggle sort order
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setCampaignFilter('all');
    setDateRange({ startDate: '', endDate: '' });
    setSortBy('date');
    setSortOrder('desc');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Referral Tracking</h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-2">
          Monitor all referrals and conversion data
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
      
      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card bordered hover className="bg-secondary-50 dark:bg-secondary-800/50">
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Total Referrals</h3>
          <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-white">{stats.totalReferrals || 0}</p>
        </Card>
        
        <Card bordered hover className="bg-secondary-50 dark:bg-secondary-800/50">
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Total Clicks</h3>
          <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-white">{stats.totalClicks || 0}</p>
        </Card>
        
        <Card bordered hover className="bg-secondary-50 dark:bg-secondary-800/50">
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Total Conversions</h3>
          <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-white">{stats.totalConversions || 0}</p>
        </Card>
        
        <Card bordered hover className="bg-secondary-50 dark:bg-secondary-800/50">
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Conversion Rate</h3>
          <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-white">{stats.conversionRate || 0}%</p>
        </Card>
        
        <Card bordered hover className="bg-secondary-50 dark:bg-secondary-800/50">
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Total Earnings</h3>
          <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-white">${(stats.totalEarnings || 0).toLocaleString()}</p>
        </Card>
      </motion.div>
      
      {/* Filters */}
      <Card className="mb-8" bordered>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              label="Search"
              placeholder="Search by affiliate or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Campaign
            </label>
            <select
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-secondary-900 dark:text-white bg-white dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
            >
              <option value="all">All Campaigns</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Input
              label="Start Date"
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          
          <div>
            <Input
              label="End Date"
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button
            size="sm"
            variant="secondary"
            outlined
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </Card>
      
      {/* Referrals Table */}
      <Card bordered elevation="md">
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
            <p className="mt-3 text-secondary-500 dark:text-secondary-400">Loading referrals...</p>
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-secondary-500 dark:text-secondary-400">No referrals found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead className="bg-secondary-50 dark:bg-secondary-800">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      {sortBy === 'date' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Affiliate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Referral Code
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('clicks')}
                  >
                    <div className="flex items-center">
                      Clicks
                      {sortBy === 'clicks' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('conversions')}
                  >
                    <div className="flex items-center">
                      Conversions
                      {sortBy === 'conversions' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('earnings')}
                  >
                    <div className="flex items-center">
                      Earnings
                      {sortBy === 'earnings' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-700">
                {filteredReferrals.map((referral) => (
                  <tr key={referral._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {typeof referral.campaign === 'string' 
                        ? referral.campaign 
                        : referral.campaign.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {typeof referral.affiliate === 'string' 
                        ? referral.affiliate
                        : `${referral.affiliate.firstName} ${referral.affiliate.lastName}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-secondary-900 dark:text-white">
                      {referral.referralCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {referral.clicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {referral.conversions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      ${(referral.earnings || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        size="sm"
                        variant="primary"
                        outlined
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminReferrals; 