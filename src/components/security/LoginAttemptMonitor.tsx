import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  XCircle, 
  Shield,
  MapPin,
  Clock,
  Monitor
} from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';

export function LoginAttemptMonitor() {
  const { loginAttempts, loading, fetchLoginAttempts } = useSecurity();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  const filteredAttempts = loginAttempts.filter(attempt => {
    const matchesSearch = attempt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attempt.ip_address.includes(searchTerm);
    const matchesFilter = filterResult === 'all' || attempt.attempt_result === filterResult;
    return matchesSearch && matchesFilter;
  });

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Exitoso</Badge>;
      case 'failed':
        return <Badge variant="destructive">Fallido</Badge>;
      case 'blocked':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Bloqueado</Badge>;
      default:
        return <Badge variant="outline">{result}</Badge>;
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'blocked':
        return <Shield className="h-4 w-4 text-yellow-600" />;
      default:
        return <Monitor className="h-4 w-4 text-gray-600" />;
    }
  };

  const attemptStats = {
    total: loginAttempts.length,
    success: loginAttempts.filter(a => a.attempt_result === 'success').length,
    failed: loginAttempts.filter(a => a.attempt_result === 'failed').length,
    blocked: loginAttempts.filter(a => a.attempt_result === 'blocked').length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Monitor className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{attemptStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Exitosos</p>
                <p className="text-2xl font-bold text-green-600">{attemptStats.success}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fallidos</p>
                <p className="text-2xl font-bold text-red-600">{attemptStats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bloqueados</p>
                <p className="text-2xl font-bold text-yellow-600">{attemptStats.blocked}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoreo de Intentos de Inicio de Sesión</CardTitle>
          <CardDescription>
            Seguimiento en tiempo real de todos los intentos de autenticación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por email o dirección IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterResult} onValueChange={setFilterResult}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por resultado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="success">Exitosos</SelectItem>
                <SelectItem value="failed">Fallidos</SelectItem>
                <SelectItem value="blocked">Bloqueados</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Rango de tiempo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Última hora</SelectItem>
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchLoginAttempts}>
              <Filter className="h-4 w-4 mr-2" />
              Actualizar
            </Button>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>

          {/* Login Attempts Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Dirección IP</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Dispositivo</TableHead>
                  <TableHead>Razón del Fallo</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttempts.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getResultIcon(attempt.attempt_result)}
                        {getResultBadge(attempt.attempt_result)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{attempt.email}</TableCell>
                    <TableCell className="font-mono text-sm">{attempt.ip_address}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {attempt.location_data?.country || 'Desconocido'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {attempt.user_agent ? (
                        <span className="truncate max-w-[200px] block">
                          {attempt.user_agent}
                        </span>
                      ) : (
                        'No disponible'
                      )}
                    </TableCell>
                    <TableCell>
                      {attempt.failure_reason ? (
                        <Badge variant="outline" className="text-xs">
                          {attempt.failure_reason}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(attempt.created_at).toLocaleString('es-PR')}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAttempts.length === 0 && (
            <div className="text-center py-8">
              <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No se encontraron intentos de inicio de sesión con los filtros seleccionados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}