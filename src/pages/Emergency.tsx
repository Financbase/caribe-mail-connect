import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Wind, 
  Phone, 
  MapPin, 
  Users, 
  Package, 
  Wifi, 
  Battery, 
  Fuel, 
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  Radio,
  Truck,
  Building,
  Database,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import EmergencyDashboard from '@/components/emergency/EmergencyDashboard';
import BusinessContinuity from '@/components/emergency/BusinessContinuity';
import EmergencyLogistics from '@/components/emergency/EmergencyLogistics';
import PostEmergencyRecovery from '@/components/emergency/PostEmergencyRecovery';
import WeatherAlertIntegration from '@/components/emergency/WeatherAlertIntegration';

interface EmergencyStatus {
  level: 'normal' | 'watch' | 'warning' | 'critical';
  type: 'hurricane' | 'flood' | 'power' | 'security' | 'medical';
  message: string;
  timestamp: string;
}

interface HurricaneInfo {
  name: string;
  category: 1 | 2 | 3 | 4 | 5;
  windSpeed: number;
  location: string;
  distance: number;
  eta: string;
  status: 'approaching' | 'landfall' | 'passing' | 'departed';
}

interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
  email: string;
  priority: 'high' | 'medium' | 'low';
}

interface Resource {
  name: string;
  quantity: number;
  unit: string;
  status: 'available' | 'low' | 'critical';
  location: string;
}

