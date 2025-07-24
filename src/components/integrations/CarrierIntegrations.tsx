import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIntegrations, Integration } from '@/hooks/useIntegrations';
import { Truck, Package, MapPin, Clock, Settings, Eye, EyeOff } from 'lucide-react';

interface CarrierIntegrationsProps {
  integrations: Integration[];
}

export function CarrierIntegrations({ integrations }: CarrierIntegrationsProps) {
  const { language } = useLanguage();
  const { updateIntegration, testConnection, syncIntegration, isUpdatingIntegration, isTestingConnection, isSyncingIntegration } = useIntegrations();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{ [key: string]: any }>({});
  const [showCredentials, setShowCredentials] = useState<{ [key: string]: boolean }>({});

  const carrierConfigs = {
    ups: {
      icon: <Truck className="h-6 w-6" />,
      color: 'border-amber-200 bg-amber-50',
      iconColor: 'text-amber-600',
      fields: [
        { key: 'client_id', label: 'Client ID', type: 'text', required: true },
        { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
        { key: 'account_number', label: 'Account Number', type: 'text', required: true },
        { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'], required: true }
      ]
    },
    fedex: {
      icon: <Package className="h-6 w-6" />,
      color: 'border-purple-200 bg-purple-50',
      iconColor: 'text-purple-600',
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password', required: true },
        { key: 'secret_key', label: 'Secret Key', type: 'password', required: true },
        { key: 'account_number', label: 'Account Number', type: 'text', required: true },
        { key: 'meter_number', label: 'Meter Number', type: 'text', required: true },
        { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'], required: true }
      ]
    },
    usps: {
      icon: <MapPin className="h-6 w-6" />,
      color: 'border-blue-200 bg-blue-50',
      iconColor: 'text-blue-600',
      fields: [
        { key: 'client_id', label: 'Client ID', type: 'text', required: true },
        { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
        { key: 'customer_registration_id', label: 'Customer Registration ID', type: 'text', required: true },
        { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'], required: true }
      ]
    },
    dhl: {
      icon: <Clock className="h-6 w-6" />,
      color: 'border-red-200 bg-red-50',
      iconColor: 'text-red-600',
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password', required: true },
        { key: 'api_secret', label: 'API Secret', type: 'password', required: true },
        { key: 'account_number', label: 'Account Number', type: 'text', required: true },
        { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'], required: true }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'en' ? 'Carrier Integrations' : 'Integraciones de Transportistas'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Connect with shipping carriers to automate tracking and delivery updates'
              : 'Conectar con transportistas para automatizar el seguimiento y actualizaciones de entrega'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const config = carrierConfigs[integration.service_name as keyof typeof carrierConfigs];
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
                      <CardDescription className="capitalize">
                        {integration.service_name.toUpperCase()} {language === 'en' ? 'Integration' : 'Integración'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={integration.is_connected ? 'default' : 'secondary'}>
                      {integration.is_connected 
                        ? (language === 'en' ? 'Connected' : 'Conectado')
                        : (language === 'en' ? 'Disconnected' : 'Desconectado')
                      }
                    </Badge>
                    <Switch
                      checked={integration.is_active}
                      onCheckedChange={(checked) => 
                        updateIntegration({ id: integration.id, is_active: checked })
                      }
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div>
                  <Label className="text-sm font-medium">
                    {language === 'en' ? 'Features' : 'Características'}
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
                        
                        {field.type === 'select' ? (
                          <select
                            id={`${integration.id}_${field.key}`}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={integrationCredentials[field.key] || ''}
                            onChange={(e) => handleCredentialChange(integration.id, field.key, e.target.value)}
                          >
                            <option value="">
                              {language === 'en' ? 'Select...' : 'Seleccionar...'}
                            </option>
                            {field.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="relative">
                            <Input
                              id={`${integration.id}_${field.key}`}
                              type={field.type === 'password' && !showCredentials[`${integration.id}_${field.key}`] ? 'password' : 'text'}
                              value={integrationCredentials[field.key] || ''}
                              onChange={(e) => handleCredentialChange(integration.id, field.key, e.target.value)}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
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
                        )}
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedIntegration(integration.id)}
                      className="flex-1"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Configure' : 'Configurar'}
                    </Button>
                    
                    {integration.is_active && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => testConnection(integration.id)}
                          disabled={isTestingConnection}
                        >
                          {language === 'en' ? 'Test' : 'Probar'}
                        </Button>
                        
                        <Button
                          onClick={() => syncIntegration(integration.id)}
                          disabled={isSyncingIntegration}
                        >
                          {language === 'en' ? 'Sync' : 'Sincronizar'}
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {integration.last_error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{integration.last_error}</p>
                  </div>
                )}

                {integration.last_sync_at && (
                  <div className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Last sync:' : 'Última sincronización:'} {new Date(integration.last_sync_at).toLocaleString()}
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