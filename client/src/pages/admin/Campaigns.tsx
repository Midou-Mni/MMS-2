import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { campaignApi } from '../../services/api';
import { Campaign } from '../../types';

// Mock data
const campaignData = [
  {
    id: 1,
    name: 'Summer Sale',
    description: '20% off on all summer products',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'active',
    commissionType: 'percentage',
    commissionValue: 10,
    referrals: 487,
    conversions: 124,
    totalCommission: 3569.42,
  },
  {
    id: 2,
    name: 'Product Launch',
    description: 'New product line launch campaign',
    startDate: '2025-05-15',
    endDate: '2025-07-15',
    status: 'active',
    commissionType: 'percentage',
    commissionValue: 15,
    referrals: 256,
    conversions: 78,
    totalCommission: 2345.10,
  },
  {
    id: 3,
    name: 'Membership',
    description: 'Monthly membership promotion',
    startDate: '2025-04-01',
    endDate: '2025-12-31',
    status: 'active',
    commissionType: 'fixed',
    commissionValue: 25,
    referrals: 124,
    conversions: 67,
    totalCommission: 1675.00,
  },
  {
    id: 4,
    name: 'Course Promo',
    description: 'Online course promotion',
    startDate: '2025-03-15',
    endDate: '2025-05-15',
    status: 'inactive',
    commissionType: 'percentage',
    commissionValue: 30,
    referrals: 356,
    conversions: 112,
    totalCommission: 5040.30,
  },
  {
    id: 5,
    name: 'Holiday Special',
    description: 'End of year holiday promotion',
    startDate: '2025-11-15',
    endDate: '2025-12-31',
    status: 'draft',
    commissionType: 'percentage',
    commissionValue: 20,
    referrals: 0,
    conversions: 0,
    totalCommission: 0,
  },
];

