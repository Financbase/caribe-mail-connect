import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { NotificationPreferences } from '@/types/notifications';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface NotificationPreferencesProps {
  preferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => void;
}

const NotificationPreferencesComponent = ({ preferences, onSave }: NotificationPreferencesProps) => {
  const { language } = useLanguage();
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);

  const handleSave = () => {
    onSave(localPreferences);
    toast({
      title: language === 'en' ? 'Preferences saved' : 'Preferencias guardadas',
      description: language === 'en' 
        ? 'Notification preferences have been updated' 
        : 'Las preferencias de notificación han sido actualizadas'
    });
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean | string) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📢 {language === 'en' ? 'Notification Preferences' : 'Preferencias de Notificación'}
        </CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'Choose how you want to receive package notifications'
            : 'Elige cómo quieres recibir las notificaciones de paquetes'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms" className="text-base font-medium">
                💬 {language === 'en' ? 'SMS Messages' : 'Mensajes SMS'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? 'Receive text messages for package updates'
                  : 'Recibe mensajes de texto para actualizaciones de paquetes'}
              </p>
            </div>
            <Switch
              id="sms"
              checked={localPreferences.sms}
              onCheckedChange={(checked) => updatePreference('sms', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email" className="text-base font-medium">
                📧 {language === 'en' ? 'Email Notifications' : 'Notificaciones por Email'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? 'Receive detailed email notifications'
                  : 'Recibe notificaciones detalladas por email'}
              </p>
            </div>
            <Switch
              id="email"
              checked={localPreferences.email}
              onCheckedChange={(checked) => updatePreference('email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="whatsapp" className="text-base font-medium">
                📱 {language === 'en' ? 'WhatsApp Messages' : 'Mensajes de WhatsApp'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? 'Receive WhatsApp messages for quick updates'
                  : 'Recibe mensajes de WhatsApp para actualizaciones rápidas'}
              </p>
            </div>
            <Switch
              id="whatsapp"
              checked={localPreferences.whatsapp}
              onCheckedChange={(checked) => updatePreference('whatsapp', checked)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">
            🌐 {language === 'en' ? 'Preferred Language' : 'Idioma Preferido'}
          </Label>
          <Select 
            value={localPreferences.language} 
            onValueChange={(value: 'en' | 'es') => updatePreference('language', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇺🇸 English</SelectItem>
              <SelectItem value="es">🇪🇸 Español</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {language === 'en' 
              ? 'Choose the language for your notifications'
              : 'Elige el idioma para tus notificaciones'}
          </p>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleSave} className="w-full">
            {language === 'en' ? 'Save Preferences' : 'Guardar Preferencias'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferencesComponent;