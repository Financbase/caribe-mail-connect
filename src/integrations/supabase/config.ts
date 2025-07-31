// Supabase Configuration for PRMCMS
export const SUPABASE_CONFIG = {
  url: 'https://flbwqsocnlvsuqgupbra.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsYndxc29jbmx2c3VxZ3VwYnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzY2NzcsImV4cCI6MjA2ODk1MjY3N30.nhWOR862I7FsZ7oOxNnN5-Mp2C9gdhp2TXl84YEPwtw'
};

// Check if we should use real Supabase or demo mode
export const USE_REAL_SUPABASE = true; // Set to true to use real database

// Environment configuration
export const ENV_CONFIG = {
  appEnv: 'development',
  appVersion: '1.0.0',
  enableGoogleMaps: true,
  enableRealTimeTracking: true
}; 