-- Create compliance-related tables for CMRA requirements

-- Compliance quarterly reports table
CREATE TABLE public.compliance_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quarter INTEGER NOT NULL CHECK (quarter >= 1 AND quarter <= 4),
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved')),
  total_customers INTEGER DEFAULT 0,
  new_customers INTEGER DEFAULT 0,
  total_mail_pieces INTEGER DEFAULT 0,
  report_data JSONB,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(quarter, year)
);

-- PS Form 1583 submissions table
CREATE TABLE public.ps_form_1583 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  form_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'approved', 'rejected')),
  verification_notes TEXT,
  verified_by TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ID verification records table
CREATE TABLE public.id_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('drivers_license', 'passport', 'state_id', 'other')),
  document_number TEXT,
  issuing_authority TEXT,
  expiration_date DATE,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'expired', 'invalid')),
  document_path TEXT, -- path to stored document image
  verified_by TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Customer compliance status table
CREATE TABLE public.customer_compliance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL UNIQUE,
  ps_form_1583_status TEXT NOT NULL DEFAULT 'not_submitted' CHECK (ps_form_1583_status IN ('not_submitted', 'pending', 'approved', 'rejected')),
  id_verification_status TEXT NOT NULL DEFAULT 'not_verified' CHECK (id_verification_status IN ('not_verified', 'pending', 'verified', 'expired')),
  compliance_score INTEGER DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ps_form_1583 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_compliance ENABLE ROW LEVEL SECURITY;

-- Create policies for staff access (assuming auth will be implemented)
CREATE POLICY "Staff can view all compliance reports" 
ON public.compliance_reports 
FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage compliance reports" 
ON public.compliance_reports 
FOR ALL 
USING (true);

CREATE POLICY "Staff can view PS Form 1583 submissions" 
ON public.ps_form_1583 
FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage PS Form 1583 submissions" 
ON public.ps_form_1583 
FOR ALL 
USING (true);

CREATE POLICY "Staff can view ID verifications" 
ON public.id_verifications 
FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage ID verifications" 
ON public.id_verifications 
FOR ALL 
USING (true);

CREATE POLICY "Staff can view customer compliance" 
ON public.customer_compliance 
FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage customer compliance" 
ON public.customer_compliance 
FOR ALL 
USING (true);

-- Create storage buckets for compliance documents
INSERT INTO storage.buckets (id, name, public) VALUES ('compliance-docs', 'compliance-docs', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('customer-ids', 'customer-ids', false);

-- Create storage policies for compliance documents
CREATE POLICY "Staff can view compliance documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'compliance-docs');

CREATE POLICY "Staff can upload compliance documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'compliance-docs');

CREATE POLICY "Staff can update compliance documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'compliance-docs');

CREATE POLICY "Staff can delete compliance documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'compliance-docs');

-- Create storage policies for customer ID documents
CREATE POLICY "Staff can view customer ID documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'customer-ids');

CREATE POLICY "Staff can upload customer ID documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'customer-ids');

CREATE POLICY "Staff can update customer ID documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'customer-ids');

CREATE POLICY "Staff can delete customer ID documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'customer-ids');

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_compliance_reports_updated_at
BEFORE UPDATE ON public.compliance_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ps_form_1583_updated_at
BEFORE UPDATE ON public.ps_form_1583
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_id_verifications_updated_at
BEFORE UPDATE ON public.id_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_compliance_updated_at
BEFORE UPDATE ON public.customer_compliance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();