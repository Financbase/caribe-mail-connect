-- Fix the pricing table to allow NULL location_id for global pricing
ALTER TABLE public.virtual_mailbox_pricing ALTER COLUMN location_id DROP NOT NULL;

-- Now insert the default pricing tiers with NULL location_id for global pricing
INSERT INTO virtual_mailbox_pricing (
  location_id, 
  service_tier, 
  monthly_base_fee,
  scan_fee_per_page,
  forward_fee_base,
  forward_fee_per_ounce,
  shred_fee,
  storage_fee_per_month,
  check_deposit_fee,
  rush_processing_fee
) VALUES 
  (NULL, 'basic', 25.00, 1.50, 8.00, 1.25, 2.00, 1.00, 5.00, 10.00),
  (NULL, 'premium', 45.00, 1.00, 6.00, 1.00, 1.50, 0.50, 3.00, 5.00),
  (NULL, 'business', 75.00, 0.75, 5.00, 0.75, 1.00, 0.25, 2.00, 0.00);