import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle, XCircle } from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';

export function TwoFactorAuthManager() {
  const { twoFactorAuth, enable2FA, disable2FA } = useSecurity();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Autenticación de Dos Factores</CardTitle>
        <CardDescription>Configuración de seguridad adicional</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5" />
              <div>
                <h3 className="font-medium">Estado 2FA</h3>
                <p className="text-sm text-muted-foreground">
                  {twoFactorAuth?.is_enabled ? 'Habilitado' : 'Deshabilitado'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {twoFactorAuth?.is_enabled ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <Button 
                onClick={twoFactorAuth?.is_enabled ? disable2FA : enable2FA}
                variant={twoFactorAuth?.is_enabled ? "destructive" : "default"}
              >
                {twoFactorAuth?.is_enabled ? 'Deshabilitar' : 'Habilitar'} 2FA
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}