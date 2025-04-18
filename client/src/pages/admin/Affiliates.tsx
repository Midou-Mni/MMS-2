import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { adminApi, authApi } from '../../services/api';
import { User } from '../../types';

// Mock data for affiliates
const mockAffiliates: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'affiliate' as const,
    isActive: true,
    createdAt: '2023-06-15T12:00:00Z',
    payoutDetails: {
      bankName: 'Chase Bank',
      accountNumber: 'XXXX-XXXX-1234',
      routingNumber: 'XXX-XXX-XXX',
      preferredMethod: 'bank'
    }
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    role: 'affiliate' as const,
    isActive: true,
    createdAt: '2023-07-20T10:30:00Z',
    payoutDetails: {
      paypalEmail: 'jane@paypal.com',
      preferredMethod: 'paypal'
    }
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@example.com',
    role: 'affiliate' as const,
    isActive: false,
    createdAt: '2023-05-10T09:15:00Z'
  }
];

const AdminAffiliates: React.FC = () => {
  // State for affiliates list
  const [affiliates, setAffiliates] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // State for affiliate form modal
  const [showModal, setShowModal] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isActive: true
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch affiliates on component mount
  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers();
      // Filter out admin users, we only want affiliates
      const affiliatesOnly = response.data.data.filter(user => user.role === 'affiliate');
      setAffiliates(affiliatesOnly);
    } catch (err: any) {
      console.error('Error fetching affiliates:', err);
      setError(err.message || 'Failed to load affiliates');
      // Fall back to mock data
      setAffiliates(mockAffiliates);
    } finally {
      setLoading(false);
    }
  };

  // Apply all filters and sorting
  const filteredAffiliates = affiliates
    .filter(affiliate => {
      // Status filter
      if (statusFilter === 'active' && !affiliate.isActive) return false;
      if (statusFilter === 'inactive' && affiliate.isActive) return false;
      
      // Search term (name or email)
      const fullName = `${affiliate.firstName} ${affiliate.lastName}`.toLowerCase();
      if (searchTerm && 
          !fullName.includes(searchTerm.toLowerCase()) && 
          !affiliate.email.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const aName = `${a.firstName} ${a.lastName}`;
          const bName = `${b.firstName} ${b.lastName}`;
          return sortOrder === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
        case 'email':
          return sortOrder === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
        case 'date':
          return sortOrder === 'asc' 
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  // Toggle sort order
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  // Handle affiliate form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Open modal to add new affiliate
  const handleAddAffiliate = () => {
    setEditingAffiliate(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      isActive: true
    });
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  // Open modal to edit existing affiliate
  const handleEditAffiliate = (affiliate: User) => {
    setEditingAffiliate(affiliate);
    setFormData({
      firstName: affiliate.firstName,
      lastName: affiliate.lastName,
      email: affiliate.email,
      password: '', // Don't include password when editing
      isActive: affiliate.isActive
    });
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  // Submit affiliate form (add or edit)
  const handleSubmitAffiliateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsSubmitting(true);

    try {
      if (editingAffiliate) {
        // Update existing affiliate
        await adminApi.updateUser(editingAffiliate.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          isActive: formData.isActive
        });
        setFormSuccess('Affiliate updated successfully');
      } else {
        // Create new affiliate
        if (!formData.password) {
          throw new Error('Password is required for new affiliates');
        }
        
        await authApi.register(
          formData.firstName,
          formData.lastName,
          formData.email,
          formData.password,
          'affiliate'
        );
        setFormSuccess('Affiliate created successfully');
      }
      
      // Refresh the affiliate list
      fetchAffiliates();
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save affiliate');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle affiliate active status
  const toggleAffiliateStatus = async (affiliate: User) => {
    try {
      await adminApi.updateUser(affiliate.id, {
        isActive: !affiliate.isActive
      });
      // Update local state to reflect the change
      setAffiliates(prevAffiliates => 
        prevAffiliates.map(a => 
          a.id === affiliate.id 
            ? { ...a, isActive: !a.isActive } 
            : a
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update affiliate status');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Manage Affiliates</h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-2">
          View and manage all your affiliate partners
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
      
      {/* Filters and Actions */}
      <Card className="mb-8" bordered>
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="w-full md:w-64">
              <Input
                label="Search"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-secondary-900 dark:text-white bg-white dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Affiliates</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
            
            <Button
              size="md"
              variant="secondary"
              outlined
              onClick={resetFilters}
              className="self-end"
            >
              Reset Filters
            </Button>
          </div>
          
          <Button
            size="md"
            variant="primary"
            onClick={handleAddAffiliate}
          >
            Add New Affiliate
          </Button>
        </div>
      </Card>
      
      {/* Affiliates Table */}
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
            <p className="mt-3 text-secondary-500 dark:text-secondary-400">Loading affiliates...</p>
          </div>
        ) : filteredAffiliates.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-secondary-500 dark:text-secondary-400">No affiliates found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead className="bg-secondary-50 dark:bg-secondary-800">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center">
                      Affiliate Name
                      {sortBy === 'name' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      {sortBy === 'email' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Payout Method
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center">
                      Joined
                      {sortBy === 'date' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-700">
                {filteredAffiliates.map((affiliate) => (
                  <tr key={affiliate.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {affiliate.firstName} {affiliate.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {affiliate.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {affiliate.payoutDetails?.preferredMethod === 'bank' && (
                        <span>Bank Transfer</span>
                      )}
                      {affiliate.payoutDetails?.preferredMethod === 'paypal' && (
                        <span>PayPal</span>
                      )}
                      {(!affiliate.payoutDetails || !affiliate.payoutDetails.preferredMethod) && (
                        <span className="text-secondary-500 dark:text-secondary-400">Not Set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {new Date(affiliate.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {affiliate.isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          outlined
                          onClick={() => handleEditAffiliate(affiliate)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant={affiliate.isActive ? "danger" : "success"}
                          outlined
                          onClick={() => toggleAffiliateStatus(affiliate)}
                        >
                          {affiliate.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Affiliate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-secondary-900 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowModal(false)}
            ></div>
            
            {/* Center modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative inline-block transform overflow-hidden rounded-lg bg-white dark:bg-secondary-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
              style={{ zIndex: 51 }}
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-secondary-900 dark:text-white">
                      {editingAffiliate ? 'Edit Affiliate' : 'Add New Affiliate'}
                    </h3>
                    
                    {/* Form Messages */}
                    {formError && (
                      <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded">
                        {formError}
                      </div>
                    )}
                    
                    {formSuccess && (
                      <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm rounded">
                        {formSuccess}
                      </div>
                    )}
                    
                    {/* Affiliate Form */}
                    <form onSubmit={handleSubmitAffiliateForm} className="mt-4" style={{ pointerEvents: 'auto' }}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                          <Input
                            label="First Name"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Last Name"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        {!editingAffiliate && (
                          <div className="col-span-2">
                            <Input
                              label="Password"
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              required={!editingAffiliate}
                              placeholder="Password for new account"
                            />
                          </div>
                        )}
                        <div className="col-span-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="isActive"
                              checked={formData.isActive}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                            />
                            <span className="text-sm text-secondary-700 dark:text-secondary-300">
                              Affiliate is active
                            </span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end space-x-3 relative z-20">
                        <Button
                          type="button"
                          variant="secondary"
                          outlined
                          onClick={() => setShowModal(false)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Affiliate'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAffiliates; 