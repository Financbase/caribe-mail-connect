import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Navigation, 
  Clock, 
  AlertTriangle, 
  Cloud, 
  Car, 
  Zap,
  RefreshCw,
  MapPin,
  TrendingUp,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Target,
  Route
} from 'lucide-react';

interface RouteStop {
  id: string;
  address: string;
  customerName: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  actualTime?: number;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  weatherImpact: number;
  trafficImpact: number;
  distance: number;
}

interface TrafficCondition {
  area: string;
  severity: 'low' | 'medium' | 'high' | 'severe';
  description: string;
  estimatedDelay: number;
  alternativeRoute?: string;
}

interface WeatherCondition {
  area: string;
  condition: 'clear' | 'rain' | 'storm' | 'heat';
  temperature: number;
  windSpeed: number;
  impact: 'low' | 'medium' | 'high';
  description: string;
}

export default function DynamicRouting() {
  const { language } = useLanguage();
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [autoReroute, setAutoReroute] = useState(true);
  const [trafficWeight, setTrafficWeight] = useState([70]);
  const [weatherWeight, setWeatherWeight] = useState([60]);
  const [priorityWeight, setPriorityWeight] = useState([80]);
  const [selectedRoute, setSelectedRoute] = useState('route-1');

  const isSpanish = language === 'es';

  const routeStops: RouteStop[] = [
    {
      id: '1',
      address: 'Calle San Sebastián 123, San Juan',
      customerName: 'María López',
      priority: 'high',
      estimatedTime: 15,
      status: 'pending',
      weatherImpact: 5,
      trafficImpact: 12,
      distance: 2.3
    },
    {
      id: '2',
      address: 'Ave. Ponce de León 456, San Juan',
      customerName: 'Carlos Rodríguez',
      priority: 'medium',
      estimatedTime: 20,
      status: 'in-progress',
      weatherImpact: 8,
      trafficImpact: 18,
      distance: 3.1
    },
    {
      id: '3',
      address: 'Calle del Cristo 789, San Juan',
      customerName: 'Ana Torres',
      priority: 'high',
      estimatedTime: 12,
      status: 'pending',
      weatherImpact: 3,
      trafficImpact: 8,
      distance: 1.8
    },
    {
      id: '4',
      address: 'Calle Fortaleza 321, San Juan',
      customerName: 'Luis Martínez',
      priority: 'low',
      estimatedTime: 25,
      status: 'pending',
      weatherImpact: 10,
      trafficImpact: 25,
      distance: 4.2
    },
    {
      id: '5',
      address: 'Ave. Ashford 654, San Juan',
      customerName: 'Isabel González',
      priority: 'medium',
      estimatedTime: 18,
      status: 'pending',
      weatherImpact: 6,
      trafficImpact: 15,
      distance: 2.9
    }
  ];

  const trafficConditions: TrafficCondition[] = [
    {
      area: 'San Juan Centro',
      severity: 'high',
      description: isSpanish ? 'Congestión por construcción en Ave. Ponce de León' : 'Congestion due to construction on Ponce de León Ave',
      estimatedDelay: 15,
      alternativeRoute: 'Calle San Sebastián'
    },
    {
      area: 'Condado',
      severity: 'medium',
      description: isSpanish ? 'Tráfico moderado en Ave. Ashford' : 'Moderate traffic on Ashford Ave',
      estimatedDelay: 8,
      alternativeRoute: 'Calle Vendig'
    },
    {
      area: 'Viejo San Juan',
      severity: 'low',
      description: isSpanish ? 'Tráfico ligero en el área histórica' : 'Light traffic in historic area',
      estimatedDelay: 3
    }
  ];

  const weatherConditions: WeatherCondition[] = [
    {
      area: 'San Juan',
      condition: 'rain',
      temperature: 28,
      windSpeed: 15,
      impact: 'medium',
      description: isSpanish ? 'Lluvia ligera, visibilidad reducida' : 'Light rain, reduced visibility'
    },
    {
      area: 'Bayamón',
      condition: 'clear',
      temperature: 32,
      windSpeed: 8,
      impact: 'low',
      description: isSpanish ? 'Cielo despejado, condiciones ideales' : 'Clear skies, ideal conditions'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'delayed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTrafficSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'rain': return <Cloud className="w-4 h-4 text-blue-500" />;
      case 'storm': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'heat': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'clear': return <Target className="w-4 h-4 text-green-500" />;
      default: return <Cloud className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            {isSpanish ? 'Controles de Ruta Dinámica' : 'Dynamic Route Controls'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Gestión en tiempo real de rutas con ajustes automáticos'
              : 'Real-time route management with automatic adjustments'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="live-mode"
                  checked={isLiveMode}
                  onCheckedChange={setIsLiveMode}
                />
                <Label htmlFor="live-mode" className="text-sm font-medium">
                  {isSpanish ? 'Modo En Vivo' : 'Live Mode'}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-reroute"
                  checked={autoReroute}
                  onCheckedChange={setAutoReroute}
                />
                <Label htmlFor="auto-reroute" className="text-sm font-medium">
                  {isSpanish ? 'Re-ruteo Automático' : 'Auto Re-route'}
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                {isSpanish ? 'Actualizar' : 'Refresh'}
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                {isSpanish ? 'Reiniciar Ruta' : 'Reset Route'}
              </Button>
              <Button size="sm">
                <Play className="w-4 h-4 mr-2" />
                {isSpanish ? 'Optimizar Ahora' : 'Optimize Now'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Optimization Weights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {isSpanish ? 'Ponderaciones de Optimización' : 'Optimization Weights'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Ajusta la importancia de cada factor en el cálculo de rutas'
              : 'Adjust the importance of each factor in route calculation'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  {isSpanish ? 'Tráfico' : 'Traffic'}
                </Label>
                <span className="text-sm font-bold">{trafficWeight[0]}%</span>
              </div>
              <Slider
                value={trafficWeight}
                onValueChange={setTrafficWeight}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  {isSpanish ? 'Clima' : 'Weather'}
                </Label>
                <span className="text-sm font-bold">{weatherWeight[0]}%</span>
              </div>
              <Slider
                value={weatherWeight}
                onValueChange={setWeatherWeight}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  {isSpanish ? 'Prioridad' : 'Priority'}
                </Label>
                <span className="text-sm font-bold">{priorityWeight[0]}%</span>
              </div>
              <Slider
                value={priorityWeight}
                onValueChange={setPriorityWeight}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Route Stops */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5" />
            {isSpanish ? 'Paradas de Ruta Actual' : 'Current Route Stops'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Lista optimizada de entregas con ajustes dinámicos'
              : 'Optimized delivery list with dynamic adjustments'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routeStops.map((stop, index) => (
              <div key={stop.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{stop.customerName}</h3>
                      <Badge className={getPriorityColor(stop.priority)}>
                        {isSpanish 
                          ? (stop.priority === 'high' ? 'Alta' : 
                             stop.priority === 'medium' ? 'Media' : 'Baja')
                          : stop.priority.charAt(0).toUpperCase() + stop.priority.slice(1)
                        }
                      </Badge>
                      <Badge className={getStatusColor(stop.status)}>
                        {isSpanish 
                          ? (stop.status === 'completed' ? 'Completado' :
                             stop.status === 'in-progress' ? 'En Progreso' :
                             stop.status === 'delayed' ? 'Retrasado' : 'Pendiente')
                          : stop.status.charAt(0).toUpperCase() + stop.status.slice(1)
                        }
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stop.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{stop.estimatedTime}m</div>
                    <div className="text-gray-500">
                      {isSpanish ? 'Estimado' : 'Est.'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-bold text-green-600">{stop.distance}km</div>
                    <div className="text-gray-500">
                      {isSpanish ? 'Distancia' : 'Dist.'}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-orange-500" />
                      <span className="text-xs">{stop.trafficImpact}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Cloud className="w-3 h-3 text-blue-500" />
                      <span className="text-xs">{stop.weatherImpact}m</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    {isSpanish ? 'Reordenar' : 'Reorder'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {isSpanish ? 'Condiciones de Tráfico' : 'Traffic Conditions'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Alertas de tráfico en tiempo real y rutas alternativas'
              : 'Real-time traffic alerts and alternative routes'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trafficConditions.map((condition) => (
              <div key={condition.area} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getTrafficSeverityColor(condition.severity)}>
                      {isSpanish 
                        ? (condition.severity === 'severe' ? 'Severo' :
                           condition.severity === 'high' ? 'Alto' :
                           condition.severity === 'medium' ? 'Medio' : 'Bajo')
                        : condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)
                      }
                    </Badge>
                    <h3 className="font-semibold">{condition.area}</h3>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {condition.description}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-bold text-red-600">+{condition.estimatedDelay}m</div>
                    <div className="text-xs text-gray-500">
                      {isSpanish ? 'Retraso' : 'Delay'}
                    </div>
                  </div>
                  
                  {condition.alternativeRoute && (
                    <div className="text-sm">
                      <span className="text-gray-500">
                        {isSpanish ? 'Alternativa:' : 'Alternative:'}
                      </span>
                      <span className="ml-1 font-medium">{condition.alternativeRoute}</span>
                    </div>
                  )}
                  
                  <Button size="sm" variant="outline">
                    {isSpanish ? 'Ver Ruta' : 'View Route'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            {isSpanish ? 'Condiciones Climáticas' : 'Weather Conditions'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Impacto del clima en las rutas de entrega'
              : 'Weather impact on delivery routes'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weatherConditions.map((weather) => (
              <div key={weather.area} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getWeatherIcon(weather.condition)}
                    <h3 className="font-semibold">{weather.area}</h3>
                  </div>
                  <Badge 
                    variant={weather.impact === 'high' ? 'destructive' : 
                           weather.impact === 'medium' ? 'secondary' : 'default'}
                  >
                    {isSpanish 
                      ? (weather.impact === 'high' ? 'Alto' :
                         weather.impact === 'medium' ? 'Medio' : 'Bajo')
                      : weather.impact.charAt(0).toUpperCase() + weather.impact.slice(1)
                    }
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {isSpanish ? 'Temperatura:' : 'Temperature:'}
                    </span>
                    <span className="ml-2 font-medium">{weather.temperature}°C</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {isSpanish ? 'Viento:' : 'Wind:'}
                    </span>
                    <span className="ml-2 font-medium">{weather.windSpeed} km/h</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {weather.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 