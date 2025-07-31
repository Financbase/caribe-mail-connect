import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
  Smartphone,
  Tablet,
  Battery,
  BatteryLow,
  Wifi,
  WifiOff,
  Signal,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Settings,
  Activity,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Lock,
  Unlock,
  Shield,
  Zap,
  Eye,
  Users
} from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { MobileDevice, BatteryLevel, DeviceStatus } from '@/types/devices';

interface MobileDeviceDashboardProps {
  onDeviceSelect?: (device: MobileDevice) => void;
}

// Utility function to get battery percentage
const getBatteryPercentage = (level: BatteryLevel): number => {
  switch (level) {
    case 'critical': return 5;
    case 'low': return 25;
    case 'medium': return 50;
    case 'high': return 75;
    case 'full': return 100;
    case 'charging': return 60;
    default: return 0;
  }
};

export const MobileDeviceDashboard: React.FC<MobileDeviceDashboardProps> = ({
  onDeviceSelect
}) => {
  const {
    mobileDevices,
    mobileDevicesLoading,
    deviceAlerts,
    updateDevice,
    deployUpdate,
    remoteWipeDevice,
    refreshDeviceStatus,
    lockDevice,
    unlockDevice,
    locateDevice,
    filters,
    setFilters
  } = useDevices();

  const [selectedDevice, setSelectedDevice] = useState<MobileDevice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | 'all'>('all');
  const [batteryFilter, setBatteryFilter] = useState<BatteryLevel | 'all'>('all');
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showWipeDialog, setShowWipeDialog] = useState(false);

  // Auto-refresh device status every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshDeviceStatus();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshDeviceStatus]);

  // Filter devices based on search and filters
  const filteredDevices = mobileDevices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        device.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchesBattery = batteryFilter === 'all' || device.batteryLevel === batteryFilter;

    return matchesSearch && matchesStatus && matchesBattery;
  });

  // Get battery icon based on level
  const getBatteryIcon = (level: BatteryLevel) => {
    switch (level) {
      case 'critical':
      case 'low':
        return BatteryLow;
      case 'medium':
        return Battery;
      default:
        return Battery;
    }
  };

  // Get battery color based on level
  const getBatteryColor = (level: BatteryLevel) => {
    switch (level) {
      case 'critical':
        return 'text-red-500';
      case 'low':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  // Get device status color
  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'repair':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  // Handle device selection
  const handleDeviceSelection = (deviceId: string, selected: boolean) => {
    if (selected) {
      setSelectedDevices(prev => [...prev, deviceId]);
    } else {
      setSelectedDevices(prev => prev.filter(id => id !== deviceId));
    }
  };

  // Handle bulk update deployment
  const handleBulkUpdate = async () => {
    if (selectedDevices.length === 0) return;

    try {
      await Promise.all(selectedDevices.map(deviceId =>
        deployUpdate(deviceId, '2.1.0')
      ));
      setShowUpdateDialog(false);
      setSelectedDevices([]);
    } catch (error) {
      console.error('Failed to deploy updates:', error);
    }
  };

  // Handle bulk remote wipe
  const handleBulkWipe = async () => {
    if (selectedDevices.length === 0) return;

    try {
      await Promise.all(selectedDevices.map(deviceId =>
        remoteWipeDevice(deviceId)
      ));
      setShowWipeDialog(false);
      setSelectedDevices([]);
    } catch (error) {
      console.error('Failed to wipe devices:', error);
    }
  };

  // Calculate overview metrics
  const totalDevices = mobileDevices.length;
  const activeDevices = mobileDevices.filter(d => d.status === 'active').length;
  const lowBatteryDevices = mobileDevices.filter(d =>
    d.batteryLevel === 'critical' || d.batteryLevel === 'low'
  ).length;
  const outdatedApps = mobileDevices.filter(d =>
    d.appVersion !== d.availableUpdate
  ).length;

  if (mobileDevicesLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Devices</p>
                <p className="text-2xl font-bold">{totalDevices}</p>
              </div>
              <Smartphone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeDevices}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Battery</p>
                <p className="text-2xl font-bold text-orange-600">{lowBatteryDevices}</p>
              </div>
              <Battery className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Updates Needed</p>
                <p className="text-2xl font-bold text-blue-600">{outdatedApps}</p>
              </div>
              <Download className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Mobile Device Management</CardTitle>
              <CardDescription>Monitor and manage mobile devices remotely</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => refreshDeviceStatus()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              {selectedDevices.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setShowWipeDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Remote Wipe ({selectedDevices.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: DeviceStatus | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={batteryFilter} onValueChange={(value: BatteryLevel | 'all') => setBatteryFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by battery" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Battery</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="charging">Charging</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setShowUpdateDialog(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Bulk Update
            </Button>
          </div>

          {/* Device Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDevices.map((device) => (
              <Card
                key={device.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedDevices.includes(device.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  if (selectedDevices.includes(device.id)) {
                    setSelectedDevices(selectedDevices.filter(id => id !== device.id));
                  } else {
                    setSelectedDevices([...selectedDevices, device.id]);
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedDevices.includes(device.id)}
                        onChange={(e) => handleDeviceSelection(device.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      {device.type === 'tablet' ? (
                        <Tablet className="h-8 w-8 text-blue-500" />
                      ) : (
                        <Smartphone className="h-8 w-8 text-green-500" />
                      )}
                      <div>
                        <h3 className="font-semibold">{device.name}</h3>
                        <p className="text-sm text-muted-foreground">{device.model}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(device.status)}>
                      {device.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Battery Status */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Battery</span>
                      <span className={getBatteryColor(device.batteryLevel)}>
                        {getBatteryPercentage(device.batteryLevel)}%
                      </span>
                    </div>
                    <Progress
                      value={getBatteryPercentage(device.batteryLevel)}
                      className="h-2"
                    />
                  </div>

                  {/* Connection Status */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Wifi className={`h-4 w-4 ${device.wifiConnected ? 'text-green-500' : 'text-gray-400'}`} />
                      <span>WiFi: {device.wifiConnected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Signal className={`h-4 w-4 ${device.cellularSignal && device.cellularSignal > 2 ? 'text-green-500' : 'text-orange-500'}`} />
                      <span>{device.cellularSignal}/4</span>
                    </div>
                  </div>

                  {/* App Version */}
                  <div className="flex items-center justify-between text-sm">
                    <span>App Version: {device.appVersion}</span>
                    {device.hasUpdates && (
                      <Badge variant="outline" className="text-blue-600">
                        Update Available
                      </Badge>
                    )}
                  </div>

                  {/* Assigned User */}
                  {device.assignedTo && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Assigned to: {device.assignedTo}</span>
                    </div>
                  )}

                  {/* Last Seen */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Last seen: {new Date(device.lastSeen).toLocaleString()}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeviceSelect?.(device)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {device.hasUpdates && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deployUpdate(device.id, device.availableUpdate || '')}
                        className="flex-1"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Update
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedDevice(device);
                        setShowWipeDialog(true);
                      }}
                      className="flex-1"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Wipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDevices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No devices found matching the current filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Deployment Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deploy Updates</DialogTitle>
            <DialogDescription>
              Deploy app updates to {selectedDevices.length} selected devices
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Update Version</label>
              <Select defaultValue="2.1.0">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2.1.0">v2.1.0 (Latest)</SelectItem>
                  <SelectItem value="2.0.5">v2.0.5</SelectItem>
                  <SelectItem value="2.0.4">v2.0.4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="force-update" />
                <label htmlFor="force-update" className="text-sm">Force update (override user control)</label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="wifi-only" defaultChecked />
                <label htmlFor="wifi-only" className="text-sm">WiFi only download</label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate}>
              Deploy Updates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remote Wipe Dialog */}
      <Dialog open={showWipeDialog} onOpenChange={setShowWipeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remote Wipe Device</DialogTitle>
            <DialogDescription>
              This action will permanently erase all data on the selected device(s). This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              WARNING: This will remove all apps, data, and settings from the device.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWipeDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkWipe}
            >
              Wipe Device{selectedDevices.length > 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 