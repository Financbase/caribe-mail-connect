import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  Webhook,
  Activity,
  Calendar,
  AlertTriangle,
  ExternalLink,
  Download,
  Upload,
  TestTube,
  Zap
} from 'lucide-react';
import { useDevelopers } from '@/hooks/useDevelopers';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'failed';
  created_at: string;
  last_triggered: string;
  success_rate: number;
  retry_count: number;
  secret: string;
  headers?: Record<string, string>;
  timeout?: number;
  retry_policy?: {
    max_retries: number;
    backoff_multiplier: number;
  };
}

interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event: string;
  payload: Record<string, unknown>;
  response_status: number;
  response_body: string;
  response_headers: Record<string, string>;
  request_headers: Record<string, string>;
  created_at: string;
  duration: number;
  success: boolean;
  error_message?: string;
  retry_count: number;
}

export function WebhookDebugger() {
  const { webhooks, loading, createWebhook, updateWebhook, deleteWebhook, testWebhook } = useDevelopers();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<WebhookDelivery | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  
  // Form states
  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([]);
  const [newWebhookSecret, setNewWebhookSecret] = useState('');
  const [newWebhookHeaders, setNewWebhookHeaders] = useState('');
  const [newWebhookTimeout, setNewWebhookTimeout] = useState(30);
  const [newWebhookMaxRetries, setNewWebhookMaxRetries] = useState(3);

  const availableEvents = [
    'package.created',
    'package.updated',
    'package.delivered',
    'customer.created',
    'customer.updated',
    'mailbox.created',
    'mailbox.updated',
    'payment.received',
    'payment.failed',
    'route.completed',
    'device.offline',
    'device.online'
  ];

  const handleCreateWebhook = async () => {
    try {
      const headers = newWebhookHeaders ? JSON.parse(newWebhookHeaders) : {};
      await createWebhook(newWebhookName, newWebhookUrl, newWebhookEvents);
      setIsCreateDialogOpen(false);
      // Reset form
      setNewWebhookName('');
      setNewWebhookUrl('');
      setNewWebhookEvents([]);
      setNewWebhookSecret('');
      setNewWebhookHeaders('');
      setNewWebhookTimeout(30);
      setNewWebhookMaxRetries(3);
    } catch (error) {
      console.error('Error creating webhook:', error);
    }
  };

  const handleTestWebhook = async (webhook: Webhook) => {
    setIsTesting(true);
    try {
      const result = await testWebhook(webhook.id);
      setTestResults(result);
    } catch (error) {
      console.error('Error testing webhook:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSecret(identifier);
      setTimeout(() => setCopiedSecret(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const toggleSecretVisibility = (webhookId: string) => {
    setShowSecret(showSecret === webhookId ? null : webhookId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Webhook className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando webhooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Webhook Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Configure and debug webhook endpoints for real-time notifications
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Webhook</DialogTitle>
              <DialogDescription>
                Configure a webhook endpoint to receive real-time notifications
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="webhook-name">Webhook Name</Label>
                <Input
                  id="webhook-name"
                  value={newWebhookName}
                  onChange={(e) => setNewWebhookName(e.target.value)}
                  placeholder="e.g., Production Notifications"
                />
              </div>
              
              <div>
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  placeholder="https://your-domain.com/webhook"
                />
              </div>
              
              <div>
                <Label>Events</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                  {availableEvents.map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <Switch
                        id={event}
                        checked={newWebhookEvents.includes(event)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewWebhookEvents([...newWebhookEvents, event]);
                          } else {
                            setNewWebhookEvents(newWebhookEvents.filter(e => e !== event));
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

              <div>
                <Label htmlFor="webhook-secret">Secret (optional)</Label>
                <Input
                  id="webhook-secret"
                  value={newWebhookSecret}
                  onChange={(e) => setNewWebhookSecret(e.target.value)}
                  placeholder="Enter secret for signature verification"
                />
              </div>

              <div>
                <Label htmlFor="webhook-headers">Custom Headers (JSON)</Label>
                <Textarea
                  id="webhook-headers"
                  value={newWebhookHeaders}
                  onChange={(e) => setNewWebhookHeaders(e.target.value)}
                  placeholder='{"Authorization": "Bearer token"}'
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="webhook-timeout">Timeout (seconds)</Label>
                  <Input
                    id="webhook-timeout"
                    type="number"
                    value={newWebhookTimeout}
                    onChange={(e) => setNewWebhookTimeout(Number(e.target.value))}
                    min="5"
                    max="300"
                  />
                </div>
                <div>
                  <Label htmlFor="webhook-retries">Max Retries</Label>
                  <Input
                    id="webhook-retries"
                    type="number"
                    value={newWebhookMaxRetries}
                    onChange={(e) => setNewWebhookMaxRetries(Number(e.target.value))}
                    min="0"
                    max="10"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWebhook} disabled={!newWebhookName || !newWebhookUrl || newWebhookEvents.length === 0}>
                Create Webhook
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold">{webhook.name}</h4>
                    <Badge className={getStatusColor(webhook.status)}>
                      {webhook.status}
                    </Badge>
                    <Badge variant="outline" className={getSuccessRateColor(webhook.success_rate)}>
                      {webhook.success_rate}% success
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>URL: {webhook.url}</span>
                      <span>Created: {formatDate(webhook.created_at)}</span>
                      <span>Last triggered: {webhook.last_triggered ? formatDate(webhook.last_triggered) : 'Never'}</span>
                      <span>Retries: {webhook.retry_count}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Secret:</span>
                      <div className="flex items-center space-x-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                          {showSecret === webhook.id ? webhook.secret : '••••••••••••••••••••••••••••••••'}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSecretVisibility(webhook.id)}
                        >
                          {showSecret === webhook.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(webhook.secret, webhook.id)}
                        >
                          {copiedSecret === webhook.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestWebhook(webhook)}
                    disabled={isTesting}
                  >
                    {isTesting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Handle delete */}}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {webhooks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Webhook className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Webhooks</h3>
              <p className="text-muted-foreground mb-4">
                Create your first webhook to receive real-time notifications
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Webhook
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TestTube className="h-5 w-5" />
              <span>Test Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Badge className={testResults.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {testResults.response_status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {testResults.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-sm">{testResults.duration}ms</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Event</Label>
                  <p className="text-sm">{testResults.event}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Retries</Label>
                  <p className="text-sm">{testResults.retry_count}</p>
                </div>
              </div>
              
              <Tabs defaultValue="payload" className="w-full">
                <TabsList>
                  <TabsTrigger value="payload">Payload</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                </TabsList>
                <TabsContent value="payload" className="space-y-2">
                  <Label>Request Payload</Label>
                  <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                    {JSON.stringify(testResults.payload, null, 2)}
                  </pre>
                </TabsContent>
                <TabsContent value="response" className="space-y-2">
                  <Label>Response Body</Label>
                  <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                    {testResults.response_body}
                  </pre>
                </TabsContent>
                <TabsContent value="headers" className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Request Headers</Label>
                      <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                        {JSON.stringify(testResults.request_headers, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <Label>Response Headers</Label>
                      <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                        {JSON.stringify(testResults.response_headers, null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Webhook Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Webhook Documentation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Event Types</h4>
              <div className="space-y-2">
                {availableEvents.map((event) => (
                  <div key={event} className="flex justify-between items-center p-2 bg-muted rounded">
                    <code className="text-sm">{event}</code>
                    <Badge variant="outline" className="text-xs">POST</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Security</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Webhooks include a signature header for verification</li>
                <li>• Use HTTPS endpoints for production</li>
                <li>• Implement idempotency to handle duplicates</li>
                <li>• Return 2xx status codes to acknowledge receipt</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 