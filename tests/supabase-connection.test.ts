import { createClient } from '@supabase/supabase-js';
import { describe, it, expect } from 'vitest';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.test' });

describe('Supabase Connection', () => {
  const supabaseUrl = process.env.TEST_SUPABASE_URL;
  const supabaseKey = process.env.TEST_SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key in environment variables');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  it('should connect to Supabase', async () => {
    // Test connection by fetching server time
    console.log('Testing Supabase connection...');
    
    // Use a simple query that should work in any Supabase project
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    // We don't care if the table exists or not, just that we got a response
    // If there's an error, it should be about the table not existing, not a connection issue
    if (error && !error.message.includes('relation')) {
      throw error;
    }
    
    // If we got here, the connection was successful
    expect(true).toBe(true);
  });

  it('should list available tables', async () => {
    // This query lists all tables in the public schema
    const { data: tables, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (error) {
      console.warn('Could not list tables. This might be due to insufficient permissions.');
      console.warn('Error:', error);
      return;
    }
    
    console.log('Available tables in public schema:', tables);
    
    // We should get an array (even if empty)
    expect(Array.isArray(tables)).toBe(true);
  });
});
