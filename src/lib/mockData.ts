import type { Contract, Notification, AnalyticsData, MonthlyData } from '@/types';

const CONTRACTS_KEY = 'uc_contracts';

const SAMPLE_CONTRACTS: Contract[] = [
  {
    id: 'c1',
    title: 'Software Development Agreement – TechNova',
    type: 'Service Agreement',
    status: 'active',
    parties: [
      { id: 'p1', name: 'UniqueContracts', email: 'legal@uniquecontracts.com', role: 'sender', signed: true, signedAt: '2025-01-15' },
      { id: 'p2', name: 'TechNova Pvt Ltd', email: 'cto@technova.in', role: 'signer', signed: true, signedAt: '2025-01-16' },
    ],
    createdBy: 'u2',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-16',
    expiresAt: '2026-01-15',
    value: 1500000,
    currency: '₹',
    tags: ['Technology', 'Development', 'Annual'],
    version: 3,
    signatures: [
      { id: 's1', userId: 'u2', userName: 'Priya Sharma', signedAt: '2025-01-15', ipAddress: '192.168.1.1' },
    ],
    approvals: [
      { id: 'a1', userId: 'u4', userName: 'Admin User', status: 'approved', comment: 'Reviewed and approved.', timestamp: '2025-01-14' },
    ],
    content: 'This Software Development Agreement is entered into as of January 10, 2025...',
    riskScore: 15,
  },
  {
    id: 'c2',
    title: 'Influencer Marketing Campaign – FreshBrew',
    type: 'Influencer Agreement',
    status: 'pending_signature',
    parties: [
      { id: 'p3', name: 'FreshBrew Co.', email: 'marketing@freshbrew.com', role: 'sender', signed: true, signedAt: '2025-03-01' },
      { id: 'p4', name: 'Aryan Kapoor', email: 'creator@demo.com', role: 'signer', signed: false },
    ],
    createdBy: 'u1',
    createdAt: '2025-03-01',
    updatedAt: '2025-03-05',
    expiresAt: '2025-06-01',
    value: 75000,
    currency: '₹',
    tags: ['Influencer', 'Marketing', 'FMCG'],
    version: 1,
    signatures: [],
    approvals: [],
    content: 'This Influencer Agreement is between FreshBrew Co. and Aryan Kapoor...',
    riskScore: 28,
  },
  {
    id: 'c3',
    title: 'Non-Disclosure Agreement – DataVault',
    type: 'NDA',
    status: 'draft',
    parties: [
      { id: 'p5', name: 'DataVault Analytics', email: 'legal@datavault.io', role: 'sender' },
    ],
    createdBy: 'u3',
    createdAt: '2025-03-10',
    updatedAt: '2025-03-10',
    currency: '₹',
    tags: ['NDA', 'Confidential', 'Analytics'],
    version: 1,
    signatures: [],
    approvals: [],
    content: 'This Non-Disclosure Agreement is between DataVault Analytics and...',
    riskScore: 10,
  },
  {
    id: 'c4',
    title: 'Annual Retainer Agreement – LegalFirst LLP',
    type: 'Retainer Agreement',
    status: 'pending_review',
    parties: [
      { id: 'p6', name: 'BrandEdge Corp', email: 'brand@demo.com', role: 'sender' },
      { id: 'p7', name: 'LegalFirst LLP', email: 'partners@legalfirst.in', role: 'signer' },
    ],
    createdBy: 'u2',
    createdAt: '2025-03-08',
    updatedAt: '2025-03-12',
    expiresAt: '2026-03-08',
    value: 480000,
    currency: '₹',
    tags: ['Legal', 'Retainer', 'Annual'],
    version: 2,
    signatures: [],
    approvals: [
      { id: 'a2', userId: 'u4', userName: 'Admin User', status: 'pending' },
    ],
    content: 'This Retainer Agreement is entered into between BrandEdge Corp and LegalFirst LLP...',
    riskScore: 22,
  },
  {
    id: 'c5',
    title: 'Brand Partnership Agreement – StyleCo',
    type: 'Partnership Agreement',
    status: 'expired',
    parties: [
      { id: 'p8', name: 'StyleCo India', email: 'partnerships@styleco.in', role: 'sender', signed: true, signedAt: '2024-03-01' },
      { id: 'p9', name: 'ContentHub', email: 'creator@demo.com', role: 'signer', signed: true, signedAt: '2024-03-02' },
    ],
    createdBy: 'u1',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-02',
    expiresAt: '2025-03-01',
    value: 200000,
    currency: '₹',
    tags: ['Partnership', 'Fashion', 'Influencer'],
    version: 1,
    signatures: [
      { id: 's2', userId: 'u1', userName: 'Aryan Kapoor', signedAt: '2024-03-02', ipAddress: '10.0.0.1' },
    ],
    approvals: [],
    content: 'This Brand Partnership Agreement is between StyleCo India and ContentHub...',
    riskScore: 5,
  },
];

