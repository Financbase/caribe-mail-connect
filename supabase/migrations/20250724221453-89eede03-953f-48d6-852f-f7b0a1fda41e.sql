-- Create inventory management tables

-- Vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT DEFAULT 'PR',
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  payment_terms INTEGER DEFAULT 30,
  preferred_payment_method TEXT,
  tax_id TEXT,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Inventory item categories and items
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'shipping_supplies', 'office_supplies', 'cleaning_supplies', 'safety_equipment', 'labels'
  unit_of_measure TEXT NOT NULL DEFAULT 'each', -- 'each', 'box', 'pack', 'roll', 'sheet'
  barcode TEXT,
  min_stock_level INTEGER DEFAULT 0,
  max_stock_level INTEGER,
  reorder_point INTEGER DEFAULT 0,
  preferred_vendor_id UUID,
  standard_cost NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_consumable BOOLEAN NOT NULL DEFAULT true, -- Auto-deduct on package creation
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Current stock levels by location
CREATE TABLE public.inventory_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL,
  location_id UUID NOT NULL,
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0, -- Reserved for pending orders
  quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
  last_counted_at TIMESTAMP WITH TIME ZONE,
  last_counted_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(item_id, location_id)
);

-- Track all inventory movements
CREATE TABLE public.inventory_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL,
  location_id UUID NOT NULL,
  movement_type TEXT NOT NULL, -- 'receipt', 'usage', 'adjustment', 'transfer_in', 'transfer_out', 'count'
  quantity_change INTEGER NOT NULL, -- Positive for increases, negative for decreases
  unit_cost NUMERIC(10,2),
  reference_type TEXT, -- 'purchase_order', 'package', 'adjustment', 'transfer', 'count'
  reference_id UUID,
  reason_code TEXT, -- For adjustments: 'damage', 'expired', 'lost', 'found', 'correction'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Purchase orders
CREATE TABLE public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_number TEXT NOT NULL UNIQUE,
  vendor_id UUID NOT NULL,
  location_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'sent', 'acknowledged', 'received', 'cancelled'
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_terms INTEGER DEFAULT 30,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Purchase order line items
CREATE TABLE public.purchase_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID NOT NULL,
  item_id UUID NOT NULL,
  quantity_ordered INTEGER NOT NULL,
  quantity_received INTEGER NOT NULL DEFAULT 0,
  unit_cost NUMERIC(10,2) NOT NULL,
  line_total NUMERIC(10,2) GENERATED ALWAYS AS (quantity_ordered * unit_cost) STORED,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inventory adjustments for audit trail
CREATE TABLE public.inventory_adjustments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL,
  adjustment_number TEXT NOT NULL UNIQUE,
  adjustment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  adjustment_type TEXT NOT NULL, -- 'cycle_count', 'physical_count', 'shrinkage', 'damage', 'expired'
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'approved', 'posted'
  total_items INTEGER DEFAULT 0,
  total_adjustments INTEGER DEFAULT 0,
  notes TEXT,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Inventory adjustment line items
CREATE TABLE public.inventory_adjustment_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  adjustment_id UUID NOT NULL,
  item_id UUID NOT NULL,
  counted_quantity INTEGER NOT NULL,
  system_quantity INTEGER NOT NULL,
  adjustment_quantity INTEGER GENERATED ALWAYS AS (counted_quantity - system_quantity) STORED,
  unit_cost NUMERIC(10,2),
  reason_code TEXT, -- 'damage', 'expired', 'lost', 'found', 'correction'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.inventory_items
  ADD CONSTRAINT fk_inventory_items_vendor 
  FOREIGN KEY (preferred_vendor_id) REFERENCES public.vendors(id);

ALTER TABLE public.inventory_stock
  ADD CONSTRAINT fk_inventory_stock_item 
  FOREIGN KEY (item_id) REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_inventory_stock_location 
  FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE CASCADE;

ALTER TABLE public.inventory_movements
  ADD CONSTRAINT fk_inventory_movements_item 
  FOREIGN KEY (item_id) REFERENCES public.inventory_items(id),
  ADD CONSTRAINT fk_inventory_movements_location 
  FOREIGN KEY (location_id) REFERENCES public.locations(id);

ALTER TABLE public.purchase_orders
  ADD CONSTRAINT fk_purchase_orders_vendor 
  FOREIGN KEY (vendor_id) REFERENCES public.vendors(id),
  ADD CONSTRAINT fk_purchase_orders_location 
  FOREIGN KEY (location_id) REFERENCES public.locations(id);

