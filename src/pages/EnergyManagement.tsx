import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Sun, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  DollarSign,
  Battery,
  Target,
  Award,
  BarChart3,
  Settings,
  Gauge
} from 'lucide-react';
import {
  mockSolarPanels,
  mockEnergyUsageTrends,
  mockEfficiencyImprovements,
  mockGreenCertifications
} from '@/data/sustainabilityData';
import { 
  SolarPanel, 
  EnergyUsageTrend, 
  EfficiencyImprovement, 
  GreenCertification 
} from '@/types/sustainability';

export default function EnergyManagement() {
  const [selectedPanel, setSelectedPanel] = useState<SolarPanel | null>(null);
  const [selectedImprovement, setSelectedImprovement] = useState<EfficiencyImprovement | null>(null);
  const [selectedCertification, setSelectedCertification] = useState<GreenCertification | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'analytics'>('overview');

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending-renewal': return 'bg-yellow-100 text-yellow-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
      case 'pending-renewal':
        return <Clock className="h-4 w-4" />;
      case 'expired':
      case 'planned':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getCertificationLevelColor = (level: string) => {
    switch (level) {
      case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 'bronze': return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default: return 'bg-gray-200';
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
  const totalSolarCapacity = mockSolarPanels.reduce((sum, panel) => sum + panel.capacity, 0);
  const totalSolarOutput = mockSolarPanels.reduce((sum, panel) => sum + panel.currentOutput, 0);
  const totalSolarEfficiency = Math.round((totalSolarOutput / totalSolarCapacity) * 100);
  const totalEnergyGenerated = mockSolarPanels.reduce((sum, panel) => sum + panel.totalEnergyGenerated, 0);
  const totalCarbonOffset = mockSolarPanels.reduce((sum, panel) => sum + panel.carbonOffset, 0);
  const totalCostSavings = mockSolarPanels.reduce((sum, panel) => sum + panel.costSavings, 0);
  const totalImprovementSavings = mockEfficiencyImprovements.reduce((sum, imp) => sum + imp.savings.cost, 0);
  const activeCertifications = mockGreenCertifications.filter(cert => cert.status === 'active').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="h-8 w-8 text-yellow-600" />
            Energy Management
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor energy consumption, solar generation, and efficiency improvements
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
            <CardTitle className="text-sm font-medium">Solar Capacity</CardTitle>
            <Sun className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSolarCapacity} kW</div>
            <p className="text-xs text-muted-foreground">
              Total solar panel capacity
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalSolarCapacity, 70)}
              <span className="text-xs text-green-600 ml-1">+7.1% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Output</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSolarOutput} kW</div>
            <p className="text-xs text-muted-foreground">
              Current solar generation
            </p>
            <div className="flex items-center mt-2">
              <span className="text-xs text-blue-600">{totalSolarEfficiency}% efficiency</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Generated</CardTitle>
            <Battery className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalEnergyGenerated)} kWh</div>
            <p className="text-xs text-muted-foreground">
              Total solar energy generated
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalEnergyGenerated, 20000)}
              <span className="text-xs text-green-600 ml-1">+15% from last month</span>
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
              Total energy cost savings
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalCostSavings, 4000)}
              <span className="text-xs text-green-600 ml-1">+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="solar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="solar">Solar Panels</TabsTrigger>
          <TabsTrigger value="trends">Energy Trends</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        {/* Solar Panels Tab */}
        <TabsContent value="solar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Solar Panel Monitoring
                </CardTitle>
                <CardDescription>
                  Real-time monitoring of solar panel performance and efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSolarPanels.map((panel) => (
                    <div
                      key={panel.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedPanel(panel)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{panel.location}</h3>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{panel.efficiency}%</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Capacity</div>
                          <div className="font-semibold">{panel.capacity} kW</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Current Output</div>
                          <div className="font-semibold">{panel.currentOutput} kW</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Total Generated</div>
                          <div className="font-semibold">{formatNumber(panel.totalEnergyGenerated)} kWh</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Carbon Offset</div>
                          <div className="font-semibold text-green-600">{formatNumber(panel.carbonOffset)} kg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Cost Savings</div>
                          <div className="font-semibold text-green-600">${formatNumber(panel.costSavings)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Last Maintenance</div>
                          <div className="font-semibold">{new Date(panel.lastMaintenance).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Next Maintenance</div>
                          <div className="font-semibold">{new Date(panel.nextMaintenance).toLocaleDateString()}</div>
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
                  Solar Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">
                      {totalSolarEfficiency}%
                    </div>
                    <div className="text-sm text-yellow-700">Average Efficiency</div>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(totalCarbonOffset)}
                    </div>
                    <div className="text-sm text-green-700">Total Carbon Offset (kg CO2)</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Panel Performance:</h3>
                    {mockSolarPanels.map((panel) => (
                      <div key={panel.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{panel.location}</span>
                          <span>{panel.efficiency}%</span>
                        </div>
                        <Progress value={panel.efficiency} className="h-2" />
                      </div>
                    ))}
                  </div>

                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ${formatNumber(totalCostSavings)}
                    </div>
                    <div className="text-sm text-blue-700">Total Cost Savings</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Maintenance Schedule:</h3>
                    {mockSolarPanels.map((panel) => (
                      <div key={panel.id} className="flex justify-between text-sm">
                        <span>{panel.location}</span>
                        <span>{new Date(panel.nextMaintenance).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Energy Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Energy Usage Trends
                </CardTitle>
                <CardDescription>
                  Track energy consumption patterns and efficiency over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEnergyUsageTrends.map((trend) => (
                    <div key={trend.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg capitalize">{trend.period}</h3>
                        <div className="text-sm text-gray-500">
                          {new Date(trend.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Consumption</div>
                          <div className="font-semibold">{formatNumber(trend.consumption)} kWh</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Cost</div>
                          <div className="font-semibold">${formatNumber(trend.cost)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Carbon Footprint</div>
                          <div className="font-semibold">{formatNumber(trend.carbonFootprint)} kg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Efficiency</div>
                          <div className="font-semibold">{trend.efficiency}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Peak Demand</div>
                          <div className="font-semibold">{trend.peakDemand} kW</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Renewable Percentage</span>
                          <span className="font-medium">{trend.renewablePercentage}%</span>
                        </div>
                        <Progress value={trend.renewablePercentage} className="h-2" />
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
                  Trend Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatNumber(mockEnergyUsageTrends.reduce((sum, trend) => sum + trend.consumption, 0))}
                    </div>
                    <div className="text-sm text-blue-700">Total Consumption (kWh)</div>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${formatNumber(mockEnergyUsageTrends.reduce((sum, trend) => sum + trend.cost, 0))}
                    </div>
                    <div className="text-sm text-green-700">Total Energy Cost</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Efficiency Trends:</h3>
                    {mockEnergyUsageTrends.map((trend) => (
                      <div key={trend.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{new Date(trend.date).toLocaleDateString()}</span>
                          <span>{trend.efficiency}%</span>
                        </div>
                        <Progress value={trend.efficiency} className="h-2" />
                      </div>
                    ))}
                  </div>

                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(mockEnergyUsageTrends.reduce((sum, trend) => sum + trend.renewablePercentage, 0) / mockEnergyUsageTrends.length)}%
                    </div>
                    <div className="text-sm text-purple-700">Average Renewable Percentage</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Efficiency Improvements Tab */}
        <TabsContent value="efficiency" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Efficiency Improvements
                </CardTitle>
                <CardDescription>
                  Track energy efficiency projects and their impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEfficiencyImprovements.map((improvement) => (
                    <div
                      key={improvement.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedImprovement(improvement)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{improvement.name}</h3>
                        <Badge className={getStatusColor(improvement.status)}>
                          {improvement.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{improvement.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Category</div>
                          <div className="font-semibold capitalize">{improvement.category}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Implementation Date</div>
                          <div className="font-semibold">{new Date(improvement.implementationDate).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Energy Savings</div>
                          <div className="font-semibold text-green-600">{formatNumber(improvement.savings.energy)} kWh</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Cost Savings</div>
                          <div className="font-semibold text-green-600">${formatNumber(improvement.savings.cost)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Carbon Saved</div>
                          <div className="font-semibold text-green-600">{formatNumber(improvement.savings.carbon)} kg</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Cost</div>
                          <div className="font-semibold">${formatNumber(improvement.cost)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Payback Period</div>
                          <div className="font-semibold">{improvement.paybackPeriod} months</div>
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
                  Efficiency Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      ${formatNumber(totalImprovementSavings)}
                    </div>
                    <div className="text-sm text-green-700">Total Cost Savings</div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Status Distribution:</h3>
                    {['planned', 'in-progress', 'completed'].map((status) => {
                      const count = mockEfficiencyImprovements.filter(imp => imp.status === status).length;
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{status.replace('-', ' ')}</span>
                            <span>{count} improvements</span>
                          </div>
                          <Progress 
                            value={(count / mockEfficiencyImprovements.length) * 100} 
                            className="h-2" 
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(mockEfficiencyImprovements.reduce((sum, imp) => sum + imp.savings.energy, 0))}
                    </div>
                    <div className="text-sm text-blue-700">Total Energy Saved (kWh)</div>
                  </div>

                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatNumber(mockEfficiencyImprovements.reduce((sum, imp) => sum + imp.savings.carbon, 0))}
                    </div>
                    <div className="text-sm text-purple-700">Total Carbon Saved (kg CO2)</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Improvements by Category:</h3>
                    {['lighting', 'hvac', 'equipment', 'building', 'process'].map((category) => {
                      const improvements = mockEfficiencyImprovements.filter(imp => imp.category === category);
                      const count = improvements.length;
                      const totalSavings = improvements.reduce((sum, imp) => sum + imp.savings.cost, 0);
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{category}</span>
                            <span>{count} projects</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            Total savings: ${formatNumber(totalSavings)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Green Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Green Certifications
                </CardTitle>
                <CardDescription>
                  Track environmental certifications and compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockGreenCertifications.map((certification) => (
                    <div
                      key={certification.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedCertification(certification)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{certification.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${getCertificationLevelColor(certification.level)}`}>
                            {certification.level.charAt(0).toUpperCase()}
                          </div>
                          <Badge className={getStatusColor(certification.status)}>
                            {certification.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Issuer</div>
                          <div className="font-semibold">{certification.issuer}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Level</div>
                          <div className="font-semibold capitalize">{certification.level}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Issue Date</div>
                          <div className="font-semibold">{new Date(certification.issueDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Expiry Date</div>
                          <div className="font-semibold">{new Date(certification.expiryDate).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">Score: {certification.score}/100</div>
                        <Progress value={certification.score} className="h-2" />
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
                  Certification Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {activeCertifications}
                    </div>
                    <div className="text-sm text-green-700">Active Certifications</div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Status Distribution:</h3>
                    {['active', 'expired', 'pending-renewal'].map((status) => {
                      const count = mockGreenCertifications.filter(cert => cert.status === status).length;
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{status.replace('-', ' ')}</span>
                            <span>{count} certifications</span>
                          </div>
                          <Progress 
                            value={(count / mockGreenCertifications.length) * 100} 
                            className="h-2" 
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(mockGreenCertifications.reduce((sum, cert) => sum + cert.score, 0) / mockGreenCertifications.length)}
                    </div>
                    <div className="text-sm text-blue-700">Average Certification Score</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Certifications by Level:</h3>
                    {['platinum', 'gold', 'silver', 'bronze'].map((level) => {
                      const count = mockGreenCertifications.filter(cert => cert.level === level).length;
                      return (
                        <div key={level} className="flex justify-between text-sm">
                          <span className="capitalize">{level}</span>
                          <span>{count} certifications</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {mockGreenCertifications.filter(cert => new Date(cert.expiryDate) > new Date()).length}
                    </div>
                    <div className="text-sm text-purple-700">Valid Certifications</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Selected Panel Details */}
      {selectedPanel && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Solar Panel - {selectedPanel.location}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedPanel(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Panel Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-semibold">{selectedPanel.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="font-semibold">{selectedPanel.capacity} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Output:</span>
                    <span className="font-semibold">{selectedPanel.currentOutput} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Efficiency:</span>
                    <span className="font-semibold">{selectedPanel.efficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Installation Date:</span>
                    <span className="font-semibold">{new Date(selectedPanel.installationDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Energy Generated:</span>
                    <span className="font-semibold">{formatNumber(selectedPanel.totalEnergyGenerated)} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon Offset:</span>
                    <span className="font-semibold text-green-600">{formatNumber(selectedPanel.carbonOffset)} kg CO2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Savings:</span>
                    <span className="font-semibold text-green-600">${formatNumber(selectedPanel.costSavings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Maintenance:</span>
                    <span className="font-semibold">{new Date(selectedPanel.lastMaintenance).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Maintenance:</span>
                    <span className="font-semibold">{new Date(selectedPanel.nextMaintenance).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Improvement Details */}
      {selectedImprovement && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedImprovement.name}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedImprovement(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Project Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-semibold capitalize">{selectedImprovement.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={getStatusColor(selectedImprovement.status)}>
                      {selectedImprovement.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Implementation Date:</span>
                    <span className="font-semibold">{new Date(selectedImprovement.implementationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span className="font-semibold">${formatNumber(selectedImprovement.cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payback Period:</span>
                    <span className="font-semibold">{selectedImprovement.paybackPeriod} months</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">{selectedImprovement.description}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Savings Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Energy Savings:</span>
                    <span className="font-semibold text-green-600">{formatNumber(selectedImprovement.savings.energy)} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Savings:</span>
                    <span className="font-semibold text-green-600">${formatNumber(selectedImprovement.savings.cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon Saved:</span>
                    <span className="font-semibold text-green-600">{formatNumber(selectedImprovement.savings.carbon)} kg CO2</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Certification Details */}
      {selectedCertification && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedCertification.name}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedCertification(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Certification Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Issuer:</span>
                    <span className="font-semibold">{selectedCertification.issuer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${getCertificationLevelColor(selectedCertification.level)}`}>
                        {selectedCertification.level.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold capitalize">{selectedCertification.level}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={getStatusColor(selectedCertification.status)}>
                      {selectedCertification.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Issue Date:</span>
                    <span className="font-semibold">{new Date(selectedCertification.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expiry Date:</span>
                    <span className="font-semibold">{new Date(selectedCertification.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Performance & Requirements</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Score:</span>
                    <span className="font-semibold">{selectedCertification.score}/100</span>
                  </div>
                  <Progress value={selectedCertification.score} className="h-2" />
                  
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {selectedCertification.requirements.map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 