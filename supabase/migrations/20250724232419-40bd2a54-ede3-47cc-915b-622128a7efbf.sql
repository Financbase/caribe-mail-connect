-- Create billing automation configuration table
CREATE TABLE public.virtual_mailbox_billing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.locations(id),
  auto_billing_enabled BOOLEAN NOT NULL DEFAULT false,
  billing_cycle_days INTEGER NOT NULL DEFAULT 30,
  grace_period_days INTEGER NOT NULL DEFAULT 7,
  late_fee_amount DECIMAL(10,2) NOT NULL DEFAULT 25.00,
  auto_suspend_days INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.virtual_mailbox_billing_config ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Staff can manage billing config" ON public.virtual_mailbox_billing_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'manager', 'staff')
    )
  );

-- Add cost amount to mail_actions if not exists
ALTER TABLE public.mail_actions 
ADD COLUMN IF NOT EXISTS cost_amount DECIMAL(10,2) DEFAULT 0.00;

-- Create updated_at trigger
CREATE TRIGGER update_virtual_mailbox_billing_config_updated_at
  BEFORE UPDATE ON public.virtual_mailbox_billing_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create edge function for billing automation
CREATE OR REPLACE FUNCTION public.calculate_virtual_mailbox_usage(
  p_customer_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
  total_actions INTEGER,
  total_cost DECIMAL(10,2),
  scan_actions INTEGER,
  forward_actions INTEGER,
  shred_actions INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_actions,
    COALESCE(SUM(ma.cost_amount), 0)::DECIMAL(10,2) as total_cost,
    COUNT(CASE WHEN ma.action_type = 'scan' THEN 1 END)::INTEGER as scan_actions,
    COUNT(CASE WHEN ma.action_type = 'forward' THEN 1 END)::INTEGER as forward_actions,
    COUNT(CASE WHEN ma.action_type = 'shred' THEN 1 END)::INTEGER as shred_actions
  FROM public.mail_actions ma
  JOIN public.mail_pieces mp ON ma.mail_piece_id = mp.id
  JOIN public.virtual_mailboxes vm ON mp.virtual_mailbox_id = vm.id
  WHERE vm.customer_id = p_customer_id
    AND ma.created_at >= p_start_date
    AND ma.created_at <= p_end_date;
END;
$$;