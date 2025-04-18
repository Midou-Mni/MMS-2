import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { payoutApi } from '../../services/api';
import { Payout } from '../../types';

// Mock data for payouts
const mockPayouts = [
  {
    _id: '1',
    affiliate: {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      payoutDetails: {
        preferredMethod: 'paypal',
        paypalEmail: 'john@paypal.com'
      }
    },
    amount: 250.75,
    status: 'pending',
    paymentMethod: 'paypal',
    referrals: [],
    period: {
      startDate: '2025-03-01',
      endDate: '2025-03-31'
    },
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-01T10:00:00Z'
  },
  {
    _id: '2',
    affiliate: {
      _id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      payoutDetails: {
        preferredMethod: 'bank',
        bankName: 'Chase Bank',
        accountNumber: '123456789'
      }
    },
    amount: 425.50,
    status: 'completed',
    paymentMethod: 'bank',
    paymentDetails: {
      transactionId: 'TRX-12345',
      notes: 'Paid via ACH transfer'
    },
    processedBy: {
      _id: 'admin1',
      firstName: 'Admin',
      lastName: 'User'
    },
    processedAt: '2025-04-02T14:30:00Z',
    referrals: [],
    period: {
      startDate: '2025-03-01',
      endDate: '2025-03-31'
    },
    createdAt: '2025-04-01T10:30:00Z',
    updatedAt: '2025-04-02T14:30:00Z'
  },
  {
    _id: '3',
    affiliate: {
      _id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike@example.com',
      payoutDetails: {
        preferredMethod: 'paypal',
        paypalEmail: 'mike@paypal.com'
      }
    },
    amount: 175.25,
    status: 'processing',
    paymentMethod: 'paypal',
    referrals: [],
    period: {
      startDate: '2025-03-01',
      endDate: '2025-03-31'
    },
    createdAt: '2025-04-01T11:15:00Z',
    updatedAt: '2025-04-03T09:45:00Z'
  }
];

