import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Check, 
  Clock, 
  X, 
  AlertTriangle, 
  ExternalLink,
  Copy,
  Settings,
  MessageSquare,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppTemplate {
  name: string;
  language: string;
  category: string;
  content: string;
  variables: string[];
}

export function WhatsAppSetup() {
  const [isConnected, setIsConnected] = useState(false);
  const [templates, setTemplates] = useState([
    {
      id: '1',
      name: 'package_arrival',
      status: 'approved',
      language: 'es',
      category: 'UTILITY',
      content: 'Hola {{1}}, su paquete {{2}} ha llegado y está disponible para recoger en {{3}}.',
      lastUsed: '2025-01-15'
    },
    {
      id: '2',
      name: 'package_reminder',
      status: 'pending',
      language: 'es',
      category: 'UTILITY',
      content: 'Recordatorio: Su paquete {{1}} está esperando. Recójalo antes del {{2}} para evitar cargos.',
      lastUsed: null
    },
    {
      id: '3',
      name: 'mailbox_expiry',
      status: 'rejected',
      language: 'es',
      category: 'MARKETING',
      content: 'Su buzón #{{1}} expira el {{2}}. Renueve ahora: {{3}}',
      lastUsed: null
    }
  ]);

  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" />Aprobado</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rechazado</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado',
      description: 'Texto copiado al portapapeles',
    });
  };

  const connectWhatsApp = () => {
    // Simulate connection process
    toast({
      title: 'Conectando...',
      description: 'Redirigiendo a WhatsApp Business API',
    });
    // In real implementation, this would redirect to WhatsApp Business verification
    setTimeout(() => {
      setIsConnected(true);
      toast({
        title: 'Conectado',
        description: 'WhatsApp Business API conectado exitosamente',
      });
    }, 2000);
  };

  const submitTemplate = (templateData: WhatsAppTemplate) => {
    toast({
      title: 'Plantilla enviada',
      description: 'Su plantilla ha sido enviada para revisión. Puede tomar hasta 24 horas.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-green-600" />
              <CardTitle>WhatsApp Business API</CardTitle>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Para enviar notificaciones por WhatsApp, necesita conectar su cuenta de WhatsApp Business API.
                  Esto requiere una verificación por parte de Meta.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>Pasos para configurar WhatsApp Business API:</Label>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>Cree una cuenta de WhatsApp Business</li>
                    <li>Verifique su número de teléfono comercial</li>
                    <li>Configure su perfil de negocio</li>
                    <li>Complete la verificación de Meta</li>
                    <li>Obtenga sus credenciales de API</li>
                  </ol>
                </div>

                <Button onClick={connectWhatsApp} className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Conectar WhatsApp Business
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm">WhatsApp Business API conectado exitosamente</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Número de teléfono</Label>
                  <p className="font-medium">+1 (787) 555-0123</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nombre del negocio</Label>
                  <p className="font-medium">PRMCMS</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado de verificación</Label>
                  <p className="font-medium text-green-600">Verificado</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Limite de mensajes</Label>
                  <p className="font-medium">1,000 / día</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList>
            <TabsTrigger value="templates">Plantillas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            {/* Template Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Plantillas de Mensaje</CardTitle>
                  <Button>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Nueva Plantilla
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Todas las plantillas de WhatsApp deben ser pre-aprobadas por Meta antes de poder ser utilizadas.
                    El proceso de aprobación puede tomar hasta 24 horas.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{template.name}</span>
                            <Badge variant="outline">{template.language.toUpperCase()}</Badge>
                            <Badge variant="outline">{template.category}</Badge>
                          </div>
                          {getStatusBadge(template.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">CONTENIDO:</Label>
                            <div className="bg-muted p-3 rounded text-sm font-mono">
                              {template.content}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              {template.lastUsed ? `Último uso: ${template.lastUsed}` : 'Nunca usado'}
                            </span>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(template.content)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {template.status === 'rejected' && (
                            <Alert variant="destructive">
                              <AlertDescription className="text-sm">
                                Plantilla rechazada. Razón: Contenido promocional no permitido en categoría UTILITY.
                                Cambie a categoría MARKETING o modifique el contenido.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* WhatsApp Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configuración de WhatsApp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Mensajes automáticos</Label>
                      <p className="text-xs text-muted-foreground">
                        Permitir el envío automático de mensajes de WhatsApp
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Respuestas automáticas</Label>
                      <p className="text-xs text-muted-foreground">
                        Responder automáticamente a mensajes recibidos
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Webhooks</Label>
                      <p className="text-xs text-muted-foreground">
                        Recibir notificaciones de estado de mensajes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>URL del Webhook</Label>
                    <div className="flex gap-2">
                      <Input
                        value="https://your-domain.com/webhooks/whatsapp"
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Token de verificación</Label>
                    <div className="flex gap-2">
                      <Input
                        value="your-verification-token-here"
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* WhatsApp Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mensajes Enviados</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">Últimos 30 días</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasa de Entrega</CardTitle>
                  <Check className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.2%</div>
                  <p className="text-xs text-muted-foreground">1,163 entregados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Respuestas</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23.1%</div>
                  <p className="text-xs text-muted-foreground">269 respuestas</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Plantilla</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.filter(t => t.status === 'approved').map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Enviados: 456 • Entregados: 432 • Respuestas: 89
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">94.7%</p>
                        <p className="text-xs text-muted-foreground">Tasa de entrega</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}