import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Zap, 
  Leaf, 
  Car, 
  Bike, 
  TrendingUp,
  Fuel,
  Gauge,
  MapPin,
  Clock,
  DollarSign,
  Target,
  Settings,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Battery,
  Thermometer,
  Wind
} from 'lucide-react';

interface VehicleEfficiency {
  id: string;
  vehicleId: string;
  vehicleType: 'gas' | 'hybrid' | 'electric' | 'bike' | 'walking';
  model: string;
  fuelEfficiency: number;
  carbonEmissions: number;
  costPerKm: number;
  range: number;
  batteryLevel?: number;
  lastMaintenance: string;
  status: 'optimal' | 'good' | 'needs-maintenance' | 'critical';
}

interface RouteEfficiency {
  id: string;
  routeName: string;
  vehicleType: 'gas' | 'hybrid' | 'electric' | 'bike' | 'walking';
  distance: number;
  fuelConsumption: number;
  carbonSaved: number;
  costSavings: number;
  timeEfficiency: number;
  terrain: 'flat' | 'hilly' | 'mixed';
  weatherImpact: number;
}

interface CarbonMetrics {
  totalEmissions: number;
  emissionsSaved: number;
  carbonOffset: number;
  targetReduction: number;
  monthlyTrend: 'increasing' | 'decreasing' | 'stable';
}

interface ChargingStation {
  id: string;
  name: string;
  location: string;
  type: 'fast' | 'standard' | 'slow';
  availability: 'available' | 'occupied' | 'maintenance';
  distance: number;
  estimatedWait: number;
}

