-- Add customer role to the existing role system
-- Update role constraints to include customer
ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS user_roles_role_check;

ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_role_check 
CHECK (role IN ('owner', 'manager', 'staff', 'customer'));

-- Update staff_members role constraint
ALTER TABLE public.staff_members 
DROP CONSTRAINT IF EXISTS staff_members_status_check;

ALTER TABLE public.staff_members 
ADD CONSTRAINT staff_members_status_check 
CHECK (status IN ('active', 'inactive', 'suspended'));

-- Update profiles table with requested fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'es')),
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update the handle_new_user function to support all roles and full_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  -- Create profile with full_name
  INSERT INTO public.profiles (
    user_id, 
    first_name, 
    last_name, 
    full_name,
    preferred_language
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    CONCAT(
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''), 
      ' ', 
      COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    ),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  );
  
  -- Grant role based on email domain or default to customer
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id, 
    CASE 
      WHEN NEW.email LIKE '%@prmcms.com' THEN 'staff'
      WHEN NEW.email LIKE '%admin%' THEN 'manager' 
      ELSE 'customer'
    END
  );
  
  RETURN NEW;
END;
$$;

-- Create function to get user profile with role
CREATE OR REPLACE FUNCTION public.get_user_profile(_user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  id UUID,
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  role TEXT,
  preferred_language TEXT,
  phone TEXT,
  avatar_url TEXT,
  email TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.first_name,
    p.last_name,
    p.full_name,
    ur.role,
    p.preferred_language,
    p.phone,
    p.avatar_url,
    au.email
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
  LEFT JOIN auth.users au ON p.user_id = au.id
  WHERE p.user_id = _user_id;
$$;