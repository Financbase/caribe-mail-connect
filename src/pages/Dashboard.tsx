import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Users, 
  Mail, 
  BarChart3, 
  Truck, 
  MessageSquare, 
  Store, 
  Smartphone, 
  Zap, 
  UserCheck, 
  GraduationCap, 
  Code, 
  Shield, 
  Navigation 
} from 'lucide-react';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.hash = `#/${page}`;
    }
  };

  const dashboardItems = [
    { id: 'package-intake', icon: Package, label: 'Entrada de Paquetes', description: 'Registrar nuevos paquetes' },
    { id: 'customers', icon: Users, label: 'Clientes', description: 'Gestión de clientes' },
    { id: 'mailboxes', icon: Mail, label: 'Buzones', description: 'Gestión de buzones' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', description: 'Reportes y análisis' },
    { id: 'routes', icon: Truck, label: 'Rutas', description: 'Gestión de rutas' },
    { id: 'last-mile', icon: Navigation, label: 'Last-Mile', description: 'Entrega final' },
    { id: 'communications', icon: MessageSquare, label: 'Comunicaciones', description: 'Mensajes y notificaciones' },
    { id: 'marketplace', icon: Store, label: 'Marketplace', description: 'Tienda y servicios' },
    { id: 'devices', icon: Smartphone, label: 'Dispositivos', description: 'Gestión de dispositivos' },
    { id: 'iot-monitoring', icon: Zap, label: 'IoT', description: 'Monitoreo IoT' },
    { id: 'employees', icon: UserCheck, label: 'Empleados', description: 'Gestión de empleados' },
    { id: 'training', icon: GraduationCap, label: 'Capacitación', description: 'Programas de entrenamiento' },
    { id: 'qa', icon: Shield, label: 'QA', description: 'Control de calidad' },
    { id: 'developers', icon: Code, label: 'Desarrolladores', description: 'Herramientas de desarrollo' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary">Panel de Control</h1>
          <p className="text-muted-foreground">Bienvenido al sistema de gestión de correo privado de Puerto Rico</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paquetes Hoy</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+12% desde ayer</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+3 nuevos esta semana</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregas Pendientes</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">-2 desde ayer</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dashboardItems.map((item) => (
            <Card 
              key={item.id}
              className="cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-elegant"
              onClick={() => handleNavigation(item.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas actividades del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Package className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nuevo paquete registrado</p>
                  <p className="text-xs text-muted-foreground">Tracking: TEST123456789 - Hace 5 minutos</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Users className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nuevo cliente registrado</p>
                  <p className="text-xs text-muted-foreground">Juan Pérez - Hace 15 minutos</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Truck className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Entrega completada</p>
                  <p className="text-xs text-muted-foreground">Tracking: TEST987654321 - Hace 1 hora</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}