ALTER TABLE public.purchase_order_items
  ADD CONSTRAINT fk_purchase_order_items_po 
  FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_purchase_order_items_item 
  FOREIGN KEY (item_id) REFERENCES public.inventory_items(id);

ALTER TABLE public.inventory_adjustments
  ADD CONSTRAINT fk_inventory_adjustments_location 
  FOREIGN KEY (location_id) REFERENCES public.locations(id);

ALTER TABLE public.inventory_adjustment_items
  ADD CONSTRAINT fk_inventory_adjustment_items_adjustment 
  FOREIGN KEY (adjustment_id) REFERENCES public.inventory_adjustments(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_inventory_adjustment_items_item 
  FOREIGN KEY (item_id) REFERENCES public.inventory_items(id);

-- Create indexes for performance
CREATE INDEX idx_inventory_items_category ON public.inventory_items(category);
CREATE INDEX idx_inventory_items_sku ON public.inventory_items(sku);
CREATE INDEX idx_inventory_items_barcode ON public.inventory_items(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_inventory_stock_item_location ON public.inventory_stock(item_id, location_id);
CREATE INDEX idx_inventory_movements_item_date ON public.inventory_movements(item_id, created_at);
CREATE INDEX idx_inventory_movements_reference ON public.inventory_movements(reference_type, reference_id);
CREATE INDEX idx_purchase_orders_status ON public.purchase_orders(status);
CREATE INDEX idx_purchase_orders_date ON public.purchase_orders(order_date);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_adjustment_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Staff can manage vendors" ON public.vendors FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage inventory items" ON public.inventory_items FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage inventory stock" ON public.inventory_stock FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage inventory movements" ON public.inventory_movements FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage purchase orders" ON public.purchase_orders FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage purchase order items" ON public.purchase_order_items FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage inventory adjustments" ON public.inventory_adjustments FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage inventory adjustment items" ON public.inventory_adjustment_items FOR ALL USING (auth.uid() IS NOT NULL);

-- Add updated_at triggers
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_stock_updated_at
  BEFORE UPDATE ON public.inventory_stock
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_adjustments_updated_at
  BEFORE UPDATE ON public.inventory_adjustments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate PO numbers
CREATE OR REPLACE FUNCTION public.generate_po_number(location_code text)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  next_num INTEGER;
  current_year TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  
  SELECT COALESCE(MAX(
    CASE 
      WHEN po_number ~ ('^PO-' || location_code || '-' || current_year || '-[0-9]+$')
      THEN CAST(SPLIT_PART(po_number, '-', 4) AS INTEGER)
      ELSE 0
    END
  ), 0) + 1 INTO next_num
  FROM purchase_orders
  WHERE po_number LIKE 'PO-' || location_code || '-' || current_year || '-%';
  
  RETURN 'PO-' || location_code || '-' || current_year || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$function$;

-- Create function to generate adjustment numbers
CREATE OR REPLACE FUNCTION public.generate_adjustment_number(location_code text)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  next_num INTEGER;
  current_year TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  
  SELECT COALESCE(MAX(
    CASE 
      WHEN adjustment_number ~ ('^ADJ-' || location_code || '-' || current_year || '-[0-9]+$')
      THEN CAST(SPLIT_PART(adjustment_number, '-', 4) AS INTEGER)
      ELSE 0
    END
  ), 0) + 1 INTO next_num
  FROM inventory_adjustments
  WHERE adjustment_number LIKE 'ADJ-' || location_code || '-' || current_year || '-%';
  
  RETURN 'ADJ-' || location_code || '-' || current_year || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$function$;

-- Insert sample inventory items
INSERT INTO public.inventory_items (sku, name, description, category, unit_of_measure, min_stock_level, reorder_point, standard_cost, is_consumable) VALUES
-- Shipping Supplies
('BOX-SM-001', 'Small Shipping Box 6x4x4', 'Small cardboard shipping box for packages', 'shipping_supplies', 'each', 100, 50, 0.75, true),
('BOX-MD-001', 'Medium Shipping Box 8x6x6', 'Medium cardboard shipping box for packages', 'shipping_supplies', 'each', 75, 35, 1.25, true),
('BOX-LG-001', 'Large Shipping Box 12x9x6', 'Large cardboard shipping box for packages', 'shipping_supplies', 'each', 50, 25, 2.00, true),
('ENV-BUBBLE-001', 'Bubble Mailer #1 (6x10)', 'Padded bubble mailer envelope', 'shipping_supplies', 'each', 200, 100, 0.45, true),
('ENV-BUBBLE-002', 'Bubble Mailer #2 (8.5x12)', 'Large padded bubble mailer envelope', 'shipping_supplies', 'each', 150, 75, 0.65, true),
('TAPE-PACK-001', 'Packing Tape 2" Clear', 'Clear packing tape for sealing boxes', 'shipping_supplies', 'roll', 50, 25, 3.50, true),
('TAPE-FRAG-001', 'Fragile Tape 2" Red', 'Red fragile warning packing tape', 'shipping_supplies', 'roll', 20, 10, 4.25, true),
('BUBBLE-WRAP-001', 'Bubble Wrap 12" Roll', 'Protective bubble wrap for fragile items', 'shipping_supplies', 'roll', 10, 5, 15.00, true),
('LABEL-SHIP-001', 'Shipping Labels 4x6', 'Adhesive shipping labels for packages', 'shipping_supplies', 'pack', 25, 10, 12.00, true),

-- Office Supplies
('PEN-BALL-001', 'Ballpoint Pens Black', 'Black ink ballpoint pens', 'office_supplies', 'pack', 10, 5, 8.50, false),
('PAPER-COPY-001', 'Copy Paper 8.5x11', 'White copy paper for printing', 'office_supplies', 'pack', 5, 3, 45.00, false),
('STAPLER-001', 'Desktop Stapler', 'Standard desktop stapler', 'office_supplies', 'each', 3, 1, 25.00, false),
('STAPLES-001', 'Staples Standard', 'Standard stapler staples', 'office_supplies', 'box', 10, 5, 4.50, false),

-- Cleaning Supplies
('CLEAN-DISINF-001', 'Disinfectant Spray', 'Surface disinfectant spray cleaner', 'cleaning_supplies', 'each', 12, 6, 6.75, false),
('CLEAN-WIPES-001', 'Disinfectant Wipes', 'Pre-moistened disinfectant wipes', 'cleaning_supplies', 'pack', 15, 8, 8.25, false),
('CLEAN-TOWEL-001', 'Paper Towels', 'Absorbent paper towels', 'cleaning_supplies', 'pack', 20, 10, 12.50, false),
('CLEAN-GLOVES-001', 'Disposable Gloves', 'Nitrile disposable gloves', 'cleaning_supplies', 'box', 8, 4, 18.00, false),

-- Safety Equipment
('SAFETY-MASK-001', 'N95 Face Masks', 'N95 respirator face masks', 'safety_equipment', 'box', 5, 3, 35.00, false),
('SAFETY-HAND-001', 'Hand Sanitizer', 'Alcohol-based hand sanitizer', 'safety_equipment', 'each', 10, 5, 4.50, false),
('SAFETY-VEST-001', 'Safety Vest', 'High-visibility safety vest', 'safety_equipment', 'each', 5, 2, 15.00, false),

-- Labels and Tracking
('LABEL-BAR-001', 'Barcode Labels 2x1', 'Adhesive barcode labels for inventory', 'labels', 'pack', 15, 8, 25.00, true),
('LABEL-ID-001', 'Customer ID Labels', 'Waterproof customer identification labels', 'labels', 'pack', 20, 10, 18.00, true),
('LABEL-WARN-001', 'Warning Labels', 'Bright warning and caution labels', 'labels', 'pack', 10, 5, 12.00, true);

-- Insert sample vendor
INSERT INTO public.vendors (name, contact_person, email, phone, address_line1, city, state, zip_code, payment_terms) VALUES
('Puerto Rico Supply Co.', 'Maria Rodriguez', 'maria@prsupply.com', '787-555-0123', '123 Industrial Ave', 'San Juan', 'PR', '00918', 30),
('Caribbean Packaging Solutions', 'Carlos Mendez', 'carlos@caribpack.com', '787-555-0456', '456 Commerce St', 'Bayamón', 'PR', '00956', 15),
('Island Office Supplies', 'Ana Torres', 'ana@islandoffice.com', '787-555-0789', '789 Business Blvd', 'Carolina', 'PR', '00979', 30);