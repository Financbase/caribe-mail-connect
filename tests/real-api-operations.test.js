/**
 * Real API Operations Test Suite
 * Makes actual HTTP requests to running services
 * NO MOCKS - Real API interactions only
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import fetch from 'node-fetch';
import crypto from 'crypto';

// Real Supabase REST API configuration
const SUPABASE_URL = 'https://bunikaxkvghzudpraqjb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1bmlrYXhrdmdoenVkcHJhcWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDMyODUsImV4cCI6MjA2OTUxOTI4NX0.K4uKk_wWq0-XHWYYkXha7GJQuWi0cqLiGRH_vYOOMME';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1`;

// Real application server URL (when running)
const APP_SERVER_URL = 'http://localhost:5173';

// Helper function for real API requests
async function makeApiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...options.headers
  };

  console.log(`🌐 Making real API request: ${options.method || 'GET'} ${url}`);

  const response = await fetch(url, {
    ...options,
    headers
  });

  const responseData = await response.text();
  let parsedData;
  
  try {
    parsedData = responseData ? JSON.parse(responseData) : null;
  } catch (e) {
    parsedData = responseData;
  }

  return {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    data: parsedData,
    ok: response.ok
  };
}

// Test data generators
const generateUniqueTrackingNumber = () => `API-TEST-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
const generateUniqueEmail = () => `api-test-${Date.now()}-${crypto.randomBytes(4).toString('hex')}@example.com`;

describe('Real API Operations - Supabase REST API', () => {
  let testPackageIds = [];

  beforeAll(async () => {
    console.log('🔗 Testing connection to real Supabase REST API...');
    
    // Test API connectivity
    const response = await makeApiRequest('/packages?select=count', {
      method: 'GET',
      headers: { 'Prefer': 'count=exact' }
    });
    
    if (!response.ok) {
      throw new Error(`API connection failed: ${response.status} ${response.statusText}`);
    }
    
    console.log('✅ Real API connection established');
  });

  afterAll(async () => {
    // Clean up test data via real API calls
    console.log('🧹 Cleaning up test data via API...');
    
    for (const packageId of testPackageIds) {
      try {
        await makeApiRequest(`/packages?id=eq.${packageId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.warn(`⚠️ Failed to clean up package ${packageId}:`, error.message);
      }
    }
    
    console.log(`✅ Cleaned up ${testPackageIds.length} test packages via API`);
  });

  test('POST: Create package via real REST API', async () => {
    const trackingNumber = generateUniqueTrackingNumber();
    const packageData = {
      tracking_number: trackingNumber,
      carrier: 'UPS',
      customer_name: 'Real API Test Customer',
      customer_email: generateUniqueEmail(),
      status: 'received',
      weight: '3.2 lbs',
      dimensions: '14x10x8 in',
      notes: 'Created via real REST API test',
      special_handling: true
    };

    console.log(`📦 Creating package via API: ${trackingNumber}`);

    const response = await makeApiRequest('/packages', {
      method: 'POST',
      body: JSON.stringify(packageData)
    });

    // Real API assertions
    expect(response.ok).toBe(true);
    expect(response.status).toBe(201);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data).toHaveLength(1);
    
    const createdPackage = response.data[0];
    expect(createdPackage.id).toBeDefined();
    expect(createdPackage.tracking_number).toBe(trackingNumber);
    expect(createdPackage.carrier).toBe('UPS');
    expect(createdPackage.customer_name).toBe('Real API Test Customer');
    expect(createdPackage.status).toBe('received');
    expect(createdPackage.special_handling).toBe(true);
    expect(createdPackage.created_at).toBeDefined();

    // Store for cleanup
    testPackageIds.push(createdPackage.id);

    console.log(`✅ Package created via API with ID: ${createdPackage.id}`);
  });

  test('GET: Fetch packages via real REST API', async () => {
    console.log('📖 Fetching packages via API...');

    const response = await makeApiRequest('/packages?order=created_at.desc&limit=10');

    // Real API assertions
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);

    if (response.data.length > 0) {
      const package1 = response.data[0];
      expect(package1.id).toBeDefined();
      expect(package1.tracking_number).toBeDefined();
      expect(package1.carrier).toBeDefined();
      expect(package1.customer_name).toBeDefined();
      expect(package1.status).toBeDefined();
      expect(package1.created_at).toBeDefined();
    }

    console.log(`✅ Retrieved ${response.data.length} packages via API`);
  });

  test('PATCH: Update package via real REST API', async () => {
    // First create a package to update
    const trackingNumber = generateUniqueTrackingNumber();
    const createResponse = await makeApiRequest('/packages', {
      method: 'POST',
      body: JSON.stringify({
        tracking_number: trackingNumber,
        carrier: 'FedEx',
        customer_name: 'API Update Test Customer',
        customer_email: generateUniqueEmail(),
        status: 'received'
      })
    });

    expect(createResponse.ok).toBe(true);
    const packageId = createResponse.data[0].id;
    testPackageIds.push(packageId);

    console.log(`📝 Updating package ${packageId} via API...`);

    // Update the package
    const updateResponse = await makeApiRequest(`/packages?id=eq.${packageId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'processing',
        notes: 'Updated via real REST API test',
        updated_at: new Date().toISOString()
      })
    });

    // Real API assertions
    expect(updateResponse.ok).toBe(true);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data).toBeDefined();
    expect(Array.isArray(updateResponse.data)).toBe(true);
    expect(updateResponse.data).toHaveLength(1);
    
    const updatedPackage = updateResponse.data[0];
    expect(updatedPackage.id).toBe(packageId);
    expect(updatedPackage.status).toBe('processing');
    expect(updatedPackage.notes).toBe('Updated via real REST API test');

    console.log(`✅ Package updated via API: ${updatedPackage.status}`);
  });

  test('DELETE: Remove package via real REST API', async () => {
    // First create a package to delete
    const trackingNumber = generateUniqueTrackingNumber();
    const createResponse = await makeApiRequest('/packages', {
      method: 'POST',
      body: JSON.stringify({
        tracking_number: trackingNumber,
        carrier: 'USPS',
        customer_name: 'API Delete Test Customer',
        customer_email: generateUniqueEmail(),
        status: 'received'
      })
    });

    expect(createResponse.ok).toBe(true);
    const packageId = createResponse.data[0].id;

    console.log(`🗑️ Deleting package ${packageId} via API...`);

    // Delete the package
    const deleteResponse = await makeApiRequest(`/packages?id=eq.${packageId}`, {
      method: 'DELETE'
    });

    // Real API assertions
    expect(deleteResponse.ok).toBe(true);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.data).toBeDefined();
    expect(Array.isArray(deleteResponse.data)).toBe(true);
    expect(deleteResponse.data).toHaveLength(1);
    expect(deleteResponse.data[0].id).toBe(packageId);

    // Verify deletion by trying to fetch
    const fetchResponse = await makeApiRequest(`/packages?id=eq.${packageId}`);
    expect(fetchResponse.ok).toBe(true);
    expect(fetchResponse.data).toHaveLength(0);

    console.log(`✅ Package deleted via API successfully`);
  });

  test('GET: Search packages via real REST API with filters', async () => {
    // Create test packages for searching
    const searchTerm = `API-SEARCH-${Date.now()}`;
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

    // Create packages via API
    for (const packageData of testPackages) {
      const response = await makeApiRequest('/packages', {
        method: 'POST',
        body: JSON.stringify(packageData)
      });
      expect(response.ok).toBe(true);
      testPackageIds.push(response.data[0].id);
    }

    console.log(`🔍 Searching packages via API with term: ${searchTerm}`);

    // Test search by tracking number using real API filters
    const searchResponse = await makeApiRequest(`/packages?tracking_number=ilike.*${searchTerm}*`);
    
    expect(searchResponse.ok).toBe(true);
    expect(searchResponse.data).toHaveLength(2);
    expect(searchResponse.data.every(pkg => pkg.tracking_number.includes(searchTerm))).toBe(true);

    // Test filter by status
    const statusFilterResponse = await makeApiRequest(`/packages?status=eq.received&tracking_number=ilike.*${searchTerm}*`);
    
    expect(statusFilterResponse.ok).toBe(true);
    expect(statusFilterResponse.data).toHaveLength(1);
    expect(statusFilterResponse.data[0].status).toBe('received');

    console.log(`✅ API search and filter operations completed successfully`);
  });

  test('GET: Test API response headers and metadata', async () => {
    console.log('📋 Testing API response headers and metadata...');

    const response = await makeApiRequest('/packages?select=count', {
      headers: { 'Prefer': 'count=exact' }
    });

    // Real API assertions for headers and metadata
    expect(response.ok).toBe(true);
    expect(response.headers).toBeDefined();
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.headers['content-range']).toBeDefined();
    
    // Verify CORS headers for web app compatibility
    expect(response.headers['access-control-allow-origin']).toBeDefined();

    console.log(`✅ API headers and metadata validated`);
    console.log(`📊 Content-Range: ${response.headers['content-range']}`);
  });
});
