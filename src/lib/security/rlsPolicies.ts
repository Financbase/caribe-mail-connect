/**
 * Row Level Security Policies
 * Reliable Backend - Row Level Security Policies
 * 
 * Implement comprehensive RLS policies for multi-tenant data isolation
 */

import { supabase } from '@/integrations/supabase/client';

// =====================================================
// RLS POLICY TYPES
// =====================================================

export interface RLSPolicy {
  table_name: string;
  policy_name: string;
  policy_type: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
  roles: string[];
  using_expression: string;
  with_check_expression?: string;
  description: string;
  enabled: boolean;
}

export interface RLSPolicyResult {
  success: boolean;
  policy: RLSPolicy;
  error?: string;
}

export interface RLSStatus {
  table_name: string;
  rls_enabled: boolean;
  policies: RLSPolicy[];
  policy_count: number;
}

// =====================================================
// RLS POLICY DEFINITIONS
// =====================================================

export const RLS_POLICIES: RLSPolicy[] = [
  // =====================================================
  // SUBSCRIPTION POLICIES
  // =====================================================
  {
    table_name: 'subscriptions',
    policy_name: 'subscription_tenant_isolation',
    policy_type: 'ALL',
    roles: ['authenticated'],
    using_expression: `
      EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND (
          auth.users.raw_user_meta_data->>'subscription_id' = subscriptions.id::text
          OR auth.users.raw_user_meta_data->>'role' = 'admin'
          OR auth.users.raw_user_meta_data->>'role' = 'super_admin'
        )
      )
    `,
    description: 'Users can only access their own subscription data or admins can access all',
    enabled: true
  },

  // =====================================================
  // CUSTOMER POLICIES
  // =====================================================
  {
    table_name: 'customers',
    policy_name: 'customer_subscription_access',
    policy_type: 'SELECT',
    roles: ['authenticated'],
    using_expression: `
      EXISTS (
        SELECT 1 FROM subscriptions s
        JOIN auth.users u ON u.raw_user_meta_data->>'subscription_id' = s.id::text
        WHERE s.id = customers.subscription_id
        AND u.id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'super_admin')
      )
    `,
    description: 'Users can view customers within their subscription or admins can view all',
    enabled: true
  },
  {
    table_name: 'customers',
    policy_name: 'customer_subscription_modify',
    policy_type: 'INSERT',
    roles: ['authenticated'],
    using_expression: `
      EXISTS (
        SELECT 1 FROM subscriptions s
        JOIN auth.users u ON u.raw_user_meta_data->>'subscription_id' = s.id::text
        WHERE s.id = customers.subscription_id
        AND u.id = auth.uid()
        AND u.raw_user_meta_data->>'role' IN ('admin', 'manager', 'super_admin')
      )
    `,
    with_check_expression: `
      EXISTS (
        SELECT 1 FROM subscriptions s
        JOIN auth.users u ON u.raw_user_meta_data->>'subscription_id' = s.id::text
        WHERE s.id = customers.subscription_id
        AND u.id = auth.uid()
        AND u.raw_user_meta_data->>'role' IN ('admin', 'manager', 'super_admin')
      )
    `,
    description: 'Only admins and managers can create customers within their subscription',
    enabled: true
  },
  {
    table_name: 'customers',
    policy_name: 'customer_subscription_update',
    policy_type: 'UPDATE',
    roles: ['authenticated'],
    using_expression: `
      EXISTS (
        SELECT 1 FROM subscriptions s
        JOIN auth.users u ON u.raw_user_meta_data->>'subscription_id' = s.id::text
        WHERE s.id = customers.subscription_id
        AND u.id = auth.uid()
        AND u.raw_user_meta_data->>'role' IN ('admin', 'manager', 'staff', 'super_admin')
      )
    `,
    with_check_expression: `
      EXISTS (
        SELECT 1 FROM subscriptions s
        JOIN auth.users u ON u.raw_user_meta_data->>'subscription_id' = s.id::text
        WHERE s.id = customers.subscription_id
        AND u.id = auth.uid()
        AND u.raw_user_meta_data->>'role' IN ('admin', 'manager', 'staff', 'super_admin')
      )
    `,
    description: 'Staff and above can update customers within their subscription',
    enabled: true
  },

  // =====================================================
  // PACKAGE POLICIES
  // =====================================================
  {
    table_name: 'packages',
    policy_name: 'package_customer_access',
    policy_type: 'SELECT',
    roles: ['authenticated'],
    using_expression: `
      EXISTS (
        SELECT 1 FROM customers c
        JOIN subscriptions s ON s.id = c.subscription_id
        JOIN auth.users u ON u.raw_user_meta_data->>'subscription_id' = s.id::text
        WHERE c.id = packages.customer_id
        AND u.id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'super_admin')
      )
    `,
    description: 'Users can view packages for customers in their subscription',
    enabled: true
  },
  {
    table_name: 'packages',
    policy_name: 'package_customer_modify',
    policy_type: 'INSERT',
    roles: ['authenticated'],
    using_expression: `
      EXISTS (
        SELECT 1 FROM customers c
        JOIN subscriptions s ON s.id = c.subscription_id
        JOIN auth.users u ON u.raw_user_meta_data->>'subscription_id' = s.id::text
        WHERE c.id = packages.customer_id
        AND u.id = auth.uid()
        AND u.raw_user_meta_data->>'role' IN ('admin', 'manager', 'staff', 'super_admin')
      )
    `,
    with_check_expression: `
      EXISTS (
        SELECT 1 FROM customers c
        JOIN subscriptions s ON s.id = c.subscription_id
        JOIN auth.users u ON u.raw_user_meta_data->>'subscription_id' = s.id::text
        WHERE c.id = packages.customer_id
        AND u.id = auth.uid()
        AND u.raw_user_meta_data->>'role' IN ('admin', 'manager', 'staff', 'super_admin')
      )
    `,
    description: 'Staff and above can create packages for customers in their subscription',
    enabled: true
  },

  // =====================================================
  // BILLING POLICIES
  // =====================================================
  {
    table_name: 'billing_records',
    policy_name: 'billing_subscription_access',
    policy_type: 'SELECT',
    roles: ['authenticated'],
    using_expression: `
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND (
          auth.users.raw_user_meta_data->>'subscription_id' = billing_records.subscription_id::text
          OR auth.users.raw_user_meta_data->>'role' IN ('admin', 'super_admin')
        )
      )
    `,
    description: 'Users can view billing records for their subscription',
    enabled: true
  },
  {
    table_name: 'billing_records',
    policy_name: 'billing_admin_modify',
    policy_type: 'INSERT',
    roles: ['authenticated'],
    using_expression: `
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'super_admin')
      )
    `,
    with_check_expression: `
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'super_admin')
      )
    `,
    description: 'Only admins can create billing records',
    enabled: true
  },

  // =====================================================
  // ANALYTICS POLICIES
  // =====================================================
  {
    table_name: 'analytics_events',
    policy_name: 'analytics_subscription_access',
    policy_type: 'SELECT',
    roles: ['authenticated'],
    using_expression: `
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND (
          auth.users.raw_user_meta_data->>'subscription_id' = analytics_events.subscription_id::text
          OR auth.users.raw_user_meta_data->>'role' IN ('admin', 'super_admin')
        )
      )
    `,
    description: 'Users can view analytics events for their subscription',
    enabled: true
  },

  // =====================================================
  // COMMUNICATION POLICIES
  // =====================================================
  {
    table_name: 'communications',
    policy_name: 'communication_subscription_access',
    policy_type: 'ALL',
    roles: ['authenticated'],
    using_expression: `
      EXISTS (
        SELECT 1 FROM customers c
        JOIN subscriptions s ON s.id = c.subscription_id
        JOIN auth.users u ON u.raw_user_meta_data->>'subscription_id' = s.id::text
        WHERE c.id = communications.customer_id
        AND u.id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'super_admin')
      )
    `,
    description: 'Users can manage communications for customers in their subscription',
    enabled: true
  },

  // =====================================================
  // USER MANAGEMENT POLICIES
  // =====================================================
  {
    table_name: 'user_profiles',
    policy_name: 'user_profile_access',
    policy_type: 'SELECT',
    roles: ['authenticated'],
    using_expression: `
      user_profiles.user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM auth.users u1
        JOIN auth.users u2 ON u1.raw_user_meta_data->>'subscription_id' = u2.raw_user_meta_data->>'subscription_id'
        WHERE u1.id = auth.uid()
        AND u2.id = user_profiles.user_id
        AND u1.raw_user_meta_data->>'role' IN ('admin', 'manager', 'super_admin')
      )
    `,
    description: 'Users can view their own profile or admins can view profiles in their subscription',
    enabled: true
  },
  {
    table_name: 'user_profiles',
    policy_name: 'user_profile_update',
    policy_type: 'UPDATE',
    roles: ['authenticated'],
    using_expression: `
      user_profiles.user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM auth.users u1
        JOIN auth.users u2 ON u1.raw_user_meta_data->>'subscription_id' = u2.raw_user_meta_data->>'subscription_id'
        WHERE u1.id = auth.uid()
        AND u2.id = user_profiles.user_id
        AND u1.raw_user_meta_data->>'role' IN ('admin', 'super_admin')
      )
    `,
    with_check_expression: `
      user_profiles.user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM auth.users u1
        JOIN auth.users u2 ON u1.raw_user_meta_data->>'subscription_id' = u2.raw_user_meta_data->>'subscription_id'
        WHERE u1.id = auth.uid()
        AND u2.id = user_profiles.user_id
        AND u1.raw_user_meta_data->>'role' IN ('admin', 'super_admin')
      )
    `,
    description: 'Users can update their own profile or admins can update profiles in their subscription',
    enabled: true
  }
];

