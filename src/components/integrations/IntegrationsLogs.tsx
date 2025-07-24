import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { IntegrationLog } from '@/hooks/useIntegrations';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Activity
} from 'lucide-react';

interface IntegrationsLogsProps {
  logs: (IntegrationLog & { integrations: { display_name: string } })[];
  loading: boolean;
}

export function IntegrationsLogs({ logs, loading }: IntegrationsLogsProps) {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<string | null>(null);

  const getStatusIcon = (statusCode: number | null) => {
    if (!statusCode) return <Clock className="h-4 w-4 text-gray-400" />;
    if (statusCode >= 200 && statusCode < 300) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (statusCode >= 400) return <XCircle className="h-4 w-4 text-red-600" />;
    return <AlertCircle className="h-4 w-4 text-yellow-600" />;
  };

  const getStatusText = (statusCode: number | null) => {
    if (!statusCode) return language === 'en' ? 'Pending' : 'Pendiente';
    if (statusCode >= 200 && statusCode < 300) return language === 'en' ? 'Success' : 'Éxito';
    if (statusCode >= 400) return language === 'en' ? 'Error' : 'Error';
    return language === 'en' ? 'Unknown' : 'Desconocido';
  };

  const getStatusColor = (statusCode: number | null) => {
    if (!statusCode) return 'bg-gray-100 text-gray-800';
    if (statusCode >= 200 && statusCode < 300) return 'bg-green-100 text-green-800';
    if (statusCode >= 400) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getRequestTypeColor = (type: string) => {
    switch (type) {
      case 'sync':
        return 'bg-blue-100 text-blue-800';
      case 'webhook':
        return 'bg-purple-100 text-purple-800';
      case 'api_call':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.integrations.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.endpoint?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'success' && log.status_code && log.status_code >= 200 && log.status_code < 300) ||
      (statusFilter === 'error' && log.status_code && log.status_code >= 400) ||
      (statusFilter === 'pending' && !log.status_code);
    
    const matchesType = typeFilter === 'all' || log.request_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleExportLogs = () => {
    // Export logs functionality
    console.log('Exporting logs...');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'en' ? 'Integration Logs' : 'Registros de Integración'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Monitor API requests, responses, and integration activities'
              : 'Monitorear solicitudes API, respuestas y actividades de integración'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Export' : 'Exportar'}
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Refresh' : 'Actualizar'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'en' ? 'Search logs...' : 'Buscar registros...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={language === 'en' ? 'Status' : 'Estado'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'en' ? 'All Status' : 'Todos los Estados'}</SelectItem>
                <SelectItem value="success">{language === 'en' ? 'Success' : 'Éxito'}</SelectItem>
                <SelectItem value="error">{language === 'en' ? 'Error' : 'Error'}</SelectItem>
                <SelectItem value="pending">{language === 'en' ? 'Pending' : 'Pendiente'}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={language === 'en' ? 'Type' : 'Tipo'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'en' ? 'All Types' : 'Todos los Tipos'}</SelectItem>
                <SelectItem value="sync">{language === 'en' ? 'Sync' : 'Sincronización'}</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="api_call">{language === 'en' ? 'API Call' : 'Llamada API'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {language === 'en' ? 'Request Logs' : 'Registros de Solicitudes'}
            <Badge variant="secondary">{filteredLogs.length}</Badge>
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Detailed activity log for all integration requests and responses'
              : 'Registro detallado de actividad para todas las solicitudes y respuestas de integración'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {language === 'en' ? 'No logs found' : 'No se encontraron registros'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' 
                  ? 'No integration activity logs match your current filters.'
                  : 'No hay registros de actividad de integración que coincidan con tus filtros actuales.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status_code)}
                      <div>
                        <h4 className="font-medium">{log.integrations.display_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {log.method ? `${log.method} ` : ''}{log.endpoint || language === 'en' ? 'No endpoint' : 'Sin endpoint'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRequestTypeColor(log.request_type)}>
                        {log.request_type}
                      </Badge>
                      <Badge className={getStatusColor(log.status_code)}>
                        {log.status_code ? `${log.status_code} ${getStatusText(log.status_code)}` : getStatusText(log.status_code)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Timestamp:' : 'Marca de tiempo:'}</span>
                      <br />
                      {formatDate(log.created_at)}
                    </div>
                    
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Duration:' : 'Duración:'}</span>
                      <br />
                      {formatDuration(log.execution_time_ms)}
                    </div>
                    
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Request Type:' : 'Tipo de Solicitud:'}</span>
                      <br />
                      {log.request_type}
                    </div>
                    
                    <div className="flex items-center justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedLog(selectedLog === log.id ? null : log.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {language === 'en' ? 'Details' : 'Detalles'}
                      </Button>
                    </div>
                  </div>
                  
                  {log.error_message && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{log.error_message}</p>
                    </div>
                  )}
                  
                  {selectedLog === log.id && (
                    <div className="mt-4 border-t pt-4 space-y-3">
                      {log.request_data && (
                        <div>
                          <h5 className="font-medium text-sm mb-2">
                            {language === 'en' ? 'Request Data:' : 'Datos de Solicitud:'}
                          </h5>
                          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                            {JSON.stringify(log.request_data, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {log.response_data && (
                        <div>
                          <h5 className="font-medium text-sm mb-2">
                            {language === 'en' ? 'Response Data:' : 'Datos de Respuesta:'}
                          </h5>
                          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                            {JSON.stringify(log.response_data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}