import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  FileText, 
  Download, 
  Filter, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Activity,
  Shield,
  Database,
  Eye,
  EyeOff,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  resource: string;
  resource_id?: string;
  details: Record<string, unknown>;
  ip_address: string;
  user_agent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failure' | 'warning';
  location_data: Record<string, unknown>;
  created_at: string;
}

interface AuditFilter {
  dateFrom?: Date;
  dateTo?: Date;
  user?: string;
  action?: string;
  resource?: string;
  severity?: string;
  status?: string;
  ipAddress?: string;
}

interface AnomalyAlert {
  id: string;
  type: 'unusual_activity' | 'failed_login_spike' | 'data_access_pattern' | 'privilege_escalation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affected_users: string[];
  metrics: Record<string, unknown>;
  created_at: string;
  status: 'active' | 'investigating' | 'resolved';
}

const AUDIT_ACTIONS = [
  'login', 'logout', 'create', 'read', 'update', 'delete', 'export', 'import',
  'password_change', 'role_change', 'permission_change', 'system_config',
  'data_access', 'file_upload', 'file_download', 'api_call'
];

const RESOURCES = [
  'users', 'customers', 'mail', 'packages', 'billing', 'reports', 'security',
  'system', 'files', 'api', 'audit_logs'
];

const SEVERITIES = ['low', 'medium', 'high', 'critical'];
const STATUSES = ['success', 'failure', 'warning'];

