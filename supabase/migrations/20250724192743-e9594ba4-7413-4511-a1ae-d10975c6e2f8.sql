-- Add Act 60 fields to customers table
ALTER TABLE public.customers 
ADD COLUMN act_60_status boolean DEFAULT false,
ADD COLUMN act_60_decree_number text,
ADD COLUMN act_60_expiration_date date,
ADD COLUMN vip_handling_preferences jsonb DEFAULT '{}',
ADD COLUMN priority_notification boolean DEFAULT false,
ADD COLUMN express_handling boolean DEFAULT false,
ADD COLUMN dedicated_support_contact text,
ADD COLUMN special_pricing_tier text;

-- Create Act 60 compliance tracking table
CREATE TABLE public.act_60_compliance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_url text,
  upload_date timestamp with time zone DEFAULT now(),
  expiration_date date,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'expired', 'rejected')),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

-- Create virtual mailbox table
CREATE TABLE public.virtual_mailbox (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  mail_item_id text NOT NULL,
  sender_name text,
  sender_address text,
  received_date timestamp with time zone DEFAULT now(),
  mail_type text NOT NULL CHECK (mail_type IN ('letter', 'package', 'catalog', 'postcard', 'legal')),
  scan_requested boolean DEFAULT false,
  scan_url text,
  action_taken text CHECK (action_taken IN ('hold', 'forward', 'shred', 'scan_only')),
  action_date timestamp with time zone,
  forwarding_address text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.act_60_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_mailbox ENABLE ROW LEVEL SECURITY;

-- RLS Policies for act_60_compliance
CREATE POLICY "Staff can view Act 60 compliance" ON public.act_60_compliance
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create Act 60 compliance" ON public.act_60_compliance
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update Act 60 compliance" ON public.act_60_compliance
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for virtual_mailbox
CREATE POLICY "Staff can view virtual mailbox" ON public.virtual_mailbox
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create virtual mailbox" ON public.virtual_mailbox
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update virtual mailbox" ON public.virtual_mailbox
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at
CREATE TRIGGER update_act_60_compliance_updated_at
  BEFORE UPDATE ON public.act_60_compliance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_virtual_mailbox_updated_at
  BEFORE UPDATE ON public.virtual_mailbox
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample Act 60 data
UPDATE public.customers 
SET 
  act_60_status = true,
  act_60_decree_number = 'ACT60-2024-001',
  act_60_expiration_date = '2026-12-31',
  priority_notification = true,
  express_handling = true,
  special_pricing_tier = 'premium'
WHERE first_name = 'María' AND last_name = 'González';

UPDATE public.customers 
SET 
  act_60_status = true,
  act_60_decree_number = 'ACT60-2024-007',
  act_60_expiration_date = '2027-06-30',
  priority_notification = true,
  express_handling = true,
  special_pricing_tier = 'premium'
WHERE first_name = 'James' AND last_name = 'Rodriguez';