// Security System Types for PRMCMS

export type SecurityLevel = 'low' | 'medium' | 'high' | 'critical';
export type SessionStatus = 'active' | 'expired' | 'terminated' | 'suspicious';
export type LoginStatus = 'success' | 'failed' | 'blocked' | 'suspicious';
export type PermissionAction = 'read' | 'write' | 'delete' | 'admin' | 'export';
export type AuditEventType = 'login' | 'logout' | 'data_access' | 'data_modification' | 'permission_change' | 'security_incident';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type EncryptionStatus = 'encrypted' | 'unencrypted' | 'pending' | 'failed';
export type DataRetentionStatus = 'active' | 'expired' | 'pending_deletion' | 'archived';

// Session Management
export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  sessionToken: string;
  ipAddress: string;
  userAgent: string;
  location: {
    country: string;
    city: string;
    coordinates?: [number, number];
  };
  deviceInfo: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
    fingerprint: string;
  };
  status: SessionStatus;
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
  isCurrentSession: boolean;
  riskScore: number;
  suspiciousFlags: string[];
}

// Failed Login Attempts
export interface FailedLoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  reason: string;
  location: {
    country: string;
    city: string;
    coordinates?: [number, number];
  };
  attemptCount: number;
  isBlocked: boolean;
  blockExpiresAt?: string;
}

// Suspicious Activity
export interface SuspiciousActivity {
  id: string;
  userId?: string;
  userName?: string;
  activityType: string;
  description: string;
  severity: SecurityLevel;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location: {
    country: string;
    city: string;
  };
  riskScore: number;
  indicators: string[];
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  notes?: string;
}

// Access Control
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: PermissionAction;
  conditions?: {
    timeRestrictions?: {
      startTime: string;
      endTime: string;
      daysOfWeek: number[];
    };
    ipRestrictions?: string[];
    deviceRestrictions?: string[];
  };
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  userCount: number;
  securityLevel: SecurityLevel;
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface ApiToken {
  id: string;
  name: string;
  userId: string;
  token: string;
  permissions: string[];
  ipRestrictions?: string[];
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  isActive: boolean;
}

// Audit System
export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  eventType: AuditEventType;
  description: string;
  resource: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  metadata: Record<string, any>;
  severity: SecurityLevel;
  sessionId?: string;
  location: {
    country: string;
    city: string;
  };
}

export interface AuditFilter {
  startDate?: string;
  endDate?: string;
  userId?: string;
  eventType?: AuditEventType;
  severity?: SecurityLevel;
  ipAddress?: string;
  resource?: string;
  action?: string;
}

// Data Protection
export interface DataAsset {
  id: string;
  name: string;
  description: string;
  category: 'pii' | 'financial' | 'operational' | 'system';
  sensitivity: SecurityLevel;
  location: string;
  encryptionStatus: EncryptionStatus;
  retentionPolicy: {
    retentionPeriod: number; // days
    retentionType: 'legal' | 'operational' | 'regulatory';
    autoDelete: boolean;
  };
  accessControls: {
    roles: string[];
    ipRestrictions?: string[];
    timeRestrictions?: {
      startTime: string;
      endTime: string;
      daysOfWeek: number[];
    };
  };
  lastAudit: string;
  nextAudit: string;
  complianceStatus: 'compliant' | 'non_compliant' | 'pending_review';
}

export interface RetentionPolicy {
  id: string;
  name: string;
  description: string;
  dataCategories: string[];
  retentionPeriod: number;
  retentionType: 'legal' | 'operational' | 'regulatory';
  autoDelete: boolean;
  notificationDays: number[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DataPurgeJob {
  id: string;
  policyId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  recordsProcessed: number;
  recordsDeleted: number;
  errors: string[];
  initiatedBy: string;
}

// Incident Response
export interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  category: string;
  reportedAt: string;
  reportedBy: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Investigation details
  investigation: {
    startedAt?: string;
    investigator?: string;
    findings?: string;
    rootCause?: string;
    timeline: IncidentTimelineEvent[];
  };
  
  // Response details
  response: {
    team: string[];
    actions: IncidentAction[];
    containmentTime?: string;
    resolutionTime?: string;
  };
  
  // Evidence
  evidence: EvidenceItem[];
  
  // Impact assessment
  impact: {
    affectedUsers: number;
    affectedData: string[];
    businessImpact: string;
    financialImpact?: number;
  };
  
  // Compliance
  compliance: {
    gdprRelevant: boolean;
    notificationRequired: boolean;
    notificationSent?: string;
    regulatoryReporting?: string[];
  };
  
  tags: string[];
  notes: string[];
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  description: string;
  actor: string;
  evidence?: string[];
}

export interface IncidentAction {
  id: string;
  action: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface EvidenceItem {
  id: string;
  type: 'log' | 'screenshot' | 'file' | 'network' | 'system';
  name: string;
  description: string;
  collectedAt: string;
  collectedBy: string;
  location: string;
  hash?: string;
  size?: number;
  isPreserved: boolean;
}

// Security Dashboard
export interface SecurityMetrics {
  activeSessions: number;
  failedLogins24h: number;
  suspiciousActivities: number;
  openIncidents: number;
  securityScore: number;
  lastUpdated: string;
}

export interface SecurityScore {
  overall: number;
  breakdown: {
    accessControl: number;
    dataProtection: number;
    incidentResponse: number;
    auditCompliance: number;
    networkSecurity: number;
  };
  factors: {
    positive: string[];
    negative: string[];
  };
  lastCalculated: string;
}

export interface ThreatIndicator {
  id: string;
  type: 'network' | 'application' | 'data' | 'user';
  severity: SecurityLevel;
  description: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
  affectedResources: string[];
  recommendedActions: string[];
}

// IP Whitelisting
export interface IpWhitelist {
  id: string;
  ipAddress: string;
  description: string;
  addedBy: string;
  addedAt: string;
  expiresAt?: string;
  isActive: boolean;
  allowedServices: string[];
  notes?: string;
}

// Time-based Access Rules
export interface TimeBasedRule {
  id: string;
  name: string;
  description: string;
  userIds: string[];
  roleIds: string[];
  timeRestrictions: {
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    timezone: string;
  };
  ipRestrictions?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// GDPR Compliance
export interface GdprRequest {
  id: string;
  userId: string;
  requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  submittedAt: string;
  completedAt?: string;
  description: string;
  dataIdentified: string[];
  actionsTaken: string[];
  notes?: string;
}

export interface DataSubject {
  id: string;
  identifier: string;
  identifierType: 'email' | 'phone' | 'customer_id' | 'employee_id';
  consentStatus: {
    marketing: boolean;
    analytics: boolean;
    necessary: boolean;
    thirdParty: boolean;
  };
  lastConsentUpdate: string;
  dataRetention: {
    category: string;
    retentionPeriod: number;
    expiresAt: string;
  }[];
  gdprRequests: string[];
} 