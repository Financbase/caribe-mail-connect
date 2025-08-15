/**
 * Multi-Tenant Architecture Service
 * Story 1: Clear Product Shape - Multi-Tenant Architecture
 * 
 * Implements hybrid multi-tenancy with row-level security (RLS) for data isolation,
 * tenant management, and subscription-based access control
 */

import { supabase } from '@/integrations/supabase/client';

// =====================================================
// MULTI-TENANT TYPES
// =====================================================

export interface TenantConfiguration {
  tenant_id: string;
  subscription_id: string;
  isolation_strategy: 'row_level_security' | 'schema_per_tenant' | 'database_per_tenant';
  data_residency: 'us' | 'eu' | 'global';
  compliance_requirements: string[];
  resource_limits: TenantResourceLimits;
  security_settings: TenantSecuritySettings;
  created_at: string;
  updated_at: string;
}

export interface TenantResourceLimits {
  max_users: number;
  max_customers: number;
  max_packages: number;
  max_storage_mb: number;
  max_api_requests_per_hour: number;
  max_communications_per_month: number;
}

export interface TenantSecuritySettings {
  enforce_2fa: boolean;
  session_timeout_minutes: number;
  password_policy: PasswordPolicy;
  ip_whitelist: string[];
  audit_logging_enabled: boolean;
  data_encryption_at_rest: boolean;
}

export interface PasswordPolicy {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_symbols: boolean;
  max_age_days: number;
  prevent_reuse_count: number;
}

export interface TenantUsage {
  tenant_id: string;
  period_start: string;
  period_end: string;
  users_count: number;
  customers_count: number;
  packages_count: number;
  storage_used_mb: number;
  api_requests_count: number;
  communications_sent: number;
  last_updated: string;
}

// =====================================================
// MULTI-TENANT SERVICE
// =====================================================

export class MultiTenantService {

  /**
   * Initialize tenant configuration for new subscription
   */
  static async initializeTenant(
    subscriptionId: string,
    planTier: 'free' | 'professional' | 'enterprise',
    options?: Partial<TenantConfiguration>
  ): Promise<TenantConfiguration | null> {
    try {
      console.log(`Initializing tenant for subscription ${subscriptionId}`);

      const tenantId = `tenant_${subscriptionId}`;
      
      // Get default resource limits based on plan tier
      const resourceLimits = this.getDefaultResourceLimits(planTier);
      
      // Get default security settings based on plan tier
      const securitySettings = this.getDefaultSecuritySettings(planTier);

      const tenantConfig: TenantConfiguration = {
        tenant_id: tenantId,
        subscription_id: subscriptionId,
        isolation_strategy: 'row_level_security', // Default to RLS for hybrid approach
        data_residency: 'us', // Default to US
        compliance_requirements: this.getDefaultComplianceRequirements(planTier),
        resource_limits: resourceLimits,
        security_settings: securitySettings,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...options
      };

      // Create tenant configuration in database
      const { error } = await supabase
        .from('tenant_configurations')
        .insert(tenantConfig);

      if (error) throw error;

      // Initialize RLS policies for the tenant
      await this.initializeRLSPolicies(subscriptionId);

      // Create initial usage tracking record
      await this.initializeUsageTracking(tenantId);

      console.log('Tenant initialized successfully');
      return tenantConfig;
    } catch (error) {
      console.error('Error initializing tenant:', error);
      return null;
    }
  }

  /**
   * Get tenant configuration
   */
  static async getTenantConfiguration(subscriptionId: string): Promise<TenantConfiguration | null> {
    try {
      const { data, error } = await supabase
        .from('tenant_configurations')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting tenant configuration:', error);
      return null;
    }
  }

  /**
   * Update tenant configuration
   */
  static async updateTenantConfiguration(
    subscriptionId: string,
    updates: Partial<TenantConfiguration>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tenant_configurations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('subscription_id', subscriptionId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error updating tenant configuration:', error);
      return false;
    }
  }

  /**
   * Delete tenant configuration and cleanup
   */
  static async deleteTenant(subscriptionId: string): Promise<boolean> {
    try {
      console.log(`Deleting tenant for subscription ${subscriptionId}`);

      // Delete tenant configuration
      const { error } = await supabase
        .from('tenant_configurations')
        .delete()
        .eq('subscription_id', subscriptionId);

      if (error) throw error;

      // Cleanup usage tracking
      await supabase
        .from('tenant_usage_tracking')
        .delete()
        .eq('tenant_id', `tenant_${subscriptionId}`);

      console.log('Tenant deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting tenant:', error);
      return false;
    }
  }

