import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  MapPin, 
  Clock, 
  TrendingUp, 
  Users, 
  Car, 
  Target,
  BarChart3,
  Settings,
  Zap,
  Star,
  Award,
  Calendar,
  Filter
} from 'lucide-react';

interface RouteEfficiency {
  id: string;
  name: string;
  efficiencyScore: number;
  deliveryCount: number;
  averageTime: number;
  fuelEfficiency: number;
  driverSatisfaction: number;
  territory: string;
  status: 'optimal' | 'good' | 'needs-improvement' | 'critical';
}

interface DriverTerritory {
  id: string;
  driverName: string;
  territory: string;
  area: number;
  deliveryDensity: number;
  performanceScore: number;
  vehicleType: 'car' | 'bike' | 'walking' | 'electric';
}

interface TimeWindow {
  id: string;
  startTime: string;
  endTime: string;
  deliveryCount: number;
  efficiency: number;
  congestion: 'low' | 'medium' | 'high';
}

export default function DeliveryOptimization() {
  const { language } = useLanguage();
  const [selectedTerritory, setSelectedTerritory] = useState('all');
  const [timeFilter, setTimeFilter] = useState('today');
  const [showDensityMap, setShowDensityMap] = useState(true);
  const [autoOptimize, setAutoOptimize] = useState(true);

  const isSpanish = language === 'es';

  const routeEfficiencies: RouteEfficiency[] = [
    {
      id: '1',
      name: 'Ruta San Juan Centro',
      efficiencyScore: 94,
      deliveryCount: 45,
      averageTime: 18,
      fuelEfficiency: 92,
      driverSatisfaction: 88,
      territory: 'San Juan',
      status: 'optimal'
    },
    {
      id: '2',
      name: 'Ruta Bayamón Norte',
      efficiencyScore: 87,
      deliveryCount: 32,
      averageTime: 22,
      fuelEfficiency: 85,
      driverSatisfaction: 82,
      territory: 'Bayamón',
      status: 'good'
    },
    {
      id: '3',
      name: 'Ruta Caguas Este',
      efficiencyScore: 76,
      deliveryCount: 28,
      averageTime: 27,
      fuelEfficiency: 78,
      driverSatisfaction: 75,
      territory: 'Caguas',
      status: 'needs-improvement'
    },
    {
      id: '4',
      name: 'Ruta Ponce Sur',
      efficiencyScore: 65,
      deliveryCount: 38,
      averageTime: 35,
      fuelEfficiency: 68,
      driverSatisfaction: 62,
      territory: 'Ponce',
      status: 'critical'
    }
  ];

  const driverTerritories: DriverTerritory[] = [
    {
      id: '1',
      driverName: 'Carlos Rodríguez',
      territory: 'San Juan Centro',
      area: 12.5,
      deliveryDensity: 3.6,
      performanceScore: 94,
      vehicleType: 'car'
    },
    {
      id: '2',
      driverName: 'María González',
      territory: 'Bayamón Norte',
      area: 8.2,
      deliveryDensity: 3.9,
      performanceScore: 87,
      vehicleType: 'bike'
    },
    {
      id: '3',
      driverName: 'Luis Martínez',
      territory: 'Caguas Este',
      area: 15.8,
      deliveryDensity: 1.8,
      performanceScore: 76,
      vehicleType: 'car'
    },
    {
      id: '4',
      driverName: 'Ana Torres',
      territory: 'Ponce Sur',
      area: 22.3,
      deliveryDensity: 1.7,
      performanceScore: 65,
      vehicleType: 'electric'
    }
  ];

  const timeWindows: TimeWindow[] = [
    { id: '1', startTime: '08:00', endTime: '10:00', deliveryCount: 25, efficiency: 92, congestion: 'low' },
    { id: '2', startTime: '10:00', endTime: '12:00', deliveryCount: 38, efficiency: 85, congestion: 'medium' },
    { id: '3', startTime: '12:00', endTime: '14:00', deliveryCount: 42, efficiency: 78, congestion: 'high' },
    { id: '4', startTime: '14:00', endTime: '16:00', deliveryCount: 35, efficiency: 88, congestion: 'medium' },
    { id: '5', startTime: '16:00', endTime: '18:00', deliveryCount: 28, efficiency: 82, congestion: 'low' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'needs-improvement': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    if (isSpanish) {
      switch (status) {
        case 'optimal': return 'Óptimo';
        case 'good': return 'Bueno';
        case 'needs-improvement': return 'Mejorable';
        case 'critical': return 'Crítico';
        default: return 'Desconocido';
      }
    } else {
      switch (status) {
        case 'optimal': return 'Optimal';
        case 'good': return 'Good';
        case 'needs-improvement': return 'Needs Improvement';
        case 'critical': return 'Critical';
        default: return 'Unknown';
      }
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car': return <Car className="w-4 h-4" />;
      case 'bike': return <Bike className="w-4 h-4" />;
      case 'walking': return <Walking className="w-4 h-4" />;
      case 'electric': return <Zap className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="territory" className="text-sm font-medium">
              {isSpanish ? 'Territorio:' : 'Territory:'}
            </Label>
            <Select value={selectedTerritory} onValueChange={setSelectedTerritory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isSpanish ? 'Todos' : 'All'}</SelectItem>
                <SelectItem value="san-juan">San Juan</SelectItem>
                <SelectItem value="bayamon">Bayamón</SelectItem>
                <SelectItem value="caguas">Caguas</SelectItem>
                <SelectItem value="ponce">Ponce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="time" className="text-sm font-medium">
              {isSpanish ? 'Período:' : 'Period:'}
            </Label>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{isSpanish ? 'Hoy' : 'Today'}</SelectItem>
                <SelectItem value="week">{isSpanish ? 'Semana' : 'Week'}</SelectItem>
                <SelectItem value="month">{isSpanish ? 'Mes' : 'Month'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="density-map"
              checked={showDensityMap}
              onCheckedChange={setShowDensityMap}
            />
            <Label htmlFor="density-map" className="text-sm">
              {isSpanish ? 'Mapa de Densidad' : 'Density Map'}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-optimize"
              checked={autoOptimize}
              onCheckedChange={setAutoOptimize}
            />
            <Label htmlFor="auto-optimize" className="text-sm">
              {isSpanish ? 'Auto-Optimizar' : 'Auto-Optimize'}
            </Label>
          </div>
          <Button size="sm">
            <Zap className="w-4 h-4 mr-2" />
            {isSpanish ? 'Optimizar' : 'Optimize'}
          </Button>
        </div>
      </div>

      {/* Route Efficiency Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {isSpanish ? 'Puntuaciones de Eficiencia de Rutas' : 'Route Efficiency Scores'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Análisis detallado del rendimiento de cada ruta de entrega'
              : 'Detailed analysis of each delivery route performance'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {routeEfficiencies.map((route) => (
              <Card key={route.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{route.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{route.territory}</p>
                    </div>
                    <Badge className={getStatusColor(route.status)}>
                      {getStatusLabel(route.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {isSpanish ? 'Puntuación Eficiencia:' : 'Efficiency Score:'}
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress value={route.efficiencyScore} className="w-20" />
                        <span className="font-bold">{route.efficiencyScore}%</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          {isSpanish ? 'Entregas:' : 'Deliveries:'}
                        </span>
                        <span className="ml-2 font-medium">{route.deliveryCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          {isSpanish ? 'Tiempo Promedio:' : 'Avg Time:'}
                        </span>
                        <span className="ml-2 font-medium">{route.averageTime}m</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          {isSpanish ? 'Eficiencia Combustible:' : 'Fuel Efficiency:'}
                        </span>
                        <span className="ml-2 font-medium">{route.fuelEfficiency}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          {isSpanish ? 'Satisfacción:' : 'Satisfaction:'}
                        </span>
                        <span className="ml-2 font-medium">{route.driverSatisfaction}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Driver Territories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {isSpanish ? 'Territorios de Conductores' : 'Driver Territories'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Distribución geográfica y rendimiento por territorio'
              : 'Geographic distribution and performance by territory'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {driverTerritories.map((driver) => (
              <Card key={driver.id} className="relative overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getVehicleIcon(driver.vehicleType)}
                      <div>
                        <h3 className="font-semibold text-sm">{driver.driverName}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{driver.territory}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{driver.performanceScore}%</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Rendimiento' : 'Performance'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>{isSpanish ? 'Área:' : 'Area:'}</span>
                      <span className="font-medium">{driver.area} km²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isSpanish ? 'Densidad:' : 'Density:'}</span>
                      <span className="font-medium">{driver.deliveryDensity}/km²</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <Progress value={driver.performanceScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Window Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {isSpanish ? 'Gestión de Ventanas de Tiempo' : 'Time Window Management'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Optimización de horarios de entrega y gestión de congestión'
              : 'Delivery time optimization and congestion management'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeWindows.map((window) => (
              <div key={window.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {window.startTime} - {window.endTime}
                    </div>
                    <div className="text-xs text-gray-500">
                      {isSpanish ? 'Horario' : 'Time Window'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {window.deliveryCount}
                    </div>
                    <div className="text-xs text-gray-500">
                      {isSpanish ? 'Entregas' : 'Deliveries'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {window.efficiency}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {isSpanish ? 'Eficiencia' : 'Efficiency'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={window.congestion === 'high' ? 'destructive' : 
                           window.congestion === 'medium' ? 'secondary' : 'default'}
                  >
                    {isSpanish 
                      ? (window.congestion === 'high' ? 'Alta' : 
                         window.congestion === 'medium' ? 'Media' : 'Baja')
                      : window.congestion.charAt(0).toUpperCase() + window.congestion.slice(1)
                    }
                  </Badge>
                  <Button size="sm" variant="outline">
                    {isSpanish ? 'Optimizar' : 'Optimize'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {isSpanish ? 'Puntos de Referencia de Rendimiento' : 'Performance Benchmarks'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Comparación con estándares de la industria y objetivos internos'
              : 'Comparison with industry standards and internal targets'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">87%</div>
              <div className="text-sm font-medium mb-1">
                {isSpanish ? 'Eficiencia General' : 'Overall Efficiency'}
              </div>
              <div className="text-xs text-gray-500 mb-3">
                {isSpanish ? 'Objetivo: 90%' : 'Target: 90%'}
              </div>
              <Progress value={87} className="h-2" />
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">23m</div>
              <div className="text-sm font-medium mb-1">
                {isSpanish ? 'Tiempo Promedio' : 'Average Time'}
              </div>
              <div className="text-xs text-gray-500 mb-3">
                {isSpanish ? 'Objetivo: 20m' : 'Target: 20m'}
              </div>
              <Progress value={77} className="h-2" />
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
              <div className="text-sm font-medium mb-1">
                {isSpanish ? 'Satisfacción Cliente' : 'Customer Satisfaction'}
              </div>
              <div className="text-xs text-gray-500 mb-3">
                {isSpanish ? 'Objetivo: 95%' : 'Target: 95%'}
              </div>
              <Progress value={94} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 