import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { Eye, Code, Palette } from 'lucide-react';
import DOMPurify from 'dompurify';
import { AriaInput } from '@/components/ui/aria-components';

interface NotificationTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: unknown;
  onSuccess: () => void;
}

const availableVariables = [
  { name: 'customer_name', description: 'Nombre del cliente' },
  { name: 'tracking_number', description: 'Número de rastreo' },
  { name: 'carrier', description: 'Transportista' },
  { name: 'size', description: 'Tamaño del paquete' },
  { name: 'arrival_date', description: 'Fecha de llegada' },
  { name: 'mailbox_number', description: 'Número de buzón' },
  { name: 'expiry_date', description: 'Fecha de vencimiento' },
  { name: 'office_phone', description: 'Teléfono de oficina' },
  { name: 'office_email', description: 'Email de oficina' },
  { name: 'package_count', description: 'Cantidad de paquetes' },
  { name: 'amount_due', description: 'Monto adeudado' },
  { name: 'due_date', description: 'Fecha de vencimiento de pago' }
];

export function NotificationTemplateDialog({ 
  open, 
  onOpenChange, 
  template, 
  onSuccess 
}: NotificationTemplateDialogProps) {
  const { createTemplate, updateTemplate, isCreatingTemplate, isUpdatingTemplate } = useNotificationSystem();
  const [activeTab, setActiveTab] = useState('content');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'email' as 'email' | 'sms' | 'whatsapp' | 'push',
    language: 'es' as 'en' | 'es',
    subject: '',
    content: '',
    variables: [] as string[],
    variant_name: 'A',
    test_percentage: 100,
    is_default: false,
    category: ''
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        description: template.description || '',
        type: template.type || 'email',
        language: template.language || 'es',
        subject: template.subject || '',
        content: template.content || '',
        variables: template.variables || [],
        variant_name: template.variant_name || 'A',
        test_percentage: template.test_percentage || 100,
        is_default: template.is_default || false,
        category: template.category || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'email',
        language: 'es',
        subject: '',
        content: '',
        variables: [],
        variant_name: 'A',
        test_percentage: 100,
        is_default: false,
        category: ''
      });
    }
  }, [template, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (template) {
      updateTemplate({ id: template.id, updates: formData });
    } else {
      createTemplate(formData as any);
    }
    onSuccess();
  };

  const addVariable = (variableName: string) => {
    if (!formData.variables.includes(variableName)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, variableName]
      }));
    }
  };

  const removeVariable = (variableName: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variableName)
    }));
  };

  const insertVariable = (variableName: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + `{{${variableName}}}` + after;
      
      setFormData(prev => ({ ...prev, content: newText }));
      addVariable(variableName);
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variableName.length + 4, start + variableName.length + 4);
      }, 0);
    }
  };

  const renderPreview = () => {
    let previewContent = formData.content;
    formData.variables.forEach(variable => {
      const sampleData: Record<string, string> = {
        customer_name: 'Juan Pérez',
        tracking_number: 'ABC123456',
        carrier: 'UPS',
        size: 'Medium',
        arrival_date: new Date().toLocaleDateString('es-PR'),
        mailbox_number: '123',
        expiry_date: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('es-PR'),
        office_phone: '(787) 555-0123',
        office_email: 'info@prmcms.com',
        package_count: '2',
        amount_due: '$25.00',
        due_date: new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('es-PR')
      };
      
      previewContent = previewContent.replace(
        new RegExp(`{{${variable}}}`, 'g'),
        sampleData[variable] || `[${variable}]`
      );
    });

    return previewContent;
  };

  const getSMSCharacterCount = () => {
    const previewText = renderPreview().replace(/<[^>]*>/g, ''); // Remove HTML tags
    return previewText.length;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Editar Plantilla de Notificación' : 'Nueva Plantilla de Notificación'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Contenido
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Configuración
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Vista Previa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Content Editor */}
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contenido del Mensaje</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {formData.type === 'email' && (
                        <AriaInput
                          label="Asunto del Email"
                          value={formData.subject}
                          onChange={(e) => setFormData(prev => ({ ...prev, subject: (e.target as HTMLInputElement).value }))}
                          placeholder="Ej: Su paquete ha llegado - {{customer_name}}"
                        />
                      )}
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor="content">
                            Contenido del mensaje {formData.type === 'sms' && `(${getSMSCharacterCount()}/160 caracteres)`}
                          </Label>
                          {formData.type === 'sms' && getSMSCharacterCount() > 160 && (
                            <Badge variant="destructive" className="text-xs">
                              ¡Excede el límite de SMS!
                            </Badge>
                          )}
                        </div>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                          placeholder={
                            formData.type === 'email' 
                              ? "Estimado/a {{customer_name}},<br><br>Su paquete {{tracking_number}} ha llegado..."
                              : "Hola {{customer_name}}, su paquete {{tracking_number}} está disponible para recoger."
                          }
                          rows={formData.type === 'email' ? 12 : 4}
                          className="font-mono text-sm"
                          required
                        />
                        {formData.type === 'email' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Puedes usar HTML básico como &lt;br&gt;, &lt;strong&gt;, &lt;em&gt;
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Variables Panel */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Variables Disponibles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {availableVariables.map((variable) => (
                          <div
                            key={variable.name}
                            className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted"
                            onClick={() => insertVariable(variable.name)}
                          >
                            <div>
                              <p className="text-sm font-medium">{variable.name}</p>
                              <p className="text-xs text-muted-foreground">{variable.description}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                insertVariable(variable.name);
                              }}
                            >
                              +
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {formData.variables.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Variables en Uso</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {formData.variables.map((variable) => (
                            <Badge
                              key={variable}
                              variant="secondary"
                              className="text-xs cursor-pointer"
                              onClick={() => removeVariable(variable)}
                            >
                              {variable} ×
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información Básica</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AriaInput
                      label="Nombre de la plantilla *"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: (e.target as HTMLInputElement).value }))}
                      placeholder="Ej: Notificación de llegada de paquete"
                      required
                    />
                    
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe cuándo se usa esta plantilla"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Categoría</Label>
                      <Select 
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="arrival">Llegada de paquete</SelectItem>
                          <SelectItem value="reminder">Recordatorio</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                          <SelectItem value="payment">Pagos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Configuración</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="type">Tipo de mensaje *</Label>
                      <Select 
                        value={formData.type}
                        onValueChange={(value: unknown) => setFormData(prev => ({ ...prev, type: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">📧 Email</SelectItem>
                          <SelectItem value="sms">📱 SMS</SelectItem>
                          <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
                          <SelectItem value="push">🔔 Push</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="language">Idioma</Label>
                      <Select 
                        value={formData.language}
                        onValueChange={(value: unknown) => setFormData(prev => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">🇪🇸 Español</SelectItem>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_default"
                        checked={formData.is_default}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
                      />
                      <Label htmlFor="is_default">Plantilla predeterminada</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vista Previa del Mensaje</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Esta es una simulación de cómo se verá el mensaje final
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    {formData.type === 'email' && formData.subject && (
                      <div className="mb-4">
                        <Label className="text-xs text-muted-foreground">ASUNTO:</Label>
                        <p className="font-semibold">{formData.subject.replace(/{{(\w+)}}/g, (match, variable) => {
                          const sampleData: Record<string, string> = {
                            customer_name: 'Juan Pérez',
                            tracking_number: 'ABC123456'
                          };
                          return sampleData[variable] || match;
                        })}</p>
                      </div>
                    )}
                    
                    <div className="whitespace-pre-wrap">
                      {formData.type === 'email' ? (
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderPreview(), { ALLOWED_TAGS: ['br','strong','em','b','i','p','ul','ol','li','a'], ALLOWED_ATTR: ['href','target','rel'] }) }} />
                      ) : (
                        <p className="text-sm">{renderPreview()}</p>
                      )}
                    </div>
                  </div>
                  
                  {formData.type === 'sms' && (
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>Caracteres: {getSMSCharacterCount()}/160</p>
                      <p>Mensajes SMS: {Math.ceil(getSMSCharacterCount() / 160)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isCreatingTemplate || isUpdatingTemplate}
            >
              {template ? 'Actualizar Plantilla' : 'Crear Plantilla'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}