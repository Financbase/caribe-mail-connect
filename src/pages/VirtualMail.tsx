import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton, CardSkeleton } from '@/components/ui/skeleton';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { Mail, Scan, Package, Camera, Search, Filter, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVirtualMailbox } from '@/hooks/useVirtualMailbox';
import { VirtualMailboxDashboard } from '@/components/virtual-mail/VirtualMailboxDashboard';
import { MailPieceList } from '@/components/virtual-mail/MailPieceList';
import { ScanningQueue } from '@/components/virtual-mail/ScanningQueue';
import { CheckDepositCapture } from '@/components/virtual-mail/CheckDepositCapture';
import { AddMailPieceDialog } from '@/components/virtual-mail/AddMailPieceDialog';
import { MailActionDialog } from '@/components/virtual-mail/MailActionDialog';
import { BillingAutomation } from '@/components/virtual-mail/BillingAutomation';
import { VirtualMailReporting } from '@/components/virtual-mail/VirtualMailReporting';

export function VirtualMail() {
  const { t } = useLanguage();
  
  const {
    loading,
    virtualMailboxes,
    mailPieces,
    scanningQueue,
    checkDeposits,
    fetchVirtualMailboxes,
    fetchMailPieces,
    fetchPricing
  } = useVirtualMailbox();

  const [selectedVirtualMailbox, setSelectedVirtualMailbox] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddMailDialog, setShowAddMailDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [selectedMailPiece, setSelectedMailPiece] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchVirtualMailboxes(),
        fetchMailPieces(),
        fetchPricing()
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const filteredMailPieces = mailPieces.filter(piece => {
    const matchesSearch = piece.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         piece.piece_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || piece.status === statusFilter;
    const matchesMailbox = !selectedVirtualMailbox || piece.virtual_mailbox_id === selectedVirtualMailbox;
    
    return matchesSearch && matchesStatus && matchesMailbox;
  });

  const stats = {
    totalPieces: mailPieces.length,
    pendingActions: mailPieces.filter(p => p.status === 'received').length,
    inScanning: scanningQueue.filter(s => s.status === 'in_progress').length,
    checkDeposits: checkDeposits.filter(c => c.status === 'captured').length,
  };

  if (loading && mailPieces.length === 0) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <PullToRefresh 
      onRefresh={handleRefresh}
      disabled={loading}
    >
      <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('vm.title')}</h1>
          <p className="text-muted-foreground">{t('vm.subtitle')}</p>
        </div>
        <Button onClick={() => setShowAddMailDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('vm.newMail')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Mail className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalPieces}</p>
                <p className="text-sm text-muted-foreground">{t('vm.totalMail')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pendingActions}</p>
                <p className="text-sm text-muted-foreground">{t('vm.pendingActions')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Scan className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.inScanning}</p>
                <p className="text-sm text-muted-foreground">{t('vm.inScanning')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Camera className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.checkDeposits}</p>
                <p className="text-sm text-muted-foreground">{t('vm.checkDeposits')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('vm.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">{t('vm.status.all')}</option>
              <option value="received">{t('vm.status.received')}</option>
              <option value="notified">{t('vm.status.notified')}</option>
              <option value="action_pending">{t('vm.status.action_pending')}</option>
              <option value="completed">{t('vm.status.completed')}</option>
            </select>

            <select
              value={selectedVirtualMailbox}
              onChange={(e) => setSelectedVirtualMailbox(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">{t('vm.allMailboxes')}</option>
              {virtualMailboxes.map((vm) => (
                <option key={vm.id} value={vm.id}>
                  {vm.address_line1} - {vm.city}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="mail-pieces" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="mail-pieces">{t('vm.tab.mailPieces')}</TabsTrigger>
          <TabsTrigger value="scanning">{t('vm.tab.scanning')}</TabsTrigger>
          <TabsTrigger value="deposits">{t('vm.tab.deposits')}</TabsTrigger>
          <TabsTrigger value="dashboard">{t('vm.tab.dashboard')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('vm.tab.analytics')}</TabsTrigger>
          <TabsTrigger value="billing">{t('vm.tab.billing')}</TabsTrigger>
        </TabsList>

        <TabsContent value="mail-pieces" className="space-y-4">
          <MailPieceList 
            mailPieces={filteredMailPieces}
            loading={loading}
            onActionRequest={(pieceId) => {
              setSelectedMailPiece(pieceId);
              setShowActionDialog(true);
            }}
          />
        </TabsContent>

        <TabsContent value="scanning" className="space-y-4">
          <ScanningQueue 
            queueItems={scanningQueue}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="deposits" className="space-y-4">
          <CheckDepositCapture />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <VirtualMailboxDashboard 
            virtualMailboxes={virtualMailboxes}
            mailPieces={mailPieces}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <VirtualMailReporting />
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <BillingAutomation />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddMailPieceDialog
        open={showAddMailDialog}
        onOpenChange={setShowAddMailDialog}
        virtualMailboxes={virtualMailboxes}
      />

      <MailActionDialog
        open={showActionDialog}
        onOpenChange={setShowActionDialog}
        mailPieceId={selectedMailPiece}
        onClose={() => {
          setShowActionDialog(false);
          setSelectedMailPiece('');
        }}
      />
      </div>
    </PullToRefresh>
  );
}