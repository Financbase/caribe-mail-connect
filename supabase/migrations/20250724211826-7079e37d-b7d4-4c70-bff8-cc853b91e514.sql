-- Reports system tables
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('operational', 'financial', 'compliance', 'custom')),
  category TEXT NOT NULL,
  query_config JSONB NOT NULL DEFAULT '{}',
  visualization_config JSONB NOT NULL DEFAULT '{}',
  filters JSONB NOT NULL DEFAULT '{}',
  parameters JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_system BOOLEAN NOT NULL DEFAULT true,
  location_id UUID,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Report schedules
CREATE TABLE public.report_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('once', 'daily', 'weekly', 'monthly', 'quarterly')),
  schedule_config JSONB NOT NULL DEFAULT '{}',
  recipients JSONB NOT NULL DEFAULT '[]',
  format TEXT NOT NULL DEFAULT 'pdf' CHECK (format IN ('pdf', 'excel', 'csv')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  location_id UUID,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Report executions (history)
CREATE TABLE public.report_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES public.report_schedules(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  parameters JSONB NOT NULL DEFAULT '{}',
  result_data JSONB,
  file_url TEXT,
  error_message TEXT,
  execution_time_ms INTEGER,
  row_count INTEGER,
  executed_by UUID,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Report templates (pre-built reports)
CREATE TABLE public.report_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('operational', 'financial', 'compliance')),
  category TEXT NOT NULL,
  template_config JSONB NOT NULL DEFAULT '{}',
  default_parameters JSONB NOT NULL DEFAULT '{}',
  required_roles JSONB NOT NULL DEFAULT '["staff"]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for reports
CREATE POLICY "Staff can view all reports" ON public.reports
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update reports" ON public.reports
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can delete reports" ON public.reports
  FOR DELETE USING (has_role(auth.uid(), 'manager') OR has_role(auth.uid(), 'admin'));

-- RLS policies for report schedules
CREATE POLICY "Staff can view schedules" ON public.report_schedules
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create schedules" ON public.report_schedules
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update schedules" ON public.report_schedules
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can delete schedules" ON public.report_schedules
  FOR DELETE USING (has_role(auth.uid(), 'manager') OR has_role(auth.uid(), 'admin'));

-- RLS policies for report executions
CREATE POLICY "Staff can view executions" ON public.report_executions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can create executions" ON public.report_executions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update executions" ON public.report_executions
  FOR UPDATE USING (true);

-- RLS policies for report templates
CREATE POLICY "Staff can view templates" ON public.report_templates
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can manage templates" ON public.report_templates
  FOR ALL USING (has_role(auth.uid(), 'manager') OR has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_report_schedules_updated_at
  BEFORE UPDATE ON public.report_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_report_templates_updated_at
  BEFORE UPDATE ON public.report_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default report templates
INSERT INTO public.report_templates (name, description, type, category, template_config, default_parameters) VALUES
-- Operational Reports
('Daily Operations Summary', 'Overview of daily package processing and staff activities', 'operational', 'daily_operations', 
  '{"tables": ["packages", "deliveries"], "fields": ["total_packages", "total_deliveries", "pending_packages"], "groupBy": "date"}',
  '{"date_range": "today", "location_id": null}'),

('Package Aging Report', 'Packages awaiting pickup by customer and duration', 'operational', 'package_management',
  '{"tables": ["packages", "customers"], "fields": ["tracking_number", "customer_name", "received_at", "status", "days_waiting"], "filters": {"status": "Received"}}',
  '{"max_days": 30, "location_id": null}'),

('Carrier Performance Analysis', 'Analysis of delivery performance by carrier', 'operational', 'carrier_analysis',
  '{"tables": ["packages", "deliveries"], "fields": ["carrier", "total_packages", "avg_delivery_time", "success_rate"], "groupBy": "carrier"}',
  '{"date_range": "last_30_days", "location_id": null}'),

('Staff Productivity Metrics', 'Staff performance and productivity analysis', 'operational', 'staff_management',
  '{"tables": ["packages", "deliveries", "profiles"], "fields": ["staff_name", "packages_processed", "deliveries_completed", "avg_processing_time"], "groupBy": "staff_id"}',
  '{"date_range": "last_7_days", "location_id": null}'),

('Delivery Route Efficiency', 'Analysis of delivery route performance and optimization', 'operational', 'route_management',
  '{"tables": ["delivery_routes", "deliveries"], "fields": ["route_name", "total_stops", "completion_time", "fuel_efficiency"], "groupBy": "route_id"}',
  '{"date_range": "last_30_days", "location_id": null}'),

-- Financial Reports
('Revenue by Service Line', 'Revenue breakdown by different service offerings', 'financial', 'revenue_analysis',
  '{"tables": ["invoices", "invoice_items"], "fields": ["service_type", "total_revenue", "transaction_count"], "groupBy": "service_type"}',
  '{"date_range": "current_month", "location_id": null}'),

('Accounts Receivable Aging', 'Outstanding invoices by aging periods', 'financial', 'accounts_receivable',
  '{"tables": ["invoices", "customers"], "fields": ["customer_name", "invoice_number", "amount_due", "days_overdue"], "filters": {"status": "sent"}}',
  '{"aging_periods": [30, 60, 90], "location_id": null}'),

('Cash Flow Analysis', 'Cash flow analysis including payments and expenses', 'financial', 'cash_flow',
  '{"tables": ["mailbox_payments", "invoices"], "fields": ["payment_date", "total_payments", "total_invoiced", "net_flow"], "groupBy": "month"}',
  '{"date_range": "last_12_months", "location_id": null}'),

('Profitability by Customer Segment', 'Customer profitability analysis by segment', 'financial', 'profitability',
  '{"tables": ["customers", "invoices", "mailboxes"], "fields": ["customer_type", "total_revenue", "avg_revenue_per_customer", "profit_margin"], "groupBy": "customer_type"}',
  '{"date_range": "current_year", "location_id": null}'),

('Tax Liability Report (IVU)', 'Puerto Rico tax liability calculation and reporting', 'financial', 'tax_reporting',
  '{"tables": ["invoices", "invoice_items"], "fields": ["tax_period", "gross_revenue", "tax_amount", "net_revenue"], "groupBy": "tax_period"}',
  '{"tax_rate": 0.115, "date_range": "current_quarter"}'),

-- Compliance Reports
('CMRA Quarterly Report', 'Automated CMRA compliance quarterly reporting', 'compliance', 'cmra_reporting',
  '{"tables": ["customers", "customer_compliance", "mailboxes"], "fields": ["customer_count", "active_mailboxes", "compliance_score"], "groupBy": "quarter"}',
  '{"quarter": "current", "location_id": null}'),

('Form 1583 Status Report', 'Status of PS Form 1583 submissions by customer', 'compliance', 'form_1583',
  '{"tables": ["customers", "customer_compliance"], "fields": ["customer_name", "ps_form_1583_status", "submission_date", "expiration_date"], "filters": {"ps_form_1583_status": ["pending", "submitted", "expired"]}}',
  '{"location_id": null}'),

('ID Verification Audit Trail', 'Customer identification verification status and history', 'compliance', 'id_verification',
  '{"tables": ["customers", "customer_compliance", "compliance_audit_log"], "fields": ["customer_name", "id_verification_status", "verification_date", "verified_by"], "groupBy": "status"}',
  '{"date_range": "last_90_days", "location_id": null}'),

('Customer Compliance Scores', 'Overall compliance scoring for all customers', 'compliance', 'compliance_scoring',
  '{"tables": ["customers", "customer_compliance"], "fields": ["customer_name", "compliance_score", "last_reviewed_at", "next_review_due"], "groupBy": "score_range"}',
  '{"min_score": 0, "location_id": null}'),

('Regulatory Checklist', 'Regulatory compliance checklist and status', 'compliance', 'regulatory_compliance',
  '{"tables": ["locations", "customer_compliance", "act_60_compliance"], "fields": ["location_name", "total_customers", "compliant_customers", "pending_reviews"], "groupBy": "location"}',
  '{"location_id": null}');