export function AuditSystem() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [anomalyAlerts, setAnomalyAlerts] = useState<AnomalyAlert[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AuditFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [realTimeMode, setRealTimeMode] = useState(false);

  useEffect(() => {
    fetchAuditData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [auditLogs, filters]);

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      // Mock audit logs
      const mockLogs: AuditLog[] = [
        {
          id: '1',
          user_id: 'user1',
          user_email: 'admin@prmcms.com',
          action: 'login',
          resource: 'auth',
          details: { method: 'password', success: true },
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          severity: 'low',
          status: 'success',
          location_data: { country: 'US', city: 'San Juan' },
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: 'user2',
          user_email: 'operator@prmcms.com',
          action: 'create',
          resource: 'mail',
          resource_id: 'mail123',
          details: { package_type: 'letter', customer_id: 'cust456' },
          ip_address: '192.168.1.101',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
          severity: 'medium',
          status: 'success',
          location_data: { country: 'US', city: 'Bayamón' },
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          user_id: 'user3',
          user_email: 'unknown@example.com',
          action: 'login',
          resource: 'auth',
          details: { method: 'password', success: false, reason: 'invalid_credentials' },
          ip_address: '203.0.113.1',
          user_agent: 'Mozilla/5.0 (compatible; Bot/1.0)',
          severity: 'high',
          status: 'failure',
          location_data: { country: 'Unknown' },
          created_at: new Date(Date.now() - 7200000).toISOString(),
        }
      ];

      setAuditLogs(mockLogs);

      // Mock anomaly alerts
      const mockAlerts: AnomalyAlert[] = [
        {
          id: '1',
          type: 'failed_login_spike',
          severity: 'high',
          title: 'Pico de intentos de inicio de sesión fallidos',
          description: 'Se detectaron 15 intentos fallidos en los últimos 10 minutos',
          affected_users: ['unknown@example.com'],
          metrics: { failed_attempts: 15, time_window: '10 minutes' },
          created_at: new Date().toISOString(),
          status: 'active',
        },
        {
          id: '2',
          type: 'unusual_activity',
          severity: 'medium',
          title: 'Actividad inusual detectada',
          description: 'Acceso a datos sensibles fuera del horario normal',
          affected_users: ['operator@prmcms.com'],
          metrics: { data_access_count: 50, normal_average: 10 },
          created_at: new Date(Date.now() - 3600000).toISOString(),
          status: 'investigating',
        }
      ];

      setAnomalyAlerts(mockAlerts);
    } catch (error) {
      console.error('Error fetching audit data:', error);
      toast.error('Error al cargar datos de auditoría');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...auditLogs];

    if (filters.dateFrom) {
      filtered = filtered.filter(log => new Date(log.created_at) >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(log => new Date(log.created_at) <= filters.dateTo!);
    }

    if (filters.user) {
      filtered = filtered.filter(log => 
        log.user_email.toLowerCase().includes(filters.user!.toLowerCase())
      );
    }

    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    if (filters.resource) {
      filtered = filtered.filter(log => log.resource === filters.resource);
    }

    if (filters.severity) {
      filtered = filtered.filter(log => log.severity === filters.severity);
    }

    if (filters.status) {
      filtered = filtered.filter(log => log.status === filters.status);
    }

    if (filters.ipAddress) {
      filtered = filtered.filter(log => 
        log.ip_address.includes(filters.ipAddress!)
      );
    }

    setFilteredLogs(filtered);
  };

  const exportAuditLogs = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      const data = selectedLogs.length > 0 
        ? filteredLogs.filter(log => selectedLogs.includes(log.id))
        : filteredLogs;

      // Mock export functionality
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Logs exportados en formato ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      toast.error('Error al exportar logs');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failure': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const toggleLogSelection = (logId: string) => {
    setSelectedLogs(prev => 
      prev.includes(logId) 
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  const selectAllLogs = () => {
    setSelectedLogs(filteredLogs.map(log => log.id));
  };

  const clearSelection = () => {
    setSelectedLogs([]);
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Sistema de Auditoría</h2>
          <p className="text-muted-foreground">
            Monitoreo completo de actividad del sistema y detección de anomalías
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={realTimeMode ? 'default' : 'outline'}
            onClick={() => setRealTimeMode(!realTimeMode)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${realTimeMode ? 'animate-spin' : ''}`} />
            Tiempo Real
          </Button>
          <Button onClick={fetchAuditData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Anomaly Alerts */}
      {anomalyAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span>Alertas de Anomalías</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anomalyAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'}>
                          {alert.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Investigar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtros de Auditoría</span>
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Fecha Desde</Label>
                <DatePicker
                  selected={filters.dateFrom}
                  onChange={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                  placeholderText="Seleccionar fecha"
                  className="w-full"
                />
              </div>
              <div>
                <Label>Fecha Hasta</Label>
                <DatePicker
                  selected={filters.dateTo}
                  onChange={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                  placeholderText="Seleccionar fecha"
                  className="w-full"
                />
              </div>
              <div>
                <Label>Usuario</Label>
                <Input
                  value={filters.user || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                  placeholder="Buscar por email"
                />
              </div>
              <div>
                <Label>Acción</Label>
                <Select value={filters.action} onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las acciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las acciones</SelectItem>
                    {AUDIT_ACTIONS.map(action => (
                      <SelectItem key={action} value={action}>{action}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Recurso</Label>
                <Select value={filters.resource} onValueChange={(value) => setFilters(prev => ({ ...prev, resource: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los recursos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los recursos</SelectItem>
                    {RESOURCES.map(resource => (
                      <SelectItem key={resource} value={resource}>{resource}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Severidad</Label>
                <Select value={filters.severity} onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las severidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las severidades</SelectItem>
                    {SEVERITIES.map(severity => (
                      <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estado</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los estados</SelectItem>
                    {STATUSES.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Dirección IP</Label>
                <Input
                  value={filters.ipAddress || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, ipAddress: e.target.value }))}
                  placeholder="Buscar por IP"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setFilters({})}>
                Limpiar Filtros
              </Button>
              <Button onClick={applyFilters}>
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Export Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {filteredLogs.length} registros encontrados
          </span>
          {selectedLogs.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedLogs.length} seleccionados
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={selectAllLogs}>
            Seleccionar Todo
          </Button>
          <Button variant="outline" size="sm" onClick={clearSelection}>
            Limpiar Selección
          </Button>
          <Select onValueChange={(value) => exportAuditLogs(value as 'csv' | 'json' | 'pdf')}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Exportar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Auditoría</CardTitle>
          <CardDescription>
            Historial completo de actividad del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedLogs.includes(log.id)}
                  onChange={() => toggleLogSelection(log.id)}
                  className="rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(log.status)}
                      <span className="font-medium">{log.action}</span>
                      <Badge variant="outline">{log.resource}</Badge>
                      <Badge className={getSeverityColor(log.severity)}>
                        {log.severity}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Usuario:</span> {log.user_email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">IP:</span> {log.ip_address}
                    </p>
                    {log.location_data?.city && (
                      <p className="text-sm">
                        <span className="font-medium">Ubicación:</span> {log.location_data.city}, {log.location_data.country}
                      </p>
                    )}
                    {log.details && Object.keys(log.details).length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm font-medium">Detalles</summary>
                        <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 