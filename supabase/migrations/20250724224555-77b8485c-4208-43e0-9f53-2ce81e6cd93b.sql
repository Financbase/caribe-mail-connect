-- Create virtual mailboxes table
CREATE TABLE public.virtual_mailboxes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  location_id UUID NOT NULL,
  service_tier TEXT NOT NULL DEFAULT 'basic',
  monthly_fee NUMERIC NOT NULL DEFAULT 25.00,
  status TEXT NOT NULL DEFAULT 'active',
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL DEFAULT 'San Juan',
  state TEXT NOT NULL DEFAULT 'PR',
  zip_code TEXT NOT NULL,
  activation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  billing_cycle_day INTEGER NOT NULL DEFAULT 1,
  forwarding_address JSONB,
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create mail pieces table
CREATE TABLE public.mail_pieces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  virtual_mailbox_id UUID NOT NULL,
  piece_number TEXT NOT NULL,
  mail_type TEXT NOT NULL DEFAULT 'letter',
  sender_name TEXT,
  sender_address TEXT,
  size_category TEXT NOT NULL DEFAULT 'standard',
  weight_grams INTEGER,
  received_date DATE NOT NULL DEFAULT CURRENT_DATE,
  photo_exterior_url TEXT,
  photo_thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  priority_level INTEGER NOT NULL DEFAULT 1,
  customer_notified_at TIMESTAMP WITH TIME ZONE,
  customer_action_deadline TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  special_handling_flags JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_by UUID
);

-- Create mail actions table
CREATE TABLE public.mail_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mail_piece_id UUID NOT NULL,
  virtual_mailbox_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  forwarding_address JSONB,
  scanning_instructions JSONB,
  action_cost NUMERIC DEFAULT 0,
  notes TEXT,
  processed_by UUID,
  tracking_number TEXT,
  scan_document_urls JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scanning queue table
CREATE TABLE public.scanning_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mail_piece_id UUID NOT NULL,
  mail_action_id UUID NOT NULL,
  queue_position INTEGER NOT NULL DEFAULT 1,
  scan_quality TEXT NOT NULL DEFAULT 'standard',
  scan_type TEXT NOT NULL DEFAULT 'both_sides',
  color_mode TEXT NOT NULL DEFAULT 'color',
  resolution_dpi INTEGER NOT NULL DEFAULT 300,
  special_instructions TEXT,
  priority_level INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'queued',
  assigned_to UUID,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create virtual mailbox billing table
CREATE TABLE public.virtual_mailbox_billing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  virtual_mailbox_id UUID NOT NULL,
  billing_month DATE NOT NULL,
  monthly_service_fee NUMERIC NOT NULL DEFAULT 25.00,
  action_fees NUMERIC NOT NULL DEFAULT 0,
  forwarding_fees NUMERIC NOT NULL DEFAULT 0,
  scanning_fees NUMERIC NOT NULL DEFAULT 0,
  storage_fees NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  invoice_id UUID,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  usage_summary JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create check deposits table for business customers
CREATE TABLE public.check_deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  virtual_mailbox_id UUID,
  check_number TEXT,
  amount NUMERIC NOT NULL,
  check_date DATE,
  bank_name TEXT,
  front_image_url TEXT NOT NULL,
  back_image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'captured',
  deposit_method TEXT NOT NULL DEFAULT 'mobile',
  processing_notes TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pricing configurations table (allow NULL location_id for global pricing)
CREATE TABLE public.virtual_mailbox_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID, -- Allow NULL for global pricing
  service_tier TEXT NOT NULL,
  monthly_base_fee NUMERIC NOT NULL DEFAULT 25.00,
  scan_fee_per_page NUMERIC NOT NULL DEFAULT 1.50,
  forward_fee_base NUMERIC NOT NULL DEFAULT 8.00,
  forward_fee_per_ounce NUMERIC NOT NULL DEFAULT 1.25,
  shred_fee NUMERIC NOT NULL DEFAULT 2.00,
  storage_fee_per_month NUMERIC NOT NULL DEFAULT 1.00,
  check_deposit_fee NUMERIC NOT NULL DEFAULT 5.00,
  rush_processing_fee NUMERIC NOT NULL DEFAULT 10.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Add indexes for performance
CREATE INDEX idx_virtual_mailboxes_customer ON virtual_mailboxes(customer_id);
CREATE INDEX idx_virtual_mailboxes_location ON virtual_mailboxes(location_id);
CREATE INDEX idx_mail_pieces_mailbox ON mail_pieces(virtual_mailbox_id);
CREATE INDEX idx_mail_pieces_status ON mail_pieces(status);
CREATE INDEX idx_mail_pieces_received_date ON mail_pieces(received_date);
CREATE INDEX idx_mail_actions_mail_piece ON mail_actions(mail_piece_id);
CREATE INDEX idx_mail_actions_status ON mail_actions(status);
CREATE INDEX idx_scanning_queue_status ON scanning_queue(status);
CREATE INDEX idx_scanning_queue_priority ON scanning_queue(priority_level);
CREATE INDEX idx_check_deposits_customer ON check_deposits(customer_id);

-- Add foreign key constraints
ALTER TABLE virtual_mailboxes ADD CONSTRAINT fk_virtual_mailboxes_customer 
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

ALTER TABLE mail_pieces ADD CONSTRAINT fk_mail_pieces_mailbox 
  FOREIGN KEY (virtual_mailbox_id) REFERENCES virtual_mailboxes(id) ON DELETE CASCADE;

