import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Key,
  Webhook,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Plus,
  Settings,
  Code,
  Activity,
  Zap,
  Globe,
  Shield,
  BarChart3,
  FileText,
  Download,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMarketplace } from '@/hooks/useMarketplace';
import { MarketplaceIntegration, MarketplaceType } from '@/types/marketplace';

interface APIManagerProps {
  integrations: MarketplaceIntegration[];
  loading: boolean;
}

interface APICredentialsPanelProps {
  integrations: MarketplaceIntegration[];
  showApiKey: string | null;
  setShowApiKey: (key: string | null) => void;
  testResults: Record<string, boolean>;
  onTestConnection: (integrationId: string) => void;
  onCopyToClipboard: (text: string) => void;
  maskApiKey: (key: string | undefined) => string;
}

interface WebhooksPanelProps {
  integrations: MarketplaceIntegration[];
}

interface RateLimitPanelProps {
  integrations: MarketplaceIntegration[];
}

interface ErrorLogsPanelProps {
  integrations: MarketplaceIntegration[];
}

const marketplaceLogos: Record<MarketplaceType, string> = {
  amazon: '🟠',
  ebay: '🔵',
  shopify: '🟢',
  etsy: '🟠',
  walmart: '🔵',
  facebook: '🔵',
  mercadolibre: '🟡'
};

