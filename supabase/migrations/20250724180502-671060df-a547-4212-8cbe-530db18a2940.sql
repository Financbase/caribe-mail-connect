-- Compliance audit log for tracking all compliance-related activities
CREATE TABLE public.compliance_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'verify', 'approve', 'reject')),
  performed_by UUID, -- will link to users table when auth is implemented
  performed_by_name TEXT,
  changes JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for security
ALTER TABLE public.compliance_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policies for audit log
CREATE POLICY "Staff can view audit log" 
ON public.compliance_audit_log 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create audit entries" 
ON public.compliance_audit_log 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create performance indexes
CREATE INDEX idx_audit_log_record ON public.compliance_audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_created ON public.compliance_audit_log(created_at);