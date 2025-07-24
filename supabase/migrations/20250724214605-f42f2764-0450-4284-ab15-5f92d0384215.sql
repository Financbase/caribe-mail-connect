-- Create integrations table to store third-party service configurations
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- 'carrier', 'payment', 'accounting', 'communication', 'api'
  service_name TEXT NOT NULL, -- 'ups', 'fedex', 'stripe', 'quickbooks', etc.
  display_name TEXT NOT NULL,
  configuration JSONB NOT NULL DEFAULT '{}',
  credentials JSONB NOT NULL DEFAULT '{}', -- Encrypted storage for API keys
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_connected BOOLEAN NOT NULL DEFAULT false,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  webhook_url TEXT,
  webhook_secret TEXT,
  rate_limit_per_minute INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create integration logs table for tracking API requests and responses
CREATE TABLE public.integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL, -- 'sync', 'webhook', 'api_call'
  endpoint TEXT,
  method TEXT,
  request_data JSONB,
  response_data JSONB,
  status_code INTEGER,
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create API keys table for managing generated API keys
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  api_secret TEXT,
  permissions JSONB NOT NULL DEFAULT '[]', -- Array of allowed endpoints/actions
  rate_limit_per_minute INTEGER DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create webhook endpoints table
CREATE TABLE public.webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  endpoint_name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events JSONB NOT NULL DEFAULT '[]', -- Array of events to listen for
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_delivery_at TIMESTAMP WITH TIME ZONE,
  delivery_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create integration sync schedules
CREATE TABLE public.integration_sync_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  schedule_type TEXT NOT NULL DEFAULT 'daily', -- 'hourly', 'daily', 'weekly'
  schedule_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_sync_schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for integrations
CREATE POLICY "Staff can manage integrations" ON public.integrations
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view integration logs" ON public.integration_logs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can create integration logs" ON public.integration_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Managers can manage API keys" ON public.api_keys
  FOR ALL USING (has_role(auth.uid(), 'manager') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view API keys" ON public.api_keys
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage webhook endpoints" ON public.webhook_endpoints
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view sync schedules" ON public.integration_sync_schedules
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can manage sync schedules" ON public.integration_sync_schedules
  FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_integrations_service_type ON public.integrations(service_type);
CREATE INDEX idx_integrations_location_id ON public.integrations(location_id);
CREATE INDEX idx_integration_logs_integration_id ON public.integration_logs(integration_id);
CREATE INDEX idx_integration_logs_created_at ON public.integration_logs(created_at);
CREATE INDEX idx_api_keys_location_id ON public.api_keys(location_id);
CREATE INDEX idx_webhook_endpoints_location_id ON public.webhook_endpoints(location_id);

-- Create triggers for updated_at
CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default integration templates
INSERT INTO public.integrations (service_type, service_name, display_name, configuration, location_id, created_by) 
VALUES 
  -- Carrier integrations
  ('carrier', 'ups', 'UPS Tracking API', '{"api_version": "v1", "endpoint": "https://onlinetools.ups.com/track/v1/details", "features": ["tracking", "delivery_updates"]}', NULL, NULL),
  ('carrier', 'fedex', 'FedEx Web Services', '{"api_version": "v1", "endpoint": "https://apis.fedex.com/track/v1/trackingnumbers", "features": ["tracking", "delivery_updates", "shipping_labels"]}', NULL, NULL),
  ('carrier', 'usps', 'USPS Informed Delivery', '{"api_version": "v3", "endpoint": "https://api.usps.com/tracking/v3/tracking", "features": ["tracking", "informed_delivery"]}', NULL, NULL),
  ('carrier', 'dhl', 'DHL Express API', '{"api_version": "v1", "endpoint": "https://api-eu.dhl.com/track/shipments", "features": ["tracking", "delivery_updates"]}', NULL, NULL),
  
  -- Payment gateways
  ('payment', 'stripe', 'Stripe', '{"api_version": "2023-10-16", "endpoint": "https://api.stripe.com/v1", "features": ["payments", "subscriptions", "webhooks"]}', NULL, NULL),
  ('payment', 'ath_movil', 'ATH Móvil', '{"api_version": "v1", "endpoint": "https://api.athmovil.com", "features": ["payments", "mobile_payments"]}', NULL, NULL),
  ('payment', 'paypal', 'PayPal', '{"api_version": "v2", "endpoint": "https://api.paypal.com/v2", "features": ["payments", "subscriptions", "international"]}', NULL, NULL),
  
  -- Accounting software
  ('accounting', 'quickbooks', 'QuickBooks Online', '{"api_version": "v3", "endpoint": "https://sandbox-quickbooks.api.intuit.com/v3", "features": ["invoices", "customers", "payments", "reports"]}', NULL, NULL),
  ('accounting', 'xero', 'Xero', '{"api_version": "2.0", "endpoint": "https://api.xero.com/api.xro/2.0", "features": ["invoices", "contacts", "payments", "reports"]}', NULL, NULL),
  
  -- Communication platforms
  ('communication', 'twilio', 'Twilio SMS', '{"api_version": "2010-04-01", "endpoint": "https://api.twilio.com/2010-04-01", "features": ["sms", "voice", "messaging"]}', NULL, NULL),
  ('communication', 'sendgrid', 'SendGrid Email', '{"api_version": "v3", "endpoint": "https://api.sendgrid.com/v3", "features": ["email", "templates", "analytics"]}', NULL, NULL),
  ('communication', 'whatsapp', 'WhatsApp Business API', '{"api_version": "v17.0", "endpoint": "https://graph.facebook.com/v17.0", "features": ["messaging", "templates", "media"]}', NULL, NULL),
  ('communication', 'teams', 'Microsoft Teams', '{"api_version": "v1.0", "endpoint": "https://graph.microsoft.com/v1.0", "features": ["notifications", "messages", "channels"]}', NULL, NULL),
  ('communication', 'slack', 'Slack', '{"api_version": "v1", "endpoint": "https://slack.com/api", "features": ["messages", "channels", "notifications"]}', NULL, NULL);

-- Create function to generate API keys
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  api_key TEXT;
BEGIN
  -- Generate a secure random API key
  api_key := 'prmcms_' || encode(gen_random_bytes(24), 'base64');
  api_key := replace(api_key, '/', '_');
  api_key := replace(api_key, '+', '-');
  RETURN api_key;
END;
$$;

-- Create function to validate API key
CREATE OR REPLACE FUNCTION public.validate_api_key(key TEXT)
RETURNS TABLE(
  is_valid BOOLEAN,
  location_id UUID,
  permissions JSONB,
  rate_limit_per_minute INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ak.is_active AND (ak.expires_at IS NULL OR ak.expires_at > now()),
    ak.location_id,
    ak.permissions,
    ak.rate_limit_per_minute
  FROM public.api_keys ak
  WHERE ak.api_key = key;
END;
$$;