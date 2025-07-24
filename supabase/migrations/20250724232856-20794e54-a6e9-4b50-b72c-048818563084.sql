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

-- Create virtual mailbox billing table for usage tracking
CREATE TABLE IF NOT EXISTS public.virtual_mailbox_billing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  virtual_mailbox_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  total_actions INTEGER NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.virtual_mailbox_billing ENABLE ROW LEVEL SECURITY;

-- Create policies for billing records
CREATE POLICY "Staff can manage virtual mailbox billing" 
ON public.virtual_mailbox_billing 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Customers can view their virtual mailbox billing" 
ON public.virtual_mailbox_billing 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM customers c 
  WHERE c.id = virtual_mailbox_billing.customer_id 
  AND c.user_id = auth.uid()
));

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

-- Create trigger for updated_at on billing records
CREATE TRIGGER update_virtual_mailbox_billing_updated_at
BEFORE UPDATE ON public.virtual_mailbox_billing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate virtual mailbox usage
CREATE OR REPLACE FUNCTION public.calculate_virtual_mailbox_usage(
  vm_id UUID,
  period_start DATE,
  period_end DATE
)
RETURNS TABLE(
  total_actions INTEGER,
  total_amount NUMERIC,
  action_breakdown JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(ma.id)::INTEGER as total_actions,
    COALESCE(SUM(ma.cost_amount), 0) as total_amount,
    jsonb_agg(
      jsonb_build_object(
        'action_type', ma.action_type,
        'count', COUNT(*),
        'total_cost', COALESCE(SUM(ma.cost_amount), 0)
      )
    ) as action_breakdown
  FROM mail_actions ma
  JOIN mail_pieces mp ON ma.mail_piece_id = mp.id
  WHERE mp.virtual_mailbox_id = vm_id
  AND ma.created_at >= period_start::timestamp
  AND ma.created_at <= (period_end + interval '1 day')::timestamp
  GROUP BY ma.action_type;
END;
$$;