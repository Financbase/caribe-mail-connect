import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Globe,
  MapPin,
  Clock,
  LogOut,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';

export function SessionManager() {
  const { userSessions, loading, terminateSession, fetchUserSessions } = useSecurity();
  const [terminatingSession, setTerminatingSession] = useState<string | null>(null);

  const activeSessions = userSessions.filter(session => session.is_active);
  const expiredSessions = userSessions.filter(session => !session.is_active);

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <Monitor className="h-4 w-4" />;
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Tablet className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getDeviceInfo = (userAgent?: string, deviceInfo?: any) => {
    if (deviceInfo?.browser) {
      return `${deviceInfo.browser} ${deviceInfo.version || ''}`;
    }
    if (userAgent) {
      // Simple user agent parsing
      if (userAgent.includes('Chrome')) return 'Chrome';
      if (userAgent.includes('Firefox')) return 'Firefox';
      if (userAgent.includes('Safari')) return 'Safari';
      if (userAgent.includes('Edge')) return 'Edge';
    }
    return 'Navegador desconocido';
  };

  const isCurrentSession = (session: any) => {
    // This would normally check against the current session token
    return session.id === userSessions[0]?.id;
  };

  const handleTerminateSession = async (sessionId: string) => {
    setTerminatingSession(sessionId);
    try {
      await terminateSession(sessionId);
      await fetchUserSessions();
    } finally {
      setTerminatingSession(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sesiones Activas</p>
                <p className="text-2xl font-bold text-green-600">{activeSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sesiones Expiradas</p>
                <p className="text-2xl font-bold text-red-600">{expiredSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Monitor className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Sesiones</p>
                <p className="text-2xl font-bold">{userSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Sesiones Activas</CardTitle>
          <CardDescription>
            Gestiona las sesiones actualmente conectadas a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSessions.length === 0 ? (
              <div className="text-center py-8">
                <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay sesiones activas</p>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dispositivo</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Dirección IP</TableHead>
                      <TableHead>Última Actividad</TableHead>
                      <TableHead>Expira</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getDeviceIcon(session.user_agent)}
                            <div>
                              <p className="font-medium">
                                {getDeviceInfo(session.user_agent, session.device_info)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {session.device_info?.platform || 'Plataforma desconocida'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {session.location_data?.country || 'Desconocido'}
                              {session.location_data?.city && `, ${session.location_data.city}`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {session.ip_address}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(session.last_activity).toLocaleString('es-PR')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(session.expires_at).toLocaleString('es-PR')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {isCurrentSession(session) && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                Sesión Actual
                              </Badge>
                            )}
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Activa
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {!isCurrentSession(session) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={terminatingSession === session.id}
                                >
                                  <LogOut className="h-4 w-4 mr-2" />
                                  Terminar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Terminar sesión?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esto cerrará la sesión inmediatamente y el usuario tendrá que volver a iniciar sesión.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleTerminateSession(session.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Terminar Sesión
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session History */}
      {expiredSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Sesiones</CardTitle>
            <CardDescription>
              Sesiones recientes que han expirado o fueron terminadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispositivo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Dirección IP</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiredSessions.slice(0, 10).map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {getDeviceIcon(session.user_agent)}
                          <div>
                            <p className="font-medium">
                              {getDeviceInfo(session.user_agent, session.device_info)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {session.device_info?.platform || 'Plataforma desconocida'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {session.location_data?.country || 'Desconocido'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {session.ip_address}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(session.created_at).toLocaleDateString('es-PR')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          Expirada
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}