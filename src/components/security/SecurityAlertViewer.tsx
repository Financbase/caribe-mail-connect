import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';

export function SecurityAlertViewer() {
  const { securityAlerts, resolveSecurityAlert } = useSecurity();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Seguridad</CardTitle>
        <CardDescription>Monitoreo de eventos de seguridad</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {securityAlerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <h3 className="font-medium">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {alert.severity}
                  </Badge>
                  <Button size="sm" onClick={() => resolveSecurityAlert(alert.id, 'resolved')}>
                    Resolver
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}