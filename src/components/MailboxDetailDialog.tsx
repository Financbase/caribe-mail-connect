import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Package, CreditCard, FileText, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import type { Mailbox } from '@/hooks/useMailboxes';

interface MailboxDetailDialogProps {
  mailbox: Mailbox | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: () => void;
  onTerminate: () => void;
  onMaintenance: () => void;
}

interface RentalHistory {
  id: string;
  start_date: string;
  end_date: string | null;
  monthly_rate: number;
  annual_rate: number;
  payment_frequency: string;
  termination_reason: string | null;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  period_start: string;
  period_end: string;
  payment_method: string | null;
  status: string;
}

export function MailboxDetailDialog({
  mailbox,
  open,
  onOpenChange,
  onAssign,
  onTerminate,
  onMaintenance
}: MailboxDetailDialogProps) {
  const { t } = useLanguage();
  const [rentalHistory, setRentalHistory] = useState<RentalHistory[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mailbox && open) {
      fetchMailboxDetails();
    }
  }, [mailbox, open]);

  const fetchMailboxDetails = async () => {
    if (!mailbox) return;
    
    setLoading(true);
    try {
      // Fetch rental history
      const { data: historyData } = await supabase
        .from('mailbox_rental_history')
        .select(`
          *,
          customer:customers (
            first_name,
            last_name,
            email
          )
        `)
        .eq('mailbox_id', mailbox.id)
        .order('start_date', { ascending: false });

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from('mailbox_payments')
        .select('*')
        .eq('mailbox_id', mailbox.id)
        .order('payment_date', { ascending: false });

      setRentalHistory(historyData || []);
      setPayments(paymentsData || []);
    } catch (error) {
      console.error('Error fetching mailbox details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mailbox) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-primary-palm';
      case 'occupied': return 'bg-primary-ocean';
      case 'maintenance': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(mailbox.status)}`} />
            {t('Mailbox')} #{mailbox.number}
            <Badge variant="outline">
              {mailbox.size.charAt(0).toUpperCase() + mailbox.size.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('Current Status')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">{t('Status')}</div>
                <div className="font-medium">{mailbox.status}</div>
              </div>
              
              {mailbox.current_customer && (
                <>
                  <div>
                    <div className="text-sm text-muted-foreground">{t('Current Renter')}</div>
                    <div className="font-medium">
                      {mailbox.current_customer.first_name} {mailbox.current_customer.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {mailbox.current_customer.email}
                    </div>
                  </div>
                  
                  {mailbox.rental_start_date && (
                    <div>
                      <div className="text-sm text-muted-foreground">{t('Rental Period')}</div>
                      <div className="font-medium">
                        {formatDate(mailbox.rental_start_date)} - {mailbox.rental_end_date ? formatDate(mailbox.rental_end_date) : 'Ongoing'}
                      </div>
                    </div>
                  )}
                  
                  {mailbox.next_payment_due && (
                    <div>
                      <div className="text-sm text-muted-foreground">{t('Next Payment Due')}</div>
                      <div className="font-medium">{formatDate(mailbox.next_payment_due)}</div>
                    </div>
                  )}
                </>
              )}

              {mailbox.package_count !== undefined && (
                <div>
                  <div className="text-sm text-muted-foreground">{t('Active Packages')}</div>
                  <div className="font-medium">{mailbox.package_count}</div>
                </div>
              )}

              {mailbox.notes && (
                <div>
                  <div className="text-sm text-muted-foreground">{t('Notes')}</div>
                  <div className="font-medium">{mailbox.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {t('Pricing')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">{t('Monthly Rate')}</div>
                <div className="font-medium">{formatCurrency(mailbox.monthly_rate)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('Annual Rate')}</div>
                <div className="font-medium">{formatCurrency(mailbox.annual_rate)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('Annual Savings')}</div>
                <div className="font-medium text-primary-palm">
                  {formatCurrency(mailbox.monthly_rate * 12 - mailbox.annual_rate)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          {mailbox.status === 'available' && (
            <Button onClick={onAssign} className="flex-1">
              {t('Assign to Customer')}
            </Button>
          )}
          {mailbox.status === 'occupied' && (
            <Button onClick={onTerminate} variant="destructive" className="flex-1">
              {t('Terminate Rental')}
            </Button>
          )}
          <Button onClick={onMaintenance} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            {mailbox.status === 'maintenance' ? t('Remove from Maintenance') : t('Mark for Maintenance')}
          </Button>
        </div>

        <Separator className="my-6" />

        {/* Rental History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('Rental History')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">{t('Loading...')}</div>
            ) : rentalHistory.length > 0 ? (
              <div className="space-y-3">
                {rentalHistory.map((rental) => (
                  <div key={rental.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          {rental.customer.first_name} {rental.customer.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {rental.customer.email}
                        </div>
                        <div className="text-sm">
                          {formatDate(rental.start_date)} - {rental.end_date ? formatDate(rental.end_date) : 'Ongoing'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(rental.payment_frequency === 'monthly' ? rental.monthly_rate : rental.annual_rate)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {rental.payment_frequency}
                        </div>
                      </div>
                    </div>
                    {rental.termination_reason && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        {t('Terminated')}: {rental.termination_reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {t('No rental history available')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('Payment History')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center border rounded-lg p-3">
                    <div>
                      <div className="font-medium">{formatCurrency(payment.amount)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(payment.payment_date)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(payment.period_start)} - {formatDate(payment.period_end)}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={payment.status === 'completed' ? 'default' : 'destructive'}
                      >
                        {payment.status}
                      </Badge>
                      {payment.payment_method && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {payment.payment_method}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {t('No payment history available')}
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}