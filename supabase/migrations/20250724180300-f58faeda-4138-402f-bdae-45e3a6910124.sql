-- Create customers table first if it doesn't exist
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mailbox_number TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'PR',
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  customer_type TEXT NOT NULL DEFAULT 'individual' CHECK (customer_type IN ('individual', 'business')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  notes TEXT,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND schemaname = 'public'
  ) THEN
    ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- View for customers with pending compliance items
CREATE VIEW public.customers_pending_compliance AS
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
WHERE cc.ps_form_1583_status != 'approved' 
   OR cc.id_verification_status != 'verified';