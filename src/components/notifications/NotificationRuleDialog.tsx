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
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { Mail, MessageSquare, Smartphone, Bell } from 'lucide-react';

interface NotificationRule {
  id?: string;
  name: string;
  description: string;
  trigger_type: string;
  conditions: Record<string, unknown>;
  channels: Record<string, boolean>;
  delay_minutes: number;
  is_active: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

interface NotificationRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: NotificationRule;
  onSuccess: () => void;
}

const triggerTypes = [
  { value: 'package_arrival', label: 'Llegada de paquete', icon: '📦' },
  { value: 'package_age', label: 'Paquete sin recoger', icon: '⏰' },
  { value: 'mailbox_expiry', label: 'Vencimiento de buzón', icon: '📮' },
  { value: 'payment_due', label: 'Pago vencido', icon: '💳' }
];

export function NotificationRuleDialog({ 
  open, 
  onOpenChange, 
  rule, 
  onSuccess 
}: NotificationRuleDialogProps) {
  const { createRule, updateRule, isCreatingRule, isUpdatingRule } = useNotificationSystem();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger_type: '',
    conditions: {},
    channels: { email: true, sms: false, whatsapp: false, push: false },
    delay_minutes: 0,
    is_active: true,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00'
  });

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name || '',
        description: rule.description || '',
        trigger_type: rule.trigger_type || '',
        conditions: rule.conditions || {},
        channels: rule.channels || { email: true, sms: false, whatsapp: false, push: false },
        delay_minutes: rule.delay_minutes || 0,
        is_active: rule.is_active ?? true,
        quiet_hours_start: rule.quiet_hours_start || '22:00',
        quiet_hours_end: rule.quiet_hours_end || '08:00'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        trigger_type: '',
        conditions: {},
        channels: { email: true, sms: false, whatsapp: false, push: false },
        delay_minutes: 0,
        is_active: true,
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00'
      });
    }
  }, [rule, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rule) {
      updateRule({ id: rule.id, updates: formData });
    } else {
      createRule(formData);
    }
    onSuccess();
  };

  const updateChannel = (channel: string, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      channels: { ...prev.channels, [channel]: enabled }
    }));
  };

  const updateCondition = (key: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      conditions: { ...prev.conditions, [key]: value }
    }));
  };

  const renderConditionFields = () => {
    switch (formData.trigger_type) {
      case 'package_age':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="age_days">Días sin recoger</Label>
              <Input
                id="age_days"
                type="number"
                min="1"
                value={(formData.conditions as any).age_days || 3}
                onChange={(e) => updateCondition('age_days', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="customer_type">Tipo de cliente (opcional)</Label>
              <Select 
                value={(formData.conditions as any).customer_type || ''}
                onValueChange={(value) => updateCondition('customer_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los clientes</SelectItem>
                  <SelectItem value="act60">Solo Act 60</SelectItem>
                  <SelectItem value="regular">Solo regulares</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'mailbox_expiry':
        return (
          <div>
            <Label htmlFor="days_before">Días antes del vencimiento</Label>
            <Input
              id="days_before"
              type="number"
              min="1"
              value={(formData.conditions as any).days_before || 30}
              onChange={(e) => updateCondition('days_before', parseInt(e.target.value))}
            />
          </div>
        );
      
      case 'payment_due':
        return (
          <div>
            <Label htmlFor="days_overdue">Días de morosidad</Label>
            <Input
              id="days_overdue"
              type="number"
              min="1"
              value={(formData.conditions as any).days_overdue || 1}
              onChange={(e) => updateCondition('days_overdue', parseInt(e.target.value))}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {rule ? 'Editar Regla de Notificación' : 'Nueva Regla de Notificación'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la regla *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Recordatorio después de 3 días"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe cuándo y cómo se activará esta regla"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Regla activa</Label>
              </div>
            </CardContent>
          </Card>

          {/* Trigger Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuración del Disparador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="trigger_type">Tipo de disparador *</Label>
                <Select 
                  value={formData.trigger_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, trigger_type: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un disparador" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map((trigger) => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        <div className="flex items-center gap-2">
                          <span>{trigger.icon}</span>
                          <span>{trigger.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.trigger_type && (
                <div>
                  <Label>Condiciones específicas</Label>
                  <div className="mt-2">
                    {renderConditionFields()}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="delay_minutes">Retraso (minutos)</Label>
                <Input
                  id="delay_minutes"
                  type="number"
                  min="0"
                  value={formData.delay_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, delay_minutes: parseInt(e.target.value) || 0 }))}
                  placeholder="0 para envío inmediato"
                />
              </div>
            </CardContent>
          </Card>

          {/* Channel Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Canales de Notificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span>Email</span>
                  </div>
                  <Switch
                    checked={formData.channels.email}
                    onCheckedChange={(checked) => updateChannel('email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-500" />
                    <span>SMS</span>
                  </div>
                  <Switch
                    checked={formData.channels.sms}
                    onCheckedChange={(checked) => updateChannel('sms', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-green-600" />
                    <span>WhatsApp</span>
                  </div>
                  <Switch
                    checked={formData.channels.whatsapp}
                    onCheckedChange={(checked) => updateChannel('whatsapp', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-500" />
                    <span>Push</span>
                  </div>
                  <Switch
                    checked={formData.channels.push}
                    onCheckedChange={(checked) => updateChannel('push', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Horario de Silencio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quiet_hours_start">Inicio</Label>
                  <Input
                    id="quiet_hours_start"
                    type="time"
                    value={formData.quiet_hours_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, quiet_hours_start: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="quiet_hours_end">Final</Label>
                  <Input
                    id="quiet_hours_end"
                    type="time"
                    value={formData.quiet_hours_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, quiet_hours_end: e.target.value }))}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Las notificaciones no se enviarán durante este horario
              </p>
            </CardContent>
          </Card>

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
              disabled={isCreatingRule || isUpdatingRule}
            >
              {rule ? 'Actualizar Regla' : 'Crear Regla'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}