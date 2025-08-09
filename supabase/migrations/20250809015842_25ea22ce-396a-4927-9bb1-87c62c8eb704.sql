-- 1) Lock down public-readable tables by removing public SELECT policies
DROP POLICY IF EXISTS "Public can view carbon_footprint" ON public.carbon_footprint;
DROP POLICY IF EXISTS "Public can view carbon_offset_programs" ON public.carbon_offset_programs;
DROP POLICY IF EXISTS "Public can view customer_participation" ON public.customer_participation;

-- 2) Restrict EXECUTE on SECURITY DEFINER functions: revoke from public, grant to authenticated + service_role
-- Be defensive: use IF EXISTS and correct signatures
REVOKE ALL ON FUNCTION public.validate_api_key(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_api_key(text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.audit_trigger_function() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.audit_trigger_function() TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.schedule_backup(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.schedule_backup(uuid, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.calculate_virtual_mailbox_usage(uuid, timestamptz, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.calculate_virtual_mailbox_usage(uuid, timestamptz, timestamptz) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_backup_status(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_backup_status(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_current_user_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.has_role(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO authenticated, service_role;

-- 3) Optional hardening: prevent anonymous use of test_input_validation()
REVOKE ALL ON FUNCTION public.test_input_validation() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.test_input_validation() TO authenticated, service_role;

-- Note: Trigger functions are invoked by triggers and do not need public execution (already revoked above where applicable)
