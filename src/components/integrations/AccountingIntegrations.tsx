import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIntegrations, Integration } from '@/hooks/useIntegrations';
import { Calculator, FileText, Download, Upload, Settings, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface AccountingIntegrationsProps {
  integrations: Integration[];
}

export function AccountingIntegrations({ integrations }: AccountingIntegrationsProps) {
  const { language } = useLanguage();
  const { updateIntegration, testConnection, syncIntegration, isUpdatingIntegration, isTestingConnection, isSyncingIntegration } = useIntegrations();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{ [key: string]: Record<string, string> }>({});
  const [showCredentials, setShowCredentials] = useState<{ [key: string]: boolean }>({});

  const accountingConfigs = {
    quickbooks: {
      icon: <Calculator className="h-6 w-6" />,
      color: 'border-blue-200 bg-blue-50',
      iconColor: 'text-blue-600',
      fields: [
        { key: 'client_id', label: 'Client ID', type: 'text', required: true },
        { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
        { key: 'redirect_uri', label: 'Redirect URI', type: 'text', required: true },
        { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'], required: true },
        { key: 'company_id', label: 'Company ID', type: 'text', required: false }
      ]
    },
    xero: {
      icon: <FileText className="h-6 w-6" />,
      color: 'border-green-200 bg-green-50',
      iconColor: 'text-green-600',
      fields: [
        { key: 'client_id', label: 'Client ID', type: 'text', required: true },
        { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
        { key: 'redirect_uri', label: 'Redirect URI', type: 'text', required: true },
        { key: 'scopes', label: 'Scopes', type: 'text', required: true, placeholder: 'accounting.transactions accounting.contacts' }
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

  const handleExportData = async (integration: Integration, format: 'csv' | 'excel') => {
    console.log(`Exporting ${format} data for ${integration.service_name}`);
    // This would call an edge function to export data
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'en' ? 'Accounting Software Integrations' : 'Integraciones de Software Contable'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Connect with accounting software to automate financial data synchronization and reporting'
              : 'Conectar con software contable para automatizar la sincronización de datos financieros e informes'}
          </p>
        </div>
      </div>

      {/* OAuth Warning */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          {language === 'en' 
            ? 'These integrations require OAuth authentication. You will be redirected to authenticate with the accounting provider after saving your configuration.'
            : 'Estas integraciones requieren autenticación OAuth. Serás redirigido para autenticarte con el proveedor contable después de guardar tu configuración.'}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const config = accountingConfigs[integration.service_name as keyof typeof accountingConfigs];
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
                        {integration.service_name === 'quickbooks' && (language === 'en' ? 'Intuit QuickBooks' : 'Intuit QuickBooks')}
                        {integration.service_name === 'xero' && (language === 'en' ? 'Xero Accounting' : 'Contabilidad Xero')}
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
                      : (language === 'en' ? 'Not Connected' : 'No Conectado')
                    }
                  </Badge>
                </div>

                {/* Features */}
                <div>
                  <Label className="text-sm font-medium">
                    {language === 'en' ? 'Sync Features' : 'Características de Sincronización'}
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {integration.configuration.features?.map((feature: string) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Sync Settings */}
                {integration.is_connected && (
                  <div>
                    <Label className="text-sm font-medium">
                      {language === 'en' ? 'Sync Schedule' : 'Horario de Sincronización'}
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">
                        {language === 'en' ? 'Daily at 2:00 AM' : 'Diario a las 2:00 AM'}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Configuration */}
                {isSelected ? (
                  <div className="space-y-4 border-t pt-4">
                    <Label className="text-sm font-medium">
                      {language === 'en' ? 'OAuth Configuration' : 'Configuración OAuth'}
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
                        )}
                      </div>
                    ))}

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleSaveCredentials(integration)}
                        disabled={isUpdatingIntegration}
                        className="flex-1"
                      >
                        {language === 'en' ? 'Save & Authenticate' : 'Guardar y Autenticar'}
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

                    {integration.is_active && integration.is_connected && (
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => syncIntegration(integration.id)}
                          disabled={isSyncingIntegration}
                          className="flex-1"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {language === 'en' ? 'Sync Now' : 'Sincronizar Ahora'}
                        </Button>
                        
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportData(integration, 'csv')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportData(integration, 'excel')}
                          >
                            <FileText className="h-4 w-4" />
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