#!/usr/bin/env node

/**
 * Development Policy Cleanup Script
 * Removes development-specific policies that conflict with optimized policies
 * Target: ~100 warnings resolved
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://flbwqsocnlvsuqgupbra.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

class DevPolicyCleanup {
  constructor() {
    this.removedPolicies = [];
    this.errors = [];
  }

  async cleanupDevelopmentPolicies() {
    console.log('🧹 Cleaning up development-specific policies...');
    
    const devPoliciesToRemove = [
      // Customers table dev policies
      { table: 'customers', policy: 'dev_customers_full_access' },
      
      // User profiles dev policies  
      { table: 'user_profiles', policy: 'dev_user_profiles_full_access' },
      
      // Test users dev policies
      { table: 'test_users', policy: 'dev_test_users_full_access' },
      
      // Packages dev policies
      { table: 'packages', policy: 'dev_packages_full_access' },
      
      // Audit logs dev policies
      { table: 'audit_logs', policy: 'dev_audit_logs_full_access' },
      
      // Mailboxes dev policies
      { table: 'mailboxes', policy: 'dev_mailboxes_full_access' },
      
      // Notifications dev policies
      { table: 'notifications', policy: 'dev_notifications_full_access' },
      
      // Any other dev policies found
      { table: 'profiles', policy: 'dev_profiles_full_access' },
      { table: 'invoices', policy: 'dev_invoices_full_access' },
      { table: 'payments', policy: 'dev_payments_full_access' }
    ];

    let removedCount = 0;

    for (const { table, policy } of devPoliciesToRemove) {
      try {
        console.log(`  - Removing dev policy: ${table}.${policy}`);
        
        const { error } = await supabase.rpc('exec_sql', {
          sql: `DROP POLICY IF EXISTS "${policy}" ON ${table};`
        });

        if (error) {
          console.error(`    ❌ Error removing ${policy}:`, error.message);
          this.errors.push({ table, policy, error: error.message });
        } else {
          console.log(`    ✅ Removed ${table}.${policy}`);
          this.removedPolicies.push({ table, policy });
          removedCount++;
        }

      } catch (err) {
        console.error(`    ❌ Exception removing ${table}.${policy}:`, err.message);
        this.errors.push({ table, policy, error: err.message });
      }
    }

    console.log(`✅ Removed ${removedCount} development policies`);
    return removedCount;
  }

  async fixEnvironmentConfigAuth() {
    console.log('🔧 Fixing environment_config auth re-evaluation...');
    
    try {
      // Drop the problematic policy
      const { error: dropError } = await supabase.rpc('exec_sql', {
        sql: `DROP POLICY IF EXISTS "Only admins can modify environment config" ON environment_config;`
      });

      if (dropError) {
        console.error('❌ Error dropping environment config policy:', dropError.message);
        this.errors.push({ table: 'environment_config', error: dropError.message });
        return false;
      }

      // Create optimized policy
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE POLICY "Only admins can modify environment config" ON environment_config
          FOR ALL TO public
          USING ((SELECT is_admin FROM get_current_user_context()))
          WITH CHECK ((SELECT is_admin FROM get_current_user_context()));
        `
      });

      if (createError) {
        console.error('❌ Error creating optimized environment config policy:', createError.message);
        this.errors.push({ table: 'environment_config', error: createError.message });
        return false;
      }

      console.log('✅ Fixed environment_config auth re-evaluation');
      return true;

    } catch (err) {
      console.error('❌ Exception fixing environment config:', err.message);
      this.errors.push({ table: 'environment_config', error: err.message });
      return false;
    }
  }

  generateReport() {
    return {
      timestamp: new Date().toISOString(),
      summary: {
        removed_policies: this.removedPolicies.length,
        errors: this.errors.length,
        estimated_warnings_resolved: this.removedPolicies.length * 4 // Each policy affects 4 roles
      },
      removed_policies: this.removedPolicies,
      errors: this.errors
    };
  }

  async run() {
    console.log('🧹 Starting Development Policy Cleanup...');
    console.log('=========================================');
    
    try {
      // Test connection
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: 'SELECT current_database();'
      });

      if (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
      }

      console.log(`✅ Connected to database: ${data[0].current_database}`);
      console.log('');

      // Execute cleanup
      const removedCount = await this.cleanupDevelopmentPolicies();
      const authFixed = await this.fixEnvironmentConfigAuth();

      // Generate report
      const report = this.generateReport();
      
      console.log('\n🧹 Development Policy Cleanup Summary');
      console.log('=====================================');
      console.log(`✅ Development policies removed: ${removedCount}`);
      console.log(`✅ Auth warning fixed: ${authFixed ? 'Yes' : 'No'}`);
      console.log(`✅ Estimated warnings resolved: ${report.summary.estimated_warnings_resolved}`);
      console.log(`❌ Errors: ${report.summary.errors}`);
      
      if (this.errors.length > 0) {
        console.log('\n❌ Errors Encountered:');
        this.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error.table}: ${error.error}`);
        });
      }

      console.log('\n🎯 Expected Impact:');
      console.log(`- Warnings before: 430`);
      console.log(`- Warnings after: ~${430 - report.summary.estimated_warnings_resolved}`);
      console.log(`- Reduction: ${Math.round((report.summary.estimated_warnings_resolved / 430) * 100)}%`);
      
      return this.errors.length === 0;
      
    } catch (error) {
      console.error('❌ Development policy cleanup failed:', error);
      return false;
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const cleanup = new DevPolicyCleanup();
  cleanup.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Development policy cleanup failed:', error);
    process.exit(1);
  });
}

export default DevPolicyCleanup;
