-- Create mailboxes table
CREATE TABLE public.mailboxes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  size TEXT NOT NULL CHECK (size IN ('small', 'medium', 'large', 'virtual')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
  monthly_rate DECIMAL(10,2) NOT NULL,
  annual_rate DECIMAL(10,2) NOT NULL,
  current_customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  rental_start_date DATE,
  rental_end_date DATE,
  next_payment_due DATE,
  payment_status TEXT DEFAULT 'current' CHECK (payment_status IN ('current', 'due', 'overdue', 'suspended')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create mailbox_rental_history table
CREATE TABLE public.mailbox_rental_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mailbox_id UUID NOT NULL REFERENCES public.mailboxes(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_rate DECIMAL(10,2) NOT NULL,
  annual_rate DECIMAL(10,2) NOT NULL,
  payment_frequency TEXT NOT NULL CHECK (payment_frequency IN ('monthly', 'annual')),
  termination_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Create mailbox_payments table
CREATE TABLE public.mailbox_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mailbox_id UUID NOT NULL REFERENCES public.mailboxes(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  payment_method TEXT,
  reference_number TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable Row Level Security
ALTER TABLE public.mailboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailbox_rental_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailbox_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for mailboxes
CREATE POLICY "Staff can view all mailboxes" ON public.mailboxes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create mailboxes" ON public.mailboxes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update mailboxes" ON public.mailboxes
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can delete mailboxes" ON public.mailboxes
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create policies for rental history
CREATE POLICY "Staff can view rental history" ON public.mailbox_rental_history
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create rental history" ON public.mailbox_rental_history
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create policies for payments
CREATE POLICY "Staff can view payments" ON public.mailbox_payments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create payments" ON public.mailbox_payments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update payments" ON public.mailbox_payments
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create trigger for updated_at on mailboxes
CREATE TRIGGER update_mailboxes_updated_at
  BEFORE UPDATE ON public.mailboxes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample mailboxes
INSERT INTO public.mailboxes (number, size, monthly_rate, annual_rate) VALUES
  ('001', 'small', 25.00, 270.00),
  ('002', 'small', 25.00, 270.00),
  ('003', 'medium', 35.00, 378.00),
  ('004', 'medium', 35.00, 378.00),
  ('005', 'large', 50.00, 540.00),
  ('006', 'large', 50.00, 540.00),
  ('007', 'virtual', 15.00, 162.00),
  ('008', 'virtual', 15.00, 162.00),
  ('009', 'small', 25.00, 270.00),
  ('010', 'small', 25.00, 270.00),
  ('011', 'medium', 35.00, 378.00),
  ('012', 'medium', 35.00, 378.00),
  ('013', 'large', 50.00, 540.00),
  ('014', 'large', 50.00, 540.00),
  ('015', 'small', 25.00, 270.00),
  ('016', 'small', 25.00, 270.00),
  ('017', 'medium', 35.00, 378.00),
  ('018', 'medium', 35.00, 378.00),
  ('019', 'large', 50.00, 540.00),
  ('020', 'large', 50.00, 540.00);