import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Users, 
  DollarSign, 
  BarChart3, 
  Palette,
  TrendingUp,
  Target,
  Award,
  Star,
  Globe,
  Settings
} from 'lucide-react';
import { FranchiseDashboard } from '@/components/franchise/FranchiseDashboard';
import { FranchiseePortal } from '@/components/franchise/FranchiseePortal';
import { BrandManagement } from '@/components/franchise/BrandManagement';
import { RoyaltyManagement } from '@/components/franchise/RoyaltyManagement';
import { FranchiseAnalytics } from '@/components/franchise/FranchiseAnalytics';

export function Franchise() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const franchiseStats = {
    totalLocations: 8,
    activeLocations: 6,
    totalRevenue: 6600000,
    averagePerformance: 87,
    networkGrowth: 25,
    satisfactionScore: 87
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Franquicias</h1>
          <p className="text-muted-foreground mt-2">
            Administración integral de la red de franquicias PRMCMS
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
          <Button>
            <TrendingUp className="h-4 w-4 mr-2" />
            Nuevo Reporte
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locaciones Totales</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{franchiseStats.totalLocations}</div>
            <p className="text-xs text-muted-foreground">
              {franchiseStats.activeLocations} activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(franchiseStats.totalRevenue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              +{franchiseStats.networkGrowth}% este año
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendimiento Promedio</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{franchiseStats.averagePerformance}%</div>
            <p className="text-xs text-muted-foreground">
              Puntuación de la red
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{franchiseStats.satisfactionScore}/100</div>
            <p className="text-xs text-muted-foreground">
              Puntuación de franquiciados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="portal" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Portal</span>
          </TabsTrigger>
          <TabsTrigger value="brand" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Marca</span>
          </TabsTrigger>
          <TabsTrigger value="royalties" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Regalías</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <FranchiseDashboard />
        </TabsContent>

        <TabsContent value="portal" className="space-y-6">
          <FranchiseePortal />
        </TabsContent>

        <TabsContent value="brand" className="space-y-6">
          <BrandManagement />
        </TabsContent>

        <TabsContent value="royalties" className="space-y-6">
          <RoyaltyManagement />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <FranchiseAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
} 