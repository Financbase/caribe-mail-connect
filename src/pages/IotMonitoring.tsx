import { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Battery, 
  Bluetooth, 
  Clock, 
  Globe, 
  MapPin, 
  Package, 
  Settings, 
  Signal, 
  Thermometer, 
  Wifi,
  Zap,
  Eye,
  EyeOff,
  RefreshCw,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIotTracking } from '@/hooks/useIotTracking';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from '@/hooks/use-toast';

interface IotMonitoringProps {
  onNavigate: (page: string) => void;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  headers: Record<string, string>;
  is_active: boolean;
  retry_count: number;
  timeout_seconds: number;
}

export default function IotMonitoring({ onNavigate }: IotMonitoringProps) {
  const { t } = useLanguage();
  const {
    devices,
    alerts,
    routes,
    webhooks,
    activeTrackings,
    loading,
    error,
    acknowledgeAlert,
    resolveAlert,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    fetchDevices,
    fetchAlerts,
    fetchWebhooks
  } = useIotTracking();

  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showOfflineDevices, setShowOfflineDevices] = useState(false);
  const [alertFilter, setAlertFilter] = useState<string>('all');
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<any>(null);
  const [webhookForm, setWebhookForm] = useState({
    name: '',
    url: '',
    events: [] as string[],
    headers: {},
    is_active: true,
    retry_count: 3,
    timeout_seconds: 30
  });

  const availableEvents = [
    'package.location_update',
    'package.status_change',
    'package.environmental_alert',
    'package.shock_detected',
    'device.battery_low',
    'device.offline',
    'alert.created',
    'alert.resolved'
  ];

  // Device status calculations
  const onlineDevices = devices.filter(d => d.network_status === 'online');
  const offlineDevices = devices.filter(d => d.network_status === 'offline');
  const lowBatteryDevices = devices.filter(d => d.battery_level < 20);
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate device status changes
      if (Math.random() > 0.95) {
        fetchDevices();
      }
      
      // Simulate new alerts
      if (Math.random() > 0.98) {
        fetchAlerts();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchDevices, fetchAlerts]);

  const handleWebhookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingWebhook) {
        await updateWebhook(editingWebhook.id, webhookForm);
        toast({
          title: "Webhook Updated",
          description: "Webhook configuration has been updated successfully.",
        });
      } else {
        await createWebhook(webhookForm);
        toast({
          title: "Webhook Created",
          description: "New webhook configuration has been created successfully.",
        });
      }
      
      setWebhookDialogOpen(false);
      setEditingWebhook(null);
      setWebhookForm({
        name: '',
        url: '',
        events: [],
        headers: {},
        is_active: true,
        retry_count: 3,
        timeout_seconds: 30
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save webhook configuration.",
        variant: "destructive"
      });
    }
  };

  const handleEditWebhook = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setWebhookForm({
      name: webhook.name,
      url: webhook.url,
      events: webhook.events || [],
      headers: webhook.headers || {},
      is_active: webhook.is_active,
      retry_count: webhook.retry_count,
      timeout_seconds: webhook.timeout_seconds
    });
    setWebhookDialogOpen(true);
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    try {
      await deleteWebhook(webhookId);
      toast({
        title: "Webhook Deleted",
        description: "Webhook configuration has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete webhook configuration.",
        variant: "destructive"
      });
    }
  };

  const getDeviceStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-red-500';
      case 'low_signal': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-500';
    if (level > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Zap className="text-blue-600" />
              IoT Monitoring Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time monitoring of package tracking devices and environmental sensors
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchDevices();
                fetchAlerts();
                fetchWebhooks();
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => onNavigate('/')}
              variant="outline"
              size="sm"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
              <Bluetooth className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{devices.length}</div>
              <p className="text-xs text-muted-foreground">
                {onlineDevices.length} online, {offlineDevices.length} offline
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
              <p className="text-xs text-muted-foreground">
                {criticalAlerts.length} critical
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {routes.filter(r => r.status === 'in_progress').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {routes.filter(r => r.status === 'planned').length} planned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tracked Packages</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTrackings.length}</div>
              <p className="text-xs text-muted-foreground">
                Real-time tracking active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="devices" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>IoT Devices</CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={showOfflineDevices}
                      onCheckedChange={setShowOfflineDevices}
                    />
                    <Label>Show Offline</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {devices
                    .filter(d => showOfflineDevices || d.network_status === 'online')
                    .map(device => (
                    <Card key={device.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{device.device_name}</h3>
                          <p className="text-sm text-gray-500">{device.serial_number}</p>
                        </div>
                        <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
                          {device.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Signal className="w-3 h-3" />
                            Network
                          </span>
                          <span className={getDeviceStatusColor(device.network_status)}>
                            {device.network_status}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Battery className="w-3 h-3" />
                            Battery
                          </span>
                          <span className={getBatteryColor(device.battery_level)}>
                            {device.battery_level}%
                          </span>
                        </div>
                        
                        <Progress value={device.battery_level} className="h-2" />
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last Seen
                          </span>
                          <span className="text-gray-500">
                            {new Date(device.last_seen).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>System Alerts</CardTitle>
                  <Select value={alertFilter} onValueChange={setAlertFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter alerts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Alerts</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="critical">Critical Only</SelectItem>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="shock">Shock</SelectItem>
                      <SelectItem value="battery">Battery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts
                    .filter(alert => {
                      if (alertFilter === 'all') return true;
                      if (alertFilter === 'active') return alert.status === 'active';
                      if (alertFilter === 'critical') return alert.severity === 'critical';
                      return alert.alert_type === alertFilter;
                    })
                    .map(alert => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getAlertSeverityColor(alert.severity)}`} />
                        <div>
                          <h4 className="font-medium">{alert.title}</h4>
                          <p className="text-sm text-gray-600">{alert.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(alert.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'}>
                          {alert.status}
                        </Badge>
                        
                        {alert.status === 'active' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Acknowledge
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveAlert(alert.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Resolve
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Tracking Tab */}
          <TabsContent value="tracking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Package Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                {activeTrackings.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No active package tracking</p>
                    <Button 
                      onClick={() => onNavigate('/packages')}
                      className="mt-2"
                    >
                      Start Tracking
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTrackings.map(journey => (
                      <Card key={journey.package_id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">#{journey.tracking_number}</h3>
                            <p className="text-sm text-gray-500">{journey.status}</p>
                          </div>
                          <Badge variant="outline">
                            {journey.events.length} events
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Location:</span>
                            <span className="text-gray-600">
                              {journey.current_location.lat.toFixed(4)}, {journey.current_location.lng.toFixed(4)}
                            </span>
                          </div>
                          
                          {journey.estimated_delivery && (
                            <div className="flex items-center justify-between">
                              <span>ETA:</span>
                              <span className="text-gray-600">
                                {new Date(journey.estimated_delivery).toLocaleString()}
                              </span>
                            </div>
                          )}
                          
                          {journey.environmental_data.temperature && (
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <Thermometer className="w-3 h-3" />
                                Temperature:
                              </span>
                              <span className="text-gray-600">
                                {journey.environmental_data.temperature}°C
                              </span>
                            </div>
                          )}
                          
                          {journey.environmental_data.shock_events.length > 0 && (
                            <div className="flex items-center justify-between">
                              <span>Shock Events:</span>
                              <span className="text-red-600">
                                {journey.environmental_data.shock_events.length}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-3"
                          onClick={() => onNavigate(`/packages/${journey.package_id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Webhook Configurations</CardTitle>
                  <Button onClick={() => setWebhookDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Webhook
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhooks.map(webhook => (
                    <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{webhook.name}</h4>
                        <p className="text-sm text-gray-600">{webhook.url}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={webhook.is_active ? 'default' : 'secondary'}>
                            {webhook.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {webhook.events?.length || 0} events
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditWebhook(webhook)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this webhook configuration? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteWebhook(webhook.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Webhook Dialog */}
        <Dialog open={webhookDialogOpen} onOpenChange={setWebhookDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingWebhook ? 'Edit Webhook' : 'Add Webhook'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleWebhookSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={webhookForm.name}
                  onChange={(e) => setWebhookForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={webhookForm.url}
                  onChange={(e) => setWebhookForm(prev => ({ ...prev, url: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label>Events</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableEvents.map(event => (
                    <div key={event} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={event}
                        checked={webhookForm.events.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWebhookForm(prev => ({
                              ...prev,
                              events: [...prev.events, event]
                            }));
                          } else {
                            setWebhookForm(prev => ({
                              ...prev,
                              events: prev.events.filter(e => e !== event)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={event} className="text-sm">{event}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={webhookForm.is_active}
                  onCheckedChange={(checked) => setWebhookForm(prev => ({ ...prev, is_active: checked }))}
                />
                <Label>Active</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setWebhookDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingWebhook ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 