import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Recycle, 
  Package, 
  MapPin, 
  TrendingDown, 
  Target, 
  Calendar,
  DollarSign,
  Leaf,
  BarChart3,
  Activity
} from 'lucide-react';
import {
  PackageReuseProgram,
  RecyclingLocation,
  MaterialTracking,
  WasteAudit,
  ReductionGoal
} from '@/types/sustainability';

interface WasteReductionTrackerProps {
  packageReuse: PackageReuseProgram[];
  recyclingLocations: RecyclingLocation[];
  materialTracking: MaterialTracking[];
  wasteAudits: WasteAudit[];
  reductionGoals: ReductionGoal[];
}

export default function WasteReductionTracker({
  packageReuse,
  recyclingLocations,
  materialTracking,
  wasteAudits,
  reductionGoals
}: WasteReductionTrackerProps) {
  const [selectedLocation, setSelectedLocation] = useState<RecyclingLocation | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<WasteAudit | null>(null);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'behind': return 'bg-red-100 text-red-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const totalWasteReduced = 
    packageReuse.reduce((sum, pkg) => sum + pkg.carbonSaved, 0) +
    materialTracking.reduce((sum, material) => sum + material.carbonFootprint, 0);

  const totalCostSavings = 
    packageReuse.reduce((sum, pkg) => sum + pkg.costSavings, 0);

  const totalRecycled = materialTracking.reduce((sum, material) => sum + material.quantity, 0);

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Recycle className="h-6 w-6" />
          Waste Reduction Tracker
        </CardTitle>
        <CardDescription>
          Monitor waste reduction initiatives, recycling programs, and material tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(totalWasteReduced)}
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
              {formatNumber(totalRecycled)}
            </div>
            <div className="text-sm text-yellow-700">kg Recycled</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {packageReuse.length}
            </div>
            <div className="text-sm text-purple-700">Packages Reused</div>
          </div>
        </div>

        <Tabs defaultValue="reuse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="reuse">Package Reuse</TabsTrigger>
            <TabsTrigger value="locations">Recycling Locations</TabsTrigger>
            <TabsTrigger value="tracking">Material Tracking</TabsTrigger>
            <TabsTrigger value="audits">Waste Audits</TabsTrigger>
            <TabsTrigger value="goals">Reduction Goals</TabsTrigger>
          </TabsList>

          {/* Package Reuse Program Tab */}
          <TabsContent value="reuse" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packageReuse.map((pkg) => (
                <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5" />
                      {pkg.packageId}
                    </CardTitle>
                    <Badge className={getStatusColor(pkg.status)}>
                      {pkg.status.replace('-', ' ')}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Original Use:</span>
                        <span className="font-medium">{pkg.originalUse}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Current Use:</span>
                        <span className="font-medium">{pkg.currentUse}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Reuse Count:</span>
                        <span className="font-medium">{pkg.reuseCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Condition:</span>
                        <span className={`font-medium ${getConditionColor(pkg.condition)}`}>
                          {pkg.condition}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <div>
                        <div className="text-sm text-gray-500">Carbon Saved</div>
                        <div className="font-semibold text-green-600">
                          {formatNumber(pkg.carbonSaved)} kg CO2
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Cost Savings</div>
                        <div className="font-semibold text-green-600">
                          ${formatNumber(pkg.costSavings)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Last used: {new Date(pkg.lastUsed).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recycling Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {recyclingLocations.map((location) => (
                  <Card 
                    key={location.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedLocation(location)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {location.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">★</span>
                          <span className="text-sm font-medium">{location.rating}</span>
                        </div>
                        <Badge variant="outline">
                          {location.distance} km away
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">{location.address}</div>
                        <div className="text-sm text-gray-600">Hours: {location.hours}</div>
                        <div className="text-sm text-gray-600">Contact: {location.contact}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Materials Accepted:</div>
                        <div className="flex flex-wrap gap-1">
                          {location.materials.map((material, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Location Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {recyclingLocations.length}
                      </div>
                      <div className="text-sm text-green-700">Recycling Locations</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {Math.round(recyclingLocations.reduce((sum, loc) => sum + loc.rating, 0) / recyclingLocations.length * 10) / 10}
                      </div>
                      <div className="text-sm text-blue-700">Average Rating</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        {Math.round(recyclingLocations.reduce((sum, loc) => sum + loc.distance, 0) / recyclingLocations.length * 10) / 10}
                      </div>
                      <div className="text-sm text-yellow-700">Avg Distance (km)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Material Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {materialTracking.map((material) => (
                  <Card key={material.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        {material.material}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{material.unit}</Badge>
                        <Badge className={material.recycled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {material.recycled ? 'Recycled' : 'Not Recycled'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Quantity</div>
                          <div className="font-semibold">{formatNumber(material.quantity)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Carbon Footprint</div>
                          <div className="font-semibold">{formatNumber(material.carbonFootprint)} kg CO2</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Source</div>
                          <div className="font-semibold text-sm">{material.source}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Destination</div>
                          <div className="font-semibold text-sm">{material.destination}</div>
                        </div>
                      </div>
                      
                      {material.recycled && (
                        <div className="p-2 bg-green-50 rounded">
                          <div className="text-sm text-gray-500">Recycled Percentage</div>
                          <div className="font-semibold text-green-600">{material.recycledPercentage}%</div>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-600">
                        Date: {new Date(material.date).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Material Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {formatNumber(materialTracking.reduce((sum, material) => sum + material.quantity, 0))}
                      </div>
                      <div className="text-sm text-green-700">Total Material Tracked</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {Math.round(materialTracking.filter(m => m.recycled).length / materialTracking.length * 100)}%
                      </div>
                      <div className="text-sm text-blue-700">Recycling Rate</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        {formatNumber(materialTracking.reduce((sum, material) => sum + material.carbonFootprint, 0))}
                      </div>
                      <div className="text-sm text-yellow-700">Total Carbon Footprint</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Waste Audits Tab */}
          <TabsContent value="audits" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {wasteAudits.map((audit) => (
                  <Card 
                    key={audit.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedAudit(audit)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Waste Audit - {audit.location}
                      </CardTitle>
                      <div className="text-sm text-gray-600">
                        {new Date(audit.date).toLocaleDateString()}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Total Waste</div>
                          <div className="font-semibold">{formatNumber(audit.totalWaste)} kg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Carbon Footprint</div>
                          <div className="font-semibold">{formatNumber(audit.totalCarbonFootprint)} kg CO2</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Waste Types:</div>
                        <div className="space-y-1">
                          {audit.wasteTypes.slice(0, 3).map((waste, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{waste.type}</span>
                              <span>{waste.quantity} {waste.unit}</span>
                            </div>
                          ))}
                          {audit.wasteTypes.length > 3 && (
                            <div className="text-sm text-gray-600">
                              +{audit.wasteTypes.length - 3} more types
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Audit Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {wasteAudits.length}
                      </div>
                      <div className="text-sm text-green-700">Total Audits</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatNumber(wasteAudits.reduce((sum, audit) => sum + audit.totalWaste, 0))}
                      </div>
                      <div className="text-sm text-blue-700">Total Waste Audited</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        {formatNumber(wasteAudits.reduce((sum, audit) => sum + audit.totalCarbonFootprint, 0))}
                      </div>
                      <div className="text-sm text-yellow-700">Total Carbon Footprint</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reduction Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {reductionGoals.map((goal) => (
                  <Card key={goal.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {goal.category} Reduction
                      </CardTitle>
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status.replace('-', ' ')}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Current</div>
                          <div className="font-semibold">{formatNumber(goal.current)} {goal.unit}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Target</div>
                          <div className="font-semibold">{formatNumber(goal.target)} {goal.unit}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Goals Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {reductionGoals.filter(g => g.status === 'on-track').length}
                      </div>
                      <div className="text-sm text-green-700">On Track</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        {reductionGoals.filter(g => g.status === 'behind' || g.status === 'at-risk').length}
                      </div>
                      <div className="text-sm text-yellow-700">Needs Attention</div>
                    </div>
                    
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">
                        {Math.round(reductionGoals.reduce((sum, goal) => sum + goal.progress, 0) / reductionGoals.length)}
                      </div>
                      <div className="text-sm text-purple-700">Average Progress %</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Selected Location Details */}
        {selectedLocation && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedLocation.name} Details</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedLocation(null)}>
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Location Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Address:</span>
                      <span className="font-medium text-right">{selectedLocation.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hours:</span>
                      <span className="font-medium">{selectedLocation.hours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contact:</span>
                      <span className="font-medium">{selectedLocation.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance:</span>
                      <span className="font-medium">{selectedLocation.distance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="font-medium">★ {selectedLocation.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Materials Accepted</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedLocation.materials.map((material, index) => (
                      <Badge key={index} variant="secondary" className="justify-center">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Audit Details */}
        {selectedAudit && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Waste Audit Details - {selectedAudit.location}</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedAudit(null)}>
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Waste Breakdown</h3>
                  <div className="space-y-3">
                    {selectedAudit.wasteTypes.map((waste, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{waste.type}</span>
                          <span className="text-sm text-gray-600">{waste.disposalMethod}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Quantity: {waste.quantity} {waste.unit}</span>
                          <span>Carbon: {waste.carbonFootprint} kg CO2</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Waste:</span>
                      <span className="font-medium">{formatNumber(selectedAudit.totalWaste)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Carbon Footprint:</span>
                      <span className="font-medium">{formatNumber(selectedAudit.totalCarbonFootprint)} kg CO2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{new Date(selectedAudit.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Audit:</span>
                      <span className="font-medium">{new Date(selectedAudit.nextAuditDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2 mt-4">Recommendations</h3>
                  <div className="space-y-2">
                    {selectedAudit.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
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