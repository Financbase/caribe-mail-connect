import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building,
  Zap,
  Thermometer,
  Wrench,
  AlertTriangle,
  TrendingUp,
  Target,
  Activity,
  Shield,
  Wind
} from 'lucide-react';
import { FacilityDashboard } from '@/components/facility/FacilityDashboard';
import { PowerOutageManager } from '@/components/facility/PowerOutageManager';
import { EnvironmentalControls } from '@/components/facility/EnvironmentalControls';
import { MaintenanceScheduler } from '@/components/facility/MaintenanceScheduler';
import { EmergencyResponse } from '@/components/facility/EmergencyResponse';
import { Badge } from '@/components/ui/badge';

export function Facility() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const facilityStats = {
    totalAssets: 24,
    operationalAssets: 22,
    maintenanceDue: 3,
    energyEfficiency: 85,
    securityStatus: 'Active',
    environmentalScore: 92,
    emergencyContacts: 8,
    activeIncidents: 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facility Management</h1>
          <p className="text-muted-foreground">
            Comprehensive facility monitoring and management system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            System Status
          </Button>
          <Button>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Mode
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-blue-600">
                {facilityStats.operationalAssets}/{facilityStats.totalAssets}
              </span>
              <Badge variant="outline">Operational</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Energy Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-green-600">
                {facilityStats.energyEfficiency}%
              </span>
              <Badge variant="default">Excellent</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-purple-600">
                {facilityStats.securityStatus}
              </span>
              <Badge variant="default">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Thermometer className="h-4 w-4 mr-2" />
              Environment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-cyan-600">
                {facilityStats.environmentalScore}%
              </span>
              <Badge variant="default">Optimal</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="power" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Power</span>
          </TabsTrigger>
          <TabsTrigger value="environment" className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4" />
            <span>Environment</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center space-x-2">
            <Wrench className="h-4 w-4" />
            <span>Mantenimiento</span>
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Emergency</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <FacilityDashboard />
        </TabsContent>

        <TabsContent value="power" className="space-y-6">
          <PowerOutageManager />
        </TabsContent>

        <TabsContent value="environment" className="space-y-6">
          <EnvironmentalControls />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <MaintenanceScheduler />
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <EmergencyResponse />
        </TabsContent>
      </Tabs>
    </div>
  );
} 