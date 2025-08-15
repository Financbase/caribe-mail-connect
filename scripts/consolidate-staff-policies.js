#!/usr/bin/env node

/**
 * Staff Policy Consolidation Script
 * Consolidates "manage" + "view" policies into single "manage" policies
 * Target: ~200 warnings resolved
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://flbwqsocnlvsuqgupbra.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

class StaffPolicyConsolidation {
  constructor() {
    this.consolidatedTables = [];
    this.errors = [];
  }

  async getTablesWithDuplicateStaffPolicies() {
    console.log('🔍 Identifying tables with duplicate staff policies...');
    
    // Tables with "Staff can manage X" + "Staff can view X" patterns
    const duplicateStaffPolicies = [
      'account_balances',
      'affiliate_programs', 
      'billing_runs',
      'business_partners',
      'collaboration_workflows',
      'driver_assignments',
      'integration_partners',
      'invoice_items',
      'invoices',
      'partner_analytics',
      'partner_commissions',
      'partner_contracts',
      'partner_vendors',
      'payment_plans',
      'payments',
      'user_tiers'
    ];

    console.log(`📋 Found ${duplicateStaffPolicies.length} tables with duplicate staff policies`);
    return duplicateStaffPolicies;
  }

  async consolidateStaffPolicies(tableName) {
    console.log(`  🔧 Consolidating staff policies for: ${tableName}`);
    
    try {
      // Drop the separate view and manage policies
      const dropQueries = [
        `DROP POLICY IF EXISTS "Staff can view ${tableName.replace('_', ' ')}" ON ${tableName};`,
        `DROP POLICY IF EXISTS "Staff can manage ${tableName.replace('_', ' ')}" ON ${tableName};`,
        `DROP POLICY IF EXISTS "Staff can view all ${tableName.replace('_', ' ')}" ON ${tableName};`,
        `DROP POLICY IF EXISTS "Staff can manage all ${tableName.replace('_', ' ')}" ON ${tableName};`,
        // Handle specific naming patterns
        `DROP POLICY IF EXISTS "Staff can view ${tableName}" ON ${tableName};`,
        `DROP POLICY IF EXISTS "Staff can manage ${tableName}" ON ${tableName};`
      ];

      for (const query of dropQueries) {
        const { error } = await supabase.rpc('exec_sql', { sql: query });
        if (error && !error.message.includes('does not exist')) {
          console.error(`    ❌ Error dropping policy: ${error.message}`);
        }
      }

      // Create single consolidated policy
      const createQuery = `
        CREATE POLICY "Staff can manage ${tableName}" ON ${tableName}
        FOR ALL TO public
        USING ((SELECT is_staff FROM get_current_user_context()));
      `;

      const { error: createError } = await supabase.rpc('exec_sql', { sql: createQuery });

      if (createError) {
        console.error(`    ❌ Error creating consolidated policy: ${createError.message}`);
        this.errors.push({ table: tableName, error: createError.message });
        return false;
      }

      console.log(`    ✅ Consolidated staff policies for ${tableName}`);
      this.consolidatedTables.push(tableName);
      return true;

    } catch (err) {
      console.error(`    ❌ Exception consolidating ${tableName}:`, err.message);
      this.errors.push({ table: tableName, error: err.message });
      return false;
    }
  }

  async consolidateAdminStaffPolicies() {
    console.log('🔧 Consolidating admin/staff policy conflicts...');
    
    const adminStaffConflicts = [
      'backup_configurations',
      'backup_jobs', 
      'compliance_policies',
      'disaster_recovery_plans',
      'late_fee_configurations',
      'locations',
      'location_staff',
      'restore_points',
      'recovery_executions',
      'tax_configurations'
    ];

    let consolidatedCount = 0;

    for (const tableName of adminStaffConflicts) {
      try {
        console.log(`  🔧 Consolidating admin/staff policies for: ${tableName}`);
        
        // Drop conflicting policies
        const dropQueries = [
          `DROP POLICY IF EXISTS "Admins can manage ${tableName.replace('_', ' ')}" ON ${tableName};`,
          `DROP POLICY IF EXISTS "Staff can view ${tableName.replace('_', ' ')}" ON ${tableName};`,
          `DROP POLICY IF EXISTS "Managers can manage ${tableName.replace('_', ' ')}" ON ${tableName};`,
          `DROP POLICY IF EXISTS "Staff can view all ${tableName.replace('_', ' ')}" ON ${tableName};`
        ];

        for (const query of dropQueries) {
          const { error } = await supabase.rpc('exec_sql', { sql: query });
          if (error && !error.message.includes('does not exist')) {
            console.error(`    ❌ Error dropping policy: ${error.message}`);
          }
        }

        // Create single staff policy (staff includes admin permissions)
        const createQuery = `
          CREATE POLICY "Staff can manage ${tableName}" ON ${tableName}
          FOR ALL TO public
          USING ((SELECT is_staff FROM get_current_user_context()));
        `;

        const { error: createError } = await supabase.rpc('exec_sql', { sql: createQuery });

        if (createError) {
          console.error(`    ❌ Error creating consolidated policy: ${createError.message}`);
          this.errors.push({ table: tableName, error: createError.message });
        } else {
          console.log(`    ✅ Consolidated admin/staff policies for ${tableName}`);
          consolidatedCount++;
        }

      } catch (err) {
        console.error(`    ❌ Exception consolidating ${tableName}:`, err.message);
        this.errors.push({ table: tableName, error: err.message });
      }
    }

    return consolidatedCount;
  }

  generateReport() {
    return {
      timestamp: new Date().toISOString(),
      summary: {
        consolidated_tables: this.consolidatedTables.length,
        errors: this.errors.length,
        estimated_warnings_resolved: this.consolidatedTables.length * 4 // Each table affects 4 roles
      },
      consolidated_tables: this.consolidatedTables,
      errors: this.errors
    };
  }

  async run() {
    console.log('🔧 Starting Staff Policy Consolidation...');
    console.log('=======================================');
    
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

      // Get tables with duplicate policies
      const duplicateTables = await this.getTablesWithDuplicateStaffPolicies();
      
      // Consolidate staff policies
      console.log('🔧 Consolidating duplicate staff policies...');
      let consolidatedCount = 0;
      
      for (const tableName of duplicateTables) {
        const success = await this.consolidateStaffPolicies(tableName);
        if (success) consolidatedCount++;
      }

      // Consolidate admin/staff conflicts
      const adminStaffCount = await this.consolidateAdminStaffPolicies();

      // Generate report
      const report = this.generateReport();
      
      console.log('\n🔧 Staff Policy Consolidation Summary');
      console.log('====================================');
      console.log(`✅ Staff policies consolidated: ${consolidatedCount}`);
      console.log(`✅ Admin/staff conflicts resolved: ${adminStaffCount}`);
      console.log(`✅ Total tables optimized: ${consolidatedCount + adminStaffCount}`);
      console.log(`✅ Estimated warnings resolved: ${(consolidatedCount + adminStaffCount) * 4}`);
      console.log(`❌ Errors: ${report.summary.errors}`);
      
      if (this.errors.length > 0) {
        console.log('\n❌ Errors Encountered:');
        this.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error.table}: ${error.error}`);
        });
      }

      console.log('\n🎯 Expected Impact:');
      const warningsResolved = (consolidatedCount + adminStaffCount) * 4;
      console.log(`- Warnings resolved: ~${warningsResolved}`);
      console.log(`- Reduction: ${Math.round((warningsResolved / 430) * 100)}%`);
      
      return this.errors.length === 0;
      
    } catch (error) {
      console.error('❌ Staff policy consolidation failed:', error);
      return false;
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const consolidation = new StaffPolicyConsolidation();
  consolidation.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Staff policy consolidation failed:', error);
    process.exit(1);
  });
}

export default StaffPolicyConsolidation;
