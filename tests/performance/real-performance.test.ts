import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config({ path: '.env.test' });

// Performance thresholds (in milliseconds)
const THRESHOLDS = {
  DATABASE_READ: 100,  // 100ms
  DATABASE_WRITE: 200, // 200ms
  API_RESPONSE: 500,   // 500ms
  AUTH: 1000,          // 1s
};

describe('Performance Testing', () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000';
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required environment variables');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const testTable = 'performance_test';
  let testId: string;

  beforeAll(async () => {
    // Setup test data
    const { data, error } = await supabase
      .from(testTable)
      .insert([{ name: 'Performance Test', value: 'test' }])
      .select()
      .single();
    
    if (data) testId = data.id;
  });

  afterAll(async () => {
    // Cleanup
    if (testId) {
      await supabase
        .from(testTable)
        .delete()
        .eq('id', testId);
    }
  });

  it('should meet database read performance requirements', async () => {
    const startTime = performance.now();
    
    const { error } = await supabase
      .from(testTable)
      .select('*')
      .eq('id', testId);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Database read took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(THRESHOLDS.DATABASE_READ);
    expect(error).toBeNull();
  });

  it('should meet database write performance requirements', async () => {
    const startTime = performance.now();
    
    const { error } = await supabase
      .from(testTable)
      .update({ updated_at: new Date().toISOString() })
      .eq('id', testId);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Database write took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(THRESHOLDS.DATABASE_WRITE);
    expect(error).toBeNull();
  });

  it('should meet API response time requirements', async () => {
    const startTime = performance.now();
    
    const response = await axios.get(`${apiUrl}/api/health`, {
      validateStatus: () => true,
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`API response took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(THRESHOLDS.API_RESPONSE);
    expect(response.status).toBe(200);
  });

  it('should complete authentication within threshold', async () => {
    const email = `perftest_${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    
    // Test signup performance
    const signupStart = performance.now();
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });
    const signupEnd = performance.now();
    
    // Test login performance
    const loginStart = performance.now();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    const loginEnd = performance.now();
    
    const signupDuration = signupEnd - signupStart;
    const loginDuration = loginEnd - loginStart;
    
    console.log(`Signup took: ${signupDuration.toFixed(2)}ms`);
    console.log(`Login took: ${loginDuration.toFixed(2)}ms`);
    
    expect(signupDuration).toBeLessThan(THRESHOLDS.AUTH);
    expect(loginDuration).toBeLessThan(THRESHOLDS.AUTH);
    expect(signupError).toBeNull();
    expect(loginError).toBeNull();
  });
});