const Emergency: React.FC = () => {
  const { language } = useLanguage();
  const [emergencyStatus, setEmergencyStatus] = useState<EmergencyStatus>({
    level: 'normal',
    type: 'hurricane',
    message: language === 'es' ? 'Estado normal - Sin emergencias activas' : 'Normal status - No active emergencies',
    timestamp: new Date().toISOString()
  });

  const [hurricaneInfo, setHurricaneInfo] = useState<HurricaneInfo | null>(null);
  const [preparationProgress, setPreparationProgress] = useState(0);
  const [isEvacuationMode, setIsEvacuationMode] = useState(false);

  const emergencyContacts: EmergencyContact[] = [
    {
      name: language === 'es' ? 'Centro de Emergencias' : 'Emergency Center',
      role: language === 'es' ? 'Coordinador Principal' : 'Lead Coordinator',
      phone: '+1-787-555-0001',
      email: 'emergency@prmcms.com',
      priority: 'high'
    },
    {
      name: language === 'es' ? 'Policía Local' : 'Local Police',
      role: language === 'es' ? 'Seguridad' : 'Security',
      phone: '+1-787-555-0002',
      email: 'police@local.gov',
      priority: 'high'
    },
    {
      name: language === 'es' ? 'Bomberos' : 'Fire Department',
      role: language === 'es' ? 'Emergencias' : 'Emergencies',
      phone: '+1-787-555-0003',
      email: 'fire@local.gov',
      priority: 'high'
    },
    {
      name: language === 'es' ? 'Hospital Regional' : 'Regional Hospital',
      role: language === 'es' ? 'Médico' : 'Medical',
      phone: '+1-787-555-0004',
      email: 'hospital@regional.gov',
      priority: 'high'
    }
  ];

  const resources: Resource[] = [
    {
      name: language === 'es' ? 'Generadores' : 'Generators',
      quantity: 3,
      unit: language === 'es' ? 'unidades' : 'units',
      status: 'available',
      location: language === 'es' ? 'Sala de Equipos' : 'Equipment Room'
    },
    {
      name: language === 'es' ? 'Combustible' : 'Fuel',
      quantity: 500,
      unit: 'gal',
      status: 'available',
      location: language === 'es' ? 'Tanque Principal' : 'Main Tank'
    },
    {
      name: language === 'es' ? 'Agua Potable' : 'Drinking Water',
      quantity: 1000,
      unit: 'gal',
      status: 'available',
      location: language === 'es' ? 'Almacén' : 'Warehouse'
    },
    {
      name: language === 'es' ? 'Kits de Emergencia' : 'Emergency Kits',
      quantity: 25,
      unit: language === 'es' ? 'kits' : 'kits',
      status: 'available',
      location: language === 'es' ? 'Sala de Emergencias' : 'Emergency Room'
    }
  ];

  const getStatusColor = (level: EmergencyStatus['level']) => {
    switch (level) {
      case 'normal': return 'bg-green-500';
      case 'watch': return 'bg-yellow-500';
      case 'warning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getHurricaneCategoryColor = (category: number) => {
    switch (category) {
      case 1: return 'bg-blue-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-orange-500';
      case 4: return 'bg-red-500';
      case 5: return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (level: EmergencyStatus['level']) => {
    if (language === 'es') {
      switch (level) {
        case 'normal': return 'Normal';
        case 'watch': return 'Vigilancia';
        case 'warning': return 'Advertencia';
        case 'critical': return 'Crítico';
        default: return 'Desconocido';
      }
    } else {
      switch (level) {
        case 'normal': return 'Normal';
        case 'watch': return 'Watch';
        case 'warning': return 'Warning';
        case 'critical': return 'Critical';
        default: return 'Unknown';
      }
    }
  };

  const evacuationProcedures = [
    {
      step: 1,
      title: language === 'es' ? 'Activar Protocolo de Evacuación' : 'Activate Evacuation Protocol',
      description: language === 'es' ? 'Notificar a todo el personal y clientes' : 'Notify all staff and customers',
      completed: false
    },
    {
      step: 2,
      title: language === 'es' ? 'Asegurar Instalaciones' : 'Secure Facilities',
      description: language === 'es' ? 'Cerrar y proteger todas las entradas' : 'Close and secure all entrances',
      completed: false
    },
    {
      step: 3,
      title: language === 'es' ? 'Evacuar Personal' : 'Evacuate Staff',
      description: language === 'es' ? 'Dirigir al personal a puntos de evacuación' : 'Direct staff to evacuation points',
      completed: false
    },
    {
      step: 4,
      title: language === 'es' ? 'Verificar Evacuación' : 'Verify Evacuation',
      description: language === 'es' ? 'Confirmar que todos han evacuado' : 'Confirm everyone has evacuated',
      completed: false
    }
  ];

  const hurricanePreparationChecklist = [
    {
      category: language === 'es' ? 'Instalaciones' : 'Facilities',
      items: [
        { name: language === 'es' ? 'Cerrar ventanas y puertas' : 'Close windows and doors', completed: false },
        { name: language === 'es' ? 'Asegurar objetos sueltos' : 'Secure loose objects', completed: false },
        { name: language === 'es' ? 'Activar generadores' : 'Activate generators', completed: false },
        { name: language === 'es' ? 'Verificar suministros' : 'Check supplies', completed: false }
      ]
    },
    {
      category: language === 'es' ? 'Comunicaciones' : 'Communications',
      items: [
        { name: language === 'es' ? 'Probar radios de emergencia' : 'Test emergency radios', completed: false },
        { name: language === 'es' ? 'Verificar contactos de emergencia' : 'Verify emergency contacts', completed: false },
        { name: language === 'es' ? 'Configurar alertas automáticas' : 'Set up automatic alerts', completed: false }
      ]
    },
    {
      category: language === 'es' ? 'Personal' : 'Personnel',
      items: [
        { name: language === 'es' ? 'Asignar roles de emergencia' : 'Assign emergency roles', completed: false },
        { name: language === 'es' ? 'Verificar ubicaciones del personal' : 'Verify staff locations', completed: false },
        { name: language === 'es' ? 'Establecer puntos de reunión' : 'Establish meeting points', completed: false }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Emergency Status Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            {language === 'es' ? 'Centro de Emergencias' : 'Emergency Center'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'es' ? 'Gestión integral de emergencias para PRMCMS' : 'Comprehensive emergency management for PRMCMS'}
          </p>
        </div>
        <Badge className={`${getStatusColor(emergencyStatus.level)} text-white px-4 py-2 text-lg`}>
          {getStatusText(emergencyStatus.level)}
        </Badge>
      </div>

      {/* Emergency Alert */}
      {emergencyStatus.level !== 'normal' && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-700">
            {language === 'es' ? 'Alerta de Emergencia Activa' : 'Active Emergency Alert'}
          </AlertTitle>
          <AlertDescription className="text-red-600">
            {emergencyStatus.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Hurricane Tracking */}
      {hurricaneInfo && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
                      <Wind className="h-5 w-5" />
        {language === 'es' ? 'Seguimiento de Huracán' : 'Hurricane Tracking'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold">{hurricaneInfo.name}</h3>
                <Badge className={`${getHurricaneCategoryColor(hurricaneInfo.category)} text-white`}>
                  {language === 'es' ? 'Categoría' : 'Category'} {hurricaneInfo.category}
                </Badge>
              </div>
              <div>
                <p><strong>{language === 'es' ? 'Velocidad del Viento:' : 'Wind Speed:'}</strong> {hurricaneInfo.windSpeed} mph</p>
                <p><strong>{language === 'es' ? 'Distancia:' : 'Distance:'}</strong> {hurricaneInfo.distance} km</p>
              </div>
              <div>
                <p><strong>{language === 'es' ? 'ETA:' : 'ETA:'}</strong> {hurricaneInfo.eta}</p>
                <p><strong>{language === 'es' ? 'Estado:' : 'Status:'}</strong> {hurricaneInfo.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">
            {language === 'es' ? 'Panel' : 'Dashboard'}
          </TabsTrigger>
                  <TabsTrigger value="hurricane">
          <Wind className="h-4 w-4 mr-2" />
          {language === 'es' ? 'Huracanes' : 'Hurricanes'}
        </TabsTrigger>
          <TabsTrigger value="continuity">
            <Database className="h-4 w-4 mr-2" />
            {language === 'es' ? 'Continuidad' : 'Continuity'}
          </TabsTrigger>
          <TabsTrigger value="logistics">
            <Truck className="h-4 w-4 mr-2" />
            {language === 'es' ? 'Logística' : 'Logistics'}
          </TabsTrigger>
          <TabsTrigger value="recovery">
            <CheckCircle className="h-4 w-4 mr-2" />
            {language === 'es' ? 'Recuperación' : 'Recovery'}
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Phone className="h-4 w-4 mr-2" />
            {language === 'es' ? 'Contactos' : 'Contacts'}
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'es' ? 'Estado del Sistema' : 'System Status'}
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {language === 'es' ? 'Operativo' : 'Operational'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'es' ? 'Todos los sistemas funcionando' : 'All systems operational'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'es' ? 'Personal Presente' : 'Staff Present'}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12/15</div>
                <p className="text-xs text-muted-foreground">
                  {language === 'es' ? 'Personal en el sitio' : 'Staff on site'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'es' ? 'Paquetes Críticos' : 'Critical Packages'}
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">3</div>
                <p className="text-xs text-muted-foreground">
                  {language === 'es' ? 'Pendientes de entrega' : 'Pending delivery'}
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
                <div className="text-2xl font-bold text-green-600">
                  {language === 'es' ? 'Activo' : 'Active'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'es' ? 'Red estable' : 'Network stable'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Preparation Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {language === 'es' ? 'Progreso de Preparación' : 'Preparation Progress'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{language === 'es' ? 'Completado' : 'Completed'}</span>
                  <span>{preparationProgress}%</span>
                </div>
                <Progress value={preparationProgress} className="w-full" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Tareas Completadas' : 'Tasks Completed'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'es' ? 'En Progreso' : 'In Progress'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Pendientes' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hurricane Tab */}
        <TabsContent value="hurricane" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hurricane Categories */}
            <Card>
              <CardHeader>
                        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          {language === 'es' ? 'Categorías de Huracanes' : 'Hurricane Categories'}
        </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((category) => (
                    <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getHurricaneCategoryColor(category)}`}></div>
                        <span className="font-medium">
                          {language === 'es' ? 'Categoría' : 'Category'} {category}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {category === 1 && (language === 'es' ? '74-95 mph' : '74-95 mph')}
                        {category === 2 && (language === 'es' ? '96-110 mph' : '96-110 mph')}
                        {category === 3 && (language === 'es' ? '111-129 mph' : '111-129 mph')}
                        {category === 4 && (language === 'es' ? '130-156 mph' : '130-156 mph')}
                        {category === 5 && (language === 'es' ? '157+ mph' : '157+ mph')}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preparation Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {language === 'es' ? 'Lista de Preparación' : 'Preparation Checklist'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hurricanePreparationChecklist.map((category, index) => (
                    <div key={index}>
                      <h4 className="font-semibold mb-2">{category.category}</h4>
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`checklist-${index}-${itemIndex}`}
                              checked={item.completed}
                              onChange={() => {
                                // Handle checkbox change
                              }}
                              className="rounded"
                              aria-label={item.name}
                            />
                            <label 
                              htmlFor={`checklist-${index}-${itemIndex}`}
                              className={item.completed ? 'line-through text-muted-foreground cursor-pointer' : 'cursor-pointer'}
                            >
                              {item.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Evacuation Procedures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {language === 'es' ? 'Procedimientos de Evacuación' : 'Evacuation Procedures'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {evacuationProcedures.map((procedure) => (
                  <div key={procedure.step} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                      {procedure.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{procedure.title}</h4>
                      <p className="text-sm text-muted-foreground">{procedure.description}</p>
                    </div>
                    <Button
                      variant={procedure.completed ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        // Handle procedure completion
                      }}
                    >
                      {procedure.completed ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      {procedure.completed 
                        ? (language === 'es' ? 'Completado' : 'Completed')
                        : (language === 'es' ? 'Marcar' : 'Mark')
                      }
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Continuity Tab */}
        <TabsContent value="continuity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {language === 'es' ? 'Sitio de Respaldo' : 'Backup Site'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>{language === 'es' ? 'Estado del Sitio' : 'Site Status'}</span>
                    <Badge className="bg-green-500 text-white">
                      {language === 'es' ? 'Disponible' : 'Available'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === 'es' ? 'Capacidad de Datos' : 'Data Capacity'}</span>
                    <span>85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === 'es' ? 'Tiempo de Activación' : 'Activation Time'}</span>
                    <span>15 min</span>
                  </div>
                  <Button className="w-full">
                    {language === 'es' ? 'Activar Sitio de Respaldo' : 'Activate Backup Site'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {language === 'es' ? 'Comunicaciones' : 'Communications'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Radio className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Enviar Alerta a Clientes' : 'Send Customer Alert'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Notificar Personal' : 'Notify Staff'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Building className="h-4 w-4 mr-2" />
                    {language === 'es' ? 'Contactar Proveedores' : 'Contact Suppliers'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Emergency Logistics Tab */}
        <TabsContent value="logistics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {language === 'es' ? 'Paquetes Prioritarios' : 'Priority Packages'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">PKG-2024-001</h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es' ? 'Medicamentos Críticos' : 'Critical Medications'}
                      </p>
                    </div>
                    <Badge className="bg-red-500 text-white">
                      {language === 'es' ? 'Urgente' : 'Urgent'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">PKG-2024-002</h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es' ? 'Documentos Legales' : 'Legal Documents'}
                      </p>
                    </div>
                    <Badge className="bg-orange-500 text-white">
                      {language === 'es' ? 'Alta Prioridad' : 'High Priority'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="h-5 w-5" />
                  {language === 'es' ? 'Recursos Críticos' : 'Critical Resources'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{resource.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {resource.quantity} {resource.unit} - {resource.location}
                        </p>
                      </div>
                      <Badge 
                        className={
                          resource.status === 'available' ? 'bg-green-500 text-white' :
                          resource.status === 'low' ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }
                      >
                        {resource.status === 'available' ? (language === 'es' ? 'Disponible' : 'Available') :
                         resource.status === 'low' ? (language === 'es' ? 'Bajo' : 'Low') :
                         (language === 'es' ? 'Crítico' : 'Critical')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recovery Tab */}
        <TabsContent value="recovery" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {language === 'es' ? 'Evaluación de Daños' : 'Damage Assessment'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>{language === 'es' ? 'Estado de la Estructura' : 'Structural Status'}</span>
                    <Badge className="bg-green-500 text-white">
                      {language === 'es' ? 'Seguro' : 'Safe'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === 'es' ? 'Sistemas Eléctricos' : 'Electrical Systems'}</span>
                    <Badge className="bg-yellow-500 text-white">
                      {language === 'es' ? 'Parcial' : 'Partial'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === 'es' ? 'Comunicaciones' : 'Communications'}</span>
                    <Badge className="bg-green-500 text-white">
                      {language === 'es' ? 'Operativo' : 'Operational'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {language === 'es' ? 'Documentación' : 'Documentation'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    {language === 'es' ? 'Generar Reporte de Daños' : 'Generate Damage Report'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    {language === 'es' ? 'Documentar para Seguros' : 'Document for Insurance'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    {language === 'es' ? 'Crear Cronograma de Recuperación' : 'Create Recovery Timeline'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Emergency Contacts Tab */}
        <TabsContent value="contacts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{contact.name}</span>
                    <Badge 
                      className={
                        contact.priority === 'high' ? 'bg-red-500 text-white' :
                        contact.priority === 'medium' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }
                    >
                      {contact.priority === 'high' ? (language === 'es' ? 'Alta' : 'High') :
                       contact.priority === 'medium' ? (language === 'es' ? 'Media' : 'Medium') :
                       (language === 'es' ? 'Baja' : 'Low')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Emergency Actions */}
      <div className="fixed bottom-4 right-4 space-y-2">
        <Button 
          variant="destructive" 
          size="lg"
          onClick={() => setIsEvacuationMode(!isEvacuationMode)}
          className="shadow-lg"
        >
          <AlertTriangle className="h-5 w-5 mr-2" />
          {isEvacuationMode 
            ? (language === 'es' ? 'Cancelar Evacuación' : 'Cancel Evacuation')
            : (language === 'es' ? 'Iniciar Evacuación' : 'Start Evacuation')
          }
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          className="shadow-lg"
        >
          <Settings className="h-5 w-5 mr-2" />
          {language === 'es' ? 'Configuración' : 'Settings'}
        </Button>
      </div>
    </div>
  );
};

export default Emergency; 