import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Wrench,
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Plus,
  FileText,
  Building,
  Tool
} from 'lucide-react';
import { useFacility } from '@/hooks/useFacility';

interface MaintenanceTask {
  id: string;
  asset_id: string;
  asset_name: string;
  asset_type: 'generator' | 'hvac' | 'security' | 'electrical' | 'plumbing';
  maintenance_type: 'preventive' | 'corrective' | 'emergency';
  scheduled_date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  assigned_vendor: string;
  estimated_cost: number;
  actual_cost?: number;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_technician?: string;
  completion_notes?: string;
}

interface Asset {
  id: string;
  name: string;
  type: 'generator' | 'hvac' | 'security' | 'electrical' | 'plumbing';
  location: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  installation_date: string;
  warranty_expiry: string;
  last_maintenance: string;
  next_maintenance: string;
  status: 'operational' | 'maintenance' | 'retired' | 'critical';
  lifecycle_stage: 'new' | 'operational' | 'aging' | 'end_of_life';
  estimated_lifespan: number; // years
  current_age: number; // years
}

interface Vendor {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  specialties: string[];
  rating: number; // 1-5
  total_projects: number;
  average_response_time: number; // hours
  contract_expiry: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface WorkOrder {
  id: string;
  title: string;
  description: string;
  asset_id: string;
  asset_name: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to: string;
  created_date: string;
  due_date: string;
  completed_date?: string;
  estimated_hours: number;
  actual_hours?: number;
  materials_cost: number;
  labor_cost: number;
  total_cost: number;
}

export function MaintenanceScheduler() {
  const {
    maintenanceSchedule,
    loading,
    getOverdueMaintenance,
    getUpcomingMaintenance
  } = useFacility();

  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Mock data for demonstration
  const mockAssets: Asset[] = [
    {
      id: '1',
      name: 'Main Generator',
      type: 'generator',
      location: 'San Juan Main',
      manufacturer: 'Cummins',
      model: 'C1100D5',
      serial_number: 'CUMM-2024-001',
      installation_date: '2020-03-15',
      warranty_expiry: '2025-03-15',
      last_maintenance: '2024-01-15',
      next_maintenance: '2024-04-15',
      status: 'operational',
      lifecycle_stage: 'operational',
      estimated_lifespan: 15,
      current_age: 4
    },
    {
      id: '2',
      name: 'Central AC Unit',
      type: 'hvac',
      location: 'San Juan Main',
      manufacturer: 'Carrier',
      model: '48TC',
      serial_number: 'CARR-2023-045',
      installation_date: '2023-06-20',
      warranty_expiry: '2026-06-20',
      last_maintenance: '2024-02-20',
      next_maintenance: '2024-05-20',
      status: 'maintenance',
      lifecycle_stage: 'new',
      estimated_lifespan: 12,
      current_age: 1
    }
  ];

  const mockVendors: Vendor[] = [
    {
      id: '1',
      name: 'Power Systems PR',
      contact_person: 'Roberto Martínez',
      phone: '+1-787-555-0201',
      email: 'roberto@powersystemspr.com',
      specialties: ['generators', 'electrical'],
      rating: 4.8,
      total_projects: 45,
      average_response_time: 4,
      contract_expiry: '2024-12-31',
      status: 'active'
    },
    {
      id: '2',
      name: 'Climate Control Solutions',
      contact_person: 'Ana Rodríguez',
      phone: '+1-787-555-0202',
      email: 'ana@climatecontrolpr.com',
      specialties: ['hvac', 'plumbing'],
      rating: 4.5,
      total_projects: 32,
      average_response_time: 6,
      contract_expiry: '2024-10-15',
      status: 'active'
    }
  ];

  const mockWorkOrders: WorkOrder[] = [
    {
      id: '1',
      title: 'Generator Annual Maintenance',
      description: 'Complete annual maintenance including oil change, filter replacement, and system testing',
      asset_id: '1',
      asset_name: 'Main Generator',
      priority: 'high',
      status: 'assigned',
      assigned_to: 'Power Systems PR',
      created_date: '2024-03-10',
      due_date: '2024-04-15',
      estimated_hours: 8,
      materials_cost: 500,
      labor_cost: 1200,
      total_cost: 1700
    },
    {
      id: '2',
      title: 'AC Filter Replacement',
      description: 'Replace air filters and clean condenser coils',
      asset_id: '2',
      asset_name: 'Central AC Unit',
      priority: 'medium',
      status: 'open',
      assigned_to: 'Climate Control Solutions',
      created_date: '2024-03-12',
      due_date: '2024-03-25',
      estimated_hours: 4,
      materials_cost: 150,
      labor_cost: 400,
      total_cost: 550
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando programación de mantenimiento...</p>
        </div>
      </div>
    );
  }

  const overdueMaintenance = getOverdueMaintenance();
  const upcomingMaintenance = getUpcomingMaintenance(7);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssetStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {overdueMaintenance.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Mantenimiento Vencido:</strong> {overdueMaintenance.length} tareas de mantenimiento están vencidas y requieren atención inmediata.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="workorders">Órdenes de Trabajo</TabsTrigger>
          <TabsTrigger value="assets">Activos</TabsTrigger>
          <TabsTrigger value="vendors">Proveedores</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          {/* Maintenance Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Calendario de Mantenimiento Preventivo
              </CardTitle>
              <CardDescription>
                Programación y seguimiento de tareas de mantenimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Upcoming Maintenance */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Próximo Mantenimiento (7 días)
                  </h4>
                  <div className="space-y-3">
                    {upcomingMaintenance.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{task.asset_name}</h5>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority === 'critical' ? 'Crítico' :
                             task.priority === 'high' ? 'Alto' :
                             task.priority === 'medium' ? 'Medio' : 'Bajo'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {task.description}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Fecha:</span>
                            <div className="font-medium">{new Date(task.scheduled_date).toLocaleDateString('es-PR')}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Proveedor:</span>
                            <div className="font-medium">{task.assigned_vendor}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Costo Estimado:</span>
                            <div className="font-medium">${task.estimated_cost.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Estado:</span>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status === 'scheduled' ? 'Programado' :
                               task.status === 'in_progress' ? 'En Progreso' :
                               task.status === 'completed' ? 'Completado' : 'Vencido'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overdue Maintenance */}
                {overdueMaintenance.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center text-red-600">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Mantenimiento Vencido
                    </h4>
                    <div className="space-y-3">
                      {overdueMaintenance.map((task) => (
                        <div key={task.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-red-800">{task.asset_name}</h5>
                            <Badge className="bg-red-100 text-red-800">
                              Vencido
                            </Badge>
                          </div>
                          <div className="text-sm text-red-700 mb-2">
                            {task.description}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div>
                              <span className="text-red-600">Fecha Vencida:</span>
                              <div className="font-medium text-red-800">{new Date(task.scheduled_date).toLocaleDateString('es-PR')}</div>
                            </div>
                            <div>
                              <span className="text-red-600">Proveedor:</span>
                              <div className="font-medium text-red-800">{task.assigned_vendor}</div>
                            </div>
                            <div>
                              <span className="text-red-600">Costo Estimado:</span>
                              <div className="font-medium text-red-800">${task.estimated_cost.toLocaleString()}</div>
                            </div>
                            <div>
                              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                Programar Ahora
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workorders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Órdenes de Trabajo
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Orden
                </Button>
              </CardTitle>
              <CardDescription>
                Gestión de órdenes de trabajo y asignaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockWorkOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{order.title}</h4>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority === 'critical' ? 'Crítico' :
                         order.priority === 'high' ? 'Alto' :
                         order.priority === 'medium' ? 'Medio' : 'Bajo'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-3">
                      {order.description}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Activo</div>
                        <div className="font-medium">{order.asset_name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Asignado a</div>
                        <div className="font-medium">{order.assigned_to}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Fecha de Vencimiento</div>
                        <div className="font-medium">{new Date(order.due_date).toLocaleDateString('es-PR')}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Estado</div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status === 'open' ? 'Abierta' :
                           order.status === 'assigned' ? 'Asignada' :
                           order.status === 'in_progress' ? 'En Progreso' :
                           order.status === 'completed' ? 'Completada' : 'Cancelada'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Horas Estimadas</div>
                        <div className="font-medium">{order.estimated_hours}h</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Costo Total</div>
                        <div className="font-medium">${order.total_cost.toLocaleString()}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Ver Detalles</Button>
                        <Button size="sm" variant="outline">Actualizar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Gestión de Activos
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Activo
                </Button>
              </CardTitle>
              <CardDescription>
                Inventario y ciclo de vida de equipos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAssets.map((asset) => (
                  <div key={asset.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{asset.name}</h4>
                      <Badge className={getAssetStatusColor(asset.status)}>
                        {asset.status === 'operational' ? 'Operacional' :
                         asset.status === 'maintenance' ? 'Mantenimiento' :
                         asset.status === 'critical' ? 'Crítico' : 'Retirado'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Ubicación</div>
                        <div className="font-medium">{asset.location}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Fabricante</div>
                        <div className="font-medium">{asset.manufacturer}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Modelo</div>
                        <div className="font-medium">{asset.model}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Número de Serie</div>
                        <div className="font-medium">{asset.serial_number}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Fecha de Instalación</div>
                        <div className="font-medium">{new Date(asset.installation_date).toLocaleDateString('es-PR')}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Garantía Vence</div>
                        <div className="font-medium">{new Date(asset.warranty_expiry).toLocaleDateString('es-PR')}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Próximo Mantenimiento</div>
                        <div className="font-medium">{new Date(asset.next_maintenance).toLocaleDateString('es-PR')}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Ciclo de Vida</div>
                        <div className="font-medium capitalize">{asset.lifecycle_stage}</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Ver Historial</Button>
                      <Button size="sm" variant="outline">Programar Mantenimiento</Button>
                      <Button size="sm" variant="outline">Editar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Gestión de Proveedores
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Proveedor
                </Button>
              </CardTitle>
              <CardDescription>
                Proveedores de servicios de mantenimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVendors.map((vendor) => (
                  <div key={vendor.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{vendor.name}</h4>
                      <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                        {vendor.status === 'active' ? 'Activo' :
                         vendor.status === 'inactive' ? 'Inactivo' : 'Suspendido'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Contacto</div>
                        <div className="font-medium">{vendor.contact_person}</div>
                        <div className="text-sm text-muted-foreground">{vendor.phone}</div>
                        <div className="text-sm text-muted-foreground">{vendor.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Especialidades</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {vendor.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Rendimiento</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="text-lg font-semibold">{vendor.rating}/5</div>
                          <div className="text-sm text-muted-foreground">
                            ({vendor.total_projects} proyectos)
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Respuesta: {vendor.average_response_time}h
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Contrato vence: {new Date(vendor.contract_expiry).toLocaleDateString('es-PR')}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Ver Contrato</Button>
                        <Button size="sm" variant="outline">Contactar</Button>
                        <Button size="sm" variant="outline">Editar</Button>
                      </div>
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