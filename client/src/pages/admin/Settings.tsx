import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Affiliate Marketing System',
    siteUrl: 'https://affiliate.example.com',
    logoUrl: '',
    adminEmail: 'admin@example.com',
    defaultCommission: 10,
    commissionType: 'percentage',
    cookieLifetime: 30, // days
  });
  
  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    currency: 'USD',
    minimumPayout: 50,
    payoutSchedule: 'monthly',
    paypalEnabled: true,
    bankTransferEnabled: true,
    stripeEnabled: false,
    stripePublicKey: '',
    stripeSecretKey: '',
  });
  
  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    senderEmail: 'noreply@example.com',
    senderName: 'Affiliate System',
    emailNotifications: true,
  });
  
  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // State for saving status
  const [saveStatus, setSaveStatus] = useState({
    general: { saving: false, success: false, error: '' },
    payment: { saving: false, success: false, error: '' },
    email: { saving: false, success: false, error: '' },
    profile: { saving: false, success: false, error: '' },
  });
  
  // Update profile fields when user data is available
  useEffect(() => {
    if (user) {
      setProfileSettings(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }));
    }
  }, [user]);

  // Handle input changes for each settings section
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setGeneralSettings(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setGeneralSettings(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setGeneralSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setPaymentSettings(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setPaymentSettings(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setPaymentSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setEmailSettings(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setEmailSettings(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setEmailSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileSettings(prev => ({ ...prev, [name]: value }));
  };

  // Save settings functions
  const saveGeneralSettings = async () => {
    setSaveStatus(prev => ({ ...prev, general: { saving: true, success: false, error: '' } }));
    
    try {
      // In a real app, this would make an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      setSaveStatus(prev => ({ 
        ...prev, 
        general: { saving: false, success: true, error: '' } 
      }));
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ 
          ...prev, 
          general: { ...prev.general, success: false } 
        }));
      }, 3000);
    } catch (error: any) {
      setSaveStatus(prev => ({ 
        ...prev, 
        general: { saving: false, success: false, error: error.message || 'Failed to save settings' } 
      }));
    }
  };

  const savePaymentSettings = async () => {
    setSaveStatus(prev => ({ ...prev, payment: { saving: true, success: false, error: '' } }));
    
    try {
      // In a real app, this would make an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      setSaveStatus(prev => ({ 
        ...prev, 
        payment: { saving: false, success: true, error: '' } 
      }));
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ 
          ...prev, 
          payment: { ...prev.payment, success: false } 
        }));
      }, 3000);
    } catch (error: any) {
      setSaveStatus(prev => ({ 
        ...prev, 
        payment: { saving: false, success: false, error: error.message || 'Failed to save settings' } 
      }));
    }
  };

  const saveEmailSettings = async () => {
    setSaveStatus(prev => ({ ...prev, email: { saving: true, success: false, error: '' } }));
    
    try {
      // In a real app, this would make an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      setSaveStatus(prev => ({ 
        ...prev, 
        email: { saving: false, success: true, error: '' } 
      }));
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ 
          ...prev, 
          email: { ...prev.email, success: false } 
        }));
      }, 3000);
    } catch (error: any) {
      setSaveStatus(prev => ({ 
        ...prev, 
        email: { saving: false, success: false, error: error.message || 'Failed to save settings' } 
      }));
    }
  };

  const saveProfileSettings = async () => {
    setSaveStatus(prev => ({ ...prev, profile: { saving: true, success: false, error: '' } }));
    
    // Validate passwords if changing password
    if (profileSettings.newPassword) {
      if (profileSettings.newPassword !== profileSettings.confirmPassword) {
        setSaveStatus(prev => ({ 
          ...prev, 
          profile: { saving: false, success: false, error: 'New passwords do not match' } 
        }));
        return;
      }
      
      if (!profileSettings.currentPassword) {
        setSaveStatus(prev => ({ 
          ...prev, 
          profile: { saving: false, success: false, error: 'Current password is required' } 
        }));
        return;
      }
    }
    
    try {
      // In a real app, this would make an API call to update profile
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      setSaveStatus(prev => ({ 
        ...prev, 
        profile: { saving: false, success: true, error: '' } 
      }));
      
      // Reset password fields
      setProfileSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ 
          ...prev, 
          profile: { ...prev.profile, success: false } 
        }));
      }, 3000);
    } catch (error: any) {
      setSaveStatus(prev => ({ 
        ...prev, 
        profile: { saving: false, success: false, error: error.message || 'Failed to update profile' } 
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">System Settings</h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-2">
          Configure your affiliate marketing system
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card bordered className="sticky top-4">
            <nav className="space-y-1">
              <a href="#general" className="block px-3 py-2 rounded-md text-sm font-medium text-secondary-900 dark:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800 transition">
                General Settings
              </a>
              <a href="#payment" className="block px-3 py-2 rounded-md text-sm font-medium text-secondary-900 dark:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800 transition">
                Payment Settings
              </a>
              <a href="#email" className="block px-3 py-2 rounded-md text-sm font-medium text-secondary-900 dark:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800 transition">
                Email Settings
              </a>
              <a href="#profile" className="block px-3 py-2 rounded-md text-sm font-medium text-secondary-900 dark:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800 transition">
                Admin Profile
              </a>
            </nav>
          </Card>
        </div>
        
        {/* Settings Forms */}
        <div className="lg:col-span-5 space-y-6">
          {/* General Settings Section */}
          <div id="general">
            <Card bordered elevation="md">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">General Settings</h2>
              
              {saveStatus.general.error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
                  {saveStatus.general.error}
                </div>
              )}
              
              {saveStatus.general.success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded">
                  General settings saved successfully!
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Site Name"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div>
                  <Input
                    label="Site URL"
                    name="siteUrl"
                    value={generalSettings.siteUrl}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div>
                  <Input
                    label="Logo URL"
                    name="logoUrl"
                    value={generalSettings.logoUrl}
                    onChange={handleGeneralChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Input
                    label="Admin Email"
                    type="email"
                    name="adminEmail"
                    value={generalSettings.adminEmail}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div>
                  <Input
                    label="Default Commission (%)"
                    type="number"
                    name="defaultCommission"
                    value={generalSettings.defaultCommission.toString()}
                    onChange={handleGeneralChange}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Commission Type
                  </label>
                  <select
                    name="commissionType"
                    value={generalSettings.commissionType}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-secondary-900 dark:text-white bg-white dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <Input
                    label="Cookie Lifetime (days)"
                    type="number"
                    name="cookieLifetime"
                    value={generalSettings.cookieLifetime.toString()}
                    onChange={handleGeneralChange}
                    min="1"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button
                  variant="primary"
                  onClick={saveGeneralSettings}
                  disabled={saveStatus.general.saving}
                >
                  {saveStatus.general.saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Payment Settings Section */}
          <div id="payment">
            <Card bordered elevation="md">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">Payment Settings</h2>
              
              {saveStatus.payment.error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
                  {saveStatus.payment.error}
                </div>
              )}
              
              {saveStatus.payment.success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded">
                  Payment settings saved successfully!
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={paymentSettings.currency}
                    onChange={handlePaymentChange}
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-secondary-900 dark:text-white bg-white dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
                <div>
                  <Input
                    label="Minimum Payout Amount"
                    type="number"
                    name="minimumPayout"
                    value={paymentSettings.minimumPayout.toString()}
                    onChange={handlePaymentChange}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Payout Schedule
                  </label>
                  <select
                    name="payoutSchedule"
                    value={paymentSettings.payoutSchedule}
                    onChange={handlePaymentChange}
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-secondary-900 dark:text-white bg-white dark:bg-secondary-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <h3 className="font-medium text-secondary-900 dark:text-white mb-2">Payment Methods</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="paypalEnabled"
                        checked={paymentSettings.paypalEnabled}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      />
                      <span className="ml-2 text-secondary-700 dark:text-secondary-300">
                        PayPal
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="bankTransferEnabled"
                        checked={paymentSettings.bankTransferEnabled}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      />
                      <span className="ml-2 text-secondary-700 dark:text-secondary-300">
                        Bank Transfer
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="stripeEnabled"
                        checked={paymentSettings.stripeEnabled}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      />
                      <span className="ml-2 text-secondary-700 dark:text-secondary-300">
                        Stripe
                      </span>
                    </label>
                  </div>
                </div>
                
                {paymentSettings.stripeEnabled && (
                  <>
                    <div>
                      <Input
                        label="Stripe Public Key"
                        name="stripePublicKey"
                        value={paymentSettings.stripePublicKey}
                        onChange={handlePaymentChange}
                      />
                    </div>
                    <div>
                      <Input
                        label="Stripe Secret Key"
                        name="stripeSecretKey"
                        value={paymentSettings.stripeSecretKey}
                        onChange={handlePaymentChange}
                        type="password"
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button
                  variant="primary"
                  onClick={savePaymentSettings}
                  disabled={saveStatus.payment.saving}
                >
                  {saveStatus.payment.saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Email Settings Section */}
          <div id="email">
            <Card bordered elevation="md">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">Email Settings</h2>
              
              {saveStatus.email.error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
                  {saveStatus.email.error}
                </div>
              )}
              
              {saveStatus.email.success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded">
                  Email settings saved successfully!
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="SMTP Host"
                    name="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={handleEmailChange}
                  />
                </div>
                <div>
                  <Input
                    label="SMTP Port"
                    type="number"
                    name="smtpPort"
                    value={emailSettings.smtpPort.toString()}
                    onChange={handleEmailChange}
                  />
                </div>
                <div>
                  <Input
                    label="SMTP Username"
                    name="smtpUser"
                    value={emailSettings.smtpUser}
                    onChange={handleEmailChange}
                  />
                </div>
                <div>
                  <Input
                    label="SMTP Password"
                    type="password"
                    name="smtpPassword"
                    value={emailSettings.smtpPassword}
                    onChange={handleEmailChange}
                  />
                </div>
                <div>
                  <Input
                    label="Sender Email"
                    type="email"
                    name="senderEmail"
                    value={emailSettings.senderEmail}
                    onChange={handleEmailChange}
                  />
                </div>
                <div>
                  <Input
                    label="Sender Name"
                    name="senderName"
                    value={emailSettings.senderName}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={emailSettings.emailNotifications}
                      onChange={handleEmailChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <span className="ml-2 text-secondary-700 dark:text-secondary-300">
                      Enable email notifications
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button
                  variant="primary"
                  onClick={saveEmailSettings}
                  disabled={saveStatus.email.saving}
                >
                  {saveStatus.email.saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Admin Profile Section */}
          <div id="profile">
            <Card bordered elevation="md">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">Admin Profile</h2>
              
              {saveStatus.profile.error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
                  {saveStatus.profile.error}
                </div>
              )}
              
              {saveStatus.profile.success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded">
                  Profile updated successfully!
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="First Name"
                    name="firstName"
                    value={profileSettings.firstName}
                    onChange={handleProfileChange}
                  />
                </div>
                <div>
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={profileSettings.lastName}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={profileSettings.email}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <h3 className="col-span-2 font-medium text-secondary-900 dark:text-white mt-2">Change Password</h3>
                
                <div>
                  <Input
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={profileSettings.currentPassword}
                    onChange={handleProfileChange}
                  />
                </div>
                <div> </div>
                <div>
                  <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={profileSettings.newPassword}
                    onChange={handleProfileChange}
                  />
                </div>
                <div>
                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={profileSettings.confirmPassword}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button
                  variant="primary"
                  onClick={saveProfileSettings}
                  disabled={saveStatus.profile.saving}
                >
                  {saveStatus.profile.saving ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 