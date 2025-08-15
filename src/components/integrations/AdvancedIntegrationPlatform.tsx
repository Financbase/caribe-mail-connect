/**
 * Advanced Integration Platform
 * Story 2.4: Advanced Integration Platform
 * 
 * API marketplace, webhook system, third-party integrations,
 * custom connectors, and enterprise integration patterns
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Plug,
  Globe,
  Webhook,
  Code,
  Zap,
  Settings,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Activity,
  BarChart3,
  Clock,
  Shield,
  Key,
  Database,
  Cloud,
  Smartphone,
  Mail,
  CreditCard,
  Truck,
  MessageSquare,
  FileText,
  Users,
  Building,
  Package,
  Bell,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Copy,
  Star,
  TrendingUp,
  Network,
  Layers
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAdvancedIntegrations } from '@/hooks/useAdvancedIntegrations';
import type { 
  IntegrationMarketplace,
  WebhookSystem,
  CustomConnector,
  IntegrationMetrics,
  APIEndpoint
} from '@/types/integrations';

// =====================================================
// MAIN COMPONENT
// =====================================================

export function AdvancedIntegrationPlatform() {
  const { subscription } = useSubscription();
  const {
    marketplaceIntegrations,
    installedIntegrations,
    webhookSystems,
    customConnectors,
    integrationMetrics,
    apiEndpoints,
    isLoading,
    error,
    refreshIntegrations,
    installIntegration,
    createWebhook,
    buildCustomConnector,
    testConnection,
    deployConnector
  } = useAdvancedIntegrations();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  useEffect(() => {
    if (subscription) {
      refreshIntegrations();
    }
  }, [subscription]);

  if (!subscription) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No active subscription found. Please contact support or set up a subscription.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Integration Platform</h1>
          <p className="text-muted-foreground">
            API marketplace, webhook system, third-party integrations, and custom connectors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Story 2.4: Advanced Integration Platform
          </Badge>
          <Button variant="outline" onClick={refreshIntegrations}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowInstallDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Integration Overview */}
      {integrationMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Integrations</p>
                  <p className="text-2xl font-bold">{integrationMetrics.active_integrations}</p>
                  <p className="text-xs text-green-600">
                    {integrationMetrics.integration_health}% healthy
                  </p>
                </div>
                <Plug className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">API Calls</p>
                  <p className="text-2xl font-bold">{integrationMetrics.total_api_calls.toLocaleString()}</p>
                  <p className="text-xs text-blue-600">
                    {integrationMetrics.api_call_trend > 0 ? '+' : ''}{integrationMetrics.api_call_trend}%
                  </p>
                </div>
                <Globe className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Webhooks</p>
                  <p className="text-2xl font-bold">{integrationMetrics.active_webhooks}</p>
                  <p className="text-xs text-purple-600">
                    {integrationMetrics.webhook_success_rate}% success
                  </p>
                </div>
                <Webhook className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Custom Connectors</p>
                  <p className="text-2xl font-bold">{integrationMetrics.custom_connectors}</p>
                  <p className="text-xs text-orange-600">
                    {integrationMetrics.connector_deployments} deployed
                  </p>
                </div>
                <Code className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Data Sync</p>
                  <p className="text-2xl font-bold">{integrationMetrics.data_sync_rate}%</p>
                  <p className="text-xs text-red-600">
                    {integrationMetrics.sync_errors} errors
                  </p>
                </div>
                <Database className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Marketplace</p>
                  <p className="text-2xl font-bold">{marketplaceIntegrations?.length || 0}</p>
                  <p className="text-xs text-indigo-600">
                    {marketplaceIntegrations?.filter(i => i.featured).length || 0} featured
                  </p>
                </div>
                <Star className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="marketplace" className="space-y-6">
        <TabsList>
          <TabsTrigger value="marketplace">Integration Marketplace</TabsTrigger>
          <TabsTrigger value="installed">Installed Integrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhook System</TabsTrigger>
          <TabsTrigger value="connectors">Custom Connectors</TabsTrigger>
          <TabsTrigger value="api">API Management</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="payment">Payment</option>
              <option value="shipping">Shipping</option>
              <option value="communication">Communication</option>
              <option value="analytics">Analytics</option>
              <option value="crm">CRM</option>
              <option value="accounting">Accounting</option>
            </select>
          </div>

          {/* Integration Marketplace Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceIntegrations?.map((integration) => (
              <Card key={integration.id} className="relative">
                {integration.featured && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {integration.category === 'payment' && <CreditCard className="h-6 w-6" />}
                      {integration.category === 'shipping' && <Truck className="h-6 w-6" />}
                      {integration.category === 'communication' && <MessageSquare className="h-6 w-6" />}
                      {integration.category === 'analytics' && <BarChart3 className="h-6 w-6" />}
                      {integration.category === 'crm' && <Users className="h-6 w-6" />}
                      {integration.category === 'accounting' && <FileText className="h-6 w-6" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{integration.provider}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{integration.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({integration.reviews} reviews)
                      </span>
                    </div>
                    <Badge variant="outline">{integration.category}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{integration.pricing.type}</span>
                      {integration.pricing.amount && (
                        <span className="text-muted-foreground">
                          {' '}${integration.pricing.amount}/{integration.pricing.period}
                        </span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => installIntegration(integration.id)}
                      disabled={integration.installed}
                    >
                      {integration.installed ? 'Installed' : 'Install'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="col-span-full text-center py-8">
                <Plug className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Integration Marketplace</h3>
                <p className="text-muted-foreground">
                  Discover and install integrations to extend your platform capabilities
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="installed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Installed Integrations
              </CardTitle>
              <CardDescription>
                Manage your active integrations and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {installedIntegrations?.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        integration.status === 'active' ? 'bg-green-500' :
                        integration.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Last sync: {new Date(integration.last_sync).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        integration.status === 'active' ? 'default' :
                        integration.status === 'error' ? 'destructive' : 'secondary'
                      }>
                        {integration.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => testConnection(integration.id)}>
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <Plug className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Integrations Installed</h3>
                    <p className="text-muted-foreground mb-4">
                      Install integrations from the marketplace to get started
                    </p>
                    <Button onClick={() => setShowInstallDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Browse Marketplace
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Webhook Management
                </span>
                <Button onClick={() => createWebhook()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Webhook
                </Button>
              </CardTitle>
              <CardDescription>
                Configure webhooks for real-time event notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Webhook className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Webhook System</h3>
                <p className="text-muted-foreground mb-4">
                  Real-time event notifications and data synchronization
                </p>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Webhooks
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connectors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Custom Connectors
                </span>
                <Button onClick={() => buildCustomConnector()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Build Connector
                </Button>
              </CardTitle>
              <CardDescription>
                Create custom integrations for specialized requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Custom Connector Builder</h3>
                <p className="text-muted-foreground mb-4">
                  Build and deploy custom integrations with our visual connector builder
                </p>
                <Button variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Launch Builder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                API Management
              </CardTitle>
              <CardDescription>
                Manage API endpoints, keys, and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">API Management Console</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive API management with documentation and analytics
                </p>
                <Button variant="outline">
                  <Key className="h-4 w-4 mr-2" />
                  Manage APIs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Integration Monitoring
              </CardTitle>
              <CardDescription>
                Monitor integration health, performance, and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Integration Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Real-time monitoring and analytics for all your integrations
                </p>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
