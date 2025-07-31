import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIntegrations, Integration } from '@/hooks/useIntegrations';
import { MessageSquare, Mail, Phone, Users, Slack, Settings, Eye, EyeOff, Send } from 'lucide-react';

interface CommunicationIntegrationsProps {
  integrations: Integration[];
}

export function CommunicationIntegrations({ integrations }: CommunicationIntegrationsProps) {
  const { language } = useLanguage();
  const { updateIntegration, testConnection, isUpdatingIntegration, isTestingConnection } = useIntegrations();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{ [key: string]: Record<string, string> }>({});
  const [showCredentials, setShowCredentials] = useState<{ [key: string]: boolean }>({});
  const [testMessage, setTestMessage] = useState('');

  const communicationConfigs = {
    twilio: {
      icon: <Phone className="h-6 w-6" />,
      color: 'border-red-200 bg-red-50',
      iconColor: 'text-red-600',
      fields: [
        { key: 'account_sid', label: 'Account SID', type: 'text', required: true },
        { key: 'auth_token', label: 'Auth Token', type: 'password', required: true },
        { key: 'phone_number', label: 'Phone Number', type: 'text', required: true, placeholder: '+1234567890' },
        { key: 'messaging_service_sid', label: 'Messaging Service SID', type: 'text', required: false }
      ]
    },
    sendgrid: {
      icon: <Mail className="h-6 w-6" />,
      color: 'border-blue-200 bg-blue-50',
      iconColor: 'text-blue-600',
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password', required: true },
        { key: 'from_email', label: 'From Email', type: 'email', required: true },
        { key: 'from_name', label: 'From Name', type: 'text', required: true },
        { key: 'reply_to_email', label: 'Reply-To Email', type: 'email', required: false }
      ]
    },
    whatsapp: {
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'border-green-200 bg-green-50',
      iconColor: 'text-green-600',
      fields: [
        { key: 'phone_number_id', label: 'Phone Number ID', type: 'text', required: true },
        { key: 'access_token', label: 'Access Token', type: 'password', required: true },
        { key: 'webhook_verify_token', label: 'Webhook Verify Token', type: 'password', required: true },
        { key: 'business_account_id', label: 'Business Account ID', type: 'text', required: true }
      ]
    },
    teams: {
      icon: <Users className="h-6 w-6" />,
      color: 'border-purple-200 bg-purple-50',
      iconColor: 'text-purple-600',
      fields: [
        { key: 'tenant_id', label: 'Tenant ID', type: 'text', required: true },
        { key: 'client_id', label: 'Client ID', type: 'text', required: true },
        { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
        { key: 'webhook_url', label: 'Webhook URL', type: 'url', required: false }
      ]
    },
    slack: {
      icon: <Slack className="h-6 w-6" />,
      color: 'border-orange-200 bg-orange-50',
      iconColor: 'text-orange-600',
      fields: [
        { key: 'bot_token', label: 'Bot User OAuth Token', type: 'password', required: true },
        { key: 'signing_secret', label: 'Signing Secret', type: 'password', required: true },
        { key: 'channel', label: 'Default Channel', type: 'text', required: true, placeholder: '#general' },
        { key: 'webhook_url', label: 'Webhook URL', type: 'url', required: false }
      ]
    }
  };

  const handleCredentialChange = (integrationId: string, field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        [field]: value
      }
    }));
  };

  const handleSaveCredentials = async (integration: Integration) => {
    const updatedCredentials = credentials[integration.id] || {};
    await updateIntegration({
      id: integration.id,
      credentials: updatedCredentials,
      is_active: true
    });
    setSelectedIntegration(null);
  };

  const toggleCredentialVisibility = (integrationId: string, field: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [`${integrationId}_${field}`]: !prev[`${integrationId}_${field}`]
    }));
  };

  const handleSendTestMessage = async (integration: Integration) => {
    if (!testMessage.trim()) return;
    
    console.log(`Sending test message via ${integration.service_name}:`, testMessage);
    // This would call an edge function to send a test message
    setTestMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'en' ? 'Communication Platform Integrations' : 'Integraciones de Plataformas de Comunicación'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Configure messaging and notification services for customer communication and team alerts'
              : 'Configurar servicios de mensajería y notificaciones para comunicación con clientes y alertas del equipo'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const config = communicationConfigs[integration.service_name as keyof typeof communicationConfigs];
          if (!config) return null;

          const isSelected = selectedIntegration === integration.id;
          const integrationCredentials = credentials[integration.id] || integration.credentials || {};

          return (
            <Card key={integration.id} className={`${config.color} transition-all duration-200 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${config.color}`}>
                      <div className={config.iconColor}>
                        {config.icon}
                      </div>
                    </div>
                    <div>
                      <CardTitle>{integration.display_name}</CardTitle>
                      <CardDescription>
                        {integration.service_name === 'twilio' && (language === 'en' ? 'SMS & Voice' : 'SMS y Voz')}
                        {integration.service_name === 'sendgrid' && (language === 'en' ? 'Email Service' : 'Servicio de Email')}
                        {integration.service_name === 'whatsapp' && (language === 'en' ? 'WhatsApp Business' : 'WhatsApp Business')}
                        {integration.service_name === 'teams' && (language === 'en' ? 'Microsoft Teams' : 'Microsoft Teams')}
                        {integration.service_name === 'slack' && (language === 'en' ? 'Slack Workspace' : 'Espacio de Trabajo Slack')}
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={integration.is_active}
                    onCheckedChange={(checked) => 
                      updateIntegration({ id: integration.id, is_active: checked })
                    }
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Connection Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Status' : 'Estado'}
                  </span>
                  <Badge variant={integration.is_connected ? 'default' : 'secondary'}>
                    {integration.is_connected 
                      ? (language === 'en' ? 'Connected' : 'Conectado')
                      : (language === 'en' ? 'Not Configured' : 'No Configurado')
                    }
                  </Badge>
                </div>

                {/* Features */}
                <div>
                  <Label className="text-sm font-medium">
                    {language === 'en' ? 'Capabilities' : 'Capacidades'}
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {integration.configuration.features?.map((feature: string) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Configuration */}
                {isSelected ? (
                  <div className="space-y-4 border-t pt-4">
                    <Label className="text-sm font-medium">
                      {language === 'en' ? 'API Configuration' : 'Configuración API'}
                    </Label>
                    
                    {config.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={`${integration.id}_${field.key}`}>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        
                        <div className="relative">
                          <Input
                            id={`${integration.id}_${field.key}`}
                            type={field.type === 'password' && !showCredentials[`${integration.id}_${field.key}`] ? 'password' : field.type}
                            value={integrationCredentials[field.key] || ''}
                            onChange={(e) => handleCredentialChange(integration.id, field.key, e.target.value)}
                            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                          />
                          {field.type === 'password' && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => toggleCredentialVisibility(integration.id, field.key)}
                            >
                              {showCredentials[`${integration.id}_${field.key}`] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleSaveCredentials(integration)}
                        disabled={isUpdatingIntegration}
                        className="flex-1"
                      >
                        {language === 'en' ? 'Save Configuration' : 'Guardar Configuración'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedIntegration(null)}
                      >
                        {language === 'en' ? 'Cancel' : 'Cancelar'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedIntegration(integration.id)}
                        className="flex-1"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'Configure' : 'Configurar'}
                      </Button>
                      
                      {integration.is_active && integration.is_connected && (
                        <Button
                          variant="outline"
                          onClick={() => testConnection(integration.id)}
                          disabled={isTestingConnection}
                        >
                          {language === 'en' ? 'Test' : 'Probar'}
                        </Button>
                      )}
                    </div>

                    {/* Test Message */}
                    {integration.is_active && integration.is_connected && (
                      <div className="space-y-2 border-t pt-3">
                        <Label className="text-sm font-medium">
                          {language === 'en' ? 'Send Test Message' : 'Enviar Mensaje de Prueba'}
                        </Label>
                        <div className="flex gap-2">
                          <Textarea
                            value={testMessage}
                            onChange={(e) => setTestMessage(e.target.value)}
                            placeholder={language === 'en' ? 'Enter test message...' : 'Ingresa mensaje de prueba...'}
                            className="flex-1"
                            rows={2}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSendTestMessage(integration)}
                            disabled={!testMessage.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {integration.last_error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{integration.last_error}</p>
                  </div>
                )}

                {integration.webhook_url && (
                  <div className="text-xs text-muted-foreground break-all">
                    <strong>{language === 'en' ? 'Webhook URL:' : 'URL del Webhook:'}</strong> {integration.webhook_url}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}