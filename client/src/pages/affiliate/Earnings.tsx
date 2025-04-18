import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

// Mock data for earnings
const mockEarnings = {
  totalEarnings: 1250.75,
  availableBalance: 420.50,
  pendingBalance: 125.25,
  lifetimeReferrals: 78,
  conversionRate: 5.2,
  averageCommission: 16.03
};

// Mock data for transactions
const mockTransactions = [
  { 
    id: 'tr-1',
    date: '2023-06-15',
    type: 'commission',
    campaign: 'Summer Sale',
    amount: 42.50,
    status: 'paid'
  },
  { 
    id: 'tr-2',
    date: '2023-06-10',
    type: 'commission',
    campaign: 'Product Launch',
    amount: 65.75,
    status: 'paid'
  },
  { 
    id: 'tr-3',
    date: '2023-06-05',
    type: 'bonus',
    campaign: 'Referral Milestone',
    amount: 100.00,
    status: 'paid'
  },
  { 
    id: 'tr-4',
    date: '2023-05-28',
    type: 'commission',
    campaign: 'Spring Collection',
    amount: 38.25,
    status: 'paid'
  },
  { 
    id: 'tr-5',
    date: '2023-05-20',
    type: 'commission',
    campaign: 'New Customer Discount',
    amount: 12.75,
    status: 'pending'
  },
];

// Mock data for pending payouts
const mockPendingPayouts = [
  {
    id: 'payout-1',
    amount: 420.50,
    date: '2023-07-01',
    method: 'PayPal',
    status: 'scheduled'
  }
];

const AffiliateEarnings: React.FC = () => {
  const { theme } = useTheme();
  const [activeTimeRange, setActiveTimeRange] = useState<'thisMonth' | 'lastMonth' | 'thisYear' | 'allTime'>('thisMonth');
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'paid' | 'pending'>('all');

  // Filter transactions based on the selected filter
  const filteredTransactions = mockTransactions.filter(transaction => {
    if (transactionFilter === 'all') return true;
    return transaction.status === transactionFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">My Earnings</h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-2">
          Track your performance and manage your earnings
        </p>
      </div>

      {/* Time range selector */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 bg-white dark:bg-secondary-800 p-1 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 inline-flex">
          <button
            onClick={() => setActiveTimeRange('thisMonth')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTimeRange === 'thisMonth'
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setActiveTimeRange('lastMonth')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTimeRange === 'lastMonth'
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
            }`}
          >
            Last Month
          </button>
          <button
            onClick={() => setActiveTimeRange('thisYear')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTimeRange === 'thisYear'
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
            }`}
          >
            This Year
          </button>
          <button
            onClick={() => setActiveTimeRange('allTime')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTimeRange === 'allTime'
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">Earnings Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="stats-card" bordered>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Total Earnings</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">${mockEarnings.totalEarnings.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
          
          <Card className="stats-card" bordered>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Available Balance</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">${mockEarnings.availableBalance.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </Card>
          
          <Card className="stats-card" bordered>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Pending Balance</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">${mockEarnings.pendingBalance.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="stats-card" bordered>
            <div>
              <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Lifetime Referrals</p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">{mockEarnings.lifetimeReferrals}</p>
              <div className="mt-2">
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2.5">
                  <div className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">70% of target</p>
              </div>
            </div>
          </Card>
          
          <Card className="stats-card" bordered>
            <div>
              <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">{mockEarnings.conversionRate}%</p>
              <div className="mt-2">
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2.5">
                  <div className="bg-green-500 dark:bg-green-600 h-2.5 rounded-full" style={{ width: '52%' }}></div>
                </div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">Industry avg: 3.8%</p>
              </div>
            </div>
          </Card>
          
          <Card className="stats-card" bordered>
            <div>
              <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Avg. Commission</p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">${mockEarnings.averageCommission.toFixed(2)}</p>
              <div className="mt-2">
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2.5">
                  <div className="bg-blue-500 dark:bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">65% of potential</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">Transaction History</h2>
          <div className="flex">
            <button
              onClick={() => setTransactionFilter('all')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                transactionFilter === 'all'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTransactionFilter('paid')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ml-2 ${
                transactionFilter === 'paid'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setTransactionFilter('pending')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ml-2 ${
                transactionFilter === 'pending'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
              }`}
            >
              Pending
            </button>
          </div>
        </div>
        
        <Card bordered>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead className="bg-secondary-50 dark:bg-secondary-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-secondary-300">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-secondary-300 capitalize">
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-secondary-300">
                      {transaction.campaign}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-secondary-300">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'paid' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {transaction.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-secondary-500 dark:text-secondary-400">No transactions found.</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Pending Payouts */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">Pending Payouts</h2>
        <Card bordered>
          {mockPendingPayouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
                <thead className="bg-secondary-50 dark:bg-secondary-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                  {mockPendingPayouts.map(payout => (
                    <tr key={payout.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-secondary-300">
                        ${payout.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-secondary-300">
                        {new Date(payout.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-secondary-300">
                        {payout.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {payout.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-secondary-500 dark:text-secondary-400">No pending payouts at this time.</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Request Payout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card bordered className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-medium text-primary-900 dark:text-primary-300">Ready to withdraw your earnings?</h3>
              <p className="text-primary-700 dark:text-primary-400 mt-1">
                You have ${mockEarnings.availableBalance.toFixed(2)} available for payout
              </p>
            </div>
            <button className="btn-primary whitespace-nowrap">
              Request Payout
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AffiliateEarnings; 