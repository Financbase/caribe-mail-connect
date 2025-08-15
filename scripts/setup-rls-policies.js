#!/usr/bin/env node

/**
 * PRMCMS Row Level Security (RLS) Setup Script
 * Configures comprehensive RLS policies for the consolidated Supabase project
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

class RLSManager {
  constructor() {
    this.tables = [
      'customers',
      'packages', 
      'mailboxes',
      'test_users',
      'notifications',
      'audit_logs',
      'user_profiles'
    ];
  }

  async enableRLS() {
    console.log('🔒 Enabling Row Level Security on all tables...');
    
    for (const table of this.tables) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql: `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`
        });
        
        if (error) {
          console.error(`❌ Error enabling RLS on ${table}:`, error.message);
        } else {
          console.log(`✅ RLS enabled on ${table}`);
        }
      } catch (error) {
        console.error(`❌ Error enabling RLS on ${table}:`, error.message);
      }
    }
  }

  async createEnvironmentAwareFunction() {
    console.log('🔧 Creating environment-aware helper functions...');
    
    const functions = [
      // Function to get current environment
      `
      CREATE OR REPLACE FUNCTION get_current_environment()
      RETURNS TEXT AS $$
      BEGIN
        RETURN COALESCE(
          (SELECT config_value FROM environment_config 
           WHERE environment = 'system' AND config_key = 'current_environment'),
          'development'
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
      
      // Function to check if user is admin
      `
      CREATE OR REPLACE FUNCTION is_admin_user()
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN COALESCE(
          (auth.jwt() ->> 'role') = 'admin' OR
          (auth.jwt() ->> 'user_role') = 'admin' OR
          EXISTS(SELECT 1 FROM test_users WHERE id = auth.uid() AND role = 'admin'),
          false
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
      
      // Function to check if user is staff
      `
      CREATE OR REPLACE FUNCTION is_staff_user()
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN COALESCE(
          (auth.jwt() ->> 'role') IN ('admin', 'staff') OR
          (auth.jwt() ->> 'user_role') IN ('admin', 'staff') OR
          EXISTS(SELECT 1 FROM test_users WHERE id = auth.uid() AND role IN ('admin', 'staff')),
          false
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
      
      // Function to check development environment
      `
      CREATE OR REPLACE FUNCTION is_development_env()
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN get_current_environment() = 'development';
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    ];

    for (const func of functions) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: func });
        if (error) {
          console.error(`❌ Error creating function:`, error.message);
        }
      } catch (error) {
        console.error(`❌ Error creating function:`, error.message);
      }
    }
    
    console.log('✅ Helper functions created');
  }

  async createCustomersPolicies() {
    console.log('👥 Creating RLS policies for customers table...');
    
    const policies = [
      // Development: Full access for testing
      `
      CREATE POLICY "dev_customers_full_access" ON customers
      FOR ALL USING (is_development_env());
      `,
      
      // Users can view their own customer record
      `
      CREATE POLICY "customers_own_record" ON customers
      FOR SELECT USING (
        NOT is_development_env() AND (
          auth.uid() = user_id OR
          auth.uid() = id
        )
      );
      `,
      
      // Staff can view all customer records
      `
      CREATE POLICY "customers_staff_access" ON customers
      FOR SELECT USING (
        NOT is_development_env() AND is_staff_user()
      );
      `,
      
      // Admin can manage all customer records
      `
      CREATE POLICY "customers_admin_manage" ON customers
      FOR ALL USING (
        NOT is_development_env() AND is_admin_user()
      );
      `,
      
      // Users can update their own customer record
      `
      CREATE POLICY "customers_own_update" ON customers
      FOR UPDATE USING (
        NOT is_development_env() AND (
          auth.uid() = user_id OR
          auth.uid() = id
        )
      );
      `
    ];

    await this.executePolicies('customers', policies);
  }

  async createPackagesPolicies() {
    console.log('📦 Creating RLS policies for packages table...');
    
    const policies = [
      // Development: Full access
      `
      CREATE POLICY "dev_packages_full_access" ON packages
      FOR ALL USING (is_development_env());
      `,
      
      // Users can view their own packages
      `
      CREATE POLICY "packages_own_view" ON packages
      FOR SELECT USING (
        NOT is_development_env() AND auth.uid() = customer_id
      );
      `,
      
      // Staff can view all packages
      `
      CREATE POLICY "packages_staff_view" ON packages
      FOR SELECT USING (
        NOT is_development_env() AND is_staff_user()
      );
      `,
      
      // Admin can manage all packages
      `
      CREATE POLICY "packages_admin_manage" ON packages
      FOR ALL USING (
        NOT is_development_env() AND is_admin_user()
      );
      `,
      
      // Staff can update package status
      `
      CREATE POLICY "packages_staff_update" ON packages
      FOR UPDATE USING (
        NOT is_development_env() AND is_staff_user()
      );
      `
    ];

    await this.executePolicies('packages', policies);
  }

  async createMailboxesPolicies() {
    console.log('📬 Creating RLS policies for mailboxes table...');
    
    const policies = [
      // Development: Full access
      `
      CREATE POLICY "dev_mailboxes_full_access" ON mailboxes
      FOR ALL USING (is_development_env());
      `,
      
      // Users can view their own mailboxes
      `
      CREATE POLICY "mailboxes_own_view" ON mailboxes
      FOR SELECT USING (
        NOT is_development_env() AND auth.uid() = current_customer_id
      );
      `,
      
      // Staff can view all mailboxes
      `
      CREATE POLICY "mailboxes_staff_view" ON mailboxes
      FOR SELECT USING (
        NOT is_development_env() AND is_staff_user()
      );
      `,
      
      // Admin can manage all mailboxes
      `
      CREATE POLICY "mailboxes_admin_manage" ON mailboxes
      FOR ALL USING (
        NOT is_development_env() AND is_admin_user()
      );
      `,
      
      // Anonymous users can view available mailboxes (for rental)
      `
      CREATE POLICY "mailboxes_public_available" ON mailboxes
      FOR SELECT USING (
        NOT is_development_env() AND 
        status = 'available' AND
        auth.role() = 'anon'
      );
      `
    ];

    await this.executePolicies('mailboxes', policies);
  }

  async createTestUsersPolicies() {
    console.log('🧪 Creating RLS policies for test_users table...');
    
    const policies = [
      // Development: Full access
      `
      CREATE POLICY "dev_test_users_full_access" ON test_users
      FOR ALL USING (is_development_env());
      `,
      
      // Users can view their own profile
      `
      CREATE POLICY "test_users_own_profile" ON test_users
      FOR SELECT USING (
        NOT is_development_env() AND auth.uid() = id
      );
      `,
      
      // Admin can manage all test users
      `
      CREATE POLICY "test_users_admin_manage" ON test_users
      FOR ALL USING (
        NOT is_development_env() AND is_admin_user()
      );
      `,
      
      // Users can update their own profile
      `
      CREATE POLICY "test_users_own_update" ON test_users
      FOR UPDATE USING (
        NOT is_development_env() AND auth.uid() = id
      );
      `
    ];

    await this.executePolicies('test_users', policies);
  }

  async createNotificationsPolicies() {
    console.log('🔔 Creating RLS policies for notifications table...');
    
    const policies = [
      // Development: Full access
      `
      CREATE POLICY "dev_notifications_full_access" ON notifications
      FOR ALL USING (is_development_env());
      `,
      
      // Users can view their own notifications
      `
      CREATE POLICY "notifications_own_view" ON notifications
      FOR SELECT USING (
        NOT is_development_env() AND auth.uid() = customer_id
      );
      `,
      
      // Staff can view all notifications
      `
      CREATE POLICY "notifications_staff_view" ON notifications
      FOR SELECT USING (
        NOT is_development_env() AND is_staff_user()
      );
      `,
      
      // Admin can manage all notifications
      `
      CREATE POLICY "notifications_admin_manage" ON notifications
      FOR ALL USING (
        NOT is_development_env() AND is_admin_user()
      );
      `,
      
      // Users can mark their notifications as read
      `
      CREATE POLICY "notifications_own_update" ON notifications
      FOR UPDATE USING (
        NOT is_development_env() AND 
        auth.uid() = customer_id AND
        read_at IS NULL
      );
      `
    ];

    await this.executePolicies('notifications', policies);
  }

  async createAuditLogsPolicies() {
    console.log('📋 Creating RLS policies for audit_logs table...');
    
    const policies = [
      // Development: Full access
      `
      CREATE POLICY "dev_audit_logs_full_access" ON audit_logs
      FOR ALL USING (is_development_env());
      `,
      
      // Only admin can view audit logs in production
      `
      CREATE POLICY "audit_logs_admin_only" ON audit_logs
      FOR SELECT USING (
        NOT is_development_env() AND is_admin_user()
      );
      `,
      
      // System can insert audit logs
      `
      CREATE POLICY "audit_logs_system_insert" ON audit_logs
      FOR INSERT WITH CHECK (true);
      `
    ];

    await this.executePolicies('audit_logs', policies);
  }

  async createUserProfilesPolicies() {
    console.log('👤 Creating RLS policies for user_profiles table...');
    
    const policies = [
      // Development: Full access
      `
      CREATE POLICY "dev_user_profiles_full_access" ON user_profiles
      FOR ALL USING (is_development_env());
      `,
      
      // Users can view their own profile
      `
      CREATE POLICY "user_profiles_own_view" ON user_profiles
      FOR SELECT USING (
        NOT is_development_env() AND auth.uid()::text = id::text
      );
      `,
      
      // Admin can view all profiles
      `
      CREATE POLICY "user_profiles_admin_view" ON user_profiles
      FOR SELECT USING (
        NOT is_development_env() AND is_admin_user()
      );
      `,
      
      // Users can update their own profile
      `
      CREATE POLICY "user_profiles_own_update" ON user_profiles
      FOR UPDATE USING (
        NOT is_development_env() AND auth.uid()::text = id::text
      );
      `
    ];

    await this.executePolicies('user_profiles', policies);
  }

  async executePolicies(tableName, policies) {
    // First drop existing policies
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `DROP POLICY IF EXISTS "dev_${tableName}_full_access" ON ${tableName};`
      });
    } catch (error) {
      // Ignore errors for non-existent policies
    }

    // Create new policies
    for (const policy of policies) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: policy });
        if (error) {
          console.error(`❌ Error creating policy for ${tableName}:`, error.message);
        }
      } catch (error) {
        console.error(`❌ Error creating policy for ${tableName}:`, error.message);
      }
    }
    
    console.log(`✅ RLS policies created for ${tableName}`);
  }

  async verifyRLSSetup() {
    console.log('🔍 Verifying RLS setup...');
    
    try {
      // Check if RLS is enabled on all tables
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
        SELECT 
          schemaname,
          tablename,
          rowsecurity as rls_enabled,
          (SELECT count(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = t.tablename) as policy_count
        FROM pg_tables t
        WHERE schemaname = 'public' 
        AND tablename IN ('customers', 'packages', 'mailboxes', 'test_users', 'notifications', 'audit_logs', 'user_profiles')
        ORDER BY tablename;
        `
      });

      if (error) {
        console.error('❌ Error verifying RLS setup:', error.message);
        return false;
      }

      console.log('\n📊 RLS Status Report:');
      console.log('=====================');
      
      let allEnabled = true;
      data.forEach(row => {
        const status = row.rls_enabled ? '✅' : '❌';
        console.log(`${status} ${row.tablename}: RLS ${row.rls_enabled ? 'enabled' : 'disabled'}, ${row.policy_count} policies`);
        if (!row.rls_enabled) allEnabled = false;
      });

      return allEnabled;
    } catch (error) {
      console.error('❌ Error verifying RLS setup:', error.message);
      return false;
    }
  }

  async setupRLS() {
    console.log('🔒 Setting up comprehensive RLS for PRMCMS...');
    console.log('===============================================');
    
    try {
      await this.enableRLS();
      await this.createEnvironmentAwareFunction();
      await this.createCustomersPolicies();
      await this.createPackagesPolicies();
      await this.createMailboxesPolicies();
      await this.createTestUsersPolicies();
      await this.createNotificationsPolicies();
      await this.createAuditLogsPolicies();
      await this.createUserProfilesPolicies();
      
      const success = await this.verifyRLSSetup();
      
      if (success) {
        console.log('\n🎉 RLS setup completed successfully!');
        console.log('✅ All tables have RLS enabled');
        console.log('✅ Environment-aware policies created');
        console.log('✅ User-based access control implemented');
        return true;
      } else {
        console.log('\n⚠️  RLS setup completed with some issues');
        return false;
      }
    } catch (error) {
      console.error('❌ Error during RLS setup:', error.message);
      return false;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'setup';

  const rlsManager = new RLSManager();

  try {
    switch (command) {
      case 'setup':
        console.log('🚀 Starting RLS setup...');
        const success = await rlsManager.setupRLS();
        process.exit(success ? 0 : 1);
        break;
        
      case 'verify':
        console.log('🔍 Verifying RLS setup...');
        const verified = await rlsManager.verifyRLSSetup();
        process.exit(verified ? 0 : 1);
        break;
        
      default:
        console.log('PRMCMS RLS Manager');
        console.log('Usage:');
        console.log('  node setup-rls-policies.js setup   - Setup RLS policies');
        console.log('  node setup-rls-policies.js verify  - Verify RLS setup');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default RLSManager;