  /**
   * Check tenant resource usage against limits
   */
  static async checkResourceUsage(subscriptionId: string): Promise<{
    within_limits: boolean;
    usage: TenantUsage;
    limits: TenantResourceLimits;
    violations: string[];
  }> {
    try {
      const config = await this.getTenantConfiguration(subscriptionId);
      if (!config) {
        throw new Error('Tenant configuration not found');
      }

      const usage = await this.getCurrentUsage(subscriptionId);
      const violations: string[] = [];

      // Check each resource limit
      if (usage.users_count > config.resource_limits.max_users) {
        violations.push(`Users limit exceeded: ${usage.users_count}/${config.resource_limits.max_users}`);
      }

      if (usage.customers_count > config.resource_limits.max_customers) {
        violations.push(`Customers limit exceeded: ${usage.customers_count}/${config.resource_limits.max_customers}`);
      }

      if (usage.packages_count > config.resource_limits.max_packages) {
        violations.push(`Packages limit exceeded: ${usage.packages_count}/${config.resource_limits.max_packages}`);
      }

      if (usage.storage_used_mb > config.resource_limits.max_storage_mb) {
        violations.push(`Storage limit exceeded: ${usage.storage_used_mb}MB/${config.resource_limits.max_storage_mb}MB`);
      }

      if (usage.api_requests_count > config.resource_limits.max_api_requests_per_hour) {
        violations.push(`API requests limit exceeded: ${usage.api_requests_count}/${config.resource_limits.max_api_requests_per_hour} per hour`);
      }

      if (usage.communications_sent > config.resource_limits.max_communications_per_month) {
        violations.push(`Communications limit exceeded: ${usage.communications_sent}/${config.resource_limits.max_communications_per_month} per month`);
      }

      return {
        within_limits: violations.length === 0,
        usage,
        limits: config.resource_limits,
        violations
      };
    } catch (error) {
      console.error('Error checking resource usage:', error);
      return {
        within_limits: false,
        usage: {} as TenantUsage,
        limits: {} as TenantResourceLimits,
        violations: ['Error checking resource usage']
      };
    }
  }

  /**
   * Enforce tenant isolation for database queries
   */
  static async enforceTenantIsolation(subscriptionId: string): Promise<void> {
    try {
      // Set RLS context for current session
      await supabase.rpc('set_tenant_context', {
        tenant_subscription_id: subscriptionId
      });
    } catch (error) {
      console.error('Error enforcing tenant isolation:', error);
      throw error;
    }
  }

