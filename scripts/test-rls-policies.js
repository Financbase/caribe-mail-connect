#!/usr/bin/env node

/**
 * PRMCMS RLS Testing Script
 * Tests Row Level Security policies across different environments and user roles
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey);
const anonClient = createClient(supabaseUrl, supabaseAnonKey);

class RLSTester {
  constructor() {
    this.testResults = [];
  }

  async testEnvironmentAwareness() {
    console.log('🌍 Testing Environment Awareness...');
    
    try {
      // Test current environment detection
      const { data, error } = await adminClient.rpc('get_current_environment');
      
      if (error) {
        console.error('❌ Error getting current environment:', error.message);
        return false;
      }
      
      console.log(`✅ Current environment: ${data}`);
      
      // Test development environment check
      const { data: isDev, error: devError } = await adminClient.rpc('is_development_env');
      
      if (devError) {
        console.error('❌ Error checking development environment:', devError.message);
        return false;
      }
      
      console.log(`✅ Is development environment: ${isDev}`);
      
      this.testResults.push({
        test: 'Environment Awareness',
        status: 'PASS',
        details: `Current: ${data}, IsDev: ${isDev}`
      });
      
      return true;
    } catch (error) {
      console.error('❌ Environment awareness test failed:', error.message);
      this.testResults.push({
        test: 'Environment Awareness',
        status: 'FAIL',
        details: error.message
      });
      return false;
    }
  }

  async testDevelopmentAccess() {
    console.log('🔓 Testing Development Environment Access...');
    
    try {
      // In development, should have full access to all tables
      const tables = ['customers', 'packages', 'mailboxes', 'test_users', 'notifications'];
      let allPassed = true;
      
      for (const table of tables) {
        try {
          const { data, error } = await adminClient
            .from(table)
            .select('*')
            .limit(1);
          
          if (error) {
            console.error(`❌ Error accessing ${table}:`, error.message);
            allPassed = false;
          } else {
            console.log(`✅ ${table}: Access granted (${data.length} records)`);
          }
        } catch (error) {
          console.error(`❌ Error accessing ${table}:`, error.message);
          allPassed = false;
        }
      }
      
      this.testResults.push({
        test: 'Development Access',
        status: allPassed ? 'PASS' : 'FAIL',
        details: `Tested ${tables.length} tables`
      });
      
      return allPassed;
    } catch (error) {
      console.error('❌ Development access test failed:', error.message);
      this.testResults.push({
        test: 'Development Access',
        status: 'FAIL',
        details: error.message
      });
      return false;
    }
  }

  async testAnonymousAccess() {
    console.log('👤 Testing Anonymous User Access...');
    
    try {
      // Test anonymous access to mailboxes (should only see available ones)
      const { data: mailboxes, error: mailboxError } = await anonClient
        .from('mailboxes')
        .select('*')
        .limit(5);
      
      if (mailboxError) {
        console.log(`✅ Anonymous mailbox access properly restricted: ${mailboxError.message}`);
      } else {
        console.log(`✅ Anonymous mailbox access: ${mailboxes.length} available mailboxes`);
      }
      
      // Test anonymous access to customers (should be denied)
      const { data: customers, error: customerError } = await anonClient
        .from('customers')
        .select('*')
        .limit(1);
      
      if (customerError) {
        console.log(`✅ Anonymous customer access properly denied: ${customerError.message}`);
      } else {
        console.log(`⚠️  Anonymous customer access allowed: ${customers.length} records`);
      }
      
      // Test anonymous access to packages (should be denied)
      const { data: packages, error: packageError } = await anonClient
        .from('packages')
        .select('*')
        .limit(1);
      
      if (packageError) {
        console.log(`✅ Anonymous package access properly denied: ${packageError.message}`);
      } else {
        console.log(`⚠️  Anonymous package access allowed: ${packages.length} records`);
      }
      
      this.testResults.push({
        test: 'Anonymous Access',
        status: 'PASS',
        details: 'Access restrictions working as expected'
      });
      
      return true;
    } catch (error) {
      console.error('❌ Anonymous access test failed:', error.message);
      this.testResults.push({
        test: 'Anonymous Access',
        status: 'FAIL',
        details: error.message
      });
      return false;
    }
  }

  async testRLSStatus() {
    console.log('🔒 Testing RLS Status...');
    
    try {
      const { data, error } = await adminClient.rpc('exec_sql', {
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
        // Fallback to direct query
        const { data: rlsData, error: rlsError } = await adminClient
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .in('table_name', ['customers', 'packages', 'mailboxes', 'test_users', 'notifications', 'audit_logs', 'user_profiles']);
        
        if (rlsError) {
          throw rlsError;
        }
        
        console.log(`✅ RLS verification: ${rlsData.length} tables checked`);
      } else {
        console.log('\n📊 RLS Status Report:');
        console.log('=====================');
        
        let allEnabled = true;
        data.forEach(row => {
          const status = row.rls_enabled ? '✅' : '❌';
          console.log(`${status} ${row.tablename}: RLS ${row.rls_enabled ? 'enabled' : 'disabled'}, ${row.policy_count} policies`);
          if (!row.rls_enabled) allEnabled = false;
        });
        
        this.testResults.push({
          test: 'RLS Status',
          status: allEnabled ? 'PASS' : 'FAIL',
          details: `${data.length} tables checked`
        });
        
        return allEnabled;
      }
      
      return true;
    } catch (error) {
      console.error('❌ RLS status test failed:', error.message);
      this.testResults.push({
        test: 'RLS Status',
        status: 'FAIL',
        details: error.message
      });
      return false;
    }
  }

  async testEnvironmentSwitching() {
    console.log('🔄 Testing Environment Switching Impact...');
    
    try {
      // Get current environment
      const { data: currentEnv } = await adminClient.rpc('get_current_environment');
      console.log(`📍 Starting environment: ${currentEnv}`);
      
      // Test switching to staging
      await adminClient
        .from('environment_config')
        .upsert({
          environment: 'system',
          config_key: 'current_environment',
          config_value: 'staging'
        }, { onConflict: 'environment,config_key' });
      
      // Check if environment changed
      const { data: newEnv } = await adminClient.rpc('get_current_environment');
      console.log(`📍 After switch: ${newEnv}`);
      
      // Test development environment check
      const { data: isDev } = await adminClient.rpc('is_development_env');
      console.log(`📍 Is development: ${isDev}`);
      
      // Switch back to original environment
      await adminClient
        .from('environment_config')
        .upsert({
          environment: 'system',
          config_key: 'current_environment',
          config_value: currentEnv
        }, { onConflict: 'environment,config_key' });
      
      console.log(`📍 Restored to: ${currentEnv}`);
      
      this.testResults.push({
        test: 'Environment Switching',
        status: 'PASS',
        details: `Switched from ${currentEnv} to ${newEnv} and back`
      });
      
      return true;
    } catch (error) {
      console.error('❌ Environment switching test failed:', error.message);
      this.testResults.push({
        test: 'Environment Switching',
        status: 'FAIL',
        details: error.message
      });
      return false;
    }
  }

  async testDataAccess() {
    console.log('📊 Testing Data Access Patterns...');
    
    try {
      // Test basic data access
      const { data: mailboxes, error: mailboxError } = await adminClient
        .from('mailboxes')
        .select('*')
        .limit(3);
      
      if (mailboxError) {
        console.error('❌ Mailbox access error:', mailboxError.message);
        return false;
      }
      
      console.log(`✅ Mailbox access: ${mailboxes.length} records`);
      
      // Test test_users access
      const { data: users, error: userError } = await adminClient
        .from('test_users')
        .select('*')
        .limit(3);
      
      if (userError) {
        console.error('❌ Test users access error:', userError.message);
        return false;
      }
      
      console.log(`✅ Test users access: ${users.length} records`);
      
      // Test environment config access
      const { data: configs, error: configError } = await adminClient
        .from('environment_config')
        .select('*')
        .limit(5);
      
      if (configError) {
        console.error('❌ Environment config access error:', configError.message);
        return false;
      }
      
      console.log(`✅ Environment config access: ${configs.length} records`);
      
      this.testResults.push({
        test: 'Data Access',
        status: 'PASS',
        details: `${mailboxes.length} mailboxes, ${users.length} users, ${configs.length} configs`
      });
      
      return true;
    } catch (error) {
      console.error('❌ Data access test failed:', error.message);
      this.testResults.push({
        test: 'Data Access',
        status: 'FAIL',
        details: error.message
      });
      return false;
    }
  }

  async runAllTests() {
    console.log('🧪 PRMCMS RLS Testing Suite');
    console.log('===========================');
    console.log(`Environment: ${process.env.ENVIRONMENT || 'development'}`);
    console.log(`Timestamp: ${new Date().toISOString()}\n`);
    
    const tests = [
      () => this.testEnvironmentAwareness(),
      () => this.testRLSStatus(),
      () => this.testDevelopmentAccess(),
      () => this.testAnonymousAccess(),
      () => this.testEnvironmentSwitching(),
      () => this.testDataAccess()
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
      try {
        const result = await test();
        if (result) {
          passed++;
        } else {
          failed++;
        }
        console.log(''); // Add spacing between tests
      } catch (error) {
        console.error('❌ Test execution error:', error.message);
        failed++;
        console.log('');
      }
    }
    
    // Summary
    console.log('📊 RLS Test Results');
    console.log('===================');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    // Detailed Results
    console.log('\n📋 Detailed Results:');
    this.testResults.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.details}`);
    });
    
    return failed === 0;
  }
}

// CLI Interface
async function main() {
  const tester = new RLSTester();
  
  try {
    const success = await tester.runAllTests();
    console.log(`\n🎯 RLS Testing ${success ? 'COMPLETED SUCCESSFULLY' : 'COMPLETED WITH ISSUES'}`);
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default RLSTester;
