export interface InsurancePolicy {
  id: string;
  customerId: string;
  customerName: string;
  policyNumber: string;
  insuranceCompany: InsuranceCompany;
  coverageType: CoverageType;
  coverageAmount: number;
  premium: number;
  deductible: number;
  startDate: string;
  endDate: string;
  status: PolicyStatus;
  autoRenew: boolean;
  documents: PolicyDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  policyId: string;
  customerId: string;
  customerName: string;
  packageId?: string;
  claimType: ClaimType;
  description: string;
  reportedAmount: number;
  estimatedAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  priority: ClaimPriority;
  reportedAt: string;
  assignedTo?: string;
  assignedAt?: string;
  resolvedAt?: string;
  timeline: ClaimTimelineEvent[];
  documents: ClaimDocument[];
  photos: ClaimPhoto[];
  notes: ClaimNote[];
  fraudScore?: number;
  riskLevel: RiskLevel;
}

export interface ClaimTimelineEvent {
  id: string;
  timestamp: string;
  eventType: TimelineEventType;
  description: string;
  performedBy: string;
  attachments?: string[];
}

export interface ClaimDocument {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  size: number;
}

export interface ClaimPhoto {
  id: string;
  url: string;
  description: string;
  uploadedAt: string;
  uploadedBy: string;
  damageType?: DamageType;
  location?: string;
}

export interface ClaimNote {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  isInternal: boolean;
}

export interface PolicyDocument {
  id: string;
  name: string;
  type: PolicyDocumentType;
  url: string;
  uploadedAt: string;
  size: number;
}

export interface InsuranceCompany {
  id: string;
  name: string;
  logo: string;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  rating: number;
  claimsProcessTime: number; // in days
  customerSatisfaction: number;
}

export interface CoverageTier {
  id: string;
  name: string;
  description: string;
  maxCoverage: number;
  basePremium: number;
  deductible: number;
  features: string[];
  recommendedFor: string[];
}

export interface RiskAssessment {
  id: string;
  customerId: string;
  score: number;
  factors: RiskFactor[];
  recommendations: string[];
  lastUpdated: string;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  score: number;
  description: string;
}

export interface FraudAlert {
  id: string;
  claimId: string;
  alertType: FraudAlertType;
  severity: AlertSeverity;
  description: string;
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  evidence: string[];
}

export interface InsuranceStats {
  totalPolicies: number;
  activePolicies: number;
  totalClaims: number;
  openClaims: number;
  totalPremium: number;
  totalPayouts: number;
  averageClaimAmount: number;
  claimsByStatus: Record<ClaimStatus, number>;
  claimsByType: Record<ClaimType, number>;
  monthlyTrends: MonthlyTrend[];
}

export interface MonthlyTrend {
  month: string;
  policies: number;
  claims: number;
  premium: number;
  payouts: number;
}

export type CoverageType = 
  | 'Basic' 
  | 'Standard' 
  | 'Premium' 
  | 'Enterprise' 
  | 'Custom';

export type PolicyStatus = 
  | 'Active' 
  | 'Pending' 
  | 'Expired' 
  | 'Cancelled' 
  | 'Suspended';

export type ClaimType = 
  | 'Package Damage' 
  | 'Package Loss' 
  | 'Package Delay' 
  | 'Theft' 
  | 'Natural Disaster' 
  | 'Handling Error' 
  | 'Other';

export type ClaimStatus = 
  | 'Reported' 
  | 'Under Review' 
  | 'Investigation' 
  | 'Documentation Required' 
  | 'Approved' 
  | 'Denied' 
  | 'Settled' 
  | 'Closed';

export type ClaimPriority = 
  | 'Low' 
  | 'Medium' 
  | 'High' 
  | 'Urgent' 
  | 'Critical';

export type TimelineEventType = 
  | 'Claim Filed' 
  | 'Assigned' 
  | 'Investigation Started' 
  | 'Documentation Requested' 
  | 'Documentation Received' 
  | 'Investigation Complete' 
  | 'Approved' 
  | 'Denied' 
  | 'Settlement Offered' 
  | 'Settlement Accepted' 
  | 'Payment Processed' 
  | 'Claim Closed';

export type DocumentType = 
  | 'Damage Report' 
  | 'Photos' 
  | 'Receipt' 
  | 'Invoice' 
  | 'Police Report' 
  | 'Witness Statement' 
  | 'Medical Report' 
  | 'Other';

export type PolicyDocumentType = 
  | 'Policy Certificate' 
  | 'Terms and Conditions' 
  | 'Coverage Details' 
  | 'Exclusions' 
  | 'Endorsements' 
  | 'Other';

export type DamageType = 
  | 'Physical Damage' 
  | 'Water Damage' 
  | 'Fire Damage' 
  | 'Impact Damage' 
  | 'Theft' 
  | 'Other';

export type FraudAlertType = 
  | 'Suspicious Pattern' 
  | 'Multiple Claims' 
  | 'Inconsistent Information' 
  | 'Fake Documents' 
  | 'Exaggerated Damages' 
  | 'Other';

export type AlertSeverity = 
  | 'Low' 
  | 'Medium' 
  | 'High' 
  | 'Critical';

export type RiskLevel = 
  | 'Low' 
  | 'Medium' 
  | 'High' 
  | 'Very High';

export interface CoverageCalculator {
  packageValue: number;
  coverageTier: CoverageType;
  deductible: number;
  premium: number;
  coverageAmount: number;
  monthlyCost: number;
  annualCost: number;
}

export interface ClaimsFilter {
  status?: ClaimStatus[];
  type?: ClaimType[];
  priority?: ClaimPriority[];
  dateRange?: {
    start: string;
    end: string;
  };
  assignedTo?: string;
  customerId?: string;
}

export interface PolicyFilter {
  status?: PolicyStatus[];
  coverageType?: CoverageType[];
  insuranceCompany?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  customerId?: string;
} 