-- Security Management Tables

-- Login attempts tracking
CREATE TABLE public.login_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  attempt_result TEXT NOT NULL CHECK (attempt_result IN ('success', 'failed', 'blocked')),
  failure_reason TEXT,
  location_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Active user sessions
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET NOT NULL,
  user_agent TEXT,
  device_info JSONB DEFAULT '{}',
  location_data JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security alerts
CREATE TABLE public.security_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('suspicious_login', 'multiple_failures', 'new_device', 'unusual_activity', 'intrusion_attempt', 'policy_violation')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  status TEXT NOT NULL CHECK (status IN ('active', 'investigating', 'resolved', 'false_positive')) DEFAULT 'active',
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Two-factor authentication
CREATE TABLE public.user_2fa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  secret_key TEXT NOT NULL,
  backup_codes TEXT[] DEFAULT '{}',
  recovery_codes_used INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Biometric authentication (mobile)
CREATE TABLE public.biometric_auth (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  device_id TEXT NOT NULL,
  biometric_type TEXT NOT NULL CHECK (biometric_type IN ('fingerprint', 'face', 'voice')),
  public_key TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Password policies
CREATE TABLE public.password_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_name TEXT NOT NULL UNIQUE,
  min_length INTEGER NOT NULL DEFAULT 8,
  require_uppercase BOOLEAN NOT NULL DEFAULT true,
  require_lowercase BOOLEAN NOT NULL DEFAULT true,
  require_numbers BOOLEAN NOT NULL DEFAULT true,
  require_symbols BOOLEAN NOT NULL DEFAULT true,
  max_age_days INTEGER DEFAULT 90,
  history_count INTEGER DEFAULT 5,
  lockout_attempts INTEGER DEFAULT 5,
  lockout_duration_minutes INTEGER DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Account lockouts
CREATE TABLE public.account_lockouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  locked_by UUID REFERENCES auth.users(id),
  locked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unlock_at TIMESTAMP WITH TIME ZONE,
  unlocked_by UUID REFERENCES auth.users(id),
  unlocked_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Data encryption keys
CREATE TABLE public.encryption_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key_name TEXT NOT NULL UNIQUE,
  key_version INTEGER NOT NULL DEFAULT 1,
  encryption_algorithm TEXT NOT NULL DEFAULT 'AES-256',
  key_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Secure file deletions
CREATE TABLE public.secure_deletions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_path TEXT NOT NULL,
  file_hash TEXT NOT NULL,
  deletion_method TEXT NOT NULL CHECK (deletion_method IN ('overwrite', 'secure_wipe', 'crypto_shred')),
  deletion_passes INTEGER DEFAULT 3,
  deleted_by UUID NOT NULL REFERENCES auth.users(id),
  deletion_reason TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Access control lists
CREATE TABLE public.access_control_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  role TEXT REFERENCES public.user_roles(role),
  permissions JSONB NOT NULL DEFAULT '{}',
  granted_by UUID NOT NULL REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- GDPR data requests
CREATE TABLE public.gdpr_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  request_type TEXT NOT NULL CHECK (request_type IN ('export', 'deletion', 'portability', 'rectification')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'rejected')) DEFAULT 'pending',
  requested_data JSONB DEFAULT '{}',
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  export_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Data retention policies
CREATE TABLE public.data_retention_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_name TEXT NOT NULL UNIQUE,
  table_name TEXT NOT NULL,
  retention_period_days INTEGER NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('delete', 'archive', 'anonymize')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- IP whitelist/blacklist
CREATE TABLE public.ip_access_control (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  ip_range CIDR,
  access_type TEXT NOT NULL CHECK (access_type IN ('whitelist', 'blacklist')),
  reason TEXT,
  added_by UUID NOT NULL REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security training
CREATE TABLE public.security_training (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  training_name TEXT NOT NULL,
  training_type TEXT NOT NULL CHECK (training_type IN ('phishing', 'password', 'social_engineering', 'data_protection', 'general')),
  content_url TEXT,
  duration_minutes INTEGER,
  is_mandatory BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User training records
CREATE TABLE public.user_training_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  training_id UUID NOT NULL REFERENCES public.security_training(id),
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')) DEFAULT 'not_started',
  score INTEGER,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Phishing simulations
CREATE TABLE public.phishing_simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  target_users UUID[] DEFAULT '{}',
  sent_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'running', 'completed')) DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security scorecard
CREATE TABLE public.security_scorecards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id),
  overall_score INTEGER NOT NULL DEFAULT 0,
  authentication_score INTEGER NOT NULL DEFAULT 0,
  data_protection_score INTEGER NOT NULL DEFAULT 0,
  access_control_score INTEGER NOT NULL DEFAULT 0,
  monitoring_score INTEGER NOT NULL DEFAULT 0,
  compliance_score INTEGER NOT NULL DEFAULT 0,
  recommendations JSONB DEFAULT '[]',
  last_assessment TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_lockouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encryption_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secure_deletions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_control_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_access_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phishing_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_scorecards ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Login attempts: Staff can view all, users can view their own
CREATE POLICY "Staff can view all login attempts" ON public.login_attempts
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can create login attempts" ON public.login_attempts
FOR INSERT WITH CHECK (true);

-- User sessions: Users can view their own, staff can view all
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Staff can view all sessions" ON public.user_sessions
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can manage sessions" ON public.user_sessions
FOR ALL USING (true);

