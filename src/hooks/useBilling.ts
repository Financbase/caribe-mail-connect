import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Invoice as ApiInvoice, PaymentMethod } from '@/types/api';

export interface BillingSummary {
  monthlyRevenue: number;
  outstandingBalance: number;
  outstandingInvoices: number;
  dailyPayments: number;
  dailyPaymentCount: number;
  overdueInvoices: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name?: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  amount_due: number;
  status: string;
  billing_period_start: string;
  billing_period_end: string;
}

export interface Payment {
  id: string;
  payment_number: string;
  customer_id: string;
  customer_name?: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: string;
  reference_number?: string;
}

export function useBilling() {
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch billing summary
  const fetchSummary = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

      // Monthly revenue
      const { data: monthlyPayments } = await supabase
        .from('payments')
        .select('amount')
        .gte('payment_date', firstDayOfMonth)
        .eq('status', 'completed');

      // Outstanding invoices
      const { data: outstandingInvoices } = await supabase
        .from('invoices')
        .select('amount_due')
        .neq('amount_due', 0)
        .in('status', ['sent', 'overdue']);

      // Daily payments
      const { data: dailyPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('payment_date', today)
        .eq('status', 'completed');

      // Overdue invoices
      const { data: overdueInvoices } = await supabase
        .from('invoices')
        .select('id')
        .lt('due_date', today)
        .neq('amount_due', 0);

      const monthlyRevenue = monthlyPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const outstandingBalance = outstandingInvoices?.reduce((sum, i) => sum + Number(i.amount_due), 0) || 0;
      const dailyPaymentTotal = dailyPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setSummary({
        monthlyRevenue,
        outstandingBalance,
        outstandingInvoices: outstandingInvoices?.length || 0,
        dailyPayments: dailyPaymentTotal,
        dailyPaymentCount: dailyPayments?.length || 0,
        overdueInvoices: overdueInvoices?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching billing summary:', error);
      setError('Error al cargar el resumen de facturación');
    }
  };

  // Fetch invoices with customer info
  const fetchInvoices = async (limit?: number) => {
    try {
      let query = supabase
        .from('invoices')
        .select(`
          *,
          customers(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      const invoicesWithCustomerNames = data?.map(invoice => ({
        ...invoice,
        customer_name: invoice.customers 
          ? `${invoice.customers.first_name} ${invoice.customers.last_name}`
          : 'Cliente Desconocido'
      })) || [];

      setInvoices(invoicesWithCustomerNames);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Error al cargar las facturas');
    }
  };

  // Fetch payments with customer info
  const fetchPayments = async (limit?: number) => {
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          customers(first_name, last_name)
        `)
        .order('payment_date', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      const paymentsWithCustomerNames = data?.map(payment => ({
        ...payment,
        customer_name: payment.customers 
          ? `${payment.customers.first_name} ${payment.customers.last_name}`
          : 'Cliente Desconocido'
      })) || [];

      setPayments(paymentsWithCustomerNames);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Error al cargar los pagos');
    }
  };

  // Create new invoice
  const createInvoice = async (invoiceData: {
    customer_id: string;
    location_id: string;
    amount: number;
    tax_amount: number;
    total_amount: number;
    due_date: string;
    items: Array<{
      description: string;
      quantity: number;
      unit_price: number;
      total: number;
      service_type: string;
    }>;
    notes?: string;
  }) => {
    try {
      setLoading(true);
      
      // Generate invoice number
      const { data: location } = await supabase
        .from('locations')
        .select('code')
        .eq('id', invoiceData.location_id)
        .single();

      const { data, error } = await supabase.rpc('generate_invoice_number', {
        location_code: location?.code || 'LOC'
      });

      if (error) throw error;

      const newInvoice = {
        ...invoiceData,
        invoice_number: data,
        created_by: user?.id,
      };

      const { data: invoice, error: insertError } = await supabase
        .from('invoices')
        .insert(newInvoice)
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: 'Factura creada',
        description: `Factura ${data} creada exitosamente`,
      });

      await fetchInvoices();
      await fetchSummary();
      
      return invoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Error',
        description: 'Error al crear la factura',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Record payment
  const recordPayment = async (paymentData: {
    customer_id: string;
    invoice_id?: string;
    amount: number;
    payment_method: string;
    reference_number?: string;
    notes?: string;
  }) => {
    try {
      setLoading(true);
      
      const newPayment = {
        ...paymentData,
        payment_number: `PAY-${Date.now()}`,
        processed_by: user?.id,
      };

      const { data: payment, error } = await supabase
        .from('payments')
        .insert(newPayment)
        .select()
        .single();

      if (error) throw error;

      // Update invoice if payment is linked to one
      if (paymentData.invoice_id) {
        const { data: invoice } = await supabase
          .from('invoices')
          .select('amount_paid, total_amount')
          .eq('id', paymentData.invoice_id)
          .single();

        if (invoice) {
          const newAmountPaid = Number(invoice.amount_paid) + Number(paymentData.amount);
          const newAmountDue = Number(invoice.total_amount) - newAmountPaid;
          const newStatus = newAmountDue <= 0 ? 'paid' : 'partial';

          await supabase
            .from('invoices')
            .update({
              amount_paid: newAmountPaid,
              amount_due: newAmountDue,
              status: newStatus,
            })
            .eq('id', paymentData.invoice_id);
        }
      }

      toast({
        title: 'Pago registrado',
        description: `Pago de $${paymentData.amount} registrado exitosamente`,
      });

      await fetchPayments();
      await fetchInvoices();
      await fetchSummary();
      
      return payment;
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: 'Error',
        description: 'Error al registrar el pago',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (user) {
      Promise.all([
        fetchSummary(),
        fetchInvoices(10),
        fetchPayments(10),
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  return {
    summary,
    invoices,
    payments,
    loading,
    error,
    createInvoice,
    recordPayment,
    fetchInvoices,
    fetchPayments,
    refetch: () => Promise.all([fetchSummary(), fetchInvoices(), fetchPayments()]),
  };
}