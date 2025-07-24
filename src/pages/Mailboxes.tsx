import { useState } from 'react';
import { ArrowLeft, Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMailboxes, type Mailbox } from '@/hooks/useMailboxes';
import { toast } from '@/hooks/use-toast';
import { MailboxGrid } from '@/components/MailboxGrid';
import { MailboxStatsCard } from '@/components/MailboxStatsCard';
import { MailboxDetailDialog } from '@/components/MailboxDetailDialog';
import { MailboxAssignmentDialog } from '@/components/MailboxAssignmentDialog';

interface MailboxesProps {
  onNavigate: (page: string) => void;
}

export default function Mailboxes({ onNavigate }: MailboxesProps) {
  const { t } = useLanguage();
  const {
    mailboxes,
    loading,
    error,
    assignMailbox,
    terminateRental,
    updateMailboxStatus,
    getMailboxStats,
    searchMailboxes,
    filterBySize,
    filterByStatus
  } = useMailboxes();

  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMailbox, setSelectedMailbox] = useState<Mailbox | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);

  // Apply filters
  let filteredMailboxes = mailboxes;
  if (searchTerm) {
    filteredMailboxes = searchMailboxes(searchTerm);
  }
  if (sizeFilter !== 'all') {
    filteredMailboxes = filterBySize(sizeFilter);
  }
  if (statusFilter !== 'all') {
    filteredMailboxes = filterByStatus(statusFilter);
  }

  const stats = getMailboxStats();

  const handleMailboxClick = (mailbox: Mailbox) => {
    setSelectedMailbox(mailbox);
    setShowDetailDialog(true);
  };

  const handleAssignMailbox = () => {
    if (selectedMailbox?.status === 'available') {
      setShowDetailDialog(false);
      setShowAssignmentDialog(true);
    }
  };

  const handleAssignment = async (
    customerId: string,
    paymentFrequency: 'monthly' | 'annual',
    startDate: Date
  ) => {
    if (!selectedMailbox) return;

    const result = await assignMailbox(
      selectedMailbox.id,
      customerId,
      paymentFrequency,
      startDate
    );

    if (result.success) {
      toast({
        title: t('Success'),
        description: t('Mailbox assigned successfully'),
      });
    } else {
      toast({
        title: t('Error'),
        description: result.error || t('Failed to assign mailbox'),
        variant: 'destructive',
      });
    }
  };

  const handleTerminate = async () => {
    if (!selectedMailbox) return;

    const reason = prompt(t('Enter termination reason:'));
    if (!reason) return;

    const result = await terminateRental(
      selectedMailbox.id,
      reason,
      new Date()
    );

    if (result.success) {
      toast({
        title: t('Success'),
        description: t('Rental terminated successfully'),
      });
      setShowDetailDialog(false);
    } else {
      toast({
        title: t('Error'),
        description: result.error || t('Failed to terminate rental'),
        variant: 'destructive',
      });
    }
  };

  const handleMaintenance = async () => {
    if (!selectedMailbox) return;

    const newStatus = selectedMailbox.status === 'maintenance' ? 'available' : 'maintenance';
    const notes = newStatus === 'maintenance' 
      ? prompt(t('Enter maintenance notes:')) 
      : undefined;

    if (newStatus === 'maintenance' && !notes) return;

    const result = await updateMailboxStatus(
      selectedMailbox.id,
      newStatus,
      notes
    );

    if (result.success) {
      toast({
        title: t('Success'),
        description: newStatus === 'maintenance' 
          ? t('Mailbox marked for maintenance')
          : t('Mailbox removed from maintenance'),
      });
      setShowDetailDialog(false);
    } else {
      toast({
        title: t('Error'),
        description: result.error || t('Failed to update mailbox'),
        variant: 'destructive',
      });
    }
  };

  if (loading && mailboxes.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{t('Loading mailboxes...')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              {t('Retry')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">{t('Mailbox Management')}</h1>
          </div>
          <Button onClick={() => onNavigate('customers')}>
            <Plus className="h-4 w-4 mr-2" />
            {t('Add Customer')}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('Search mailboxes, customers...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('All Sizes')}</SelectItem>
              <SelectItem value="small">{t('Small')}</SelectItem>
              <SelectItem value="medium">{t('Medium')}</SelectItem>
              <SelectItem value="large">{t('Large')}</SelectItem>
              <SelectItem value="virtual">{t('Virtual')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('All Status')}</SelectItem>
              <SelectItem value="available">{t('Available')}</SelectItem>
              <SelectItem value="occupied">{t('Occupied')}</SelectItem>
              <SelectItem value="maintenance">{t('Maintenance')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Statistics */}
        <MailboxStatsCard stats={stats} />

        {/* Legend */}
        <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary-palm"></div>
            <span className="text-sm">{t('Available')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary-ocean"></div>
            <span className="text-sm">{t('Occupied')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-sunset"></div>
            <span className="text-sm">{t('Expiring Soon')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-coral"></div>
            <span className="text-sm">{t('Overdue')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-500"></div>
            <span className="text-sm">{t('Maintenance')}</span>
          </div>
        </div>

        {/* Mailbox Grid */}
        {filteredMailboxes.length > 0 ? (
          <MailboxGrid
            mailboxes={filteredMailboxes}
            onMailboxClick={handleMailboxClick}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('No mailboxes found matching your criteria')}</p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <MailboxDetailDialog
        mailbox={selectedMailbox}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        onAssign={handleAssignMailbox}
        onTerminate={handleTerminate}
        onMaintenance={handleMaintenance}
      />

      <MailboxAssignmentDialog
        mailbox={selectedMailbox}
        open={showAssignmentDialog}
        onOpenChange={setShowAssignmentDialog}
        onAssign={handleAssignment}
      />
    </div>
  );
}