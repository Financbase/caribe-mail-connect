import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Users, 
  DollarSign,
  Award,
  Target,
  BarChart3,
  Globe,
  Building,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Trophy,
  Medal,
  Crown,
  Zap,
  Activity,
  Calendar
} from 'lucide-react';
import { useFranchise } from '@/hooks/useFranchise';

interface FranchiseLocation {
  id: string;
  name: string;
  owner: string;
  address: string;
  coordinates: { lat: number; lng: number };
  status: 'active' | 'pending' | 'suspended' | 'closed';
  performance_score: number;
  compliance_score: number;
  revenue: number;
  customers: number;
  employees: number;
  established_date: string;
  territory_size: string;
  market_penetration: number;
}

interface NetworkMetrics {
  total_locations: number;
  active_locations: number;
  total_revenue: number;
  total_customers: number;
  total_employees: number;
  average_performance: number;
  average_compliance: number;
  network_growth_rate: number;
  market_coverage: number;
}

interface PerformanceRanking {
  location_id: string;
  location_name: string;
  owner: string;
  rank: number;
  performance_score: number;
  revenue: number;
  growth_rate: number;
  customer_satisfaction: number;
  efficiency_score: number;
}

export function FranchiseDashboard() {
  const { 
    franchiseLocations, 
    networkMetrics, 
    performanceRankings, 
    loading 
  } = useFranchise();

  const [selectedLocation, setSelectedLocation] = useState<FranchiseLocation | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const topPerformers = performanceRankings.slice(0, 5);
  const complianceIssues = franchiseLocations.filter(loc => loc.compliance_score < 80);
  const highPerformers = franchiseLocations.filter(loc => loc.performance_score >= 90);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-yellow-100';
    if (score >= 70) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Network Overview Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Red de Franquicias PRMCMS</h1>
          <p className="text-muted-foreground mt-2">
            Gestión integral de la red de franquicias en Puerto Rico
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="px-4 py-2">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Locaciones Activas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {networkMetrics?.active_locations || 0}
                </p>
              </div>
            </div>
          </Card>
          <Card className="px-4 py-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(networkMetrics?.total_revenue || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Network Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura de Mercado</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {networkMetrics?.market_coverage || 0}%
            </div>
            <Progress value={networkMetrics?.market_coverage || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Cobertura territorial en Puerto Rico
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crecimiento de Red</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{networkMetrics?.network_growth_rate || 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Crecimiento este año
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendimiento Promedio</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {networkMetrics?.average_performance || 0}%
            </div>
            <Progress value={networkMetrics?.average_performance || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Puntuación promedio de la red
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cumplimiento Promedio</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {networkMetrics?.average_compliance || 0}%
            </div>
            <Progress value={networkMetrics?.average_compliance || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Cumplimiento de estándares
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="compliance">Cumplimiento</TabsTrigger>
          <TabsTrigger value="directory">Directorio</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Network Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Mapa de Red de Franquicias</span>
              </CardTitle>
              <CardDescription>
                Visualización geográfica de todas las locaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Mapa interactivo de locaciones</p>
                  <p className="text-sm text-muted-foreground">
                    {franchiseLocations.length} locaciones en la red
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Mejores Rendimientos</span>
                </CardTitle>
                <CardDescription>
                  Top 5 franquicias por rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <div key={performer.location_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
                          {index === 0 && <Crown className="h-4 w-4 text-yellow-600" />}
                          {index === 1 && <Medal className="h-4 w-4 text-gray-600" />}
                          {index === 2 && <Award className="h-4 w-4 text-orange-600" />}
                          {index > 2 && <span className="text-sm font-bold">{index + 1}</span>}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{performer.location_name}</p>
                          <p className="text-xs text-muted-foreground">{performer.owner}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${getPerformanceColor(performer.performance_score)}`}>
                          {performer.performance_score}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${performer.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span>Métricas del Sistema</span>
                </CardTitle>
                <CardDescription>
                  Estadísticas generales de la red
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total de Clientes</span>
                    <span className="text-sm font-bold">{networkMetrics?.total_customers?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total de Empleados</span>
                    <span className="text-sm font-bold">{networkMetrics?.total_employees?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Locaciones Totales</span>
                    <span className="text-sm font-bold">{networkMetrics?.total_locations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tasa de Crecimiento</span>
                    <span className="text-sm font-bold text-green-600">
                      +{networkMetrics?.network_growth_rate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Satisfacción Promedio</span>
                    <span className="text-sm font-bold">4.2/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Ranking de Rendimiento</span>
              </CardTitle>
              <CardDescription>
                Clasificación completa de todas las franquicias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceRankings.map((ranking, index) => (
                  <div key={ranking.location_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                        <span className="text-sm font-bold">{ranking.rank}</span>
                      </div>
                      <div>
                        <p className="font-medium">{ranking.location_name}</p>
                        <p className="text-sm text-muted-foreground">{ranking.owner}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Eficiencia: {ranking.efficiency_score}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Satisfacción: {ranking.customer_satisfaction}/5
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getPerformanceColor(ranking.performance_score)}`}>
                        {ranking.performance_score}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${ranking.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-green-600">
                        +{ranking.growth_rate}% crecimiento
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Puntuaciones de Cumplimiento</span>
                </CardTitle>
                <CardDescription>
                  Estado de cumplimiento de estándares de marca
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {franchiseLocations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{location.name}</p>
                        <p className="text-xs text-muted-foreground">{location.owner}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${getPerformanceColor(location.compliance_score)}`}>
                          {location.compliance_score}%
                        </div>
                        <Progress value={location.compliance_score} className="w-20 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span>Problemas de Cumplimiento</span>
                </CardTitle>
                <CardDescription>
                  Locaciones que requieren atención
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceIssues.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                      <div>
                        <p className="text-sm font-medium">{location.name}</p>
                        <p className="text-xs text-muted-foreground">{location.owner}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-600">
                          {location.compliance_score}%
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          Requiere Atención
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="directory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Directorio de Franquicias</span>
              </CardTitle>
              <CardDescription>
                Información completa de todas las locaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {franchiseLocations.map((location) => (
                  <Card key={location.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{location.name}</CardTitle>
                        <Badge className={getStatusColor(location.status)}>
                          {location.status === 'active' ? 'Activa' : 
                           location.status === 'pending' ? 'Pendiente' :
                           location.status === 'suspended' ? 'Suspendida' : 'Cerrada'}
                        </Badge>
                      </div>
                      <CardDescription>{location.owner}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{location.address}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Rendimiento:</span>
                          <div className={`font-bold ${getPerformanceColor(location.performance_score)}`}>
                            {location.performance_score}%
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cumplimiento:</span>
                          <div className={`font-bold ${getPerformanceColor(location.compliance_score)}`}>
                            {location.compliance_score}%
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Clientes:</span>
                          <div className="font-bold">{location.customers.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ingresos:</span>
                          <div className="font-bold">${location.revenue.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Establecida: {new Date(location.established_date).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 