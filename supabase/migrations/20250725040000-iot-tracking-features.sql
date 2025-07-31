-- IoT Package Tracking Features Migration
-- This migration adds comprehensive IoT tracking capabilities to PRMCMS

-- Add IoT tracking fields to packages table
ALTER TABLE public.packages 
ADD COLUMN IF NOT EXISTS iot_device_id UUID,
ADD COLUMN IF NOT EXISTS current_location JSONB DEFAULT '{"lat": 0, "lng": 0, "accuracy": 0}',
ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivery_route JSONB,
ADD COLUMN IF NOT EXISTS environmental_data JSONB DEFAULT '{"temperature": null, "humidity": null, "shock_events": []}',
ADD COLUMN IF NOT EXISTS chain_of_custody JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS qr_code TEXT,
ADD COLUMN IF NOT EXISTS tracking_enabled BOOLEAN DEFAULT false;

-- Create IoT devices table
CREATE TABLE public.iot_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('tracker', 'sensor', 'gateway')),
  serial_number TEXT UNIQUE NOT NULL,
  mac_address TEXT,
  firmware_version TEXT DEFAULT '1.0.0',
  battery_level INTEGER DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  network_status TEXT DEFAULT 'offline' CHECK (network_status IN ('online', 'offline', 'low_signal')),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  location JSONB DEFAULT '{"lat": 0, "lng": 0}',
  assigned_package_id UUID REFERENCES public.packages(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'retired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create package tracking events table
CREATE TABLE public.package_tracking_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('location_update', 'status_change', 'environmental_alert', 'shock_detected', 'temperature_alert', 'delivery_milestone')),
  event_data JSONB NOT NULL,
  location JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  device_id UUID REFERENCES public.iot_devices(id),
  handler_id UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create environmental sensor readings table
