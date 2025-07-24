-- View for customers with pending compliance items
CREATE VIEW public.customers_pending_compliance AS
SELECT 
  c.id,
  c.first_name,
  c.last_name,
  c.email,
  cc.ps_form_1583_status,
  cc.id_verification_status,
  cc.compliance_score
FROM public.customers c
LEFT JOIN public.customer_compliance cc ON c.id = cc.customer_id
WHERE cc.ps_form_1583_status != 'approved' 
   OR cc.id_verification_status != 'verified';