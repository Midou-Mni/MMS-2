import React, { ReactNode, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import ThemeToggle from '../ui/ThemeToggle';

export interface AppLayoutProps {
  children?: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = () => {
  const { logout, user, isAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Define navigation based on user role
  const navigation = isAdmin
    ? [
        { name: 'Dashboard', href: '/admin/dashboard', icon: 'ChartBarIcon' },
        { name: 'Campaigns', href: '/admin/campaigns', icon: 'FlagIcon' },
        { name: 'Affiliates', href: '/admin/affiliates', icon: 'UsersIcon' },
        { name: 'Students', href: '/admin/students', icon: 'UserGroupIcon' },
        { name: 'Referrals', href: '/admin/referrals', icon: 'CursorClickIcon' },
        { name: 'Payouts', href: '/admin/payouts', icon: 'CashIcon' },
        { name: 'Settings', href: '/admin/settings', icon: 'CogIcon' },
      ]
    : [
        { name: 'Dashboard', href: '/affiliate/dashboard', icon: 'ChartBarIcon' },
        { name: 'Campaigns', href: '/affiliate/campaigns', icon: 'FlagIcon' },
        { name: 'Referrals', href: '/affiliate/referrals', icon: 'CursorClickIcon' },
        { name: 'Students', href: '/affiliate/students', icon: 'UserGroupIcon' },
        { name: 'Earnings', href: '/affiliate/earnings', icon: 'CashIcon' },
        { name: 'Profile', href: '/affiliate/profile', icon: 'UserIcon' },
      ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={closeSidebar}
        ></motion.div>

        <motion.nav
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 bottom-0 flex flex-col w-80 max-w-xs bg-white dark:bg-gray-800 h-full"
        >
          <div className="flex items-center justify-between h-16 px-6 bg-primary-700 dark:bg-primary-800">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">Affiliate System</span>
            </div>
            <button
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none"
              onClick={closeSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 h-0 overflow-y-auto">
            <div className="px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname.includes(item.href)
                      ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  } group flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors duration-150`}
                  onClick={closeSidebar}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-600 dark:bg-primary-700 flex items-center justify-center text-white">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700 dark:text-gray-200">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
              <ThemeToggle className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2" />
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-5 lg:pb-4 lg:bg-white lg:dark:bg-gray-800 lg:border-r lg:border-gray-200 lg:dark:border-gray-700">
        <div className="flex items-center justify-between flex-shrink-0 px-6">
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">Affiliate System</span>
          <ThemeToggle className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md" />
        </div>
        
        <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
          <nav className="px-3 mt-6">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname.includes(item.href)
                      ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  } group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-primary-600 dark:bg-primary-700 flex items-center justify-center text-white">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.firstName} {user?.lastName}
              </p>
              <button
                onClick={logout}
                className="text-xs font-medium text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 lg:hidden shadow">
          <button
            type="button"
            className="px-4 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>
          
          <div className="flex-1 flex justify-between px-4">
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400 sm:truncate">
                Affiliate System
              </h1>
            </div>
            <div className="flex items-center">
              <ThemeToggle className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md" />
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout; 