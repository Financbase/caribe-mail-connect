import { useState } from 'react';
import { Battery, Signal, Wifi, Bluetooth, Settings, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { IotDevice } from '@/hooks/useIotTracking';

interface IotDeviceCardProps {
  device: IotDevice;
  onUpdate?: (deviceId: string, updates: Partial<IotDevice>) => void;
  onDelete?: (deviceId: string) => void;
  className?: string;
}

export function IotDeviceCard({ 
  device, 
  onUpdate, 
  onDelete, 
  className = '' 
}: IotDeviceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    device_name: device.device_name,
    status: device.status,
    is_active: device.status === 'active'
  });

  const getNetworkIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi className="w-4 h-4 text-green-500" />;
      case 'offline': return <Signal className="w-4 h-4 text-red-500" />;
      case 'low_signal': return <Signal className="w-4 h-4 text-yellow-500" />;
      default: return <Bluetooth className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-500';
    if (level > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBatteryIcon = (level: number) => {
    if (level > 80) return <Battery className="w-4 h-4" />;
    if (level > 40) return <Battery className="w-4 h-4" />;
    return <Battery className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'retired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'tracker': return <Activity className="w-4 h-4" />;
      case 'sensor': return <Activity className="w-4 h-4" />;
      case 'gateway': return <Wifi className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(device.id, {
        device_name: editForm.device_name,
        status: editForm.is_active ? 'active' : 'inactive'
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this device?')) {
      onDelete(device.id);
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getDeviceTypeIcon(device.device_type)}
            <CardTitle className="text-lg">{device.device_name}</CardTitle>
          </div>
          <Badge className={getStatusColor(device.status)}>
            {device.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">{device.serial_number}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Network Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getNetworkIcon(device.network_status)}
            <span className="text-sm">Network</span>
          </div>
          <span className={`text-sm font-medium ${
            device.network_status === 'online' ? 'text-green-600' :
            device.network_status === 'offline' ? 'text-red-600' :
            'text-yellow-600'
          }`}>
            {device.network_status}
          </span>
        </div>

        {/* Battery Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={getBatteryColor(device.battery_level)}>
                {getBatteryIcon(device.battery_level)}
              </div>
              <span className="text-sm">Battery</span>
            </div>
            <span className={`text-sm font-medium ${getBatteryColor(device.battery_level)}`}>
              {device.battery_level}%
            </span>
          </div>
          <Progress value={device.battery_level} className="h-2" />
        </div>

        {/* Device Info */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium capitalize">{device.device_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Firmware:</span>
            <span className="font-medium">{device.firmware_version}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Seen:</span>
            <span className="font-medium">
              {new Date(device.last_seen).toLocaleTimeString()}
            </span>
          </div>
          {device.assigned_package_id && (
            <div className="flex justify-between">
              <span className="text-gray-600">Assigned Package:</span>
              <span className="font-medium text-blue-600">Active</span>
            </div>
          )}
        </div>

        {/* Location */}
        {device.location && (
          <div className="text-sm">
            <span className="text-gray-600">Location: </span>
            <span className="font-medium">
              {device.location.lat.toFixed(4)}, {device.location.lng.toFixed(4)}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="w-4 h-4 mr-1" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configure Device</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="device-name">Device Name</Label>
                  <Input
                    id="device-name"
                    value={editForm.device_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, device_name: e.target.value }))}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="device-active"
                    checked={editForm.is_active}
                    onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="device-active">Device Active</Label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 