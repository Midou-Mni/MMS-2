import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const AffiliateProfile: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'personal' | 'payment' | 'security'>('personal');

  // Mock profile data
  const [profile, setProfile] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    state: 'California',
    city: 'San Francisco',
    address: '123 Market St'
  });

  // Mock payment info
  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'paypal',
    paypalEmail: 'john.doe@example.com',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    bankAddress: '',
    minimumPayout: 50
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (activeTab === 'personal') {
      setProfile(prev => ({ ...prev, [name]: value }));
    } else if (activeTab === 'payment') {
      setPaymentInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here
    alert('Profile updated successfully!');
  };

  const tabVariants = {
    active: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
    inactive: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">My Profile</h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-2">
          Manage your account settings and payment information
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-24 w-24 rounded-full bg-primary-600 dark:bg-primary-700 flex items-center justify-center text-white text-2xl font-bold mb-4">
                {profile.firstName?.charAt(0)}
                {profile.lastName?.charAt(0)}
              </div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Affiliate Partner</p>
            </div>
            
            <div className="space-y-1">
              <button 
                onClick={() => setActiveTab('personal')}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'personal' 
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                    : 'hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
                }`}
              >
                Personal Information
              </button>
              <button 
                onClick={() => setActiveTab('payment')}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'payment' 
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                    : 'hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
                }`}
              >
                Payment Settings
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'security' 
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                    : 'hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
                }`}
              >
                Security
              </button>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          {activeTab === 'personal' && (
            <motion.div
              variants={tabVariants}
              initial="inactive"
              animate="active"
              exit="inactive"
            >
              <Card title="Personal Information" bordered>
                <form onSubmit={handleSave}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="label">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="label">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="label">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="label">Country</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={profile.country}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="label">State/Province</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={profile.state}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="label">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={profile.city}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="label">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button type="submit" className="btn-primary relative z-10" style={{ pointerEvents: 'auto' }}>Save Changes</button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
          
          {activeTab === 'payment' && (
            <motion.div
              variants={tabVariants}
              initial="inactive"
              animate="active"
              exit="inactive"
            >
              <Card title="Payment Settings" bordered>
                <form onSubmit={handleSave}>
                  <div className="mb-6">
                    <label className="label">Payment Method</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className={`flex items-center p-4 rounded-md border cursor-pointer transition-all ${
                        paymentInfo.paymentMethod === 'paypal' 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-700' 
                          : 'border-secondary-300 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentInfo.paymentMethod === 'paypal'}
                          onChange={handleInputChange}
                          className="text-primary-600 dark:text-primary-400 focus:ring-primary-500 dark:focus:ring-primary-600"
                        />
                        <span className="ml-2 flex items-center">
                          <span className="font-medium text-secondary-900 dark:text-white ml-2">PayPal</span>
                        </span>
                      </label>
                      
                      <label className={`flex items-center p-4 rounded-md border cursor-pointer transition-all ${
                        paymentInfo.paymentMethod === 'bank' 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-700' 
                          : 'border-secondary-300 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={paymentInfo.paymentMethod === 'bank'}
                          onChange={handleInputChange}
                          className="text-primary-600 dark:text-primary-400 focus:ring-primary-500 dark:focus:ring-primary-600"
                        />
                        <span className="ml-2 flex items-center">
                          <span className="font-medium text-secondary-900 dark:text-white ml-2">Bank Transfer</span>
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  {paymentInfo.paymentMethod === 'paypal' && (
                    <div>
                      <label htmlFor="paypalEmail" className="label">PayPal Email</label>
                      <input
                        type="email"
                        id="paypalEmail"
                        name="paypalEmail"
                        value={paymentInfo.paypalEmail}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                  )}
                  
                  {paymentInfo.paymentMethod === 'bank' && (
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="bankName" className="label">Bank Name</label>
                        <input
                          type="text"
                          id="bankName"
                          name="bankName"
                          value={paymentInfo.bankName}
                          onChange={handleInputChange}
                          className="input"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="accountNumber" className="label">Account Number</label>
                          <input
                            type="text"
                            id="accountNumber"
                            name="accountNumber"
                            value={paymentInfo.accountNumber}
                            onChange={handleInputChange}
                            className="input"
                          />
                        </div>
                        <div>
                          <label htmlFor="routingNumber" className="label">Routing Number</label>
                          <input
                            type="text"
                            id="routingNumber"
                            name="routingNumber"
                            value={paymentInfo.routingNumber}
                            onChange={handleInputChange}
                            className="input"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="bankAddress" className="label">Bank Address</label>
                        <input
                          type="text"
                          id="bankAddress"
                          name="bankAddress"
                          value={paymentInfo.bankAddress}
                          onChange={handleInputChange}
                          className="input"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <label htmlFor="minimumPayout" className="label">Minimum Payout Amount ($)</label>
                    <input
                      type="number"
                      id="minimumPayout"
                      name="minimumPayout"
                      value={paymentInfo.minimumPayout}
                      onChange={handleInputChange}
                      min="10"
                      max="1000"
                      step="10"
                      className="input w-32"
                    />
                    <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                      You will only receive payments when your balance exceeds this amount
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <button type="submit" className="btn-primary relative z-10" style={{ pointerEvents: 'auto' }}>Save Payment Settings</button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
          
          {activeTab === 'security' && (
            <motion.div
              variants={tabVariants}
              initial="inactive"
              animate="active"
              exit="inactive"
            >
              <Card title="Security Settings" bordered>
                <form onSubmit={handleSave}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="label">Current Password</label>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            className="input"
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="label">New Password</label>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            className="input"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-secondary-200 dark:border-secondary-700">
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-secondary-700 dark:text-secondary-300">
                            Add an extra layer of security to your account
                          </p>
                          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                            We'll send you a code to verify your identity when you sign in
                          </p>
                        </div>
                        <div className="form-control">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" />
                            <div className={`w-11 h-6 bg-secondary-200 dark:bg-secondary-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-700`}></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-secondary-200 dark:border-secondary-700">
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">Sessions</h3>
                      <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                        Sessions are currently active on the following devices
                      </p>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-md border border-secondary-200 dark:border-secondary-700 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-secondary-900 dark:text-white">Current Device</p>
                            <p className="text-sm text-secondary-500 dark:text-secondary-400">Last active: Just now</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button type="submit" className="btn-primary">Update Security Settings</button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AffiliateProfile; 