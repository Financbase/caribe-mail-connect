import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomers } from '@/hooks/useCustomers';
import { cn } from '@/lib/utils';
import type { Mailbox } from '@/hooks/useMailboxes';

interface MailboxAssignmentDialogProps {
  mailbox: Mailbox | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (customerId: string, paymentFrequency: 'monthly' | 'annual', startDate: Date) => void;
}

export function MailboxAssignmentDialog({
  mailbox,
  open,
  onOpenChange,
  onAssign
}: MailboxAssignmentDialogProps) {
  const { t } = useLanguage();
  const { customers, searchCustomers } = useCustomers();
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'annual'>('monthly');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const filteredCustomers = customerSearch 
    ? searchCustomers(customerSearch)
    : customers.slice(0, 10);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotal = () => {
    if (!mailbox) return 0;
    return paymentFrequency === 'monthly' ? mailbox.monthly_rate : mailbox.annual_rate;
  };

  const calculateSavings = () => {
    if (!mailbox || paymentFrequency === 'monthly') return 0;
    return mailbox.monthly_rate * 12 - mailbox.annual_rate;
  };

  const handleAssign = () => {
    if (selectedCustomerId && mailbox) {
      onAssign(selectedCustomerId, paymentFrequency, startDate);
      onOpenChange(false);
      setSelectedCustomerId('');
      setCustomerSearch('');
      setPaymentFrequency('monthly');
      setStartDate(new Date());
    }
  };

  if (!mailbox) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t('Assign Mailbox')} #{mailbox.number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Selection */}
          <div className="space-y-2">
            <Label>{t('Customer')}</Label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('Search customers...')}
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setShowCustomerDropdown(true);
                  }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  className="pl-8"
                />
              </div>
              
              {showCustomerDropdown && filteredCustomers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground border-b border-gray-200 last:border-b-0"
                      onClick={() => {
                        setSelectedCustomerId(customer.id);
                        setCustomerSearch(`${customer.first_name} ${customer.last_name} (${customer.email})`);
                        setShowCustomerDropdown(false);
                      }}
                    >
                      <div className="font-medium">
                        {customer.first_name} {customer.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {customer.email} • {t('Mailbox')} #{customer.mailbox_number}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Frequency */}
          <div className="space-y-2">
            <Label>{t('Payment Frequency')}</Label>
            <Select value={paymentFrequency} onValueChange={(value: 'monthly' | 'annual') => setPaymentFrequency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">
                  {t('Monthly')} - {formatCurrency(mailbox.monthly_rate)}
                </SelectItem>
                <SelectItem value="annual">
                  {t('Annual')} - {formatCurrency(mailbox.annual_rate)}
                  {calculateSavings() > 0 && (
                    <span className="text-primary-palm ml-2">
                      ({t('Save')} {formatCurrency(calculateSavings())})
                    </span>
                  )}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>{t('Start Date')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>{t('Pick a date')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Summary */}
          {selectedCustomer && (
            <div className="space-y-2 p-3 bg-accent/20 rounded-lg">
              <div className="font-medium">{t('Assignment Summary')}</div>
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-muted-foreground">{t('Customer')}: </span>
                  {selectedCustomer.first_name} {selectedCustomer.last_name}
                </div>
                <div>
                  <span className="text-muted-foreground">{t('Mailbox')}: </span>
                  #{mailbox.number} ({mailbox.size})
                </div>
                <div>
                  <span className="text-muted-foreground">{t('Rate')}: </span>
                  {formatCurrency(calculateTotal())} {paymentFrequency}
                </div>
                <div>
                  <span className="text-muted-foreground">{t('Start Date')}: </span>
                  {format(startDate, "PPP")}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {t('Cancel')}
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedCustomerId}
              className="flex-1"
            >
              {t('Assign Mailbox')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}