import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone,
  Tablet,
  Printer,
  Truck,
  Scan,
  Laptop,
  Radio,
  MapPin,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Battery,
  Activity,
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  Wrench,
  BarChart3,
  Bell,
  Zap,
  Shield,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { DeviceInventory } from '@/components/devices/DeviceInventory';
import { MobileDeviceDashboard } from '@/components/devices/MobileDeviceDashboard';
import { AssetTracking } from '@/components/devices/AssetTracking';
import { PrinterManagement } from '@/components/devices/PrinterManagement';
import { VehicleFleet } from '@/components/devices/VehicleFleet';
import { cn } from '@/lib/utils';
import { DeviceType, DeviceStatus, BatteryLevel } from '@/types/devices';

interface DevicesProps {
  onNavigate?: (page: string) => void;
}

const deviceIcons: Record<DeviceType, React.ReactNode> = {
  tablet: <Tablet className="h-5 w-5" />,
  smartphone: <Smartphone className="h-5 w-5" />,
  barcode_scanner: <Scan className="h-5 w-5" />,
  printer: <Printer className="h-5 w-5" />,
  vehicle: <Truck className="h-5 w-5" />,
  laptop: <Laptop className="h-5 w-5" />,
  radio: <Radio className="h-5 w-5" />,
  gps_tracker: <MapPin className="h-5 w-5" />
};

const statusColors: Record<DeviceStatus, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  retired: 'bg-gray-200 text-gray-600',
  lost: 'bg-red-100 text-red-800',
  repair: 'bg-orange-100 text-orange-800'
};

const statusIcons: Record<DeviceStatus, React.ReactNode> = {
  active: <CheckCircle className="h-4 w-4" />,
  inactive: <Clock className="h-4 w-4" />,
  maintenance: <Wrench className="h-4 w-4" />,
  retired: <AlertCircle className="h-4 w-4" />,
  lost: <AlertTriangle className="h-4 w-4" />,
  repair: <Settings className="h-4 w-4" />
};

const batteryColors: Record<BatteryLevel, string> = {
  critical: 'bg-red-500',
  low: 'bg-orange-500',
  medium: 'bg-yellow-500',
  high: 'bg-green-500',
  charging: 'bg-blue-500',
  full: 'bg-green-600'
};

