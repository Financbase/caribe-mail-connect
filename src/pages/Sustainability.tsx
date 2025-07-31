import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Leaf, 
  TrendingUp, 
  Package, 
  Truck, 
  Sun, 
  MapPin,
  Calculator,
  BarChart3,
  Award,
  Users,
  Zap,
  Recycle,
  Globe,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Import all sustainability components
import CarbonFootprintCalculator from '@/components/sustainability/CarbonFootprintCalculator';
import GreenShippingTracker from '@/components/sustainability/GreenShippingTracker';
import WasteReductionTracker from '@/components/sustainability/WasteReductionTracker';
import EnergyManagementTracker from '@/components/sustainability/EnergyManagementTracker';
import CommunityImpactTracker from '@/components/sustainability/CommunityImpactTracker';
import EnvironmentalVisualization from '@/components/sustainability/EnvironmentalVisualization';
import GreenBadges from '@/components/sustainability/GreenBadges';
import TreePlantingCounter from '@/components/sustainability/TreePlantingCounter';

// Import types and service
import { SustainabilityDashboard } from '@/types/sustainability';
import { SustainabilityService } from '@/services/SustainabilityService';

// Import mock data as fallback
import { 
  mockCarbonFootprint, 
  mockGreenInitiatives, 
  mockRecyclingMetrics, 
  mockEnergyConsumption, 
  mockSustainabilityScore,
  mockGreenBadges,
  mockTreePlantingCounter
} from '@/data/sustainabilityData';

