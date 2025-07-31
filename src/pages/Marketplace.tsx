import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Store,
  Package,
  Truck,
  BarChart3,
  Settings,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  ShoppingCart,
  TrendingUp,
  Users,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { useMarketplace } from '@/hooks/useMarketplace';
import { IntegrationDashboard } from '@/components/marketplace/IntegrationDashboard';
import { SellerTools } from '@/components/marketplace/SellerTools';
import { APIManager } from '@/components/marketplace/APIManager';
import { AutomationRules } from '@/components/marketplace/AutomationRules';
import { SellerAnalytics } from '@/components/marketplace/SellerAnalytics';
import { MarketplaceType, IntegrationStatus } from '@/types/marketplace';

interface MarketplaceProps {
  onNavigate?: (page: string) => void;
}

const marketplaceIcons: Record<MarketplaceType, React.ReactNode> = {
  amazon: <Store className="h-6 w-6 text-orange-500" />,
  ebay: <ShoppingCart className="h-6 w-6 text-blue-500" />,
  shopify: <Store className="h-6 w-6 text-green-500" />,
  etsy: <Store className="h-6 w-6 text-orange-600" />,
  walmart: <Store className="h-6 w-6 text-blue-600" />,
  facebook: <Globe className="h-6 w-6 text-blue-700" />,
  mercadolibre: <Store className="h-6 w-6 text-yellow-500" />
};

const statusColors: Record<IntegrationStatus, string> = {
  connected: 'bg-green-100 text-green-800',
  disconnected: 'bg-gray-100 text-gray-800',
  error: 'bg-red-100 text-red-800',
  syncing: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

const statusIcons: Record<IntegrationStatus, React.ReactNode> = {
  connected: <CheckCircle className="h-4 w-4" />,
  disconnected: <AlertCircle className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
  syncing: <RefreshCw className="h-4 w-4 animate-spin" />,
  pending: <Clock className="h-4 w-4" />
};

export default function Marketplace({ onNavigate }: MarketplaceProps) {
  const {
    integrations,
    integrationsLoading,
    orders,
    ordersLoading,
    analytics,
    analyticsLoading,
    syncMarketplace,
    connectMarketplace,
    applyFilters,
    clearFilters
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<IntegrationStatus | 'all'>('all');

  // Calculate overview stats
  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;
  const totalOrders = integrations.reduce((sum, i) => sum + i.orderCount, 0);
  const totalRevenue = integrations.reduce((sum, i) => sum + i.monthlyVolume, 0);
  const errorCount = integrations.reduce((sum, i) => sum + i.errorCount, 0);

  // Apply filters when search or status filter changes
  useEffect(() => {
    applyFilters({
      searchQuery: searchQuery || undefined,
      statuses: statusFilter === 'all' ? undefined : [statusFilter]
    });
  }, [searchQuery, statusFilter, applyFilters]);

  const handleSyncAll = async () => {
    const connectedIntegrations = integrations.filter(i => i.status === 'connected');
    for (const integration of connectedIntegrations) {
      await syncMarketplace(integration.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Store className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Marketplace Integration</h1>
              {errorCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {errorCount} errors
                </Badge>
              )}
            </div>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="connected">Connected</SelectItem>
                <SelectItem value="disconnected">Disconnected</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="syncing">Syncing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button onClick={handleSyncAll} disabled={connectedIntegrations === 0}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync All
            </Button>

            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Connect Store
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="border-b bg-muted/30">
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Connected Stores</p>
                    <p className="text-2xl font-bold">{connectedIntegrations}/{integrations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{totalOrders.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                    <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Zap className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Automations</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Integration Status Overview */}
      <div className="border-b bg-background">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Integration Status</h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last sync: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {marketplaceIcons[integration.marketplace]}
                      <div>
                        <h3 className="font-medium capitalize">{integration.marketplace}</h3>
                        <p className="text-xs text-muted-foreground">{integration.accountName}</p>
                      </div>
                    </div>
                    
                    <Badge className={`text-xs ${statusColors[integration.status]}`}>
                      <div className="flex items-center space-x-1">
                        {statusIcons[integration.status]}
                        <span className="capitalize">{integration.status}</span>
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Orders:</span>
                      <span className="font-medium">{integration.orderCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">${integration.monthlyVolume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last sync:</span>
                      <span className="font-medium">
                        {new Date(integration.lastSync).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {integration.errorCount > 0 && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-1 text-red-700">
                        <AlertCircle className="h-3 w-3" />
                        <span className="text-xs font-medium">
                          {integration.errorCount} errors need attention
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => syncMarketplace(integration.id)}
                      disabled={integration.status === 'syncing'}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Sync
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-5 rounded-none border-b bg-background">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Store className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="seller-tools" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Seller Tools</span>
            </TabsTrigger>
            <TabsTrigger value="api-management" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>API Management</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Automation</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="h-full m-0 p-6">
            <IntegrationDashboard
              integrations={integrations}
              orders={orders}
              loading={integrationsLoading || ordersLoading}
            />
          </TabsContent>

          <TabsContent value="seller-tools" className="h-full m-0 p-6">
            <SellerTools
              orders={orders}
              loading={ordersLoading}
            />
          </TabsContent>

          <TabsContent value="api-management" className="h-full m-0 p-6">
            <APIManager
              integrations={integrations}
              loading={integrationsLoading}
            />
          </TabsContent>

          <TabsContent value="automation" className="h-full m-0 p-6">
            <AutomationRules
              integrations={integrations}
              loading={integrationsLoading}
            />
          </TabsContent>

          <TabsContent value="analytics" className="h-full m-0 p-6">
            <SellerAnalytics
              analytics={analytics}
              loading={analyticsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 