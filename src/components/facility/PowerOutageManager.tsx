import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Zap,
  Battery,
  Fuel,
  AlertTriangle,
  Bell,
  Clock,
  Activity,
  TrendingUp,
  Settings,
  Power,
  Shield,
  Wifi
} from 'lucide-react';
import { useFacility } from '@/hooks/useFacility';

interface OutagePrediction {
  id: string;
  location: string;
  probability: number; // 0-100
  estimated_duration: number; // minutes
  confidence: 'low' | 'medium' | 'high';
  factors: string[];
  last_updated: string;
}

interface BackupSystem {
  id: string;
  location: string;
  battery_capacity: number; // kWh
  battery_level: number; // percentage
  estimated_runtime: number; // minutes
  critical_load: number; // kW
  status: 'charging' | 'discharging' | 'standby' | 'maintenance';
  last_test: string;
}

interface GeneratorStatus {
  id: string;
  location: string;
  fuel_type: 'diesel' | 'gasoline' | 'propane';
  fuel_level: number; // percentage
  fuel_capacity: number; // gallons
  runtime_hours: number;
  status: 'running' | 'standby' | 'maintenance' | 'offline';
  next_maintenance: string;
  efficiency: number; // percentage
}

interface CriticalSystem {
  id: string;
  name: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  power_consumption: number; // kW
  backup_required: boolean;
  current_status: 'online' | 'offline' | 'backup';
  description: string;
}

interface Notification {
  id: string;
  type: 'outage' | 'low_fuel' | 'battery_low' | 'maintenance' | 'system_failure';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  acknowledged: boolean;
  recipients: string[];
}

