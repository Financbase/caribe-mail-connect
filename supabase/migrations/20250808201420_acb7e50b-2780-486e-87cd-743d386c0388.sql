-- SECURITY POLICY IDEMPOTENT PATCH
-- Ensure policies exist with correct definitions without failing if already present

-- 1) audit_logs view policy
DROP POLICY IF EXISTS "Only admins and managers can view audit logs" ON public.audit_logs;
CREATE POLICY "Only admins and managers can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager')
);

-- 2) backup_audit_logs select policy
DROP POLICY IF EXISTS "Staff can view backup audit logs" ON public.backup_audit_logs;
CREATE POLICY "Staff can view backup audit logs"
ON public.backup_audit_logs
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 3) customers self-view policy
DROP POLICY IF EXISTS "Customers can view their own profile" ON public.customers;
CREATE POLICY "Customers can view their own profile"
ON public.customers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());