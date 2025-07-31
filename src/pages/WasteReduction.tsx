import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Recycle, 
  Package, 
  MapPin, 
  BarChart3, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Calendar,
  DollarSign,
  Scale,
  Trash2,
  Leaf
} from 'lucide-react';
import {
  mockPackageReuseProgram,
  mockRecyclingLocations,
  mockMaterialTracking,
  mockWasteAudit,
  mockReductionGoals
} from '@/data/sustainabilityData';
import { 
  PackageReuseProgram, 
  RecyclingLocation, 
  MaterialTracking, 
  WasteAudit, 
  ReductionGoal 
} from '@/types/sustainability';

export default function WasteReduction() {
  const [selectedPackage, setSelectedPackage] = useState<PackageReuseProgram | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<RecyclingLocation | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<WasteAudit | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'analytics'>('overview');

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
      case 'excellent':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-use':
      case 'good':
        return <Clock className="h-4 w-4" />;
      case 'fair':
        return <AlertCircle className="h-4 w-4" />;
      case 'retired':
      case 'poor':
        return <Trash2 className="h-4 w-4" />;
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

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'behind': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate totals
  const totalReusedPackages = mockPackageReuseProgram.length;
  const totalReuseCount = mockPackageReuseProgram.reduce((sum, pkg) => sum + pkg.reuseCount, 0);
  const totalCarbonSaved = mockPackageReuseProgram.reduce((sum, pkg) => sum + pkg.carbonSaved, 0);
  const totalCostSavings = mockPackageReuseProgram.reduce((sum, pkg) => sum + pkg.costSavings, 0);
  const totalRecycledMaterials = mockMaterialTracking.filter(mt => mt.recycled).length;
  const totalWasteAudit = mockWasteAudit.reduce((sum, audit) => sum + audit.totalWaste, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600" />
            Waste Reduction
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive waste management and reduction strategies
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
            <CardTitle className="text-sm font-medium">Reused Packages</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReusedPackages}</div>
            <p className="text-xs text-muted-foreground">
              Packages in reuse program
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalReusedPackages, 8)}
              <span className="text-xs text-green-600 ml-1">+25% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reuses</CardTitle>
            <Recycle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReuseCount}</div>
            <p className="text-xs text-muted-foreground">
              Total package reuses
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalReuseCount, 6)}
              <span className="text-xs text-green-600 ml-1">+33% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
            <Leaf className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalCarbonSaved)} kg</div>
            <p className="text-xs text-muted-foreground">
              CO2 saved through reuse
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalCarbonSaved, 5.5)}
              <span className="text-xs text-green-600 ml-1">+9.1% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatNumber(totalCostSavings)}</div>
            <p className="text-xs text-muted-foreground">
              Savings from reuse program
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalCostSavings, 18.5)}
              <span className="text-xs text-green-600 ml-1">+8.1% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Package Reuse Program
                </CardTitle>
                <CardDescription>
                  Track packages in the reuse program and their environmental impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPackageReuseProgram.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{pkg.packageId}</h3>
                        <Badge className={getStatusColor(pkg.status)}>
                          {pkg.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Original Use</div>
                          <div className="font-semibold">{pkg.originalUse}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Current Use</div>
                          <div className="font-semibold">{pkg.currentUse}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Reuse Count</div>
                          <div className="font-semibold">{pkg.reuseCount}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Condition</div>
                          <Badge className={getStatusColor(pkg.condition)}>
                            {pkg.condition}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Last Used</div>
                          <div className="font-semibold">{new Date(pkg.lastUsed).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Carbon Saved</div>
                          <div className="font-semibold text-green-600">{pkg.carbonSaved} kg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Cost Savings</div>
                          <div className="font-semibold text-green-600">${pkg.costSavings}</div>
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
                  Reuse Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {totalReuseCount}
                    </div>
                    <div className="text-sm text-green-700">Total Package Reuses</div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Status Distribution:</h3>
                    {['available', 'in-use', 'retired'].map((status) => {
                      const count = mockPackageReuseProgram.filter(p => p.status === status).length;
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{status.replace('-', ' ')}</span>
                            <span>{count} packages</span>
                          </div>
                          <Progress 
                            value={(count / totalReusedPackages) * 100} 
                            className="h-2" 
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(totalCarbonSaved)}
                    </div>
                    <div className="text-sm text-blue-700">Total Carbon Saved (kg CO2)</div>
                  </div>

                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      ${formatNumber(totalCostSavings)}
                    </div>
                    <div className="text-sm text-purple-700">Total Cost Savings</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Condition Distribution:</h3>
                    {['excellent', 'good', 'fair', 'poor'].map((condition) => {
                      const count = mockPackageReuseProgram.filter(p => p.condition === condition).length;
                      return (
                        <div key={condition} className="flex justify-between text-sm">
                          <span className="capitalize">{condition}</span>
                          <span>{count} packages</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recycling Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Recycling Locations
                </CardTitle>
                <CardDescription>
                  Find nearby recycling centers and their capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecyclingLocations.map((location) => (
                    <div
                      key={location.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{location.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{location.rating}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        {location.address}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Distance</div>
                          <div className="font-semibold">{location.distance} km</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Hours</div>
                          <div className="font-semibold">{location.hours}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">Materials Accepted:</div>
                        <div className="flex flex-wrap gap-1">
                          {location.materials.map((material, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-600">
                        Contact: {location.contact}
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
                  Location Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {mockRecyclingLocations.length}
                    </div>
                    <div className="text-sm text-green-700">Available Locations</div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Average Ratings:</h3>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {(mockRecyclingLocations.reduce((sum, loc) => sum + loc.rating, 0) / mockRecyclingLocations.length).toFixed(1)}
                      </div>
                      <div className="text-sm text-blue-700">Average Rating</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Materials by Location:</h3>
                    {mockRecyclingLocations.map((location) => (
                      <div key={location.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{location.name}</span>
                          <span>{location.materials.length} materials</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {location.materials.map((material, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatNumber(mockRecyclingLocations.reduce((sum, loc) => sum + loc.distance, 0) / mockRecyclingLocations.length)}
                    </div>
                    <div className="text-sm text-purple-700">Average Distance (km)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Material Tracking Tab */}
        <TabsContent value="tracking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Material Tracking
                </CardTitle>
                <CardDescription>
                  Track materials through the waste management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMaterialTracking.map((material) => (
                    <div key={material.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{material.material}</h3>
                        <Badge className={getStatusColor(material.recycled ? 'excellent' : 'poor')}>
                          {material.recycled ? 'Recycled' : 'Not Recycled'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Quantity</div>
                          <div className="font-semibold">{formatNumber(material.quantity)} {material.unit}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Date</div>
                          <div className="font-semibold">{new Date(material.date).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Source</div>
                          <div className="font-semibold">{material.source}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Destination</div>
                          <div className="font-semibold">{material.destination}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Carbon Footprint</div>
                          <div className="font-semibold">{formatNumber(material.carbonFootprint)} kg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Recycled %</div>
                          <div className="font-semibold text-green-600">{material.recycledPercentage}%</div>
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
                  Tracking Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {totalRecycledMaterials}
                    </div>
                    <div className="text-sm text-green-700">Recycled Materials</div>
                  </div>
                  
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(mockMaterialTracking.reduce((sum, mt) => sum + mt.quantity, 0))}
                    </div>
                    <div className="text-sm text-blue-700">Total Material Tracked</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Recycling Rate:</h3>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round((totalRecycledMaterials / mockMaterialTracking.length) * 100)}%
                      </div>
                      <div className="text-sm text-purple-700">Materials Recycled</div>
                    </div>
                  </div>

                  <div className="text-center p-6 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatNumber(mockMaterialTracking.reduce((sum, mt) => sum + mt.carbonFootprint, 0))}
                    </div>
                    <div className="text-sm text-yellow-700">Total Carbon Footprint (kg)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Waste Audits Tab */}
        <TabsContent value="audits" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Waste Audits
                </CardTitle>
                <CardDescription>
                  Comprehensive waste audit reports and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockWasteAudit.map((audit) => (
                    <div
                      key={audit.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedAudit(audit)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{audit.location}</h3>
                        <div className="text-sm text-gray-500">
                          {new Date(audit.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Total Waste</div>
                          <div className="font-semibold">{formatNumber(audit.totalWaste)} kg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Carbon Footprint</div>
                          <div className="font-semibold">{formatNumber(audit.totalCarbonFootprint)} kg</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">Waste Types:</div>
                        <div className="flex flex-wrap gap-1">
                          {audit.wasteTypes.map((waste, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {waste.type} ({waste.quantity} {waste.unit})
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-600">
                        Next Audit: {new Date(audit.nextAuditDate).toLocaleDateString()}
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
                  Audit Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">
                      {formatNumber(totalWasteAudit)}
                    </div>
                    <div className="text-sm text-red-700">Total Waste Audited (kg)</div>
                  </div>
                  
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(mockWasteAudit.reduce((sum, audit) => sum + audit.totalCarbonFootprint, 0))}
                    </div>
                    <div className="text-sm text-blue-700">Total Carbon Footprint (kg)</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Waste Types Found:</h3>
                    {Array.from(new Set(mockWasteAudit.flatMap(audit => audit.wasteTypes.map(w => w.type)))).map((type) => (
                      <div key={type} className="flex justify-between text-sm">
                        <span className="capitalize">{type}</span>
                        <span>{mockWasteAudit.filter(audit => audit.wasteTypes.some(w => w.type === type)).length} audits</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {mockWasteAudit.reduce((sum, audit) => sum + audit.recommendations.length, 0)}
                    </div>
                    <div className="text-sm text-green-700">Total Recommendations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reduction Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Reduction Goals
                </CardTitle>
                <CardDescription>
                  Track progress towards waste reduction targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReductionGoals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg capitalize">{goal.category}</h3>
                        <Badge className={getGoalStatusColor(goal.status)}>
                          {goal.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
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

                      <div className="mt-3 text-sm text-gray-600">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
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
                  Goals Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {mockReductionGoals.filter(g => g.status === 'on-track').length}
                    </div>
                    <div className="text-sm text-green-700">Goals On Track</div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Status Distribution:</h3>
                    {['on-track', 'behind', 'completed', 'at-risk'].map((status) => {
                      const count = mockReductionGoals.filter(g => g.status === status).length;
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{status.replace('-', ' ')}</span>
                            <span>{count} goals</span>
                          </div>
                          <Progress 
                            value={(count / mockReductionGoals.length) * 100} 
                            className="h-2" 
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(mockReductionGoals.reduce((sum, goal) => sum + goal.progress, 0) / mockReductionGoals.length)}%
                    </div>
                    <div className="text-sm text-blue-700">Average Progress</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Goals by Category:</h3>
                    {['waste', 'energy', 'carbon', 'water'].map((category) => {
                      const goal = mockReductionGoals.find(g => g.category === category);
                      if (!goal) return null;
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{category}</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
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

      {/* Selected Package Details */}
      {selectedPackage && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Package {selectedPackage.packageId}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedPackage(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Package Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Original Use:</span>
                    <span className="font-semibold">{selectedPackage.originalUse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Use:</span>
                    <span className="font-semibold">{selectedPackage.currentUse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reuse Count:</span>
                    <span className="font-semibold">{selectedPackage.reuseCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Condition:</span>
                    <Badge className={getStatusColor(selectedPackage.condition)}>
                      {selectedPackage.condition}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={getStatusColor(selectedPackage.status)}>
                      {selectedPackage.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Environmental Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Carbon Saved:</span>
                    <span className="font-semibold text-green-600">{selectedPackage.carbonSaved} kg CO2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Savings:</span>
                    <span className="font-semibold text-green-600">${selectedPackage.costSavings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Used:</span>
                    <span className="font-semibold">{new Date(selectedPackage.lastUsed).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Location Details */}
      {selectedLocation && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedLocation.name}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedLocation(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Location Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="font-semibold">{selectedLocation.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span className="font-semibold">{selectedLocation.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hours:</span>
                    <span className="font-semibold">{selectedLocation.hours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact:</span>
                    <span className="font-semibold">{selectedLocation.contact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{selectedLocation.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Materials Accepted</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.materials.map((material, index) => (
                    <Badge key={index} variant="outline">
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
              <span>Waste Audit - {selectedAudit.location}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedAudit(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Audit Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-semibold">{new Date(selectedAudit.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-semibold">{selectedAudit.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Waste:</span>
                    <span className="font-semibold">{formatNumber(selectedAudit.totalWaste)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon Footprint:</span>
                    <span className="font-semibold">{formatNumber(selectedAudit.totalCarbonFootprint)} kg CO2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Audit:</span>
                    <span className="font-semibold">{new Date(selectedAudit.nextAuditDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Waste Types</h3>
                <div className="space-y-3">
                  {selectedAudit.wasteTypes.map((waste, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium capitalize">{waste.type}</span>
                        <span className="text-sm">{waste.quantity} {waste.unit}</span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>Disposal: {waste.disposalMethod}</div>
                        <div>Carbon: {formatNumber(waste.carbonFootprint)} kg CO2</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Recommendations</h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedAudit.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-gray-600">{recommendation}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 