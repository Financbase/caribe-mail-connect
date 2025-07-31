import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Hurricane, 
  CloudRain, 
  Wind, 
  Thermometer,
  MapPin,
  Clock,
  Users,
  Shield,
  Wifi,
  Battery,
  Fuel
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeatherAlert {
  type: 'hurricane' | 'flood' | 'storm' | 'heat' | 'wind';
  severity: 'watch' | 'warning' | 'critical';
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  category?: number; // For hurricanes
}

interface EmergencyMetrics {
  staffPresent: number;
  totalStaff: number;
  criticalPackages: number;
  systemStatus: 'operational' | 'degraded' | 'critical';
  communications: 'active' | 'limited' | 'down';
  powerStatus: 'normal' | 'backup' | 'critical';
}

const EmergencyDashboard: React.FC = () => {
  const { language } = useLanguage();
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [metrics, setMetrics] = useState<EmergencyMetrics>({
    staffPresent: 12,
    totalStaff: 15,
    criticalPackages: 3,
    systemStatus: 'operational',
    communications: 'active',
    powerStatus: 'normal'
  });

  // Mock weather alerts for Puerto Rico
  useEffect(() => {
    const mockAlerts: WeatherAlert[] = [
      {
        type: 'hurricane',
        severity: 'warning',
        title: language === 'es' ? 'Huracán María - Categoría 4' : 'Hurricane Maria - Category 4',
        description: language === 'es' 
          ? 'Huracán mayor acercándose a Puerto Rico. Vientos sostenidos de 130 mph.'
          : 'Major hurricane approaching Puerto Rico. Sustained winds of 130 mph.',
        location: language === 'es' ? 'Caribe Oriental' : 'Eastern Caribbean',
        startTime: '2024-09-20T18:00:00Z',
        endTime: '2024-09-22T06:00:00Z',
        category: 4
      },
      {
        type: 'flood',
        severity: 'watch',
        title: language === 'es' ? 'Vigilancia de Inundación' : 'Flood Watch',
        description: language === 'es'
          ? 'Posibles inundaciones en áreas bajas debido a lluvias intensas.'
          : 'Possible flooding in low-lying areas due to heavy rainfall.',
        location: language === 'es' ? 'San Juan y Área Metropolitana' : 'San Juan and Metro Area',
        startTime: '2024-09-20T12:00:00Z',
        endTime: '2024-09-21T12:00:00Z'
      }
    ];
    setWeatherAlerts(mockAlerts);
  }, [language]);

  const getSeverityColor = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'watch': return 'bg-yellow-500';
      case 'warning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSystemStatusColor = (status: EmergencyMetrics['systemStatus']) => {
    switch (status) {
      case 'operational': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSystemStatusText = (status: EmergencyMetrics['systemStatus']) => {
    if (language === 'es') {
      switch (status) {
        case 'operational': return 'Operativo';
        case 'degraded': return 'Degradado';
        case 'critical': return 'Crítico';
        default: return 'Desconocido';
      }
    } else {
      switch (status) {
        case 'operational': return 'Operational';
        case 'degraded': return 'Degraded';
        case 'critical': return 'Critical';
        default: return 'Unknown';
      }
    }
  };

  const getWeatherIcon = (type: WeatherAlert['type']) => {
    switch (type) {
      case 'hurricane': return <Hurricane className="h-5 w-5" />;
      case 'flood': return <CloudRain className="h-5 w-5" />;
      case 'storm': return <CloudRain className="h-5 w-5" />;
      case 'heat': return <Thermometer className="h-5 w-5" />;
      case 'wind': return <Wind className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'es' ? 'Personal Presente' : 'Staff Present'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.staffPresent}/{metrics.totalStaff}</div>
            <Progress value={(metrics.staffPresent / metrics.totalStaff) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'es' ? 'Personal en el sitio' : 'Staff on site'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'es' ? 'Estado del Sistema' : 'System Status'}
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSystemStatusColor(metrics.systemStatus)}`}>
              {getSystemStatusText(metrics.systemStatus)}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'es' ? 'Todos los sistemas' : 'All systems'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'es' ? 'Comunicaciones' : 'Communications'}
            </CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              metrics.communications === 'active' ? 'text-green-600' :
              metrics.communications === 'limited' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {metrics.communications === 'active' ? (language === 'es' ? 'Activo' : 'Active') :
               metrics.communications === 'limited' ? (language === 'es' ? 'Limitado' : 'Limited') :
               (language === 'es' ? 'Inactivo' : 'Down')}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'es' ? 'Red estable' : 'Network stable'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'es' ? 'Paquetes Críticos' : 'Critical Packages'}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.criticalPackages}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'es' ? 'Pendientes de entrega' : 'Pending delivery'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {language === 'es' ? 'Alertas Meteorológicas' : 'Weather Alerts'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weatherAlerts.map((alert, index) => (
                <Alert key={index} className="border-orange-200 bg-orange-50">
                  <div className="flex items-start gap-3">
                    {getWeatherIcon(alert.type)}
                    <div className="flex-1">
                      <AlertTitle className="flex items-center gap-2">
                        {alert.title}
                        <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                          {alert.severity === 'watch' ? (language === 'es' ? 'Vigilancia' : 'Watch') :
                           alert.severity === 'warning' ? (language === 'es' ? 'Advertencia' : 'Warning') :
                           (language === 'es' ? 'Crítico' : 'Critical')}
                        </Badge>
                        {alert.category && (
                          <Badge className="bg-purple-500 text-white">
                            {language === 'es' ? 'Cat' : 'Cat'} {alert.category}
                          </Badge>
                        )}
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <p className="mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {alert.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(alert.startTime).toLocaleString()}
                          </div>
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resource Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Battery className="h-5 w-5" />
            {language === 'es' ? 'Estado de Recursos Críticos' : 'Critical Resources Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-green-600" />
                <span>{language === 'es' ? 'Generadores' : 'Generators'}</span>
              </div>
              <Badge className="bg-green-500 text-white">
                {language === 'es' ? 'Operativo' : 'Operational'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-yellow-600" />
                <span>{language === 'es' ? 'Combustible' : 'Fuel'}</span>
              </div>
              <Badge className="bg-yellow-500 text-white">
                75%
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-green-600" />
                <span>{language === 'es' ? 'Comunicaciones' : 'Communications'}</span>
              </div>
              <Badge className="bg-green-500 text-white">
                {language === 'es' ? 'Activo' : 'Active'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Puerto Rico Hurricane Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hurricane className="h-5 w-5" />
            {language === 'es' ? 'Categorías de Huracanes - Puerto Rico' : 'Hurricane Categories - Puerto Rico'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((category) => (
              <div key={category} className="text-center p-3 border rounded-lg">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${
                  category === 1 ? 'bg-blue-500' :
                  category === 2 ? 'bg-yellow-500' :
                  category === 3 ? 'bg-orange-500' :
                  category === 4 ? 'bg-red-500' :
                  'bg-purple-500'
                }`}></div>
                <div className="font-semibold">
                  {language === 'es' ? 'Categoría' : 'Category'} {category}
                </div>
                <div className="text-sm text-muted-foreground">
                  {category === 1 && '74-95 mph'}
                  {category === 2 && '96-110 mph'}
                  {category === 3 && '111-129 mph'}
                  {category === 4 && '130-156 mph'}
                  {category === 5 && '157+ mph'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {category === 1 && (language === 'es' ? 'Daños Mínimos' : 'Minimal Damage')}
                  {category === 2 && (language === 'es' ? 'Daños Moderados' : 'Moderate Damage')}
                  {category === 3 && (language === 'es' ? 'Daños Extensos' : 'Extensive Damage')}
                  {category === 4 && (language === 'es' ? 'Daños Catastróficos' : 'Catastrophic Damage')}
                  {category === 5 && (language === 'es' ? 'Destrucción Total' : 'Total Destruction')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyDashboard; 