// =====================================================
// RLS POLICY MANAGER
// =====================================================

export class RLSPolicyManager {
  private static instance: RLSPolicyManager;

  private constructor() {}

  static getInstance(): RLSPolicyManager {
    if (!RLSPolicyManager.instance) {
      RLSPolicyManager.instance = new RLSPolicyManager();
    }
    return RLSPolicyManager.instance;
  }

  /**
   * Enable RLS on a table
   */
  async enableRLS(tableName: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('execute_sql', {
        sql: `ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;`
      });

      if (error) {
        console.error(`Failed to enable RLS on ${tableName}:`, error);
        return false;
      }

      console.log(`RLS enabled on table: ${tableName}`);
      return true;
    } catch (error) {
      console.error(`Error enabling RLS on ${tableName}:`, error);
      return false;
    }
  }

  /**
   * Disable RLS on a table
   */
  async disableRLS(tableName: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('execute_sql', {
        sql: `ALTER TABLE ${tableName} DISABLE ROW LEVEL SECURITY;`
      });

      if (error) {
        console.error(`Failed to disable RLS on ${tableName}:`, error);
        return false;
      }

      console.log(`RLS disabled on table: ${tableName}`);
      return true;
    } catch (error) {
      console.error(`Error disabling RLS on ${tableName}:`, error);
      return false;
    }
  }

  /**
   * Create an RLS policy
   */
  async createPolicy(policy: RLSPolicy): Promise<RLSPolicyResult> {
    try {
      let sql = `CREATE POLICY "${policy.policy_name}" ON ${policy.table_name}`;
      
      if (policy.policy_type !== 'ALL') {
        sql += ` FOR ${policy.policy_type}`;
      }
      
      sql += ` TO ${policy.roles.join(', ')}`;
      sql += ` USING (${policy.using_expression})`;
      
      if (policy.with_check_expression) {
        sql += ` WITH CHECK (${policy.with_check_expression})`;
      }
      
      sql += ';';

      const { error } = await supabase.rpc('execute_sql', { sql });

      if (error) {
        return {
          success: false,
          policy,
          error: error.message
        };
      }

      console.log(`Policy created: ${policy.policy_name} on ${policy.table_name}`);
      return {
        success: true,
        policy
      };
    } catch (error) {
      return {
        success: false,
        policy,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Drop an RLS policy
   */
  async dropPolicy(tableName: string, policyName: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('execute_sql', {
        sql: `DROP POLICY IF EXISTS "${policyName}" ON ${tableName};`
      });

      if (error) {
        console.error(`Failed to drop policy ${policyName}:`, error);
        return false;
      }

      console.log(`Policy dropped: ${policyName} on ${tableName}`);
      return true;
    } catch (error) {
      console.error(`Error dropping policy ${policyName}:`, error);
      return false;
    }
  }

  /**
   * Apply all RLS policies
   */
  async applyAllPolicies(): Promise<RLSPolicyResult[]> {
    const results: RLSPolicyResult[] = [];

    // Get unique table names
    const tableNames = [...new Set(RLS_POLICIES.map(p => p.table_name))];

    // Enable RLS on all tables first
    for (const tableName of tableNames) {
      await this.enableRLS(tableName);
    }

    // Create all policies
    for (const policy of RLS_POLICIES) {
      if (policy.enabled) {
        const result = await this.createPolicy(policy);
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Get RLS status for all tables
   */
  async getRLSStatus(): Promise<RLSStatus[]> {
    try {
      // This would typically query the database for actual RLS status
      // For now, we'll return a mock status based on our policies
      const tableNames = [...new Set(RLS_POLICIES.map(p => p.table_name))];
      
      return tableNames.map(tableName => {
        const tablePolicies = RLS_POLICIES.filter(p => p.table_name === tableName);
        
        return {
          table_name: tableName,
          rls_enabled: true, // Assume enabled for now
          policies: tablePolicies,
          policy_count: tablePolicies.length
        };
      });
    } catch (error) {
      console.error('Error getting RLS status:', error);
      return [];
    }
  }

  /**
   * Test RLS policies
   */
  async testPolicies(): Promise<{ table: string; passed: boolean; error?: string }[]> {
    const results: { table: string; passed: boolean; error?: string }[] = [];

    const tableNames = [...new Set(RLS_POLICIES.map(p => p.table_name))];

    for (const tableName of tableNames) {
      try {
        // Test basic SELECT access
        const { error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        results.push({
          table: tableName,
          passed: !error,
          error: error?.message
        });
      } catch (error) {
        results.push({
          table: tableName,
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  /**
   * Validate policy syntax
   */
  validatePolicy(policy: RLSPolicy): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!policy.table_name) {
      errors.push('Table name is required');
    }

    if (!policy.policy_name) {
      errors.push('Policy name is required');
    }

    if (!policy.using_expression) {
      errors.push('Using expression is required');
    }

    if (policy.roles.length === 0) {
      errors.push('At least one role is required');
    }

    // Basic SQL injection check
    const dangerousPatterns = [';', '--', '/*', '*/', 'DROP', 'DELETE', 'TRUNCATE'];
    const expressions = [policy.using_expression, policy.with_check_expression].filter(Boolean);
    
    for (const expr of expressions) {
      for (const pattern of dangerousPatterns) {
        if (expr.toUpperCase().includes(pattern)) {
          errors.push(`Potentially dangerous pattern detected: ${pattern}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
