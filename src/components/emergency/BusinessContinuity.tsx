import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Server, 
  Cloud, 
  Users, 
  MessageSquare, 
  Phone,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Wifi,
  Shield,
  FileText,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Stop
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BackupSite {
  id: string;
  name: string;
  location: string;
  status: 'available' | 'active' | 'maintenance' | 'offline';
  dataSync: number; // percentage
  activationTime: string; // minutes
  capacity: number; // percentage
  lastBackup: string;
}

interface DataRecovery {
  type: 'full' | 'incremental' | 'point-in-time';
  status: 'ready' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  estimatedTime: string;
  lastRecovery: string;
}

interface ServiceStatus {
  service: string;
  status: 'operational' | 'degraded' | 'down' | 'maintenance';
  uptime: string;
  responseTime: string;
  lastIncident: string;
}

const BusinessContinuity: React.FC = () => {
  const { language } = useLanguage();
  const [activeBackupSite, setActiveBackupSite] = useState<string | null>(null);
  const [recoveryInProgress, setRecoveryInProgress] = useState(false);

  const backupSites: BackupSite[] = [
    {
      id: 'primary',
      name: language === 'es' ? 'Sitio Principal - San Juan' : 'Primary Site - San Juan',
      location: 'San Juan, PR',
      status: 'active',
      dataSync: 100,
      activationTime: '0',
      capacity: 85,
      lastBackup: '2024-07-30T03:00:00Z'
    },
    {
      id: 'backup1',
      name: language === 'es' ? 'Sitio de Respaldo - Bayamón' : 'Backup Site - Bayamón',
      location: 'Bayamón, PR',
      status: 'available',
      dataSync: 95,
      activationTime: '15',
      capacity: 60,
      lastBackup: '2024-07-30T02:45:00Z'
    },
    {
      id: 'backup2',
      name: language === 'es' ? 'Sitio de Respaldo - Ponce' : 'Backup Site - Ponce',
      location: 'Ponce, PR',
      status: 'available',
      dataSync: 90,
      activationTime: '30',
      capacity: 45,
      lastBackup: '2024-07-30T02:30:00Z'
    },
    {
      id: 'cloud',
      name: language === 'es' ? 'Respaldo en la Nube - AWS' : 'Cloud Backup - AWS',
      location: 'US East (N. Virginia)',
      status: 'available',
      dataSync: 88,
      activationTime: '45',
      capacity: 100,
      lastBackup: '2024-07-30T02:15:00Z'
    }
  ];

  const dataRecoveryOptions: DataRecovery[] = [
    {
      type: 'full',
      status: 'ready',
      progress: 0,
      estimatedTime: '2 hours',
      lastRecovery: '2024-07-29T18:00:00Z'
    },
    {
      type: 'incremental',
      status: 'ready',
      progress: 0,
      estimatedTime: '30 minutes',
      lastRecovery: '2024-07-30T02:00:00Z'
    },
    {
      type: 'point-in-time',
      status: 'ready',
      progress: 0,
      estimatedTime: '15 minutes',
      lastRecovery: '2024-07-30T03:00:00Z'
    }
  ];

  const serviceStatus: ServiceStatus[] = [
    {
      service: language === 'es' ? 'Sistema Principal' : 'Main System',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '45ms',
      lastIncident: '2024-07-15T10:30:00Z'
    },
    {
      service: language === 'es' ? 'Base de Datos' : 'Database',
      status: 'operational',
      uptime: '99.8%',
      responseTime: '12ms',
      lastIncident: '2024-07-20T14:15:00Z'
    },
    {
      service: language === 'es' ? 'API de Autenticación' : 'Auth API',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '28ms',
      lastIncident: '2024-07-10T09:45:00Z'
    },
    {
      service: language === 'es' ? 'Sistema de Pagos' : 'Payment System',
      status: 'operational',
      uptime: '99.7%',
      responseTime: '67ms',
      lastIncident: '2024-07-25T16:20:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'available':
      case 'active':
        return 'bg-green-500';
      case 'degraded':
      case 'maintenance':
        return 'bg-yellow-500';
      case 'down':
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'es') {
      switch (status) {
        case 'operational':
        case 'available':
        case 'active':
          return 'Operativo';
        case 'degraded':
        case 'maintenance':
          return 'Mantenimiento';
        case 'down':
        case 'offline':
          return 'Inactivo';
        default:
          return 'Desconocido';
      }
    } else {
      switch (status) {
        case 'operational':
        case 'available':
        case 'active':
          return 'Operational';
        case 'degraded':
        case 'maintenance':
          return 'Maintenance';
        case 'down':
        case 'offline':
          return 'Down';
        default:
          return 'Unknown';
      }
    }
  };

  const handleActivateBackup = (siteId: string) => {
    setActiveBackupSite(siteId);
    // Simulate activation process
    setTimeout(() => {
      console.log(`Backup site ${siteId} activated`);
    }, 2000);
  };

  const handleDataRecovery = (type: string) => {
    setRecoveryInProgress(true);
    // Simulate recovery process
    setTimeout(() => {
      setRecoveryInProgress(false);
      console.log(`Data recovery ${type} completed`);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Backup Site Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            {language === 'es' ? 'Gestión de Sitios de Respaldo' : 'Backup Site Management'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backupSites.map((site) => (
              <div key={site.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{site.name}</h3>
                    <p className="text-sm text-muted-foreground">{site.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(site.status)} text-white`}>
                      {getStatusText(site.status)}
                    </Badge>
                    {site.id === activeBackupSite && (
                      <Badge className="bg-blue-500 text-white">
                        {language === 'es' ? 'Activo' : 'Active'}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Sincronización de Datos' : 'Data Sync'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress value={site.dataSync} className="flex-1" />
                      <span className="text-sm font-medium">{site.dataSync}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Tiempo de Activación' : 'Activation Time'}
                    </p>
                    <p className="font-medium">{site.activationTime} min</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Capacidad' : 'Capacity'}
                    </p>
                    <p className="font-medium">{site.capacity}%</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Último Respaldo' : 'Last Backup'}
                    </p>
                    <p className="font-medium">
                      {new Date(site.lastBackup).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleActivateBackup(site.id)}
                    disabled={site.status === 'offline' || site.id === activeBackupSite}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Activar' : 'Activate'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Handle site configuration
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Configurar' : 'Configure'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Recovery Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {language === 'es' ? 'Opciones de Recuperación de Datos' : 'Data Recovery Options'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dataRecoveryOptions.map((recovery, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">
                    {recovery.type === 'full' && (language === 'es' ? 'Recuperación Completa' : 'Full Recovery')}
                    {recovery.type === 'incremental' && (language === 'es' ? 'Recuperación Incremental' : 'Incremental Recovery')}
                    {recovery.type === 'point-in-time' && (language === 'es' ? 'Punto en el Tiempo' : 'Point-in-Time')}
                  </h3>
                  <Badge className={`${getStatusColor(recovery.status)} text-white`}>
                    {getStatusText(recovery.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>{language === 'es' ? 'Tiempo Estimado:' : 'Estimated Time:'}</span>
                    <span className="font-medium">{recovery.estimatedTime}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>{language === 'es' ? 'Última Recuperación:' : 'Last Recovery:'}</span>
                    <span className="font-medium">
                      {new Date(recovery.lastRecovery).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {recovery.status === 'in-progress' && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{language === 'es' ? 'Progreso:' : 'Progress:'}</span>
                        <span>{recovery.progress}%</span>
                      </div>
                      <Progress value={recovery.progress} />
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={() => handleDataRecovery(recovery.type)}
                  disabled={recovery.status === 'in-progress' || recoveryInProgress}
                  className="w-full"
                >
                  {recovery.status === 'in-progress' ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Database className="h-4 w-4 mr-2" />
                  )}
                  {recovery.status === 'in-progress' 
                    ? (language === 'es' ? 'En Progreso...' : 'In Progress...')
                    : (language === 'es' ? 'Iniciar Recuperación' : 'Start Recovery')
                  }
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {language === 'es' ? 'Estado de Servicios' : 'Service Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {serviceStatus.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}></div>
                  <div>
                    <h4 className="font-medium">{service.service}</h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Último incidente:' : 'Last incident:'} {new Date(service.lastIncident).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es' ? 'Tiempo Activo' : 'Uptime'}
                      </p>
                      <p className="font-medium">{service.uptime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es' ? 'Respuesta' : 'Response'}
                      </p>
                      <p className="font-medium">{service.responseTime}</p>
                    </div>
                    <Badge className={`${getStatusColor(service.status)} text-white`}>
                      {getStatusText(service.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Coordination */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {language === 'es' ? 'Coordinación del Personal' : 'Staff Coordination'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">
                {language === 'es' ? 'Comunicaciones de Emergencia' : 'Emergency Communications'}
              </h4>
              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Enviar Alerta a Todo el Personal' : 'Send Alert to All Staff'}
              </Button>
              <Button variant="outline" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Llamada de Emergencia' : 'Emergency Call'}
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Generar Reporte de Estado' : 'Generate Status Report'}
              </Button>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">
                {language === 'es' ? 'Gestión de Roles' : 'Role Management'}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>{language === 'es' ? 'Coordinador de Emergencias' : 'Emergency Coordinator'}</span>
                  <Badge className="bg-green-500 text-white">
                    {language === 'es' ? 'Asignado' : 'Assigned'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>{language === 'es' ? 'Equipo de IT' : 'IT Team'}</span>
                  <Badge className="bg-green-500 text-white">
                    {language === 'es' ? 'Disponible' : 'Available'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>{language === 'es' ? 'Personal de Seguridad' : 'Security Staff'}</span>
                  <Badge className="bg-yellow-500 text-white">
                    {language === 'es' ? 'En Ruta' : 'En Route'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Communications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {language === 'es' ? 'Comunicaciones con Clientes' : 'Customer Communications'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Notificación Masiva' : 'Mass Notification'}
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Actualizar Estado del Servicio' : 'Update Service Status'}
              </Button>
              <Button variant="outline" className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Programar Comunicaciones' : 'Schedule Communications'}
              </Button>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                {language === 'es' ? 'Plantillas de Mensajes' : 'Message Templates'}
              </h4>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  {language === 'es' ? '🌪️ Alerta de Huracán - Servicios Limitados' : '🌪️ Hurricane Alert - Limited Services'}
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  {language === 'es' ? '⚡ Interrupción de Energía - Respaldo Activo' : '⚡ Power Outage - Backup Active'}
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  {language === 'es' ? '🔧 Mantenimiento Programado' : '🔧 Scheduled Maintenance'}
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  {language === 'es' ? '✅ Servicios Restaurados' : '✅ Services Restored'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessContinuity; 