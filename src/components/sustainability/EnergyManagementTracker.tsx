import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Sun, 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  DollarSign,
  BarChart3,
  Activity,
  Gauge
} from 'lucide-react';
import {
  SolarPanel,
  EnergyUsageTrend,
  EfficiencyImprovement,
  GreenCertification
} from '@/types/sustainability';

interface EnergyManagementTrackerProps {
  solarPanels: SolarPanel[];
  energyTrends: EnergyUsageTrend[];
  efficiencyImprovements: EfficiencyImprovement[];
  greenCertifications: GreenCertification[];
}

export default function EnergyManagementTracker({
  solarPanels,
  energyTrends,
  efficiencyImprovements,
  greenCertifications
}: EnergyManagementTrackerProps) {
  const [selectedPanel, setSelectedPanel] = useState<SolarPanel | null>(null);
  const [selectedImprovement, setSelectedImprovement] = useState<EfficiencyImprovement | null>(null);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending-renewal': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 'bronze': return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-blue-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalSolarCapacity = solarPanels.reduce((sum, panel) => sum + panel.capacity, 0);
  const totalSolarOutput = solarPanels.reduce((sum, panel) => sum + panel.currentOutput, 0);
  const totalEnergyGenerated = solarPanels.reduce((sum, panel) => sum + panel.totalEnergyGenerated, 0);
  const totalCarbonOffset = solarPanels.reduce((sum, panel) => sum + panel.carbonOffset, 0);
  const totalCostSavings = solarPanels.reduce((sum, panel) => sum + panel.costSavings, 0);

  const totalEfficiencySavings = efficiencyImprovements.reduce((sum, improvement) => sum + improvement.savings.energy, 0);
  const totalEfficiencyCostSavings = efficiencyImprovements.reduce((sum, improvement) => sum + improvement.savings.cost, 0);

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Zap className="h-6 w-6" />
          Energy Management Tracker
        </CardTitle>
        <CardDescription>
          Monitor solar panel performance, energy efficiency, and green certifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(totalSolarCapacity)}
            </div>
            <div className="text-sm text-green-700">kW Solar Capacity</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(totalCarbonOffset)}
            </div>
            <div className="text-sm text-blue-700">kg CO2 Offset</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              ${formatNumber(totalCostSavings + totalEfficiencyCostSavings)}
            </div>
            <div className="text-sm text-yellow-700">Total Cost Savings</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {greenCertifications.length}
            </div>
            <div className="text-sm text-purple-700">Green Certifications</div>
          </div>
        </div>

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
              <div className="space-y-4">
                {solarPanels.map((panel) => (
                  <Card 
                    key={panel.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedPanel(panel)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sun className="h-5 w-5" />
                        {panel.location}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{panel.capacity} kW</Badge>
                        <div className={`text-sm font-medium ${getEfficiencyColor(panel.efficiency)}`}>
                          {panel.efficiency}% efficiency
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Current Output</div>
                          <div className="font-semibold">{panel.currentOutput} kW</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Total Generated</div>
                          <div className="font-semibold">{formatNumber(panel.totalEnergyGenerated)} kWh</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Carbon Offset</div>
                          <div className="font-semibold text-green-600">
                            {formatNumber(panel.carbonOffset)} kg CO2
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Cost Savings</div>
                          <div className="font-semibold text-green-600">
                            ${formatNumber(panel.costSavings)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Installation Date:</span>
                          <span>{new Date(panel.installationDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Maintenance:</span>
                          <span>{new Date(panel.lastMaintenance).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Next Maintenance:</span>
                          <span>{new Date(panel.nextMaintenance).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Solar Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {Math.round((totalSolarOutput / totalSolarCapacity) * 100)}%
                      </div>
                      <div className="text-sm text-green-700">Capacity Utilization</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatNumber(totalEnergyGenerated)}
                      </div>
                      <div className="text-sm text-blue-700">Total kWh Generated</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        ${formatNumber(totalCostSavings)}
                      </div>
                      <div className="text-sm text-yellow-700">Total Cost Savings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Energy Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {energyTrends.map((trend) => (
                  <Card key={trend.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        {trend.period.charAt(0).toUpperCase() + trend.period.slice(1)} - {trend.date}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Consumption</div>
                          <div className="font-semibold">{formatNumber(trend.consumption)} kWh</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Cost</div>
                          <div className="font-semibold">${formatNumber(trend.cost)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Efficiency</div>
                          <div className={`font-semibold ${getEfficiencyColor(trend.efficiency)}`}>
                            {trend.efficiency}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Renewable %</div>
                          <div className="font-semibold text-green-600">
                            {trend.renewablePercentage}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Carbon Footprint:</span>
                          <span className="font-medium">{formatNumber(trend.carbonFootprint)} kg CO2</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Peak Demand:</span>
                          <span className="font-medium">{formatNumber(trend.peakDemand)} kW</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {Math.round(energyTrends.reduce((sum, trend) => sum + trend.renewablePercentage, 0) / energyTrends.length)}%
                      </div>
                      <div className="text-sm text-green-700">Average Renewable Energy</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {Math.round(energyTrends.reduce((sum, trend) => sum + trend.efficiency, 0) / energyTrends.length)}%
                      </div>
                      <div className="text-sm text-blue-700">Average Efficiency</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        ${formatNumber(energyTrends.reduce((sum, trend) => sum + trend.cost, 0))}
                      </div>
                      <div className="text-sm text-yellow-700">Total Energy Cost</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Efficiency Improvements Tab */}
          <TabsContent value="efficiency" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {efficiencyImprovements.map((improvement) => (
                  <Card 
                    key={improvement.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedImprovement(improvement)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        {improvement.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="capitalize">
                          {improvement.category}
                        </Badge>
                        <Badge className={getStatusColor(improvement.status)}>
                          {improvement.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{improvement.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Implementation Cost</div>
                          <div className="font-semibold">${formatNumber(improvement.cost)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Payback Period</div>
                          <div className="font-semibold">{improvement.paybackPeriod} months</div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-sm text-gray-500">Energy Saved</div>
                            <div className="font-semibold text-green-600">
                              {formatNumber(improvement.savings.energy)} kWh
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Cost Savings</div>
                            <div className="font-semibold text-green-600">
                              ${formatNumber(improvement.savings.cost)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Carbon Saved</div>
                            <div className="font-semibold text-green-600">
                              {formatNumber(improvement.savings.carbon)} kg
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Implemented: {new Date(improvement.implementationDate).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Efficiency Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {formatNumber(totalEfficiencySavings)}
                      </div>
                      <div className="text-sm text-green-700">Total kWh Saved</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        ${formatNumber(totalEfficiencyCostSavings)}
                      </div>
                      <div className="text-sm text-blue-700">Total Cost Savings</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        {efficiencyImprovements.filter(imp => imp.status === 'completed').length}
                      </div>
                      <div className="text-sm text-yellow-700">Completed Improvements</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Green Certifications Tab */}
          <TabsContent value="certifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {greenCertifications.map((cert) => (
                  <Card key={cert.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        {cert.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getLevelColor(cert.level)}>
                          {cert.level}
                        </Badge>
                        <Badge className={getStatusColor(cert.status)}>
                          {cert.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Issuer:</span>
                          <span className="font-medium">{cert.issuer}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Score:</span>
                          <span className="font-medium">{cert.score}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Issue Date:</span>
                          <span>{new Date(cert.issueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Expiry Date:</span>
                          <span>{new Date(cert.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Requirements:</div>
                        <div className="space-y-1">
                          {cert.requirements.map((req, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Certification Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {greenCertifications.filter(cert => cert.status === 'active').length}
                      </div>
                      <div className="text-sm text-green-700">Active Certifications</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {Math.round(greenCertifications.reduce((sum, cert) => sum + cert.score, 0) / greenCertifications.length)}
                      </div>
                      <div className="text-sm text-blue-700">Average Score</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        {greenCertifications.filter(cert => cert.level === 'gold' || cert.level === 'platinum').length}
                      </div>
                      <div className="text-sm text-yellow-700">Premium Certifications</div>
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
                <span>{selectedPanel.location} Solar Panel Details</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedPanel(null)}>
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Performance Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span className="font-medium">{selectedPanel.capacity} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Output:</span>
                      <span className="font-medium">{selectedPanel.currentOutput} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Efficiency:</span>
                      <span className={`font-medium ${getEfficiencyColor(selectedPanel.efficiency)}`}>
                        {selectedPanel.efficiency}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Energy Generated:</span>
                      <span className="font-medium">{formatNumber(selectedPanel.totalEnergyGenerated)} kWh</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Environmental Impact</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Carbon Offset:</span>
                      <span className="font-medium text-green-600">
                        {formatNumber(selectedPanel.carbonOffset)} kg CO2
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost Savings:</span>
                      <span className="font-medium text-green-600">
                        ${formatNumber(selectedPanel.costSavings)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Installation Date:</span>
                      <span className="font-medium">
                        {new Date(selectedPanel.installationDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Maintenance:</span>
                      <span className="font-medium">
                        {new Date(selectedPanel.lastMaintenance).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Maintenance:</span>
                      <span className="font-medium">
                        {new Date(selectedPanel.nextMaintenance).toLocaleDateString()}
                      </span>
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
                <span>{selectedImprovement.name} Details</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedImprovement(null)}>
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Project Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-medium capitalize">{selectedImprovement.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium">{selectedImprovement.status.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Implementation Cost:</span>
                      <span className="font-medium">${formatNumber(selectedImprovement.cost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payback Period:</span>
                      <span className="font-medium">{selectedImprovement.paybackPeriod} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Implementation Date:</span>
                      <span className="font-medium">
                        {new Date(selectedImprovement.implementationDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2 mt-4">Description</h3>
                  <p className="text-sm text-gray-600">{selectedImprovement.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Savings Breakdown</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Energy Savings</span>
                        <span className="font-semibold text-green-600">
                          {formatNumber(selectedImprovement.savings.energy)} kWh
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Cost Savings</span>
                        <span className="font-semibold text-blue-600">
                          ${formatNumber(selectedImprovement.savings.cost)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Carbon Savings</span>
                        <span className="font-semibold text-yellow-600">
                          {formatNumber(selectedImprovement.savings.carbon)} kg CO2
                        </span>
                      </div>
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