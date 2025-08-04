import { createClient } from '@supabase/supabase-js';
import { describe, it, expect } from 'vitest';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.test' });

describe('Supabase Connection Test', () => {
  const supabaseUrl = process.env.TEST_SUPABASE_URL;
  const supabaseKey = process.env.TEST_SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key in environment variables');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  it('should connect to Supabase', async () => {
    // Test connection by fetching a list of tables
    console.log('Testing Supabase connection...');
    
    // Use a simple query that should work in most Supabase projects
    const { data, error } = await supabase
      .from('pg_tables')
      .select('*')
      .limit(5);
    
    // Check if we got a response (even if it's an error)
    console.log('Supabase response:', { data, error });
    
    // If we got here, the connection was successful
    // We don't check the data since table structures vary
    expect(error).toBeNull();
  });

  it('should list available tables', async () => {
    // This is a more direct way to get table information
    const { data: tables, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    console.log('Available tables:', tables);
    
    // We should get an array (even if empty) or an error
    expect(error).toBeNull();
    expect(Array.isArray(tables)).toBe(true);
    
    if (tables && tables.length > 0) {
      console.log('First table:', tables[0]);
    }
  });
});