const Sustainability: React.FC = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dashboardData, setDashboardData] = useState<SustainabilityDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await SustainabilityService.getSustainabilityDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching sustainability data:', err);
        setError('Failed to load sustainability data. Using demo data instead.');
        // Use mock data as fallback
        setDashboardData({
          carbonFootprint: mockCarbonFootprint,
          greenInitiatives: mockGreenInitiatives,
          recyclingMetrics: mockRecyclingMetrics,
          energyConsumption: mockEnergyConsumption,
          sustainabilityScore: mockSustainabilityScore,
          greenBadges: mockGreenBadges,
          treePlantingCounter: mockTreePlantingCounter,
          // Add empty arrays for new data types as fallback
          ecoFriendlyPackaging: [],
          carbonOffsetPrograms: [],
          electricVehicles: [],
          consolidatedShipping: [],
          paperlessInitiatives: [],
          packageReuseProgram: [],
          recyclingLocations: [],
          materialTracking: [],
          wasteAudit: [],
          reductionGoals: [],
          solarPanels: [],
          energyUsageTrends: [],
          efficiencyImprovements: [],
          greenCertifications: [],
          localInitiatives: [],
          environmentalEducation: [],
          partnerPrograms: [],
          customerParticipation: [],
          impactReport: [],
          environmentalVisualizations: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate total environmental impact
  const totalEnvironmentalImpact = dashboardData ? SustainabilityService.calculateEnvironmentalImpact(dashboardData) : {
    totalCarbonSaved: 0,
    totalCostSavings: 0,
    totalPeopleReached: 0,
    totalTreesPlanted: 0
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sustainability data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sustainability Hub</h1>
            <p className="text-gray-600">Track and manage your environmental impact across all operations</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 items-center">
          <Button 
            onClick={() => setShowCalculator(!showCalculator)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            Carbon Calculator
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Carbon Calculator */}
      {showCalculator && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Carbon Footprint Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CarbonFootprintCalculator />
          </CardContent>
        </Card>
      )}

      {/* Environmental Impact Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Environmental Impact Overview
          </CardTitle>
          <CardDescription>
            Total impact across all sustainability initiatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {totalEnvironmentalImpact.totalCarbonSaved.toLocaleString()} kg
              </div>
              <div className="text-sm text-gray-600">Carbon Saved</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${totalEnvironmentalImpact.totalCostSavings.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Cost Savings</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {totalEnvironmentalImpact.totalPeopleReached.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">People Reached</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                {totalEnvironmentalImpact.totalTreesPlanted.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Trees Planted</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shipping">Green Shipping</TabsTrigger>
          <TabsTrigger value="waste">Waste Reduction</TabsTrigger>
          <TabsTrigger value="energy">Energy Management</TabsTrigger>
          <TabsTrigger value="community">Community Impact</TabsTrigger>
          <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
          <TabsTrigger value="badges">Achievements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TreePlantingCounter treePlanting={dashboardData?.treePlantingCounter || mockTreePlantingCounter} />
            <GreenBadges badges={dashboardData?.greenBadges || mockGreenBadges} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Eco-Friendly Packaging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.ecoFriendlyPackaging?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Active programs</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Electric Vehicles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.electricVehicles?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Active vehicles</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Solar Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.solarPanels?.reduce((total, panel) => total + (panel.capacityKw || 0), 0).toFixed(1)} kW
                </div>
                <p className="text-xs text-muted-foreground">Total capacity</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Green Shipping Tab */}
        <TabsContent value="shipping" className="space-y-6">
          <GreenShippingTracker 
            ecoFriendlyPackaging={dashboardData?.ecoFriendlyPackaging || []}
            carbonOffsetPrograms={dashboardData?.carbonOffsetPrograms || []}
            electricVehicles={dashboardData?.electricVehicles || []}
            consolidatedShipping={dashboardData?.consolidatedShipping || []}
            paperlessInitiatives={dashboardData?.paperlessInitiatives || []}
          />
        </TabsContent>

        {/* Waste Reduction Tab */}
        <TabsContent value="waste" className="space-y-6">
          <WasteReductionTracker 
            packageReuseProgram={dashboardData?.packageReuseProgram || []}
            recyclingLocations={dashboardData?.recyclingLocations || []}
            materialTracking={dashboardData?.materialTracking || []}
            wasteAudit={dashboardData?.wasteAudit || []}
            reductionGoals={dashboardData?.reductionGoals || []}
          />
        </TabsContent>

        {/* Energy Management Tab */}
        <TabsContent value="energy" className="space-y-6">
          <EnergyManagementTracker 
            solarPanels={dashboardData?.solarPanels || []}
            energyUsageTrends={dashboardData?.energyUsageTrends || []}
            efficiencyImprovements={dashboardData?.efficiencyImprovements || []}
            greenCertifications={dashboardData?.greenCertifications || []}
          />
        </TabsContent>

        {/* Community Impact Tab */}
        <TabsContent value="community" className="space-y-6">
          <CommunityImpactTracker 
            localInitiatives={dashboardData?.localInitiatives || []}
            environmentalEducation={dashboardData?.environmentalEducation || []}
            partnerPrograms={dashboardData?.partnerPrograms || []}
            customerParticipation={dashboardData?.customerParticipation || []}
            impactReport={dashboardData?.impactReport || []}
          />
        </TabsContent>

        {/* Initiatives Tab */}
        <TabsContent value="initiatives" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(dashboardData?.greenInitiatives || mockGreenInitiatives).map((initiative) => (
              <Card key={initiative.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{initiative.name}</CardTitle>
                    <Badge variant={initiative.status === 'completed' ? 'default' : 'secondary'}>
                      {initiative.status}
                    </Badge>
                  </div>
                  <CardDescription>{initiative.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Carbon Saved:</span>
                      <span className="font-medium">{initiative.carbonSaved} kg CO2</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cost Savings:</span>
                      <span className="font-medium">${initiative.costSavings}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>People Reached:</span>
                      <span className="font-medium">{initiative.peopleReached}</span>
                    </div>
                    <Progress value={initiative.progress} className="mt-2" />
                    <div className="text-xs text-gray-500 text-right">
                      {initiative.progress}% complete
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GreenBadges badges={dashboardData?.greenBadges || mockGreenBadges} />
            <TreePlantingCounter treePlanting={dashboardData?.treePlantingCounter || mockTreePlantingCounter} />
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Carbon Footprint
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Current Footprint</span>
                    <span className="font-bold">{dashboardData?.carbonFootprint?.currentFootprint || mockCarbonFootprint.currentFootprint} kg CO2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Target</span>
                    <span className="font-bold">{dashboardData?.carbonFootprint?.targetFootprint || mockCarbonFootprint.targetFootprint} kg CO2</span>
                  </div>
                  <Progress 
                    value={dashboardData?.carbonFootprint?.reductionPercentage || mockCarbonFootprint.reductionPercentage} 
                    className="w-full" 
                  />
                  <div className="text-sm text-gray-600">
                    {dashboardData?.carbonFootprint?.reductionPercentage || mockCarbonFootprint.reductionPercentage}% reduction achieved
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Reduction Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(dashboardData?.reductionGoals || []).map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{goal.goalType}</span>
                        <span className="text-sm">
                          {goal.currentAmount} / {goal.targetAmount} {goal.unit}
                        </span>
                      </div>
                      <Progress 
                        value={(goal.currentAmount / goal.targetAmount) * 100} 
                        className="w-full" 
                      />
                    </div>
                  ))}
                  {(!dashboardData?.reductionGoals || dashboardData.reductionGoals.length === 0) && (
                    <p className="text-sm text-gray-500">No reduction goals set</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Environmental Visualizations */}
          {dashboardData?.environmentalVisualizations && dashboardData.environmentalVisualizations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Environmental Visualizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.environmentalVisualizations.map((visualization) => (
                    <EnvironmentalVisualization 
                      key={visualization.id}
                      visualization={visualization}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sustainability; 