const AdminCampaigns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Partial<Campaign> | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productName: '',
    productPrice: '',
    productImageUrl: '',
    commissionType: 'percentage',
    commissionValue: '',
    maxCommission: '',
    startDate: '',
    endDate: '',
    trackingUrl: '',
    isActive: true,
    allowedAffiliates: [] as string[]
  });

  // Fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await campaignApi.getCampaigns();
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
        updatedAt: new Date().toISOString()
      })));
    } finally {
      setLoading(false);
    }
  };

  // Open modal for creating a new campaign
  const openCreateModal = () => {
    setCurrentCampaign(null);
    setFormData({
      name: '',
      description: '',
      productName: '',
      productPrice: '',
      productImageUrl: '',
      commissionType: 'percentage',
      commissionValue: '',
      maxCommission: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      trackingUrl: '',
      isActive: true,
      allowedAffiliates: []
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing campaign
  const openEditModal = (campaign: Campaign) => {
    setCurrentCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      productName: campaign.product.name,
      productPrice: campaign.product.price.toString(),
      productImageUrl: campaign.product.imageUrl || '',
      commissionType: campaign.commissionType,
      commissionValue: campaign.commissionValue.toString(),
      maxCommission: campaign.maxCommission?.toString() || '',
      startDate: new Date(campaign.startDate).toISOString().split('T')[0],
      endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
      trackingUrl: campaign.trackingUrl,
      isActive: campaign.isActive,
      allowedAffiliates: Array.isArray(campaign.allowedAffiliates) 
        ? campaign.allowedAffiliates.map(a => typeof a === 'string' ? a : a.id)
        : []
    });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the data for API
    const campaignData = {
      name: formData.name,
      description: formData.description,
      product: {
        name: formData.productName,
        price: parseFloat(formData.productPrice),
        imageUrl: formData.productImageUrl || undefined
      },
      commissionType: formData.commissionType as 'percentage' | 'fixed',
      commissionValue: parseFloat(formData.commissionValue),
      maxCommission: formData.maxCommission ? parseFloat(formData.maxCommission) : undefined,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      trackingUrl: formData.trackingUrl,
      isActive: formData.isActive,
      allowedAffiliates: formData.allowedAffiliates
    };
    
    try {
      if (currentCampaign) {
        // Update existing campaign
        await campaignApi.updateCampaign(currentCampaign._id as string, campaignData);
      } else {
        // Create new campaign
        await campaignApi.createCampaign(campaignData);
      }
      
      // Refresh the campaign list
      fetchCampaigns();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving campaign:', err);
      setError(err.message || 'Failed to save campaign');
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Campaigns</h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-2">
            Manage your affiliate marketing campaigns
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            animation="bounce"
            onClick={openCreateModal}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Campaign Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            ></div>
            
            <motion.div 
              className="relative bg-white dark:bg-secondary-800 rounded-lg shadow-xl max-w-3xl w-full mx-auto p-6 z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                  {currentCampaign ? 'Edit Campaign' : 'Create New Campaign'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input
                      label="Campaign Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-secondary-900 dark:text-white bg-white dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Product Name"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Product Price"
                      name="productPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.productPrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Input
                      label="Product Image URL (optional)"
                      name="productImageUrl"
                      value={formData.productImageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      Commission Type
                    </label>
                    <select
                      name="commissionType"
                      value={formData.commissionType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-secondary-900 dark:text-white bg-white dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  
                  <div>
                    <Input
                      label={formData.commissionType === 'percentage' ? 'Commission (%)' : 'Commission Amount ($)'}
                      name="commissionValue"
                      type="number"
                      step={formData.commissionType === 'percentage' ? '0.1' : '0.01'}
                      min="0"
                      value={formData.commissionValue}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  {formData.commissionType === 'percentage' && (
                    <div>
                      <Input
                        label="Max Commission ($, optional)"
                        name="maxCommission"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.maxCommission}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                  
                  <div>
                    <Input
                      label="Start Date"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="End Date (optional)"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Input
                      label="Tracking URL"
                      name="trackingUrl"
                      value={formData.trackingUrl}
                      onChange={handleInputChange}
                      placeholder="https://yourdomain.com/product-page"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                        Campaign is active
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                    className="mr-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    {currentCampaign ? 'Update Campaign' : 'Create Campaign'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}

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
              <option value="draft">Draft</option>
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
          <p className="text-secondary-500 dark:text-secondary-400">No campaigns found. Create your first campaign!</p>
        </Card>
      ) : (
        // Campaign List
        <div className="grid grid-cols-1 gap-6">
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
                className="overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-1 p-4">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                            {campaign.name}
                          </h3>
                          <span
                            className={`ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                campaign.isActive
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}
                          >
                            {campaign.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                          {campaign.description}
                        </p>
                        <div className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                          <span className="inline-block mr-4">
                            <span className="font-medium text-secondary-700 dark:text-secondary-300">Start:</span>{' '}
                            {new Date(campaign.startDate).toLocaleDateString()}
                          </span>
                          {campaign.endDate && (
                            <span className="inline-block">
                              <span className="font-medium text-secondary-700 dark:text-secondary-300">End:</span>{' '}
                              {new Date(campaign.endDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="hidden md:flex md:flex-col md:items-end">
                        <div className="font-semibold text-secondary-900 dark:text-white">
                          Commission: {campaign.commissionType === 'percentage' ? campaign.commissionValue + '%' : '$' + campaign.commissionValue}
                        </div>
                        <div className="text-sm text-secondary-500 dark:text-secondary-400">
                          Product: {campaign.product.name} (${campaign.product.price.toFixed(2)})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary-50 dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 px-4 py-3">
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex space-x-6">
                      {/* Would be replaced with actual data from referrals in a real implementation */}
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Referrals</span>
                        <span className="mt-1 text-xl font-semibold text-secondary-900 dark:text-white">0</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Conversions</span>
                        <span className="mt-1 text-xl font-semibold text-secondary-900 dark:text-white">0</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Commission</span>
                        <span className="mt-1 text-xl font-semibold text-secondary-900 dark:text-white">$0</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3 sm:mt-0">
                      <Button variant="primary" size="sm" outlined>
                        View Details
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        outlined
                        onClick={() => openEditModal(campaign)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCampaigns; 