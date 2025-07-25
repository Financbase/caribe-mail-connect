-- Create backup and disaster recovery tables
CREATE TABLE public.backup_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID,
  backup_type TEXT NOT NULL CHECK (backup_type IN ('database', 'storage', 'configuration', 'full')),
  frequency TEXT NOT NULL CHECK (frequency IN ('hourly', 'daily', 'weekly', 'monthly')),
  retention_days INTEGER NOT NULL DEFAULT 30,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  encryption_enabled BOOLEAN NOT NULL DEFAULT true,
  cross_region_enabled BOOLEAN NOT NULL DEFAULT false,
  target_region TEXT,
  backup_schedule JSONB NOT NULL DEFAULT '{}',
  configuration JSONB NOT NULL DEFAULT '{}',
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.backup_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  configuration_id UUID NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('scheduled', 'manual', 'test')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  backup_size_bytes BIGINT,
  backup_location TEXT,
  backup_hash TEXT,
  encryption_key_id TEXT,
  metadata JSONB DEFAULT '{}',
  error_message TEXT,
  progress_percentage INTEGER DEFAULT 0,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.restore_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_job_id UUID NOT NULL,
  restore_point_name TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  backup_type TEXT NOT NULL,
  data_integrity_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  is_available BOOLEAN NOT NULL DEFAULT true,
  size_bytes BIGINT,
  location_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.disaster_recovery_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_name TEXT NOT NULL,
  location_id UUID,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('full_restore', 'partial_restore', 'failover', 'data_sync')),
  priority_level TEXT NOT NULL DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
  recovery_time_objective INTEGER, -- RTO in minutes
  recovery_point_objective INTEGER, -- RPO in minutes
  automated_execution BOOLEAN DEFAULT false,
  plan_steps JSONB NOT NULL DEFAULT '[]',
  emergency_contacts JSONB DEFAULT '[]',
  status_page_integration JSONB DEFAULT '{}',
  last_tested_at TIMESTAMP WITH TIME ZONE,
  test_results JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.recovery_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL,
  restore_point_id UUID,
  execution_type TEXT NOT NULL CHECK (execution_type IN ('test', 'actual', 'drill')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  actual_rto INTEGER, -- Actual recovery time in minutes
  success_percentage NUMERIC(5,2),
  execution_log JSONB DEFAULT '[]',
  issues_encountered JSONB DEFAULT '[]',
  lessons_learned TEXT,
  executed_by UUID,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.backup_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_job_id UUID,
  restore_point_id UUID,
  action TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('backup', 'restore', 'delete', 'verify', 'access')),
  user_id UUID,
  user_email TEXT,
  ip_address INET,
  user_agent TEXT,
  details JSONB DEFAULT '{}',
  compliance_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.compliance_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_name TEXT NOT NULL,
  policy_type TEXT NOT NULL CHECK (policy_type IN ('retention', 'encryption', 'access_control', 'data_sovereignty', 'audit_trail')),
  location_id UUID,
  policy_rules JSONB NOT NULL DEFAULT '{}',
  retention_period_days INTEGER,
  geographic_restrictions JSONB DEFAULT '[]',
  encryption_requirements JSONB DEFAULT '{}',
  audit_requirements JSONB DEFAULT '{}',
  is_mandatory BOOLEAN NOT NULL DEFAULT false,
  compliance_framework TEXT, -- GDPR, HIPAA, SOX, etc.
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_backup_configurations_location ON backup_configurations(location_id);
CREATE INDEX idx_backup_configurations_type ON backup_configurations(backup_type);
CREATE INDEX idx_backup_jobs_configuration ON backup_jobs(configuration_id);
CREATE INDEX idx_backup_jobs_status ON backup_jobs(status);
CREATE INDEX idx_backup_jobs_created_at ON backup_jobs(created_at DESC);
CREATE INDEX idx_restore_points_backup_job ON restore_points(backup_job_id);
CREATE INDEX idx_restore_points_timestamp ON restore_points(timestamp DESC);
CREATE INDEX idx_disaster_recovery_plans_location ON disaster_recovery_plans(location_id);
CREATE INDEX idx_recovery_executions_plan ON recovery_executions(plan_id);
CREATE INDEX idx_recovery_executions_started_at ON recovery_executions(started_at DESC);
CREATE INDEX idx_backup_audit_logs_created_at ON backup_audit_logs(created_at DESC);
CREATE INDEX idx_backup_audit_logs_user ON backup_audit_logs(user_id);
CREATE INDEX idx_compliance_policies_location ON compliance_policies(location_id);

-- Enable RLS
ALTER TABLE public.backup_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restore_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disaster_recovery_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_policies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins and managers can manage backup configurations" 
ON public.backup_configurations 
FOR ALL 
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Staff can view backup configurations" 
ON public.backup_configurations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and managers can manage backup jobs" 
ON public.backup_jobs 
FOR ALL 
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Staff can view backup jobs" 
ON public.backup_jobs 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and managers can manage restore points" 
ON public.restore_points 
FOR ALL 
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Staff can view restore points" 
ON public.restore_points 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and managers can manage disaster recovery plans" 
ON public.disaster_recovery_plans 
FOR ALL 
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Staff can view disaster recovery plans" 
ON public.disaster_recovery_plans 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and managers can manage recovery executions" 
ON public.recovery_executions 
FOR ALL 
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Staff can view recovery executions" 
ON public.recovery_executions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view audit logs" 
ON public.backup_audit_logs 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can create audit logs" 
ON public.backup_audit_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage compliance policies" 
ON public.compliance_policies 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view compliance policies" 
ON public.compliance_policies 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at
CREATE TRIGGER update_backup_configurations_updated_at
  BEFORE UPDATE ON public.backup_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_disaster_recovery_plans_updated_at
  BEFORE UPDATE ON public.disaster_recovery_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_policies_updated_at
  BEFORE UPDATE ON public.compliance_policies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create database functions for backup operations
CREATE OR REPLACE FUNCTION public.schedule_backup(
  p_configuration_id UUID,
  p_job_type TEXT DEFAULT 'scheduled'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_job_id UUID;
BEGIN
  INSERT INTO public.backup_jobs (
    configuration_id,
    job_type,
    status,
    created_by
  ) VALUES (
    p_configuration_id,
    p_job_type,
    'pending',
    auth.uid()
  ) RETURNING id INTO new_job_id;
  
  RETURN new_job_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_backup_status(p_location_id UUID DEFAULT NULL)
RETURNS TABLE(
  total_backups BIGINT,
  successful_backups BIGINT,
  failed_backups BIGINT,
  total_size_gb NUMERIC,
  oldest_backup DATE,
  latest_backup DATE
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*) as total_backups,
    COUNT(CASE WHEN bj.status = 'completed' THEN 1 END) as successful_backups,
    COUNT(CASE WHEN bj.status = 'failed' THEN 1 END) as failed_backups,
    ROUND(COALESCE(SUM(bj.backup_size_bytes), 0) / 1073741824.0, 2) as total_size_gb,
    MIN(bj.created_at::date) as oldest_backup,
    MAX(bj.created_at::date) as latest_backup
  FROM public.backup_jobs bj
  LEFT JOIN public.backup_configurations bc ON bj.configuration_id = bc.id
  WHERE (p_location_id IS NULL OR bc.location_id = p_location_id);
$$;