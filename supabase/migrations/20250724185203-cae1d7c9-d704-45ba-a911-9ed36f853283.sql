-- Fix security definer functions by adding proper search_path settings
-- This prevents SQL injection attacks through search_path manipulation

-- Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update get_current_user_role function  
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  ORDER BY 
    CASE role 
      WHEN 'admin' THEN 1 
      WHEN 'manager' THEN 2 
      WHEN 'staff' THEN 3 
    END 
  LIMIT 1
$$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Grant default staff role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'staff');
  
  RETURN NEW;
END;
$$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Fix the security definer view issue by removing the problematic view
-- and replacing it with a properly secured function instead
DROP VIEW IF EXISTS public.customers_pending_compliance;

-- Create a secure function to get customers pending compliance instead
CREATE OR REPLACE FUNCTION public.get_customers_pending_compliance()
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  ps_form_1583_status TEXT,
  id_verification_status TEXT,
  compliance_score INTEGER
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    c.id,
    c.first_name,
    c.last_name, 
    c.email,
    cc.ps_form_1583_status,
    cc.id_verification_status,
    cc.compliance_score
  FROM public.customers c
  LEFT JOIN public.customer_compliance cc ON c.id = cc.customer_id
  WHERE cc.ps_form_1583_status = 'pending' 
     OR cc.id_verification_status = 'pending'
     OR cc.compliance_score < 80;
$$;