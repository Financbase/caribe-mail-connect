import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Zap,
  Thermometer,
  Shield,
  Camera,
  Users,
  AlertTriangle,
  Wind,
  Battery,
  Fuel,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { useFacility } from '@/hooks/useFacility';

interface PowerStatus {
  id: string;
  location: string;
  main_power: 'online' | 'offline' | 'unstable';
  generator_status: 'running' | 'standby' | 'maintenance' | 'offline';
  battery_backup: number;
  fuel_level: number;
  runtime_hours: number;
  last_maintenance: string;
  next_maintenance: string;
  critical_systems: string[];
  outage_prediction: 'low' | 'medium' | 'high';
  last_outage: string;
  outage_duration: number;
}

interface EnvironmentalData {
  id: string;
  location: string;
  type: 'temperature' | 'humidity' | 'air_quality' | 'lighting';
  current_value: number;
  unit: string;
  threshold_min: number;
  threshold_max: number;
  status: 'normal' | 'warning' | 'critical';
  last_reading: string;
  trend: 'stable' | 'increasing' | 'decreasing';
}

interface SecurityStatus {
  id: string;
  location: string;
  cameras_online: number;
  cameras_total: number;
  access_doors: number;
  active_alarms: number;
  last_incident: string;
  security_score: number;
}

interface HurricanePreparedness {
  id: string;
  location: string;
  hurricane_zone: 'A' | 'B' | 'C' | 'D';
  evacuation_route: string;
  emergency_supplies: string[];
  backup_communication: string[];
  fuel_reserves: number;
  water_reserves: number;
  last_drill: string;
  next_drill: string;
  readiness_score: number;
}

export function FacilityDashboard() {
  const {
    powerStatus,
    environmentalSensors,
    emergencyContacts,
    hurricanePreparedness,
    loading,
    getCriticalPowerIssues,
    getCriticalAlerts,
    getWarningAlerts
  } = useFacility();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando datos de la instalación...</p>
        </div>
      </div>
    );
  }

  const criticalPowerIssues = getCriticalPowerIssues();
  const criticalAlerts = getCriticalAlerts();
  const warningAlerts = getWarningAlerts();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'normal':
        return 'bg-green-500';
      case 'warning':
      case 'unstable':
        return 'bg-yellow-500';
      case 'critical':
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {(criticalPowerIssues.length > 0 || criticalAlerts.length > 0) && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Alertas Críticas:</strong> {criticalPowerIssues.length} problemas de energía y {criticalAlerts.length} alertas ambientales críticas.
          </AlertDescription>
        </Alert>
      )}

      {/* Power Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {powerStatus.map((status) => (
          <Card key={status.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{status.location}</span>
                <Badge 
                  variant={status.main_power === 'online' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {status.main_power === 'online' ? 'En Línea' : 
                   status.main_power === 'unstable' ? 'Inestable' : 'Desconectado'}
                </Badge>
              </CardTitle>
              <CardDescription>
                Estado del Sistema de Energía
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Generador:</span>
                <Badge variant="outline" className="text-xs">
                  {status.generator_status === 'running' ? 'Funcionando' :
                   status.generator_status === 'standby' ? 'En Espera' :
                   status.generator_status === 'maintenance' ? 'Mantenimiento' : 'Desconectado'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Batería de Respaldo:</span>
                  <span>{status.battery_backup}%</span>
                </div>
                <Progress value={status.battery_backup} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Nivel de Combustible:</span>
                  <span>{status.fuel_level}%</span>
                </div>
                <Progress value={status.fuel_level} className="h-2" />
              </div>

              <div className="text-xs text-muted-foreground">
                <div>Horas de Funcionamiento: {status.runtime_hours}h</div>
                <div>Próximo Mantenimiento: {new Date(status.next_maintenance).toLocaleDateString('es-PR')}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Environmental Sensors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Thermometer className="h-5 w-5 mr-2" />
            Sensores Ambientales
          </CardTitle>
          <CardDescription>
            Monitoreo de temperatura, humedad y calidad del aire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {environmentalSensors.map((sensor) => (
              <div key={sensor.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{sensor.location}</span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(sensor.trend)}
                    <Badge 
                      variant={sensor.status === 'normal' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {sensor.status === 'normal' ? 'Normal' :
                       sensor.status === 'warning' ? 'Advertencia' : 'Crítico'}
                    </Badge>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {sensor.current_value} {sensor.unit}
                </div>
                <div className="text-sm text-muted-foreground">
                  {sensor.type === 'temperature' ? 'Temperatura' :
                   sensor.type === 'humidity' ? 'Humedad' :
                   sensor.type === 'air_quality' ? 'Calidad del Aire' : 'Iluminación'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Rango: {sensor.threshold_min} - {sensor.threshold_max} {sensor.unit}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Estado de Seguridad
          </CardTitle>
          <CardDescription>
            Cámaras de seguridad y control de acceso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Camera className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">8/10</div>
              <div className="text-sm text-muted-foreground">Cámaras Activas</div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm text-muted-foreground">Puertas de Acceso</div>
            </div>
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Alarmas Activas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hurricane Preparedness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wind className="h-5 w-5 mr-2" />
            Preparación para Huracanes
          </CardTitle>
          <CardDescription>
            Estado de preparación para emergencias climáticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hurricanePreparedness.map((prep) => (
              <div key={prep.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{prep.location}</h4>
                  <Badge variant="outline">Zona {prep.hurricane_zone}</Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Puntuación de Preparación:</span>
                      <span>{prep.readiness_score}%</span>
                    </div>
                    <Progress value={prep.readiness_score} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Combustible:</span>
                      <div className="font-medium">{prep.fuel_reserves} galones</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Agua:</span>
                      <div className="font-medium">{prep.water_reserves} galones</div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <div>Último simulacro: {new Date(prep.last_drill).toLocaleDateString('es-PR')}</div>
                    <div>Próximo simulacro: {new Date(prep.next_drill).toLocaleDateString('es-PR')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Acceso rápido a funciones críticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <Zap className="h-5 w-5 mb-1" />
              <span className="text-xs">Estado de Energía</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Thermometer className="h-5 w-5 mb-1" />
              <span className="text-xs">Controles Ambientales</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Shield className="h-5 w-5 mb-1" />
              <span className="text-xs">Seguridad</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <AlertTriangle className="h-5 w-5 mb-1" />
              <span className="text-xs">Emergencias</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 