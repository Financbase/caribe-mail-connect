-- Fix the foreign key reference and create security tables

-- Access control lists (fixed foreign key)
CREATE TABLE public.access_control_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  role_name TEXT, -- Changed from role to role_name to avoid FK conflict
  permissions JSONB NOT NULL DEFAULT '{}',
  granted_by UUID NOT NULL REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS on ACL table
ALTER TABLE public.access_control_lists ENABLE ROW LEVEL SECURITY;

-- RLS Policy for ACLs
CREATE POLICY "Staff can manage ACLs" ON public.access_control_lists
FOR ALL USING (auth.uid() IS NOT NULL);