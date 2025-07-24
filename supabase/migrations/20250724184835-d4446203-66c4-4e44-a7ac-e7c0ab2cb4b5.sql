-- Create packages table for secure package storage
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT NOT NULL UNIQUE,
  carrier TEXT NOT NULL CHECK (carrier IN ('UPS', 'FedEx', 'USPS', 'DHL', 'Other')),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('Small', 'Medium', 'Large')),
  status TEXT NOT NULL DEFAULT 'Received' CHECK (status IN ('Received', 'Ready', 'Delivered', 'Pending')),
  special_handling BOOLEAN NOT NULL DEFAULT false,
  weight TEXT,
  dimensions TEXT,
  requires_signature BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  received_by UUID REFERENCES auth.users(id),
  delivered_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for security
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Create policies for packages
CREATE POLICY "Staff can view all packages" 
ON public.packages 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create packages" 
ON public.packages 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update packages" 
ON public.packages 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can delete packages" 
ON public.packages 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_packages_customer_id ON public.packages(customer_id);
CREATE INDEX idx_packages_tracking_number ON public.packages(tracking_number);
CREATE INDEX idx_packages_status ON public.packages(status);
CREATE INDEX idx_packages_received_at ON public.packages(received_at);

-- Add trigger for timestamps
CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create notifications table for secure messaging
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('package_received', 'package_ready', 'package_delivered', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  channels JSONB NOT NULL DEFAULT '{"sms": false, "email": false, "whatsapp": false}',
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Staff can view all notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create indexes for notifications
CREATE INDEX idx_notifications_customer_id ON public.notifications(customer_id);
CREATE INDEX idx_notifications_package_id ON public.notifications(package_id);
CREATE INDEX idx_notifications_status ON public.notifications(status);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- Add trigger for notifications timestamps
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();