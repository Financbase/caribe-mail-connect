/**
 * Real Integration Testing Suite
 * Tests actual external service connections and real data flow
 * NO MOCKS - Real service integrations only
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import crypto from 'crypto';

// Real service configurations
const SUPABASE_URL = 'https://bunikaxkvghzudpraqjb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1bmlrYXhrdmdoenVkcHJhcWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDMyODUsImV4cCI6MjA2OTUxOTI4NX0.K4uKk_wWq0-XHWYYkXha7GJQuWi0cqLiGRH_vYOOMME';

// Real Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test data generators
const generateUniqueId = () => `INTEGRATION-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

describe('Real Integration Testing - End-to-End Data Flow', () => {
  let testDataIds = [];

  beforeAll(async () => {
    console.log('🔗 Initializing real integration testing...');
    
    // Verify all service connections
    const { data, error } = await supabase.from('packages').select('count', { count: 'exact', head: true });
    if (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }
    
    console.log('✅ All service connections established');
  });

  afterAll(async () => {
    // Clean up all test data
    console.log('🧹 Cleaning up integration test data...');
    
    if (testDataIds.length > 0) {
      const { error } = await supabase
        .from('packages')
        .delete()
        .in('id', testDataIds);
      
      if (error) {
        console.warn('⚠️ Failed to clean up test data:', error);
      } else {
        console.log(`✅ Cleaned up ${testDataIds.length} test records`);
      }
    }
  });

  test('Integration: Complete package lifecycle with real data persistence', async () => {
    const integrationId = generateUniqueId();
    console.log(`🔄 Testing complete package lifecycle: ${integrationId}`);

    // Step 1: Create package (simulating user input)
    const packageData = {
      tracking_number: `${integrationId}-LIFECYCLE`,
      carrier: 'UPS',
      customer_name: 'Integration Test Customer',
      customer_email: `integration-${Date.now()}@test.com`,
      status: 'received',
      weight: '2.8 lbs',
      dimensions: '15x12x8 in',
      notes: 'Complete lifecycle integration test',
      special_handling: false
    };

    const { data: createData, error: createError } = await supabase
      .from('packages')
      .insert([packageData])
      .select();

    expect(createError).toBeNull();
    expect(createData).toHaveLength(1);
    
    const packageId = createData[0].id;
    testDataIds.push(packageId);
    
    console.log(`📦 Step 1: Package created with ID ${packageId}`);

    // Step 2: Update package status (simulating processing workflow)
    const statusUpdates = ['processing', 'ready', 'delivered'];
    
    for (const status of statusUpdates) {
      const { data: updateData, error: updateError } = await supabase
        .from('packages')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          notes: `${packageData.notes} - Updated to ${status}`
        })
        .eq('id', packageId)
        .select();

      expect(updateError).toBeNull();
      expect(updateData).toHaveLength(1);
      expect(updateData[0].status).toBe(status);
      
      console.log(`📝 Step 2.${statusUpdates.indexOf(status) + 1}: Status updated to ${status}`);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Step 3: Verify final state
    const { data: finalData, error: finalError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .single();

    expect(finalError).toBeNull();
    expect(finalData.status).toBe('delivered');
    expect(finalData.tracking_number).toBe(packageData.tracking_number);
    expect(finalData.notes).toContain('Updated to delivered');
    
    console.log(`✅ Step 3: Final verification completed - Package delivered`);
  });

  test('Integration: Real-time search and filter operations', async () => {
    const integrationId = generateUniqueId();
    console.log(`🔍 Testing real-time search integration: ${integrationId}`);

    // Create multiple packages for search testing
    const testPackages = [
      {
        tracking_number: `${integrationId}-SEARCH-001`,
        carrier: 'UPS',
        customer_name: `${integrationId} Search Customer Alpha`,
        customer_email: `search-alpha-${Date.now()}@test.com`,
        status: 'received'
      },
      {
        tracking_number: `${integrationId}-SEARCH-002`,
        carrier: 'FedEx',
        customer_name: `${integrationId} Search Customer Beta`,
        customer_email: `search-beta-${Date.now()}@test.com`,
        status: 'processing'
      },
      {
        tracking_number: `${integrationId}-SEARCH-003`,
        carrier: 'USPS',
        customer_name: `${integrationId} Search Customer Gamma`,
        customer_email: `search-gamma-${Date.now()}@test.com`,
        status: 'ready'
      }
    ];

    // Insert test packages
    const { data: insertData, error: insertError } = await supabase
      .from('packages')
      .insert(testPackages)
      .select();

    expect(insertError).toBeNull();
    expect(insertData).toHaveLength(3);
    
    insertData.forEach(pkg => testDataIds.push(pkg.id));
    console.log(`📦 Created ${insertData.length} packages for search testing`);

    // Test 1: Search by tracking number pattern
    const { data: trackingSearchData, error: trackingSearchError } = await supabase
      .from('packages')
      .select('*')
      .ilike('tracking_number', `%${integrationId}-SEARCH%`);

    expect(trackingSearchError).toBeNull();
    expect(trackingSearchData).toHaveLength(3);
    console.log(`🔍 Tracking search: Found ${trackingSearchData.length} packages`);

    // Test 2: Search by customer name
    const { data: customerSearchData, error: customerSearchError } = await supabase
      .from('packages')
      .select('*')
      .ilike('customer_name', `%${integrationId} Search Customer%`);

    expect(customerSearchError).toBeNull();
    expect(customerSearchData).toHaveLength(3);
    console.log(`👤 Customer search: Found ${customerSearchData.length} packages`);

    // Test 3: Filter by status
    const { data: statusFilterData, error: statusFilterError } = await supabase
      .from('packages')
      .select('*')
      .eq('status', 'processing')
      .ilike('tracking_number', `%${integrationId}-SEARCH%`);

    expect(statusFilterError).toBeNull();
    expect(statusFilterData).toHaveLength(1);
    expect(statusFilterData[0].status).toBe('processing');
    console.log(`📊 Status filter: Found ${statusFilterData.length} processing packages`);

    // Test 4: Filter by carrier
    const { data: carrierFilterData, error: carrierFilterError } = await supabase
      .from('packages')
      .select('*')
      .eq('carrier', 'FedEx')
      .ilike('tracking_number', `%${integrationId}-SEARCH%`);

    expect(carrierFilterError).toBeNull();
    expect(carrierFilterData).toHaveLength(1);
    expect(carrierFilterData[0].carrier).toBe('FedEx');
    console.log(`🚚 Carrier filter: Found ${carrierFilterData.length} FedEx packages`);

    console.log(`✅ Real-time search and filter integration completed`);
  });

  test('Integration: Authentication flow with real user data', async () => {
    const integrationId = generateUniqueId();
    console.log(`🔐 Testing authentication integration: ${integrationId}`);

    // Test user data
    const testUser = {
      email: `integration-${Date.now()}@test.com`,
      password_hash: '$2b$10$realHashWouldGoHere',
      role: 'customer',
      first_name: 'Integration',
      last_name: 'Test User'
    };

    // Create test user
    const { data: createUserData, error: createUserError } = await supabase
      .from('test_users')
      .insert([testUser])
      .select();

    expect(createUserError).toBeNull();
    expect(createUserData).toHaveLength(1);
    
    const userId = createUserData[0].id;
    console.log(`👤 Test user created with ID: ${userId}`);

    // Simulate sign-in by updating last_sign_in_at
    const { data: signInData, error: signInError } = await supabase
      .from('test_users')
      .update({ last_sign_in_at: new Date().toISOString() })
      .eq('id', userId)
      .select();

    expect(signInError).toBeNull();
    expect(signInData).toHaveLength(1);
    expect(signInData[0].last_sign_in_at).toBeDefined();
    console.log(`🔑 User sign-in recorded`);

    // Verify user data retrieval
    const { data: userData, error: userError } = await supabase
      .from('test_users')
      .select('*')
      .eq('email', testUser.email)
      .single();

    expect(userError).toBeNull();
    expect(userData.email).toBe(testUser.email);
    expect(userData.role).toBe(testUser.role);
    expect(userData.first_name).toBe(testUser.first_name);
    expect(userData.last_name).toBe(testUser.last_name);
    expect(userData.last_sign_in_at).toBeDefined();

    // Clean up test user
    const { error: deleteUserError } = await supabase
      .from('test_users')
      .delete()
      .eq('id', userId);

    expect(deleteUserError).toBeNull();
    console.log(`🧹 Test user cleaned up`);

    console.log(`✅ Authentication integration completed`);
  });

  test('Integration: Error handling and recovery with real failures', async () => {
    const integrationId = generateUniqueId();
    console.log(`⚠️ Testing error handling integration: ${integrationId}`);

    // Test 1: Duplicate tracking number constraint
    const duplicateTrackingNumber = `${integrationId}-DUPLICATE`;
    
    // First insert should succeed
    const { data: firstInsert, error: firstError } = await supabase
      .from('packages')
      .insert([{
        tracking_number: duplicateTrackingNumber,
        carrier: 'UPS',
        customer_name: 'First Package',
        customer_email: 'first@test.com',
        status: 'received'
      }])
      .select();

    expect(firstError).toBeNull();
    expect(firstInsert).toHaveLength(1);
    testDataIds.push(firstInsert[0].id);
    console.log(`📦 First package created successfully`);

    // Second insert with same tracking number should fail
    const { data: secondInsert, error: secondError } = await supabase
      .from('packages')
      .insert([{
        tracking_number: duplicateTrackingNumber,
        carrier: 'FedEx',
        customer_name: 'Duplicate Package',
        customer_email: 'duplicate@test.com',
        status: 'received'
      }])
      .select();

    expect(secondError).toBeDefined();
    expect(secondError.code).toBe('23505'); // Unique constraint violation
    expect(secondInsert).toBeNull();
    console.log(`❌ Duplicate tracking number correctly rejected: ${secondError.message}`);

    // Test 2: Invalid data type handling
    const { data: invalidData, error: invalidError } = await supabase
      .from('packages')
      .insert([{
        tracking_number: `${integrationId}-INVALID`,
        carrier: 'UPS',
        customer_name: 'Invalid Test',
        customer_email: 'invalid@test.com',
        status: 'received',
        special_handling: 'not-a-boolean' // This should cause a type error
      }])
      .select();

    expect(invalidError).toBeDefined();
    expect(invalidData).toBeNull();
    console.log(`❌ Invalid data type correctly rejected: ${invalidError.message}`);

    // Test 3: Non-existent record update
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const { data: updateData, error: updateError } = await supabase
      .from('packages')
      .update({ status: 'processing' })
      .eq('id', fakeId)
      .select();

    expect(updateError).toBeNull(); // Supabase doesn't error on no matches
    expect(updateData).toHaveLength(0); // But returns empty array
    console.log(`📝 Non-existent record update handled gracefully`);

    console.log(`✅ Error handling integration completed`);
  });

  test('Integration: Performance and concurrency with real load', async () => {
    const integrationId = generateUniqueId();
    console.log(`⚡ Testing performance integration: ${integrationId}`);

    const startTime = Date.now();
    const concurrentOperations = 10;
    
    // Create multiple packages concurrently
    const createPromises = Array.from({ length: concurrentOperations }, (_, index) => 
      supabase
        .from('packages')
        .insert([{
          tracking_number: `${integrationId}-CONCURRENT-${index.toString().padStart(3, '0')}`,
          carrier: ['UPS', 'FedEx', 'USPS'][index % 3],
          customer_name: `Concurrent Customer ${index}`,
          customer_email: `concurrent-${index}-${Date.now()}@test.com`,
          status: 'received'
        }])
        .select()
    );

    const results = await Promise.all(createPromises);
    const createTime = Date.now() - startTime;

    // Verify all operations succeeded
    results.forEach((result, index) => {
      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
      testDataIds.push(result.data[0].id);
    });

    console.log(`📦 Created ${concurrentOperations} packages concurrently in ${createTime}ms`);

    // Test concurrent reads
    const readStartTime = Date.now();
    const readPromises = Array.from({ length: concurrentOperations }, () =>
      supabase
        .from('packages')
        .select('*')
        .ilike('tracking_number', `%${integrationId}-CONCURRENT%`)
    );

    const readResults = await Promise.all(readPromises);
    const readTime = Date.now() - readStartTime;

    // Verify all reads succeeded and returned consistent data
    readResults.forEach(result => {
      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(concurrentOperations);
    });

    console.log(`📖 Performed ${concurrentOperations} concurrent reads in ${readTime}ms`);

    // Performance assertions
    expect(createTime).toBeLessThan(5000); // Should complete within 5 seconds
    expect(readTime).toBeLessThan(3000); // Reads should be faster
    
    console.log(`✅ Performance integration completed - Create: ${createTime}ms, Read: ${readTime}ms`);
  });
});
