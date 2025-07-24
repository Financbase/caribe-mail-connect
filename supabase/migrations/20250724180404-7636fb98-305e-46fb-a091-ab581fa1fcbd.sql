-- Add audit trail columns to compliance tables
ALTER TABLE public.compliance_reports ADD COLUMN created_by UUID;
ALTER TABLE public.compliance_reports ADD COLUMN updated_by UUID;

ALTER TABLE public.ps_form_1583 ADD COLUMN created_by UUID;
ALTER TABLE public.ps_form_1583 ADD COLUMN updated_by UUID;

ALTER TABLE public.id_verifications ADD COLUMN created_by UUID;
ALTER TABLE public.id_verifications ADD COLUMN updated_by UUID;

ALTER TABLE public.customer_compliance ADD COLUMN created_by UUID;
ALTER TABLE public.customer_compliance ADD COLUMN updated_by UUID;

ALTER TABLE public.customers ADD COLUMN created_by UUID;
ALTER TABLE public.customers ADD COLUMN updated_by UUID;