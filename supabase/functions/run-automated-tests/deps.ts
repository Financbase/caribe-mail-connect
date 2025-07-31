// TypeScript type definitions for Deno standard library
/// <reference path="./types/deno.d.ts" />

// Import Deno standard library HTTP server with direct URL
// Using a version known to work well with Supabase Edge Functions
import { serve as stdServe } from "https://deno.land/std@0.177.0/http/server.ts";
// Import types for Deno standard library
type ServeOptions = { port: number };

// Import Supabase client with types
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Re-export types for easier imports in other files
export type { SupabaseClient } from "@supabase/supabase-js";

// CORS headers are defined in index.ts to avoid circular dependencies

// Define JSON type to match Supabase's expectations
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Define the database schema type
export interface Database {
  public: {
    Tables: {
      automated_test_runs: {
        Row: {
          id: string;
          created_at: string;
          started_at: string;
          completed_at: string | null;
          status: 'running' | 'passed' | 'failed' | 'error';
          test_count: number;
          passed_count: number;
          failed_count: number;
          skipped_count: number;
          duration_seconds: number;
          test_type: string;
          location_id: string;
          error: string | null;
          results: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          started_at: string;
          completed_at?: string | null;
          status: 'running' | 'passed' | 'failed' | 'error';
          test_count: number;
          passed_count: number;
          failed_count: number;
          skipped_count: number;
          duration_seconds: number;
          test_type: string;
          location_id: string;
          error?: string | null;
          results?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          started_at?: string;
          completed_at?: string | null;
          status?: 'running' | 'passed' | 'failed' | 'error';
          test_count?: number;
          passed_count?: number;
          failed_count?: number;
          skipped_count?: number;
          duration_seconds?: number;
          test_type?: string;
          location_id?: string;
          error?: string | null;
          results?: Json | null;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          // Add other location fields as needed
        };
      };
    };
  };
}

export type SupabaseClientType = SupabaseClient<Database>;

// Create a Supabase client with the service role key for admin operations
export function createServiceRoleClient(): SupabaseClientType {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Create a Supabase client with the anon key for regular operations
export function createClient(authToken?: string): SupabaseClientType {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  
  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_ANON_KEY must be set');
  }

  const options = {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: authToken ? {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    } : undefined,
  };

  return createSupabaseClient<Database>(supabaseUrl, anonKey, options);
}

// Error handling utility
export function handleError(error: unknown): { status: number; message: string } {
  // Using console.error directly as it's available in Deno
  if (typeof console !== 'undefined' && console.error) {
    console.error('Error:', error);
  }
  
  if (error instanceof Error) {
    return { status: 500, message: error.message };
  }
  
  // Handle case where error is a string
  if (typeof error === 'string') {
    return { status: 500, message: error };
  }
  
  // Handle case where error is an object with a message property
  if (error && typeof error === 'object' && 'message' in error) {
    return { status: 500, message: String((error as { message: unknown }).message) };
  }
  
  return { status: 500, message: 'An unknown error occurred' };
}

// Export serve with proper typing
export const serve = (
  handler: (req: Request) => Promise<Response> | Response, 
  options: ServeOptions
): void => {
  stdServe(handler, options);
};
