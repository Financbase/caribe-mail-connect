import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Clock, 
  Calendar,
  Settings,
  Save,
  ArrowLeft,
  Phone,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PortalNotificationsProps {
  customerData: unknown;
  onNavigate: (page: string) => void;
}

interface NotificationSettings {
  email_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  package_arrival: boolean;
  package_ready: boolean;
  package_delivered: boolean;
  mail_hold_expiry: boolean;
  account_updates: boolean;
  preferred_time: string;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

export default function PortalNotifications({ customerData, onNavigate }: PortalNotificationsProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('preferences');
  const { toast } = useToast();

  const [settings, setSettings] = useState<NotificationSettings>({
    email_enabled: true,
    sms_enabled: false,
    whatsapp_enabled: false,
    package_arrival: true,
    package_ready: true,
    package_delivered: false,
    mail_hold_expiry: true,
    account_updates: true,
    preferred_time: 'morning',
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
  });

  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '',
    service: '',
    notes: '',
  });

  const [mailHoldForm, setMailHoldForm] = useState({
    start_date: '',
    end_date: '',
    forward_address: '',
    reason: '',
  });

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // TODO: Save notification settings to database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: 'Configuración guardada',
        description: 'Sus preferencias de notificación han sido actualizadas',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la configuración',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const scheduleAppointment = async () => {
    try {
      setSaving(true);
      
      if (!appointmentForm.date || !appointmentForm.time || !appointmentForm.service) {
        toast({
          title: 'Campos requeridos',
          description: 'Complete todos los campos obligatorios',
          variant: 'destructive',
        });
        return;
      }

      // TODO: Save appointment to database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: 'Cita programada',
        description: `Su cita para ${appointmentForm.service} ha sido programada para ${appointmentForm.date} a las ${appointmentForm.time}`,
      });
      
      setAppointmentForm({ date: '', time: '', service: '', notes: '' });
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        title: 'Error',
        description: 'No se pudo programar la cita',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const requestMailHold = async () => {
    try {
      setSaving(true);
      
      if (!mailHoldForm.start_date || !mailHoldForm.end_date) {
        toast({
          title: 'Campos requeridos',
          description: 'Seleccione las fechas de inicio y fin',
          variant: 'destructive',
        });
        return;
      }

      // TODO: Save mail hold request to database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: 'Solicitud enviada',
        description: 'Su solicitud de retención de correo ha sido enviada',
      });
      
      setMailHoldForm({ start_date: '', end_date: '', forward_address: '', reason: '' });
    } catch (error) {
      console.error('Error requesting mail hold:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar la solicitud',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Avisos y Servicios</h1>
          <p className="text-sm text-muted-foreground">
            Configure sus preferencias y solicite servicios
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'preferences' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('preferences')}
          className="flex-1"
        >
          <Bell className="w-4 h-4 mr-2" />
          Avisos
        </Button>
        <Button
          variant={activeTab === 'appointments' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('appointments')}
          className="flex-1"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Citas
        </Button>
        <Button
          variant={activeTab === 'mailhold' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('mailhold')}
          className="flex-1"
        >
          <Mail className="w-4 h-4 mr-2" />
          Correo
        </Button>
      </div>

      {/* Notification Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* Notification Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Métodos de Notificación
              </CardTitle>
              <CardDescription>
                Seleccione cómo desea recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <Label>Email</Label>
                </div>
                <Switch
                  checked={settings.email_enabled}
                  onCheckedChange={(checked) => setSettings({...settings, email_enabled: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <Label>SMS</Label>
                </div>
                <Switch
                  checked={settings.sms_enabled}
                  onCheckedChange={(checked) => setSettings({...settings, sms_enabled: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <Label>WhatsApp</Label>
                </div>
                <Switch
                  checked={settings.whatsapp_enabled}
                  onCheckedChange={(checked) => setSettings({...settings, whatsapp_enabled: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Notificaciones</CardTitle>
              <CardDescription>
                Seleccione qué eventos desea recibir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Llegada de Paquetes</Label>
                  <p className="text-sm text-muted-foreground">
                    Cuando llegue un nuevo paquete
                  </p>
                </div>
                <Switch
                  checked={settings.package_arrival}
                  onCheckedChange={(checked) => setSettings({...settings, package_arrival: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Listo para Recoger</Label>
                  <p className="text-sm text-muted-foreground">
                    Cuando su paquete esté listo
                  </p>
                </div>
                <Switch
                  checked={settings.package_ready}
                  onCheckedChange={(checked) => setSettings({...settings, package_ready: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Paquete Entregado</Label>
                  <p className="text-sm text-muted-foreground">
                    Confirmación de entrega
                  </p>
                </div>
                <Switch
                  checked={settings.package_delivered}
                  onCheckedChange={(checked) => setSettings({...settings, package_delivered: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Actualizaciones de Cuenta</Label>
                  <p className="text-sm text-muted-foreground">
                    Cambios importantes en su cuenta
                  </p>
                </div>
                <Switch
                  checked={settings.account_updates}
                  onCheckedChange={(checked) => setSettings({...settings, account_updates: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Timing Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Horarios Preferidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Horario Preferido</Label>
                <Select 
                  value={settings.preferred_time} 
                  onValueChange={(value) => setSettings({...settings, preferred_time: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Mañana (8:00 AM - 12:00 PM)</SelectItem>
                    <SelectItem value="afternoon">Tarde (12:00 PM - 6:00 PM)</SelectItem>
                    <SelectItem value="evening">Noche (6:00 PM - 10:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Silenciar Desde</Label>
                  <Input
                    type="time"
                    value={settings.quiet_hours_start}
                    onChange={(e) => setSettings({...settings, quiet_hours_start: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Silenciar Hasta</Label>
                  <Input
                    type="time"
                    value={settings.quiet_hours_end}
                    onChange={(e) => setSettings({...settings, quiet_hours_end: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={saveSettings} disabled={saving} className="w-full">
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Programar Cita
              </CardTitle>
              <CardDescription>
                Programe una cita para servicios especiales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label>Hora</Label>
                  <Select 
                    value={appointmentForm.time} 
                    onValueChange={(value) => setAppointmentForm({...appointmentForm, time: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar hora" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Servicio</Label>
                <Select 
                  value={appointmentForm.service} 
                  onValueChange={(value) => setAppointmentForm({...appointmentForm, service: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="package_pickup">Recogida de Paquetes</SelectItem>
                    <SelectItem value="document_signing">Firma de Documentos</SelectItem>
                    <SelectItem value="notarization">Notarización</SelectItem>
                    <SelectItem value="consultation">Consulta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Notas (opcional)</Label>
                <Textarea
                  placeholder="Información adicional sobre su cita..."
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
                />
              </div>
              
              <Button onClick={scheduleAppointment} disabled={saving} className="w-full">
                {saving ? 'Programando...' : 'Programar Cita'}
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Citas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No hay citas programadas</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mail Hold Tab */}
      {activeTab === 'mailhold' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Retención de Correo
              </CardTitle>
              <CardDescription>
                Solicite retener su correo temporalmente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Información importante:</p>
                    <p>La retención de correo debe solicitarse con al menos 24 horas de anticipación.</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha de Inicio</Label>
                  <Input
                    type="date"
                    value={mailHoldForm.start_date}
                    onChange={(e) => setMailHoldForm({...mailHoldForm, start_date: e.target.value})}
                    min={new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label>Fecha de Fin</Label>
                  <Input
                    type="date"
                    value={mailHoldForm.end_date}
                    onChange={(e) => setMailHoldForm({...mailHoldForm, end_date: e.target.value})}
                    min={mailHoldForm.start_date || new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div>
                <Label>Dirección de Reenvío (opcional)</Label>
                <Textarea
                  placeholder="Si desea que su correo sea reenviado a otra dirección..."
                  value={mailHoldForm.forward_address}
                  onChange={(e) => setMailHoldForm({...mailHoldForm, forward_address: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Motivo</Label>
                <Select 
                  value={mailHoldForm.reason} 
                  onValueChange={(value) => setMailHoldForm({...mailHoldForm, reason: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacaciones</SelectItem>
                    <SelectItem value="travel">Viaje de Trabajo</SelectItem>
                    <SelectItem value="temporary_relocation">Reubicación Temporal</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={requestMailHold} disabled={saving} className="w-full">
                {saving ? 'Enviando Solicitud...' : 'Solicitar Retención'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}