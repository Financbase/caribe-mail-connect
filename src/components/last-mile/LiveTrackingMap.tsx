import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  MapPin, 
  Navigation, 
  Car, 
  Bike, 
  Zap,
  Clock,
  User,
  Phone,
  MessageSquare,
  Eye,
  EyeOff,
  RefreshCw,
  Play,
  Pause,
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Settings
} from 'lucide-react';

interface DeliveryVehicle {
  id: string;
  driverName: string;
  driverPhoto?: string;
  vehicleType: 'car' | 'bike' | 'walking' | 'electric';
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'en-route' | 'delivering' | 'completed' | 'returning';
  progress: number;
  eta: string;
  speed: number;
  batteryLevel?: number;
  route: Array<{lat: number; lng: number}>;
  deliveries: DeliveryStop[];
}

interface DeliveryStop {
  id: string;
  customerName: string;
  address: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  actualTime?: number;
}

interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  type: 'vehicles' | 'routes' | 'traffic' | 'weather' | 'charging-stations';
}

export default function LastMileLiveTrackingMap() {
  const { language } = useLanguage();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    { id: '1', name: 'Vehículos', visible: true, type: 'vehicles' },
    { id: '2', name: 'Rutas', visible: true, type: 'routes' },
    { id: '3', name: 'Tráfico', visible: false, type: 'traffic' },
    { id: '4', name: 'Clima', visible: false, type: 'weather' },
    { id: '5', name: 'Estaciones de Carga', visible: false, type: 'charging-stations' }
  ]);
  const [mapView, setMapView] = useState('satellite');

  const isSpanish = language === 'es';

  const deliveryVehicles: DeliveryVehicle[] = [
    {
      id: '1',
      driverName: 'Carlos Méndez',
      vehicleType: 'electric',
      currentLocation: {
        lat: 18.4655,
        lng: -66.1057,
        address: 'Calle San Sebastián 123, San Juan'
      },
      destination: {
        lat: 18.3985,
        lng: -66.0617,
        address: 'Ave. Ponce de León 456, San Juan'
      },
      status: 'en-route',
      progress: 65,
      eta: '14:30',
      speed: 35,
      batteryLevel: 78,
      route: [
        {lat: 18.4655, lng: -66.1057},
        {lat: 18.4320, lng: -66.0837},
        {lat: 18.3985, lng: -66.0617}
      ],
      deliveries: [
        {
          id: '1',
          customerName: 'María López',
          address: 'Calle San Sebastián 123, San Juan',
          status: 'completed',
          priority: 'high',
          estimatedTime: 15,
          actualTime: 12
        },
        {
          id: '2',
          customerName: 'Ana Torres',
          address: 'Ave. Ponce de León 456, San Juan',
          status: 'in-progress',
          priority: 'medium',
          estimatedTime: 20
        }
      ]
    },
    {
      id: '2',
      driverName: 'María González',
      vehicleType: 'bike',
      currentLocation: {
        lat: 18.4655,
        lng: -66.1057,
        address: 'Calle del Cristo 789, San Juan'
      },
      destination: {
        lat: 18.4655,
        lng: -66.1057,
        address: 'Calle Fortaleza 321, San Juan'
      },
      status: 'delivering',
      progress: 85,
      eta: '14:45',
      speed: 15,
      route: [
        {lat: 18.4655, lng: -66.1057},
        {lat: 18.4655, lng: -66.1057}
      ],
      deliveries: [
        {
          id: '3',
          customerName: 'Luis Martínez',
          address: 'Calle del Cristo 789, San Juan',
          status: 'completed',
          priority: 'high',
          estimatedTime: 12,
          actualTime: 10
        },
        {
          id: '4',
          customerName: 'Isabel González',
          address: 'Calle Fortaleza 321, San Juan',
          status: 'in-progress',
          priority: 'low',
          estimatedTime: 18
        }
      ]
    },
    {
      id: '3',
      driverName: 'Luis Rodríguez',
      vehicleType: 'car',
      currentLocation: {
        lat: 18.3985,
        lng: -66.0617,
        address: 'Ave. Ashford 654, San Juan'
      },
      destination: {
        lat: 18.4655,
        lng: -66.1057,
        address: 'Calle San Sebastián 123, San Juan'
      },
      status: 'returning',
      progress: 25,
      eta: '15:15',
      speed: 45,
      route: [
        {lat: 18.3985, lng: -66.0617},
        {lat: 18.4320, lng: -66.0837},
        {lat: 18.4655, lng: -66.1057}
      ],
      deliveries: [
        {
          id: '5',
          customerName: 'Carlos Rodríguez',
          address: 'Ave. Ashford 654, San Juan',
          status: 'completed',
          priority: 'medium',
          estimatedTime: 25,
          actualTime: 22
        }
      ]
    }
  ];

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car': return <Car className="w-4 h-4" />;
      case 'bike': return <Bike className="w-4 h-4" />;
      case 'walking': return <Walking className="w-4 h-4" />;
      case 'electric': return <Zap className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en-route': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'delivering': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'returning': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    if (isSpanish) {
      switch (status) {
        case 'en-route': return 'En Ruta';
        case 'delivering': return 'Entregando';
        case 'completed': return 'Completado';
        case 'returning': return 'Regresando';
        default: return 'Desconocido';
      }
    } else {
      switch (status) {
        case 'en-route': return 'En Route';
        case 'delivering': return 'Delivering';
        case 'completed': return 'Completed';
        case 'returning': return 'Returning';
        default: return 'Unknown';
      }
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            {isSpanish ? 'Controles del Mapa' : 'Map Controls'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Configuración de capas y vista del mapa'
              : 'Map layers and view configuration'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="map-view" className="text-sm font-medium">
                  {isSpanish ? 'Vista:' : 'View:'}
                </Label>
                <Select value={mapView} onValueChange={setMapView}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satellite">{isSpanish ? 'Satélite' : 'Satellite'}</SelectItem>
                    <SelectItem value="street">{isSpanish ? 'Calle' : 'Street'}</SelectItem>
                    <SelectItem value="hybrid">{isSpanish ? 'Híbrido' : 'Hybrid'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="live-mode"
                  checked={isLiveMode}
                  onCheckedChange={setIsLiveMode}
                />
                <Label htmlFor="live-mode" className="text-sm">
                  {isSpanish ? 'Modo En Vivo' : 'Live Mode'}
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                {isSpanish ? 'Actualizar' : 'Refresh'}
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                {isSpanish ? 'Vista Completa' : 'Full View'}
              </Button>
              <Button size="sm">
                <Settings className="w-4 h-4 mr-2" />
                {isSpanish ? 'Configuración' : 'Settings'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {isSpanish ? 'Mapa Interactivo' : 'Interactive Map'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Seguimiento en tiempo real de vehículos de entrega'
              : 'Real-time tracking of delivery vehicles'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Map Container */}
            <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg relative overflow-hidden">
              {/* Animated Vehicles */}
              {deliveryVehicles.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all duration-300 ${
                    vehicle.vehicleType === 'electric' ? 'bg-green-500' :
                    vehicle.vehicleType === 'bike' ? 'bg-blue-500' :
                    vehicle.vehicleType === 'walking' ? 'bg-purple-500' : 'bg-orange-500'
                  } ${selectedVehicle === vehicle.id ? 'ring-4 ring-blue-300' : ''}`}
                  style={{
                    left: `${20 + (index * 15)}%`,
                    top: `${30 + (index * 10)}%`,
                    animation: 'pulse 2s infinite'
                  }}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                >
                  <div className="flex items-center justify-center w-full h-full">
                    {getVehicleIcon(vehicle.vehicleType)}
                  </div>
                  
                  {/* Progress Trail */}
                  <div 
                    className="absolute w-full h-1 bg-white rounded-full opacity-50"
                    style={{
                      transform: `rotate(${vehicle.progress * 3.6}deg)`,
                      transformOrigin: 'center'
                    }}
                  />
                </div>
              ))}
              
              {/* Map Overlay */}
              <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 rounded-lg p-3 shadow-lg">
                <div className="text-sm font-medium mb-2">
                  {isSpanish ? 'Capas del Mapa' : 'Map Layers'}
                </div>
                <div className="space-y-2">
                  {mapLayers.map((layer) => (
                    <div key={layer.id} className="flex items-center space-x-2">
                      <Switch
                        checked={layer.visible}
                        onCheckedChange={(checked) => {
                          setMapLayers(layers => 
                            layers.map(l => 
                              l.id === layer.id ? {...l, visible: checked} : l
                            )
                          );
                        }}
                      />
                      <Label className="text-xs">{layer.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-900 rounded-lg p-3 shadow-lg">
                <div className="text-sm font-medium mb-2">
                  {isSpanish ? 'Leyenda' : 'Legend'}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>{isSpanish ? 'Eléctrico' : 'Electric'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>{isSpanish ? 'Bicicleta' : 'Bike'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>{isSpanish ? 'Automóvil' : 'Car'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>{isSpanish ? 'Caminando' : 'Walking'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      {selectedVehicle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {isSpanish ? 'Detalles del Vehículo' : 'Vehicle Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const vehicle = deliveryVehicles.find(v => v.id === selectedVehicle);
              if (!vehicle) return null;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={vehicle.driverPhoto} />
                      <AvatarFallback>
                        {vehicle.driverName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{vehicle.driverName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getVehicleIcon(vehicle.vehicleType)}
                        <Badge className={getStatusColor(vehicle.status)}>
                          {getStatusLabel(vehicle.status)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        {isSpanish ? 'Llamar' : 'Call'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {isSpanish ? 'Chat' : 'Chat'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{vehicle.progress}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {isSpanish ? 'Progreso' : 'Progress'}
                      </div>
                      <Progress value={vehicle.progress} className="mt-2" />
                    </div>
                    
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{vehicle.eta}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {isSpanish ? 'ETA' : 'ETA'}
                      </div>
                    </div>
                    
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{vehicle.speed} km/h</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {isSpanish ? 'Velocidad' : 'Speed'}
                      </div>
                    </div>
                  </div>
                  
                  {vehicle.batteryLevel && (
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {isSpanish ? 'Nivel de Batería' : 'Battery Level'}
                        </span>
                        <span className="font-bold">{vehicle.batteryLevel}%</span>
                      </div>
                      <Progress value={vehicle.batteryLevel} className="h-2" />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">
                      {isSpanish ? 'Entregas Programadas' : 'Scheduled Deliveries'}
                    </h4>
                    {vehicle.deliveries.map((delivery) => (
                      <div key={delivery.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium">{delivery.customerName}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{delivery.address}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getDeliveryStatusColor(delivery.status)}>
                            {isSpanish 
                              ? (delivery.status === 'completed' ? 'Completado' :
                                 delivery.status === 'in-progress' ? 'En Progreso' :
                                 delivery.status === 'failed' ? 'Fallido' : 'Pendiente')
                              : delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)
                            }
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {delivery.estimatedTime}m
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            {isSpanish ? 'Lista de Vehículos' : 'Vehicle List'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Vista general de todos los vehículos activos'
              : 'Overview of all active vehicles'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deliveryVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedVehicle === vehicle.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : ''
                }`}
                onClick={() => setSelectedVehicle(vehicle.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    vehicle.vehicleType === 'electric' ? 'bg-green-100' :
                    vehicle.vehicleType === 'bike' ? 'bg-blue-100' :
                    vehicle.vehicleType === 'walking' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    {getVehicleIcon(vehicle.vehicleType)}
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{vehicle.driverName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {vehicle.currentLocation.address}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{vehicle.progress}%</div>
                    <div className="text-xs text-gray-500">
                      {isSpanish ? 'Progreso' : 'Progress'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-bold text-green-600">{vehicle.eta}</div>
                    <div className="text-xs text-gray-500">ETA</div>
                  </div>
                  
                  <Badge className={getStatusColor(vehicle.status)}>
                    {getStatusLabel(vehicle.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 