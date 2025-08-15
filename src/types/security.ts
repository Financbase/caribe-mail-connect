/**
 * Security Types
 * Story 2.2: Advanced Security & Compliance
 * 
 * TypeScript types for advanced security features, compliance automation,
 * audit trails, and regulatory compliance
 */

// =====================================================
// ADVANCED SECURITY TYPES
// =====================================================

export interface SecurityMetrics {
  overall_score: number;
  active_threats: number;
  threat_trend: number;
  vulnerabilities: VulnerabilityMetrics;
  compliance_score: number;
  failed_logins: number;
  health_checks: SecurityHealthChecks;
  time_range: string;
  last_updated: string;
}

export interface VulnerabilityMetrics {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface SecurityHealthChecks {
  [key: string]: {
    status: 'healthy' | 'warning' | 'critical';
    last_check: string;
    details?: string;
  };
}

export interface ComplianceStatus {
  overall_score: number;
  frameworks_compliant: number;
  total_frameworks: number;
  framework_statuses: FrameworkStatus[];
  last_updated: string;
}

export interface FrameworkStatus {
  framework_id: string;
  framework_name: string;
  compliance_percentage: number;
  requirements_met: number;
  total_requirements: number;
  last_assessment: string;
  next_assessment: string;
  status: 'compliant' | 'partial' | 'non_compliant';
}

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: string;
  user_id?: string;
  old_data?: any;
  new_data?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface SecurityIncident {
  id: string;
  subscription_id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  category: string;
  affected_systems: string[];
  assigned_to?: string;
  resolution?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface ThreatIntelligence {
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  active_threats: number;
  blocked_attempts: number;
  threat_sources: ThreatSource[];
  recent_threats: ThreatEvent[];
  last_updated: string;
}

export interface ThreatSource {
  source: string;
  count: number;
  severity?: string;
}

export interface ThreatEvent {
  id: string;
  type: string;
  source: string;
  severity: string;
  blocked: boolean;
  timestamp: string;
  details: any;
}

export interface VulnerabilityReport {
  scan_id: string;
  subscription_id: string;
  scan_type: string;
  status: 'running' | 'completed' | 'failed';
  vulnerabilities: VulnerabilityMetrics;
  scan_duration?: number;
  started_at: string;
  completed_at?: string;
  details?: VulnerabilityDetail[];
}

export interface VulnerabilityDetail {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cvss_score?: number;
  cve_id?: string;
  affected_component: string;
  remediation: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  version?: string;
  requirements?: ComplianceRequirement[];
}

export interface ComplianceRequirement {
  id: string;
  framework_id: string;
  requirement_id: string;
  title: string;
  description: string;
  category: string;
  status: 'met' | 'partial' | 'not_met' | 'not_applicable';
  evidence?: string[];
  last_assessed: string;
  next_assessment: string;
}

export interface SecurityControl {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'enabled' | 'disabled' | 'partial';
  effectiveness: number;
  last_tested: string;
  next_test: string;
  owner: string;
}

// =====================================================
// DATA PROTECTION TYPES
// =====================================================

export interface DataProtectionPolicy {
  id: string;
  name: string;
  description: string;
  policy_type: 'retention' | 'encryption' | 'access_control' | 'data_loss_prevention';
  rules: DataProtectionRule[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DataProtectionRule {
  id: string;
  condition: string;
  action: string;
  parameters: Record<string, any>;
  priority: number;
}

export interface DataClassification {
  id: string;
  data_type: string;
  classification_level: 'public' | 'internal' | 'confidential' | 'restricted';
  retention_period: number;
  encryption_required: boolean;
  access_controls: string[];
}

// =====================================================
// ENCRYPTION TYPES
// =====================================================

export interface EncryptionStatus {
  data_at_rest: EncryptionConfig;
  data_in_transit: EncryptionConfig;
  data_in_use: EncryptionConfig;
  key_management: KeyManagementConfig;
}

export interface EncryptionConfig {
  enabled: boolean;
  algorithm: string;
  key_length: number;
  last_rotated: string;
  next_rotation: string;
}

export interface KeyManagementConfig {
  provider: string;
  key_rotation_enabled: boolean;
  rotation_frequency_days: number;
  backup_keys: number;
  hsm_enabled: boolean;
}

// =====================================================
// ACCESS CONTROL TYPES
// =====================================================

export interface AccessControlPolicy {
  id: string;
  name: string;
  description: string;
  policy_type: 'rbac' | 'abac' | 'mac';
  rules: AccessRule[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccessRule {
  id: string;
  subject: string;
  resource: string;
  action: string;
  condition?: string;
  effect: 'allow' | 'deny';
  priority: number;
}

export interface PrivilegedAccess {
  id: string;
  user_id: string;
  resource: string;
  access_level: string;
  justification: string;
  approved_by: string;
  granted_at: string;
  expires_at: string;
  revoked_at?: string;
}

// =====================================================
// MONITORING TYPES
// =====================================================

export interface SecurityMonitoring {
  id: string;
  monitor_type: 'intrusion_detection' | 'anomaly_detection' | 'compliance_monitoring';
  name: string;
  description: string;
  rules: MonitoringRule[];
  alerts: SecurityAlert[];
  is_active: boolean;
}

export interface MonitoringRule {
  id: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: string;
}

export interface SecurityAlert {
  id: string;
  monitor_id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'acknowledged' | 'resolved' | 'false_positive';
  triggered_at: string;
  resolved_at?: string;
  metadata: Record<string, any>;
}

// =====================================================
// RISK ASSESSMENT TYPES
// =====================================================

export interface RiskAssessment {
  id: string;
  subscription_id: string;
  assessment_type: 'security' | 'compliance' | 'operational';
  scope: string;
  risks: IdentifiedRisk[];
  overall_risk_score: number;
  conducted_by: string;
  conducted_at: string;
  next_assessment: string;
}

export interface IdentifiedRisk {
  id: string;
  title: string;
  description: string;
  category: string;
  likelihood: number;
  impact: number;
  risk_score: number;
  mitigation_strategies: string[];
  status: 'identified' | 'mitigating' | 'mitigated' | 'accepted';
  owner: string;
}

// =====================================================
// INCIDENT RESPONSE TYPES
// =====================================================

export interface IncidentResponsePlan {
  id: string;
  name: string;
  description: string;
  incident_types: string[];
  response_steps: ResponseStep[];
  escalation_matrix: EscalationLevel[];
  is_active: boolean;
}

export interface ResponseStep {
  id: string;
  step_number: number;
  title: string;
  description: string;
  responsible_role: string;
  estimated_duration: number;
  dependencies: string[];
}

export interface EscalationLevel {
  level: number;
  severity_threshold: string;
  notification_targets: string[];
  escalation_delay_minutes: number;
}

export interface IncidentResponse {
  id: string;
  incident_id: string;
  plan_id: string;
  status: 'initiated' | 'in_progress' | 'completed';
  current_step: number;
  started_at: string;
  completed_at?: string;
  response_log: ResponseLogEntry[];
}

export interface ResponseLogEntry {
  id: string;
  timestamp: string;
  action: string;
  performed_by: string;
  details: string;
  step_id?: string;
}
