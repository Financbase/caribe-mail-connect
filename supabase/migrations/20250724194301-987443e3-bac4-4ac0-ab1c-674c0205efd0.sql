-- Create financial management tables

-- Invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  amount_due DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'void')),
  payment_terms INTEGER DEFAULT 30, -- days
  notes TEXT,
  late_fee_applied DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Invoice items table
CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('mailbox_rental', 'package_fee', 'scanning_fee', 'notarization', 'storage_fee', 'late_fee', 'other')),
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  mailbox_id UUID REFERENCES public.mailboxes(id),
  package_id UUID REFERENCES public.packages(id),
  billing_period_start DATE,
  billing_period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  payment_number TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'ath_movil', 'bank_transfer', 'check', 'other')),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_number TEXT, -- For card transactions, ATH Móvil, etc.
  notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  stripe_payment_intent_id TEXT, -- For Stripe integration
  ath_movil_transaction_id TEXT, -- For ATH Móvil integration
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Billing runs table
CREATE TABLE public.billing_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  run_date DATE NOT NULL DEFAULT CURRENT_DATE,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  total_customers INTEGER DEFAULT 0,
  total_invoices INTEGER DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Account balances table
CREATE TABLE public.account_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  current_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  credit_limit DECIMAL(10,2) DEFAULT 0,
  last_payment_date DATE,
  last_payment_amount DECIMAL(10,2),
  auto_billing_enabled BOOLEAN DEFAULT false,
  payment_method_id TEXT, -- Stored payment method for auto-billing
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(customer_id, location_id)
);

-- Tax configurations table
CREATE TABLE public.tax_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  tax_name TEXT NOT NULL, -- e.g., "IVU", "Sales Tax"
  tax_rate DECIMAL(5,4) NOT NULL, -- e.g., 0.1150 for 11.5%
  tax_type TEXT NOT NULL CHECK (tax_type IN ('percentage', 'fixed')),
  applies_to TEXT[] DEFAULT ARRAY['mailbox_rental', 'package_fee', 'scanning_fee', 'notarization'], -- Which services
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Late fee configurations table
CREATE TABLE public.late_fee_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  fee_name TEXT NOT NULL,
  fee_type TEXT NOT NULL CHECK (fee_type IN ('percentage', 'fixed')),
  fee_amount DECIMAL(10,2) NOT NULL,
  grace_period_days INTEGER DEFAULT 0,
  applies_after_days INTEGER NOT NULL DEFAULT 30,
  max_fee_amount DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payment plans table
CREATE TABLE public.payment_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  original_amount DECIMAL(10,2) NOT NULL,
  remaining_amount DECIMAL(10,2) NOT NULL,
  monthly_payment DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  next_payment_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'defaulted')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.late_fee_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Staff can view all invoices" ON public.invoices
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage invoices" ON public.invoices
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view invoice items" ON public.invoice_items
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage invoice items" ON public.invoice_items
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view payments" ON public.payments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage payments" ON public.payments
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view billing runs" ON public.billing_runs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage billing runs" ON public.billing_runs
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view account balances" ON public.account_balances
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage account balances" ON public.account_balances
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view tax configurations" ON public.tax_configurations
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can manage tax configurations" ON public.tax_configurations
  FOR ALL USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view late fee configurations" ON public.late_fee_configurations
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can manage late fee configurations" ON public.late_fee_configurations
  FOR ALL USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view payment plans" ON public.payment_plans
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage payment plans" ON public.payment_plans
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billing_runs_updated_at
  BEFORE UPDATE ON public.billing_runs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_account_balances_updated_at
  BEFORE UPDATE ON public.account_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tax_configurations_updated_at
  BEFORE UPDATE ON public.tax_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_late_fee_configurations_updated_at
  BEFORE UPDATE ON public.late_fee_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_plans_updated_at
  BEFORE UPDATE ON public.payment_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample tax configuration for Puerto Rico (IVU)
INSERT INTO public.tax_configurations (location_id, tax_name, tax_rate, tax_type, applies_to) 
SELECT id, 'IVU (Impuesto sobre Ventas y Uso)', 0.1150, 'percentage', 
       ARRAY['mailbox_rental', 'package_fee', 'scanning_fee', 'notarization']
FROM public.locations WHERE is_primary = true;

-- Insert sample late fee configuration
INSERT INTO public.late_fee_configurations (location_id, fee_name, fee_type, fee_amount, applies_after_days)
SELECT id, 'Late Payment Fee', 'fixed', 15.00, 30
FROM public.locations WHERE is_primary = true;

-- Create invoice numbering function
CREATE OR REPLACE FUNCTION generate_invoice_number(location_code TEXT)
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  current_year TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  
  SELECT COALESCE(MAX(
    CASE 
      WHEN invoice_number ~ ('^' || location_code || '-' || current_year || '-[0-9]+$')
      THEN CAST(SPLIT_PART(invoice_number, '-', 3) AS INTEGER)
      ELSE 0
    END
  ), 0) + 1 INTO next_num
  FROM invoices
  WHERE invoice_number LIKE location_code || '-' || current_year || '-%';
  
  RETURN location_code || '-' || current_year || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;