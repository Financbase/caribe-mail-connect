-- Test Users Migration
-- Created: 2025-07-26
-- Purpose: Add test user accounts for development and testing

-- Insert test user into auth.users (this would normally be done through Supabase Auth UI)
-- For testing purposes, we'll create a test user with known credentials
-- Note: In production, users should be created through the auth.signUp() function

-- Test Admin User
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  'admin@prmcms.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"], "role": "admin"}',
  '{"first_name": "Admin", "last_name": "User", "role": "admin"}',
  false,
  '',
  '',
  '',
  ''
);

-- Test Customer User
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  'customer@prmcms.com',
  crypt('customer123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"], "role": "customer"}',
  '{"first_name": "Test", "last_name": "Customer", "role": "customer"}',
  false,
  '',
  '',
  '',
  ''
);

-- Test Driver User
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  'driver@prmcms.com',
  crypt('driver123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"], "role": "driver"}',
  '{"first_name": "Test", "last_name": "Driver", "role": "driver"}',
  false,
  '',
  '',
  '',
  ''
);

-- Create user profiles for the test users
INSERT INTO public.user_profiles (
  user_id,
  first_name,
  last_name,
  role,
  email,
  phone,
  address,
  city,
  state,
  zip_code,
  country,
  created_at,
  updated_at
) VALUES 
(
  (SELECT id FROM auth.users WHERE email = 'admin@prmcms.com'),
  'Admin',
  'User',
  'admin',
  'admin@prmcms.com',
  '+1-787-555-0001',
  '123 Admin Street',
  'San Juan',
  'PR',
  '00901',
  'Puerto Rico',
  NOW(),
  NOW()
),
(
  (SELECT id FROM auth.users WHERE email = 'customer@prmcms.com'),
  'Test',
  'Customer',
  'customer',
  'customer@prmcms.com',
  '+1-787-555-0002',
  '456 Customer Ave',
  'Bayamón',
  'PR',
  '00961',
  'Puerto Rico',
  NOW(),
  NOW()
),
(
  (SELECT id FROM auth.users WHERE email = 'driver@prmcms.com'),
  'Test',
  'Driver',
  'driver',
  'driver@prmcms.com',
  '+1-787-555-0003',
  '789 Driver Blvd',
  'Caguas',
  'PR',
  '00725',
  'Puerto Rico',
  NOW(),
  NOW()
);

-- Grant appropriate permissions to test users
INSERT INTO public.user_roles (
  user_id,
  role,
  granted_by,
  created_at
) VALUES 
(
  (SELECT id FROM auth.users WHERE email = 'admin@prmcms.com'),
  'admin',
  (SELECT id FROM auth.users WHERE email = 'admin@prmcms.com'),
  NOW()
),
(
  (SELECT id FROM auth.users WHERE email = 'customer@prmcms.com'),
  'customer',
  (SELECT id FROM auth.users WHERE email = 'admin@prmcms.com'),
  NOW()
),
(
  (SELECT id FROM auth.users WHERE email = 'driver@prmcms.com'),
  'driver',
  (SELECT id FROM auth.users WHERE email = 'admin@prmcms.com'),
  NOW()
); 