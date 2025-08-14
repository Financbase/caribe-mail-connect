import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  unit_of_measure: string;
  barcode: string | null;
  min_stock_level: number;
  max_stock_level: number | null;
  reorder_point: number;
  preferred_vendor_id: string | null;
  standard_cost: number;
  is_active: boolean;
  is_consumable: boolean;
  created_at: string;
  updated_at: string;
  vendors?: { name: string };
}

export interface InventoryStock {
  id: string;
  item_id: string;
  location_id: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  last_counted_at: string | null;
  last_counted_by: string | null;
  created_at: string;
  updated_at: string;
  inventory_items: InventoryItem;
  locations: { name: string; code: string };
}

export interface InventoryMovement {
  id: string;
  item_id: string;
  location_id: string;
  movement_type: string;
  quantity_change: number;
  unit_cost: number | null;
  reference_type: string | null;
  reference_id: string | null;
  reason_code: string | null;
  notes: string | null;
  created_at: string;
  created_by: string | null;
  inventory_items: InventoryItem;
  locations: { name: string };
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id: string;
  location_id: string;
  status: string;
  order_date: string;
  expected_delivery_date: string | null;
  actual_delivery_date: string | null;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  total_amount: number;
  payment_terms: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vendors: { name: string };
  locations: { name: string };
  purchase_order_items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  item_id: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost: number;
  line_total: number;
  notes: string | null;
  inventory_items: InventoryItem;
}

