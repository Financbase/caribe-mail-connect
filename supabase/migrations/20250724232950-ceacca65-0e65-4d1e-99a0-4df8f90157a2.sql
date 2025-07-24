-- Create virtual mailbox billing configuration table
CREATE TABLE IF NOT EXISTS public.virtual_mailbox_billing_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL,
  auto_billing_enabled BOOLEAN NOT NULL DEFAULT false,
  billing_cycle_days INTEGER NOT NULL DEFAULT 30,
  grace_period_days INTEGER NOT NULL DEFAULT 7,
  late_fee_amount NUMERIC NOT NULL DEFAULT 25.00,
  auto_suspend_days INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.virtual_mailbox_billing_config ENABLE ROW LEVEL SECURITY;

-- Create policies for billing config
CREATE POLICY "Staff can manage virtual mailbox billing config" 
ON public.virtual_mailbox_billing_config 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Add cost_amount column to mail_actions if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mail_actions' 
    AND column_name = 'cost_amount'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.mail_actions 
    ADD COLUMN cost_amount NUMERIC DEFAULT 0;
  END IF;
END $$;

-- Create trigger for updated_at on billing config
CREATE TRIGGER update_virtual_mailbox_billing_config_updated_at
BEFORE UPDATE ON public.virtual_mailbox_billing_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();