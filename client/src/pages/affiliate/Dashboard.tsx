import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for the affiliate dashboard
const dashboardData = {
  totalReferrals: 187,
  totalConversions: 43,
  conversionRate: 22.99,
  totalEarnings: 1628.75,
  pendingPayouts: 425.50,
  recentReferrals: [
    { id: 1, campaign: 'Summer Sale', date: '2025-04-12', status: 'converted', commission: 15.50 },
    { id: 2, campaign: 'Product Launch', date: '2025-04-11', status: 'clicked', commission: 0 },
    { id: 3, campaign: 'Membership', date: '2025-04-10', status: 'converted', commission: 25.00 },
    { id: 4, campaign: 'Course Promo', date: '2025-04-09', status: 'converted', commission: 45.00 },
    { id: 5, campaign: 'Summer Sale', date: '2025-04-08', status: 'clicked', commission: 0 },
  ],
  activeCampaigns: [
    { id: 1, name: 'Summer Sale', commission: '10%', conversions: 15, earnings: 250.50 },
    { id: 2, name: 'Product Launch', commission: '15%', conversions: 8, earnings: 180.75 },
    { id: 3, name: 'Membership', commission: '$25 flat', conversions: 12, earnings: 300.00 },
    { id: 4, name: 'Course Promo', commission: '30%', conversions: 6, earnings: 450.00 },
  ],
  earningsByMonth: [
    { month: 'Jan', earnings: 150 },
    { month: 'Feb', earnings: 220 },
    { month: 'Mar', earnings: 185 },
    { month: 'Apr', earnings: 390 },
    { month: 'May', earnings: 430 },
    { month: 'Jun', earnings: 340 },
  ],
};

const AffiliateDashboard: React.FC = () => {
  const { user } = useAuth();

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
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          Welcome Back, {user?.firstName || 'Affiliate'}!
        </h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-2">
          Here's an overview of your affiliate performance
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
            title="Total Referrals"
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
                  {dashboardData.totalReferrals}
                </span>
                <span className="block text-sm text-green-600 dark:text-green-400">
                  +7% from last month
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card
            title="Conversion Rate"
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <span className="block text-4xl font-bold text-secondary-900 dark:text-white">
                  {dashboardData.conversionRate}%
                </span>
                <span className="block text-sm text-green-600 dark:text-green-400">
                  +2.5% from last month
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card
            title="Total Earnings"
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
                  ${dashboardData.totalEarnings.toLocaleString()}
                </span>
                <span className="block text-sm text-green-600 dark:text-green-400">
                  +15% from last month
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card
            title="Pending Payout"
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="block text-4xl font-bold text-secondary-900 dark:text-white">
                  ${dashboardData.pendingPayouts.toLocaleString()}
                </span>
                <span className="block text-sm text-secondary-500 dark:text-secondary-400">
                  Estimated payout on May 1
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Your Links Section */}
      <Card
        title="Your Affiliate Links"
        bordered
        elevation="md"
        className="mb-8"
      >
        <div className="mb-4">
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            Share these links with your audience to earn commissions. Track performance in the campaigns section.
          </p>
          <Link to="/affiliate/campaigns">
            <Button variant="primary" size="sm">
              View All Campaigns
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
            <thead className="bg-secondary-50 dark:bg-secondary-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                >
                  Campaign
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                >
                  Commission
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                >
                  Conversions
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                >
                  Earnings
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
              {dashboardData.activeCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                    {campaign.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                    {campaign.commission}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                    {campaign.conversions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                    ${campaign.earnings.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                      aria-label={`Copy link for ${campaign.name}`}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://example.com/ref/${user?.id}/${campaign.id}`
                        );
                        alert('Link copied to clipboard!');
                      }}
                    >
                      Copy Link
                    </button>
                    <Link
                      to={`/affiliate/campaigns/${campaign.id}`}
                      className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Activity and Earnings Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card
          title="Recent Activity"
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
                    Campaign
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                  >
                    Date
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
                    Commission
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                {dashboardData.recentReferrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-white">
                      {referral.campaign}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                      {referral.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            referral.status === 'converted'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}
                      >
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white">
                      {referral.commission > 0
                        ? `$${referral.commission.toLocaleString()}`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title="Monthly Earnings"
          bordered
          elevation="md"
        >
          <div className="h-80">
            <div className="h-64 mt-4 flex items-end">
              {dashboardData.earningsByMonth.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                >
                  <div className="relative w-full flex justify-center mb-4 group">
                    <motion.div
                      className="w-8 bg-primary-500 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.earnings / 500) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    ></motion.div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-secondary-900 dark:bg-secondary-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity">
                      ${data.earnings}
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

      {/* Quick Tips */}
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 p-2 text-center md:text-left">
            <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-1">
              Tips to Boost Your Earnings
            </h3>
            <p className="text-sm text-primary-700 dark:text-primary-300">
              1. Share your affiliate links on social media channels.
              <br />
              2. Write product reviews to increase trust and conversions.
              <br />
              3. Create how-to guides or tutorials related to the products you promote.
            </p>
          </div>
          <div className="w-full md:w-auto p-2 mt-4 md:mt-0 text-center">
            <Link to="/affiliate/resources">
              <Button variant="primary" outlined size="sm">
                View Resources
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AffiliateDashboard; 