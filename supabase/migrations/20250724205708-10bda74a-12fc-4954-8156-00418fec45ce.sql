-- Create notification rules engine tables
CREATE TABLE public.notification_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location_id UUID REFERENCES public.locations(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Trigger conditions
  trigger_type TEXT NOT NULL, -- 'package_arrival', 'package_age', 'mailbox_expiry', 'payment_due'
  conditions JSONB NOT NULL DEFAULT '{}', -- {age_days: 3, customer_type: 'act60', package_size: 'large'}
  
  -- Notification settings
  channels JSONB NOT NULL DEFAULT '{"email": true, "sms": false, "whatsapp": false, "push": false}',
  template_id UUID,
  delay_minutes INTEGER DEFAULT 0,
  
  -- Scheduling
  schedule_config JSONB DEFAULT '{}', -- {days: ['mon', 'tue'], time: '09:00', timezone: 'America/Puerto_Rico'}
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create notification templates table
CREATE TABLE public.notification_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'email', 'sms', 'whatsapp', 'push'
  language TEXT NOT NULL DEFAULT 'en', -- 'en', 'es'
  
  -- Content
  subject TEXT, -- for email
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]', -- ['customer_name', 'tracking_number', 'package_count']
  
  -- A/B Testing
  variant_name TEXT DEFAULT 'A',
  parent_template_id UUID REFERENCES public.notification_templates(id),
  test_percentage INTEGER DEFAULT 100, -- 0-100
  
  -- Metadata
  is_default BOOLEAN DEFAULT false,
  category TEXT, -- 'arrival', 'reminder', 'urgent', 'payment'
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create notification workflows (pre-built)
CREATE TABLE public.notification_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'package', 'mailbox', 'payment'
  is_system BOOLEAN DEFAULT true, -- system vs custom workflows
  
  -- Workflow steps
  steps JSONB NOT NULL, -- [{step: 1, trigger: 'package_arrival', delay: 0, template_id: 'uuid'}, ...]
  
  -- Settings
  is_active BOOLEAN DEFAULT true,
  location_id UUID REFERENCES public.locations(id),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Create notification queue for processing
CREATE TABLE public.notification_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  rule_id UUID REFERENCES public.notification_rules(id),
  workflow_id UUID REFERENCES public.notification_workflows(id),
  template_id UUID REFERENCES public.notification_templates(id),
  
  -- Content
  channel TEXT NOT NULL, -- 'email', 'sms', 'whatsapp', 'push'
  recipient TEXT NOT NULL, -- email address or phone number
  subject TEXT,
  content TEXT NOT NULL,
  
  -- Processing
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  
  -- Tracking
  external_id TEXT, -- provider message ID
  delivery_status TEXT, -- 'delivered', 'failed', 'pending'
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  
  -- Cost tracking
  cost_cents INTEGER DEFAULT 0,
  provider TEXT, -- 'resend', 'twilio', 'whatsapp'
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create WhatsApp templates for business API
CREATE TABLE public.whatsapp_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  category TEXT NOT NULL, -- 'MARKETING', 'UTILITY', 'AUTHENTICATION'
  
  -- WhatsApp API details
  whatsapp_template_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  
  -- Content
  header_type TEXT, -- 'text', 'image', 'video', 'document'
  header_content TEXT,
  body_content TEXT NOT NULL,
  footer_content TEXT,
  buttons JSONB DEFAULT '[]',
  
  -- Variables
  header_variables JSONB DEFAULT '[]',
  body_variables JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Create notification analytics table
CREATE TABLE public.notification_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  location_id UUID REFERENCES public.locations(id),
  
  -- Metrics by channel
  channel TEXT NOT NULL,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_failed INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  
  -- Performance metrics
  delivery_rate DECIMAL(5,2), -- percentage
  open_rate DECIMAL(5,2), -- percentage
  click_rate DECIMAL(5,2), -- percentage
  avg_response_time_minutes INTEGER,
  
  -- Cost metrics
  total_cost_cents INTEGER DEFAULT 0,
  cost_per_message_cents DECIMAL(10,2),
  
  -- Template performance
  template_id UUID REFERENCES public.notification_templates(id),
  rule_id UUID REFERENCES public.notification_rules(id),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(date, location_id, channel, template_id, rule_id)
);

