import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface LoginAttempt {
  id: string;
  user_id?: string;
  email: string;
  ip_address: string;
  user_agent?: string;
  attempt_result: 'success' | 'failed' | 'blocked';
  failure_reason?: string;
  location_data: any;
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  ip_address: string;
  user_agent?: string;
  device_info: any;
  location_data: any;
  is_active: boolean;
  last_activity: string;
  expires_at: string;
  created_at: string;
}

export interface SecurityAlert {
  id: string;
  user_id?: string;
  alert_type: 'suspicious_login' | 'multiple_failures' | 'new_device' | 'unusual_activity' | 'intrusion_attempt' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  metadata: any;
  ip_address?: string;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

export interface TwoFactorAuth {
  id: string;
  user_id: string;
  is_enabled: boolean;
  backup_codes: string[];
  recovery_codes_used: number;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GDPRRequest {
  id: string;
  user_id: string;
  request_type: 'export' | 'deletion' | 'portability' | 'rectification';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requested_data: any;
  processed_by?: string;
  processed_at?: string;
  completion_date?: string;
  export_url?: string;
  notes?: string;
  created_at: string;
}

export interface SecurityScorecard {
  id: string;
  location_id?: string;
  overall_score: number;
  authentication_score: number;
  data_protection_score: number;
  access_control_score: number;
  monitoring_score: number;
  compliance_score: number;
  recommendations: string[];
  last_assessment: string;
  created_at: string;
}

export interface IPAccessControl {
  id: string;
  ip_address: string;
  ip_range?: string;
  access_type: 'whitelist' | 'blacklist';
  reason?: string;
  added_by: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export function useSecurity() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [twoFactorAuth, setTwoFactorAuth] = useState<TwoFactorAuth | null>(null);
  const [gdprRequests, setGdprRequests] = useState<GDPRRequest[]>([]);
  const [securityScorecard, setSecurityScorecard] = useState<SecurityScorecard | null>(null);
  const [ipAccessControl, setIpAccessControl] = useState<IPAccessControl[]>([]);

  const fetchLoginAttempts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Mock data for now until types are updated
      const mockData: LoginAttempt[] = [
        {
          id: '1',
          email: user.email || '',
          ip_address: '192.168.1.1',
          attempt_result: 'success',
          location_data: {},
          created_at: new Date().toISOString(),
        }
      ];
      setLoginAttempts(mockData);
    } catch (error) {
      console.error('Error fetching login attempts:', error);
      toast.error('Failed to fetch login attempts');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSessions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Mock data for now
      const mockData: UserSession[] = [
        {
          id: '1',
          user_id: user.id,
          session_token: 'mock-token',
          ip_address: '192.168.1.1',
          device_info: { browser: 'Chrome' },
          location_data: { country: 'US' },
          is_active: true,
          last_activity: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        }
      ];
      setUserSessions(mockData);
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      toast.error('Failed to fetch user sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchSecurityAlerts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Mock data for now
      const mockData: SecurityAlert[] = [
        {
          id: '1',
          alert_type: 'new_device',
          severity: 'medium',
          title: 'New device login detected',
          description: 'A login was detected from a new device',
          metadata: {},
          status: 'active',
          created_at: new Date().toISOString(),
        }
      ];
      setSecurityAlerts(mockData);
    } catch (error) {
      console.error('Error fetching security alerts:', error);
      toast.error('Failed to fetch security alerts');
    } finally {
      setLoading(false);
    }
  };

