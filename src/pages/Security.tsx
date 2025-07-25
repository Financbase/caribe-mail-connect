import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Users, 
  Activity, 
  FileText,
  Eye,
  UserX,
  Globe,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { LoginAttemptMonitor } from '@/components/security/LoginAttemptMonitor';
import { SessionManager } from '@/components/security/SessionManager';
import { SecurityAlertViewer } from '@/components/security/SecurityAlertViewer';
import { TwoFactorAuthManager } from '@/components/security/TwoFactorAuthManager';
import { GDPRCompliance } from '@/components/security/GDPRCompliance';
import { IPAccessControl } from '@/components/security/IPAccessControl';
import { SecurityTraining } from '@/components/security/SecurityTraining';
import { useSecurity } from '@/hooks/useSecurity';

export default function Security() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { 
    securityScorecard, 
    securityAlerts, 
    loginAttempts, 
    userSessions, 
    twoFactorAuth,
    loading 
  } = useSecurity();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Centro de Seguridad</h1>
            <p className="text-muted-foreground mt-2">
              Monitoreo y gestión de seguridad avanzada para PRMCMS
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Card className="px-4 py-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Puntuación de Seguridad</p>
                  <p className="text-2xl font-bold text-green-600">
                    {securityScorecard?.overall_score || 0}%
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="px-4 py-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Alertas Activas</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {securityAlerts.filter(alert => alert.status === 'active').length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="login-attempts" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Intentos</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Sesiones</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Alertas</span>
            </TabsTrigger>
            <TabsTrigger value="2fa" className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>2FA</span>
            </TabsTrigger>
            <TabsTrigger value="gdpr" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>GDPR</span>
            </TabsTrigger>
            <TabsTrigger value="ip-control" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Control IP</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Entrenamiento</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="login-attempts" className="space-y-6">
            <LoginAttemptMonitor />
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <SessionManager />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <SecurityAlertViewer />
          </TabsContent>

          <TabsContent value="2fa" className="space-y-6">
            <TwoFactorAuthManager />
          </TabsContent>

          <TabsContent value="gdpr" className="space-y-6">
            <GDPRCompliance />
          </TabsContent>

          <TabsContent value="ip-control" className="space-y-6">
            <IPAccessControl />
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <SecurityTraining />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}