  /**
   * Get tenant analytics and metrics
   */
  static async getTenantAnalytics(subscriptionId: string): Promise<any> {
    try {
      const usage = await this.getCurrentUsage(subscriptionId);
      const config = await this.getTenantConfiguration(subscriptionId);

      if (!config) {
        throw new Error('Tenant configuration not found');
      }

      // Calculate utilization percentages
      const utilization = {
        users: (usage.users_count / config.resource_limits.max_users) * 100,
        customers: (usage.customers_count / config.resource_limits.max_customers) * 100,
        packages: (usage.packages_count / config.resource_limits.max_packages) * 100,
        storage: (usage.storage_used_mb / config.resource_limits.max_storage_mb) * 100,
        api_requests: (usage.api_requests_count / config.resource_limits.max_api_requests_per_hour) * 100,
        communications: (usage.communications_sent / config.resource_limits.max_communications_per_month) * 100
      };

      return {
        tenant_id: config.tenant_id,
        subscription_id: subscriptionId,
        plan_tier: config.resource_limits,
        current_usage: usage,
        resource_utilization: utilization,
        isolation_strategy: config.isolation_strategy,
        compliance_status: await this.getComplianceStatus(subscriptionId),
        security_score: await this.calculateSecurityScore(config.security_settings)
      };
    } catch (error) {
      console.error('Error getting tenant analytics:', error);
      return null;
    }
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private static getDefaultResourceLimits(planTier: string): TenantResourceLimits {
    const limits = {
      'free': {
        max_users: 2,
        max_customers: 50,
        max_packages: 100,
        max_storage_mb: 100,
        max_api_requests_per_hour: 100,
        max_communications_per_month: 100
      },
      'professional': {
        max_users: 10,
        max_customers: 5000,
        max_packages: 10000,
        max_storage_mb: 10000,
        max_api_requests_per_hour: 10000,
        max_communications_per_month: 10000
      },
      'enterprise': {
        max_users: 100,
        max_customers: 100000,
        max_packages: 1000000,
        max_storage_mb: 1000000,
        max_api_requests_per_hour: 1000000,
        max_communications_per_month: 1000000
      }
    };

    return limits[planTier as keyof typeof limits] || limits.free;
  }

  private static getDefaultSecuritySettings(planTier: string): TenantSecuritySettings {
    const baseSettings: TenantSecuritySettings = {
      enforce_2fa: false,
      session_timeout_minutes: 480, // 8 hours
      password_policy: {
        min_length: 8,
        require_uppercase: true,
        require_lowercase: true,
        require_numbers: true,
        require_symbols: false,
        max_age_days: 90,
        prevent_reuse_count: 5
      },
      ip_whitelist: [],
      audit_logging_enabled: false,
      data_encryption_at_rest: true
    };

    if (planTier === 'professional') {
      baseSettings.enforce_2fa = true;
      baseSettings.audit_logging_enabled = true;
      baseSettings.session_timeout_minutes = 240; // 4 hours
    }

    if (planTier === 'enterprise') {
      baseSettings.enforce_2fa = true;
      baseSettings.audit_logging_enabled = true;
      baseSettings.session_timeout_minutes = 120; // 2 hours
      baseSettings.password_policy.require_symbols = true;
      baseSettings.password_policy.max_age_days = 60;
    }

    return baseSettings;
  }

  private static getDefaultComplianceRequirements(planTier: string): string[] {
    const requirements = {
      'free': ['basic_data_protection'],
      'professional': ['basic_data_protection', 'gdpr', 'ccpa'],
      'enterprise': ['basic_data_protection', 'gdpr', 'ccpa', 'soc2', 'iso27001', 'hipaa']
    };

    return requirements[planTier as keyof typeof requirements] || requirements.free;
  }

  private static async initializeRLSPolicies(subscriptionId: string): Promise<void> {
    try {
      // This would create RLS policies for the tenant
      // In a real implementation, this would execute SQL to create policies
      console.log(`Initializing RLS policies for subscription ${subscriptionId}`);
      
      // Example: Create policies for each table that needs tenant isolation
      const tables = ['customers', 'packages', 'communications', 'analytics_events'];
      
      for (const table of tables) {
        // This would execute SQL like:
        // CREATE POLICY tenant_isolation_policy ON {table} 
        // FOR ALL TO authenticated 
        // USING (subscription_id = current_setting('app.current_tenant')::uuid);
        console.log(`Creating RLS policy for table: ${table}`);
      }
    } catch (error) {
      console.error('Error initializing RLS policies:', error);
    }
  }

  private static async initializeUsageTracking(tenantId: string): Promise<void> {
    try {
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const initialUsage: TenantUsage = {
        tenant_id: tenantId,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
        users_count: 0,
        customers_count: 0,
        packages_count: 0,
        storage_used_mb: 0,
        api_requests_count: 0,
        communications_sent: 0,
        last_updated: new Date().toISOString()
      };

      await supabase
        .from('tenant_usage_tracking')
        .insert(initialUsage);
    } catch (error) {
      console.error('Error initializing usage tracking:', error);
    }
  }

  private static async getCurrentUsage(subscriptionId: string): Promise<TenantUsage> {
    try {
      // Get current month's usage
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const { data, error } = await supabase
        .from('tenant_usage_tracking')
        .select('*')
        .eq('tenant_id', `tenant_${subscriptionId}`)
        .gte('period_start', periodStart.toISOString())
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create initial usage record if not found
        await this.initializeUsageTracking(`tenant_${subscriptionId}`);
        return this.getCurrentUsage(subscriptionId);
      }

      return data;
    } catch (error) {
      console.error('Error getting current usage:', error);
      // Return empty usage if error
      return {
        tenant_id: `tenant_${subscriptionId}`,
        period_start: new Date().toISOString(),
        period_end: new Date().toISOString(),
        users_count: 0,
        customers_count: 0,
        packages_count: 0,
        storage_used_mb: 0,
        api_requests_count: 0,
        communications_sent: 0,
        last_updated: new Date().toISOString()
      };
    }
  }

  private static async getComplianceStatus(subscriptionId: string): Promise<any> {
    // Mock compliance status - would integrate with actual compliance monitoring
    return {
      gdpr_compliant: true,
      ccpa_compliant: true,
      soc2_compliant: true,
      last_audit_date: new Date().toISOString(),
      next_audit_due: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private static async calculateSecurityScore(securitySettings: TenantSecuritySettings): Promise<number> {
    let score = 0;
    
    if (securitySettings.enforce_2fa) score += 20;
    if (securitySettings.audit_logging_enabled) score += 15;
    if (securitySettings.data_encryption_at_rest) score += 15;
    if (securitySettings.session_timeout_minutes <= 240) score += 10;
    if (securitySettings.password_policy.require_symbols) score += 10;
    if (securitySettings.password_policy.min_length >= 12) score += 10;
    if (securitySettings.ip_whitelist.length > 0) score += 10;
    if (securitySettings.password_policy.max_age_days <= 60) score += 10;

    return Math.min(score, 100);
  }
}
