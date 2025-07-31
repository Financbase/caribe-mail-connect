import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Truck,
  Car,
  Fuel,
  Calendar,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Route,
  Wrench,
  BarChart3,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Edit,
  Settings,
  Navigation,
  Activity,
  TrendingUp,
  DollarSign,
  Timer,
  Gauge
} from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { Vehicle, VehicleType, FuelType, FuelRecord } from '@/types/devices';

interface VehicleFleetProps {
  onVehicleUpdate?: (vehicleId: string, updates: Partial<Vehicle>) => void;
}

// Mock fuel records
const mockFuelRecords: FuelRecord[] = [
  {
    id: 'fuel-001',
    vehicleId: 'vehicle-001',
    date: '2024-01-24T08:30:00Z',
    fuelType: 'gasoline',
    amount: 45.2,
    cost: 68.50,
    pricePerGallon: 1.515,
    odometer: 45230,
    location: 'Shell Station - Bayamón',
    driverId: 'driver-001',
    driverName: 'Carlos Rodriguez',
    receiptNumber: 'R-2024-001'
  },
  {
    id: 'fuel-002',
    vehicleId: 'vehicle-002',
    date: '2024-01-23T14:15:00Z',
    fuelType: 'diesel',
    amount: 52.8,
    cost: 82.40,
    pricePerGallon: 1.561,
    odometer: 28440,
    location: 'Puma Gas - San Juan',
    driverId: 'driver-002',
    driverName: 'Maria Santos',
    receiptNumber: 'R-2024-002'
  }
];

