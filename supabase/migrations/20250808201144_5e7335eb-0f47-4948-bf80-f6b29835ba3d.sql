-- SECURITY HARDENING MIGRATION

-- 1) Fix role escalation in handle_new_user: always assign 'customer'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Create profile with full_name
  INSERT INTO public.profiles (
    user_id, 
    first_name, 
    last_name, 
    full_name,
    preferred_language
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    CONCAT(
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''), 
      ' ', 
      COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    ),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  );
  
  -- Assign default role only (no email-based escalation)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$function$;

-- 2) Tighten audit_logs visibility
DROP POLICY IF EXISTS "Authenticated users can view audit logs" ON public.audit_logs;
CREATE POLICY "Only admins and managers can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager')
);

-- 3) Restrict ACL management to admins/managers
DROP POLICY IF EXISTS "Staff can manage ACLs" ON public.access_control_lists;
CREATE POLICY "Admins or managers can manage ACLs"
ON public.access_control_lists
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager')
);

-- 4) Account balances: limit to staff/manager/admin
DROP POLICY IF EXISTS "Staff can manage account balances" ON public.account_balances;
DROP POLICY IF EXISTS "Staff can view account balances" ON public.account_balances;
CREATE POLICY "Staff can manage account balances"
ON public.account_balances
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can view account balances"
ON public.account_balances
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 5) Act 60 compliance: restrict to staff/manager/admin
DROP POLICY IF EXISTS "Staff can create Act 60 compliance" ON public.act_60_compliance;
DROP POLICY IF EXISTS "Staff can update Act 60 compliance" ON public.act_60_compliance;
DROP POLICY IF EXISTS "Staff can view Act 60 compliance" ON public.act_60_compliance;
CREATE POLICY "Staff can create Act 60 compliance"
ON public.act_60_compliance
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can update Act 60 compliance"
ON public.act_60_compliance
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can view Act 60 compliance"
ON public.act_60_compliance
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 6) Automated test runs: restrict to staff/manager/admin
DROP POLICY IF EXISTS "Staff can manage test runs" ON public.automated_test_runs;
CREATE POLICY "Staff can manage test runs"
ON public.automated_test_runs
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 7) Backup audit logs: restrict SELECT to staff/manager/admin
DROP POLICY IF EXISTS "Staff can view audit logs" ON public.backup_audit_logs;
CREATE POLICY "Staff can view backup audit logs"
ON public.backup_audit_logs
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
-- Keep system insert policy as-is

-- 8) Backup jobs: restrict SELECT to staff/manager/admin
DROP POLICY IF EXISTS "Staff can view backup jobs" ON public.backup_jobs;
CREATE POLICY "Staff can view backup jobs"
ON public.backup_jobs
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 9) Billing runs: restrict manage/view to staff/manager/admin
DROP POLICY IF EXISTS "Staff can manage billing runs" ON public.billing_runs;
DROP POLICY IF EXISTS "Staff can view billing runs" ON public.billing_runs;
CREATE POLICY "Staff can manage billing runs"
ON public.billing_runs
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can view billing runs"
ON public.billing_runs
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 10) Check deposits: restrict manage to staff/manager/admin (keep customer view)
DROP POLICY IF EXISTS "Staff can manage check deposits" ON public.check_deposits;
CREATE POLICY "Staff can manage check deposits"
ON public.check_deposits
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 11) Compliance audit log: restrict to staff/manager/admin
DROP POLICY IF EXISTS "Staff can create audit entries" ON public.compliance_audit_log;
DROP POLICY IF EXISTS "Staff can view audit log" ON public.compliance_audit_log;
CREATE POLICY "Staff can create audit entries"
ON public.compliance_audit_log
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can view audit log"
ON public.compliance_audit_log
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 12) Customer compliance: restrict to staff/manager/admin
DROP POLICY IF EXISTS "Staff can create compliance" ON public.customer_compliance;
DROP POLICY IF EXISTS "Staff can update compliance" ON public.customer_compliance;
DROP POLICY IF EXISTS "Staff can view all compliance" ON public.customer_compliance;
CREATE POLICY "Staff can create compliance"
ON public.customer_compliance
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can update compliance"
ON public.customer_compliance
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can view all compliance"
ON public.customer_compliance
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 13) Customers: lock down to staff for general access; allow customers to read their own row
DROP POLICY IF EXISTS "Staff can create customers" ON public.customers;
DROP POLICY IF EXISTS "Staff can delete customers" ON public.customers;
DROP POLICY IF EXISTS "Staff can update customers" ON public.customers;
DROP POLICY IF EXISTS "Staff can view all customers" ON public.customers;
CREATE POLICY "Staff can create customers"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can update customers"
ON public.customers
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can delete customers"
ON public.customers
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can view all customers"
ON public.customers
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Customers can view their own profile"
ON public.customers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 14) Deliveries: restrict to staff/manager/admin
DROP POLICY IF EXISTS "Staff can create deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Staff can update deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Staff can view all deliveries" ON public.deliveries;
CREATE POLICY "Staff can create deliveries"
ON public.deliveries
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can update deliveries"
ON public.deliveries
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can view all deliveries"
ON public.deliveries
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 15) Delivery attempts: restrict to staff/manager/admin
DROP POLICY IF EXISTS "Staff can create delivery attempts" ON public.delivery_attempts;
DROP POLICY IF EXISTS "Staff can view delivery attempts" ON public.delivery_attempts;
CREATE POLICY "Staff can create delivery attempts"
ON public.delivery_attempts
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can view delivery attempts"
ON public.delivery_attempts
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- 16) Delivery routes: restrict staff policies to staff/manager/admin; keep driver policy
DROP POLICY IF EXISTS "Staff can create routes" ON public.delivery_routes;
DROP POLICY IF EXISTS "Staff can update routes" ON public.delivery_routes;
DROP POLICY IF EXISTS "Staff can view all routes" ON public.delivery_routes;
CREATE POLICY "Staff can create routes"
ON public.delivery_routes
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can update routes"
ON public.delivery_routes
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Staff can view all routes"
ON public.delivery_routes
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')
);

-- Note: Existing driver-specific policy remains unchanged.