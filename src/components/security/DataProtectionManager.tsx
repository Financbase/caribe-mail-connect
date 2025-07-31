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
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Database, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff,
  Calendar,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Plus,
  Settings,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface EncryptionStatus {
  table_name: string;
  encrypted_columns: string[];
  encryption_type: 'AES-256' | 'AES-128' | 'ChaCha20' | 'none';
  key_rotation_date: string;
  next_rotation_date: string;
  status: 'encrypted' | 'partially_encrypted' | 'not_encrypted';
}

interface PIIDataMapping {
  table_name: string;
  column_name: string;
  data_type: 'email' | 'phone' | 'address' | 'ssn' | 'credit_card' | 'name' | 'other';
  sensitivity_level: 'low' | 'medium' | 'high' | 'critical';
  retention_period: number; // days
  anonymization_method?: string;
  is_encrypted: boolean;
  last_audit: string;
}

interface RetentionPolicy {
  id: string;
  name: string;
  description: string;
  table_name: string;
  retention_period: number; // days
  action: 'delete' | 'archive' | 'anonymize';
  conditions: Record<string, unknown>;
  is_active: boolean;
  last_execution?: string;
  next_execution: string;
  created_at: string;
}

interface DataPurgeJob {
  id: string;
  name: string;
  description: string;
  policy_id: string;
  status: 'scheduled' | 'running' | 'completed' | 'failed';
  records_affected: number;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  created_at: string;
}

interface GDPRRequest {
  id: string;
  user_id: string;
  user_email: string;
  request_type: 'export' | 'deletion' | 'portability' | 'rectification';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requested_data: Record<string, unknown>;
  processed_by?: string;
  processed_at?: string;
  completion_date?: string;
  export_url?: string;
  notes?: string;
  created_at: string;
}

const SENSITIVITY_LEVELS = [
  { value: 'low', label: 'Baja', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Crítica', color: 'bg-red-100 text-red-800' }
];

const DATA_TYPES = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Teléfono', icon: Phone },
  { value: 'address', label: 'Dirección', icon: MapPin },
  { value: 'ssn', label: 'SSN', icon: User },
  { value: 'credit_card', label: 'Tarjeta de Crédito', icon: CreditCard },
  { value: 'name', label: 'Nombre', icon: User },
  { value: 'other', label: 'Otro', icon: FileText }
];