export function VehicleFleet({ onVehicleUpdate }: VehicleFleetProps) {
  const { 
    vehicles,
    vehiclesLoading,
    fuelRecords,
    addFuelRecord,
    updateVehicle,
    assignDriver,
    unassignDriver,
    scheduleMaintenanceVehicle,
    getVehicleRoutes
  } = useDevices();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<VehicleType | 'all'>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showFuelDialog, setShowFuelDialog] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showRouteDialog, setShowRouteDialog] = useState(false);

  // Form states
  const [fuelForm, setFuelForm] = useState({
    amount: '',
    cost: '',
    pricePerGallon: '',
    odometer: '',
    location: '',
    receiptNumber: '',
    notes: ''
  });

  const [assignForm, setAssignForm] = useState({
    driverId: '',
    driverName: '',
    notes: ''
  });

  // Use mock data if real data not available
  const displayFuelRecords = fuelRecords?.length > 0 ? fuelRecords : mockFuelRecords;

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesSearch = vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.assignedDriver?.driverName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
      const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [vehicles, searchTerm, statusFilter, typeFilter]);

  // Calculate fleet statistics
  const fleetStats = useMemo(() => {
    const stats = {
      total: vehicles.length,
      active: vehicles.filter(v => v.status === 'active').length,
      maintenance: vehicles.filter(v => v.status === 'maintenance').length,
      inactive: vehicles.filter(v => v.status === 'inactive').length,
      assigned: vehicles.filter(v => v.assignedDriver).length,
      fuelEfficiency: vehicles.reduce((acc, v) => acc + (v.fuelEfficiency || 0), 0) / vehicles.length || 0
    };
    return stats;
  }, [vehicles]);

  // Get vehicle type icon
  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case 'van':
      case 'truck':
        return <Truck className="h-6 w-6 text-blue-500" />;
      case 'car':
        return <Car className="h-6 w-6 text-green-500" />;
      case 'motorcycle':
        return <Car className="h-6 w-6 text-orange-500" />;
      case 'bicycle':
        return <Car className="h-6 w-6 text-purple-500" />;
      default:
        return <Truck className="h-6 w-6 text-gray-500" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'maintenance':
        return <Badge variant="default" className="bg-yellow-500">Maintenance</Badge>;
      case 'out_of_service':
        return <Badge variant="destructive">Out of Service</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Get fuel type color
  const getFuelTypeColor = (fuelType: FuelType) => {
    switch (fuelType) {
      case 'gasoline':
        return 'text-blue-600';
      case 'diesel':
        return 'text-orange-600';
      case 'electric':
        return 'text-green-600';
      case 'hybrid':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  // Handle fuel record submission
  const handleAddFuelRecord = () => {
    if (!selectedVehicle) return;
    
    const newRecord = {
      vehicleId: selectedVehicle.id,
      date: new Date().toISOString(),
      fuelType: selectedVehicle.fuelType,
      amount: parseFloat(fuelForm.amount),
      cost: parseFloat(fuelForm.cost),
      pricePerGallon: parseFloat(fuelForm.pricePerGallon),
      odometer: parseInt(fuelForm.odometer),
      location: fuelForm.location,
      receiptNumber: fuelForm.receiptNumber,
      notes: fuelForm.notes
    };

    addFuelRecord.mutate(newRecord);
    setShowFuelDialog(false);
    setFuelForm({
      amount: '',
      cost: '',
      pricePerGallon: '',
      odometer: '',
      location: '',
      receiptNumber: '',
      notes: ''
    });
  };

  // Handle driver assignment
  const handleAssignDriver = () => {
    if (!selectedVehicle) return;
    
    assignDriver.mutate({
      vehicleId: selectedVehicle.id,
      driverId: assignForm.driverId,
      driverName: assignForm.driverName,
      notes: assignForm.notes
    });

    setShowAssignDialog(false);
    setAssignForm({
      driverId: '',
      driverName: '',
      notes: ''
    });
  };

  if (vehiclesLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
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
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold">{fleetStats.total}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{fleetStats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-blue-600">{fleetStats.assigned}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{fleetStats.maintenance}</p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg MPG</p>
                <p className="text-2xl font-bold text-green-600">{fleetStats.fuelEfficiency.toFixed(1)}</p>
              </div>
              <Fuel className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                <p className="text-2xl font-bold text-orange-600">$2,450</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Vehicle Fleet</CardTitle>
              <CardDescription>Manage vehicles, assignments, and maintenance schedules</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
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
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="out_of_service">Out of Service</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as VehicleType | 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="bicycle">Bicycle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getVehicleIcon(vehicle.type)}
                      <div>
                        <h3 className="font-semibold">{vehicle.make} {vehicle.model}</h3>
                        <p className="text-sm text-gray-500">{vehicle.licensePlate}</p>
                      </div>
                    </div>
                    {getStatusBadge(vehicle.status)}
                  </div>

                  {/* Vehicle Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Year:</span>
                      <span>{vehicle.year}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mileage:</span>
                      <span>{vehicle.currentMileage?.toLocaleString()} mi</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fuel Type:</span>
                      <span className={getFuelTypeColor(vehicle.fuelType)}>
                        {vehicle.fuelType}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fuel Efficiency:</span>
                      <span>{vehicle.fuelEfficiency} MPG</span>
                    </div>
                  </div>

                  {/* Assigned Driver */}
                  {vehicle.assignedDriver ? (
                    <div className="bg-blue-50 p-2 rounded text-sm mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Assigned to</span>
                      </div>
                      <p className="text-gray-700">{vehicle.assignedDriver.driverName}</p>
                      <p className="text-xs text-gray-500">
                        Since: {new Date(vehicle.assignedDriver.assignedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-2 rounded text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Unassigned</span>
                      </div>
                    </div>
                  )}

                  {/* Maintenance Alert */}
                  {vehicle.nextMaintenanceDate && new Date(vehicle.nextMaintenanceDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                    <Alert className="mb-3">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Maintenance due {new Date(vehicle.nextMaintenanceDate).toLocaleDateString()}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowFuelDialog(true);
                      }}
                    >
                      <Fuel className="h-4 w-4 mr-1" />
                      Fuel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowAssignDialog(true);
                      }}
                    >
                      <User className="h-4 w-4 mr-1" />
                      Assign
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowRouteDialog(true);
                      }}
                    >
                      <Route className="h-4 w-4 mr-1" />
                      Routes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No vehicles found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fleet Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fuel Usage (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Gallons</span>
                <span className="font-medium">1,245</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Cost</span>
                <span className="font-medium">$1,892.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Price/Gallon</span>
                <span className="font-medium">$1.52</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">vs Last Month</span>
                <span className="font-bold text-green-600">-8.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded">
                <Calendar className="h-4 w-4 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">V-001 (Honda Civic)</p>
                  <p className="text-xs text-gray-500">Due: Tomorrow</p>
                </div>
                <Button size="sm" variant="outline">Schedule</Button>
              </div>
              <div className="flex items-center gap-3 p-2 bg-orange-50 rounded">
                <Wrench className="h-4 w-4 text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">V-003 (Ford Transit)</p>
                  <p className="text-xs text-gray-500">Overdue: 3 days</p>
                </div>
                <Button size="sm" variant="outline">Schedule</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fleet Utilization</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>On-Time Performance</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fuel Efficiency</span>
                  <span>23.5 MPG</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fuel Record Dialog */}
      <Dialog open={showFuelDialog} onOpenChange={setShowFuelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Fuel Record</DialogTitle>
            <DialogDescription>
              Record fuel purchase for {selectedVehicle?.make} {selectedVehicle?.model}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount (Gallons)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.1"
                  placeholder="45.2"
                  value={fuelForm.amount}
                  onChange={(e) => setFuelForm({...fuelForm, amount: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cost">Total Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  placeholder="68.50"
                  value={fuelForm.cost}
                  onChange={(e) => setFuelForm({...fuelForm, cost: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price-per-gallon">Price per Gallon</Label>
                <Input
                  id="price-per-gallon"
                  type="number"
                  step="0.001"
                  placeholder="1.515"
                  value={fuelForm.pricePerGallon}
                  onChange={(e) => setFuelForm({...fuelForm, pricePerGallon: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="odometer">Current Odometer</Label>
                <Input
                  id="odometer"
                  type="number"
                  placeholder="45230"
                  value={fuelForm.odometer}
                  onChange={(e) => setFuelForm({...fuelForm, odometer: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Gas Station</Label>
              <Input
                id="location"
                placeholder="Shell Station - Bayamón"
                value={fuelForm.location}
                onChange={(e) => setFuelForm({...fuelForm, location: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="receipt">Receipt Number</Label>
              <Input
                id="receipt"
                placeholder="R-2024-001"
                value={fuelForm.receiptNumber}
                onChange={(e) => setFuelForm({...fuelForm, receiptNumber: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="fuel-notes">Notes</Label>
              <Textarea
                id="fuel-notes"
                placeholder="Additional notes"
                value={fuelForm.notes}
                onChange={(e) => setFuelForm({...fuelForm, notes: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFuelDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFuelRecord}>
              Add Fuel Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Driver Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Driver</DialogTitle>
            <DialogDescription>
              Assign a driver to {selectedVehicle?.make} {selectedVehicle?.model}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="driver-id">Driver ID</Label>
              <Input
                id="driver-id"
                placeholder="EMP-001"
                value={assignForm.driverId}
                onChange={(e) => setAssignForm({...assignForm, driverId: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="driver-name">Driver Name</Label>
              <Input
                id="driver-name"
                placeholder="Carlos Rodriguez"
                value={assignForm.driverName}
                onChange={(e) => setAssignForm({...assignForm, driverName: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="assign-notes">Notes</Label>
              <Textarea
                id="assign-notes"
                placeholder="Assignment notes"
                value={assignForm.notes}
                onChange={(e) => setAssignForm({...assignForm, notes: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignDriver}>
              Assign Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Route History Dialog */}
      <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Route History</DialogTitle>
            <DialogDescription>
              Recent routes for {selectedVehicle?.make} {selectedVehicle?.model}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Fuel Used</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2024-01-24</TableCell>
                  <TableCell>Carlos Rodriguez</TableCell>
                  <TableCell>Bayamón → San Juan → Caguas</TableCell>
                  <TableCell>45.2 mi</TableCell>
                  <TableCell>2h 15m</TableCell>
                  <TableCell>3.2 gal</TableCell>
                  <TableCell><Badge variant="default" className="bg-green-500">Completed</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-01-23</TableCell>
                  <TableCell>Maria Santos</TableCell>
                  <TableCell>San Juan → Ponce → Mayagüez</TableCell>
                  <TableCell>78.5 mi</TableCell>
                  <TableCell>3h 45m</TableCell>
                  <TableCell>5.1 gal</TableCell>
                  <TableCell><Badge variant="default" className="bg-green-500">Completed</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRouteDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 