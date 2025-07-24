-- Update customers table to properly link to auth users
ALTER TABLE public.customers 
ADD CONSTRAINT customers_user_id_unique UNIQUE (user_id);

-- Create notification preferences table
CREATE TABLE public.customer_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_enabled BOOLEAN NOT NULL DEFAULT false,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT false,
  package_arrival BOOLEAN NOT NULL DEFAULT true,
  package_ready BOOLEAN NOT NULL DEFAULT true,
  package_delivered BOOLEAN NOT NULL DEFAULT false,
  mail_hold_expiry BOOLEAN NOT NULL DEFAULT true,
  account_updates BOOLEAN NOT NULL DEFAULT true,
  preferred_time TEXT DEFAULT 'morning',
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(customer_id)
);

-- Create appointments table
CREATE TABLE public.customer_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create mail hold requests table
CREATE TABLE public.mail_hold_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  forward_address TEXT,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create customer documents table
CREATE TABLE public.customer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_size_bytes INTEGER,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.customer_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mail_hold_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for customer notification preferences
CREATE POLICY "Customers can view their own notification preferences"
ON public.customer_notification_preferences FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.customers 
    WHERE customers.id = customer_notification_preferences.customer_id 
    AND customers.user_id = auth.uid()
  )
);

CREATE POLICY "Customers can update their own notification preferences"
ON public.customer_notification_preferences FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.customers 
    WHERE customers.id = customer_notification_preferences.customer_id 
    AND customers.user_id = auth.uid()
  )
);

CREATE POLICY "Customers can insert their own notification preferences"
ON public.customer_notification_preferences FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.customers 
    WHERE customers.id = customer_notification_preferences.customer_id 
    AND customers.user_id = auth.uid()
  )
);

-- RLS policies for appointments
CREATE POLICY "Customers can manage their own appointments"
ON public.customer_appointments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.customers 
    WHERE customers.id = customer_appointments.customer_id 
    AND customers.user_id = auth.uid()
  )
);

CREATE POLICY "Staff can view all appointments"
ON public.customer_appointments FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS policies for mail hold requests
CREATE POLICY "Customers can manage their own mail hold requests"
ON public.mail_hold_requests FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.customers 
    WHERE customers.id = mail_hold_requests.customer_id 
    AND customers.user_id = auth.uid()
  )
);

CREATE POLICY "Staff can view all mail hold requests"
ON public.mail_hold_requests FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS policies for customer documents
CREATE POLICY "Customers can view their own documents"
ON public.customer_documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.customers 
    WHERE customers.id = customer_documents.customer_id 
    AND customers.user_id = auth.uid()
  )
);

CREATE POLICY "Staff can manage all customer documents"
ON public.customer_documents FOR ALL
USING (auth.uid() IS NOT NULL);

-- Update triggers for timestamp columns
CREATE TRIGGER update_customer_notification_preferences_updated_at
  BEFORE UPDATE ON public.customer_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_appointments_updated_at
  BEFORE UPDATE ON public.customer_appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mail_hold_requests_updated_at
  BEFORE UPDATE ON public.mail_hold_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_documents_updated_at
  BEFORE UPDATE ON public.customer_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample customer documents
INSERT INTO public.customer_documents (customer_id, document_type, title, description, status)
SELECT 
  c.id,
  'ps_form_1583',
  'PS Form 1583',
  'Formulario de autorización de buzón privado',
  'available'
FROM public.customers c
LIMIT 1;