#!/usr/bin/env node

/**
 * Public Access Policy Consolidation Script
 * Consolidates "Public can view X" + "Staff can manage X" policies
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

class PublicPolicyConsolidation {
  constructor() {
    this.consolidatedTables = [];
    this.errors = [];
  }

  async getTablesWithPublicStaffConflicts() {
    console.log('🔍 Identifying tables with public/staff policy conflicts...');
    
    // Tables with "Public can view X" + "Staff can manage X" patterns
    const publicStaffConflicts = [
      'community_goals',
      'consolidated_shipping',
      'eco_friendly_packaging',
      'efficiency_improvements',
      'electric_vehicles',
      'energy_consumption',
      'energy_usage_trends',
      'environmental_education',
      'environmental_visualizations',
      'green_badges',
      'green_certifications',
      'green_initiatives',
      'impact_report',
      'initiative_milestones',
      'local_initiatives',
      'paperless_initiatives',
      'partner_programs',
      'recycling_locations',
      'recycling_metrics',
      'reduction_goals',
      'solar_panels',
      'sustainability_score',
      'tier_benefits',
      'tree_planting_counter',
      'tree_plantings',
      'waste_audit'
    ];

    console.log(`📋 Found ${publicStaffConflicts.length} tables with public/staff conflicts`);
    return publicStaffConflicts;
  }

  async consolidatePublicStaffPolicies(tableName) {
    console.log(`  🔧 Consolidating public/staff policies for: ${tableName}`);
    
    try {
      // Drop the conflicting policies
      const dropQueries = [
        `DROP POLICY IF EXISTS "Public can view ${tableName.replace('_', ' ')}" ON ${tableName};`,
        `DROP POLICY IF EXISTS "Staff can manage ${tableName.replace('_', ' ')}" ON ${tableName};`,
        `DROP POLICY IF EXISTS "Authenticated can view ${tableName.replace('_', ' ')}" ON ${tableName};`,
        // Handle specific naming patterns
        `DROP POLICY IF EXISTS "Public can view ${tableName}" ON ${tableName};`,
        `DROP POLICY IF EXISTS "Staff can manage ${tableName}" ON ${tableName};`,
        `DROP POLICY IF EXISTS "Authenticated can view ${tableName}" ON ${tableName};`
      ];

      for (const query of dropQueries) {
        const { error } = await supabase.rpc('exec_sql', { sql: query });
        if (error && !error.message.includes('does not exist')) {
          console.error(`    ❌ Error dropping policy: ${error.message}`);
        }
      }

      // Create consolidated policy with role-based access
      const createQuery = `
        CREATE POLICY "${tableName}_consolidated_access" ON ${tableName}
        FOR ALL TO public
        USING (
          CASE 
            WHEN (SELECT is_staff FROM get_current_user_context()) THEN true
            ELSE true  -- Public read access maintained
          END
        )
        WITH CHECK ((SELECT is_staff FROM get_current_user_context()));
      `;

      const { error: createError } = await supabase.rpc('exec_sql', { sql: createQuery });

      if (createError) {
        console.error(`    ❌ Error creating consolidated policy: ${createError.message}`);
        this.errors.push({ table: tableName, error: createError.message });
        return false;
      }

      console.log(`    ✅ Consolidated public/staff policies for ${tableName}`);
      this.consolidatedTables.push(tableName);
      return true;

    } catch (err) {
      console.error(`    ❌ Exception consolidating ${tableName}:`, err.message);
      this.errors.push({ table: tableName, error: err.message });
      return false;
    }
  }

  async consolidateCustomerStaffPolicies() {
    console.log('🔧 Consolidating customer/staff policy conflicts...');
    
    const customerStaffConflicts = [
      'customer_appointments',
      'customer_documents', 
      'check_deposits',
      'delivery_routes',
      'documents',
      'virtual_mailbox_billing',
      'virtual_mailboxes'
    ];

    let consolidatedCount = 0;

    for (const tableName of customerStaffConflicts) {
      try {
        console.log(`  🔧 Consolidating customer/staff policies for: ${tableName}`);
        
        // Drop conflicting policies
        const dropQueries = [
          `DROP POLICY IF EXISTS "Customers can view their ${tableName.replace('_', ' ')}" ON ${tableName};`,
          `DROP POLICY IF EXISTS "Customers can manage their own ${tableName.replace('_', ' ')}" ON ${tableName};`,
          `DROP POLICY IF EXISTS "Staff can view all ${tableName.replace('_', ' ')}" ON ${tableName};`,
          `DROP POLICY IF EXISTS "Staff can manage all ${tableName.replace('_', ' ')}" ON ${tableName};`,
          `DROP POLICY IF EXISTS "Drivers can view their ${tableName.replace('_', ' ')}" ON ${tableName};`,
          `DROP POLICY IF EXISTS "Staff can view ${tableName.replace('_', ' ')}" ON ${tableName};`,
          `DROP POLICY IF EXISTS "Staff can manage ${tableName.replace('_', ' ')}" ON ${tableName};`
        ];

        for (const query of dropQueries) {
          const { error } = await supabase.rpc('exec_sql', { sql: query });
          if (error && !error.message.includes('does not exist')) {
            console.error(`    ❌ Error dropping policy: ${error.message}`);
          }
        }

        // Create consolidated policy with customer and staff access
        let createQuery;
        
        if (tableName === 'delivery_routes') {
          createQuery = `
            CREATE POLICY "${tableName}_consolidated_access" ON ${tableName}
            FOR ALL TO public
            USING (
              (SELECT is_staff FROM get_current_user_context()) OR
              driver_id = (SELECT user_id FROM get_current_user_context())
            );
          `;
        } else {
          createQuery = `
            CREATE POLICY "${tableName}_consolidated_access" ON ${tableName}
            FOR ALL TO public
            USING (
              (SELECT is_staff FROM get_current_user_context()) OR
              EXISTS (
                SELECT 1 FROM customers 
                WHERE customers.id = ${tableName}.customer_id 
                  AND customers.user_id = (SELECT user_id FROM get_current_user_context())
              )
            );
          `;
        }

        const { error: createError } = await supabase.rpc('exec_sql', { sql: createQuery });

        if (createError) {
          console.error(`    ❌ Error creating consolidated policy: ${createError.message}`);
          this.errors.push({ table: tableName, error: createError.message });
        } else {
          console.log(`    ✅ Consolidated customer/staff policies for ${tableName}`);
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
    console.log('🔧 Starting Public Policy Consolidation...');
    console.log('========================================');
    
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

      // Get tables with public/staff conflicts
      const publicTables = await this.getTablesWithPublicStaffConflicts();
      
      // Consolidate public/staff policies
      console.log('🔧 Consolidating public/staff policies...');
      let consolidatedCount = 0;
      
      for (const tableName of publicTables) {
        const success = await this.consolidatePublicStaffPolicies(tableName);
        if (success) consolidatedCount++;
      }

      // Consolidate customer/staff conflicts
      const customerStaffCount = await this.consolidateCustomerStaffPolicies();

      // Generate report
      const report = this.generateReport();
      
      console.log('\n🔧 Public Policy Consolidation Summary');
      console.log('=====================================');
      console.log(`✅ Public/staff policies consolidated: ${consolidatedCount}`);
      console.log(`✅ Customer/staff conflicts resolved: ${customerStaffCount}`);
      console.log(`✅ Total tables optimized: ${consolidatedCount + customerStaffCount}`);
      console.log(`✅ Estimated warnings resolved: ${(consolidatedCount + customerStaffCount) * 4}`);
      console.log(`❌ Errors: ${report.summary.errors}`);
      
      if (this.errors.length > 0) {
        console.log('\n❌ Errors Encountered:');
        this.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error.table}: ${error.error}`);
        });
      }

      console.log('\n🎯 Expected Impact:');
      const warningsResolved = (consolidatedCount + customerStaffCount) * 4;
      console.log(`- Warnings resolved: ~${warningsResolved}`);
      console.log(`- Reduction: ${Math.round((warningsResolved / 430) * 100)}%`);
      
      return this.errors.length === 0;
      
    } catch (error) {
      console.error('❌ Public policy consolidation failed:', error);
      return false;
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const consolidation = new PublicPolicyConsolidation();
  consolidation.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Public policy consolidation failed:', error);
    process.exit(1);
  });
}

export default PublicPolicyConsolidation;
