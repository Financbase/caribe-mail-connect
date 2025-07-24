-- Add audit trail columns to existing tables
ALTER TABLE public.ps_form_1583 ADD COLUMN created_by UUID;
ALTER TABLE public.ps_form_1583 ADD COLUMN updated_by UUID;

ALTER TABLE public.id_verifications ADD COLUMN created_by UUID;
ALTER TABLE public.id_verifications ADD COLUMN updated_by UUID;

ALTER TABLE public.customer_compliance ADD COLUMN created_by UUID;
ALTER TABLE public.customer_compliance ADD COLUMN updated_by UUID;

ALTER TABLE public.customers ADD COLUMN created_by UUID;
ALTER TABLE public.customers ADD COLUMN updated_by UUID;