import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Database, 
  Settings,
  FileText,
  Shield,
  TrendingUp,
  Server,
  HardDrive,
  Wifi,
  Clock
} from 'lucide-react';
import { MobileHeader } from '@/components/MobileHeader';
import { UserManagement } from '@/components/admin/UserManagement';
import { SystemConfig } from '@/components/admin/SystemConfig';
import { DataManagement } from '@/components/admin/DataManagement';
import { AuditLogs } from '@/components/admin/AuditLogs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminProps {
  onNavigate: (page: string) => void;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  activeUsers: number;
  errorCount: number;
  responseTime: number;
  storageUsed: number;
  storageTotal: number;
}

export default function Admin({ onNavigate }: AdminProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check admin access
  useEffect(() => {
    checkAdminAccess();
    fetchSystemHealth();
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      const { data: profileData } = await supabase
        .rpc('get_user_profile', { _user_id: user?.id });

      if (!profileData || !Array.isArray(profileData) || profileData.length === 0) {
        toast({
          title: 'Acceso Denegado',
          description: 'No tienes permisos para acceder al panel de administración',
          variant: 'destructive',
        });
        onNavigate('dashboard');
        return;
      }

      const profile = profileData[0];
      if (profile.role !== 'admin' && profile.role !== 'manager') {
        toast({
          title: 'Acceso Denegado',
          description: 'No tienes permisos para acceder al panel de administración',
          variant: 'destructive',
        });
        onNavigate('dashboard');
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      onNavigate('dashboard');
    }
  };

  const fetchSystemHealth = async () => {
    try {
      setLoading(true);
      
      // Mock system health data - in production, these would come from monitoring APIs
      const health: SystemHealth = {
        status: 'healthy',
        uptime: 99.8,
        activeUsers: 24,
        errorCount: 2,
        responseTime: 145,
        storageUsed: 2.1,
        storageTotal: 10.0,
      };

      setSystemHealth(health);
    } catch (error) {
      console.error('Error fetching system health:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <MobileHeader title="Panel de Administración" />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Admin Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Panel</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
            <TabsTrigger value="data">Datos</TabsTrigger>
            <TabsTrigger value="audit">Auditoría</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-elegant">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(systemHealth?.status || 'healthy')}>
                      {systemHealth?.status === 'healthy' ? 'Saludable' : 
                       systemHealth?.status === 'warning' ? 'Advertencia' : 'Crítico'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Uptime: {systemHealth?.uptime}%
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {systemHealth?.activeUsers || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Conectados ahora
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tiempo de Respuesta</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {systemHealth?.responseTime}ms
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Promedio últimas 24h
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Almacenamiento</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {systemHealth?.storageUsed}GB
                  </div>
                  <p className="text-xs text-muted-foreground">
                    de {systemHealth?.storageTotal}GB usados
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Tareas administrativas comunes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setActiveTab('users')}
                  >
                    <Users className="h-6 w-6 mb-2" />
                    Gestionar Usuarios
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setActiveTab('data')}
                  >
                    <Database className="h-6 w-6 mb-2" />
                    Exportar Datos
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setActiveTab('system')}
                  >
                    <Settings className="h-6 w-6 mb-2" />
                    Configuración
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setActiveTab('audit')}
                  >
                    <Shield className="h-6 w-6 mb-2" />
                    Ver Auditoría
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas acciones en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-3 bg-accent/10 rounded-lg">
                        <Activity className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Usuario creó nueva factura #{1000 + i}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Hace {i + 1} hora{i > 0 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Alertas del Sistema</CardTitle>
                  <CardDescription>Notificaciones importantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-yellow-100 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800">
                          Backup programado en 2 horas
                        </p>
                        <p className="text-xs text-yellow-600">
                          Verificar espacio disponible
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">
                          Sistema funcionando óptimamente
                        </p>
                        <p className="text-xs text-green-600">
                          Todos los servicios operativos
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="system">
            <SystemConfig />
          </TabsContent>

          <TabsContent value="data">
            <DataManagement />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}