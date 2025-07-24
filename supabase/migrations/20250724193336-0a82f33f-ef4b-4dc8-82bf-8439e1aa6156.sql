-- Create locations table
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE, -- Short code like 'SJ01', 'BY02'
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'PR',
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  phone TEXT,
  email TEXT,
  is_primary boolean DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  operating_hours JSONB DEFAULT '{}', -- Store hours for each day
  services_offered TEXT[], -- Available services at this location
  pricing_tier TEXT DEFAULT 'standard',
  coordinates POINT, -- GPS coordinates
  timezone TEXT DEFAULT 'America/Puerto_Rico',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create location staff assignments table
CREATE TABLE public.location_staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('manager', 'staff', 'driver')),
  is_primary boolean DEFAULT false, -- Primary location for this staff member
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'transferred')),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  assigned_by UUID,
  UNIQUE(location_id, user_id)
);

-- Add location_id to existing tables
ALTER TABLE public.customers ADD COLUMN location_id UUID REFERENCES public.locations(id);
ALTER TABLE public.packages ADD COLUMN location_id UUID REFERENCES public.locations(id);
ALTER TABLE public.mailboxes ADD COLUMN location_id UUID REFERENCES public.locations(id);
ALTER TABLE public.delivery_routes ADD COLUMN location_id UUID REFERENCES public.locations(id);

-- Create package transfers table for cross-location transfers
CREATE TABLE public.package_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  from_location_id UUID NOT NULL REFERENCES public.locations(id),
  to_location_id UUID NOT NULL REFERENCES public.locations(id),
  transfer_reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'completed', 'cancelled')),
  initiated_by UUID REFERENCES auth.users(id),
  completed_by UUID REFERENCES auth.users(id),
  initiated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_transfers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for locations
CREATE POLICY "Staff can view all locations" ON public.locations
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can manage locations" ON public.locations
  FOR ALL USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for location_staff
CREATE POLICY "Staff can view location assignments" ON public.location_staff
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can manage staff assignments" ON public.location_staff
  FOR ALL USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for package_transfers
CREATE POLICY "Staff can view package transfers" ON public.package_transfers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create package transfers" ON public.package_transfers
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update package transfers" ON public.package_transfers
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_package_transfers_updated_at
  BEFORE UPDATE ON public.package_transfers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample locations
INSERT INTO public.locations (name, code, address_line1, city, state, zip_code, phone, is_primary, operating_hours, services_offered) VALUES
  ('San Juan Main', 'SJ01', '123 Calle Principal', 'San Juan', 'PR', '00901', '+1-787-555-0100', true, 
   '{"monday": {"open": "08:00", "close": "18:00"}, "tuesday": {"open": "08:00", "close": "18:00"}, "wednesday": {"open": "08:00", "close": "18:00"}, "thursday": {"open": "08:00", "close": "18:00"}, "friday": {"open": "08:00", "close": "18:00"}, "saturday": {"open": "09:00", "close": "14:00"}, "sunday": {"closed": true}}',
   ARRAY['package_receiving', 'mailbox_rental', 'delivery', 'scanning', 'notarization']),
   
  ('Bayamón Branch', 'BY02', '456 Ave Roosevelt', 'Bayamón', 'PR', '00960', '+1-787-555-0200', false,
   '{"monday": {"open": "08:30", "close": "17:30"}, "tuesday": {"open": "08:30", "close": "17:30"}, "wednesday": {"open": "08:30", "close": "17:30"}, "thursday": {"open": "08:30", "close": "17:30"}, "friday": {"open": "08:30", "close": "17:30"}, "saturday": {"open": "09:00", "close": "13:00"}, "sunday": {"closed": true}}',
   ARRAY['package_receiving', 'mailbox_rental', 'delivery']),
   
  ('Carolina Express', 'CA03', '789 Calle Escuelas', 'Carolina', 'PR', '00979', '+1-787-555-0300', false,
   '{"monday": {"open": "07:00", "close": "19:00"}, "tuesday": {"open": "07:00", "close": "19:00"}, "wednesday": {"open": "07:00", "close": "19:00"}, "thursday": {"open": "07:00", "close": "19:00"}, "friday": {"open": "07:00", "close": "19:00"}, "saturday": {"open": "08:00", "close": "16:00"}, "sunday": {"open": "10:00", "close": "14:00"}}',
   ARRAY['package_receiving', 'mailbox_rental', 'delivery', 'express_service']);

-- Update existing data to assign to primary location
UPDATE public.customers SET location_id = (SELECT id FROM public.locations WHERE is_primary = true LIMIT 1);
UPDATE public.packages SET location_id = (SELECT id FROM public.locations WHERE is_primary = true LIMIT 1);
UPDATE public.mailboxes SET location_id = (SELECT id FROM public.locations WHERE is_primary = true LIMIT 1);
UPDATE public.delivery_routes SET location_id = (SELECT id FROM public.locations WHERE is_primary = true LIMIT 1);