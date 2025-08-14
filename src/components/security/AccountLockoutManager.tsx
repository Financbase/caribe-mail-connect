import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserX, Unlock, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface LockoutPolicy {
  enabled: boolean;
  maxAttempts: number;
  lockoutDuration: number;
  resetWindow: number;
  autoUnlock: boolean;
}

interface LockedAccount {
  id: string;
  email: string;
  failedAttempts: number;
  lockedAt: string;
  unlockAt: string;
  ipAddress: string;
  status: 'locked' | 'auto_unlock_pending';
}

export function AccountLockoutManager() {
  const [policy, setPolicy] = useState<LockoutPolicy>({
    enabled: true,
    maxAttempts: 5,
    lockoutDuration: 30,
    resetWindow: 15,
    autoUnlock: true,
  });

  const [lockedAccounts, setLockedAccounts] = useState<LockedAccount[]>([
    {
      id: '1',
      email: 'user@example.com',
      failedAttempts: 5,
      lockedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      unlockAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      ipAddress: '192.168.1.100',
      status: 'locked',
    },
    {
      id: '2',
      email: 'admin@company.com',
      failedAttempts: 6,
      lockedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      unlockAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      ipAddress: '10.0.1.50',
      status: 'auto_unlock_pending',
    },
  ]);

  const updatePolicy = (field: keyof LockoutPolicy, value: unknown) => {
    setPolicy(prev => ({ ...prev, [field]: value }));
  };

  const savePolicy = async () => {
    try {
      // Implementation would save to database
      toast.success('Política de bloqueo actualizada');
    } catch (error) {
      toast.error('Error al actualizar política');
    }
  };

  const unlockAccount = async (accountId: string) => {
    try {
      setLockedAccounts(prev => prev.filter(acc => acc.id !== accountId));
      toast.success('Cuenta desbloqueada exitosamente');
    } catch (error) {
      toast.error('Error al desbloquear cuenta');
    }
  };

  const unlockAllAccounts = async () => {
    try {
      setLockedAccounts([]);
      toast.success('Todas las cuentas han sido desbloqueadas');
    } catch (error) {
      toast.error('Error al desbloquear cuentas');
    }
  };

  const formatTimeRemaining = (unlockAt: string) => {
    const now = new Date();
    const unlock = new Date(unlockAt);
    const diff = unlock.getTime() - now.getTime();
    
    if (diff <= 0) return 'Listo para desbloquear';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getStatusBadge = (account: LockedAccount) => {
    const isExpired = new Date(account.unlockAt) <= new Date();
    
    if (isExpired) {
      return <Badge variant="secondary">Listo para desbloquear</Badge>;
    }
    
    return <Badge variant="destructive">Bloqueado</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5" />
            Política de Bloqueo de Cuentas
          </CardTitle>
          <CardDescription>
            Configurar reglas automáticas para bloquear cuentas tras intentos fallidos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label>Bloqueo Automático Habilitado</Label>
            <Switch
              checked={policy.enabled}
              onCheckedChange={(checked) => updatePolicy('enabled', checked)}
            />
          </div>

          {policy.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Máximo Intentos Fallidos</Label>
                  <Input
                    type="number"
                    value={policy.maxAttempts}
                    onChange={(e) => updatePolicy('maxAttempts', parseInt(e.target.value))}
                    min={3}
                    max={10}
                  />
                </div>

                <div>
                  <Label>Duración de Bloqueo (minutos)</Label>
                  <Input
                    type="number"
                    value={policy.lockoutDuration}
                    onChange={(e) => updatePolicy('lockoutDuration', parseInt(e.target.value))}
                    min={5}
                    max={1440}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Ventana de Reinicio (minutos)</Label>
                  <Input
                    type="number"
                    value={policy.resetWindow}
                    onChange={(e) => updatePolicy('resetWindow', parseInt(e.target.value))}
                    min={5}
                    max={60}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Desbloqueo Automático</Label>
                  <Switch
                    checked={policy.autoUnlock}
                    onCheckedChange={(checked) => updatePolicy('autoUnlock', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          <Button onClick={savePolicy} className="w-full">
            Guardar Política
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cuentas Bloqueadas</CardTitle>
              <CardDescription>
                {lockedAccounts.length} cuentas bloqueadas actualmente
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={unlockAllAccounts}
              disabled={lockedAccounts.length === 0}
            >
              <Unlock className="h-4 w-4 mr-2" />
              Desbloquear Todas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lockedAccounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay cuentas bloqueadas
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Intentos</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Bloqueado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tiempo Restante</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lockedAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.email}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{account.failedAttempts}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{account.ipAddress}</TableCell>
                    <TableCell>
                      {new Date(account.lockedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(account)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {formatTimeRemaining(account.unlockAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => unlockAccount(account.id)}
                      >
                        <Unlock className="h-4 w-4 mr-1" />
                        Desbloquear
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {policy.enabled && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Política</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                Cuenta se bloquea tras {policy.maxAttempts} intentos fallidos
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Bloqueo dura {policy.lockoutDuration} minutos
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                Contador se reinicia cada {policy.resetWindow} minutos sin intentos
              </div>
              {policy.autoUnlock && (
                <div className="flex items-center gap-2">
                  <Unlock className="h-4 w-4 text-green-600" />
                  Desbloqueo automático habilitado
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}