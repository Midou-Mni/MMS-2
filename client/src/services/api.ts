import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthResponse, ApiResponse, User, Campaign, Referral, Payout, AdminDashboardStats, AffiliateDashboardStats, ReferralStats } from '../types';

// Create an axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (firstName: string, lastName: string, email: string, password: string, role?: 'admin' | 'affiliate'): Promise<AxiosResponse<ApiResponse<AuthResponse>>> => 
    api.post('/auth/register', { firstName, lastName, email, password, role }),
  
  login: (email: string, password: string): Promise<AxiosResponse<ApiResponse<AuthResponse>>> => 
    api.post('/auth/login', { email, password }),
  
  getProfile: (): Promise<AxiosResponse<ApiResponse<{ user: User }>>> => 
    api.get('/auth/me'),
};

// Admin API
export const adminApi = {
  getUsers: (): Promise<AxiosResponse<ApiResponse<User[]>>> => 
    api.get('/admin/users'),
  
  getUserById: (id: string): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.get(`/admin/users/${id}`),
  
  updateUser: (id: string, userData: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.put(`/admin/users/${id}`, userData),
  
  deleteUser: (id: string): Promise<AxiosResponse<ApiResponse<{}>>> => 
    api.delete(`/admin/users/${id}`),
  
  getDashboardStats: (): Promise<AxiosResponse<ApiResponse<AdminDashboardStats>>> => 
    api.get('/admin/stats/dashboard'),
};

// Campaign API
export const campaignApi = {
  getCampaigns: (): Promise<AxiosResponse<ApiResponse<Campaign[]>>> => 
    api.get('/campaigns'),
  
  getCampaign: (id: string): Promise<AxiosResponse<ApiResponse<Campaign>>> => 
    api.get(`/campaigns/${id}`),
  
  createCampaign: (campaignData: Partial<Campaign>): Promise<AxiosResponse<ApiResponse<Campaign>>> => 
    api.post('/campaigns', campaignData),
  
  updateCampaign: (id: string, campaignData: Partial<Campaign>): Promise<AxiosResponse<ApiResponse<Campaign>>> => 
    api.put(`/campaigns/${id}`, campaignData),
  
  deleteCampaign: (id: string): Promise<AxiosResponse<ApiResponse<{}>>> => 
    api.delete(`/campaigns/${id}`),
  
  getAffiliateCampaigns: (): Promise<AxiosResponse<ApiResponse<Campaign[]>>> => 
    api.get('/affiliate/campaigns'),
};

// Referral API
export const referralApi = {
  getAllReferrals: (): Promise<AxiosResponse<ApiResponse<Referral[]>>> => 
    api.get('/referrals'),
  
  getAffiliateReferrals: (): Promise<AxiosResponse<ApiResponse<Referral[]>>> => 
    api.get('/affiliate/referrals'),
  
  getAdminStats: (): Promise<AxiosResponse<ApiResponse<ReferralStats>>> => 
    api.get('/referrals/stats/admin'),
  
  getAffiliateStats: (): Promise<AxiosResponse<ApiResponse<ReferralStats>>> => 
    api.get('/affiliate/stats'),
  
  trackClick: (referralCode: string, ip: string, userAgent: string): Promise<AxiosResponse<ApiResponse<{ message: string }>>> => 
    api.post('/referrals/track-click', { referralCode, ip, userAgent }),
  
  registerConversion: (referralCode: string, conversionValue: number, ip: string, userAgent: string): Promise<AxiosResponse<ApiResponse<{ message: string }>>> => 
    api.post('/referrals/conversion', { referralCode, conversionValue, ip, userAgent }),
};

// Payout API
export const payoutApi = {
  getPayouts: (): Promise<AxiosResponse<ApiResponse<Payout[]>>> => 
    api.get('/payouts'),
  
  getAffiliatePayouts: (): Promise<AxiosResponse<ApiResponse<Payout[]>>> => 
    api.get('/affiliate/payouts'),
  
  createPayout: (payoutData: Partial<Payout>): Promise<AxiosResponse<ApiResponse<Payout>>> => 
    api.post('/payouts', payoutData),
  
  updatePayoutStatus: (id: string, status: Payout['status'], paymentDetails?: Payout['paymentDetails']): Promise<AxiosResponse<ApiResponse<Payout>>> => 
    api.put(`/payouts/${id}/status`, { status, paymentDetails }),
  
  calculatePendingAmount: (affiliateId: string): Promise<AxiosResponse<ApiResponse<{ pendingAmount: number; referralCount: number; unpaidReferrals: Referral[] }>>> => 
    api.get(`/payouts/pending-amount/${affiliateId}`),
  
  getAffiliatePendingAmount: (): Promise<AxiosResponse<ApiResponse<{ pendingAmount: number; referralCount: number }>>> => 
    api.get('/affiliate/payouts/pending'),
};

// Affiliate API
export const affiliateApi = {
  updateProfile: (profileData: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.put('/affiliate/profile', profileData),
  
  updatePassword: (currentPassword: string, newPassword: string): Promise<AxiosResponse<ApiResponse<{ message: string }>>> => 
    api.put('/affiliate/password', { currentPassword, newPassword }),
  
  getDashboard: (): Promise<AxiosResponse<ApiResponse<AffiliateDashboardStats>>> => 
    api.get('/affiliate/dashboard'),
};

export default api; 