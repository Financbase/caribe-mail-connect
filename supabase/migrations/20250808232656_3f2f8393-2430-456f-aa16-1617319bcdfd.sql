-- SECURITY HARDENING MIGRATION (RLS + FUNCTIONS)

-- 1) api_keys: Restrict SELECT to managers/admins only
DROP POLICY IF EXISTS "Staff can view API keys" ON public.api_keys;
CREATE POLICY "Managers can view API keys"
ON public.api_keys
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 2) backup_configurations: Limit SELECT to staff/manager/admin (remove broad auth access)
DROP POLICY IF EXISTS "Staff can view backup configurations" ON public.backup_configurations;
CREATE POLICY "Staff can view backup configurations"
ON public.backup_configurations
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 3) backup_audit_logs: Restrict INSERT to staff/manager/admin (remove permissive true)
DROP POLICY IF EXISTS "System can create audit logs" ON public.backup_audit_logs;
CREATE POLICY "Staff can create audit logs"
ON public.backup_audit_logs
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 4) Recreate SECURITY DEFINER functions with explicit search_path and schema qualification

-- 4.1 generate_api_key
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  api_key TEXT;
BEGIN
  api_key := 'prmcms_' || encode(public.gen_random_bytes(24), 'base64');
  api_key := replace(api_key, '/', '_');
  api_key := replace(api_key, '+', '-');
  RETURN api_key;
END;
$function$;

-- 4.2 validate_api_key
CREATE OR REPLACE FUNCTION public.validate_api_key(key text)
RETURNS TABLE(is_valid boolean, location_id uuid, permissions jsonb, rate_limit_per_minute integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    (ak.is_active AND (ak.expires_at IS NULL OR ak.expires_at > now())),
    ak.location_id,
    ak.permissions,
    ak.rate_limit_per_minute
  FROM public.api_keys ak
  WHERE ak.api_key = key;
END;
$function$;

-- 4.3 schedule_backup
CREATE OR REPLACE FUNCTION public.schedule_backup(p_configuration_id uuid, p_job_type text DEFAULT 'scheduled'::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
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
$function$;

-- 4.4 calculate_virtual_mailbox_usage
CREATE OR REPLACE FUNCTION public.calculate_virtual_mailbox_usage(p_customer_id uuid, p_start_date timestamp with time zone, p_end_date timestamp with time zone)
RETURNS TABLE(total_actions integer, total_cost numeric, scan_actions integer, forward_actions integer, shred_actions integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_actions,
    COALESCE(SUM(ma.cost_amount), 0)::DECIMAL(10,2) as total_cost,
    COUNT(CASE WHEN ma.action_type = 'scan' THEN 1 END)::INTEGER as scan_actions,
    COUNT(CASE WHEN ma.action_type = 'forward' THEN 1 END)::INTEGER as forward_actions,
    COUNT(CASE WHEN ma.action_type = 'shred' THEN 1 END)::INTEGER as shred_actions
  FROM public.mail_actions ma
  JOIN public.mail_pieces mp ON ma.mail_piece_id = mp.id
  JOIN public.virtual_mailboxes vm ON mp.virtual_mailbox_id = vm.id
  WHERE vm.customer_id = p_customer_id
    AND ma.created_at >= p_start_date
    AND ma.created_at <= p_end_date;
END;
$function$;

-- 4.5 get_backup_status
CREATE OR REPLACE FUNCTION public.get_backup_status(p_location_id uuid DEFAULT NULL::uuid)
RETURNS TABLE(total_backups bigint, successful_backups bigint, failed_backups bigint, total_size_gb numeric, oldest_backup date, latest_backup date)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
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
$function$;

-- 4.6 audit_trigger_function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    INSERT INTO public.audit_logs (
        table_name,
        record_id,
        action,
        user_id,
        old_data,
        new_data,
        ip_address,
        user_agent
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        auth.uid(),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent'
    );
    RETURN COALESCE(NEW, OLD);
END;
$function$;
