import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  CloudRain, 
  Hurricane, 
  Wind, 
  Thermometer, 
  MapPin,
  Clock,
  RefreshCw,
  Settings,
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEmergency } from '@/contexts/EmergencyContext';

interface WeatherAlert {
  id: string;
  type: 'hurricane' | 'tropical-storm' | 'flood' | 'severe-thunderstorm' | 'tornado' | 'heat' | 'wind';
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  startTime: string;
  endTime: string;
  category?: number; // For hurricanes
  windSpeed?: number;
  rainfall?: number;
  temperature?: number;
  source: 'NOAA' | 'NWS' | 'local';
  isActive: boolean;
}

interface WeatherStation {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  status: 'online' | 'offline' | 'maintenance';
  lastUpdate: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  rainfall: number;
}

const WeatherAlertIntegration: React.FC = () => {
  const { language } = useLanguage();
  const { emergencyState, activateEmergency } = useEmergency();
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [weatherStations, setWeatherStations] = useState<WeatherStation[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock weather alerts for Puerto Rico
  useEffect(() => {
    const mockAlerts: WeatherAlert[] = [
      {
        id: 'ALERT-001',
        type: 'hurricane',
        severity: 'severe',
        title: language === 'es' ? 'Huracán María - Categoría 4' : 'Hurricane Maria - Category 4',
        description: language === 'es'
          ? 'Huracán mayor acercándose a Puerto Rico. Vientos sostenidos de 130 mph. Se espera impacto directo en las próximas 24 horas.'
          : 'Major hurricane approaching Puerto Rico. Sustained winds of 130 mph. Direct impact expected within 24 hours.',
        location: language === 'es' ? 'Caribe Oriental' : 'Eastern Caribbean',
        coordinates: { lat: 18.2208, lng: -66.5901 },
        startTime: '2024-09-20T18:00:00Z',
        endTime: '2024-09-22T06:00:00Z',
        category: 4,
        windSpeed: 130,
        source: 'NOAA',
        isActive: true
      },
      {
        id: 'ALERT-002',
        type: 'flood',
        severity: 'moderate',
        title: language === 'es' ? 'Vigilancia de Inundación' : 'Flood Watch',
        description: language === 'es'
          ? 'Posibles inundaciones en áreas bajas debido a lluvias intensas. Se esperan 3-5 pulgadas de lluvia.'
          : 'Possible flooding in low-lying areas due to heavy rainfall. 3-5 inches of rain expected.',
        location: language === 'es' ? 'San Juan y Área Metropolitana' : 'San Juan and Metro Area',
        coordinates: { lat: 18.4655, lng: -66.1057 },
        startTime: '2024-09-20T12:00:00Z',
        endTime: '2024-09-21T12:00:00Z',
        rainfall: 4.5,
        source: 'NWS',
        isActive: true
      },
      {
        id: 'ALERT-003',
        type: 'severe-thunderstorm',
        severity: 'moderate',
        title: language === 'es' ? 'Tormenta Eléctrica Severa' : 'Severe Thunderstorm',
        description: language === 'es'
          ? 'Tormenta eléctrica severa con vientos fuertes y granizo. Posibles daños a estructuras.'
          : 'Severe thunderstorm with strong winds and hail. Possible structural damage.',
        location: language === 'es' ? 'Bayamón y Ponce' : 'Bayamón and Ponce',
        coordinates: { lat: 18.3985, lng: -66.1614 },
        startTime: '2024-09-20T15:00:00Z',
        endTime: '2024-09-20T18:00:00Z',
        windSpeed: 60,
        source: 'local',
        isActive: true
      }
    ];

    setWeatherAlerts(mockAlerts);
  }, [language]);

  // Mock weather stations
  useEffect(() => {
    const mockStations: WeatherStation[] = [
      {
        id: 'STATION-001',
        name: language === 'es' ? 'Estación San Juan' : 'San Juan Station',
        location: 'San Juan, PR',
        coordinates: { lat: 18.4655, lng: -66.1057 },
        status: 'online',
        lastUpdate: new Date().toISOString(),
        temperature: 28,
        humidity: 75,
        windSpeed: 15,
        pressure: 1013,
        rainfall: 0.5
      },
      {
        id: 'STATION-002',
        name: language === 'es' ? 'Estación Bayamón' : 'Bayamón Station',
        location: 'Bayamón, PR',
        coordinates: { lat: 18.3985, lng: -66.1614 },
        status: 'online',
        lastUpdate: new Date().toISOString(),
        temperature: 27,
        humidity: 80,
        windSpeed: 20,
        pressure: 1012,
        rainfall: 1.2
      },
      {
        id: 'STATION-003',
        name: language === 'es' ? 'Estación Ponce' : 'Ponce Station',
        location: 'Ponce, PR',
        coordinates: { lat: 18.0111, lng: -66.6141 },
        status: 'maintenance',
        lastUpdate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        temperature: 29,
        humidity: 70,
        windSpeed: 12,
        pressure: 1014,
        rainfall: 0.0
      }
    ];

    setWeatherStations(mockStations);
  }, [language]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'severe': return 'bg-orange-500';
      case 'extreme': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityText = (severity: string) => {
    if (language === 'es') {
      switch (severity) {
        case 'minor': return 'Menor';
        case 'moderate': return 'Moderado';
        case 'severe': return 'Severo';
        case 'extreme': return 'Extremo';
        default: return 'Desconocido';
      }
    } else {
      switch (severity) {
        case 'minor': return 'Minor';
        case 'moderate': return 'Moderate';
        case 'severe': return 'Severe';
        case 'extreme': return 'Extreme';
        default: return 'Unknown';
      }
    }
  };

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case 'hurricane':
      case 'tropical-storm':
        return <Hurricane className="h-5 w-5" />;
      case 'flood':
      case 'severe-thunderstorm':
        return <CloudRain className="h-5 w-5" />;
      case 'wind':
        return <Wind className="h-5 w-5" />;
      case 'heat':
        return <Thermometer className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getStationStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleRefreshAlerts = () => {
    setLastUpdate(new Date());
    // Simulate API call
    setTimeout(() => {
      console.log('Weather alerts refreshed');
    }, 1000);
  };

  const handleActivateEmergency = (alert: WeatherAlert) => {
    const level = alert.severity === 'extreme' ? 'critical' :
                 alert.severity === 'severe' ? 'warning' :
                 alert.severity === 'moderate' ? 'watch' : 'normal';
    
    activateEmergency(level, 'hurricane', alert.title);
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
            {language === 'es' ? 'Estado de Conexión' : 'Connection Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {isConnected 
                  ? (language === 'es' ? 'Conectado a Servicios Meteorológicos' : 'Connected to Weather Services')
                  : (language === 'es' ? 'Desconectado - Modo Sin Conexión' : 'Disconnected - Offline Mode')
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'es' ? 'Última actualización:' : 'Last update:'} {lastUpdate.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefreshAlerts} disabled={!isConnected}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Actualizar' : 'Refresh'}
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Configurar' : 'Configure'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Weather Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {language === 'es' ? 'Alertas Meteorológicas Activas' : 'Active Weather Alerts'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weatherAlerts.filter(alert => alert.isActive).map((alert) => (
              <Alert key={alert.id} className="border-orange-200 bg-orange-50">
                <div className="flex items-start gap-3">
                  {getWeatherIcon(alert.type)}
                  <div className="flex-1">
                    <AlertTitle className="flex items-center gap-2">
                      {alert.title}
                      <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                        {getSeverityText(alert.severity)}
                      </Badge>
                      {alert.category && (
                        <Badge className="bg-purple-500 text-white">
                          {language === 'es' ? 'Cat' : 'Cat'} {alert.category}
                        </Badge>
                      )}
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      <p className="mb-2">{alert.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.startTime).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {alert.source}
                        </div>
                      </div>
                      {alert.windSpeed && (
                        <div className="mt-2 text-sm">
                          <strong>{language === 'es' ? 'Velocidad del Viento:' : 'Wind Speed:'}</strong> {alert.windSpeed} mph
                        </div>
                      )}
                      {alert.rainfall && (
                        <div className="mt-1 text-sm">
                          <strong>{language === 'es' ? 'Lluvia Esperada:' : 'Expected Rainfall:'}</strong> {alert.rainfall} inches
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleActivateEmergency(alert)}
                      disabled={emergencyState.isActive}
                    >
                      {language === 'es' ? 'Activar Emergencia' : 'Activate Emergency'}
                    </Button>
                    <Button variant="outline" size="sm">
                      {language === 'es' ? 'Ver Detalles' : 'View Details'}
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
            
            {weatherAlerts.filter(alert => alert.isActive).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {language === 'es' ? 'No hay alertas meteorológicas activas' : 'No active weather alerts'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weather Stations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            {language === 'es' ? 'Estaciones Meteorológicas' : 'Weather Stations'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weatherStations.map((station) => (
              <div key={station.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{station.name}</h3>
                    <p className="text-sm text-muted-foreground">{station.location}</p>
                  </div>
                  <Badge className={`${getStationStatusColor(station.status)} text-white`}>
                    {station.status === 'online' ? (language === 'es' ? 'En Línea' : 'Online') :
                     station.status === 'maintenance' ? (language === 'es' ? 'Mantenimiento' : 'Maintenance') :
                     (language === 'es' ? 'Desconectado' : 'Offline')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">
                      {language === 'es' ? 'Temperatura:' : 'Temperature:'}
                    </p>
                    <p className="font-medium">{station.temperature}°C</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {language === 'es' ? 'Humedad:' : 'Humidity:'}
                    </p>
                    <p className="font-medium">{station.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {language === 'es' ? 'Viento:' : 'Wind:'}
                    </p>
                    <p className="font-medium">{station.windSpeed} mph</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {language === 'es' ? 'Presión:' : 'Pressure:'}
                    </p>
                    <p className="font-medium">{station.pressure} hPa</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {language === 'es' ? 'Lluvia:' : 'Rainfall:'}
                    </p>
                    <p className="font-medium">{station.rainfall} mm</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {language === 'es' ? 'Última Actualización:' : 'Last Update:'}
                    </p>
                    <p className="font-medium">
                      {new Date(station.lastUpdate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {language === 'es' ? 'Configuración de API' : 'API Configuration'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">
                  {language === 'es' ? 'Servicios Configurados' : 'Configured Services'}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>NOAA Weather API</span>
                    <Badge className="bg-green-500 text-white">
                      {language === 'es' ? 'Activo' : 'Active'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>National Weather Service</span>
                    <Badge className="bg-green-500 text-white">
                      {language === 'es' ? 'Activo' : 'Active'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Local Weather Stations</span>
                    <Badge className="bg-yellow-500 text-white">
                      {language === 'es' ? 'Parcial' : 'Partial'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">
                  {language === 'es' ? 'Configuración de Alertas' : 'Alert Configuration'}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>{language === 'es' ? 'Alertas Automáticas' : 'Automatic Alerts'}</span>
                    <Badge className="bg-green-500 text-white">
                      {language === 'es' ? 'Activado' : 'Enabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>{language === 'es' ? 'Notificaciones Push' : 'Push Notifications'}</span>
                    <Badge className="bg-green-500 text-white">
                      {language === 'es' ? 'Activado' : 'Enabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>{language === 'es' ? 'Actualización Automática' : 'Auto Refresh'}</span>
                    <Badge className="bg-green-500 text-white">
                      {language === 'es' ? 'Activado' : 'Enabled'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Configurar APIs' : 'Configure APIs'}
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Probar Conexiones' : 'Test Connections'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherAlertIntegration; 