-- Create QA and testing framework tables

-- System health metrics
CREATE TABLE public.system_health_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id),
  metric_type TEXT NOT NULL, -- 'cpu', 'memory', 'disk', 'network', 'database'
  metric_value DECIMAL(10,2) NOT NULL,
  threshold_warning DECIMAL(10,2),
  threshold_critical DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'normal', -- 'normal', 'warning', 'critical'
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Failed processes tracking
CREATE TABLE public.failed_processes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id),
  process_name TEXT NOT NULL,
  process_type TEXT NOT NULL, -- 'package_intake', 'notification', 'billing', 'integration'
  error_message TEXT,
  error_details JSONB DEFAULT '{}',
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'closed'
  failed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User error reports
CREATE TABLE public.user_error_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  location_id UUID REFERENCES public.locations(id),
  error_type TEXT NOT NULL, -- 'ui_error', 'functionality_error', 'performance_issue', 'data_error'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  steps_to_reproduce TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT,
  browser_info JSONB DEFAULT '{}',
  screenshot_urls TEXT[],
  video_url TEXT,
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'triaged', 'in_progress', 'resolved', 'closed'
  assigned_to UUID,
  resolution_notes TEXT,
  reported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance metrics
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id),
  metric_type TEXT NOT NULL, -- 'page_load', 'api_response', 'db_query', 'memory_usage'
  endpoint_or_page TEXT,
  response_time_ms INTEGER,
  memory_usage_mb DECIMAL(10,2),
  error_rate DECIMAL(5,2), -- percentage
  throughput_per_second DECIMAL(10,2),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Automated test runs
CREATE TABLE public.automated_test_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id),
  test_suite_name TEXT NOT NULL,
  test_type TEXT NOT NULL, -- 'data_validation', 'workflow', 'api_monitoring', 'db_integrity'
  total_tests INTEGER NOT NULL DEFAULT 0,
  passed_tests INTEGER NOT NULL DEFAULT 0,
  failed_tests INTEGER NOT NULL DEFAULT 0,
  skipped_tests INTEGER NOT NULL DEFAULT 0,
  execution_time_ms INTEGER,
  test_results JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'completed', 'failed', 'cancelled'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Test cases management
CREATE TABLE public.test_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id),
  title TEXT NOT NULL,
  description TEXT,
  test_type TEXT NOT NULL, -- 'manual', 'automated', 'integration', 'performance'
  category TEXT NOT NULL, -- 'functionality', 'ui', 'api', 'database', 'security'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  preconditions TEXT,
  test_steps JSONB DEFAULT '[]', -- Array of test steps
  expected_results TEXT,
  automation_script TEXT,
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'deprecated', 'draft'
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Test executions
CREATE TABLE public.test_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_case_id UUID NOT NULL REFERENCES public.test_cases(id),
  test_run_id UUID REFERENCES public.automated_test_runs(id),
  executed_by UUID,
  execution_type TEXT NOT NULL, -- 'manual', 'automated'
  status TEXT NOT NULL, -- 'passed', 'failed', 'skipped', 'blocked'
  actual_results TEXT,
  failure_reason TEXT,
  screenshots TEXT[],
  execution_time_ms INTEGER,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User feedback
CREATE TABLE public.user_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  location_id UUID REFERENCES public.locations(id),
  feedback_type TEXT NOT NULL, -- 'bug_report', 'feature_request', 'improvement', 'compliment', 'complaint'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT, -- 'ui_ux', 'performance', 'functionality', 'content', 'other'
  severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  page_url TEXT,
  browser_info JSONB DEFAULT '{}',
  screenshot_urls TEXT[],
  priority_score INTEGER DEFAULT 0, -- Calculated priority score
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'reviewed', 'in_progress', 'completed', 'rejected'
  assigned_to UUID,
  response TEXT,
  satisfaction_rating INTEGER, -- 1-5 rating after resolution
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- QA checklists
CREATE TABLE public.qa_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id),
  name TEXT NOT NULL,
  description TEXT,
  checklist_type TEXT NOT NULL, -- 'deployment', 'feature_release', 'daily_checks', 'security_audit'
  checklist_items JSONB NOT NULL DEFAULT '[]', -- Array of checklist items with status
  is_template BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- QA checklist executions
