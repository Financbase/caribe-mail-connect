import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Shield } from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';

export function IPAccessControl() {
  const { addIPToAccessControl } = useSecurity();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Control de Acceso por IP</CardTitle>
        <CardDescription>Gestión de listas blancas y negras de IPs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input placeholder="Dirección IP" />
            <Button onClick={() => addIPToAccessControl('192.168.1.1', 'whitelist')}>
              <Shield className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}