export default function EfficiencyTools() {
  const { language } = useLanguage();
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [efficiencyMode, setEfficiencyMode] = useState('balanced');
  const [ecoRouting, setEcoRouting] = useState(true);
  const [carbonTracking, setCarbonTracking] = useState(true);

  const isSpanish = language === 'es';

  const vehicleEfficiencies: VehicleEfficiency[] = [
    {
      id: '1',
      vehicleId: 'V001',
      vehicleType: 'electric',
      model: 'Tesla Model 3',
      fuelEfficiency: 95,
      carbonEmissions: 0,
      costPerKm: 0.08,
      range: 350,
      batteryLevel: 78,
      lastMaintenance: '2024-01-15',
      status: 'optimal'
    },
    {
      id: '2',
      vehicleId: 'V002',
      vehicleType: 'hybrid',
      model: 'Toyota Prius',
      fuelEfficiency: 85,
      carbonEmissions: 45,
      costPerKm: 0.12,
      range: 600,
      lastMaintenance: '2024-01-10',
      status: 'good'
    },
    {
      id: '3',
      vehicleId: 'V003',
      vehicleType: 'gas',
      model: 'Ford Transit',
      fuelEfficiency: 65,
      carbonEmissions: 120,
      costPerKm: 0.18,
      range: 450,
      lastMaintenance: '2024-01-05',
      status: 'needs-maintenance'
    },
    {
      id: '4',
      vehicleId: 'V004',
      vehicleType: 'bike',
      model: 'E-Bike Pro',
      fuelEfficiency: 100,
      carbonEmissions: 0,
      costPerKm: 0.02,
      range: 80,
      batteryLevel: 92,
      lastMaintenance: '2024-01-18',
      status: 'optimal'
    }
  ];

  const routeEfficiencies: RouteEfficiency[] = [
    {
      id: '1',
      routeName: 'San Juan Centro - Eléctrico',
      vehicleType: 'electric',
      distance: 12.5,
      fuelConsumption: 0,
      carbonSaved: 2.4,
      costSavings: 15.60,
      timeEfficiency: 92,
      terrain: 'flat',
      weatherImpact: 5
    },
    {
      id: '2',
      routeName: 'Condado - Bicicleta',
      vehicleType: 'bike',
      distance: 8.2,
      fuelConsumption: 0,
      carbonSaved: 1.8,
      costSavings: 12.30,
      timeEfficiency: 88,
      terrain: 'flat',
      weatherImpact: 8
    },
    {
      id: '3',
      routeName: 'Viejo San Juan - Caminando',
      vehicleType: 'walking',
      distance: 3.1,
      fuelConsumption: 0,
      carbonSaved: 0.7,
      costSavings: 4.65,
      timeEfficiency: 75,
      terrain: 'mixed',
      weatherImpact: 12
    },
    {
      id: '4',
      routeName: 'Bayamón - Híbrido',
      vehicleType: 'hybrid',
      distance: 18.7,
      fuelConsumption: 2.1,
      carbonSaved: 1.2,
      costSavings: 8.40,
      timeEfficiency: 85,
      terrain: 'hilly',
      weatherImpact: 15
    }
  ];

  const carbonMetrics: CarbonMetrics = {
    totalEmissions: 156,
    emissionsSaved: 89,
    carbonOffset: 45,
    targetReduction: 200,
    monthlyTrend: 'decreasing'
  };

  const chargingStations: ChargingStation[] = [
    {
      id: '1',
      name: 'Estación San Juan Centro',
      location: 'Calle San Sebastián 123',
      type: 'fast',
      availability: 'available',
      distance: 2.3,
      estimatedWait: 0
    },
    {
      id: '2',
      name: 'Estación Condado',
      location: 'Ave. Ashford 456',
      type: 'standard',
      availability: 'occupied',
      distance: 5.1,
      estimatedWait: 15
    },
    {
      id: '3',
      name: 'Estación Bayamón',
      location: 'Calle Principal 789',
      type: 'fast',
      availability: 'available',
      distance: 8.7,
      estimatedWait: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'needs-maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'electric': return <Zap className="w-4 h-4" />;
      case 'hybrid': return <Leaf className="w-4 h-4" />;
      case 'gas': return <Fuel className="w-4 h-4" />;
      case 'bike': return <Bike className="w-4 h-4" />;
      case 'walking': return <Walking className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  const getChargingTypeColor = (type: string) => {
    switch (type) {
      case 'fast': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'standard': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'slow': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Carbon Tracking Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            {isSpanish ? 'Seguimiento de Carbono' : 'Carbon Tracking'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Métricas de emisiones y ahorros de carbono'
              : 'Carbon emissions metrics and savings'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">{carbonMetrics.totalEmissions}kg</div>
              <div className="text-sm font-medium mb-1">
                {isSpanish ? 'Emisiones Totales' : 'Total Emissions'}
              </div>
              <div className="text-xs text-gray-500">
                {isSpanish ? 'Este mes' : 'This month'}
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{carbonMetrics.emissionsSaved}kg</div>
              <div className="text-sm font-medium mb-1">
                {isSpanish ? 'Carbono Ahorrado' : 'Carbon Saved'}
              </div>
              <div className="text-xs text-gray-500">
                {isSpanish ? 'Vehículos verdes' : 'Green vehicles'}
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{carbonMetrics.carbonOffset}kg</div>
              <div className="text-sm font-medium mb-1">
                {isSpanish ? 'Compensación' : 'Offset'}
              </div>
              <div className="text-xs text-gray-500">
                {isSpanish ? 'Programas verdes' : 'Green programs'}
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">{carbonMetrics.targetReduction}kg</div>
              <div className="text-sm font-medium mb-1">
                {isSpanish ? 'Meta Reducción' : 'Target Reduction'}
              </div>
              <div className="text-xs text-gray-500">
                {isSpanish ? 'Objetivo anual' : 'Annual target'}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {isSpanish ? 'Progreso hacia la Meta' : 'Progress to Target'}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((carbonMetrics.emissionsSaved / carbonMetrics.targetReduction) * 100)}%
              </span>
            </div>
            <Progress value={(carbonMetrics.emissionsSaved / carbonMetrics.targetReduction) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            {isSpanish ? 'Eficiencia de Vehículos' : 'Vehicle Efficiency'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Rendimiento y mantenimiento de la flota'
              : 'Fleet performance and maintenance'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {vehicleEfficiencies.map((vehicle) => (
              <Card key={vehicle.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getVehicleIcon(vehicle.vehicleType)}
                      <div>
                        <h3 className="font-semibold text-lg">{vehicle.model}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">ID: {vehicle.vehicleId}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {isSpanish 
                        ? (vehicle.status === 'optimal' ? 'Óptimo' :
                           vehicle.status === 'good' ? 'Bueno' :
                           vehicle.status === 'needs-maintenance' ? 'Mantenimiento' : 'Crítico')
                        : vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)
                      }
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {isSpanish ? 'Eficiencia:' : 'Efficiency:'}
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress value={vehicle.fuelEfficiency} className="flex-1" />
                        <span className="font-bold">{vehicle.fuelEfficiency}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {isSpanish ? 'Costo/km:' : 'Cost/km:'}
                      </span>
                      <span className="font-bold text-green-600">${vehicle.costPerKm}</span>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {isSpanish ? 'Emisiones:' : 'Emissions:'}
                      </span>
                      <span className="font-bold text-red-600">{vehicle.carbonEmissions}g/km</span>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {isSpanish ? 'Alcance:' : 'Range:'}
                      </span>
                      <span className="font-bold">{vehicle.range}km</span>
                    </div>
                  </div>
                  
                  {vehicle.batteryLevel && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {isSpanish ? 'Batería:' : 'Battery:'}
                        </span>
                        <span className="font-bold">{vehicle.batteryLevel}%</span>
                      </div>
                      <Progress value={vehicle.batteryLevel} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {isSpanish ? 'Último mantenimiento:' : 'Last maintenance:'} {vehicle.lastMaintenance}
                    </span>
                    <Button size="sm" variant="outline">
                      {isSpanish ? 'Detalles' : 'Details'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Route Efficiency Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {isSpanish ? 'Análisis de Eficiencia de Rutas' : 'Route Efficiency Analysis'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Comparación de eficiencia por tipo de vehículo y ruta'
              : 'Efficiency comparison by vehicle type and route'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routeEfficiencies.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getVehicleIcon(route.vehicleType)}
                    <div>
                      <h3 className="font-semibold">{route.routeName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {route.distance}km • {isSpanish ? 'Terreno:' : 'Terrain:'} {
                          isSpanish 
                            ? (route.terrain === 'flat' ? 'Plano' :
                               route.terrain === 'hilly' ? 'Montañoso' : 'Mixto')
                            : route.terrain.charAt(0).toUpperCase() + route.terrain.slice(1)
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="font-bold text-green-600">${route.costSavings}</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Ahorro' : 'Savings'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{route.carbonSaved}kg</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'CO₂ Ahorrado' : 'CO₂ Saved'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-purple-600">{route.timeEfficiency}%</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Eficiencia Tiempo' : 'Time Efficiency'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {route.weatherImpact}% {isSpanish ? 'Impacto Clima' : 'Weather Impact'}
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

      {/* Charging Stations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            {isSpanish ? 'Estaciones de Carga' : 'Charging Stations'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Ubicaciones y disponibilidad de estaciones de carga'
              : 'Charging station locations and availability'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chargingStations.map((station) => (
              <Card key={station.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{station.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{station.location}</p>
                    </div>
                    <Badge className={getChargingTypeColor(station.type)}>
                      {isSpanish 
                        ? (station.type === 'fast' ? 'Rápida' :
                           station.type === 'standard' ? 'Estándar' : 'Lenta')
                        : station.type.charAt(0).toUpperCase() + station.type.slice(1)
                      }
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {isSpanish ? 'Distancia:' : 'Distance:'}
                      </span>
                      <span className="font-medium">{station.distance}km</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {isSpanish ? 'Disponibilidad:' : 'Availability:'}
                      </span>
                      <span className={`font-medium ${
                        station.availability === 'available' ? 'text-green-600' :
                        station.availability === 'occupied' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {isSpanish 
                          ? (station.availability === 'available' ? 'Disponible' :
                             station.availability === 'occupied' ? 'Ocupada' : 'Mantenimiento')
                          : station.availability.charAt(0).toUpperCase() + station.availability.slice(1)
                        }
                      </span>
                    </div>
                    
                    {station.estimatedWait > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          {isSpanish ? 'Tiempo Espera:' : 'Wait Time:'}
                        </span>
                        <span className="font-medium">{station.estimatedWait}m</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <MapPin className="w-4 h-4 mr-2" />
                      {isSpanish ? 'Navegar' : 'Navigate'}
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Zap className="w-4 h-4 mr-2" />
                      {isSpanish ? 'Reservar' : 'Reserve'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Efficiency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {isSpanish ? 'Configuración de Eficiencia' : 'Efficiency Settings'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Personaliza las opciones de optimización'
              : 'Customize optimization options'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">
                  {isSpanish ? 'Rutas Ecológicas' : 'Eco Routing'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isSpanish 
                    ? 'Prioriza rutas que minimicen el consumo de combustible'
                    : 'Prioritize routes that minimize fuel consumption'
                  }
                </p>
              </div>
              <Switch
                checked={ecoRouting}
                onCheckedChange={setEcoRouting}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">
                  {isSpanish ? 'Seguimiento de Carbono' : 'Carbon Tracking'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isSpanish 
                    ? 'Monitorea automáticamente las emisiones de CO₂'
                    : 'Automatically monitor CO₂ emissions'
                  }
                </p>
              </div>
              <Switch
                checked={carbonTracking}
                onCheckedChange={setCarbonTracking}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {isSpanish ? 'Modo de Eficiencia' : 'Efficiency Mode'}
              </Label>
              <Select value={efficiencyMode} onValueChange={setEfficiencyMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">
                    {isSpanish ? 'Equilibrado' : 'Balanced'}
                  </SelectItem>
                  <SelectItem value="eco">
                    {isSpanish ? 'Ecológico' : 'Eco'}
                  </SelectItem>
                  <SelectItem value="performance">
                    {isSpanish ? 'Rendimiento' : 'Performance'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 