export interface Vendor {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string;
  zip_code: string | null;
  country: string;
  payment_terms: number;
  preferred_payment_method: string | null;
  tax_id: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useInventory() {
  const queryClient = useQueryClient();

  // Fetch inventory items
  const {
    data: inventoryItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ['inventoryItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select(`
          *,
          vendors(name)
        `)
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as InventoryItem[];
    },
  });

  // Fetch inventory stock levels
  const {
    data: inventoryStock,
    isLoading: stockLoading,
    error: stockError,
  } = useQuery({
    queryKey: ['inventoryStock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_stock')
        .select(`
          *,
          inventory_items(*),
          locations(name, code)
        `)
        .order('locations(name)', { ascending: true })
        .order('inventory_items(name)', { ascending: true });

      if (error) throw error;
      return data as InventoryStock[];
    },
  });

  // Fetch low stock items
  const {
    data: lowStockItems,
    isLoading: lowStockLoading,
  } = useQuery({
    queryKey: ['lowStockItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_stock')
        .select(`
          *,
          inventory_items(*),
          locations(name, code)
        `)
        .lte('quantity_available', 'inventory_items.reorder_point')
        .order('quantity_available', { ascending: true });

      if (error) throw error;
      return data as InventoryStock[];
    },
  });

  // Fetch recent inventory movements
  const {
    data: recentMovements,
    isLoading: movementsLoading,
  } = useQuery({
    queryKey: ['recentMovements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select(`
          *,
          inventory_items(name, sku),
          locations(name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as InventoryMovement[];
    },
  });

  // Fetch purchase orders
  const {
    data: purchaseOrders,
    isLoading: poLoading,
  } = useQuery({
    queryKey: ['purchaseOrders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          vendors(name),
          locations(name),
          purchase_order_items(
            id,
            purchase_order_id,
            item_id,
            quantity_ordered,
            quantity_received,
            unit_cost,
            line_total,
            notes,
            created_at,
            inventory_items(
              id,
              sku,
              name,
              description,
              category,
              unit_of_measure,
              barcode,
              min_stock_level,
              max_stock_level,
              reorder_point,
              preferred_vendor_id,
              standard_cost,
              is_active,
              is_consumable,
              created_at,
              updated_at
            )
          )
        `)
        .order('order_date', { ascending: false })
        .order('po_number', { ascending: false });

      if (error) throw error;
      return data as PurchaseOrder[];
    },
  });

  // Fetch vendors
  const {
    data: vendors,
    isLoading: vendorsLoading,
  } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Vendor[];
    },
  });

  // Create inventory item
  const createItemMutation = useMutation({
    mutationFn: async (itemData: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([itemData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      toast({
        title: 'Item created',
        description: 'Inventory item has been created successfully.',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error creating item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update inventory item
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<InventoryItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      toast({
        title: 'Item updated',
        description: 'Inventory item has been updated successfully.',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error updating item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Record inventory movement
  const recordMovementMutation = useMutation({
    mutationFn: async (movementData: {
      item_id: string;
      location_id: string;
      movement_type: string;
      quantity_change: number;
      unit_cost?: number;
      reference_type?: string;
      reference_id?: string;
      reason_code?: string;
      notes?: string;
    }) => {
      // Start a transaction
      const { data: movement, error: movementError } = await supabase
        .from('inventory_movements')
        .insert([movementData])
        .select()
        .single();

      if (movementError) throw movementError;

      // Update or create stock record
      const { data: currentStock } = await supabase
        .from('inventory_stock')
        .select('*')
        .eq('item_id', movementData.item_id)
        .eq('location_id', movementData.location_id)
        .single();

      if (currentStock) {
        // Update existing stock
        const { error: updateError } = await supabase
          .from('inventory_stock')
          .update({
            quantity_on_hand: currentStock.quantity_on_hand + movementData.quantity_change,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentStock.id);

        if (updateError) throw updateError;
      } else {
        // Create new stock record
        const { error: insertError } = await supabase
          .from('inventory_stock')
          .insert([{
            item_id: movementData.item_id,
            location_id: movementData.location_id,
            quantity_on_hand: Math.max(0, movementData.quantity_change),
            quantity_reserved: 0
          }]);

        if (insertError) throw insertError;
      }

      return movement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryStock'] });
      queryClient.invalidateQueries({ queryKey: ['recentMovements'] });
      queryClient.invalidateQueries({ queryKey: ['lowStockItems'] });
      toast({
        title: 'Movement recorded',
        description: 'Inventory movement has been recorded successfully.',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error recording movement',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Create purchase order
  const createPurchaseOrderMutation = useMutation({
    mutationFn: async (poData: {
      vendor_id: string;
      location_id: string;
      expected_delivery_date?: string;
      notes?: string;
      items: Array<{
        item_id: string;
        quantity_ordered: number;
        unit_cost: number;
      }>;
    }) => {
      // Generate PO number
      const { data: location } = await supabase
        .from('locations')
        .select('code')
        .eq('id', poData.location_id)
        .single();

      const { data: poNumber, error: poNumberError } = await supabase
        .rpc('generate_po_number', { location_code: location?.code || 'MAIN' });

      if (poNumberError) throw poNumberError;

      // Calculate totals
      const subtotal = poData.items.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_cost), 0);
      const taxAmount = subtotal * 0.115; // 11.5% IVU for PR
      const totalAmount = subtotal + taxAmount;

      // Create purchase order
      const { data: po, error: poError } = await supabase
        .from('purchase_orders')
        .insert([{
          po_number: poNumber,
          vendor_id: poData.vendor_id,
          location_id: poData.location_id,
          expected_delivery_date: poData.expected_delivery_date,
          subtotal,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          notes: poData.notes
        }])
        .select()
        .single();

      if (poError) throw poError;

      // Create PO items
      const poItems = poData.items.map(item => ({
        purchase_order_id: po.id,
        ...item
      }));

      const { error: itemsError } = await supabase
        .from('purchase_order_items')
        .insert(poItems);

      if (itemsError) throw itemsError;

      return po;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      toast({
        title: 'Purchase order created',
        description: 'Purchase order has been created successfully.',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error creating purchase order',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Create vendor
  const createVendorMutation = useMutation({
    mutationFn: async (vendorData: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('vendors')
        .insert([vendorData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: 'Vendor created',
        description: 'Vendor has been created successfully.',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error creating vendor',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    // Data
    inventoryItems: inventoryItems || [],
    inventoryStock: inventoryStock || [],
    lowStockItems: lowStockItems || [],
    recentMovements: recentMovements || [],
    purchaseOrders: purchaseOrders || [],
    vendors: vendors || [],

    // Loading states
    itemsLoading,
    stockLoading,
    lowStockLoading,
    movementsLoading,
    poLoading,
    vendorsLoading,

    // Error states
    itemsError,
    stockError,

    // Actions
    createItem: createItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    recordMovement: recordMovementMutation.mutate,
    createPurchaseOrder: createPurchaseOrderMutation.mutate,
    createVendor: createVendorMutation.mutate,

    // Pending states
    isCreatingItem: createItemMutation.isPending,
    isUpdatingItem: updateItemMutation.isPending,
    isRecordingMovement: recordMovementMutation.isPending,
    isCreatingPurchaseOrder: createPurchaseOrderMutation.isPending,
    isCreatingVendor: createVendorMutation.isPending,
  };
}