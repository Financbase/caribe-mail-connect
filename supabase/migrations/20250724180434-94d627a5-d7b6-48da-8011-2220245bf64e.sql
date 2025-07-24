-- Add audit trail columns to customers table
ALTER TABLE public.customers ADD COLUMN created_by UUID;
ALTER TABLE public.customers ADD COLUMN updated_by UUID;