/**
 * Real Testing Setup
 * Configures environment for real database operations and API calls
 * PREVENTS MOCKING - Ensures all tests use real system interactions
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Real Supabase configuration
const SUPABASE_URL = 'https://bunikaxkvghzudpraqjb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1bmlrYXhrdmdoenVkcHJhcWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDMyODUsImV4cCI6MjA2OTUxOTI4NX0.K4uKk_wWq0-XHWYYkXha7GJQuWi0cqLiGRH_vYOOMME';

// Global test state
global.testState = {
  supabase: null,
  testDataIds: [],
  testStartTime: null,
  realTestingEnabled: true
};

// Prevent mocking functions
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args.join(' ');
  if (message.includes('mock') || message.includes('fake') || message.includes('stub')) {
    throw new Error(`REAL TESTING VIOLATION: Attempted to use mocking - ${message}`);
  }
  originalConsoleWarn(...args);
};

// Override common mocking libraries to prevent their use
const preventMocking = () => {
  // Prevent jest mocking
  if (global.jest) {
    global.jest.fn = () => {
      throw new Error('REAL TESTING VIOLATION: jest.fn() is not allowed in real testing');
    };
    global.jest.mock = () => {
      throw new Error('REAL TESTING VIOLATION: jest.mock() is not allowed in real testing');
    };
    global.jest.spyOn = () => {
      throw new Error('REAL TESTING VIOLATION: jest.spyOn() is not allowed in real testing');
    };
  }

  // Prevent vitest mocking
  if (global.vi) {
    global.vi.fn = () => {
      throw new Error('REAL TESTING VIOLATION: vi.fn() is not allowed in real testing');
    };
    global.vi.mock = () => {
      throw new Error('REAL TESTING VIOLATION: vi.mock() is not allowed in real testing');
    };
    global.vi.spyOn = () => {
      throw new Error('REAL TESTING VIOLATION: vi.spyOn() is not allowed in real testing');
    };
  }

  // Prevent sinon mocking
  if (global.sinon) {
    global.sinon.stub = () => {
      throw new Error('REAL TESTING VIOLATION: sinon.stub() is not allowed in real testing');
    };
    global.sinon.mock = () => {
      throw new Error('REAL TESTING VIOLATION: sinon.mock() is not allowed in real testing');
    };
    global.sinon.spy = () => {
      throw new Error('REAL TESTING VIOLATION: sinon.spy() is not allowed in real testing');
    };
  }
};

// Global setup for all tests
beforeAll(async () => {
  console.log('🚀 REAL TESTING SETUP - NO MOCKS ALLOWED');
  console.log('=' .repeat(50));
  
  // Prevent mocking
  preventMocking();
  
  // Verify we're in real testing mode
  if (!process.env.VITEST_REAL_TESTING) {
    throw new Error('REAL TESTING VIOLATION: VITEST_REAL_TESTING environment variable not set');
  }
  
  // Initialize real Supabase client
  global.testState.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  global.testState.testStartTime = Date.now();
  
  console.log('🔗 Connecting to real Supabase database...');
  
  // Verify real database connection
  const { data, error } = await global.testState.supabase
    .from('packages')
    .select('count', { count: 'exact', head: true });
  
  if (error) {
    throw new Error(`REAL DATABASE CONNECTION FAILED: ${error.message}`);
  }
  
  console.log('✅ Real database connection established');
  console.log('📊 Database URL:', SUPABASE_URL);
  console.log('🔑 Using real API key (not mock)');
  
  // Verify tables exist
  const { data: tablesData, error: tablesError } = await global.testState.supabase
    .rpc('get_table_names');
  
  if (tablesError) {
    // Fallback check
    const { data: packagesCheck } = await global.testState.supabase
      .from('packages')
      .select('id')
      .limit(1);
    
    if (packagesCheck !== null) {
      console.log('✅ Required tables verified');
    }
  } else {
    console.log('✅ Database schema verified');
  }
  
  console.log('🎯 Real testing environment ready');
  console.log('=' .repeat(50));
});

// Global cleanup for all tests
afterAll(async () => {
  console.log('\n🧹 REAL TESTING CLEANUP');
  console.log('-' .repeat(30));
  
  const testDuration = Date.now() - global.testState.testStartTime;
  
  // Clean up any remaining test data
  if (global.testState.testDataIds.length > 0) {
    console.log(`🗑️ Cleaning up ${global.testState.testDataIds.length} test records...`);
    
    try {
      const { error } = await global.testState.supabase
        .from('packages')
        .delete()
        .in('id', global.testState.testDataIds);
      
      if (error) {
        console.warn('⚠️ Some test data cleanup failed:', error.message);
      } else {
        console.log('✅ All test data cleaned up');
      }
    } catch (error) {
      console.warn('⚠️ Cleanup error:', error.message);
    }
  }
  
  console.log(`⏱️ Total real testing duration: ${testDuration}ms`);
  console.log('✅ Real testing cleanup completed');
});

// Setup for each test
beforeEach(async () => {
  // Verify we're still in real testing mode
  if (!global.testState.realTestingEnabled) {
    throw new Error('REAL TESTING VIOLATION: Real testing was disabled during test run');
  }
  
  // Verify database connection is still active
  try {
    const { error } = await global.testState.supabase
      .from('packages')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      throw new Error(`DATABASE CONNECTION LOST: ${error.message}`);
    }
  } catch (error) {
    throw new Error(`REAL DATABASE CHECK FAILED: ${error.message}`);
  }
});

// Cleanup after each test
afterEach(async () => {
  // Note: Individual tests should clean up their own data
  // This is just a safety check
});

// Export utilities for real testing
export const getRealSupabaseClient = () => {
  if (!global.testState.supabase) {
    throw new Error('REAL TESTING ERROR: Supabase client not initialized');
  }
  return global.testState.supabase;
};

export const addTestDataId = (id) => {
  global.testState.testDataIds.push(id);
};

export const removeTestDataId = (id) => {
  global.testState.testDataIds = global.testState.testDataIds.filter(testId => testId !== id);
};

export const verifyRealTesting = () => {
  if (!global.testState.realTestingEnabled) {
    throw new Error('REAL TESTING VIOLATION: This function can only be called in real testing mode');
  }
  return true;
};

// Utility to verify no mocks are being used
export const assertNoMocks = (obj, name) => {
  if (typeof obj === 'function' && (obj.toString().includes('mock') || obj.toString().includes('stub'))) {
    throw new Error(`REAL TESTING VIOLATION: ${name} appears to be a mock function`);
  }
  return true;
};

// Export real testing configuration
export const realTestingConfig = {
  supabaseUrl: SUPABASE_URL,
  supabaseKey: SUPABASE_ANON_KEY,
  testingMode: 'REAL',
  mocksAllowed: false,
  realDatabaseRequired: true,
  realApiRequired: true
};

console.log('📋 Real Testing Setup Loaded');
console.log('❌ Mocking functions disabled');
console.log('✅ Real system interactions enabled');
