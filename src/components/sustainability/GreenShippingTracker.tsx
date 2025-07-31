import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Leaf, 
  Zap, 
  Truck, 
  FileText, 
  TrendingUp, 
  Battery, 
  MapPin,
  Calendar,
  DollarSign,
  Target
} from 'lucide-react';
import {
  EcoFriendlyPackaging,
  CarbonOffsetProgram,
  ElectricVehicle,
  ConsolidatedShipping,
  PaperlessInitiative
} from '@/types/sustainability';

interface GreenShippingTrackerProps {
  ecoPackaging: EcoFriendlyPackaging[];
  carbonOffsets: CarbonOffsetProgram[];
  electricVehicles: ElectricVehicle[];
  consolidatedShipping: ConsolidatedShipping[];
  paperlessInitiatives: PaperlessInitiative[];
}

export default function GreenShippingTracker({
  ecoPackaging,
  carbonOffsets,
  electricVehicles,
  consolidatedShipping,
  paperlessInitiatives
}: GreenShippingTrackerProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<ElectricVehicle | null>(null);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'in-use': return 'bg-yellow-100 text-yellow-800';
      case 'charging': return 'bg-purple-100 text-purple-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBatteryColor = (percentage: number) => {
    if (percentage > 80) return 'text-green-600';
    if (percentage > 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalCarbonSaved = 
    carbonOffsets.reduce((sum, offset) => sum + offset.totalOffset, 0) +
    electricVehicles.reduce((sum, vehicle) => sum + vehicle.carbonSaved, 0) +
    consolidatedShipping.reduce((sum, shipment) => sum + shipment.carbonSaved, 0) +
    paperlessInitiatives.reduce((sum, initiative) => sum + initiative.carbonSaved, 0);

  const totalCostSavings = 
    consolidatedShipping.reduce((sum, shipment) => sum + shipment.costSavings, 0) +
    paperlessInitiatives.reduce((sum, initiative) => sum + initiative.costSavings, 0);

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Truck className="h-6 w-6" />
          Green Shipping Tracker
        </CardTitle>
        <CardDescription>
          Monitor eco-friendly shipping initiatives and environmental impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(totalCarbonSaved)}
            </div>
            <div className="text-sm text-green-700">kg CO2 Saved</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              ${formatNumber(totalCostSavings)}
            </div>
            <div className="text-sm text-blue-700">Cost Savings</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {electricVehicles.length}
            </div>
            <div className="text-sm text-yellow-700">Electric Vehicles</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {ecoPackaging.length}
            </div>
            <div className="text-sm text-purple-700">Eco Packaging Options</div>
          </div>
        </div>

        <Tabs defaultValue="packaging" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="packaging">Eco Packaging</TabsTrigger>
            <TabsTrigger value="offsets">Carbon Offsets</TabsTrigger>
            <TabsTrigger value="vehicles">EV Fleet</TabsTrigger>
            <TabsTrigger value="consolidated">Consolidated</TabsTrigger>
            <TabsTrigger value="paperless">Paperless</TabsTrigger>
          </TabsList>

          {/* Eco-Friendly Packaging Tab */}
          <TabsContent value="packaging" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ecoPackaging.map((packaging) => (
                <Card key={packaging.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5" />
                      {packaging.name}
                    </CardTitle>
                    <Badge variant="outline" className="w-fit">
                      {packaging.type}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Material:</span>
                        <span className="font-medium">{packaging.material}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cost:</span>
                        <span className="font-medium">${packaging.cost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Carbon Footprint:</span>
                        <span className="font-medium">{packaging.carbonFootprint} kg CO2</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Usage Count:</span>
                        <span className="font-medium">{formatNumber(packaging.usageCount)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${packaging.availability ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm">{packaging.availability ? 'Available' : 'Out of Stock'}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-500">Certifications:</div>
                      <div className="flex flex-wrap gap-1">
                        {packaging.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Carbon Offset Programs Tab */}
          <TabsContent value="offsets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {carbonOffsets.map((offset) => (
                  <Card key={offset.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5" />
                        {offset.name}
                      </CardTitle>
                      <Badge className={getStatusColor(offset.status)}>
                        {offset.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Provider:</span>
                          <span className="font-medium">{offset.provider}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Project Type:</span>
                          <span className="font-medium capitalize">{offset.projectType.replace('-', ' ')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Cost per Ton:</span>
                          <span className="font-medium">${offset.costPerTon}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Offset:</span>
                          <span className="font-medium">{formatNumber(offset.totalOffset)} kg CO2</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Certificates:</div>
                        {offset.certificates.map((cert) => (
                          <div key={cert.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="text-sm">
                              <div className="font-medium">{formatNumber(cert.amount)} kg CO2</div>
                              <div className="text-xs text-gray-600">
                                {new Date(cert.date).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {cert.verificationStatus}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Offset Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {formatNumber(carbonOffsets.reduce((sum, offset) => sum + offset.totalOffset, 0))}
                      </div>
                      <div className="text-sm text-green-700">Total kg CO2 Offset</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        ${formatNumber(carbonOffsets.reduce((sum, offset) => sum + (offset.totalOffset * offset.costPerTon / 1000), 0))}
                      </div>
                      <div className="text-sm text-blue-700">Total Investment</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Electric Vehicle Fleet Tab */}
          <TabsContent value="vehicles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {electricVehicles.map((vehicle) => (
                  <Card 
                    key={vehicle.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        {vehicle.model}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="capitalize">
                          {vehicle.type.replace('-', ' ')}
                        </Badge>
                        <Badge className={getStatusColor(vehicle.status)}>
                          {vehicle.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Battery Capacity</div>
                          <div className="font-semibold">{vehicle.batteryCapacity} kWh</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Range</div>
                          <div className="font-semibold">{vehicle.range} km</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Current Charge</div>
                          <div className={`font-semibold ${getBatteryColor(vehicle.currentCharge)}`}>
                            {vehicle.currentCharge}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Mileage</div>
                          <div className="font-semibold">{formatNumber(vehicle.mileage)} km</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{vehicle.location}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-500">Carbon Saved</div>
                          <div className="font-semibold text-green-600">
                            {formatNumber(vehicle.carbonSaved)} kg CO2
                          </div>
                        </div>
                        <Battery className={`h-6 w-6 ${getBatteryColor(vehicle.currentCharge)}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {formatNumber(electricVehicles.reduce((sum, vehicle) => sum + vehicle.carbonSaved, 0))}
                      </div>
                      <div className="text-sm text-green-700">Total kg CO2 Saved</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatNumber(electricVehicles.reduce((sum, vehicle) => sum + vehicle.mileage, 0))}
                      </div>
                      <div className="text-sm text-blue-700">Total km Driven</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        {Math.round(electricVehicles.reduce((sum, vehicle) => sum + vehicle.currentCharge, 0) / electricVehicles.length)}%
                      </div>
                      <div className="text-sm text-yellow-700">Average Battery Level</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Consolidated Shipping Tab */}
          <TabsContent value="consolidated" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {consolidatedShipping.map((shipment) => (
                  <Card key={shipment.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Route {shipment.routeId}
                      </CardTitle>
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Packages</div>
                          <div className="font-semibold">{shipment.packages}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Total Weight</div>
                          <div className="font-semibold">{shipment.totalWeight} kg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Distance</div>
                          <div className="font-semibold">{shipment.distance} km</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Date</div>
                          <div className="font-semibold">
                            {new Date(shipment.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-500">Carbon Saved</div>
                          <div className="font-semibold text-green-600">
                            {formatNumber(shipment.carbonSaved)} kg CO2
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Cost Savings</div>
                          <div className="font-semibold text-green-600">
                            ${formatNumber(shipment.costSavings)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Consolidation Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {formatNumber(consolidatedShipping.reduce((sum, shipment) => sum + shipment.carbonSaved, 0))}
                      </div>
                      <div className="text-sm text-green-700">Total kg CO2 Saved</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        ${formatNumber(consolidatedShipping.reduce((sum, shipment) => sum + shipment.costSavings, 0))}
                      </div>
                      <div className="text-sm text-blue-700">Total Cost Savings</div>
                    </div>
                    
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">
                        {formatNumber(consolidatedShipping.reduce((sum, shipment) => sum + shipment.packages, 0))}
                      </div>
                      <div className="text-sm text-purple-700">Packages Consolidated</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Paperless Initiatives Tab */}
          <TabsContent value="paperless" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {paperlessInitiatives.map((initiative) => (
                  <Card key={initiative.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {initiative.name}
                      </CardTitle>
                      <Badge className={getStatusColor(initiative.status)}>
                        {initiative.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Documents Processed</div>
                          <div className="font-semibold">{formatNumber(initiative.documentsProcessed)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Paper Saved</div>
                          <div className="font-semibold">{initiative.paperSaved} kg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Carbon Saved</div>
                          <div className="font-semibold text-green-600">
                            {formatNumber(initiative.carbonSaved)} kg CO2
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Cost Savings</div>
                          <div className="font-semibold text-green-600">
                            ${formatNumber(initiative.costSavings)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Implemented: {new Date(initiative.implementationDate).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Paperless Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {formatNumber(paperlessInitiatives.reduce((sum, initiative) => sum + initiative.carbonSaved, 0))}
                      </div>
                      <div className="text-sm text-green-700">Total kg CO2 Saved</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatNumber(paperlessInitiatives.reduce((sum, initiative) => sum + initiative.costSavings, 0))}
                      </div>
                      <div className="text-sm text-blue-700">Total Cost Savings</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        {formatNumber(paperlessInitiatives.reduce((sum, initiative) => sum + initiative.paperSaved, 0))}
                      </div>
                      <div className="text-sm text-yellow-700">kg Paper Saved</div>
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
                <span>{selectedVehicle.model} Details</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedVehicle(null)}>
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Vehicle Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Vehicle ID:</span>
                      <span className="font-medium">{selectedVehicle.vehicleId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium capitalize">{selectedVehicle.type.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Model:</span>
                      <span className="font-medium">{selectedVehicle.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{selectedVehicle.location}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Performance Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Battery Capacity:</span>
                      <span className="font-medium">{selectedVehicle.batteryCapacity} kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Range:</span>
                      <span className="font-medium">{selectedVehicle.range} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Charge:</span>
                      <span className={`font-medium ${getBatteryColor(selectedVehicle.currentCharge)}`}>
                        {selectedVehicle.currentCharge}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mileage:</span>
                      <span className="font-medium">{formatNumber(selectedVehicle.mileage)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbon Saved:</span>
                      <span className="font-medium text-green-600">
                        {formatNumber(selectedVehicle.carbonSaved)} kg CO2
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
} 