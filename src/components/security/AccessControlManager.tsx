import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Shield, 
  Clock, 
  Globe, 
  Key, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TimeBasedRule {
  id: string;
  name: string;
  role_id: string;
  days_of_week: number[];
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean;
}

interface IPWhitelist {
  id: string;
  ip_address: string;
  ip_range?: string;
  description: string;
  role_id?: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

interface APIToken {
  id: string;
  name: string;
  token: string;
  permissions: string[];
  role_id?: string;
  is_active: boolean;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
}

const PERMISSIONS: Permission[] = [
  // User Management
  { id: 'users.read', name: 'Ver Usuarios', description: 'Ver lista de usuarios', category: 'Usuarios', resource: 'users', action: 'read' },
  { id: 'users.create', name: 'Crear Usuarios', description: 'Crear nuevos usuarios', category: 'Usuarios', resource: 'users', action: 'create' },
  { id: 'users.update', name: 'Editar Usuarios', description: 'Modificar usuarios existentes', category: 'Usuarios', resource: 'users', action: 'update' },
  { id: 'users.delete', name: 'Eliminar Usuarios', description: 'Eliminar usuarios', category: 'Usuarios', resource: 'users', action: 'delete' },
  
  // Mail Management
  { id: 'mail.read', name: 'Ver Correo', description: 'Ver correo y paquetes', category: 'Correo', resource: 'mail', action: 'read' },
  { id: 'mail.create', name: 'Crear Correo', description: 'Registrar nuevo correo', category: 'Correo', resource: 'mail', action: 'create' },
  { id: 'mail.update', name: 'Editar Correo', description: 'Modificar correo existente', category: 'Correo', resource: 'mail', action: 'update' },
  { id: 'mail.delete', name: 'Eliminar Correo', description: 'Eliminar correo', category: 'Correo', resource: 'mail', action: 'delete' },
  
  // Customer Management
  { id: 'customers.read', name: 'Ver Clientes', description: 'Ver información de clientes', category: 'Clientes', resource: 'customers', action: 'read' },
  { id: 'customers.create', name: 'Crear Clientes', description: 'Crear nuevos clientes', category: 'Clientes', resource: 'customers', action: 'create' },
  { id: 'customers.update', name: 'Editar Clientes', description: 'Modificar clientes', category: 'Clientes', resource: 'customers', action: 'update' },
  { id: 'customers.delete', name: 'Eliminar Clientes', description: 'Eliminar clientes', category: 'Clientes', resource: 'customers', action: 'delete' },
  
  // Billing
  { id: 'billing.read', name: 'Ver Facturación', description: 'Ver facturas y pagos', category: 'Facturación', resource: 'billing', action: 'read' },
  { id: 'billing.create', name: 'Crear Facturas', description: 'Generar nuevas facturas', category: 'Facturación', resource: 'billing', action: 'create' },
  { id: 'billing.update', name: 'Editar Facturas', description: 'Modificar facturas', category: 'Facturación', resource: 'billing', action: 'update' },
  { id: 'billing.delete', name: 'Eliminar Facturas', description: 'Eliminar facturas', category: 'Facturación', resource: 'billing', action: 'delete' },
  
  // Reports
  { id: 'reports.read', name: 'Ver Reportes', description: 'Ver reportes y estadísticas', category: 'Reportes', resource: 'reports', action: 'read' },
  { id: 'reports.create', name: 'Crear Reportes', description: 'Generar nuevos reportes', category: 'Reportes', resource: 'reports', action: 'create' },
  { id: 'reports.export', name: 'Exportar Reportes', description: 'Exportar reportes', category: 'Reportes', resource: 'reports', action: 'export' },
  
  // Security
  { id: 'security.read', name: 'Ver Seguridad', description: 'Ver configuración de seguridad', category: 'Seguridad', resource: 'security', action: 'read' },
  { id: 'security.update', name: 'Editar Seguridad', description: 'Modificar configuración de seguridad', category: 'Seguridad', resource: 'security', action: 'update' },
  { id: 'security.admin', name: 'Admin Seguridad', description: 'Acceso completo a seguridad', category: 'Seguridad', resource: 'security', action: 'admin' },
  
  // System
  { id: 'system.read', name: 'Ver Sistema', description: 'Ver configuración del sistema', category: 'Sistema', resource: 'system', action: 'read' },
  { id: 'system.update', name: 'Editar Sistema', description: 'Modificar configuración del sistema', category: 'Sistema', resource: 'system', action: 'update' },
  { id: 'system.admin', name: 'Admin Sistema', description: 'Acceso completo al sistema', category: 'Sistema', resource: 'system', action: 'admin' },
];

export function AccessControlManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [timeBasedRules, setTimeBasedRules] = useState<TimeBasedRule[]>([]);
  const [ipWhitelist, setIpWhitelist] = useState<IPWhitelist[]>([]);
  const [apiTokens, setApiTokens] = useState<APIToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showCreateToken, setShowCreateToken] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: [] as string[] });
  const [newToken, setNewToken] = useState({ name: '', permissions: [] as string[], expires_at: '' });

  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data for now
      setRoles([
        {
          id: '1',
          name: 'Administrador',
          description: 'Acceso completo al sistema',
          permissions: PERMISSIONS.map(p => p.id),
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Operador',
          description: 'Operaciones diarias de correo',
          permissions: ['mail.read', 'mail.create', 'mail.update', 'customers.read', 'customers.update'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Cliente',
          description: 'Acceso limitado para clientes',
          permissions: ['mail.read', 'customers.read'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]);

      setTimeBasedRules([
        {
          id: '1',
          name: 'Horario Laboral',
          role_id: '2',
          days_of_week: [1, 2, 3, 4, 5], // Monday to Friday
          start_time: '08:00',
          end_time: '17:00',
          timezone: 'America/Puerto_Rico',
          is_active: true,
        }
      ]);

      setIpWhitelist([
        {
          id: '1',
          ip_address: '192.168.1.100',
          description: 'Oficina principal',
          is_active: true,
          created_at: new Date().toISOString(),
        }
      ]);

      setApiTokens([
        {
          id: '1',
          name: 'API Cliente Principal',
          token: 'sk_live_1234567890abcdef',
          permissions: ['mail.read', 'customers.read'],
          is_active: true,
          created_at: new Date().toISOString(),
        }
      ]);
    } catch (error) {
      console.error('Error fetching access control data:', error);
      toast.error('Error al cargar datos de control de acceso');
    } finally {
      setLoading(false);
    }
  };

  const createRole = async () => {
    if (!newRole.name.trim()) {
      toast.error('El nombre del rol es requerido');
      return;
    }

    try {
      const role: Role = {
        id: Date.now().toString(),
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setRoles([...roles, role]);
      setNewRole({ name: '', description: '', permissions: [] });
      setShowCreateRole(false);
      toast.success('Rol creado exitosamente');
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Error al crear el rol');
    }
  };

  const createAPIToken = async () => {
    if (!newToken.name.trim()) {
      toast.error('El nombre del token es requerido');
      return;
    }

    try {
      const token: APIToken = {
        id: Date.now().toString(),
        name: newToken.name,
        token: `sk_live_${Math.random().toString(36).substr(2, 32)}`,
        permissions: newToken.permissions,
        is_active: true,
        expires_at: newToken.expires_at || undefined,
        created_at: new Date().toISOString(),
      };

      setApiTokens([...apiTokens, token]);
      setNewToken({ name: '', permissions: [], expires_at: '' });
      setShowCreateToken(false);
      toast.success('Token API creado exitosamente');
    } catch (error) {
      console.error('Error creating API token:', error);
      toast.error('Error al crear el token API');
    }
  };

  const togglePermission = (permissionId: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const toggleTokenPermission = (permissionId: string) => {
    setNewToken(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const groupedPermissions = PERMISSIONS.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
          <TabsTrigger value="time-rules">Reglas Temporales</TabsTrigger>
          <TabsTrigger value="ip-control">Control IP</TabsTrigger>
          <TabsTrigger value="api-tokens">Tokens API</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Gestión de Roles y Permisos</h2>
              <p className="text-muted-foreground">
                Configura roles con permisos granulares para control de acceso
              </p>
            </div>
            <Dialog open={showCreateRole} onOpenChange={setShowCreateRole}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Rol
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Rol</DialogTitle>
                  <DialogDescription>
                    Define un nuevo rol con permisos específicos
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="role-name">Nombre del Rol</Label>
                    <Input
                      id="role-name"
                      value={newRole.name}
                      onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Operador Senior"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role-description">Descripción</Label>
                    <Textarea
                      id="role-description"
                      value={newRole.description}
                      onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe las responsabilidades de este rol"
                    />
                  </div>
                  <div>
                    <Label>Permisos</Label>
                    <div className="space-y-4 mt-2">
                      {Object.entries(groupedPermissions).map(([category, permissions]) => (
                        <div key={category} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">{category}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {permissions.map((permission) => (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <Switch
                                  checked={newRole.permissions.includes(permission.id)}
                                  onCheckedChange={() => togglePermission(permission.id)}
                                />
                                <div>
                                  <p className="text-sm font-medium">{permission.name}</p>
                                  <p className="text-xs text-muted-foreground">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateRole(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={createRole}>
                    Crear Rol
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <Badge variant={role.is_active ? 'default' : 'secondary'}>
                      {role.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {role.permissions.length} permisos asignados
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permissionId) => {
                        const permission = PERMISSIONS.find(p => p.id === permissionId);
                        return permission ? (
                          <Badge key={permissionId} variant="outline" className="text-xs">
                            {permission.name}
                          </Badge>
                        ) : null;
                      })}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="time-rules" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Reglas de Acceso Temporal</h2>
              <p className="text-muted-foreground">
                Define cuándo los usuarios pueden acceder al sistema
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Regla
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {timeBasedRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{rule.name}</CardTitle>
                    <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                      {rule.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {rule.start_time} - {rule.end_time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {rule.days_of_week.map(day => daysOfWeek[day]).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{rule.timezone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ip-control" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Control de Acceso por IP</h2>
              <p className="text-muted-foreground">
                Gestiona listas blancas y negras de direcciones IP
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar IP
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ipWhitelist.map((ip) => (
              <Card key={ip.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono">{ip.ip_address}</CardTitle>
                    <Badge variant={ip.is_active ? 'default' : 'secondary'}>
                      {ip.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{ip.description}</p>
                  {ip.expires_at && (
                    <p className="text-xs text-muted-foreground">
                      Expira: {new Date(ip.expires_at).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api-tokens" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Tokens de API</h2>
              <p className="text-muted-foreground">
                Gestiona tokens de acceso para integraciones externas
              </p>
            </div>
            <Dialog open={showCreateToken} onOpenChange={setShowCreateToken}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Token
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Token de API</DialogTitle>
                  <DialogDescription>
                    Genera un nuevo token para acceso programático
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="token-name">Nombre del Token</Label>
                    <Input
                      id="token-name"
                      value={newToken.name}
                      onChange={(e) => setNewToken(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Integración Cliente Principal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="token-expires">Fecha de Expiración (Opcional)</Label>
                    <Input
                      id="token-expires"
                      type="datetime-local"
                      value={newToken.expires_at}
                      onChange={(e) => setNewToken(prev => ({ ...prev, expires_at: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Permisos del Token</Label>
                    <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                      {PERMISSIONS.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Switch
                            checked={newToken.permissions.includes(permission.id)}
                            onCheckedChange={() => toggleTokenPermission(permission.id)}
                          />
                          <div>
                            <p className="text-sm font-medium">{permission.name}</p>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateToken(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={createAPIToken}>
                    Crear Token
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {apiTokens.map((token) => (
              <Card key={token.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{token.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={token.is_active ? 'default' : 'secondary'}>
                        {token.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Token</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={token.token}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="sm">
                          Copiar
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Permisos</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {token.permissions.map((permissionId) => {
                          const permission = PERMISSIONS.find(p => p.id === permissionId);
                          return permission ? (
                            <Badge key={permissionId} variant="outline" className="text-xs">
                              {permission.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Creado: {new Date(token.created_at).toLocaleDateString()}</span>
                      {token.last_used_at && (
                        <span>Último uso: {new Date(token.last_used_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 