export function DataProtectionManager() {
  const [encryptionStatus, setEncryptionStatus] = useState<EncryptionStatus[]>([]);
  const [piiDataMapping, setPiiDataMapping] = useState<PIIDataMapping[]>([]);
  const [retentionPolicies, setRetentionPolicies] = useState<RetentionPolicy[]>([]);
  const [purgeJobs, setPurgeJobs] = useState<DataPurgeJob[]>([]);
  const [gdprRequests, setGdprRequests] = useState<GDPRRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreatePolicy, setShowCreatePolicy] = useState(false);
  const [showPIIMapping, setShowPIIMapping] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    description: '',
    table_name: '',
    retention_period: 365,
    action: 'delete' as 'delete' | 'archive' | 'anonymize'
  });

  useEffect(() => {
    fetchDataProtectionData();
  }, []);

  const fetchDataProtectionData = async () => {
    setLoading(true);
    try {
      // Mock encryption status
      setEncryptionStatus([
        {
          table_name: 'users',
          encrypted_columns: ['password_hash', 'ssn', 'credit_card_number'],
          encryption_type: 'AES-256',
          key_rotation_date: '2024-01-01',
          next_rotation_date: '2024-07-01',
          status: 'encrypted'
        },
        {
          table_name: 'customers',
          encrypted_columns: ['email', 'phone'],
          encryption_type: 'AES-256',
          key_rotation_date: '2024-01-01',
          next_rotation_date: '2024-07-01',
          status: 'partially_encrypted'
        },
        {
          table_name: 'audit_logs',
          encrypted_columns: [],
          encryption_type: 'none',
          key_rotation_date: '',
          next_rotation_date: '',
          status: 'not_encrypted'
        }
      ]);

      // Mock PII data mapping
      setPiiDataMapping([
        {
          table_name: 'users',
          column_name: 'email',
          data_type: 'email',
          sensitivity_level: 'high',
          retention_period: 2555, // 7 years
          is_encrypted: true,
          last_audit: '2024-01-15'
        },
        {
          table_name: 'users',
          column_name: 'ssn',
          data_type: 'ssn',
          sensitivity_level: 'critical',
          retention_period: 2555,
          anonymization_method: 'hash',
          is_encrypted: true,
          last_audit: '2024-01-15'
        },
        {
          table_name: 'customers',
          column_name: 'phone',
          data_type: 'phone',
          sensitivity_level: 'medium',
          retention_period: 1825, // 5 years
          is_encrypted: true,
          last_audit: '2024-01-10'
        }
      ]);

      // Mock retention policies
      setRetentionPolicies([
        {
          id: '1',
          name: 'Política de Usuarios Inactivos',
          description: 'Eliminar usuarios inactivos por más de 2 años',
          table_name: 'users',
          retention_period: 730,
          action: 'delete',
          conditions: { last_login: '2_years_ago' },
          is_active: true,
          next_execution: '2024-02-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Archivo de Logs Antiguos',
          description: 'Archivar logs de auditoría de más de 1 año',
          table_name: 'audit_logs',
          retention_period: 365,
          action: 'archive',
          conditions: { created_at: '1_year_ago' },
          is_active: true,
          next_execution: '2024-01-20T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z'
        }
      ]);

      // Mock purge jobs
      setPurgeJobs([
        {
          id: '1',
          name: 'Limpieza de Usuarios Inactivos',
          description: 'Eliminación programada de usuarios inactivos',
          policy_id: '1',
          status: 'completed',
          records_affected: 45,
          started_at: '2024-01-15T02:00:00Z',
          completed_at: '2024-01-15T02:15:00Z',
          created_at: '2024-01-15T02:00:00Z'
        },
        {
          id: '2',
          name: 'Archivo de Logs',
          description: 'Archivado de logs antiguos',
          policy_id: '2',
          status: 'scheduled',
          records_affected: 0,
          created_at: '2024-01-16T00:00:00Z'
        }
      ]);

      // Mock GDPR requests
      setGdprRequests([
        {
          id: '1',
          user_id: 'user1',
          user_email: 'customer@example.com',
          request_type: 'export',
          status: 'completed',
          requested_data: { tables: ['users', 'customers'] },
          processed_by: 'admin@prmcms.com',
          processed_at: '2024-01-15T10:00:00Z',
          completion_date: '2024-01-15T10:30:00Z',
          export_url: 'https://example.com/export/user1_data.zip',
          created_at: '2024-01-14T15:00:00Z'
        },
        {
          id: '2',
          user_id: 'user2',
          user_email: 'another@example.com',
          request_type: 'deletion',
          status: 'pending',
          requested_data: { reason: 'Account closure' },
          created_at: '2024-01-16T09:00:00Z'
        }
      ]);
    } catch (error) {
      console.error('Error fetching data protection data:', error);
      toast.error('Error al cargar datos de protección');
    } finally {
      setLoading(false);
    }
  };

  const createRetentionPolicy = async () => {
    if (!newPolicy.name.trim() || !newPolicy.table_name.trim()) {
      toast.error('Nombre y tabla son requeridos');
      return;
    }

    try {
      const policy: RetentionPolicy = {
        id: Date.now().toString(),
        name: newPolicy.name,
        description: newPolicy.description,
        table_name: newPolicy.table_name,
        retention_period: newPolicy.retention_period,
        action: newPolicy.action,
        conditions: {},
        is_active: true,
        next_execution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      };

      setRetentionPolicies([...retentionPolicies, policy]);
      setNewPolicy({ name: '', description: '', table_name: '', retention_period: 365, action: 'delete' });
      setShowCreatePolicy(false);
      toast.success('Política de retención creada exitosamente');
    } catch (error) {
      console.error('Error creating retention policy:', error);
      toast.error('Error al crear la política de retención');
    }
  };

  const getEncryptionStatusColor = (status: string) => {
    switch (status) {
      case 'encrypted': return 'text-green-600 bg-green-100';
      case 'partially_encrypted': return 'text-yellow-600 bg-yellow-100';
      case 'not_encrypted': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSensitivityLevelColor = (level: string) => {
    const levelConfig = SENSITIVITY_LEVELS.find(l => l.value === level);
    return levelConfig?.color || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const encryptionCoverage = encryptionStatus.filter(e => e.status === 'encrypted').length / encryptionStatus.length * 100;
  const piiCoverage = piiDataMapping.filter(p => p.is_encrypted).length / piiDataMapping.length * 100;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="encryption">Encriptación</TabsTrigger>
          <TabsTrigger value="pii">Datos PII</TabsTrigger>
          <TabsTrigger value="retention">Retención</TabsTrigger>
          <TabsTrigger value="gdpr">GDPR</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Data Protection Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cobertura de Encriptación</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{encryptionCoverage.toFixed(1)}%</div>
                <Progress value={encryptionCoverage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {encryptionStatus.filter(e => e.status === 'encrypted').length} de {encryptionStatus.length} tablas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Datos PII Protegidos</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{piiCoverage.toFixed(1)}%</div>
                <Progress value={piiCoverage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {piiDataMapping.filter(p => p.is_encrypted).length} de {piiDataMapping.length} campos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Políticas Activas</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {retentionPolicies.filter(p => p.is_active).length}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Políticas de retención activas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solicitudes GDPR</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {gdprRequests.filter(r => r.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Solicitudes pendientes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Últimas Tareas de Purga</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purgeJobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <p className="text-sm font-medium">{job.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {job.records_affected} registros afectados
                          </p>
                        </div>
                      </div>
                      <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Solicitudes GDPR Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gdprRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{request.user_email}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.request_type} - {request.status}
                        </p>
                      </div>
                      <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                        {request.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Estado de Encriptación</h2>
              <p className="text-muted-foreground">
                Monitoreo del estado de encriptación de datos sensibles
              </p>
            </div>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Configurar Encriptación
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {encryptionStatus.map((status) => (
              <Card key={status.table_name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{status.table_name}</CardTitle>
                    <Badge className={getEncryptionStatusColor(status.status)}>
                      {status.status === 'encrypted' ? 'Encriptado' : 
                       status.status === 'partially_encrypted' ? 'Parcialmente Encriptado' : 
                       'No Encriptado'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Tipo de Encriptación</Label>
                        <p className="text-sm">{status.encryption_type}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Columnas Encriptadas</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {status.encrypted_columns.length > 0 ? (
                            status.encrypted_columns.map((column) => (
                              <Badge key={column} variant="outline" className="text-xs">
                                {column}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">Ninguna</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {status.encryption_type !== 'none' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Última Rotación de Claves</Label>
                          <p className="text-sm">{status.key_rotation_date}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Próxima Rotación</Label>
                          <p className="text-sm">{status.next_rotation_date}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pii" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Mapeo de Datos PII</h2>
              <p className="text-muted-foreground">
                Identificación y gestión de datos de identificación personal
              </p>
            </div>
            <Dialog open={showPIIMapping} onOpenChange={setShowPIIMapping}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Campo PII
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Campo PII</DialogTitle>
                  <DialogDescription>
                    Identificar un nuevo campo como datos de identificación personal
                  </DialogDescription>
                </DialogHeader>
                {/* PII mapping form would go here */}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPIIMapping(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setShowPIIMapping(false)}>
                    Agregar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {piiDataMapping.map((pii) => (
              <Card key={`${pii.table_name}-${pii.column_name}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="h-5 w-5" />
                      <CardTitle className="text-lg">
                        {pii.table_name}.{pii.column_name}
                      </CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSensitivityLevelColor(pii.sensitivity_level)}>
                        {SENSITIVITY_LEVELS.find(l => l.value === pii.sensitivity_level)?.label}
                      </Badge>
                      {pii.is_encrypted ? (
                        <Lock className="h-4 w-4 text-green-600" />
                      ) : (
                        <Unlock className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Tipo de Dato</Label>
                      <p className="text-sm">{DATA_TYPES.find(t => t.value === pii.data_type)?.label}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Período de Retención</Label>
                      <p className="text-sm">{pii.retention_period} días</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Última Auditoría</Label>
                      <p className="text-sm">{pii.last_audit}</p>
                    </div>
                  </div>
                  {pii.anonymization_method && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Método de Anonimización</Label>
                      <p className="text-sm">{pii.anonymization_method}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Políticas de Retención</h2>
              <p className="text-muted-foreground">
                Gestión de políticas de retención y eliminación de datos
              </p>
            </div>
            <Dialog open={showCreatePolicy} onOpenChange={setShowCreatePolicy}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Política
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Política de Retención</DialogTitle>
                  <DialogDescription>
                    Define una nueva política para la gestión de datos
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="policy-name">Nombre de la Política</Label>
                    <Input
                      id="policy-name"
                      value={newPolicy.name}
                      onChange={(e) => setNewPolicy(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Política de Usuarios Inactivos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="policy-description">Descripción</Label>
                    <Textarea
                      id="policy-description"
                      value={newPolicy.description}
                      onChange={(e) => setNewPolicy(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe el propósito de esta política"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="policy-table">Tabla</Label>
                      <Input
                        id="policy-table"
                        value={newPolicy.table_name}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, table_name: e.target.value }))}
                        placeholder="Ej: users"
                      />
                    </div>
                    <div>
                      <Label htmlFor="policy-period">Período de Retención (días)</Label>
                      <Input
                        id="policy-period"
                        type="number"
                        value={newPolicy.retention_period}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, retention_period: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="policy-action">Acción</Label>
                    <Select value={newPolicy.action} onValueChange={(value) => setNewPolicy(prev => ({ ...prev, action: value as 'delete' | 'archive' | 'anonymize' }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delete">Eliminar</SelectItem>
                        <SelectItem value="archive">Archivar</SelectItem>
                        <SelectItem value="anonymize">Anonimizar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreatePolicy(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={createRetentionPolicy}>
                    Crear Política
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {retentionPolicies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{policy.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={policy.is_active ? 'default' : 'secondary'}>
                        {policy.is_active ? 'Activa' : 'Inactiva'}
                      </Badge>
                      <Switch checked={policy.is_active} />
                    </div>
                  </div>
                  <CardDescription>{policy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Tabla</Label>
                      <p className="text-sm font-mono">{policy.table_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Período de Retención</Label>
                      <p className="text-sm">{policy.retention_period} días</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Acción</Label>
                      <Badge variant="outline">{policy.action}</Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Próxima Ejecución</Label>
                    <p className="text-sm">{new Date(policy.next_execution).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gdpr" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Gestión GDPR</h2>
            <p className="text-muted-foreground">
              Procesamiento de solicitudes de derechos de datos personales
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {gdprRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{request.user_email}</CardTitle>
                    <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Tipo de Solicitud</Label>
                        <Badge variant="outline">{request.request_type}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Fecha de Solicitud</Label>
                        <p className="text-sm">{new Date(request.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    {request.status === 'completed' && request.export_url && (
                      <div>
                        <Label className="text-sm font-medium">Enlace de Descarga</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input value={request.export_url} readOnly className="font-mono text-sm" />
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {request.notes && (
                      <div>
                        <Label className="text-sm font-medium">Notas</Label>
                        <p className="text-sm">{request.notes}</p>
                      </div>
                    )}
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