const AdminPayouts: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [processingStatus, setProcessingStatus] = useState({
    inProgress: false,
    success: false,
    message: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({
    status: 'completed',
    transactionId: '',
    notes: ''
  });

  // Fetch payouts on component mount
  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const response = await payoutApi.getPayouts();
      setPayouts(response.data.data);
    } catch (err: any) {
      console.error('Error fetching payouts:', err);
      setError(err.message || 'Failed to load payouts');
      // Fall back to mock data
      setPayouts(mockPayouts as any);
    } finally {
      setLoading(false);
    }
  };

  // Apply all filters and sorting
  const filteredPayouts = payouts
    .filter(payout => {
      // Status filter
      if (statusFilter !== 'all' && payout.status !== statusFilter) {
        return false;
      }
      
      // Search term (affiliate name or email)
      const affiliateName = typeof payout.affiliate === 'string' 
        ? '' 
        : `${payout.affiliate.firstName} ${payout.affiliate.lastName}`.toLowerCase();
      
      const affiliateEmail = typeof payout.affiliate === 'string'
        ? ''
        : payout.affiliate.email.toLowerCase();
      
      if (searchTerm && 
          !affiliateName.includes(searchTerm.toLowerCase()) &&
          !affiliateEmail.includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortOrder === 'asc' 
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'amount':
          return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        case 'affiliateName':
          const aName = typeof a.affiliate === 'string' ? '' : `${a.affiliate.firstName} ${a.affiliate.lastName}`;
          const bName = typeof b.affiliate === 'string' ? '' : `${b.affiliate.firstName} ${b.affiliate.lastName}`;
          return sortOrder === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
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
      setSortOrder('desc');
    }
  };

  // Open payout processing modal
  const openPayoutModal = (payout: Payout) => {
    setSelectedPayout(payout);
    setPaymentDetails({
      status: 'completed',
      transactionId: '',
      notes: ''
    });
    setProcessingStatus({
      inProgress: false,
      success: false,
      message: ''
    });
    setShowPayoutModal(true);
  };

  // Process payout
  const processPayout = async () => {
    if (!selectedPayout) return;
    
    setProcessingStatus({
      inProgress: true,
      success: false,
      message: ''
    });

    try {
      await payoutApi.updatePayoutStatus(
        selectedPayout._id,
        paymentDetails.status as any,
        {
          transactionId: paymentDetails.transactionId,
          notes: paymentDetails.notes
        }
      );
      
      setProcessingStatus({
        inProgress: false,
        success: true,
        message: 'Payout processed successfully'
      });
      
      // Refresh payouts after successful processing
      fetchPayouts();
      
      // Close modal after a delay
      setTimeout(() => {
        setShowPayoutModal(false);
      }, 2000);
    } catch (err: any) {
      setProcessingStatus({
        inProgress: false,
        success: false,
        message: err.message || 'Failed to process payout'
      });
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Manage Payouts</h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-2">
            Process and track affiliate payouts
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            animation="bounce"
            onClick={() => {}} // Would connect to a create payout form
          >
            Create New Payout
          </Button>
        </div>
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

      {/* Stats Summary */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card bordered hover className="bg-secondary-50 dark:bg-secondary-800/50">
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Total Payouts</h3>
          <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-white">{payouts.length}</p>
        </Card>
        
        <Card bordered hover className="bg-secondary-50 dark:bg-secondary-800/50">
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Pending Amount</h3>
          <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-white">
            ${payouts
              .filter(p => p.status === 'pending')
              .reduce((sum, p) => sum + p.amount, 0)
              .toLocaleString()}
          </p>
        </Card>
        
        <Card bordered hover className="bg-secondary-50 dark:bg-secondary-800/50">
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Processing</h3>
          <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-white">
            ${payouts
              .filter(p => p.status === 'processing')
              .reduce((sum, p) => sum + p.amount, 0)
              .toLocaleString()}
          </p>
        </Card>
        
        <Card bordered hover className="bg-secondary-50 dark:bg-secondary-800/50">
          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Paid Out (Total)</h3>
          <p className="mt-2 text-3xl font-bold text-secondary-900 dark:text-white">
            ${payouts
              .filter(p => p.status === 'completed')
              .reduce((sum, p) => sum + p.amount, 0)
              .toLocaleString()}
          </p>
        </Card>
      </motion.div>
      
      {/* Filters */}
      <Card className="mb-8" bordered>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Search"
              placeholder="Search by affiliate name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-secondary-900 dark:text-white bg-white dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Payouts Table */}
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
            <p className="mt-3 text-secondary-500 dark:text-secondary-400">Loading payouts...</p>
          </div>
        ) : filteredPayouts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-secondary-500 dark:text-secondary-400">No payouts found matching your criteria.</p>
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
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('affiliateName')}
                  >
                    <div className="flex items-center">
                      Affiliate
                      {sortBy === 'affiliateName' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Period
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('amount')}
                  >
                    <div className="flex items-center">
                      Amount
                      {sortBy === 'amount' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-700">
                {filteredPayouts.map((payout) => (
                  <tr key={payout._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {typeof payout.affiliate === 'string' 
                        ? payout.affiliate 
                        : (
                          <div>
                            <div>{payout.affiliate.firstName} {payout.affiliate.lastName}</div>
                            <div className="text-xs text-secondary-500 dark:text-secondary-400">
                              {payout.affiliate.email}
                            </div>
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {new Date(payout.period.startDate).toLocaleDateString()} - {new Date(payout.period.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                      ${payout.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(payout.status)}`}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {payout.paymentMethod.charAt(0).toUpperCase() + payout.paymentMethod.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {payout.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => openPayoutModal(payout)}
                        >
                          Process
                        </Button>
                      )}
                      
                      {payout.status !== 'pending' && (
                        <Button
                          size="sm"
                          variant="primary"
                          outlined
                        >
                          Details
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Process Payout Modal */}
      {showPayoutModal && selectedPayout && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowPayoutModal(false)}
            ></div>
            
            <motion.div 
              className="relative bg-white dark:bg-secondary-800 rounded-lg shadow-xl max-w-lg w-full mx-auto p-6 z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                  Process Payout
                </h2>
                <button
                  onClick={() => setShowPayoutModal(false)}
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
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-500 dark:text-secondary-400">Affiliate:</span>
                  <span className="font-medium text-secondary-900 dark:text-white">
                    {typeof selectedPayout.affiliate === 'string' 
                      ? selectedPayout.affiliate 
                      : `${selectedPayout.affiliate.firstName} ${selectedPayout.affiliate.lastName}`}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-500 dark:text-secondary-400">Amount:</span>
                  <span className="font-medium text-secondary-900 dark:text-white">
                    ${selectedPayout.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-500 dark:text-secondary-400">Payment Method:</span>
                  <span className="font-medium text-secondary-900 dark:text-white">
                    {selectedPayout.paymentMethod.charAt(0).toUpperCase() + selectedPayout.paymentMethod.slice(1)}
                  </span>
                </div>
                {typeof selectedPayout.affiliate !== 'string' && selectedPayout.affiliate.payoutDetails && (
                  <div className="mt-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded">
                    <h3 className="text-sm font-medium text-secondary-900 dark:text-white mb-2">Payout Details</h3>
                    {selectedPayout.affiliate.payoutDetails.preferredMethod === 'paypal' && (
                      <div className="text-sm">
                        <span className="text-secondary-500 dark:text-secondary-400">PayPal Email: </span>
                        <span className="text-secondary-900 dark:text-white">{selectedPayout.affiliate.payoutDetails.paypalEmail}</span>
                      </div>
                    )}
                    {selectedPayout.affiliate.payoutDetails.preferredMethod === 'bank' && (
                      <div className="text-sm">
                        <div className="mb-1">
                          <span className="text-secondary-500 dark:text-secondary-400">Bank Name: </span>
                          <span className="text-secondary-900 dark:text-white">{selectedPayout.affiliate.payoutDetails.bankName}</span>
                        </div>
                        <div>
                          <span className="text-secondary-500 dark:text-secondary-400">Account Number: </span>
                          <span className="text-secondary-900 dark:text-white">
                            {(selectedPayout.affiliate.payoutDetails.accountNumber || '').slice(-4).padStart((selectedPayout.affiliate.payoutDetails.accountNumber || '').length, '*')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-secondary-900 dark:text-white bg-white dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={paymentDetails.status}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                
                <div>
                  <Input
                    label="Transaction ID"
                    placeholder="e.g. TRX-123456"
                    value={paymentDetails.transactionId}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, transactionId: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-secondary-900 dark:text-white bg-white dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Optional payment notes..."
                    value={paymentDetails.notes}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
              
              {processingStatus.message && (
                <div className={`mb-4 p-3 rounded ${processingStatus.success ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}>
                  {processingStatus.message}
                </div>
              )}
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPayoutModal(false)}
                  className="mr-3"
                  disabled={processingStatus.inProgress || processingStatus.success}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={processPayout}
                  loading={processingStatus.inProgress}
                  disabled={processingStatus.inProgress || processingStatus.success}
                >
                  {processingStatus.success ? 'Processed' : 'Process Payout'}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayouts; 