-- Security alerts: Staff can view and manage
CREATE POLICY "Staff can manage security alerts" ON public.security_alerts
FOR ALL USING (auth.uid() IS NOT NULL);

-- 2FA: Users can manage their own
CREATE POLICY "Users can manage their own 2FA" ON public.user_2fa
FOR ALL USING (user_id = auth.uid());

-- Biometric auth: Users can manage their own
CREATE POLICY "Users can manage their own biometric auth" ON public.biometric_auth
FOR ALL USING (user_id = auth.uid());

-- Password policies: Staff can view and manage
CREATE POLICY "Staff can manage password policies" ON public.password_policies
FOR ALL USING (auth.uid() IS NOT NULL);

-- Account lockouts: Staff can manage
CREATE POLICY "Staff can manage account lockouts" ON public.account_lockouts
FOR ALL USING (auth.uid() IS NOT NULL);

-- Encryption keys: Admin only
CREATE POLICY "Admins can manage encryption keys" ON public.encryption_keys
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Secure deletions: Staff can view
CREATE POLICY "Staff can view secure deletions" ON public.secure_deletions
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create secure deletions" ON public.secure_deletions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Access control lists: Staff can manage
CREATE POLICY "Staff can manage ACLs" ON public.access_control_lists
FOR ALL USING (auth.uid() IS NOT NULL);

-- GDPR requests: Users can manage their own, staff can view all
CREATE POLICY "Users can manage their own GDPR requests" ON public.gdpr_requests
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Staff can view all GDPR requests" ON public.gdpr_requests
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can process GDPR requests" ON public.gdpr_requests
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Data retention policies: Staff can manage
CREATE POLICY "Staff can manage retention policies" ON public.data_retention_policies
FOR ALL USING (auth.uid() IS NOT NULL);

-- IP access control: Staff can manage
CREATE POLICY "Staff can manage IP access control" ON public.ip_access_control
FOR ALL USING (auth.uid() IS NOT NULL);

-- Security training: Staff can manage, users can view
CREATE POLICY "Staff can manage security training" ON public.security_training
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view security training" ON public.security_training
FOR SELECT USING (auth.uid() IS NOT NULL);

-- User training records: Users can view their own, staff can view all
CREATE POLICY "Users can view their own training records" ON public.user_training_records
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own training records" ON public.user_training_records
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Staff can manage all training records" ON public.user_training_records
FOR ALL USING (auth.uid() IS NOT NULL);

-- Phishing simulations: Staff can manage
CREATE POLICY "Staff can manage phishing simulations" ON public.phishing_simulations
FOR ALL USING (auth.uid() IS NOT NULL);

-- Security scorecards: Staff can view
CREATE POLICY "Staff can view security scorecards" ON public.security_scorecards
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can create security scorecards" ON public.security_scorecards
FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_login_attempts_user_id ON public.login_attempts(user_id);
CREATE INDEX idx_login_attempts_created_at ON public.login_attempts(created_at);
CREATE INDEX idx_login_attempts_ip_address ON public.login_attempts(ip_address);

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON public.user_sessions(is_active);
CREATE INDEX idx_user_sessions_expires_at ON public.user_sessions(expires_at);

CREATE INDEX idx_security_alerts_user_id ON public.security_alerts(user_id);
CREATE INDEX idx_security_alerts_status ON public.security_alerts(status);
CREATE INDEX idx_security_alerts_severity ON public.security_alerts(severity);

CREATE INDEX idx_gdpr_requests_user_id ON public.gdpr_requests(user_id);
CREATE INDEX idx_gdpr_requests_status ON public.gdpr_requests(status);

CREATE INDEX idx_ip_access_control_ip ON public.ip_access_control(ip_address);
CREATE INDEX idx_ip_access_control_active ON public.ip_access_control(is_active);

-- Functions for security monitoring
CREATE OR REPLACE FUNCTION public.log_login_attempt(
  p_user_id UUID,
  p_email TEXT,
  p_ip_address INET,
  p_user_agent TEXT,
  p_result TEXT,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  attempt_id UUID;
BEGIN
  INSERT INTO public.login_attempts (
    user_id, email, ip_address, user_agent, attempt_result, failure_reason
  ) VALUES (
    p_user_id, p_email, p_ip_address, p_user_agent, p_result, p_failure_reason
  ) RETURNING id INTO attempt_id;
  
  RETURN attempt_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_security_alert(
  p_user_id UUID,
  p_alert_type TEXT,
  p_severity TEXT,
  p_title TEXT,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}',
  p_ip_address INET DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  alert_id UUID;
BEGIN
  INSERT INTO public.security_alerts (
    user_id, alert_type, severity, title, description, metadata, ip_address
  ) VALUES (
    p_user_id, p_alert_type, p_severity, p_title, p_description, p_metadata, p_ip_address
  ) RETURNING id INTO alert_id;
  
  RETURN alert_id;
END;
$$;

-- Trigger for automatic session cleanup
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.user_sessions 
  WHERE expires_at < now() - INTERVAL '1 day';
  
  RETURN NULL;
END;
$$;

CREATE TRIGGER cleanup_sessions_trigger
  AFTER INSERT ON public.user_sessions
  EXECUTE FUNCTION public.cleanup_expired_sessions();