/**
 * Real Database Operations Test Suite
 * Performs actual CRUD operations against Supabase staging database
 * NO MOCKS - Real database interactions only
 */

import { createClient } from '@supabase/supabase-js';
import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import crypto from 'crypto';

// Real Supabase staging configuration
const SUPABASE_URL = 'https://bunikaxkvghzudpraqjb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1bmlrYXhrdmdoenVkcHJhcWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDMyODUsImV4cCI6MjA2OTUxOTI4NX0.K4uKk_wWq0-XHWYYkXha7GJQuWi0cqLiGRH_vYOOMME';

// Create real Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test data generators for unique data
const generateUniqueTrackingNumber = () => `TEST-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
const generateUniqueEmail = () => `test-${Date.now()}-${crypto.randomBytes(4).toString('hex')}@example.com`;

describe('Real Database Operations - Packages CRUD', () => {
  let testPackageIds = [];
  let testUserIds = [];

  beforeAll(async () => {
    console.log('🔗 Connecting to real Supabase staging database...');
    
    // Verify database connection
    const { data, error } = await supabase
      .from('packages')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      throw new Error(`Database connection failed: ${error.message}`);
    }
    
    console.log('✅ Database connection established');
  });

  afterAll(async () => {
    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    
    if (testPackageIds.length > 0) {
      const { error } = await supabase
        .from('packages')
        .delete()
        .in('id', testPackageIds);
      
      if (error) {
        console.warn('⚠️ Failed to clean up test packages:', error);
      } else {
        console.log(`✅ Cleaned up ${testPackageIds.length} test packages`);
      }
    }

    if (testUserIds.length > 0) {
      const { error } = await supabase
        .from('test_users')
        .delete()
        .in('id', testUserIds);
      
      if (error) {
        console.warn('⚠️ Failed to clean up test users:', error);
      } else {
        console.log(`✅ Cleaned up ${testUserIds.length} test users`);
      }
    }
  });

  test('CREATE: Insert new package with real database operation', async () => {
    const trackingNumber = generateUniqueTrackingNumber();
    const packageData = {
      tracking_number: trackingNumber,
      carrier: 'UPS',
      customer_name: 'Real Test Customer',
      customer_email: generateUniqueEmail(),
      status: 'received',
      weight: '2.5 lbs',
      dimensions: '12x8x6 in',
      notes: 'Real database test package',
      special_handling: false
    };

    console.log(`📦 Creating package with tracking: ${trackingNumber}`);

    const { data, error } = await supabase
      .from('packages')
      .insert([packageData])
      .select();

    // Real assertions - no mocks
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data).toHaveLength(1);
    expect(data[0].tracking_number).toBe(trackingNumber);
    expect(data[0].id).toBeDefined();
    expect(data[0].created_at).toBeDefined();

    // Store for cleanup
    testPackageIds.push(data[0].id);

    console.log(`✅ Package created with ID: ${data[0].id}`);
  });

  test('READ: Fetch packages from real database', async () => {
    console.log('📖 Reading packages from database...');

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // Real assertions
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      const package1 = data[0];
      expect(package1.id).toBeDefined();
      expect(package1.tracking_number).toBeDefined();
      expect(package1.carrier).toBeDefined();
      expect(package1.customer_name).toBeDefined();
      expect(package1.status).toBeDefined();
      expect(package1.created_at).toBeDefined();
    }

    console.log(`✅ Retrieved ${data.length} packages from database`);
  });

  test('UPDATE: Modify package status in real database', async () => {
    // First create a package to update
    const trackingNumber = generateUniqueTrackingNumber();
    const { data: createData, error: createError } = await supabase
      .from('packages')
      .insert([{
        tracking_number: trackingNumber,
        carrier: 'FedEx',
        customer_name: 'Update Test Customer',
        customer_email: generateUniqueEmail(),
        status: 'received'
      }])
      .select();

    expect(createError).toBeNull();
    expect(createData).toHaveLength(1);
    
    const packageId = createData[0].id;
    testPackageIds.push(packageId);

    console.log(`📝 Updating package ${packageId} status...`);

    // Now update the status
    const { data: updateData, error: updateError } = await supabase
      .from('packages')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', packageId)
      .select();

    // Real assertions
    expect(updateError).toBeNull();
    expect(updateData).toBeDefined();
    expect(updateData).toHaveLength(1);
    expect(updateData[0].status).toBe('processing');
    expect(updateData[0].id).toBe(packageId);

    console.log(`✅ Package status updated to: ${updateData[0].status}`);
  });

  test('DELETE: Remove package from real database', async () => {
    // First create a package to delete
    const trackingNumber = generateUniqueTrackingNumber();
    const { data: createData, error: createError } = await supabase
      .from('packages')
      .insert([{
        tracking_number: trackingNumber,
        carrier: 'USPS',
        customer_name: 'Delete Test Customer',
        customer_email: generateUniqueEmail(),
        status: 'received'
      }])
      .select();

    expect(createError).toBeNull();
    expect(createData).toHaveLength(1);
    
    const packageId = createData[0].id;

    console.log(`🗑️ Deleting package ${packageId}...`);

    // Delete the package
    const { data: deleteData, error: deleteError } = await supabase
      .from('packages')
      .delete()
      .eq('id', packageId)
      .select();

    // Real assertions
    expect(deleteError).toBeNull();
    expect(deleteData).toBeDefined();
    expect(deleteData).toHaveLength(1);
    expect(deleteData[0].id).toBe(packageId);

    // Verify deletion by trying to fetch
    const { data: fetchData, error: fetchError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', packageId);

    expect(fetchError).toBeNull();
    expect(fetchData).toHaveLength(0);

    console.log(`✅ Package deleted successfully`);
  });

  test('SEARCH: Real database search operations', async () => {
    // Create test packages with specific data for searching
    const searchTerm = `SEARCH-${Date.now()}`;
    const testPackages = [
      {
        tracking_number: `${searchTerm}-001`,
        carrier: 'UPS',
        customer_name: `${searchTerm} Customer One`,
        customer_email: generateUniqueEmail(),
        status: 'received'
      },
      {
        tracking_number: `${searchTerm}-002`,
        carrier: 'FedEx',
        customer_name: `${searchTerm} Customer Two`,
        customer_email: generateUniqueEmail(),
        status: 'processing'
      }
    ];

    const { data: createData, error: createError } = await supabase
      .from('packages')
      .insert(testPackages)
      .select();

    expect(createError).toBeNull();
    expect(createData).toHaveLength(2);

    // Store for cleanup
    createData.forEach(pkg => testPackageIds.push(pkg.id));

    console.log(`🔍 Searching for packages with term: ${searchTerm}`);

    // Test search by tracking number
    const { data: searchData, error: searchError } = await supabase
      .from('packages')
      .select('*')
      .ilike('tracking_number', `%${searchTerm}%`);

    expect(searchError).toBeNull();
    expect(searchData).toHaveLength(2);
    expect(searchData.every(pkg => pkg.tracking_number.includes(searchTerm))).toBe(true);

    // Test search by customer name
    const { data: nameSearchData, error: nameSearchError } = await supabase
      .from('packages')
      .select('*')
      .ilike('customer_name', `%${searchTerm}%`);

    expect(nameSearchError).toBeNull();
    expect(nameSearchData).toHaveLength(2);
    expect(nameSearchData.every(pkg => pkg.customer_name.includes(searchTerm))).toBe(true);

    console.log(`✅ Search operations completed successfully`);
  });

  test('FILTER: Real database filtering operations', async () => {
    // Create packages with different statuses
    const filterTerm = `FILTER-${Date.now()}`;
    const testPackages = [
      {
        tracking_number: `${filterTerm}-RECEIVED`,
        carrier: 'UPS',
        customer_name: 'Filter Test Customer',
        customer_email: generateUniqueEmail(),
        status: 'received'
      },
      {
        tracking_number: `${filterTerm}-PROCESSING`,
        carrier: 'FedEx',
        customer_name: 'Filter Test Customer',
        customer_email: generateUniqueEmail(),
        status: 'processing'
      },
      {
        tracking_number: `${filterTerm}-READY`,
        carrier: 'USPS',
        customer_name: 'Filter Test Customer',
        customer_email: generateUniqueEmail(),
        status: 'ready'
      }
    ];

    const { data: createData, error: createError } = await supabase
      .from('packages')
      .insert(testPackages)
      .select();

    expect(createError).toBeNull();
    expect(createData).toHaveLength(3);

    // Store for cleanup
    createData.forEach(pkg => testPackageIds.push(pkg.id));

    console.log(`🔽 Testing filter operations...`);

    // Test filter by status
    const { data: receivedData, error: receivedError } = await supabase
      .from('packages')
      .select('*')
      .eq('status', 'received')
      .ilike('tracking_number', `%${filterTerm}%`);

    expect(receivedError).toBeNull();
    expect(receivedData).toHaveLength(1);
    expect(receivedData[0].status).toBe('received');

    // Test filter by carrier
    const { data: carrierData, error: carrierError } = await supabase
      .from('packages')
      .select('*')
      .eq('carrier', 'FedEx')
      .ilike('tracking_number', `%${filterTerm}%`);

    expect(carrierError).toBeNull();
    expect(carrierData).toHaveLength(1);
    expect(carrierData[0].carrier).toBe('FedEx');

    console.log(`✅ Filter operations completed successfully`);
  });
});
