-- Create customers table first
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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Staff can view all customers" 
ON public.customers 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update customers" 
ON public.customers 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can delete customers" 
ON public.customers 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Now add the foreign key constraints
ALTER TABLE public.ps_form_1583 
  ADD CONSTRAINT fk_ps_form_customer 
  FOREIGN KEY (customer_id) 
  REFERENCES public.customers(id) 
  ON DELETE CASCADE;

ALTER TABLE public.id_verifications 
  ADD CONSTRAINT fk_id_verification_customer 
  FOREIGN KEY (customer_id) 
  REFERENCES public.customers(id) 
  ON DELETE CASCADE;

ALTER TABLE public.customer_compliance 
  ADD CONSTRAINT fk_compliance_customer 
  FOREIGN KEY (customer_id) 
  REFERENCES public.customers(id) 
  ON DELETE CASCADE;