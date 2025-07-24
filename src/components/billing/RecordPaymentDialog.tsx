import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBilling } from '@/hooks/useBilling';
import { useToast } from '@/hooks/use-toast';

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId?: string;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  mailbox_number: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount_due: number;
  customer_name?: string;
}

export function RecordPaymentDialog({ open, onOpenChange, invoiceId }: RecordPaymentDialogProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedInvoice, setSelectedInvoice] = useState<string>(invoiceId || '');
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { recordPayment } = useBilling();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchCustomers();
      if (invoiceId) {
        setSelectedInvoice(invoiceId);
      }
    }
  }, [open, invoiceId]);

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerInvoices(selectedCustomer);
    }
  }, [selectedCustomer]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, first_name, last_name, mailbox_number')
        .eq('status', 'active')
        .order('first_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchCustomerInvoices = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, invoice_number, amount_due')
        .eq('customer_id', customerId)
        .gt('amount_due', 0)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || !amount || !paymentMethod) {
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

      const paymentData = {
        customer_id: selectedCustomer,
        location_id: locations?.id,
        invoice_id: selectedInvoice || null,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        reference_number: referenceNumber || null,
        notes: notes || null,
        payment_date: new Date().toISOString().split('T')[0],
        status: 'completed',
      };

      await recordPayment(paymentData);

      toast({
        title: 'Pago registrado',
        description: `Pago de $${amount} registrado exitosamente`,
      });

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error recording payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCustomer('');
    setSelectedInvoice('');
    setAmount('');
    setPaymentMethod('cash');
    setReferenceNumber('');
    setNotes('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="h-5 w-5" />;
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'ath_movil':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Pago</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Selection */}
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

          {/* Invoice Selection (Optional) */}
          {invoices.length > 0 && (
            <div>
              <Label htmlFor="invoice">Factura (Opcional)</Label>
              <Select value={selectedInvoice} onValueChange={setSelectedInvoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar factura a pagar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Pago general (no asignar a factura)</SelectItem>
                  {invoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.invoice_number} - {formatCurrency(invoice.amount_due)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <Label>Método de Pago *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <Card 
                className={`cursor-pointer transition-all ${paymentMethod === 'cash' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <CardContent className="flex items-center justify-center p-4">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <span className="text-sm font-medium">Efectivo</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${paymentMethod === 'card' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CardContent className="flex items-center justify-center p-4">
                  <div className="text-center">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <span className="text-sm font-medium">Tarjeta</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${paymentMethod === 'ath_movil' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setPaymentMethod('ath_movil')}
              >
                <CardContent className="flex items-center justify-center p-4">
                  <div className="text-center">
                    <Smartphone className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <span className="text-sm font-medium">ATH Móvil</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Monto *</Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="reference">
                Número de Referencia 
                {paymentMethod !== 'cash' && ' *'}
              </Label>
              <Input
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder={
                  paymentMethod === 'ath_movil' ? 'ATH ref #' :
                  paymentMethod === 'card' ? 'Últimos 4 dígitos' :
                  'Opcional'
                }
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionales sobre el pago..."
              rows={3}
            />
          </div>

          {/* Payment Summary */}
          {amount && (
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getPaymentMethodIcon(paymentMethod)}
                    <div>
                      <p className="font-medium">
                        {paymentMethod === 'cash' ? 'Efectivo' :
                         paymentMethod === 'card' ? 'Tarjeta de Crédito/Débito' :
                         'ATH Móvil'}
                      </p>
                      {referenceNumber && (
                        <p className="text-sm text-muted-foreground">
                          Ref: {referenceNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(parseFloat(amount) || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Pago'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}