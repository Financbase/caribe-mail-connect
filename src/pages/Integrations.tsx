import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIntegrations } from '@/hooks/useIntegrations';
import { IntegrationDashboard } from '@/components/integrations/IntegrationDashboard';
import { CarrierIntegrations } from '@/components/integrations/CarrierIntegrations';
import { PaymentIntegrations } from '@/components/integrations/PaymentIntegrations';
import { AccountingIntegrations } from '@/components/integrations/AccountingIntegrations';
import { CommunicationIntegrations } from '@/components/integrations/CommunicationIntegrations';
import { ApiManagement } from '@/components/integrations/ApiManagement';
import { IntegrationsLogs } from '@/components/integrations/IntegrationsLogs';
import { 
  Plug, 
  Truck, 
  CreditCard, 
  Calculator, 
  MessageSquare, 
  Key, 
  History,
  Settings,
  Activity
} from 'lucide-react';

interface IntegrationsProps {
  onNavigate?: (page: string) => void;
}

export default function Integrations({ onNavigate }: IntegrationsProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');

  const {
    integrations,
    integrationLogs,
    apiKeys,
    webhookEndpoints,
    integrationsLoading,
    logsLoading,
    apiKeysLoading,
    webhooksLoading,
  } = useIntegrations();

  const getIntegrationStats = () => {
    const carriers = integrations.filter(i => i.service_type === 'carrier');
    const payments = integrations.filter(i => i.service_type === 'payment');
    const accounting = integrations.filter(i => i.service_type === 'accounting');
    const communication = integrations.filter(i => i.service_type === 'communication');
    
    const activeCount = integrations.filter(i => i.is_active).length;
    const connectedCount = integrations.filter(i => i.is_connected).length;
    
    return {
      carriers: carriers.length,
      payments: payments.length,
      accounting: accounting.length,
      communication: communication.length,
      activeCount,
      connectedCount,
      totalCount: integrations.length,
    };
  };

  const stats = getIntegrationStats();

  if (integrationsLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === 'en' ? 'Integrations' : 'Integraciones'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Connect and manage third-party services for your mail center operations'
              : 'Conectar y gestionar servicios de terceros para las operaciones de tu centro de correo'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => onNavigate?.('settings')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {language === 'en' ? 'Settings' : 'Configuración'}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'en' ? 'Total Integrations' : 'Total de Integraciones'}
                </p>
                <p className="text-2xl font-bold">{stats.totalCount}</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plug className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'en' ? 'Active' : 'Activas'}
                </p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCount}</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Activity className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'en' ? 'Connected' : 'Conectadas'}
                </p>
                <p className="text-2xl font-bold text-blue-600">{stats.connectedCount}</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Plug className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'en' ? 'API Keys' : 'Claves API'}
                </p>
                <p className="text-2xl font-bold">{apiKeys.length}</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <Key className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {language === 'en' ? 'Dashboard' : 'Panel'}
          </TabsTrigger>
          <TabsTrigger value="carriers" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            {language === 'en' ? 'Carriers' : 'Transportistas'}
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            {language === 'en' ? 'Payments' : 'Pagos'}
          </TabsTrigger>
          <TabsTrigger value="accounting" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            {language === 'en' ? 'Accounting' : 'Contabilidad'}
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {language === 'en' ? 'Communication' : 'Comunicación'}
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            {language === 'en' ? 'API' : 'API'}
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            {language === 'en' ? 'Logs' : 'Registros'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <IntegrationDashboard 
            integrations={integrations}
            stats={stats}
          />
        </TabsContent>

        <TabsContent value="carriers" className="space-y-6">
          <CarrierIntegrations 
            integrations={integrations.filter(i => i.service_type === 'carrier')}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentIntegrations 
            integrations={integrations.filter(i => i.service_type === 'payment')}
          />
        </TabsContent>

        <TabsContent value="accounting" className="space-y-6">
          <AccountingIntegrations 
            integrations={integrations.filter(i => i.service_type === 'accounting')}
          />
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <CommunicationIntegrations 
            integrations={integrations.filter(i => i.service_type === 'communication')}
          />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <ApiManagement 
            apiKeys={apiKeys}
            webhookEndpoints={webhookEndpoints}
            loading={apiKeysLoading || webhooksLoading}
          />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <IntegrationsLogs 
            logs={integrationLogs}
            loading={logsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}