export function APIManager({ integrations, loading }: APIManagerProps) {
  const [activeTab, setActiveTab] = useState('credentials');
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const { testApiConnection, refreshApiToken } = useMarketplace();

  const handleTestConnection = async (integrationId: string) => {
    try {
      const result = await testApiConnection({ id: integrationId });
      setTestResults(prev => ({ ...prev, [integrationId]: result }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [integrationId]: false }));
    }
  };

  const maskApiKey = (key: string | undefined) => {
    if (!key) return 'Not configured';
    return key.slice(0, 8) + '*'.repeat(key.length - 12) + key.slice(-4);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Management</h2>
          <p className="text-muted-foreground">
            Manage API credentials, webhooks, and monitor integration health
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="credentials">API Credentials</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="monitoring">Rate Limits</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-6">
          <APICredentialsPanel 
            integrations={integrations}
            showApiKey={showApiKey}
            setShowApiKey={setShowApiKey}
            testResults={testResults}
            onTestConnection={handleTestConnection}
            onCopyToClipboard={copyToClipboard}
            maskApiKey={maskApiKey}
          />
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <WebhooksPanel integrations={integrations} />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <RateLimitPanel integrations={integrations} />
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <ErrorLogsPanel integrations={integrations} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function APICredentialsPanel({ 
  integrations, 
  showApiKey, 
  setShowApiKey, 
  testResults, 
  onTestConnection, 
  onCopyToClipboard, 
  maskApiKey 
}: APICredentialsPanelProps) {
  return (
    <div className="space-y-6">
      {/* API Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active APIs</p>
                <p className="text-2xl font-bold">{integrations.filter(i => i.status === 'connected').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Needs Attention</p>
                <p className="text-2xl font-bold">{integrations.filter(i => i.errorCount > 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">API Keys</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Webhook className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Webhooks</p>
                <p className="text-2xl font-bold">
                  {integrations.reduce((sum, i) => sum + i.webhooks.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Credentials Table */}
      <Card>
        <CardHeader>
          <CardTitle>API Credentials</CardTitle>
          <CardDescription>
            Manage API keys and authentication tokens for marketplace integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marketplace</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integrations.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{marketplaceLogos[integration.marketplace]}</span>
                      <div>
                        <p className="font-medium capitalize">{integration.marketplace}</p>
                        <p className="text-xs text-muted-foreground">API v2.0</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{integration.accountName}</p>
                      <p className="text-xs text-muted-foreground">{integration.accountId}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {showApiKey === integration.id 
                          ? integration.apiKey || 'Not configured'
                          : maskApiKey(integration.apiKey)
                        }
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowApiKey(
                          showApiKey === integration.id ? null : integration.id
                        )}
                      >
                        {showApiKey === integration.id ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopyToClipboard(integration.apiKey || '')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {integration.status === 'connected' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : integration.status === 'error' ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                      <Badge className={cn(
                        "text-xs",
                        integration.status === 'connected' ? 'bg-green-100 text-green-800' :
                        integration.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      )}>
                        {integration.status}
                      </Badge>
                      {testResults[integration.id] !== undefined && (
                        <Badge className={cn(
                          "text-xs ml-2",
                          testResults[integration.id] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        )}>
                          {testResults[integration.id] ? 'Test Passed' : 'Test Failed'}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {new Date(integration.lastSync).toLocaleDateString()}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onTestConnection(integration.id)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* API Testing Playground */}
      <Card>
        <CardHeader>
          <CardTitle>API Testing Playground</CardTitle>
          <CardDescription>
            Test API endpoints and validate your integration setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="api-endpoint">Endpoint</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select API endpoint" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orders">GET /orders</SelectItem>
                    <SelectItem value="products">GET /products</SelectItem>
                    <SelectItem value="inventory">GET /inventory</SelectItem>
                    <SelectItem value="webhooks">POST /webhooks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="marketplace">Marketplace</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marketplace" />
                  </SelectTrigger>
                  <SelectContent>
                    {integrations.map((integration) => (
                      <SelectItem key={integration.id} value={integration.id}>
                        {integration.marketplace} - {integration.accountName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="request-body">Request Body (JSON)</Label>
              <Textarea
                placeholder='{"limit": 10, "status": "pending"}'
                className="font-mono text-sm"
                rows={4}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Send Request
              </Button>
              <Button variant="outline">
                <Code className="h-4 w-4 mr-2" />
                Generate Code
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg bg-muted/50">
              <Label className="text-sm font-medium">Response</Label>
              <pre className="text-xs mt-2 text-muted-foreground">
                Click "Send Request" to test the API endpoint
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WebhooksPanel({ integrations }: WebhooksPanelProps) {
  const [isCreating, setIsCreating] = useState(false);

  const allWebhooks = integrations.flatMap(integration => 
    integration.webhooks.map(webhook => ({
      ...webhook,
      marketplace: integration.marketplace,
      accountName: integration.accountName
    }))
  );

  return (
    <div className="space-y-6">
      {/* Webhook Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Webhook className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Webhooks</p>
                <p className="text-2xl font-bold">{allWebhooks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{allWebhooks.filter(w => w.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Failures</p>
                <p className="text-2xl font-bold">{allWebhooks.reduce((sum, w) => sum + w.failureCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Recent Triggers</p>
                <p className="text-2xl font-bold">247</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Webhooks Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Webhook Endpoints</CardTitle>
              <CardDescription>
                Manage webhook endpoints for real-time event notifications
              </CardDescription>
            </div>
            
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Webhook</DialogTitle>
                  <DialogDescription>
                    Configure a new webhook endpoint for marketplace events
                  </DialogDescription>
                </DialogHeader>
                <CreateWebhookForm onClose={() => setIsCreating(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marketplace</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead>Failures</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allWebhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{marketplaceLogos[webhook.marketplace]}</span>
                      <div>
                        <p className="font-medium capitalize">{webhook.marketplace}</p>
                        <p className="text-xs text-muted-foreground">{webhook.accountName}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {webhook.url}
                    </code>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {webhook.isActive ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <Badge className={cn(
                        "text-xs",
                        webhook.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      )}>
                        {webhook.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {webhook.lastTriggered 
                        ? new Date(webhook.lastTriggered).toLocaleString()
                        : 'Never'
                      }
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={cn(
                      "text-xs",
                      webhook.failureCount === 0 ? 'bg-green-100 text-green-800' :
                      webhook.failureCount < 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    )}>
                      {webhook.failureCount}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="outline" size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {allWebhooks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Webhook className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No webhooks configured yet</p>
              <p className="text-sm">Add webhooks to receive real-time notifications</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RateLimitPanel({ integrations }: RateLimitPanelProps) {
  return (
    <div className="space-y-6">
      {/* Rate Limit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">
                  {integrations.reduce((sum, i) => sum + (i.rateLimits.requests - i.rateLimits.remaining), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold">
                  {integrations.reduce((sum, i) => sum + i.rateLimits.remaining, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Reset Time</p>
                <p className="text-2xl font-bold">47m</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Throttled</p>
                <p className="text-2xl font-bold">
                  {integrations.filter(i => i.rateLimits.remaining < 50).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rate Limits Table */}
      <Card>
        <CardHeader>
          <CardTitle>API Rate Limits</CardTitle>
          <CardDescription>
            Monitor API usage and rate limiting status across integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marketplace</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Reset Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integrations.map((integration) => {
                const usagePercent = ((integration.rateLimits.requests - integration.rateLimits.remaining) / integration.rateLimits.requests) * 100;
                
                return (
                  <TableRow key={integration.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{marketplaceLogos[integration.marketplace]}</span>
                        <div>
                          <p className="font-medium capitalize">{integration.marketplace}</p>
                          <p className="text-xs text-muted-foreground">{integration.accountName}</p>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{integration.rateLimits.requests - integration.rateLimits.remaining}/{integration.rateLimits.requests}</span>
                          <span>{usagePercent.toFixed(1)}%</span>
                        </div>
                        <Progress value={usagePercent} className="w-20" />
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className={cn(
                        "font-medium",
                        integration.rateLimits.remaining < 50 ? 'text-red-600' :
                        integration.rateLimits.remaining < 200 ? 'text-yellow-600' :
                        'text-green-600'
                      )}>
                        {integration.rateLimits.remaining}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {new Date(integration.rateLimits.resetTime).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={cn(
                        "text-xs",
                        integration.rateLimits.remaining > 200 ? 'bg-green-100 text-green-800' :
                        integration.rateLimits.remaining > 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      )}>
                        {integration.rateLimits.remaining > 200 ? 'Good' :
                         integration.rateLimits.remaining > 50 ? 'Warning' : 'Critical'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorLogsPanel({ integrations }: ErrorLogsPanelProps) {
  const mockErrors = [
    {
      id: 'error-1',
      marketplace: 'amazon',
      timestamp: '2024-01-15T10:30:00Z',
      endpoint: '/orders',
      statusCode: 429,
      errorCode: 'RATE_LIMIT_EXCEEDED',
      message: 'Request rate limit exceeded',
      resolved: false
    },
    {
      id: 'error-2',
      marketplace: 'ebay',
      timestamp: '2024-01-15T09:15:00Z',
      endpoint: '/inventory',
      statusCode: 401,
      errorCode: 'INVALID_TOKEN',
      message: 'Authentication token is invalid or expired',
      resolved: true
    },
    {
      id: 'error-3',
      marketplace: 'shopify',
      timestamp: '2024-01-15T08:45:00Z',
      endpoint: '/products',
      statusCode: 500,
      errorCode: 'INTERNAL_ERROR',
      message: 'Internal server error occurred',
      resolved: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Error Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Errors</p>
                <p className="text-2xl font-bold">{mockErrors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Unresolved</p>
                <p className="text-2xl font-bold">{mockErrors.filter(e => !e.resolved).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{mockErrors.filter(e => e.resolved).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">24h Rate</p>
                <p className="text-2xl font-bold">2.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Error Logs</CardTitle>
          <CardDescription>
            Monitor and troubleshoot API errors and integration issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Marketplace</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Error</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockErrors.map((error) => (
                <TableRow key={error.id}>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {new Date(error.timestamp).toLocaleString()}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{marketplaceLogos[error.marketplace]}</span>
                      <span className="font-medium capitalize">{error.marketplace}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {error.endpoint}
                    </code>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="destructive" className="text-xs">
                          {error.statusCode}
                        </Badge>
                        <span className="text-xs font-medium">{error.errorCode}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={cn(
                      "text-xs",
                      error.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    )}>
                      {error.resolved ? 'Resolved' : 'Open'}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      {!error.resolved && (
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateWebhookForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="webhook-marketplace">Marketplace</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select marketplace" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="amazon">Amazon</SelectItem>
            <SelectItem value="ebay">eBay</SelectItem>
            <SelectItem value="shopify">Shopify</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="webhook-url">Webhook URL</Label>
        <Input placeholder="https://yourapp.com/webhooks/marketplace" />
      </div>
      
      <div>
        <Label htmlFor="webhook-events">Events</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['order.created', 'order.updated', 'order.cancelled', 'inventory.updated'].map((event) => (
            <div key={event} className="flex items-center space-x-2">
              <input type="checkbox" id={event} />
              <Label htmlFor={event} className="text-sm">{event}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch />
        <Label>Active</Label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Create Webhook</Button>
      </div>
    </div>
  );
} 