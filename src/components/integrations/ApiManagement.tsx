import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIntegrations, ApiKey, WebhookEndpoint } from '@/hooks/useIntegrations';
import { 
  Key, 
  Webhook, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Activity,
  Clock,
  Globe,
  Settings
} from 'lucide-react';

interface ApiManagementProps {
  apiKeys: ApiKey[];
  webhookEndpoints: WebhookEndpoint[];
  loading: boolean;
}

export function ApiManagement({ apiKeys, webhookEndpoints, loading }: ApiManagementProps) {
  const { language } = useLanguage();
  const { generateApiKey, createWebhook, isGeneratingApiKey, isCreatingWebhook } = useIntegrations();
  const [showNewApiKeyForm, setShowNewApiKeyForm] = useState(false);
  const [showNewWebhookForm, setShowNewWebhookForm] = useState(false);
  const [visibleApiKeys, setVisibleApiKeys] = useState<{ [key: string]: boolean }>({});
  const [newApiKey, setNewApiKey] = useState({
    key_name: '',
    permissions: [] as string[],
    rate_limit_per_minute: 100,
    expires_at: '',
  });
  const [newWebhook, setNewWebhook] = useState({
    endpoint_name: '',
    url: '',
    events: [] as string[],
    is_active: true,
  });

  const availablePermissions = [
    'packages:read',
    'packages:write',
    'customers:read',
    'customers:write',
    'mailboxes:read',
    'mailboxes:write',
    'notifications:send',
    'reports:generate',
    'integrations:read'
  ];

  const availableEvents = [
    'package.received',
    'package.delivered',
    'customer.created',
    'customer.updated',
    'mailbox.assigned',
    'notification.sent',
    'payment.completed',
    'sync.completed'
  ];

  const handleGenerateApiKey = async () => {
    if (!newApiKey.key_name) return;
    
    await generateApiKey({
      key_name: newApiKey.key_name,
      permissions: newApiKey.permissions,
      rate_limit_per_minute: newApiKey.rate_limit_per_minute,
      expires_at: newApiKey.expires_at || null,
      location_id: null,
      api_secret: null,
      is_active: true,
      last_used_at: null,
    });
    
    setShowNewApiKeyForm(false);
    setNewApiKey({
      key_name: '',
      permissions: [],
      rate_limit_per_minute: 100,
      expires_at: '',
    });
  };

  const handleCreateWebhook = async () => {
    if (!newWebhook.endpoint_name || !newWebhook.url) return;
    
    await createWebhook({
      endpoint_name: newWebhook.endpoint_name,
      url: newWebhook.url,
      events: newWebhook.events,
      is_active: newWebhook.is_active,
      location_id: null,
    });
    
    setShowNewWebhookForm(false);
    setNewWebhook({
      endpoint_name: '',
      url: '',
      events: [],
      is_active: true,
    });
  };

  const toggleApiKeyVisibility = (apiKeyId: string) => {
    setVisibleApiKeys(prev => ({
      ...prev,
      [apiKeyId]: !prev[apiKeyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'en' ? 'API Management' : 'Gestión de API'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Manage API keys, webhook endpoints, and integration access controls'
              : 'Gestionar claves API, endpoints de webhooks y controles de acceso de integración'}
          </p>
        </div>
      </div>

      {/* API Keys Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                {language === 'en' ? 'API Keys' : 'Claves API'}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Generate and manage API keys for external integrations'
                  : 'Generar y gestionar claves API para integraciones externas'}
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowNewApiKeyForm(true)}
              disabled={showNewApiKeyForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Generate API Key' : 'Generar Clave API'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showNewApiKeyForm && (
            <div className="border rounded-lg p-4 mb-4 space-y-4">
              <h4 className="font-medium">
                {language === 'en' ? 'Generate New API Key' : 'Generar Nueva Clave API'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">
                    {language === 'en' ? 'Key Name' : 'Nombre de la Clave'}
                  </Label>
                  <Input
                    id="key-name"
                    value={newApiKey.key_name}
                    onChange={(e) => setNewApiKey(prev => ({ ...prev, key_name: e.target.value }))}
                    placeholder={language === 'en' ? 'e.g., Mobile App Integration' : 'ej., Integración App Móvil'}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rate-limit">
                    {language === 'en' ? 'Rate Limit (per minute)' : 'Límite de Velocidad (por minuto)'}
                  </Label>
                  <Input
                    id="rate-limit"
                    type="number"
                    value={newApiKey.rate_limit_per_minute}
                    onChange={(e) => setNewApiKey(prev => ({ ...prev, rate_limit_per_minute: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expires-at">
                    {language === 'en' ? 'Expiration Date (optional)' : 'Fecha de Expiración (opcional)'}
                  </Label>
                  <Input
                    id="expires-at"
                    type="date"
                    value={newApiKey.expires_at}
                    onChange={(e) => setNewApiKey(prev => ({ ...prev, expires_at: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>
                  {language === 'en' ? 'Permissions' : 'Permisos'}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={newApiKey.permissions.includes(permission)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewApiKey(prev => ({
                              ...prev,
                              permissions: [...prev.permissions, permission]
                            }));
                          } else {
                            setNewApiKey(prev => ({
                              ...prev,
                              permissions: prev.permissions.filter(p => p !== permission)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleGenerateApiKey}
                  disabled={isGeneratingApiKey || !newApiKey.key_name}
                >
                  {isGeneratingApiKey 
                    ? (language === 'en' ? 'Generating...' : 'Generando...')
                    : (language === 'en' ? 'Generate' : 'Generar')
                  }
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewApiKeyForm(false)}
                >
                  {language === 'en' ? 'Cancel' : 'Cancelar'}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {apiKeys.length === 0 ? (
              <div className="text-center py-8">
                <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {language === 'en' ? 'No API keys' : 'No hay claves API'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en' 
                    ? 'Generate your first API key to enable external integrations.'
                    : 'Genera tu primera clave API para habilitar integraciones externas.'}
                </p>
              </div>
            ) : (
              apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{apiKey.key_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' ? 'Created' : 'Creado'} {formatDate(apiKey.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={apiKey.is_active ? 'default' : 'secondary'}>
                        {apiKey.is_active 
                          ? (language === 'en' ? 'Active' : 'Activo')
                          : (language === 'en' ? 'Inactive' : 'Inactivo')
                        }
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">
                        {language === 'en' ? 'API Key:' : 'Clave API:'}
                      </Label>
                      <div className="flex items-center gap-2 flex-1">
                        <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                          {visibleApiKeys[apiKey.id] ? apiKey.api_key : '•'.repeat(32)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleApiKeyVisibility(apiKey.id)}
                        >
                          {visibleApiKeys[apiKey.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(apiKey.api_key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {language === 'en' ? 'Rate limit:' : 'Límite de velocidad:'} {apiKey.rate_limit_per_minute}/min
                      </span>
                      {apiKey.expires_at && (
                        <span>
                          {language === 'en' ? 'Expires:' : 'Expira:'} {formatDate(apiKey.expires_at)}
                        </span>
                      )}
                      {apiKey.last_used_at && (
                        <span>
                          {language === 'en' ? 'Last used:' : 'Último uso:'} {formatDate(apiKey.last_used_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Webhooks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                {language === 'en' ? 'Webhook Endpoints' : 'Endpoints de Webhook'}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Configure webhook endpoints to receive real-time notifications'
                  : 'Configurar endpoints de webhook para recibir notificaciones en tiempo real'}
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowNewWebhookForm(true)}
              disabled={showNewWebhookForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Add Webhook' : 'Agregar Webhook'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showNewWebhookForm && (
            <div className="border rounded-lg p-4 mb-4 space-y-4">
              <h4 className="font-medium">
                {language === 'en' ? 'Create New Webhook' : 'Crear Nuevo Webhook'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endpoint-name">
                    {language === 'en' ? 'Endpoint Name' : 'Nombre del Endpoint'}
                  </Label>
                  <Input
                    id="endpoint-name"
                    value={newWebhook.endpoint_name}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, endpoint_name: e.target.value }))}
                    placeholder={language === 'en' ? 'e.g., Package Notifications' : 'ej., Notificaciones de Paquetes'}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">
                    {language === 'en' ? 'Webhook URL' : 'URL del Webhook'}
                  </Label>
                  <Input
                    id="webhook-url"
                    type="url"
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://your-app.com/webhook"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>
                  {language === 'en' ? 'Events' : 'Eventos'}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableEvents.map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <Checkbox
                        id={event}
                        checked={newWebhook.events.includes(event)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewWebhook(prev => ({
                              ...prev,
                              events: [...prev.events, event]
                            }));
                          } else {
                            setNewWebhook(prev => ({
                              ...prev,
                              events: prev.events.filter(e => e !== event)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={event} className="text-sm">
                        {event}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="webhook-active"
                  checked={newWebhook.is_active}
                  onCheckedChange={(checked) => 
                    setNewWebhook(prev => ({ ...prev, is_active: checked as boolean }))
                  }
                />
                <Label htmlFor="webhook-active">
                  {language === 'en' ? 'Active' : 'Activo'}
                </Label>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateWebhook}
                  disabled={isCreatingWebhook || !newWebhook.endpoint_name || !newWebhook.url}
                >
                  {isCreatingWebhook 
                    ? (language === 'en' ? 'Creating...' : 'Creando...')
                    : (language === 'en' ? 'Create' : 'Crear')
                  }
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewWebhookForm(false)}
                >
                  {language === 'en' ? 'Cancel' : 'Cancelar'}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {webhookEndpoints.length === 0 ? (
              <div className="text-center py-8">
                <Webhook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {language === 'en' ? 'No webhook endpoints' : 'No hay endpoints de webhook'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en' 
                    ? 'Create webhook endpoints to receive real-time notifications.'
                    : 'Crea endpoints de webhook para recibir notificaciones en tiempo real.'}
                </p>
              </div>
            ) : (
              webhookEndpoints.map((webhook) => (
                <div key={webhook.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{webhook.endpoint_name}</h4>
                      <p className="text-sm text-muted-foreground break-all">{webhook.url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={webhook.is_active ? 'default' : 'secondary'}>
                        {webhook.is_active 
                          ? (language === 'en' ? 'Active' : 'Activo')
                          : (language === 'en' ? 'Inactive' : 'Inactivo')
                        }
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {language === 'en' ? 'Created:' : 'Creado:'} {formatDate(webhook.created_at)}
                      </span>
                      <span>
                        {language === 'en' ? 'Deliveries:' : 'Entregas:'} {webhook.delivery_attempts}
                      </span>
                      {webhook.last_delivery_at && (
                        <span>
                          {language === 'en' ? 'Last delivery:' : 'Última entrega:'} {formatDate(webhook.last_delivery_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}