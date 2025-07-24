-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create customers table
CREATE TABLE public.customers (
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

-- Create customer_compliance table
CREATE TABLE public.customer_compliance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  ps_form_1583_status TEXT NOT NULL DEFAULT 'pending' CHECK (ps_form_1583_status IN ('pending', 'submitted', 'approved', 'rejected')),
  id_verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (id_verification_status IN ('pending', 'submitted', 'verified', 'rejected')),
  compliance_score INTEGER DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  next_review_due TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_compliance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Staff can view all customers" ON public.customers FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can create customers" ON public.customers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can update customers" ON public.customers FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can delete customers" ON public.customers FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view all compliance" ON public.customer_compliance FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can create compliance" ON public.customer_compliance FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can update compliance" ON public.customer_compliance FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Add triggers
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customer_compliance_updated_at BEFORE UPDATE ON public.customer_compliance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraint
ALTER TABLE public.customer_compliance ADD CONSTRAINT fk_compliance_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;

-- Now create the view for customers with pending compliance items
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