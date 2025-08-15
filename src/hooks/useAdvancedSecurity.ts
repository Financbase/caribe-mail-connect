/**
 * Advanced Security Hook
 * Story 2.2: Advanced Security & Compliance
 * 
 * React hook for managing advanced security features, compliance automation,
 * audit trails, and regulatory compliance
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { AdvancedSecurityService } from '@/services/advancedSecurity';
import type { 
  SecurityMetrics,
  ComplianceStatus,
  AuditLog,
  SecurityIncident,
  ThreatIntelligence,
  VulnerabilityReport
} from '@/types/security';

// =====================================================
// ADVANCED SECURITY HOOK TYPES
// =====================================================

interface UseAdvancedSecurityState {
  securityMetrics: SecurityMetrics | null;
  complianceStatus: ComplianceStatus | null;
  auditLogs: AuditLog[];
  securityIncidents: SecurityIncident[];
  threatIntelligence: ThreatIntelligence | null;
  vulnerabilityScans: VulnerabilityReport[];
  isLoading: boolean;
  error: string | null;
}

interface UseAdvancedSecurityActions {
  // Data refresh
  refreshSecurityData: (timeRange?: string) => Promise<void>;
  refreshComplianceStatus: () => Promise<void>;
  refreshAuditLogs: (filters?: any) => Promise<void>;
  
  // Security operations
  runVulnerabilityScans: () => Promise<VulnerabilityReport | null>;
  createSecurityIncident: (incident: Partial<SecurityIncident>) => Promise<SecurityIncident | null>;
  updateSecurityIncident: (incidentId: string, updates: Partial<SecurityIncident>) => Promise<boolean>;
  
  // Compliance operations
  generateComplianceReport: (frameworkId?: string) => Promise<Blob | null>;
  scheduleComplianceAudit: (frameworkId: string, date: Date) => Promise<boolean>;
  
  // Audit operations
  exportAuditLogs: (filters?: any, format?: 'csv' | 'json') => Promise<Blob | null>;
  searchAuditLogs: (query: string) => Promise<AuditLog[]>;
  
  // Threat intelligence
  refreshThreatIntelligence: () => Promise<void>;
  reportThreat: (threat: any) => Promise<boolean>;
}

type UseAdvancedSecurityReturn = UseAdvancedSecurityState & UseAdvancedSecurityActions;

// =====================================================
// ADVANCED SECURITY HOOK
// =====================================================

export function useAdvancedSecurity(): UseAdvancedSecurityReturn {
  const { subscription } = useSubscription();
  
  const [state, setState] = useState<UseAdvancedSecurityState>({
    securityMetrics: null,
    complianceStatus: null,
    auditLogs: [],
    securityIncidents: [],
    threatIntelligence: null,
    vulnerabilityScans: [],
    isLoading: false,
    error: null
  });

  // =====================================================
  // DATA REFRESH OPERATIONS
  // =====================================================

  const refreshSecurityData = useCallback(async (timeRange: string = '7d') => {
    if (!subscription?.id) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [metrics, compliance, incidents] = await Promise.all([
        AdvancedSecurityService.getSecurityMetrics(subscription.id, timeRange),
        AdvancedSecurityService.getComplianceStatus(subscription.id),
        AdvancedSecurityService.getSecurityIncidents(subscription.id)
      ]);

      setState(prev => ({
        ...prev,
        securityMetrics: metrics,
        complianceStatus: compliance,
        securityIncidents: incidents,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch security data',
        isLoading: false
      }));
    }
  }, [subscription?.id]);

  const refreshComplianceStatus = useCallback(async () => {
    if (!subscription?.id) return;

    try {
      const compliance = await AdvancedSecurityService.getComplianceStatus(subscription.id);
      setState(prev => ({ ...prev, complianceStatus: compliance }));
    } catch (error) {
      console.error('Error refreshing compliance status:', error);
    }
  }, [subscription?.id]);

  const refreshAuditLogs = useCallback(async (filters: any = {}) => {
    if (!subscription?.id) return;

    try {
      const logs = await AdvancedSecurityService.getAuditLogs(subscription.id, {
        ...filters,
        limit: filters.limit || 100
      });
      setState(prev => ({ ...prev, auditLogs: logs }));
    } catch (error) {
      console.error('Error refreshing audit logs:', error);
    }
  }, [subscription?.id]);

  // =====================================================
  // SECURITY OPERATIONS
  // =====================================================

  const runVulnerabilityScans = useCallback(async (): Promise<VulnerabilityReport | null> => {
    if (!subscription?.id) return null;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const scanResult = await AdvancedSecurityService.runVulnerabilityScans(subscription.id);
      
      setState(prev => ({
        ...prev,
        vulnerabilityScans: [scanResult, ...prev.vulnerabilityScans],
        isLoading: false
      }));

      // Refresh security metrics to reflect new scan results
      await refreshSecurityData();

      return scanResult;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to run vulnerability scans',
        isLoading: false
      }));
      return null;
    }
  }, [subscription?.id, refreshSecurityData]);

  const createSecurityIncident = useCallback(async (
    incident: Partial<SecurityIncident>
  ): Promise<SecurityIncident | null> => {
    if (!subscription?.id) return null;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Create incident (would implement actual creation logic)
      const newIncident: SecurityIncident = {
        id: `incident_${Date.now()}`,
        subscription_id: subscription.id,
        title: incident.title || 'Security Incident',
        description: incident.description || '',
        severity: incident.severity || 'medium',
        status: incident.status || 'open',
        category: incident.category || 'general',
        affected_systems: incident.affected_systems || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...incident
      };

      setState(prev => ({
        ...prev,
        securityIncidents: [newIncident, ...prev.securityIncidents],
        isLoading: false
      }));

      return newIncident;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create security incident',
        isLoading: false
      }));
      return null;
    }
  }, [subscription?.id]);

  const updateSecurityIncident = useCallback(async (
    incidentId: string,
    updates: Partial<SecurityIncident>
  ): Promise<boolean> => {
    if (!subscription?.id) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Update incident (would implement actual update logic)
      setState(prev => ({
        ...prev,
        securityIncidents: prev.securityIncidents.map(incident =>
          incident.id === incidentId
            ? { ...incident, ...updates, updated_at: new Date().toISOString() }
            : incident
        ),
        isLoading: false
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update security incident',
        isLoading: false
      }));
      return false;
    }
  }, [subscription?.id]);

  // =====================================================
  // COMPLIANCE OPERATIONS
  // =====================================================

  const generateComplianceReport = useCallback(async (frameworkId?: string): Promise<Blob | null> => {
    if (!subscription?.id) return null;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const report = await AdvancedSecurityService.generateComplianceReport(subscription.id, frameworkId);
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Trigger download
      const url = URL.createObjectURL(report);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${frameworkId || 'all'}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return report;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to generate compliance report',
        isLoading: false
      }));
      return null;
    }
  }, [subscription?.id]);

  const scheduleComplianceAudit = useCallback(async (
    frameworkId: string,
    date: Date
  ): Promise<boolean> => {
    if (!subscription?.id) return false;

    try {
      // Schedule audit (would implement actual scheduling logic)
      console.log(`Scheduling compliance audit for ${frameworkId} on ${date.toISOString()}`);
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to schedule compliance audit'
      }));
      return false;
    }
  }, [subscription?.id]);

  // =====================================================
  // AUDIT OPERATIONS
  // =====================================================

  const exportAuditLogs = useCallback(async (
    filters: any = {},
    format: 'csv' | 'json' = 'csv'
  ): Promise<Blob | null> => {
    if (!subscription?.id) return null;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const exportBlob = await AdvancedSecurityService.exportAuditLogs(subscription.id, filters, format);
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Trigger download
      const url = URL.createObjectURL(exportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return exportBlob;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to export audit logs',
        isLoading: false
      }));
      return null;
    }
  }, [subscription?.id]);

  const searchAuditLogs = useCallback(async (query: string): Promise<AuditLog[]> => {
    if (!subscription?.id) return [];

    try {
      // Simple search implementation - would use full-text search in production
      const filteredLogs = state.auditLogs.filter(log =>
        log.action.toLowerCase().includes(query.toLowerCase()) ||
        log.table_name.toLowerCase().includes(query.toLowerCase()) ||
        (log.user_id && log.user_id.toLowerCase().includes(query.toLowerCase()))
      );

      return filteredLogs;
    } catch (error) {
      console.error('Error searching audit logs:', error);
      return [];
    }
  }, [subscription?.id, state.auditLogs]);

  // =====================================================
  // THREAT INTELLIGENCE OPERATIONS
  // =====================================================

  const refreshThreatIntelligence = useCallback(async () => {
    if (!subscription?.id) return;

    try {
      // Mock threat intelligence data - would integrate with threat feeds
      const threatData: ThreatIntelligence = {
        threat_level: 'low',
        active_threats: Math.floor(Math.random() * 5),
        blocked_attempts: Math.floor(Math.random() * 100),
        threat_sources: [
          { source: 'Malicious IPs', count: Math.floor(Math.random() * 20) },
          { source: 'Suspicious User Agents', count: Math.floor(Math.random() * 15) },
          { source: 'Failed Login Attempts', count: Math.floor(Math.random() * 50) }
        ],
        recent_threats: [],
        last_updated: new Date().toISOString()
      };

      setState(prev => ({ ...prev, threatIntelligence: threatData }));
    } catch (error) {
      console.error('Error refreshing threat intelligence:', error);
    }
  }, [subscription?.id]);

  const reportThreat = useCallback(async (threat: any): Promise<boolean> => {
    if (!subscription?.id) return false;

    try {
      // Report threat (would implement actual threat reporting)
      console.log('Reporting threat:', threat);
      
      // Create security incident for the threat
      await createSecurityIncident({
        title: `Threat Detected: ${threat.type}`,
        description: threat.description,
        severity: threat.severity || 'medium',
        category: 'threat_detection',
        affected_systems: threat.affected_systems || []
      });

      return true;
    } catch (error) {
      console.error('Error reporting threat:', error);
      return false;
    }
  }, [subscription?.id, createSecurityIncident]);

  // =====================================================
  // EFFECTS
  // =====================================================

  useEffect(() => {
    if (subscription?.id) {
      Promise.all([
        refreshSecurityData(),
        refreshAuditLogs(),
        refreshThreatIntelligence()
      ]);
    }
  }, [subscription?.id, refreshSecurityData, refreshAuditLogs, refreshThreatIntelligence]);

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // State
    securityMetrics: state.securityMetrics,
    complianceStatus: state.complianceStatus,
    auditLogs: state.auditLogs,
    securityIncidents: state.securityIncidents,
    threatIntelligence: state.threatIntelligence,
    vulnerabilityScans: state.vulnerabilityScans,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    refreshSecurityData,
    refreshComplianceStatus,
    refreshAuditLogs,
    runVulnerabilityScans,
    createSecurityIncident,
    updateSecurityIncident,
    generateComplianceReport,
    scheduleComplianceAudit,
    exportAuditLogs,
    searchAuditLogs,
    refreshThreatIntelligence,
    reportThreat
  };
}
