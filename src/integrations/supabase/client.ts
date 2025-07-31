import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SUPABASE_CONFIG, USE_REAL_SUPABASE } from './config';

// Use real Supabase configuration
const supabaseUrl = USE_REAL_SUPABASE ? SUPABASE_CONFIG.url : 'https://demo.supabase.co';
const supabaseAnonKey = USE_REAL_SUPABASE ? SUPABASE_CONFIG.anonKey : 'demo_key_for_testing';

// Check if Supabase is properly configured
const isSupabaseConfigured = USE_REAL_SUPABASE || (supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables not configured. App will run in demo mode.');
  console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

// Create a single supabase client for interacting with your database
export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: typeof window !== 'undefined' ? localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : createClient<Database>('https://demo.supabase.co', 'demo_key_for_testing', {
      auth: {
        storage: typeof window !== 'undefined' ? localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
      }
    });

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => {
  return supabase !== null;
};

// Helper function to check if we're in demo mode
export const isDemoMode = () => {
  return !isSupabaseConfigured;
};

// Mock data for demo mode when Supabase is not configured
export const getMockData = () => {
  return {
    packages: [],
    customers: [],
    mailboxes: [],
    users: []
  };
};