CREATE TABLE public.qa_checklist_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checklist_id UUID NOT NULL REFERENCES public.qa_checklists(id),
  executed_by UUID,
  execution_notes TEXT,
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Daily health reports
CREATE TABLE public.daily_health_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id),
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  overall_health_score DECIMAL(5,2) NOT NULL DEFAULT 0, -- 0-100 score
  system_uptime_percentage DECIMAL(5,2),
  error_count INTEGER DEFAULT 0,
  performance_score DECIMAL(5,2),
  user_satisfaction_score DECIMAL(5,2),
  critical_issues_count INTEGER DEFAULT 0,
  warnings_count INTEGER DEFAULT 0,
  tests_passed_percentage DECIMAL(5,2),
  anomalies_detected JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  report_data JSONB DEFAULT '{}', -- Detailed metrics
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.system_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_error_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automated_test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_checklist_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_health_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- System health metrics
CREATE POLICY "Staff can view system health metrics" ON public.system_health_metrics FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "System can create health metrics" ON public.system_health_metrics FOR INSERT WITH CHECK (true);

-- Failed processes
CREATE POLICY "Staff can manage failed processes" ON public.failed_processes FOR ALL USING (auth.uid() IS NOT NULL);

-- User error reports
CREATE POLICY "Users can create error reports" ON public.user_error_reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage error reports" ON public.user_error_reports FOR ALL USING (auth.uid() IS NOT NULL);

-- Performance metrics
CREATE POLICY "Staff can view performance metrics" ON public.performance_metrics FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "System can create performance metrics" ON public.performance_metrics FOR INSERT WITH CHECK (true);

-- Automated test runs
CREATE POLICY "Staff can manage test runs" ON public.automated_test_runs FOR ALL USING (auth.uid() IS NOT NULL);

-- Test cases
CREATE POLICY "Staff can manage test cases" ON public.test_cases FOR ALL USING (auth.uid() IS NOT NULL);

-- Test executions
CREATE POLICY "Staff can manage test executions" ON public.test_executions FOR ALL USING (auth.uid() IS NOT NULL);

-- User feedback
CREATE POLICY "Users can create feedback" ON public.user_feedback FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view their feedback" ON public.user_feedback FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Staff can manage all feedback" ON public.user_feedback FOR ALL USING (auth.uid() IS NOT NULL);

-- QA checklists
CREATE POLICY "Staff can manage QA checklists" ON public.qa_checklists FOR ALL USING (auth.uid() IS NOT NULL);

-- QA checklist executions
CREATE POLICY "Staff can manage checklist executions" ON public.qa_checklist_executions FOR ALL USING (auth.uid() IS NOT NULL);

-- Daily health reports
CREATE POLICY "Staff can view health reports" ON public.daily_health_reports FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "System can create health reports" ON public.daily_health_reports FOR INSERT WITH CHECK (true);

-- Create updated_at triggers
CREATE TRIGGER update_failed_processes_updated_at BEFORE UPDATE ON public.failed_processes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_error_reports_updated_at BEFORE UPDATE ON public.user_error_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_test_cases_updated_at BEFORE UPDATE ON public.test_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_feedback_updated_at BEFORE UPDATE ON public.user_feedback FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_qa_checklists_updated_at BEFORE UPDATE ON public.qa_checklists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_system_health_metrics_location_type ON public.system_health_metrics(location_id, metric_type);
CREATE INDEX idx_system_health_metrics_recorded_at ON public.system_health_metrics(recorded_at);
CREATE INDEX idx_failed_processes_location_status ON public.failed_processes(location_id, status);
CREATE INDEX idx_failed_processes_failed_at ON public.failed_processes(failed_at);
CREATE INDEX idx_user_error_reports_status ON public.user_error_reports(status);
CREATE INDEX idx_user_error_reports_reported_at ON public.user_error_reports(reported_at);
CREATE INDEX idx_performance_metrics_location_type ON public.performance_metrics(location_id, metric_type);
CREATE INDEX idx_performance_metrics_recorded_at ON public.performance_metrics(recorded_at);
CREATE INDEX idx_test_runs_location_status ON public.automated_test_runs(location_id, status);
CREATE INDEX idx_test_runs_started_at ON public.automated_test_runs(started_at);
CREATE INDEX idx_user_feedback_status ON public.user_feedback(status);
CREATE INDEX idx_user_feedback_type ON public.user_feedback(feedback_type);
CREATE INDEX idx_daily_health_reports_date ON public.daily_health_reports(report_date);
CREATE INDEX idx_daily_health_reports_location ON public.daily_health_reports(location_id, report_date);