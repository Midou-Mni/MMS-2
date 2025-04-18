import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';

// Mock data for the dashboard
const dashboardData = {
  totalAffiliates: 142,
  totalCampaigns: 24,
  totalReferrals: 3867,
  totalConversions: 927,
  totalCommission: 32589.75,
  recentPayouts: [
    { id: 1, affiliate: 'John Doe', amount: 1250.00, status: 'completed', date: '2025-04-10' },
    { id: 2, affiliate: 'Jane Smith', amount: 845.50, status: 'pending', date: '2025-04-12' },
    { id: 3, affiliate: 'Michael Brown', amount: 2340.25, status: 'processing', date: '2025-04-13' },
    { id: 4, affiliate: 'Sarah Johnson', amount: 560.00, status: 'completed', date: '2025-04-09' },
    { id: 5, affiliate: 'David Wilson', amount: 1125.75, status: 'pending', date: '2025-04-14' },
  ],
  topAffiliates: [
    { id: 1, name: 'John Doe', referrals: 325, conversions: 98, commission: 4250.50 },
    { id: 2, name: 'Jane Smith', referrals: 287, conversions: 76, commission: 3150.25 },
    { id: 3, name: 'Michael Brown', referrals: 243, conversions: 62, commission: 2840.75 },
    { id: 4, name: 'Sarah Johnson', referrals: 198, conversions: 45, commission: 1980.00 },
    { id: 5, name: 'David Wilson', referrals: 156, conversions: 32, commission: 1560.50 },
  ],
  performanceByMonth: [
    { month: 'Jan', referrals: 245, conversions: 62, commission: 2450 },
    { month: 'Feb', referrals: 285, conversions: 75, commission: 2950 },
    { month: 'Mar', referrals: 325, conversions: 89, commission: 3560 },
    { month: 'Apr', referrals: 356, conversions: 98, commission: 3980 },
    { month: 'May', referrals: 310, conversions: 87, commission: 3420 },
    { month: 'Jun', referrals: 295, conversions: 76, commission: 3150 },
  ],
};

const AdminDashboard: React.FC = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-2">
          Overview of your affiliate marketing system
        </p>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card
            title="Total Affiliates"
            className="h-full"
            animation="fade"
            hover
            bordered
          >
            <div className="flex items-center">
              <div className="rounded-full bg-primary-100 dark:bg-primary-800 p-3 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-600 dark:text-primary-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="block text-4xl font-bold text-secondary-900 dark:text-white">
                  {dashboardData.totalAffiliates}
                </span>
                <span className="block text-sm text-green-600 dark:text-green-400">
                  +12% from last month
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card
            title="Active Campaigns"
            className="h-full"
            animation="fade"
            hover
            bordered
          >
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-800 p-3 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <span className="block text-4xl font-bold text-secondary-900 dark:text-white">
                  {dashboardData.totalCampaigns}
                </span>
                <span className="block text-sm text-green-600 dark:text-green-400">
                  +5% from last month
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card
            title="Total Referrals"
            className="h-full"
            animation="fade"
            hover
            bordered
          >
            <div className="flex items-center">
              <div className="rounded-full bg-amber-100 dark:bg-amber-800 p-3 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600 dark:text-amber-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <span className="block text-4xl font-bold text-secondary-900 dark:text-white">
                  {dashboardData.totalReferrals.toLocaleString()}
                </span>
                <span className="block text-sm text-green-600 dark:text-green-400">
                  +18% from last month
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card
            title="Total Commission"
            className="h-full"
            animation="fade"
            hover
            bordered
          >
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 dark:bg-green-800 p-3 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600 dark:text-green-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="block text-4xl font-bold text-secondary-900 dark:text-white">
                  ${dashboardData.totalCommission.toLocaleString()}
                </span>
                <span className="block text-sm text-green-600 dark:text-green-400">
                  +22% from last month
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent Payouts and Top Affiliates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card
          title="Recent Payouts"
          animation="slide"
          bordered
          elevation="md"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead className="bg-secondary-50 dark:bg-secondary-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                  >
                    Affiliate
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                {dashboardData.recentPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                      {payout.affiliate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      ${payout.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${payout.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                            payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}
                      >
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                      {payout.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title="Top Affiliates"
          animation="slide"
          bordered
          elevation="md"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead className="bg-secondary-50 dark:bg-secondary-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                  >
                    Affiliate
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                  >
                    Referrals
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                  >
                    Conv.
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                  >
                    Commission
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                {dashboardData.topAffiliates.map((affiliate) => (
                  <tr key={affiliate.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                      {affiliate.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {affiliate.referrals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {affiliate.conversions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      ${affiliate.commission.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card
        title="Monthly Performance"
        animation="fade"
        bordered
        elevation="md"
        className="mb-8"
      >
        <div className="h-80 px-4 py-2">
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-primary-500 rounded-full mr-2"></span>
              <span className="text-sm text-secondary-700 dark:text-secondary-300">Referrals</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm text-secondary-700 dark:text-secondary-300">Conversions</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
              <span className="text-sm text-secondary-700 dark:text-secondary-300">Commission ($)</span>
            </div>
          </div>
          <div className="h-64 flex items-end">
            {dashboardData.performanceByMonth.map((data, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center justify-end h-full"
              >
                <div className="relative w-full flex justify-center mb-2 group">
                  <motion.div
                    className="w-8 bg-amber-500 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.commission / 4000) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  ></motion.div>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-secondary-900 dark:bg-secondary-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity">
                    ${data.commission}
                  </div>
                </div>
                <div className="relative w-full flex justify-center mb-2 group">
                  <motion.div
                    className="w-8 bg-green-500 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.conversions / 100) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  ></motion.div>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-secondary-900 dark:bg-secondary-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity">
                    {data.conversions}
                  </div>
                </div>
                <div className="relative w-full flex justify-center mb-4 group">
                  <motion.div
                    className="w-8 bg-primary-500 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.referrals / 400) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  ></motion.div>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-secondary-900 dark:bg-secondary-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity">
                    {data.referrals}
                  </div>
                </div>
                <span className="text-xs text-secondary-500 dark:text-secondary-400">
                  {data.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard; 