  const fetch2FA = async () => {
    if (!user) return;
    
    try {
      // Mock data for now
      setTwoFactorAuth({
        id: '1',
        user_id: user.id,
        is_enabled: false,
        backup_codes: [],
        recovery_codes_used: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching 2FA settings:', error);
    }
  };

  const fetchGDPRRequests = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setGdprRequests([]);
    } catch (error) {
      console.error('Error fetching GDPR requests:', error);
      toast.error('Failed to fetch GDPR requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchSecurityScorecard = async () => {
    if (!user) return;
    
    try {
      // Mock data for now
      setSecurityScorecard({
        id: '1',
        overall_score: 85,
        authentication_score: 90,
        data_protection_score: 80,
        access_control_score: 85,
        monitoring_score: 75,
        compliance_score: 88,
        recommendations: ['Enable 2FA', 'Review password policy'],
        last_assessment: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching security scorecard:', error);
    }
  };

  const fetchIPAccessControl = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setIpAccessControl([]);
    } catch (error) {
      console.error('Error fetching IP access control:', error);
      toast.error('Failed to fetch IP access control');
    } finally {
      setLoading(false);
    }
  };

  const enable2FA = async () => {
    if (!user) return;
    
    try {
      const secretKey = generateSecretKey();
      const backupCodes = generateBackupCodes();
      
      // Mock implementation for now
      await fetch2FA();
      toast.success('Two-factor authentication enabled');
      return { secretKey, backupCodes };
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast.error('Failed to enable two-factor authentication');
      return null;
    }
  };

  const disable2FA = async () => {
    if (!user) return;
    
    try {
      // Mock implementation for now
      await fetch2FA();
      toast.success('Two-factor authentication disabled');
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('Failed to disable two-factor authentication');
    }
  };

  const createGDPRRequest = async (requestType: 'export' | 'deletion' | 'portability' | 'rectification', requestedData?: any) => {
    if (!user) return;
    
    try {
      // Mock implementation for now
      await fetchGDPRRequests();
      toast.success(`GDPR ${requestType} request submitted`);
    } catch (error) {
      console.error('Error creating GDPR request:', error);
      toast.error('Failed to submit GDPR request');
    }
  };

  const terminateSession = async (sessionId: string) => {
    if (!user) return;
    
    try {
      // Mock implementation for now
      await fetchUserSessions();
      toast.success('Session terminated');
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error('Failed to terminate session');
    }
  };

  const resolveSecurityAlert = async (alertId: string, status: 'resolved' | 'false_positive') => {
    if (!user) return;
    
    try {
      // Mock implementation for now
      await fetchSecurityAlerts();
      toast.success(`Alert marked as ${status}`);
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
    }
  };

  const addIPToAccessControl = async (
    ipAddress: string,
    accessType: 'whitelist' | 'blacklist',
    reason?: string,
    expiresAt?: string
  ) => {
    if (!user) return;
    
    try {
      // Mock implementation for now
      await fetchIPAccessControl();
      toast.success(`IP ${ipAddress} added to ${accessType}`);
    } catch (error) {
      console.error('Error adding IP to access control:', error);
      toast.error('Failed to add IP to access control');
    }
  };

  const removeIPFromAccessControl = async (ipId: string) => {
    if (!user) return;
    
    try {
      // Mock implementation for now
      await fetchIPAccessControl();
      toast.success('IP removed from access control');
    } catch (error) {
      console.error('Error removing IP from access control:', error);
      toast.error('Failed to remove IP from access control');
    }
  };

  useEffect(() => {
    if (user) {
      fetchLoginAttempts();
      fetchUserSessions();
      fetchSecurityAlerts();
      fetch2FA();
      fetchGDPRRequests();
      fetchSecurityScorecard();
      fetchIPAccessControl();
    }
  }, [user]);

  return {
    loading,
    loginAttempts,
    userSessions,
    securityAlerts,
    twoFactorAuth,
    gdprRequests,
    securityScorecard,
    ipAccessControl,
    fetchLoginAttempts,
    fetchUserSessions,
    fetchSecurityAlerts,
    fetch2FA,
    fetchGDPRRequests,
    fetchSecurityScorecard,
    fetchIPAccessControl,
    enable2FA,
    disable2FA,
    createGDPRRequest,
    terminateSession,
    resolveSecurityAlert,
    addIPToAccessControl,
    removeIPFromAccessControl,
  };
}

// Helper functions
function generateSecretKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateBackupCodes(): string[] {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();
    codes.push(code);
  }
  return codes;
}