export default function Devices({ onNavigate }: DevicesProps) {
  const {
    devices,
    devicesLoading,
    mobileDevices,
    alerts,
    criticalAlerts,
    analytics,
    analyticsLoading,
    upcomingMaintenance,
    applyFilters,
    clearFilters
  } = useDevices();

  const [activeTab, setActiveTab] = useState('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<DeviceType | 'all'>('all');

  // Calculate overview stats
  const activeDevices = devices.filter(d => d.status === 'active').length;
  const maintenanceDevices = devices.filter(d => d.status === 'maintenance' || d.status === 'repair').length;
  const totalValue = analytics?.overview.totalValue || 0;
  const lowBatteryDevices = mobileDevices.filter(d => 
    d.health.batteryLevel === 'critical' || d.health.batteryLevel === 'low'
  ).length;

  // Apply filters when search or status filter changes
  useEffect(() => {
    applyFilters({
      searchQuery: searchQuery || undefined,
      statuses: statusFilter === 'all' ? undefined : [statusFilter],
      types: typeFilter === 'all' ? undefined : [typeFilter]
    });
  }, [searchQuery, statusFilter, typeFilter, applyFilters]);

  const getBatteryLevelPercentage = (level: BatteryLevel): number => {
    switch (level) {
      case 'critical': return 10;
      case 'low': return 25;
      case 'medium': return 50;
      case 'high': return 75;
      case 'charging': return 60;
      case 'full': return 100;
      default: return 0;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (devicesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Device & Asset Management</h1>
              {criticalAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {criticalAlerts.length} critical alerts
                </Badge>
              )}
            </div>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tablet">Tablets</SelectItem>
                <SelectItem value="smartphone">Smartphones</SelectItem>
                <SelectItem value="barcode_scanner">Scanners</SelectItem>
                <SelectItem value="printer">Printers</SelectItem>
                <SelectItem value="vehicle">Vehicles</SelectItem>
                <SelectItem value="laptop">Laptops</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="border-b bg-muted/30">
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Devices</p>
                    <p className="text-2xl font-bold">{devices.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">{activeDevices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Wrench className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Maintenance</p>
                    <p className="text-2xl font-bold">{maintenanceDevices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Battery className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Low Battery</p>
                    <p className="text-2xl font-bold">{lowBatteryDevices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alerts</p>
                    <p className="text-2xl font-bold">{alerts.filter(a => !a.resolved).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Device Type Overview */}
      <div className="border-b bg-background">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Device Overview</h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Live monitoring active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {Object.entries(deviceIcons).map(([type, icon]) => {
              const typeDevices = devices.filter(d => d.type === type);
              const activeTypeDevices = typeDevices.filter(d => d.status === 'active');
              
              if (typeDevices.length === 0) return null;
              
              return (
                <Card key={type} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="p-1.5 bg-blue-100 rounded">
                        {icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium capitalize">{type.replace('_', ' ')}</h3>
                        <p className="text-xs text-muted-foreground">
                          {activeTypeDevices.length}/{typeDevices.length} active
                        </p>
                      </div>
                    </div>
                    
                    <Progress 
                      value={(activeTypeDevices.length / typeDevices.length) * 100} 
                      className="h-1" 
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <div className="border-b bg-red-50 border-red-200">
          <div className="px-6 py-3">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Critical Alerts Require Attention</h3>
                <p className="text-xs text-red-700">
                  {criticalAlerts.length} critical alert{criticalAlerts.length !== 1 ? 's' : ''} need immediate attention
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                <Eye className="h-3 w-3 mr-1" />
                View Alerts
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Battery Health Overview */}
      {mobileDevices.length > 0 && (
        <div className="border-b bg-background">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Mobile Device Battery Status</h2>
              <Badge variant="secondary" className="text-xs">
                {mobileDevices.length} devices monitored
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {mobileDevices.slice(0, 6).map((device) => (
                <Card key={device.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {deviceIcons[device.type]}
                        <span className="text-sm font-medium">{device.name.split('#')[1] || device.name}</span>
                      </div>
                      <Badge className={cn("text-xs", statusColors[device.status])}>
                        {statusIcons[device.status]}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Battery</span>
                        <span className="font-medium">{device.health.batteryPercentage}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={device.health.batteryPercentage} 
                          className="flex-1 h-2"
                          color={batteryColors[device.health.batteryLevel]}
                        />
                        <Battery 
                          className={cn(
                            "h-3 w-3",
                            device.health.batteryLevel === 'critical' ? 'text-red-500' :
                            device.health.batteryLevel === 'low' ? 'text-orange-500' :
                            device.health.batteryLevel === 'medium' ? 'text-yellow-500' :
                            'text-green-500'
                          )} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Health</span>
                        <span className="font-medium">{device.health.batteryHealth}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Tabs */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-5 rounded-none border-b bg-background">
            <TabsTrigger value="inventory" className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span>Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center space-x-2">
              <Tablet className="h-4 w-4" />
              <span>Mobile Devices</span>
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center space-x-2">
              <Scan className="h-4 w-4" />
              <span>Asset Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="printers" className="flex items-center space-x-2">
              <Printer className="h-4 w-4" />
              <span>Printers</span>
            </TabsTrigger>
            <TabsTrigger value="fleet" className="flex items-center space-x-2">
              <Truck className="h-4 w-4" />
              <span>Fleet</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="h-full m-0 p-6">
            <DeviceInventory />
          </TabsContent>

          <TabsContent value="mobile" className="h-full m-0 p-6">
            <MobileDeviceDashboard />
          </TabsContent>

          <TabsContent value="assets" className="h-full m-0 p-6">
            <AssetTracking />
          </TabsContent>

          <TabsContent value="printers" className="h-full m-0 p-6">
            <PrinterManagement />
          </TabsContent>

          <TabsContent value="fleet" className="h-full m-0 p-6">
            <VehicleFleet />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 