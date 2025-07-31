-- QA System Database Setup
-- Run this script in your Supabase SQL Editor
-- Created: 2025-07-25

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Compliance Checklist Table
CREATE TABLE IF NOT EXISTS compliance_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('usps', 'pr', 'security', 'privacy')),
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  due_date DATE NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Self Audits Table
CREATE TABLE IF NOT EXISTS self_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  audit_date DATE NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  findings JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  auditor TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'reviewed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Corrective Actions Table
CREATE TABLE IF NOT EXISTS corrective_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  assigned_to TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  related_audit_id UUID REFERENCES self_audits(id),
  related_checklist_item_id UUID REFERENCES compliance_checklist(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance Documents Table
CREATE TABLE IF NOT EXISTS compliance_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  issuing_authority TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending_renewal')),
  certificate_number TEXT NOT NULL,
  renewal_reminder_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance Scores Table
CREATE TABLE IF NOT EXISTS compliance_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  category TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regulatory Updates Table
CREATE TABLE IF NOT EXISTS regulatory_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL,
  effective_date DATE NOT NULL,
  impact TEXT DEFAULT 'medium' CHECK (impact IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'implemented', 'reviewed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Quality Metrics Table
CREATE TABLE IF NOT EXISTS service_quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  complaint_resolution_rate INTEGER CHECK (complaint_resolution_rate >= 0 AND complaint_resolution_rate <= 100),
  avg_response_time_minutes INTEGER,
  customer_satisfaction_score DECIMAL(3,2) CHECK (customer_satisfaction_score >= 0 AND customer_satisfaction_score <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quality Checks Table
CREATE TABLE IF NOT EXISTS quality_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_type TEXT NOT NULL CHECK (check_type IN ('package_audit', 'photo_verification', 'delivery_accuracy', 'data_validation', 'service_review')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  notes TEXT,
  performed_by TEXT,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mystery Shopper Evaluations Table
CREATE TABLE IF NOT EXISTS mystery_shopper_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  evaluation_date DATE NOT NULL,
  location TEXT NOT NULL,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  evaluator TEXT NOT NULL,
  findings JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Continuous Improvement Suggestions Table
CREATE TABLE IF NOT EXISTS improvement_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'implemented', 'rejected')),
  submitted_by TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance Notifications Table
CREATE TABLE IF NOT EXISTS compliance_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('deadline', 'overdue', 'reminder', 'certification', 'audit')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  related_item_id UUID,
  related_item_type TEXT,
  due_date DATE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Settings Table
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  deadline_reminder_days INTEGER DEFAULT 7,
  certification_reminder_days INTEGER DEFAULT 30,
  audit_reminder_days INTEGER DEFAULT 14,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report Schedules Table
CREATE TABLE IF NOT EXISTS report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL CHECK (report_type IN ('compliance', 'quality', 'mystery_shopper', 'continuous_improvement', 'custom')),
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
  recipients TEXT[],
  format TEXT NOT NULL CHECK (format IN ('pdf', 'excel', 'csv')),
  is_active BOOLEAN DEFAULT TRUE,
  last_generated TIMESTAMP WITH TIME ZONE,
  next_generation TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report Executions Table
CREATE TABLE IF NOT EXISTS report_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES report_schedules(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  file_url TEXT,
  file_size INTEGER,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report Templates Table
CREATE TABLE IF NOT EXISTS report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL CHECK (template_type IN ('compliance', 'quality', 'mystery_shopper', 'continuous_improvement')),
  sections TEXT[],
  filters JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_compliance_checklist_category ON compliance_checklist(category);
CREATE INDEX IF NOT EXISTS idx_compliance_checklist_status ON compliance_checklist(status);
CREATE INDEX IF NOT EXISTS idx_compliance_checklist_due_date ON compliance_checklist(due_date);
CREATE INDEX IF NOT EXISTS idx_self_audits_audit_date ON self_audits(audit_date);
CREATE INDEX IF NOT EXISTS idx_corrective_actions_status ON corrective_actions(status);
CREATE INDEX IF NOT EXISTS idx_corrective_actions_due_date ON corrective_actions(due_date);
CREATE INDEX IF NOT EXISTS idx_certifications_status ON certifications(status);
CREATE INDEX IF NOT EXISTS idx_certifications_expiry_date ON certifications(expiry_date);
CREATE INDEX IF NOT EXISTS idx_quality_checks_type ON quality_checks(check_type);
CREATE INDEX IF NOT EXISTS idx_quality_checks_status ON quality_checks(status);
CREATE INDEX IF NOT EXISTS idx_mystery_shopper_status ON mystery_shopper_evaluations(status);
CREATE INDEX IF NOT EXISTS idx_improvement_suggestions_status ON improvement_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_compliance_notifications_type ON compliance_notifications(type);
CREATE INDEX IF NOT EXISTS idx_compliance_notifications_priority ON compliance_notifications(priority);
CREATE INDEX IF NOT EXISTS idx_compliance_notifications_is_read ON compliance_notifications(is_read);

-- Enable Row Level Security (RLS)
ALTER TABLE compliance_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE self_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrective_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mystery_shopper_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvement_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Enable read access for authenticated users" ON compliance_checklist FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON compliance_checklist FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON compliance_checklist FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON self_audits FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON self_audits FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON self_audits FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON corrective_actions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON corrective_actions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON corrective_actions FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON compliance_documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON compliance_documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON compliance_documents FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON certifications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON certifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON certifications FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON compliance_scores FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON compliance_scores FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON compliance_scores FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON regulatory_updates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON regulatory_updates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON regulatory_updates FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON service_quality_metrics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON service_quality_metrics FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON service_quality_metrics FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON quality_checks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON quality_checks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON quality_checks FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON mystery_shopper_evaluations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON mystery_shopper_evaluations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON mystery_shopper_evaluations FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON improvement_suggestions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON improvement_suggestions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON improvement_suggestions FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON compliance_notifications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON compliance_notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON compliance_notifications FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON notification_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON notification_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON notification_settings FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON report_schedules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON report_schedules FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON report_schedules FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON report_executions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON report_executions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON report_executions FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON report_templates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON report_templates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON report_templates FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample data for testing
INSERT INTO compliance_checklist (title, description, category, status, due_date, priority) VALUES
('USPS CMRA Registration', 'Maintain current USPS CMRA registration', 'usps', 'completed', '2025-01-15', 'high'),
('Puerto Rico Business License', 'Ensure valid Puerto Rico business license', 'pr', 'in_progress', '2025-02-28', 'high'),
('Data Security Audit', 'Annual data security and privacy audit', 'security', 'not_started', '2025-03-15', 'medium'),
('Employee Background Checks', 'Complete background checks for all employees', 'security', 'completed', '2025-01-30', 'high'),
('Customer Privacy Policy', 'Update customer privacy policy', 'privacy', 'in_progress', '2025-02-15', 'medium'),
('Facility Security Assessment', 'Conduct annual facility security assessment', 'security', 'not_started', '2025-04-01', 'high');

INSERT INTO service_quality_metrics (overall_score, complaint_resolution_rate, avg_response_time_minutes, customer_satisfaction_score) VALUES
(87, 94, 12, 4.3);

INSERT INTO quality_checks (check_type, status, score, performed_by) VALUES
('package_audit', 'passed', 92, 'John Doe'),
('photo_verification', 'passed', 88, 'Jane Smith'),
('delivery_accuracy', 'passed', 95, 'Mike Johnson'),
('data_validation', 'failed', 75, 'Sarah Wilson'),
('service_review', 'passed', 90, 'Carlos Rodriguez');

INSERT INTO certifications (name, description, issuing_authority, issue_date, expiry_date, status, certificate_number) VALUES
('USPS CMRA License', 'Commercial Mail Receiving Agency License', 'USPS', '2024-01-15', '2025-01-15', 'active', 'CMRA-2024-001'),
('Puerto Rico Business License', 'General Business License', 'Puerto Rico Department of State', '2024-03-01', '2025-03-01', 'active', 'PR-BL-2024-001'),
('ISO 9001:2015', 'Quality Management System Certification', 'ISO', '2023-06-01', '2026-06-01', 'active', 'ISO-9001-2023-001');

INSERT INTO compliance_scores (month, score, category) VALUES
('January 2025', 87, 'overall'),
('February 2025', 89, 'overall'),
('March 2025', 91, 'overall'),
('April 2025', 88, 'overall'),
('May 2025', 92, 'overall');

-- Create notification settings for current user (if authenticated)
INSERT INTO notification_settings (user_id, email_notifications, push_notifications, deadline_reminder_days, certification_reminder_days, audit_reminder_days)
SELECT 
  auth.uid(),
  TRUE,
  TRUE,
  7,
  30,
  14
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- Success message
SELECT 'QA System database setup completed successfully!' as status; 