-- Create opt-out management
CREATE TABLE public.notification_opt_outs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  channel TEXT NOT NULL, -- 'email', 'sms', 'whatsapp', 'push'
  reason TEXT, -- 'user_request', 'bounced', 'complained', 'legal'
  opted_out_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE, -- for temporary opt-outs
  
  -- Legal compliance
  ip_address TEXT,
  user_agent TEXT,
  consent_method TEXT, -- 'explicit', 'implied', 'legitimate_interest'
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(customer_id, channel)
);

-- Enable RLS on all tables
ALTER TABLE public.notification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_opt_outs ENABLE ROW LEVEL SECURITY;

-- Create policies for staff access
CREATE POLICY "Staff can manage notification rules" ON public.notification_rules FOR ALL TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage notification templates" ON public.notification_templates FOR ALL TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage notification workflows" ON public.notification_workflows FOR ALL TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can view notification queue" ON public.notification_queue FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage WhatsApp templates" ON public.whatsapp_templates FOR ALL TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can view notification analytics" ON public.notification_analytics FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can view opt-outs" ON public.notification_opt_outs FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

-- Create system policies for notification processing
CREATE POLICY "System can manage notification queue" ON public.notification_queue FOR ALL TO service_role USING (true);
CREATE POLICY "System can update analytics" ON public.notification_analytics FOR ALL TO service_role USING (true);

-- Create indexes for performance
CREATE INDEX idx_notification_rules_active ON public.notification_rules(is_active, location_id);
CREATE INDEX idx_notification_queue_status ON public.notification_queue(status, scheduled_for);
CREATE INDEX idx_notification_queue_customer ON public.notification_queue(customer_id, created_at);
CREATE INDEX idx_notification_analytics_date ON public.notification_analytics(date, channel);
CREATE INDEX idx_opt_outs_customer_channel ON public.notification_opt_outs(customer_id, channel);

-- Create function to update analytics
CREATE OR REPLACE FUNCTION update_notification_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update analytics when notification status changes
  IF NEW.status != OLD.status THEN
    INSERT INTO public.notification_analytics (
      date, location_id, channel, template_id, rule_id,
      total_sent, total_delivered, total_failed
    )
    SELECT 
      CURRENT_DATE,
      c.location_id,
      NEW.channel,
      NEW.template_id,
      NEW.rule_id,
      CASE WHEN NEW.status = 'sent' THEN 1 ELSE 0 END,
      CASE WHEN NEW.delivery_status = 'delivered' THEN 1 ELSE 0 END,
      CASE WHEN NEW.status = 'failed' THEN 1 ELSE 0 END
    FROM public.customers c
    WHERE c.id = NEW.customer_id
    ON CONFLICT (date, location_id, channel, template_id, rule_id)
    DO UPDATE SET
      total_sent = notification_analytics.total_sent + EXCLUDED.total_sent,
      total_delivered = notification_analytics.total_delivered + EXCLUDED.total_delivered,
      total_failed = notification_analytics.total_failed + EXCLUDED.total_failed,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for analytics
CREATE TRIGGER update_notification_analytics_trigger
  AFTER UPDATE ON public.notification_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_analytics();

-- Insert default notification templates
INSERT INTO public.notification_templates (name, type, language, subject, content, category, is_default, variables) VALUES
-- English templates
('Package Arrival - English', 'email', 'en', 'Paquete disponible - {{customer_name}}', 
 'Estimado/a {{customer_name}},<br><br>Su paquete con número de rastreo {{tracking_number}} ha llegado y está listo para recoger.<br><br>Detalles:<br>- Transportista: {{carrier}}<br>- Tamaño: {{size}}<br>- Fecha de llegada: {{arrival_date}}<br><br>Horario de oficina: Lunes a Viernes 8:00 AM - 6:00 PM<br><br>Saludos,<br>Equipo PRMCMS', 
 'arrival', true, '["customer_name", "tracking_number", "carrier", "size", "arrival_date"]'),

('Package Reminder - English', 'sms', 'en', NULL, 
 'Hola {{customer_name}}, su paquete {{tracking_number}} está esperando. Recójalo pronto para evitar cargos adicionales. PRMCMS', 
 'reminder', true, '["customer_name", "tracking_number"]'),

