import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIntegrations } from '@/hooks/useIntegrations';
import { Integration } from '@/hooks/useIntegrations';
import { 
  Truck, 
  CreditCard, 
  Calculator, 
  MessageSquare, 
  Plug, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Settings,
  Activity
} from 'lucide-react';

interface IntegrationDashboardProps {
  integrations: Integration[];
  stats: {
    carriers: number;
    payments: number;
    accounting: number;
    communication: number;
    activeCount: number;
    connectedCount: number;
    totalCount: number;
  };
}

export function IntegrationDashboard({ integrations, stats }: IntegrationDashboardProps) {
  const { language } = useLanguage();
  const { testConnection, syncIntegration, isTestingConnection, isSyncingIntegration } = useIntegrations();

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'carrier':
        return <Truck className="h-5 w-5" />;
      case 'payment':
        return <CreditCard className="h-5 w-5" />;
      case 'accounting':
        return <Calculator className="h-5 w-5" />;
      case 'communication':
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <Plug className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (integration: Integration) => {
    if (!integration.is_active) {
      return <XCircle className="h-4 w-4 text-gray-400" />;
    }
    if (integration.is_connected) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (integration.last_error) {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-600" />;
  };

  const getStatusText = (integration: Integration) => {
    if (!integration.is_active) {
      return language === 'en' ? 'Inactive' : 'Inactivo';
    }
    if (integration.is_connected) {
      return language === 'en' ? 'Connected' : 'Conectado';
    }
    if (integration.last_error) {
      return language === 'en' ? 'Error' : 'Error';
    }
    return language === 'en' ? 'Disconnected' : 'Desconectado';
  };

  const getStatusColor = (integration: Integration) => {
    if (!integration.is_active) {
      return 'bg-gray-100 text-gray-800';
    }
    if (integration.is_connected) {
      return 'bg-green-100 text-green-800';
    }
    if (integration.last_error) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  const activeIntegrations = integrations.filter(i => i.is_active);
  const recentErrors = integrations.filter(i => i.last_error && i.is_active);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'Integration Health' : 'Salud de Integraciones'}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((stats.connectedCount / Math.max(stats.activeCount, 1)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.connectedCount} of {stats.activeCount} {language === 'en' ? 'active integrations connected' : 'integraciones activas conectadas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'Recent Errors' : 'Errores Recientes'}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {recentErrors.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'en' ? 'integrations with errors' : 'integraciones con errores'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'Service Coverage' : 'Cobertura de Servicios'}
            </CardTitle>
            <Plug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.carriers + stats.payments + stats.accounting + stats.communication}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'en' ? 'service types available' : 'tipos de servicios disponibles'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {language === 'en' ? 'Active Integrations' : 'Integraciones Activas'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Monitor and manage your active service integrations'
              : 'Monitorear y gestionar tus integraciones de servicios activas'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeIntegrations.length === 0 ? (
            <div className="text-center py-8">
              <Plug className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {language === 'en' ? 'No active integrations' : 'No hay integraciones activas'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' 
                  ? 'Start by configuring your first integration in one of the service categories.'
                  : 'Comienza configurando tu primera integración en una de las categorías de servicios.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeIntegrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {getServiceIcon(integration.service_type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{integration.display_name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {integration.service_type}
                          </p>
                        </div>
                      </div>
                      {getStatusIcon(integration)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {language === 'en' ? 'Status' : 'Estado'}
                        </span>
                        <Badge className={getStatusColor(integration)}>
                          {getStatusText(integration)}
                        </Badge>
                      </div>

                      {integration.last_sync_at && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {language === 'en' ? 'Last Sync' : 'Última Sincronización'}
                          </span>
                          <span className="text-sm">
                            {new Date(integration.last_sync_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {integration.last_error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-700">{integration.last_error}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testConnection(integration.id)}
                        disabled={isTestingConnection}
                        className="flex-1"
                      >
                        {language === 'en' ? 'Test' : 'Probar'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => syncIntegration(integration.id)}
                        disabled={isSyncingIntegration}
                        className="flex-1"
                      >
                        {language === 'en' ? 'Sync' : 'Sincronizar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Errors */}
      {recentErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {language === 'en' ? 'Integration Errors' : 'Errores de Integración'}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'Integrations that require attention'
                : 'Integraciones que requieren atención'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentErrors.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <div>
                      <h5 className="font-medium">{integration.display_name}</h5>
                      <p className="text-sm text-red-700">{integration.last_error}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testConnection(integration.id)}
                    disabled={isTestingConnection}
                  >
                    {language === 'en' ? 'Retry' : 'Reintentar'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}