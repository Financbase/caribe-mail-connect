// Partner Management Platform Types

export interface Partner {
  id: string;
  name: string;
  type: 'business' | 'vendor' | 'affiliate' | 'integration';
  logo: string;
  website: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactPerson: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  rating: number; // 1-5 stars
  joinDate: string;
  lastActivity: string;
  revenue: number;
  commission: number;
  performanceScore: number; // 0-100
  tags: string[];
  notes: string;
}

export interface PartnerContract {
  id: string;
  partnerId: string;
  contractNumber: string;
  type: 'service' | 'affiliate' | 'integration' | 'vendor';
  status: 'draft' | 'active' | 'expired' | 'terminated';
  startDate: string;
  endDate: string;
  renewalDate: string;
  terms: string;
  commissionRate: number;
  paymentTerms: string;
  documents: ContractDocument[];
  milestones: ContractMilestone[];
  totalValue: number;
  currency: string;
}

export interface ContractDocument {
  id: string;
  name: string;
  type: 'contract' | 'amendment' | 'addendum' | 'certificate';
  url: string;
  uploadDate: string;
  expiryDate?: string;
}

export interface ContractMilestone {
  id: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  value: number;
}

export interface Commission {
  id: string;
  partnerId: string;
  period: string; // YYYY-MM
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentDate?: string;
  reference: string;
  breakdown: CommissionBreakdown[];
}

export interface CommissionBreakdown {
  type: 'referral' | 'service' | 'product' | 'integration';
  description: string;
  amount: number;
  quantity: number;
  rate: number;
}

export interface Vendor extends Partner {
  vendorType: 'supplier' | 'service-provider' | 'contractor' | 'consultant';
  categories: string[];
  certifications: VendorCertification[];
  insurance: VendorInsurance;
  qualityRating: number;
  complianceScore: number;
  procurementHistory: ProcurementRecord[];
}

export interface VendorCertification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
}

export interface VendorInsurance {
  type: string;
  provider: string;
  policyNumber: string;
  coverage: number;
  expiryDate: string;
}

export interface ProcurementRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  invoiceId?: string;
}

export interface AffiliateProgram {
  id: string;
  partnerId: string;
  referralCode: string;
  commissionStructure: CommissionStructure;
  marketingMaterials: MarketingMaterial[];
  performance: AffiliatePerformance;
  paymentHistory: AffiliatePayment[];
}

export interface CommissionStructure {
  baseRate: number;
  tiers: CommissionTier[];
  bonuses: CommissionBonus[];
  restrictions: string[];
}

export interface CommissionTier {
  level: number;
  minSales: number;
  rate: number;
  description: string;
}

export interface CommissionBonus {
  type: 'seasonal' | 'volume' | 'special' | 'milestone';
  description: string;
  rate: number;
  conditions: string;
  validFrom: string;
  validTo: string;
}

export interface MarketingMaterial {
  id: string;
  name: string;
  type: 'banner' | 'email' | 'social' | 'video' | 'brochure';
  url: string;
  description: string;
  tags: string[];
  usageCount: number;
  conversionRate: number;
}

export interface AffiliatePerformance {
  totalReferrals: number;
  successfulReferrals: number;
  conversionRate: number;
  totalRevenue: number;
  totalCommission: number;
  monthlyStats: MonthlyStats[];
}

export interface MonthlyStats {
  month: string;
  referrals: number;
  conversions: number;
  revenue: number;
  commission: number;
}

export interface AffiliatePayment {
  id: string;
  date: string;
  amount: number;
  method: 'bank-transfer' | 'paypal' | 'check' | 'crypto';
  status: 'pending' | 'processed' | 'completed' | 'failed';
  reference: string;
}

export interface IntegrationPartner extends Partner {
  apiAccess: ApiAccess;
  technicalDocs: TechnicalDocument[];
  supportTickets: SupportTicket[];
  usageMetrics: UsageMetrics;
  slaAgreement: SLAAgreement;
}

export interface ApiAccess {
  apiKey: string;
  permissions: string[];
  rateLimit: number;
  lastUsed: string;
  usageCount: number;
  status: 'active' | 'suspended' | 'expired';
}

export interface TechnicalDocument {
  id: string;
  title: string;
  type: 'api-docs' | 'sdk' | 'tutorial' | 'faq' | 'changelog';
  url: string;
  version: string;
  lastUpdated: string;
  downloads: number;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
}

export interface UsageMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  peakUsage: number;
  monthlyUsage: MonthlyUsage[];
}

export interface MonthlyUsage {
  month: string;
  requests: number;
  errors: number;
  responseTime: number;
}

export interface SLAAgreement {
  uptime: number; // percentage
  responseTime: number; // milliseconds
  supportResponseTime: number; // hours
  penalties: SLAPenalty[];
  lastReview: string;
  nextReview: string;
}

export interface SLAPenalty {
  type: 'uptime' | 'response-time' | 'support';
  threshold: number;
  penalty: number;
  description: string;
}

export interface PartnerAnalytics {
  partnerId: string;
  period: string;
  revenue: {
    total: number;
    byService: Record<string, number>;
    byMonth: Record<string, number>;
  };
  performance: {
    score: number;
    metrics: PerformanceMetric[];
    trends: PerformanceTrend[];
  };
  growth: {
    opportunities: GrowthOpportunity[];
    recommendations: string[];
    riskFactors: RiskFactor[];
  };
  relationship: {
    score: number;
    factors: RelationshipFactor[];
    history: RelationshipEvent[];
  };
}

export interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface PerformanceTrend {
  metric: string;
  values: { date: string; value: number }[];
  forecast: { date: string; value: number }[];
}

export interface GrowthOpportunity {
  id: string;
  title: string;
  description: string;
  potentialRevenue: number;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  status: 'identified' | 'in-progress' | 'implemented' | 'closed';
}

export interface RiskFactor {
  type: 'financial' | 'operational' | 'compliance' | 'reputational';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-1
  impact: number; // 0-1
  mitigation: string;
}

export interface RelationshipFactor {
  factor: string;
  score: number;
  weight: number;
  description: string;
}

export interface RelationshipEvent {
  date: string;
  type: 'meeting' | 'contract' | 'issue' | 'milestone' | 'review';
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface CollaborationWorkflow {
  id: string;
  partnerId: string;
  type: 'project' | 'campaign' | 'integration' | 'support';
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  participants: WorkflowParticipant[];
  tasks: WorkflowTask[];
  milestones: WorkflowMilestone[];
  documents: WorkflowDocument[];
}

export interface WorkflowParticipant {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'inactive';
}

export interface WorkflowTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  completedDate?: string;
  dependencies: string[];
}

export interface WorkflowMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  tasks: string[];
}

export interface WorkflowDocument {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'presentation';
  url: string;
  uploadDate: string;
  uploadedBy: string;
  version: string;
}

// API Response Types
export interface PartnersResponse {
  partners: Partner[];
  total: number;
  page: number;
  limit: number;
  filters: PartnerFilters;
}

export interface PartnerFilters {
  type?: string[];
  status?: string[];
  rating?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface PartnerStats {
  totalPartners: number;
  activePartners: number;
  totalRevenue: number;
  averageRating: number;
  topPerformers: Partner[];
  recentActivity: PartnerActivity[];
}

export interface PartnerActivity {
  id: string;
  partnerId: string;
  type: 'contract-signed' | 'commission-earned' | 'milestone-reached' | 'issue-reported';
  description: string;
  timestamp: string;
  data: Record<string, any>;
} 