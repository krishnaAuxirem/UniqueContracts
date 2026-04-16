export type UserRole = 'creator' | 'brand' | 'analyst' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  lastLogin: string;
}

export interface Contract {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'pending_review' | 'pending_signature' | 'active' | 'expired' | 'terminated';
  parties: Party[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  value?: number;
  currency: string;
  tags: string[];
  version: number;
  signatures: Signature[];
  approvals: Approval[];
  content: string;
  templateId?: string;
  riskScore?: number;
}

export interface Party {
  id: string;
  name: string;
  email: string;
  role: 'sender' | 'signer' | 'approver' | 'viewer';
  signed?: boolean;
  signedAt?: string;
}

export interface Signature {
  id: string;
  userId: string;
  userName: string;
  signedAt: string;
  ipAddress: string;
}

export interface Approval {
  id: string;
  userId: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  timestamp?: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  clauses: number;
  usageCount: number;
  tags: string[];
  preview: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  coverImage: string;
  featured: boolean;
}

export interface Notification {
  id: string;
  type: 'contract_signed' | 'approval_needed' | 'expiry_alert' | 'comment' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  contractId?: string;
}

export interface AnalyticsData {
  totalContracts: number;
  activeContracts: number;
  pendingSignatures: number;
  expiringSoon: number;
  totalValue: number;
  avgSigningTime: number;
  completionRate: number;
  monthlyData: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  contracts: number;
  signed: number;
  value: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  currency: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}
