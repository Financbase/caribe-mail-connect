import { useState, useMemo } from 'react';
import { ArrowLeft, Bell, Send, Clock, CheckCircle, XCircle, Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { mockNotifications, mockNotificationBatches } from '@/data/notificationData';
import { mockPackages } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { MobileHeader } from '@/components/MobileHeader';

interface NotificationsProps {
  onNavigate: (page: string) => void;
}

const Notifications = ({ onNavigate }: NotificationsProps) => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [showBatchDialog, setShowBatchDialog] = useState(false);

  // Filter notifications based on search and status
  const filteredNotifications = useMemo(() => {
    return mockNotifications.filter(notification => {
      const matchesSearch = 
        notification.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Get packages that can be notified (Ready status)
  const readyPackages = mockPackages.filter(pkg => pkg.status === 'Ready');

  const handlePackageSelection = (packageId: string, checked: boolean) => {
    if (checked) {
      setSelectedPackages(prev => [...prev, packageId]);
    } else {
      setSelectedPackages(prev => prev.filter(id => id !== packageId));
    }
  };

  const handleBatchNotify = () => {
    if (selectedPackages.length === 0) {
      toast({
        title: language === 'en' ? 'No packages selected' : 'No hay paquetes seleccionados',
        description: language === 'en' ? 'Please select at least one package to notify.' : 'Por favor selecciona al menos un paquete para notificar.',
        variant: 'destructive'
      });
      return;
    }

    // Simulate batch notification
    toast({
      title: language === 'en' ? 'Notifications sent' : 'Notificaciones enviadas',
      description: language === 'en' 
        ? `Sent notifications for ${selectedPackages.length} packages` 
        : `Se enviaron notificaciones para ${selectedPackages.length} paquetes`
    });

    setSelectedPackages([]);
    setShowBatchDialog(false);
  };

  const handleRetryNotification = (notificationId: string) => {
    toast({
      title: language === 'en' ? 'Notification retry' : 'Reintento de notificación',
      description: language === 'en' ? 'Notification queued for retry' : 'Notificación programada para reintento'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'default' as const,
      pending: 'secondary' as const,
      failed: 'destructive' as const
    };

    const labels = {
      sent: language === 'en' ? 'Sent' : 'Enviado',
      pending: language === 'en' ? 'Pending' : 'Pendiente',
      failed: language === 'en' ? 'Failed' : 'Fallido'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getChannelIcons = (channels: string[]) => {
    const icons = {
      sms: '💬',
      email: '📧',
      whatsapp: '📱'
    };

    return channels.map(channel => icons[channel as keyof typeof icons]).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <MobileHeader title={language === 'en' ? 'Notifications' : 'Notificaciones'} showLogout />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {language === 'en' ? 'Back' : 'Volver'}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {language === 'en' ? 'Notifications' : 'Notificaciones'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'en' ? 'Manage customer notifications' : 'Gestionar notificaciones de clientes'}
              </p>
            </div>
          </div>

          <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {language === 'en' ? 'Notify All' : 'Notificar Todo'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'en' ? 'Batch Notifications' : 'Notificaciones en Lote'}
                </DialogTitle>
                <DialogDescription>
                  {language === 'en' 
                    ? 'Select packages to send ready-for-pickup notifications'
                    : 'Selecciona paquetes para enviar notificaciones de listo para recoger'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {readyPackages.map(pkg => (
                    <div key={pkg.id} className="flex items-center space-x-2 p-2 border rounded">
                      <Checkbox
                        id={pkg.id}
                        checked={selectedPackages.includes(pkg.id)}
                        onCheckedChange={(checked) => 
                          handlePackageSelection(pkg.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={pkg.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{pkg.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {pkg.trackingNumber} • {pkg.carrier}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <span className="text-sm text-muted-foreground">
                    {selectedPackages.length} {language === 'en' ? 'packages selected' : 'paquetes seleccionados'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowBatchDialog(false)}>
                      {language === 'en' ? 'Cancel' : 'Cancelar'}
                    </Button>
                    <Button onClick={handleBatchNotify}>
                      <Send className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Send Notifications' : 'Enviar Notificaciones'}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Total Sent' : 'Total Enviadas'}
                  </p>
                  <p className="text-2xl font-bold">
                    {mockNotifications.filter(n => n.status === 'sent').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Pending' : 'Pendientes'}
                  </p>
                  <p className="text-2xl font-bold">
                    {mockNotifications.filter(n => n.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Failed' : 'Fallidas'}
                  </p>
                  <p className="text-2xl font-bold">
                    {mockNotifications.filter(n => n.status === 'failed').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Ready to Notify' : 'Listos para Notificar'}
                  </p>
                  <p className="text-2xl font-bold">{readyPackages.length}</p>
                </div>
                <Bell className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'en' ? 'Search notifications...' : 'Buscar notificaciones...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === 'en' ? 'All Status' : 'Todos los Estados'}
                  </SelectItem>
                  <SelectItem value="pending">
                    {language === 'en' ? 'Pending' : 'Pendientes'}
                  </SelectItem>
                  <SelectItem value="sent">
                    {language === 'en' ? 'Sent' : 'Enviadas'}
                  </SelectItem>
                  <SelectItem value="failed">
                    {language === 'en' ? 'Failed' : 'Fallidas'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Tabs */}
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">
              {language === 'en' ? 'Notifications' : 'Notificaciones'}
            </TabsTrigger>
            <TabsTrigger value="batches">
              {language === 'en' ? 'Batch History' : 'Historial de Lotes'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {filteredNotifications.map(notification => (
              <Card key={notification.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{notification.customerName}</CardTitle>
                      <CardDescription>
                        {notification.trackingNumber} • {notification.type === 'arrival' ? 
                          (language === 'en' ? 'Package Arrival' : 'Llegada de Paquete') :
                          notification.type === 'ready' ?
                          (language === 'en' ? 'Ready for Pickup' : 'Listo para Recoger') :
                          (language === 'en' ? 'Delivery Confirmation' : 'Confirmación de Entrega')
                        }
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(notification.status)}
                      {getStatusBadge(notification.status)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <strong>{language === 'en' ? 'Channels:' : 'Canales:'}</strong> {getChannelIcons(notification.channels)} {notification.channels.join(', ')}
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{notification.message}</p>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>
                        {language === 'en' ? 'Created:' : 'Creado:'} {new Date(notification.createdAt).toLocaleString()}
                      </span>
                      {notification.sentAt && (
                        <span>
                          {language === 'en' ? 'Sent:' : 'Enviado:'} {new Date(notification.sentAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {notification.error && (
                      <div className="flex items-center justify-between p-2 bg-destructive/10 rounded">
                        <span className="text-sm text-destructive">{notification.error}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetryNotification(notification.id)}
                        >
                          {language === 'en' ? 'Retry' : 'Reintentar'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredNotifications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {language === 'en' ? 'No notifications found' : 'No se encontraron notificaciones'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'en' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Intenta ajustar tus criterios de búsqueda o filtro'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="batches" className="space-y-4">
            {mockNotificationBatches.map(batch => (
              <Card key={batch.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Batch {batch.id}</CardTitle>
                      <CardDescription>
                        {batch.packageIds.length} {language === 'en' ? 'packages' : 'paquetes'}
                      </CardDescription>
                    </div>
                    <Badge variant={batch.status === 'completed' ? 'default' : 'secondary'}>
                      {batch.status === 'completed' ? 
                        (language === 'en' ? 'Completed' : 'Completado') :
                        batch.status === 'processing' ?
                        (language === 'en' ? 'Processing' : 'Procesando') :
                        (language === 'en' ? 'Pending' : 'Pendiente')
                      }
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {language === 'en' ? 'Created:' : 'Creado:'} {new Date(batch.createdAt).toLocaleString()}
                    </span>
                    {batch.completedAt && (
                      <span>
                        {language === 'en' ? 'Completed:' : 'Completado:'} {new Date(batch.completedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;