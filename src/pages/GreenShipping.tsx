import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Leaf, 
  Zap, 
  Truck, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Battery,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  BarChart3
} from 'lucide-react';
import {
  mockEcoFriendlyPackaging,
  mockCarbonOffsetPrograms,
  mockElectricVehicles,
  mockConsolidatedShipping,
  mockPaperlessInitiatives
} from '@/data/sustainabilityData';
import { 
  EcoFriendlyPackaging, 
  CarbonOffsetProgram, 
  ElectricVehicle, 
  ConsolidatedShipping, 
  PaperlessInitiative 
} from '@/types/sustainability';

export default function GreenShipping() {
  const [selectedVehicle, setSelectedVehicle] = useState<ElectricVehicle | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<CarbonOffsetProgram | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'analytics'>('overview');

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'charging': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'available':
      case 'delivered':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'charging':
      case 'in-transit':
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'maintenance':
      case 'inactive':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTrendIcon = (value: number, previousValue: number) => {
    if (value > previousValue) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < previousValue) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  // Calculate totals
  const totalPackagingUsage = mockEcoFriendlyPackaging.reduce((sum, pkg) => sum + pkg.usageCount, 0);
  const totalCarbonOffset = mockCarbonOffsetPrograms.reduce((sum, program) => sum + program.totalOffset, 0);
  const totalCarbonSaved = mockElectricVehicles.reduce((sum, vehicle) => sum + vehicle.carbonSaved, 0);
  const totalShippingSavings = mockConsolidatedShipping.reduce((sum, ship) => sum + ship.carbonSaved, 0);
  const totalPaperSaved = mockPaperlessInitiatives.reduce((sum, initiative) => sum + initiative.paperSaved, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            Green Shipping
          </h1>
          <p className="text-gray-600 mt-2">
            Sustainable shipping solutions and eco-friendly delivery practices
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('overview')}
          >
            Overview
          </Button>
          <Button
            variant={viewMode === 'detailed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('detailed')}
          >
            Detailed
          </Button>
          <Button
            variant={viewMode === 'analytics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('analytics')}
          >
            Analytics
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eco Packaging</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalPackagingUsage)}</div>
            <p className="text-xs text-muted-foreground">
              Eco-friendly packages used
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalPackagingUsage, 4200)}
              <span className="text-xs text-green-600 ml-1">+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Offset</CardTitle>
            <Leaf className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalCarbonOffset)} kg</div>
            <p className="text-xs text-muted-foreground">
              CO2 offset through programs
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalCarbonOffset, 7000)}
              <span className="text-xs text-green-600 ml-1">+14.3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EV Carbon Saved</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalCarbonSaved)} kg</div>
            <p className="text-xs text-muted-foreground">
              CO2 saved by electric vehicles
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalCarbonSaved, 4000)}
              <span className="text-xs text-green-600 ml-1">+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consolidated Savings</CardTitle>
            <Truck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalShippingSavings)} kg</div>
            <p className="text-xs text-muted-foreground">
              CO2 saved through consolidation
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalShippingSavings, 280)}
              <span className="text-xs text-green-600 ml-1">+11.4% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="packaging" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="packaging">Eco Packaging</TabsTrigger>
          <TabsTrigger value="offset">Carbon Offset</TabsTrigger>
          <TabsTrigger value="vehicles">Electric Vehicles</TabsTrigger>
          <TabsTrigger value="consolidation">Consolidated Shipping</TabsTrigger>
          <TabsTrigger value="paperless">Paperless</TabsTrigger>
        </TabsList>

        {/* Eco-Friendly Packaging Tab */}
        <TabsContent value="packaging" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Eco-Friendly Packaging Options
                </CardTitle>
                <CardDescription>
                  Sustainable packaging materials and their environmental impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEcoFriendlyPackaging.map((packaging) => (
                    <div key={packaging.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{packaging.name}</h3>
                        <Badge className={getStatusColor(packaging.availability ? 'active' : 'inactive')}>
                          {packaging.availability ? 'Available' : 'Out of Stock'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Type</div>
                          <div className="font-semibold capitalize">{packaging.type}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Material</div>
                          <div className="font-semibold">{packaging.material}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Cost</div>
                          <div className="font-semibold">${packaging.cost}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Carbon Footprint</div>
                          <div className="font-semibold text-green-600">{packaging.carbonFootprint} kg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Usage Count</div>
                          <div className="font-semibold">{formatNumber(packaging.usageCount)}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">Certifications:</div>
                        <div className="flex flex-wrap gap-1">
                          {packaging.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-600">
                        Supplier: {packaging.supplier}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Packaging Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {formatNumber(totalPackagingUsage)}
                    </div>
                    <div className="text-sm text-green-700">Total Eco Packages Used</div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Usage by Type:</h3>
                    {mockEcoFriendlyPackaging.map((packaging) => (
                      <div key={packaging.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{packaging.type}</span>
                          <span>{formatNumber(packaging.usageCount)}</span>
                        </div>
                        <Progress 
                          value={(packaging.usageCount / totalPackagingUsage) * 100} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>

                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(mockEcoFriendlyPackaging.reduce((sum, pkg) => sum + (pkg.carbonFootprint * pkg.usageCount), 0))}
                    </div>
                    <div className="text-sm text-blue-700">Total Carbon Footprint (kg CO2)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Carbon Offset Programs Tab */}
        <TabsContent value="offset" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Carbon Offset Programs
                </CardTitle>
                <CardDescription>
                  Active carbon offset programs and their impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCarbonOffsetPrograms.map((program) => (
                    <div
                      key={program.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedProgram(program)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{program.name}</h3>
                        <Badge className={getStatusColor(program.status)}>
                          {program.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Provider</div>
                          <div className="font-semibold">{program.provider}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Project Type</div>
                          <div className="font-semibold capitalize">{program.projectType.replace('-', ' ')}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Cost per Ton</div>
                          <div className="font-semibold">${program.costPerTon}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Total Offset</div>
                          <div className="font-semibold text-green-600">{formatNumber(program.totalOffset)} kg</div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        Certificates: {program.certificates.length}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Offset Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {formatNumber(totalCarbonOffset)}
                    </div>
                    <div className="text-sm text-green-700">Total CO2 Offset (kg)</div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Offset by Project Type:</h3>
                    {mockCarbonOffsetPrograms.map((program) => (
                      <div key={program.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{program.projectType.replace('-', ' ')}</span>
                          <span>{formatNumber(program.totalOffset)} kg</span>
                        </div>
                        <Progress 
                          value={(program.totalOffset / totalCarbonOffset) * 100} 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>

                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ${formatNumber(mockCarbonOffsetPrograms.reduce((sum, program) => sum + (program.totalOffset / 1000 * program.costPerTon), 0))}
                    </div>
                    <div className="text-sm text-blue-700">Total Investment</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Electric Vehicles Tab */}
        <TabsContent value="vehicles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Electric Vehicle Fleet
                </CardTitle>
                <CardDescription>
                  Track electric vehicles and their environmental impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockElectricVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{vehicle.model}</h3>
                        <Badge className={getStatusColor(vehicle.status)}>
                          {vehicle.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Type</div>
                          <div className="font-semibold capitalize">{vehicle.type.replace('-', ' ')}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="font-semibold">{vehicle.location}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Battery</div>
                          <div className="font-semibold">{vehicle.batteryCapacity} kWh</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Range</div>
                          <div className="font-semibold">{vehicle.range} km</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Charge</div>
                          <div className="font-semibold">{vehicle.currentCharge}%</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Carbon Saved</div>
                          <div className="font-semibold text-green-600">{formatNumber(vehicle.carbonSaved)} kg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Mileage</div>
                          <div className="font-semibold">{formatNumber(vehicle.mileage)} km</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Fleet Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {formatNumber(totalCarbonSaved)}
                    </div>
                    <div className="text-sm text-green-700">Total Carbon Saved (kg CO2)</div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Vehicles by Type:</h3>
                    {['delivery-van', 'scooter', 'bicycle'].map((type) => {
                      const vehicles = mockElectricVehicles.filter(v => v.type === type);
                      const count = vehicles.length;
                      const carbonSaved = vehicles.reduce((sum, v) => sum + v.carbonSaved, 0);
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{type.replace('-', ' ')}</span>
                            <span>{count} vehicles</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            Carbon saved: {formatNumber(carbonSaved)} kg CO2
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(mockElectricVehicles.reduce((sum, v) => sum + v.mileage, 0))}
                    </div>
                    <div className="text-sm text-blue-700">Total Fleet Mileage (km)</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Status Distribution:</h3>
                    {['available', 'in-use', 'charging', 'maintenance'].map((status) => {
                      const count = mockElectricVehicles.filter(v => v.status === status).length;
                      return (
                        <div key={status} className="flex justify-between text-sm">
                          <span className="capitalize">{status.replace('-', ' ')}</span>
                          <span>{count} vehicles</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Consolidated Shipping Tab */}
        <TabsContent value="consolidation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Consolidated Shipping
                </CardTitle>
                <CardDescription>
                  Track consolidated shipments and their environmental benefits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockConsolidatedShipping.map((shipment) => (
                    <div key={shipment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">Route {shipment.routeId}</h3>
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Packages</div>
                          <div className="font-semibold">{shipment.packages}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Total Weight</div>
                          <div className="font-semibold">{shipment.totalWeight} kg</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Distance</div>
                          <div className="font-semibold">{shipment.distance} km</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Date</div>
                          <div className="font-semibold">{new Date(shipment.date).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Carbon Saved</div>
                          <div className="font-semibold text-green-600">{shipment.carbonSaved} kg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Cost Savings</div>
                          <div className="font-semibold text-green-600">${shipment.costSavings}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Consolidation Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {formatNumber(totalShippingSavings)}
                    </div>
                    <div className="text-sm text-green-700">Total Carbon Saved (kg CO2)</div>
                  </div>
                  
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ${formatNumber(mockConsolidatedShipping.reduce((sum, ship) => sum + ship.costSavings, 0))}
                    </div>
                    <div className="text-sm text-blue-700">Total Cost Savings</div>
                  </div>

                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatNumber(mockConsolidatedShipping.reduce((sum, ship) => sum + ship.packages, 0))}
                    </div>
                    <div className="text-sm text-purple-700">Total Packages Consolidated</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Status Distribution:</h3>
                    {['scheduled', 'in-transit', 'delivered'].map((status) => {
                      const count = mockConsolidatedShipping.filter(s => s.status === status).length;
                      return (
                        <div key={status} className="flex justify-between text-sm">
                          <span className="capitalize">{status.replace('-', ' ')}</span>
                          <span>{count} shipments</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Paperless Initiatives Tab */}
        <TabsContent value="paperless" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Paperless Initiatives
                </CardTitle>
                <CardDescription>
                  Track paperless initiatives and their environmental impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPaperlessInitiatives.map((initiative) => (
                    <div key={initiative.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{initiative.name}</h3>
                        <Badge className={getStatusColor(initiative.status)}>
                          {initiative.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Documents Processed</div>
                          <div className="font-semibold">{formatNumber(initiative.documentsProcessed)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Paper Saved</div>
                          <div className="font-semibold text-green-600">{initiative.paperSaved} kg</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Carbon Saved</div>
                          <div className="font-semibold text-green-600">{initiative.carbonSaved} kg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Cost Savings</div>
                          <div className="font-semibold text-green-600">${formatNumber(initiative.costSavings)}</div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        Implemented: {new Date(initiative.implementationDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Paperless Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {formatNumber(totalPaperSaved)}
                    </div>
                    <div className="text-sm text-green-700">Total Paper Saved (kg)</div>
                  </div>
                  
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(mockPaperlessInitiatives.reduce((sum, init) => sum + init.documentsProcessed, 0))}
                    </div>
                    <div className="text-sm text-blue-700">Total Documents Processed</div>
                  </div>

                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      ${formatNumber(mockPaperlessInitiatives.reduce((sum, init) => sum + init.costSavings, 0))}
                    </div>
                    <div className="text-sm text-purple-700">Total Cost Savings</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Status Distribution:</h3>
                    {['active', 'planned', 'completed'].map((status) => {
                      const count = mockPaperlessInitiatives.filter(i => i.status === status).length;
                      return (
                        <div key={status} className="flex justify-between text-sm">
                          <span className="capitalize">{status}</span>
                          <span>{count} initiatives</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Selected Vehicle Details */}
      {selectedVehicle && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedVehicle.model}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedVehicle(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Vehicle Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Vehicle ID:</span>
                    <span className="font-semibold">{selectedVehicle.vehicleId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-semibold capitalize">{selectedVehicle.type.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="font-semibold">{selectedVehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-semibold">{selectedVehicle.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={getStatusColor(selectedVehicle.status)}>
                      {selectedVehicle.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Battery Capacity:</span>
                    <span className="font-semibold">{selectedVehicle.batteryCapacity} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Charge:</span>
                    <span className="font-semibold">{selectedVehicle.currentCharge}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Range:</span>
                    <span className="font-semibold">{selectedVehicle.range} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mileage:</span>
                    <span className="font-semibold">{formatNumber(selectedVehicle.mileage)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon Saved:</span>
                    <span className="font-semibold text-green-600">{formatNumber(selectedVehicle.carbonSaved)} kg CO2</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Program Details */}
      {selectedProgram && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedProgram.name}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedProgram(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Program Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span className="font-semibold">{selectedProgram.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Project Type:</span>
                    <span className="font-semibold capitalize">{selectedProgram.projectType.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={getStatusColor(selectedProgram.status)}>
                      {selectedProgram.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per Ton:</span>
                    <span className="font-semibold">${selectedProgram.costPerTon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Offset:</span>
                    <span className="font-semibold text-green-600">{formatNumber(selectedProgram.totalOffset)} kg CO2</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Certificates</h3>
                <div className="space-y-3">
                  {selectedProgram.certificates.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Certificate {cert.id}</span>
                        <Badge className={getStatusColor(cert.verificationStatus)}>
                          {cert.verificationStatus}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span>{formatNumber(cert.amount)} kg CO2</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost:</span>
                          <span>${formatNumber(cert.cost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span>{new Date(cert.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 