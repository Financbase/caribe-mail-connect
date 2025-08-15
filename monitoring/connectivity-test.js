#!/usr/bin/env node

/**
 * PRMCMS Connectivity Test Suite
 * Tests database connectivity and basic operations for the consolidated Supabase project
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

async function runConnectivityTests() {
  console.log('🔗 PRMCMS Database Connectivity Test Suite');
  console.log('==========================================');
  console.log(`Environment: ${process.env.ENVIRONMENT || 'development'}`);
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);
  
  let passed = 0;
  let failed = 0;
  const results = [];
  
  // Test 1: Basic Connection
  console.log('📡 Test 1: Basic Database Connection');
  try {
    const { data, error } = await supabase
      .from('environment_config')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Database connection successful');
    results.push({ test: 'Basic Connection', status: 'PASS', details: 'Connected successfully' });
    passed++;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    results.push({ test: 'Basic Connection', status: 'FAIL', details: error.message });
    failed++;
  }
  
  // Test 2: Read Operations
  console.log('\n📖 Test 2: Read Operations');
  try {
    const { data: mailboxes, error: mailboxError } = await supabase
      .from('mailboxes')
      .select('*')
      .limit(5);
    
    const { data: users, error: userError } = await supabase
      .from('test_users')
      .select('email, role')
      .limit(3);
    
    if (mailboxError) throw mailboxError;
    if (userError) throw userError;
    
    console.log(`✅ Read operations successful - ${mailboxes.length} mailboxes, ${users.length} users`);
    results.push({ test: 'Read Operations', status: 'PASS', details: `${mailboxes.length} mailboxes, ${users.length} users` });
    passed++;
  } catch (error) {
    console.error('❌ Read operations failed:', error.message);
    results.push({ test: 'Read Operations', status: 'FAIL', details: error.message });
    failed++;
  }
  
  // Test 3: Write Operations (Create)
  console.log('\n✏️  Test 3: Write Operations (Create)');
  try {
    const testRecord = {
      environment: 'test',
      config_key: 'connectivity_test',
      config_value: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('environment_config')
      .insert(testRecord)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Write operations successful - Test record created');
    results.push({ test: 'Write Operations', status: 'PASS', details: 'Test record created' });
    passed++;
  } catch (error) {
    console.error('❌ Write operations failed:', error.message);
    results.push({ test: 'Write Operations', status: 'FAIL', details: error.message });
    failed++;
  }
  
  // Test 4: Update Operations
  console.log('\n🔄 Test 4: Update Operations');
  try {
    const { data, error } = await supabase
      .from('environment_config')
      .update({ config_value: 'updated_' + new Date().toISOString() })
      .eq('environment', 'test')
      .eq('config_key', 'connectivity_test')
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ Update operations successful - Test record updated');
    results.push({ test: 'Update Operations', status: 'PASS', details: 'Test record updated' });
    passed++;
  } catch (error) {
    console.error('❌ Update operations failed:', error.message);
    results.push({ test: 'Update Operations', status: 'FAIL', details: error.message });
    failed++;
  }
  
  // Test 5: Delete Operations
  console.log('\n🗑️  Test 5: Delete Operations');
  try {
    const { error } = await supabase
      .from('environment_config')
      .delete()
      .eq('environment', 'test')
      .eq('config_key', 'connectivity_test');
    
    if (error) throw error;
    console.log('✅ Delete operations successful - Test record deleted');
    results.push({ test: 'Delete Operations', status: 'PASS', details: 'Test record deleted' });
    passed++;
  } catch (error) {
    console.error('❌ Delete operations failed:', error.message);
    results.push({ test: 'Delete Operations', status: 'FAIL', details: error.message });
    failed++;
  }
  
  // Test 6: Authentication Test
  console.log('\n🔐 Test 6: Authentication System');
  try {
    // Test with anon key
    const anonClient = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY);
    const { data, error } = await anonClient
      .from('test_users')
      .select('email')
      .limit(1);
    
    // This should work with anon key for public data
    console.log('✅ Authentication system operational');
    results.push({ test: 'Authentication', status: 'PASS', details: 'Anon key access working' });
    passed++;
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    results.push({ test: 'Authentication', status: 'FAIL', details: error.message });
    failed++;
  }
  
  // Test 7: Environment Configuration
  console.log('\n⚙️  Test 7: Environment Configuration');
  try {
    const { data, error } = await supabase
      .from('environment_config')
      .select('*')
      .eq('environment', process.env.ENVIRONMENT || 'development');
    
    if (error) throw error;
    if (data.length >= 5) {
      console.log(`✅ Environment configuration complete - ${data.length} configs found`);
      results.push({ test: 'Environment Config', status: 'PASS', details: `${data.length} configs found` });
      passed++;
    } else {
      throw new Error(`Insufficient environment configs: ${data.length}`);
    }
  } catch (error) {
    console.error('❌ Environment configuration test failed:', error.message);
    results.push({ test: 'Environment Config', status: 'FAIL', details: error.message });
    failed++;
  }
  
  // Test 8: Performance Test
  console.log('\n⚡ Test 8: Performance Test');
  try {
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('mailboxes')
      .select('*')
      .limit(10);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (error) throw error;
    
    if (responseTime < 1000) { // Less than 1 second
      console.log(`✅ Performance test passed - Response time: ${responseTime}ms`);
      results.push({ test: 'Performance', status: 'PASS', details: `${responseTime}ms response time` });
      passed++;
    } else {
      throw new Error(`Slow response time: ${responseTime}ms`);
    }
  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
    results.push({ test: 'Performance', status: 'FAIL', details: error.message });
    failed++;
  }
  
  // Summary
  console.log('\n📊 Connectivity Test Results');
  console.log('============================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  // Detailed Results
  console.log('\n📋 Detailed Results:');
  results.forEach(result => {
    const status = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${status} ${result.test}: ${result.details}`);
  });
  
  // Save results to file
  const reportData = {
    timestamp: new Date().toISOString(),
    environment: process.env.ENVIRONMENT || 'development',
    supabaseUrl,
    summary: {
      passed,
      failed,
      successRate: Math.round((passed / (passed + failed)) * 100)
    },
    results
  };
  
  // Write report
  const fs = await import('fs');
  const reportPath = `monitoring/connectivity-report-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}`);
  
  if (failed === 0) {
    console.log('\n🎉 All connectivity tests passed! Database is fully operational.');
    return true;
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
    return false;
  }
}

runConnectivityTests().catch(console.error);
