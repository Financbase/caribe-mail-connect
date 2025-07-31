import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Battery,
  Wrench,
  Calendar,
  QrCode,
  Download,
  Upload
} from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { Device, DeviceType, DeviceStatus, BatteryLevel } from '@/types/devices';

interface DeviceInventoryProps {
  devices: Device[];
  devicesLoading: boolean;
  onDeviceUpdate: (deviceId: string, updates: Partial<Device>) => void;
  onDeviceDelete: (deviceId: string) => void;
  onMaintenanceSchedule: (deviceId: string) => void;
}

export const DeviceInventory: React.FC<DeviceInventoryProps> = ({
  devices,
  devicesLoading,
  onDeviceUpdate,
  onDeviceDelete,
  onMaintenanceSchedule
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<DeviceType | 'all'>('all');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Filter devices based on search and filters
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          device.assetTag.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
      const matchesType = typeFilter === 'all' || device.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [devices, searchTerm, statusFilter, typeFilter]);

  // Get device icon
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'barcode_scanner': return <Scan className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'printer': return <Printer className="h-4 w-4" />;
      case 'vehicle': return <Truck className="h-4 w-4" />;
      case 'smartphone': return <Smartphone className="h-4 w-4" />;
      case 'laptop': return <Laptop className="h-4 w-4" />;
      case 'radio': return <Radio className="h-4 w-4" />;
      case 'gps_tracker': return <MapPin className="h-4 w-4" />;
      default: return <Smartphone className="h-4 w-4" />;
    }
  };

  // Get status badge variant
  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case 'active': return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'inactive': return <Badge variant="secondary">Inactive</Badge>;
      case 'maintenance': return <Badge variant="default" className="bg-yellow-500">Maintenance</Badge>;
      case 'repair': return <Badge variant="destructive">Repair</Badge>;
      case 'retired': return <Badge variant="outline">Retired</Badge>;
      case 'lost': return <Badge variant="destructive">Lost</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Get battery level display
  const getBatteryDisplay = (level: BatteryLevel) => {
    const getColor = () => {
      switch (level) {
        case 'critical': return 'bg-red-500';
        case 'low': return 'bg-orange-500';
        case 'medium': return 'bg-yellow-500';
        case 'high': return 'bg-green-500';
        case 'full': return 'bg-green-600';
        case 'charging': return 'bg-blue-500';
        default: return 'bg-gray-500';
      }
    };

    const getPercentage = () => {
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

    return (
      <div className="flex items-center gap-2">
        <Battery className="h-4 w-4" />
        <Progress value={getPercentage()} className={`w-16 h-2 ${getColor()}`} />
        <span className="text-xs capitalize">{level}</span>
      </div>
    );
  };

  // Calculate device statistics
  const deviceStats = useMemo(() => {
    const stats = {
      total: devices.length,
      active: devices.filter(d => d.status === 'active').length,
      maintenance: devices.filter(d => d.status === 'maintenance').length,
      offline: devices.filter(d => d.status === 'inactive').length,
      lowBattery: devices.filter(d => d.batteryLevel === 'critical' || d.batteryLevel === 'low').length
    };
    return stats;
  }, [devices]);

  if (devicesLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Devices</p>
                <p className="text-2xl font-bold">{deviceStats.total}</p>
              </div>
              <Smartphone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{deviceStats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{deviceStats.maintenance}</p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offline</p>
                <p className="text-2xl font-bold text-red-600">{deviceStats.offline}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Battery</p>
                <p className="text-2xl font-bold text-orange-600">{deviceStats.lowBattery}</p>
              </div>
              <Battery className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Device Inventory</CardTitle>
              <CardDescription>Manage all devices and equipment</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search devices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DeviceStatus | 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
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
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as DeviceType | 'all')}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Device Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="barcode_scanner">Barcode Scanner</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="printer">Printer</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="smartphone">Smartphone</SelectItem>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="radio">Radio</SelectItem>
                <SelectItem value="gps_tracker">GPS Tracker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Device Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead>Last Check-in</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(device.type)}
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-gray-500">{device.serialNumber}</div>
                          <div className="text-xs text-gray-400">Tag: {device.assetTag}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{device.type.replace('_', ' ')}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(device.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {device.location}
                      </div>
                    </TableCell>
                    <TableCell>{device.assignedTo || 'Unassigned'}</TableCell>
                    <TableCell>
                      {device.batteryLevel ? getBatteryDisplay(device.batteryLevel) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(device.lastCheckIn).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDevice(device)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMaintenanceSchedule(device.id)}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeviceDelete(device.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDevices.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No devices found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <QrCode className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-medium">Bulk Check-in</h3>
                <p className="text-sm text-gray-600">Scan multiple devices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Calendar className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-medium">Schedule Maintenance</h3>
                <p className="text-sm text-gray-600">Plan upcoming maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Upload className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-medium">Import Devices</h3>
                <p className="text-sm text-gray-600">Bulk upload from CSV</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 