import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Users, 
  Activity,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Zap,
  Database,
  Settings,
  BarChart3
} from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';

export function SecurityDashboard() {
  const { 
    securityScorecard, 
    securityAlerts, 
    loginAttempts, 
    userSessions, 
    twoFactorAuth,
    loading 
  } = useSecurity();

  const activeAlerts = securityAlerts.filter(alert => alert.status === 'active');
  const recentLoginAttempts = loginAttempts.slice(0, 5);
  const activeSessions = userSessions.filter(session => session.is_active);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntuación General</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityScorecard?.overall_score || 0}%
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress 
                value={securityScorecard?.overall_score || 0} 
                className="flex-1" 
              />
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge 
                variant={
                  securityScorecard?.threat_level === 'critical' ? 'destructive' :
                  securityScorecard?.threat_level === 'high' ? 'default' :
                  securityScorecard?.threat_level === 'medium' ? 'secondary' : 'outline'
                }
                className="text-xs"
              >
                Nivel de Amenaza: {securityScorecard?.threat_level?.toUpperCase() || 'LOW'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {activeAlerts.length}
            </div>
            <div className="flex space-x-1 mt-2">
              {activeAlerts.slice(0, 3).map((alert, index) => (
                <Badge 
                  key={index} 
                  variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {alert.severity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones Activas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeSessions.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {userSessions.length - activeSessions.length} sesiones expiradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autenticación 2FA</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {twoFactorAuth?.is_enabled ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <span className="text-sm font-medium">
                {twoFactorAuth?.is_enabled ? 'Habilitado' : 'Deshabilitado'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Threat Indicators */}
      {securityScorecard?.threat_indicators && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Indicadores de Amenaza</span>
            </CardTitle>
            <CardDescription>
              Monitoreo en tiempo real de amenazas de seguridad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {securityScorecard.threat_indicators.failed_logins}
                </div>
                <p className="text-sm text-muted-foreground">Intentos Fallidos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {securityScorecard.threat_indicators.suspicious_ips}
                </div>
                <p className="text-sm text-muted-foreground">IPs Sospechosas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {securityScorecard.threat_indicators.data_access_anomalies}
                </div>
                <p className="text-sm text-muted-foreground">Anomalías de Datos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {securityScorecard.threat_indicators.privilege_escalations}
                </div>
                <p className="text-sm text-muted-foreground">Escalación Privilegios</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {securityScorecard.threat_indicators.malware_detections}
                </div>
                <p className="text-sm text-muted-foreground">Detección Malware</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Metrics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Seguridad</CardTitle>
            <CardDescription>
              Puntuación detallada por categorías
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Autenticación</span>
                <span className={`text-sm font-bold ${getScoreColor(securityScorecard?.authentication_score || 0)}`}>
                  {securityScorecard?.authentication_score || 0}%
                </span>
              </div>
              <Progress value={securityScorecard?.authentication_score || 0} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Protección de Datos</span>
                <span className={`text-sm font-bold ${getScoreColor(securityScorecard?.data_protection_score || 0)}`}>
                  {securityScorecard?.data_protection_score || 0}%
                </span>
              </div>
              <Progress value={securityScorecard?.data_protection_score || 0} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Control de Acceso</span>
                <span className={`text-sm font-bold ${getScoreColor(securityScorecard?.access_control_score || 0)}`}>
                  {securityScorecard?.access_control_score || 0}%
                </span>
              </div>
              <Progress value={securityScorecard?.access_control_score || 0} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Monitoreo</span>
                <span className={`text-sm font-bold ${getScoreColor(securityScorecard?.monitoring_score || 0)}`}>
                  {securityScorecard?.monitoring_score || 0}%
                </span>
              </div>
              <Progress value={securityScorecard?.monitoring_score || 0} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cumplimiento</span>
                <span className={`text-sm font-bold ${getScoreColor(securityScorecard?.compliance_score || 0)}`}>
                  {securityScorecard?.compliance_score || 0}%
                </span>
              </div>
              <Progress value={securityScorecard?.compliance_score || 0} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Respuesta a Incidentes</span>
                <span className={`text-sm font-bold ${getScoreColor(securityScorecard?.incident_response_score || 0)}`}>
                  {securityScorecard?.incident_response_score || 0}%
                </span>
              </div>
              <Progress value={securityScorecard?.incident_response_score || 0} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimos intentos de inicio de sesión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLoginAttempts.map((attempt, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      attempt.attempt_result === 'success' 
                        ? 'bg-green-100 text-green-600' 
                        : attempt.attempt_result === 'failed'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {attempt.attempt_result === 'success' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : attempt.attempt_result === 'failed' ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{attempt.email}</p>
                      <p className="text-xs text-muted-foreground">{attempt.ip_address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        attempt.attempt_result === 'success' 
                          ? 'default' 
                          : attempt.attempt_result === 'failed'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {attempt.attempt_result === 'success' 
                        ? 'Exitoso' 
                        : attempt.attempt_result === 'failed'
                        ? 'Fallido'
                        : 'Bloqueado'
                      }
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(attempt.created_at).toLocaleString('es-PR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {securityScorecard?.recommendations && securityScorecard.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recomendaciones de Seguridad</CardTitle>
            <CardDescription>
              Acciones sugeridas para mejorar la seguridad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityScorecard.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm">{recommendation}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Aplicar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}