ALTER TABLE mail_actions ADD CONSTRAINT fk_mail_actions_mail_piece 
  FOREIGN KEY (mail_piece_id) REFERENCES mail_pieces(id) ON DELETE CASCADE;

ALTER TABLE mail_actions ADD CONSTRAINT fk_mail_actions_mailbox 
  FOREIGN KEY (virtual_mailbox_id) REFERENCES virtual_mailboxes(id) ON DELETE CASCADE;

ALTER TABLE scanning_queue ADD CONSTRAINT fk_scanning_queue_mail_piece 
  FOREIGN KEY (mail_piece_id) REFERENCES mail_pieces(id) ON DELETE CASCADE;

ALTER TABLE scanning_queue ADD CONSTRAINT fk_scanning_queue_action 
  FOREIGN KEY (mail_action_id) REFERENCES mail_actions(id) ON DELETE CASCADE;

ALTER TABLE virtual_mailbox_billing ADD CONSTRAINT fk_vm_billing_mailbox 
  FOREIGN KEY (virtual_mailbox_id) REFERENCES virtual_mailboxes(id) ON DELETE CASCADE;

ALTER TABLE check_deposits ADD CONSTRAINT fk_check_deposits_customer 
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

ALTER TABLE check_deposits ADD CONSTRAINT fk_check_deposits_mailbox 
  FOREIGN KEY (virtual_mailbox_id) REFERENCES virtual_mailboxes(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE virtual_mailboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scanning_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_mailbox_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_mailbox_pricing ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for virtual_mailboxes
CREATE POLICY "Staff can manage virtual mailboxes" ON virtual_mailboxes
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Customers can view their virtual mailbox" ON virtual_mailboxes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers c 
      WHERE c.id = virtual_mailboxes.customer_id 
      AND c.user_id = auth.uid()
    )
  );

-- Create RLS policies for mail_pieces
CREATE POLICY "Staff can manage mail pieces" ON mail_pieces
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Customers can view their mail pieces" ON mail_pieces
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM virtual_mailboxes vm
      JOIN customers c ON c.id = vm.customer_id
      WHERE vm.id = mail_pieces.virtual_mailbox_id 
      AND c.user_id = auth.uid()
    )
  );

-- Create RLS policies for mail_actions
CREATE POLICY "Staff can manage mail actions" ON mail_actions
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Customers can manage their mail actions" ON mail_actions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM virtual_mailboxes vm
      JOIN customers c ON c.id = vm.customer_id
      WHERE vm.id = mail_actions.virtual_mailbox_id 
      AND c.user_id = auth.uid()
    )
  );

-- Create RLS policies for scanning_queue
CREATE POLICY "Staff can manage scanning queue" ON scanning_queue
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for virtual_mailbox_billing
CREATE POLICY "Staff can manage VM billing" ON virtual_mailbox_billing
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Customers can view their VM billing" ON virtual_mailbox_billing
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM virtual_mailboxes vm
      JOIN customers c ON c.id = vm.customer_id
      WHERE vm.id = virtual_mailbox_billing.virtual_mailbox_id 
      AND c.user_id = auth.uid()
    )
  );

-- Create RLS policies for check_deposits
CREATE POLICY "Staff can manage check deposits" ON check_deposits
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Customers can view their check deposits" ON check_deposits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers c 
      WHERE c.id = check_deposits.customer_id 
      AND c.user_id = auth.uid()
    )
  );

-- Create RLS policies for pricing
CREATE POLICY "Staff can manage VM pricing" ON virtual_mailbox_pricing
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view VM pricing" ON virtual_mailbox_pricing
  FOR SELECT USING (is_active = true);

-- Create triggers for updated_at
CREATE TRIGGER update_virtual_mailboxes_updated_at
  BEFORE UPDATE ON virtual_mailboxes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mail_pieces_updated_at
  BEFORE UPDATE ON mail_pieces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_check_deposits_updated_at
  BEFORE UPDATE ON check_deposits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create functions for automatic piece numbering
CREATE OR REPLACE FUNCTION generate_mail_piece_number(vm_id UUID)
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  current_date_str TEXT;
BEGIN
  current_date_str := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  SELECT COALESCE(MAX(
    CASE 
      WHEN piece_number ~ ('^MP-' || current_date_str || '-[0-9]+$')
      THEN CAST(SPLIT_PART(piece_number, '-', 3) AS INTEGER)
      ELSE 0
    END
  ), 0) + 1 INTO next_num
  FROM mail_pieces
  WHERE virtual_mailbox_id = vm_id
  AND piece_number LIKE 'MP-' || current_date_str || '-%';
  
  RETURN 'MP-' || current_date_str || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Insert default pricing tiers with NULL location_id for global pricing
INSERT INTO virtual_mailbox_pricing (
  location_id, 
  service_tier, 
  monthly_base_fee,
  scan_fee_per_page,
  forward_fee_base,
  forward_fee_per_ounce,
  shred_fee,
  storage_fee_per_month,
  check_deposit_fee,
  rush_processing_fee
) VALUES 
  (NULL, 'basic', 25.00, 1.50, 8.00, 1.25, 2.00, 1.00, 5.00, 10.00),
  (NULL, 'premium', 45.00, 1.00, 6.00, 1.00, 1.50, 0.50, 3.00, 5.00),
  (NULL, 'business', 75.00, 0.75, 5.00, 0.75, 1.00, 0.25, 2.00, 0.00);