import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';

// Auth Components
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Admin Components
import AdminDashboard from './pages/admin/Dashboard';
import AdminCampaigns from './pages/admin/Campaigns';
import AdminAffiliates from './pages/admin/Affiliates';
import AdminReferrals from './pages/admin/Referrals';
import AdminPayouts from './pages/admin/Payouts';
import AdminSettings from './pages/admin/Settings';
import AdminStudents from './pages/admin/AdminStudents';

// Affiliate Components
import AffiliateDashboard from './pages/affiliate/Dashboard';
import AffiliateCampaigns from './pages/affiliate/Campaigns';
import AffiliateReferrals from './pages/affiliate/Referrals';
import AffiliateEarnings from './pages/affiliate/Earnings';
import AffiliateProfile from './pages/affiliate/Profile';
import AffiliateStudents from './pages/affiliate/Students';

// Layout Components
import AppLayout from './components/layout/AppLayout';

// Auth Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated, isAdmin, isAffiliate } = useAuth();

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute isAllowed={isAuthenticated && isAdmin} redirectPath="/login">
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
            <Route path="affiliates" element={<AdminAffiliates />} />
            <Route path="referrals" element={<AdminReferrals />} />
            <Route path="payouts" element={<AdminPayouts />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="students" element={<AdminStudents />} />
          </Route>

          {/* Affiliate Routes */}
          <Route path="/affiliate" element={
            <ProtectedRoute isAllowed={isAuthenticated && isAffiliate} redirectPath="/login">
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AffiliateDashboard />} />
            <Route path="campaigns" element={<AffiliateCampaigns />} />
            <Route path="referrals" element={<AffiliateReferrals />} />
            <Route path="earnings" element={<AffiliateEarnings />} />
            <Route path="profile" element={<AffiliateProfile />} />
            <Route path="students" element={<AffiliateStudents />} />
          </Route>

          {/* Redirect to appropriate dashboard based on role */}
          <Route path="/" element={
            isAuthenticated ? (
              isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/affiliate/dashboard" />
            ) : <Navigate to="/login" />
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
