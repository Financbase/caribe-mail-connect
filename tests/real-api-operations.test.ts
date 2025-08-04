import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config({ path: '.env.test' });

describe('Real API Operations', () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000';
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required environment variables');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Sign in with test credentials
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    
    // Create test user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (signUpError && !signUpError.message.includes('already registered')) {
      throw signUpError;
    }
    
    // Sign in to get auth token
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError) throw signInError;
    
    authToken = signInData.session?.access_token || '';
    testUserId = signInData.user?.id || '';
    
    if (!authToken || !testUserId) {
      throw new Error('Failed to authenticate test user');
    }
  });

  it('should authenticate and access protected API endpoints', async () => {
    // Test protected endpoint with auth
    const response = await axios.get(`${apiUrl}/api/protected-route`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      validateStatus: () => true, // Don't throw on non-200 status
    });

    expect([200, 404]).toContain(response.status);
    
    if (response.status === 200) {
      expect(response.data).toBeDefined();
    }
  });

  it('should handle API errors properly', async () => {
    // Test with invalid token
    const response = await axios.get(`${apiUrl}/api/protected-route`, {
      headers: {
        Authorization: 'Bearer invalid-token',
      },
      validateStatus: () => true,
    });

    expect([401, 403]).toContain(response.status);
  });

  // Add more API tests as needed
});