export function getContracts(): Contract[] {
  const stored = localStorage.getItem(CONTRACTS_KEY);
  if (!stored) {
    localStorage.setItem(CONTRACTS_KEY, JSON.stringify(SAMPLE_CONTRACTS));
    return SAMPLE_CONTRACTS;
  }
  return JSON.parse(stored) as Contract[];
}

export function saveContract(contract: Contract): void {
  const contracts = getContracts();
  const idx = contracts.findIndex(c => c.id === contract.id);
  if (idx === -1) {
    contracts.unshift(contract);
  } else {
    contracts[idx] = contract;
  }
  localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));
}

export function deleteContract(id: string): void {
  const contracts = getContracts().filter(c => c.id !== id);
  localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));
}

export function createNewContract(title: string, type: string, createdBy: string): Contract {
  const contract: Contract = {
    id: `c_${Date.now()}`,
    title,
    type,
    status: 'draft',
    parties: [],
    createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currency: '₹',
    tags: [],
    version: 1,
    signatures: [],
    approvals: [],
    content: `This ${type} is entered into as of ${new Date().toLocaleDateString('en-IN')}...\n\n[PARTY A] and [PARTY B] agree to the following terms:\n\n1. SCOPE OF WORK\n\n2. PAYMENT TERMS\n\n3. CONFIDENTIALITY\n\n4. TERMINATION\n\n5. GOVERNING LAW`,
    riskScore: 0,
  };
  saveContract(contract);
  return contract;
}

export function getNotifications(): Notification[] {
  return [
    {
      id: 'n1',
      type: 'approval_needed',
      title: 'Approval Required',
      message: 'Annual Retainer Agreement – LegalFirst LLP needs your approval.',
      read: false,
      createdAt: '2025-03-12T10:30:00Z',
      contractId: 'c4',
    },
    {
      id: 'n2',
      type: 'expiry_alert',
      title: 'Contract Expiring Soon',
      message: 'Influencer Marketing Campaign – FreshBrew expires in 78 days.',
      read: false,
      createdAt: '2025-03-11T09:00:00Z',
      contractId: 'c2',
    },
    {
      id: 'n3',
      type: 'contract_signed',
      title: 'Contract Signed',
      message: 'Software Development Agreement – TechNova has been fully executed.',
      read: true,
      createdAt: '2025-01-16T14:22:00Z',
      contractId: 'c1',
    },
    {
      id: 'n4',
      type: 'system',
      title: 'AI Analysis Complete',
      message: 'Risk analysis for your NDA with DataVault is ready to review.',
      read: false,
      createdAt: '2025-03-10T16:45:00Z',
      contractId: 'c3',
    },
    {
      id: 'n5',
      type: 'comment',
      title: 'New Comment',
      message: 'Legal team added comments on clause 5 of LegalFirst Agreement.',
      read: true,
      createdAt: '2025-03-09T11:15:00Z',
      contractId: 'c4',
    },
  ];
}

export function getAnalytics(): AnalyticsData {
  const monthlyData: MonthlyData[] = [
    { month: 'Oct', contracts: 12, signed: 9, value: 850000 },
    { month: 'Nov', contracts: 18, signed: 14, value: 1200000 },
    { month: 'Dec', contracts: 22, signed: 19, value: 1800000 },
    { month: 'Jan', contracts: 28, signed: 24, value: 2100000 },
    { month: 'Feb', contracts: 31, signed: 27, value: 2450000 },
    { month: 'Mar', contracts: 35, signed: 29, value: 2800000 },
  ];

  return {
    totalContracts: 147,
    activeContracts: 89,
    pendingSignatures: 12,
    expiringSoon: 8,
    totalValue: 42500000,
    avgSigningTime: 2.4,
    completionRate: 87,
    monthlyData,
  };
}

export { BLOG_POSTS } from '@/constants';

export const AI_SUGGESTIONS = [
  "Add a Force Majeure clause to protect against unforeseen events.",
  "Include an Indemnification clause to limit liability exposure.",
  "Consider adding a Dispute Resolution clause for faster conflict resolution.",
  "Add specific deliverable milestones to the Payment Terms section.",
  "Include a Non-Solicitation clause to protect business interests.",
  "Add IP ownership clauses to clarify intellectual property rights.",
  "Consider including a Limitation of Liability cap.",
  "Add a Data Protection clause for GDPR/PDPB compliance.",
];

export const RISK_ITEMS = [
  { severity: 'high', description: 'Payment terms lack specific due dates and late payment penalties.', clause: 'Section 4.2' },
  { severity: 'medium', description: 'Termination clause missing without-cause termination provisions.', clause: 'Section 8.1' },
  { severity: 'low', description: 'Governing law jurisdiction not specified for international disputes.', clause: 'Section 12' },
];
