import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Mail, 
  MessageSquare, 
  Database, 
  Shield,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SystemConfig() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [config, setConfig] = useState({
    business: {
      name: 'PRMCMS Puerto Rico',
      address: '',
      phone: '',
      email: '',
      taxId: '',
    },
    tax: {
      ivuRate: '11.5',
      enabled: true,
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      whatsappEnabled: false,
    },
    backup: {
      autoBackup: true,
      frequency: 'daily',
      retention: '30',
    },
  });

  const saveConfiguration = async () => {
    try {
      setLoading(true);
      // TODO: Save to database
      toast({
        title: 'Configuración guardada',
        description: 'Los cambios se han aplicado correctamente',
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la configuración',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Configuración del Sistema</h2>
          <p className="text-muted-foreground">Administrar configuraciones generales del sistema</p>
        </div>
        <Button onClick={saveConfiguration} disabled={loading}>
          {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business">Negocio</TabsTrigger>
          <TabsTrigger value="tax">Impuestos</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="backup">Respaldo</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Información del Negocio
              </CardTitle>
              <CardDescription>
                Configuración básica de la empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre de la Empresa</Label>
                  <Input
                    value={config.business.name}
                    onChange={(e) => setConfig({
                      ...config,
                      business: { ...config.business, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    value={config.business.phone}
                    onChange={(e) => setConfig({
                      ...config,
                      business: { ...config.business, phone: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div>
                <Label>Dirección</Label>
                <Textarea
                  value={config.business.address}
                  onChange={(e) => setConfig({
                    ...config,
                    business: { ...config.business, address: e.target.value }
                  })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={config.business.email}
                    onChange={(e) => setConfig({
                      ...config,
                      business: { ...config.business, email: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Número de Identificación Tributaria</Label>
                  <Input
                    value={config.business.taxId}
                    onChange={(e) => setConfig({
                      ...config,
                      business: { ...config.business, taxId: e.target.value }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Configuración de Impuestos</CardTitle>
              <CardDescription>
                Configurar tasas de IVU y otros impuestos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Aplicar IVU</Label>
                  <p className="text-sm text-muted-foreground">
                    Aplicar Impuesto sobre Ventas y Uso automáticamente
                  </p>
                </div>
                <Switch
                  checked={config.tax.enabled}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    tax: { ...config.tax, enabled: checked }
                  })}
                />
              </div>
              <Separator />
              <div>
                <Label>Tasa de IVU (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={config.tax.ivuRate}
                  onChange={(e) => setConfig({
                    ...config,
                    tax: { ...config.tax, ivuRate: e.target.value }
                  })}
                  className="max-w-32"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Tasa actual: {config.tax.ivuRate}%
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>
                Configurar métodos de notificación disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <div>
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificaciones por correo electrónico
                    </p>
                  </div>
                </div>
                <Switch
                  checked={config.notifications.emailEnabled}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    notifications: { ...config.notifications, emailEnabled: checked }
                  })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <div>
                    <Label>Notificaciones por SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificaciones por mensaje de texto
                    </p>
                  </div>
                </div>
                <Switch
                  checked={config.notifications.smsEnabled}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    notifications: { ...config.notifications, smsEnabled: checked }
                  })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <div>
                    <Label>Notificaciones por WhatsApp</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificaciones por WhatsApp Business
                    </p>
                  </div>
                </div>
                <Switch
                  checked={config.notifications.whatsappEnabled}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    notifications: { ...config.notifications, whatsappEnabled: checked }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Configuración de Respaldo
              </CardTitle>
              <CardDescription>
                Configurar respaldos automáticos del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Respaldo Automático</Label>
                  <p className="text-sm text-muted-foreground">
                    Realizar respaldos automáticos de la base de datos
                  </p>
                </div>
                <Switch
                  checked={config.backup.autoBackup}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    backup: { ...config.backup, autoBackup: checked }
                  })}
                />
              </div>
              <Separator />
              <div>
                <Label>Frecuencia de Respaldo</Label>
                <Select
                  value={config.backup.frequency}
                  onValueChange={(value) => setConfig({
                    ...config,
                    backup: { ...config.backup, frequency: value }
                  })}
                >
                  <SelectTrigger className="max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diario</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Retención (días)</Label>
                <Input
                  type="number"
                  value={config.backup.retention}
                  onChange={(e) => setConfig({
                    ...config,
                    backup: { ...config.backup, retention: e.target.value }
                  })}
                  className="max-w-32"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Los respaldos se eliminarán después de {config.backup.retention} días
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}