export function PowerOutageManager() {
  const {
    powerStatus,
    loading,
    getCriticalPowerIssues,
    getOutagePredictions
  } = useFacility();

  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const mockOutagePredictions: OutagePrediction[] = [
    {
      id: '1',
      location: 'San Juan Main',
      probability: 15,
      estimated_duration: 45,
      confidence: 'medium',
      factors: ['Weather forecast', 'Grid stability', 'Historical patterns'],
      last_updated: '2024-03-15T10:30:00Z'
    },
    {
      id: '2',
      location: 'Bayamón Branch',
      probability: 75,
      estimated_duration: 120,
      confidence: 'high',
      factors: ['Unstable power', 'Equipment age', 'High demand'],
      last_updated: '2024-03-15T10:30:00Z'
    }
  ];

  const mockBackupSystems: BackupSystem[] = [
    {
      id: '1',
      location: 'San Juan Main',
      battery_capacity: 50,
      battery_level: 95,
      estimated_runtime: 180,
      critical_load: 15,
      status: 'charging',
      last_test: '2024-03-10T14:00:00Z'
    },
    {
      id: '2',
      location: 'Bayamón Branch',
      battery_capacity: 30,
      battery_level: 60,
      estimated_runtime: 90,
      critical_load: 12,
      status: 'discharging',
      last_test: '2024-03-12T09:00:00Z'
    }
  ];

  const mockGeneratorStatus: GeneratorStatus[] = [
    {
      id: '1',
      location: 'San Juan Main',
      fuel_type: 'diesel',
      fuel_level: 85,
      fuel_capacity: 500,
      runtime_hours: 120,
      status: 'standby',
      next_maintenance: '2024-04-15',
      efficiency: 92
    },
    {
      id: '2',
      location: 'Bayamón Branch',
      fuel_type: 'diesel',
      fuel_level: 45,
      fuel_capacity: 300,
      runtime_hours: 8,
      status: 'running',
      next_maintenance: '2024-03-25',
      efficiency: 88
    }
  ];

  const mockCriticalSystems: CriticalSystem[] = [
    {
      id: '1',
      name: 'Server Room',
      priority: 'critical',
      power_consumption: 8,
      backup_required: true,
      current_status: 'online',
      description: 'Main data center and network equipment'
    },
    {
      id: '2',
      name: 'Security System',
      priority: 'critical',
      power_consumption: 2,
      backup_required: true,
      current_status: 'online',
      description: 'CCTV cameras and access control'
    },
    {
      id: '3',
      name: 'Emergency Lighting',
      priority: 'high',
      power_consumption: 1,
      backup_required: true,
      current_status: 'online',
      description: 'Emergency exit lighting and signage'
    },
    {
      id: '4',
      name: 'HVAC System',
      priority: 'medium',
      power_consumption: 5,
      backup_required: false,
      current_status: 'online',
      description: 'Heating, ventilation, and air conditioning'
    }
  ];

  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'low_fuel',
      title: 'Bajo Nivel de Combustible',
      message: 'El generador en Bayamón Branch tiene solo 45% de combustible restante.',
      severity: 'warning',
      timestamp: '2024-03-15T10:30:00Z',
      acknowledged: false,
      recipients: ['carlos.rodriguez@prmcms.com', 'maria.gonzalez@prmcms.com']
    },
    {
      id: '2',
      type: 'maintenance',
      title: 'Mantenimiento Programado',
      message: 'Mantenimiento preventivo del generador principal programado para el 15 de abril.',
      severity: 'info',
      timestamp: '2024-03-15T09:00:00Z',
      acknowledged: true,
      recipients: ['carlos.rodriguez@prmcms.com']
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando datos de energía...</p>
        </div>
      </div>
    );
  }

  const criticalIssues = getCriticalPowerIssues();
  const outagePredictions = getOutagePredictions();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {criticalIssues.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Problemas Críticos de Energía:</strong> {criticalIssues.length} ubicaciones con problemas de energía que requieren atención inmediata.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="prediction">Predicciones</TabsTrigger>
          <TabsTrigger value="backup">Sistemas de Respaldo</TabsTrigger>
          <TabsTrigger value="generators">Generadores</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                      <span>Batería:</span>
                      <span>{status.battery_backup}%</span>
                    </div>
                    <Progress value={status.battery_backup} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Combustible:</span>
                      <span>{status.fuel_level}%</span>
                    </div>
                    <Progress value={status.fuel_level} className="h-2" />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <div>Horas de Funcionamiento: {status.runtime_hours}h</div>
                    <div>Predicción de Apagón: {status.outage_prediction === 'high' ? 'Alta' :
                                                   status.outage_prediction === 'medium' ? 'Media' : 'Baja'}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Critical Systems */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Sistemas Críticos
              </CardTitle>
              <CardDescription>
                Prioridades de sistemas durante apagones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCriticalSystems.map((system) => (
                  <div key={system.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{system.name}</h4>
                      <Badge className={getPriorityColor(system.priority)}>
                        {system.priority === 'critical' ? 'Crítico' :
                         system.priority === 'high' ? 'Alto' :
                         system.priority === 'medium' ? 'Medio' : 'Bajo'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {system.description}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Consumo: {system.power_consumption} kW</span>
                      <Badge variant={system.current_status === 'online' ? 'default' : 'secondary'}>
                        {system.current_status === 'online' ? 'En Línea' :
                         system.current_status === 'backup' ? 'Respaldo' : 'Desconectado'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Predicciones de Apagón
              </CardTitle>
              <CardDescription>
                Análisis de probabilidad de apagones basado en patrones y condiciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOutagePredictions.map((prediction) => (
                  <div key={prediction.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{prediction.location}</h4>
                      <Badge 
                        variant={prediction.probability > 50 ? 'destructive' : 
                                prediction.probability > 25 ? 'default' : 'secondary'}
                      >
                        {prediction.probability}% Probabilidad
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Duración Estimada</div>
                        <div className="font-medium">{prediction.estimated_duration} minutos</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Confianza</div>
                        <div className="font-medium capitalize">{prediction.confidence}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Última Actualización</div>
                        <div className="font-medium">{new Date(prediction.last_updated).toLocaleString('es-PR')}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Factores Considerados:</div>
                      <div className="flex flex-wrap gap-1">
                        {prediction.factors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {factor}
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

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Battery className="h-5 w-5 mr-2" />
                Sistemas de Batería de Respaldo
              </CardTitle>
              <CardDescription>
                Estado de las baterías UPS y tiempo de respaldo disponible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockBackupSystems.map((system) => (
                  <div key={system.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{system.location}</h4>
                      <Badge 
                        variant={system.status === 'charging' ? 'default' : 
                                system.status === 'discharging' ? 'destructive' : 'secondary'}
                      >
                        {system.status === 'charging' ? 'Cargando' :
                         system.status === 'discharging' ? 'Descargando' :
                         system.status === 'standby' ? 'En Espera' : 'Mantenimiento'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Nivel de Batería:</span>
                          <span>{system.battery_level}%</span>
                        </div>
                        <Progress value={system.battery_level} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Capacidad:</span>
                          <div className="font-medium">{system.battery_capacity} kWh</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tiempo Restante:</span>
                          <div className="font-medium">{system.estimated_runtime} min</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Carga Crítica:</span>
                          <div className="font-medium">{system.critical_load} kW</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Última Prueba:</span>
                          <div className="font-medium">{new Date(system.last_test).toLocaleDateString('es-PR')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Fuel className="h-5 w-5 mr-2" />
                Estado de Generadores
              </CardTitle>
              <CardDescription>
                Monitoreo de generadores y niveles de combustible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockGeneratorStatus.map((generator) => (
                  <div key={generator.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{generator.location}</h4>
                      <Badge 
                        variant={generator.status === 'running' ? 'default' : 
                                generator.status === 'standby' ? 'secondary' : 'destructive'}
                      >
                        {generator.status === 'running' ? 'Funcionando' :
                         generator.status === 'standby' ? 'En Espera' :
                         generator.status === 'maintenance' ? 'Mantenimiento' : 'Desconectado'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Nivel de Combustible:</span>
                          <span>{generator.fuel_level}%</span>
                        </div>
                        <Progress value={generator.fuel_level} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tipo:</span>
                          <div className="font-medium capitalize">{generator.fuel_type}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Capacidad:</span>
                          <div className="font-medium">{generator.fuel_capacity} gal</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Horas de Funcionamiento:</span>
                          <div className="font-medium">{generator.runtime_hours}h</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Eficiencia:</span>
                          <div className="font-medium">{generator.efficiency}%</div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Próximo Mantenimiento: {new Date(generator.next_maintenance).toLocaleDateString('es-PR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notificaciones del Sistema
              </CardTitle>
              <CardDescription>
                Alertas y notificaciones automáticas del sistema de energía
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNotifications.map((notification) => (
                  <div key={notification.id} className={`border rounded-lg p-4 ${
                    notification.severity === 'critical' ? 'border-red-200 bg-red-50' :
                    notification.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(notification.severity)}`}></div>
                        <h4 className="font-semibold">{notification.title}</h4>
                      </div>
                      <Badge variant={notification.acknowledged ? 'secondary' : 'default'}>
                        {notification.acknowledged ? 'Reconocida' : 'Nueva'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(notification.timestamp).toLocaleString('es-PR')}</span>
                      <span>{notification.recipients.length} destinatarios</span>
                    </div>
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