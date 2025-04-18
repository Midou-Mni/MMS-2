// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'affiliate';
  isActive: boolean;
  payoutDetails?: PayoutDetails;
  createdAt: string;
}

export interface PayoutDetails {
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  paypalEmail?: string;
  preferredMethod: 'bank' | 'paypal' | '';
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Campaign types
export interface Campaign {
  _id: string;
  name: string;
  description: string;
  product: Product;
  commissionType: 'percentage' | 'fixed';
  commissionValue: number;
  maxCommission?: number;
  startDate: string;
  endDate?: string;
  trackingUrl: string;
  isActive: boolean;
  createdBy: User | string;
  allowedAffiliates: User[] | string[];
  createdAt: string;
  updatedAt: string;
  referralCode?: string;
  referralLink?: string;
}

export interface Product {
  name: string;
  price: number;
  imageUrl?: string;
}

// Referral types
export interface Referral {
  _id: string;
  campaign: Campaign | string;
  affiliate: User | string;
  referralCode: string;
  clicks: number;
  conversions: number;
  earnings: number;
  referralDetails: ReferralDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface ReferralDetail {
  ip: string;
  userAgent: string;
  timestamp: string;
  converted: boolean;
  conversionTimestamp?: string;
  conversionValue?: number;
  commissionEarned?: number;
}

export interface ReferralStats {
  totalReferrals: number;
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  conversionRate: number;
}

// Payout types
export interface Payout {
  _id: string;
  affiliate: User | string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: 'bank' | 'paypal' | 'other';
  paymentDetails?: {
    transactionId?: string;
    receipts?: string[];
    notes?: string;
  };
  processedBy?: User | string;
  processedAt?: string;
  referrals: Referral[] | string[];
  period: {
    startDate: string;
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Dashboard types
export interface AdminDashboardStats {
  counts: {
    users: number;
    affiliates: number;
    campaigns: number;
  };
  referrals: {
    clicks: number;
    conversions: number;
    commissions: number;
    conversionRate: number;
  };
  payouts: {
    paid: number;
    pending: number;
  };
  recent: {
    campaigns: Campaign[];
    affiliates: User[];
  };
}

export interface AffiliateDashboardStats {
  counts: {
    campaigns: number;
    referrals: number;
  };
  performance: {
    clicks: number;
    conversions: number;
    earnings: number;
    paidOut: number;
    pending: number;
    conversionRate: number;
  };
  recent: {
    referrals: Referral[];
    payouts: Payout[];
  };
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
} 