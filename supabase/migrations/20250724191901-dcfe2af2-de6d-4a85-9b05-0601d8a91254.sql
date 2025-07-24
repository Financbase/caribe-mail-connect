-- Create delivery routes table
CREATE TABLE public.delivery_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  estimated_duration INTEGER, -- in minutes
  actual_duration INTEGER, -- in minutes
  total_stops INTEGER DEFAULT 0,
  completed_stops INTEGER DEFAULT 0,
  route_order JSONB, -- Array of delivery IDs in order
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create deliveries table
CREATE TABLE public.deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  route_id UUID REFERENCES public.delivery_routes(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'PR',
  zip_code TEXT NOT NULL,
  zone TEXT, -- Delivery zone/area
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_transit', 'delivered', 'failed', 'returned')),
  priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  delivery_window_start TIME,
  delivery_window_end TIME,
  special_instructions TEXT,
  delivery_notes TEXT,
  attempt_count INTEGER DEFAULT 0,
  delivery_proof JSONB, -- Photos, signatures, etc.
  coordinates POINT, -- GPS coordinates
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create delivery attempts table
CREATE TABLE public.delivery_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  delivery_id UUID NOT NULL REFERENCES public.deliveries(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('failed', 'delivered', 'rescheduled')),
  failure_reason TEXT,
  notes TEXT,
  driver_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create driver assignments table
CREATE TABLE public.driver_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_type TEXT,
  license_number TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  zone_assignments TEXT[], -- Array of zones they can deliver to
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.delivery_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for delivery_routes
CREATE POLICY "Staff can view all routes" ON public.delivery_routes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create routes" ON public.delivery_routes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update routes" ON public.delivery_routes
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Drivers can view their routes" ON public.delivery_routes
  FOR SELECT USING (driver_id = auth.uid());

-- RLS Policies for deliveries
CREATE POLICY "Staff can view all deliveries" ON public.deliveries
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create deliveries" ON public.deliveries
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update deliveries" ON public.deliveries
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for delivery_attempts
CREATE POLICY "Staff can view delivery attempts" ON public.delivery_attempts
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create delivery attempts" ON public.delivery_attempts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for driver_assignments
CREATE POLICY "Staff can view driver assignments" ON public.driver_assignments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage driver assignments" ON public.driver_assignments
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at
CREATE TRIGGER update_delivery_routes_updated_at
  BEFORE UPDATE ON public.delivery_routes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at
  BEFORE UPDATE ON public.deliveries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_driver_assignments_updated_at
  BEFORE UPDATE ON public.driver_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample zones and drivers
INSERT INTO public.driver_assignments (user_id, vehicle_type, license_number, phone, zone_assignments) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'Van', 'DLV-001', '+1-787-555-0101', ARRAY['San Juan', 'Bayamón']),
  ((SELECT id FROM auth.users LIMIT 1), 'Truck', 'DLV-002', '+1-787-555-0102', ARRAY['Carolina', 'Trujillo Alto']);

-- Insert sample delivery route
INSERT INTO public.delivery_routes (name, date, status, estimated_duration, total_stops) VALUES
  ('San Juan Route 1', CURRENT_DATE, 'planned', 240, 8),
  ('Bayamón Route 1', CURRENT_DATE, 'planned', 180, 5);