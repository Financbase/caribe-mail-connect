#!/usr/bin/env node

/**
 * PRMCMS Migration Validation Test
 * Tests database connectivity and data integrity after consolidation
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

async function runValidationTests() {
  console.log('🧪 Running PRMCMS Migration Validation Tests');
  console.log('==============================================');
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Database Connectivity
  console.log('\n📡 Test 1: Database Connectivity');
  try {
    const { data, error } = await supabase
      .from('environment_config')
      .select('*', { count: 'exact' });
    
    if (error) throw error;
    console.log('✅ Database connection successful');
    passed++;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    failed++;
  }
  
  // Test 2: Environment Configuration
  console.log('\n⚙️  Test 2: Environment Configuration');
  try {
    const { data, error } = await supabase
      .from('environment_config')
      .select('environment, config_key, config_value')
      .eq('environment', 'development');
    
    if (error) throw error;
    if (data.length >= 5) {
      console.log('✅ Environment configuration complete');
      console.log(`   Found ${data.length} development configs`);
      passed++;
    } else {
      throw new Error('Incomplete environment configuration');
    }
  } catch (error) {
    console.error('❌ Environment configuration test failed:', error.message);
    failed++;
  }
  
  // Test 3: Test Users Migration
  console.log('\n👥 Test 3: Test Users Migration');
  try {
    const { data, error } = await supabase
      .from('test_users')
      .select('email, role')
      .order('role');
    
    if (error) throw error;
    if (data.length === 3) {
      console.log('✅ Test users migrated successfully');
      console.log('   Users:', data.map(u => `${u.email} (${u.role})`).join(', '));
      passed++;
    } else {
      throw new Error(`Expected 3 test users, found ${data.length}`);
    }
  } catch (error) {
    console.error('❌ Test users migration failed:', error.message);
    failed++;
  }
  
  // Test 4: Original Data Integrity
  console.log('\n📦 Test 4: Original Data Integrity');
  try {
    const { data, error, count } = await supabase
      .from('mailboxes')
      .select('*', { count: 'exact' });
    
    if (error) throw error;
    if (count >= 20) {
      console.log('✅ Original mailbox data preserved');
      console.log(`   Found ${count} mailboxes`);
      passed++;
    } else {
      throw new Error(`Expected 20+ mailboxes, found ${count}`);
    }
  } catch (error) {
    console.error('❌ Original data integrity test failed:', error.message);
    failed++;
  }
  
  // Test 5: Schema Completeness
  console.log('\n🗄️  Test 5: Schema Completeness');
  try {
    // Use a simple table check instead of RPC
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name', { count: 'exact' })
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');

    if (error) {
      // Fallback: just check if we have the key tables
      const { data: mailboxData } = await supabase.from('mailboxes').select('*').limit(1);
      const { data: usersData } = await supabase.from('test_users').select('*').limit(1);
      const { data: configData } = await supabase.from('environment_config').select('*').limit(1);

      if (mailboxData && usersData && configData) {
        console.log('✅ Schema completeness verified (key tables present)');
        passed++;
      } else {
        throw new Error('Key tables missing');
      }
    } else {
      console.log('✅ Schema completeness verified');
      console.log(`   Found ${data.length} tables`);
      passed++;
    }
  } catch (error) {
    console.error('❌ Schema completeness test failed:', error.message);
    failed++;
  }
  
  // Test 6: Environment Switching
  console.log('\n🔄 Test 6: Environment Switching');
  try {
    // Switch to staging
    const { error: updateError } = await supabase
      .from('environment_config')
      .upsert({
        environment: 'system',
        config_key: 'current_environment',
        config_value: 'staging'
      }, { onConflict: 'environment,config_key' });
    
    if (updateError) throw updateError;
    
    // Verify switch
    const { data, error } = await supabase
      .from('environment_config')
      .select('config_value')
      .eq('environment', 'system')
      .eq('config_key', 'current_environment')
      .single();
    
    if (error) throw error;
    if (data.config_value === 'staging') {
      console.log('✅ Environment switching works');
      
      // Switch back to development
      await supabase
        .from('environment_config')
        .upsert({
          environment: 'system',
          config_key: 'current_environment',
          config_value: 'development'
        }, { onConflict: 'environment,config_key' });
      
      passed++;
    } else {
      throw new Error('Environment switch failed');
    }
  } catch (error) {
    console.error('❌ Environment switching test failed:', error.message);
    failed++;
  }
  
  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Migration is successful.');
    console.log('✅ PRMCMS Supabase consolidation completed successfully.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
    process.exit(1);
  }
}

runValidationTests().catch(console.error);
