import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  TrendingUp,
  TrendingDown,
  Activity,
  Settings,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useFacility } from '@/hooks/useFacility';

interface ClimateSettings {
  id: string;
  location: string;
  temperature_setpoint: number;
  humidity_setpoint: number;
  air_flow_rate: number; // CFM
  lighting_level: number; // percentage
  auto_mode: boolean;
  schedule_enabled: boolean;
  last_adjustment: string;
}

interface AlertThresholds {
  id: string;
  sensor_type: 'temperature' | 'humidity' | 'air_quality' | 'lighting';
  warning_min: number;
  warning_max: number;
  critical_min: number;
  critical_max: number;
  enabled: boolean;
  notification_recipients: string[];
}

interface EnergyConsumption {
  id: string;
  location: string;
  timestamp: string;
  hvac_consumption: number; // kWh
  lighting_consumption: number; // kWh
  total_consumption: number; // kWh
  peak_demand: number; // kW
  cost_per_hour: number; // USD
}

interface HistoricalData {
  id: string;
  location: string;
  date: string;
  avg_temperature: number;
  avg_humidity: number;
  energy_consumption: number;
  cost: number;
  anomalies: number;
}

export function EnvironmentalControls() {
  const {
    environmentalSensors,
    loading,
    getCriticalAlerts,
    getWarningAlerts
  } = useFacility();

  const [activeTab, setActiveTab] = useState('climate');

  // Mock data for demonstration
  const mockClimateSettings: ClimateSettings[] = [
    {
      id: '1',
      location: 'San Juan Main',
      temperature_setpoint: 22,
      humidity_setpoint: 45,
      air_flow_rate: 800,
      lighting_level: 75,
      auto_mode: true,
      schedule_enabled: true,
      last_adjustment: '2024-03-15T10:30:00Z'
    },
    {
      id: '2',
      location: 'Bayamón Branch',
      temperature_setpoint: 24,
      humidity_setpoint: 50,
      air_flow_rate: 600,
      lighting_level: 60,
      auto_mode: false,
      schedule_enabled: false,
      last_adjustment: '2024-03-15T09:15:00Z'
    }
  ];

  const mockAlertThresholds: AlertThresholds[] = [
    {
      id: '1',
      sensor_type: 'temperature',
      warning_min: 18,
      warning_max: 26,
      critical_min: 15,
      critical_max: 30,
      enabled: true,
      notification_recipients: ['carlos.rodriguez@prmcms.com']
    },
    {
      id: '2',
      sensor_type: 'humidity',
      warning_min: 30,
      warning_max: 60,
      critical_min: 20,
      critical_max: 80,
      enabled: true,
      notification_recipients: ['carlos.rodriguez@prmcms.com']
    },
    {
      id: '3',
      sensor_type: 'air_quality',
      warning_min: 0,
      warning_max: 100,
      critical_min: 0,
      critical_max: 150,
      enabled: true,
      notification_recipients: ['carlos.rodriguez@prmcms.com', 'maria.gonzalez@prmcms.com']
    }
  ];

  const mockEnergyConsumption: EnergyConsumption[] = [
    {
      id: '1',
      location: 'San Juan Main',
      timestamp: '2024-03-15T10:00:00Z',
      hvac_consumption: 45.2,
      lighting_consumption: 12.8,
      total_consumption: 58.0,
      peak_demand: 8.5,
      cost_per_hour: 12.45
    },
    {
      id: '2',
      location: 'Bayamón Branch',
      timestamp: '2024-03-15T10:00:00Z',
      hvac_consumption: 38.7,
      lighting_consumption: 9.2,
      total_consumption: 47.9,
      peak_demand: 6.8,
      cost_per_hour: 10.25
    }
  ];

  const mockHistoricalData: HistoricalData[] = [
    {
      id: '1',
      location: 'San Juan Main',
      date: '2024-03-14',
      avg_temperature: 22.5,
      avg_humidity: 45,
      energy_consumption: 1250,
      cost: 298.50,
      anomalies: 2
    },
    {
      id: '2',
      location: 'San Juan Main',
      date: '2024-03-13',
      avg_temperature: 23.1,
      avg_humidity: 48,
      energy_consumption: 1320,
      cost: 315.20,
      anomalies: 1
    },
    {
      id: '3',
      location: 'San Juan Main',
      date: '2024-03-12',
      avg_temperature: 21.8,
      avg_humidity: 42,
      energy_consumption: 1180,
      cost: 281.60,
      anomalies: 0
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando controles ambientales...</p>
        </div>
      </div>
    );
  }

  const criticalAlerts = getCriticalAlerts();
  const warningAlerts = getWarningAlerts();

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="h-4 w-4" />;
      case 'humidity':
        return <Droplets className="h-4 w-4" />;
      case 'air_quality':
        return <Wind className="h-4 w-4" />;
      case 'lighting':
        return <Sun className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Environmental Alerts */}
      {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Alertas Ambientales:</strong> {criticalAlerts.length} alertas críticas y {warningAlerts.length} advertencias activas.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="climate">Clima</TabsTrigger>
          <TabsTrigger value="thresholds">Umbrales</TabsTrigger>
          <TabsTrigger value="energy">Energía</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
        </TabsList>

        <TabsContent value="climate" className="space-y-6">
          {/* Current Environmental Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Thermometer className="h-5 w-5 mr-2" />
                Condiciones Ambientales Actuales
              </CardTitle>
              <CardDescription>
                Estado en tiempo real de los sensores ambientales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {environmentalSensors.map((sensor) => (
                  <div key={sensor.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getSensorIcon(sensor.type)}
                        <span className="font-medium">{sensor.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(sensor.status)}`}></div>
                        <Badge 
                          variant={sensor.status === 'normal' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {sensor.status === 'normal' ? 'Normal' :
                           sensor.status === 'warning' ? 'Advertencia' : 'Crítico'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-2xl font-bold mb-1">
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

          {/* Climate Control Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configuración de Control Climático
              </CardTitle>
              <CardDescription>
                Ajustes de temperatura, humedad y flujo de aire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockClimateSettings.map((setting) => (
                  <div key={setting.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">{setting.location}</h4>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={setting.auto_mode}
                            onCheckedChange={() => {}}
                          />
                          <span className="text-sm">Modo Automático</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={setting.schedule_enabled}
                            onCheckedChange={() => {}}
                          />
                          <span className="text-sm">Programación</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Temperatura Objetivo: {setting.temperature_setpoint}°C
                          </label>
                          <Slider
                            value={[setting.temperature_setpoint]}
                            onValueChange={() => {}}
                            max={30}
                            min={15}
                            step={0.5}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Humedad Objetivo: {setting.humidity_setpoint}%
                          </label>
                          <Slider
                            value={[setting.humidity_setpoint]}
                            onValueChange={() => {}}
                            max={80}
                            min={20}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Flujo de Aire: {setting.air_flow_rate} CFM
                          </label>
                          <Slider
                            value={[setting.air_flow_rate]}
                            onValueChange={() => {}}
                            max={1200}
                            min={200}
                            step={50}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Nivel de Iluminación: {setting.lighting_level}%
                          </label>
                          <Slider
                            value={[setting.lighting_level]}
                            onValueChange={() => {}}
                            max={100}
                            min={0}
                            step={5}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mt-4">
                      Último ajuste: {new Date(setting.last_adjustment).toLocaleString('es-PR')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Umbrales de Alerta
              </CardTitle>
              <CardDescription>
                Configuración de límites para alertas ambientales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockAlertThresholds.map((threshold) => (
                  <div key={threshold.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getSensorIcon(threshold.sensor_type)}
                        <h4 className="font-semibold capitalize">
                          {threshold.sensor_type === 'temperature' ? 'Temperatura' :
                           threshold.sensor_type === 'humidity' ? 'Humedad' :
                           threshold.sensor_type === 'air_quality' ? 'Calidad del Aire' : 'Iluminación'}
                        </h4>
                      </div>
                      <Switch 
                        checked={threshold.enabled}
                        onCheckedChange={() => {}}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Advertencia</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Mínimo:</span>
                            <div className="font-medium">{threshold.warning_min}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Máximo:</span>
                            <div className="font-medium">{threshold.warning_max}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium mb-2">Crítico</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Mínimo:</span>
                            <div className="font-medium">{threshold.critical_min}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Máximo:</span>
                            <div className="font-medium">{threshold.critical_max}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-2">Destinatarios de Notificación</h5>
                      <div className="flex flex-wrap gap-1">
                        {threshold.notification_recipients.map((recipient, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {recipient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="energy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Consumo de Energía
              </CardTitle>
              <CardDescription>
                Monitoreo del consumo energético por sistemas ambientales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockEnergyConsumption.map((consumption) => (
                  <div key={consumption.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">{consumption.location}</h4>
                      <div className="text-sm text-muted-foreground">
                        {new Date(consumption.timestamp).toLocaleString('es-PR')}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {consumption.hvac_consumption} kWh
                        </div>
                        <div className="text-sm text-muted-foreground">HVAC</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {consumption.lighting_consumption} kWh
                        </div>
                        <div className="text-sm text-muted-foreground">Iluminación</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {consumption.total_consumption} kWh
                        </div>
                        <div className="text-sm text-muted-foreground">Total</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Demanda Máxima</div>
                        <div className="font-medium">{consumption.peak_demand} kW</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Costo por Hora</div>
                        <div className="font-medium">${consumption.cost_per_hour.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Tendencias Históricas
              </CardTitle>
              <CardDescription>
                Análisis de datos históricos y patrones de consumo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockHistoricalData.map((data) => (
                  <div key={data.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{data.location}</h4>
                      <div className="text-sm text-muted-foreground">
                        {new Date(data.date).toLocaleDateString('es-PR')}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Temp. Promedio</div>
                        <div className="font-medium">{data.avg_temperature}°C</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Humedad Promedio</div>
                        <div className="font-medium">{data.avg_humidity}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Consumo Energético</div>
                        <div className="font-medium">{data.energy_consumption} kWh</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Costo</div>
                        <div className="font-medium">${data.cost.toFixed(2)}</div>
                      </div>
                    </div>

                    {data.anomalies > 0 && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="text-sm text-yellow-800">
                          ⚠️ {data.anomalies} anomalía{data.anomalies > 1 ? 's' : ''} detectada{data.anomalies > 1 ? 's' : ''}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 