('Mailbox Expiry - English', 'email', 'en', 'Su buzón expira pronto - Acción requerida',
 'Estimado/a {{customer_name}},<br><br>Su buzón #{{mailbox_number}} expirará el {{expiry_date}}.<br><br>Para renovar, visite nuestra oficina o contacte:<br>📞 {{office_phone}}<br>📧 {{office_email}}<br><br>Evite interrupción del servicio renovando antes del vencimiento.<br><br>Gracias,<br>PRMCMS',
 'payment', true, '["customer_name", "mailbox_number", "expiry_date", "office_phone", "office_email"]'),

-- Spanish templates  
('Package Arrival - Spanish', 'email', 'es', 'Paquete disponible - {{customer_name}}',
 'Estimado/a {{customer_name}},<br><br>Su paquete con número de rastreo {{tracking_number}} ha llegado y está listo para recoger.<br><br>Detalles:<br>- Transportista: {{carrier}}<br>- Tamaño: {{size}}<br>- Fecha de llegada: {{arrival_date}}<br><br>Horario de oficina: Lunes a Viernes 8:00 AM - 6:00 PM<br><br>Saludos,<br>Equipo PRMCMS',
 'arrival', true, '["customer_name", "tracking_number", "carrier", "size", "arrival_date"]'),

('Package Reminder - Spanish', 'sms', 'es', NULL,
 'Hola {{customer_name}}, su paquete {{tracking_number}} está esperando. Recójalo pronto para evitar cargos adicionales. PRMCMS',
 'reminder', true, '["customer_name", "tracking_number"]'),

('Mailbox Expiry - Spanish', 'email', 'es', 'Su buzón expira pronto - Acción requerida',
 'Estimado/a {{customer_name}},<br><br>Su buzón #{{mailbox_number}} expirará el {{expiry_date}}.<br><br>Para renovar, visite nuestra oficina o contacte:<br>📞 {{office_phone}}<br>📧 {{office_email}}<br><br>Evite interrupción del servicio renovando antes del vencimiento.<br><br>Gracias,<br>PRMCMS',
 'payment', true, '["customer_name", "mailbox_number", "expiry_date", "office_phone", "office_email"]');

-- Insert default notification workflows
INSERT INTO public.notification_workflows (name, description, category, steps) VALUES
('Package Delivery Workflow', 'Automated notifications for package delivery lifecycle', 'package', 
 '[
   {"step": 1, "trigger": "package_arrival", "delay": 0, "channels": ["email", "sms"], "template_category": "arrival"},
   {"step": 2, "trigger": "package_age", "delay": 4320, "condition": {"age_days": 3}, "channels": ["sms"], "template_category": "reminder"},
   {"step": 3, "trigger": "package_age", "delay": 10080, "condition": {"age_days": 7}, "channels": ["email", "sms"], "template_category": "urgent"}
 ]'),

('Mailbox Renewal Workflow', 'Automated reminders for mailbox renewals', 'mailbox',
 '[
   {"step": 1, "trigger": "mailbox_expiry", "delay": 0, "condition": {"days_before": 30}, "channels": ["email"], "template_category": "payment"},
   {"step": 2, "trigger": "mailbox_expiry", "delay": 0, "condition": {"days_before": 15}, "channels": ["email", "sms"], "template_category": "payment"},
   {"step": 3, "trigger": "mailbox_expiry", "delay": 0, "condition": {"days_before": 7}, "channels": ["email", "sms"], "template_category": "urgent"}
 ]'),

('Payment Due Workflow', 'Automated payment reminders', 'payment',
 '[
   {"step": 1, "trigger": "payment_due", "delay": 0, "condition": {"days_overdue": 1}, "channels": ["email"], "template_category": "payment"},
   {"step": 2, "trigger": "payment_due", "delay": 0, "condition": {"days_overdue": 7}, "channels": ["email", "sms"], "template_category": "urgent"},
   {"step": 3, "trigger": "payment_due", "delay": 0, "condition": {"days_overdue": 15}, "channels": ["email", "sms"], "template_category": "urgent"}
 ]');

-- Create updated_at triggers for all tables
CREATE TRIGGER update_notification_rules_updated_at
  BEFORE UPDATE ON public.notification_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_workflows_updated_at
  BEFORE UPDATE ON public.notification_workflows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_queue_updated_at
  BEFORE UPDATE ON public.notification_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_templates_updated_at
  BEFORE UPDATE ON public.whatsapp_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_analytics_updated_at
  BEFORE UPDATE ON public.notification_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();