CREATE TABLE public.sensor_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID NOT NULL REFERENCES public.iot_devices(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  reading_type TEXT NOT NULL CHECK (reading_type IN ('temperature', 'humidity', 'shock', 'light', 'pressure')),
  value DECIMAL(10,4) NOT NULL,
  unit TEXT NOT NULL,
  location JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  alert_threshold JSONB,
  is_alert BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery routes table
CREATE TABLE public.delivery_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_name TEXT NOT NULL,
  carrier_id UUID REFERENCES auth.users(id),
  start_location JSONB NOT NULL,
  end_location JSONB NOT NULL,
  waypoints JSONB DEFAULT '[]',
  estimated_duration INTEGER, -- in minutes
  actual_duration INTEGER, -- in minutes
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  weather_conditions JSONB,
  traffic_conditions JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create route packages junction table
CREATE TABLE public.route_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID NOT NULL REFERENCES public.delivery_routes(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  sequence_order INTEGER NOT NULL,
  estimated_pickup_time TIMESTAMP WITH TIME ZONE,
  actual_pickup_time TIMESTAMP WITH TIME ZONE,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_transit', 'delivered', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(route_id, package_id)
);

-- Create IoT alerts table
CREATE TABLE public.iot_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('temperature', 'shock', 'battery_low', 'device_offline', 'delivery_delay', 'route_deviation')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  device_id UUID REFERENCES public.iot_devices(id),
  package_id UUID REFERENCES public.packages(id),
  route_id UUID REFERENCES public.delivery_routes(id),
  alert_data JSONB,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create webhook configurations table
CREATE TABLE public.webhook_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events JSONB NOT NULL DEFAULT '[]',
  headers JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  secret_key TEXT,
  retry_count INTEGER DEFAULT 3,
  timeout_seconds INTEGER DEFAULT 30,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create webhook delivery logs table
CREATE TABLE public.webhook_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_id UUID NOT NULL REFERENCES public.webhook_configs(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  delivery_time_ms INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for all new tables
ALTER TABLE public.iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- Create policies for IoT devices
CREATE POLICY "Staff can view all IoT devices" ON public.iot_devices FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage IoT devices" ON public.iot_devices FOR ALL USING (auth.uid() IS NOT NULL);

-- Create policies for tracking events
CREATE POLICY "Staff can view all tracking events" ON public.package_tracking_events FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can create tracking events" ON public.package_tracking_events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can update tracking events" ON public.package_tracking_events FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create policies for sensor readings
CREATE POLICY "Staff can view all sensor readings" ON public.sensor_readings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can create sensor readings" ON public.sensor_readings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create policies for delivery routes
CREATE POLICY "Staff can view all delivery routes" ON public.delivery_routes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage delivery routes" ON public.delivery_routes FOR ALL USING (auth.uid() IS NOT NULL);

-- Create policies for route packages
CREATE POLICY "Staff can view all route packages" ON public.route_packages FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage route packages" ON public.route_packages FOR ALL USING (auth.uid() IS NOT NULL);

-- Create policies for IoT alerts
CREATE POLICY "Staff can view all IoT alerts" ON public.iot_alerts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage IoT alerts" ON public.iot_alerts FOR ALL USING (auth.uid() IS NOT NULL);

-- Create policies for webhook configs
CREATE POLICY "Staff can view all webhook configs" ON public.webhook_configs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage webhook configs" ON public.webhook_configs FOR ALL USING (auth.uid() IS NOT NULL);

-- Create policies for webhook deliveries
CREATE POLICY "Staff can view all webhook deliveries" ON public.webhook_deliveries FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can create webhook deliveries" ON public.webhook_deliveries FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_packages_iot_device_id ON public.packages(iot_device_id);
CREATE INDEX idx_packages_tracking_enabled ON public.packages(tracking_enabled);
CREATE INDEX idx_packages_estimated_delivery ON public.packages(estimated_delivery);

CREATE INDEX idx_iot_devices_assigned_package_id ON public.iot_devices(assigned_package_id);
CREATE INDEX idx_iot_devices_status ON public.iot_devices(status);
CREATE INDEX idx_iot_devices_last_seen ON public.iot_devices(last_seen);

CREATE INDEX idx_tracking_events_package_id ON public.package_tracking_events(package_id);
CREATE INDEX idx_tracking_events_timestamp ON public.package_tracking_events(timestamp);
CREATE INDEX idx_tracking_events_event_type ON public.package_tracking_events(event_type);

CREATE INDEX idx_sensor_readings_device_id ON public.sensor_readings(device_id);
CREATE INDEX idx_sensor_readings_package_id ON public.sensor_readings(package_id);
CREATE INDEX idx_sensor_readings_timestamp ON public.sensor_readings(timestamp);
CREATE INDEX idx_sensor_readings_reading_type ON public.sensor_readings(reading_type);

CREATE INDEX idx_delivery_routes_carrier_id ON public.delivery_routes(carrier_id);
CREATE INDEX idx_delivery_routes_status ON public.delivery_routes(status);

CREATE INDEX idx_route_packages_route_id ON public.route_packages(route_id);
CREATE INDEX idx_route_packages_package_id ON public.route_packages(package_id);
CREATE INDEX idx_route_packages_status ON public.route_packages(status);

CREATE INDEX idx_iot_alerts_package_id ON public.iot_alerts(package_id);
CREATE INDEX idx_iot_alerts_device_id ON public.iot_alerts(device_id);
CREATE INDEX idx_iot_alerts_status ON public.iot_alerts(status);
CREATE INDEX idx_iot_alerts_severity ON public.iot_alerts(severity);

CREATE INDEX idx_webhook_deliveries_webhook_id ON public.webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_created_at ON public.webhook_deliveries(created_at);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_iot_devices_updated_at
BEFORE UPDATE ON public.iot_devices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_delivery_routes_updated_at
BEFORE UPDATE ON public.delivery_routes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_route_packages_updated_at
BEFORE UPDATE ON public.route_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_iot_alerts_updated_at
BEFORE UPDATE ON public.iot_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_webhook_configs_updated_at
BEFORE UPDATE ON public.webhook_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate QR codes for packages
CREATE OR REPLACE FUNCTION generate_package_qr_code(package_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN 'https://prmcms.com/track/' || package_id::text;
END;
$$ LANGUAGE plpgsql;

-- Create function to update package location
CREATE OR REPLACE FUNCTION update_package_location(
  p_package_id UUID,
  p_lat DECIMAL,
  p_lng DECIMAL,
  p_accuracy INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.packages 
  SET 
    current_location = jsonb_build_object('lat', p_lat, 'lng', p_lng, 'accuracy', p_accuracy),
    updated_at = now()
  WHERE id = p_package_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to add tracking event
CREATE OR REPLACE FUNCTION add_tracking_event(
  p_package_id UUID,
  p_event_type TEXT,
  p_event_data JSONB,
  p_location JSONB DEFAULT NULL,
  p_device_id UUID DEFAULT NULL,
  p_handler_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.package_tracking_events (
    package_id, event_type, event_data, location, device_id, handler_id
  ) VALUES (
    p_package_id, p_event_type, p_event_data, p_location, p_device_id, p_handler_id
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to check for environmental alerts
CREATE OR REPLACE FUNCTION check_environmental_alerts(
  p_package_id UUID,
  p_temperature DECIMAL DEFAULT NULL,
  p_humidity DECIMAL DEFAULT NULL,
  p_shock_level DECIMAL DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  alert_threshold JSONB;
  alert_severity TEXT;
BEGIN
  -- Get package environmental thresholds
  SELECT environmental_data->'thresholds' INTO alert_threshold
  FROM public.packages WHERE id = p_package_id;
  
  -- Check temperature alerts
  IF p_temperature IS NOT NULL AND alert_threshold->>'max_temperature' IS NOT NULL THEN
    IF p_temperature > (alert_threshold->>'max_temperature')::DECIMAL THEN
      alert_severity := CASE 
        WHEN p_temperature > (alert_threshold->>'max_temperature')::DECIMAL + 10 THEN 'critical'
        WHEN p_temperature > (alert_threshold->>'max_temperature')::DECIMAL + 5 THEN 'high'
        ELSE 'medium'
      END;
      
      INSERT INTO public.iot_alerts (
        alert_type, severity, title, description, package_id, alert_data
      ) VALUES (
        'temperature', alert_severity, 
        'Temperature Alert', 
        'Package temperature exceeded threshold: ' || p_temperature || '°C',
        p_package_id,
        jsonb_build_object('temperature', p_temperature, 'threshold', alert_threshold->>'max_temperature')
      );
    END IF;
  END IF;
  
  -- Check shock alerts
  IF p_shock_level IS NOT NULL AND p_shock_level > 5 THEN
    alert_severity := CASE 
      WHEN p_shock_level > 15 THEN 'critical'
      WHEN p_shock_level > 10 THEN 'high'
      ELSE 'medium'
    END;
    
    INSERT INTO public.iot_alerts (
      alert_type, severity, title, description, package_id, alert_data
    ) VALUES (
      'shock', alert_severity,
      'Shock Detection Alert',
      'Package experienced significant shock: ' || p_shock_level || 'g',
      p_package_id,
      jsonb_build_object('shock_level', p_shock_level)
    );
  END IF;
END;
$$ LANGUAGE plpgsql; 