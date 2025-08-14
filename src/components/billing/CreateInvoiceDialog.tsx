import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBilling } from '@/hooks/useBilling';
import { useToast } from '@/hooks/use-toast';

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mailbox_number: string;
}

interface InvoiceItem {
  item_type: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export function CreateInvoiceDialog({ open, onOpenChange }: CreateInvoiceDialogProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [billingPeriodStart, setBillingPeriodStart] = useState('');
  const [billingPeriodEnd, setBillingPeriodEnd] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      item_type: 'mailbox_rental',
      description: 'Alquiler de buzón - Mes',
      quantity: 1,
      unit_price: 25.00,
      line_total: 25.00,
    }
  ]);
  const [loading, setLoading] = useState(false);
  
  const { createInvoice } = useBilling();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchCustomers();
      // Set default dates
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      setBillingPeriodStart(today.toISOString().split('T')[0]);
      setBillingPeriodEnd(new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]);
      setDueDate(nextMonth.toISOString().split('T')[0]);
    }
  }, [open]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, first_name, last_name, email, mailbox_number')
        .eq('status', 'active')
        .order('first_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const addItem = () => {
    setItems([...items, {
      item_type: 'package_fee',
      description: '',
      quantity: 1,
      unit_price: 0,
      line_total: 0,
    }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: unknown) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate line total
    if (field === 'quantity' || field === 'unit_price') {
      updatedItems[index].line_total = updatedItems[index].quantity * updatedItems[index].unit_price;
    }
    
    setItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.line_total, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.115; // 11.5% IVU
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || !billingPeriodStart || !billingPeriodEnd || !dueDate) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      // Get current location (would be from context in real app)
      const { data: locations } = await supabase
        .from('locations')
        .select('id')
        .eq('is_primary', true)
        .single();

      const invoiceData = {
        customer_id: selectedCustomer,
        location_id: locations?.id,
        billing_period_start: billingPeriodStart,
        billing_period_end: billingPeriodEnd,
        due_date: dueDate,
        subtotal: calculateSubtotal(),
        tax_amount: calculateTax(),
        total_amount: calculateTotal(),
        amount_due: calculateTotal(),
        notes,
        status: 'draft',
      };

      const invoice = await createInvoice(invoiceData);

      // Add invoice items
      for (const item of items) {
        await supabase.from('invoice_items').insert({
          invoice_id: invoice.id,
          ...item,
        });
      }

      toast({
        title: 'Factura creada',
        description: 'La factura ha sido creada exitosamente',
      });

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCustomer('');
    setBillingPeriodStart('');
    setBillingPeriodEnd('');
    setDueDate('');
    setNotes('');
    setItems([{
      item_type: 'mailbox_rental',
      description: 'Alquiler de buzón - Mes',
      quantity: 1,
      unit_price: 25.00,
      line_total: 25.00,
    }]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Factura</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer">Cliente *</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name} - #{customer.mailbox_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="due_date">Fecha de Vencimiento *</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Billing Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="period_start">Período - Inicio *</Label>
              <Input
                type="date"
                value={billingPeriodStart}
                onChange={(e) => setBillingPeriodStart(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="period_end">Período - Fin *</Label>
              <Input
                type="date"
                value={billingPeriodEnd}
                onChange={(e) => setBillingPeriodEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Artículos de la Factura</CardTitle>
                <Button onClick={addItem} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-3">
                      <Label>Tipo</Label>
                      <Select
                        value={item.item_type}
                        onValueChange={(value) => updateItem(index, 'item_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mailbox_rental">Alquiler Buzón</SelectItem>
                          <SelectItem value="package_fee">Tarifa Paquete</SelectItem>
                          <SelectItem value="scanning_fee">Escaneo</SelectItem>
                          <SelectItem value="notarization">Notarización</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-4">
                      <Label>Descripción</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Descripción del servicio"
                      />
                    </div>
                    <div className="col-span-1">
                      <Label>Cant.</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Precio Unit.</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-1">
                      <Label>Total</Label>
                      <div className="px-3 py-2 text-sm font-medium">
                        {formatCurrency(item.line_total)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      {items.length > 1 && (
                        <Button
                          onClick={() => removeItem(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVU (11.5%):</span>
                  <span>{formatCurrency(calculateTax())}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionales para la factura..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creando...' : 'Crear Factura'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}