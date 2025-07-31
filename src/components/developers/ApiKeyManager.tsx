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
  RefreshCw,
  Shield,
  Activity,
  Calendar,
  AlertTriangle,
  Key,
  Download,
  Upload
} from 'lucide-react';
import { useDevelopers } from '@/hooks/useDevelopers';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string;
  permissions: string[];
  rate_limit: number;
  status: 'active' | 'inactive' | 'suspended';
  usage_count: number;
  expires_at?: string;
  ip_restrictions?: string[];
  user_agent_restrictions?: string[];
}

export function ApiKeyManager() {
  const { apiKeys, loading, createApiKey, revokeApiKey, regenerateApiKey } = useDevelopers();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Form states
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);
  const [newKeyRateLimit, setNewKeyRateLimit] = useState(1000);
  const [newKeyExpiresAt, setNewKeyExpiresAt] = useState('');
  const [newKeyIpRestrictions, setNewKeyIpRestrictions] = useState('');
  const [newKeyUserAgentRestrictions, setNewKeyUserAgentRestrictions] = useState('');

  const availablePermissions = [
    'read:packages',
    'write:packages',
    'read:customers',
    'write:customers',
    'read:mailboxes',
    'write:mailboxes',
    'read:analytics',
    'write:analytics',
    'read:webhooks',
    'write:webhooks',
    'admin:all'
  ];

  const handleCreateKey = async () => {
    try {
      await createApiKey(newKeyName, newKeyPermissions);
      setIsCreateDialogOpen(false);
      // Reset form
      setNewKeyName('');
      setNewKeyPermissions([]);
      setNewKeyRateLimit(1000);
      setNewKeyExpiresAt('');
      setNewKeyIpRestrictions('');
      setNewKeyUserAgentRestrictions('');
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const handleRegenerateKey = async () => {
    if (!selectedKey) return;
    
    try {
      await regenerateApiKey(selectedKey.id);
      setIsRegenerateDialogOpen(false);
      setSelectedKey(null);
    } catch (error) {
      console.error('Error regenerating API key:', error);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      await revokeApiKey(keyId);
    } catch (error) {
      console.error('Error revoking API key:', error);
    }
  };

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(showKey === keyId ? null : keyId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <Key className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando claves API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Manage your API keys and access permissions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key with specific permissions and restrictions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                />
              </div>
              
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Switch
                        id={permission}
                        checked={newKeyPermissions.includes(permission)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewKeyPermissions([...newKeyPermissions, permission]);
                          } else {
                            setNewKeyPermissions(newKeyPermissions.filter(p => p !== permission));
                          }
                        }}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission.replace(':', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="rate-limit">Rate Limit (requests/minute)</Label>
                <Input
                  id="rate-limit"
                  type="number"
                  value={newKeyRateLimit}
                  onChange={(e) => setNewKeyRateLimit(Number(e.target.value))}
                  min="1"
                  max="10000"
                />
              </div>

              <div>
                <Label htmlFor="expires-at">Expires At (optional)</Label>
                <Input
                  id="expires-at"
                  type="datetime-local"
                  value={newKeyExpiresAt}
                  onChange={(e) => setNewKeyExpiresAt(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="ip-restrictions">IP Restrictions (optional)</Label>
                <Textarea
                  id="ip-restrictions"
                  value={newKeyIpRestrictions}
                  onChange={(e) => setNewKeyIpRestrictions(e.target.value)}
                  placeholder="Enter IP addresses, one per line"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateKey} disabled={!newKeyName || newKeyPermissions.length === 0}>
                Create Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((key) => (
          <Card key={key.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold">{key.name}</h4>
                    <Badge className={getStatusColor(key.status)}>
                      {key.status}
                    </Badge>
                    {key.expires_at && (
                      <Badge variant="outline">
                        Expires {formatDate(key.expires_at)}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Created: {formatDate(key.created_at)}</span>
                      <span>Last used: {key.last_used ? formatDate(key.last_used) : 'Never'}</span>
                      <span>Usage: {key.usage_count.toLocaleString()} calls</span>
                      <span>Rate limit: {key.rate_limit}/min</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Key:</span>
                      <div className="flex items-center space-x-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                          {showKey === key.id ? key.key : '••••••••••••••••••••••••••••••••'}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {showKey === key.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(key.key, key.id)}
                        >
                          {copiedKey === key.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {key.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Dialog open={isRegenerateDialogOpen && selectedKey?.id === key.id} onOpenChange={(open) => {
                    if (open) {
                      setSelectedKey(key);
                      setIsRegenerateDialogOpen(true);
                    } else {
                      setIsRegenerateDialogOpen(false);
                      setSelectedKey(null);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Regenerate API Key</DialogTitle>
                        <DialogDescription>
                          This will invalidate the current key and generate a new one. Make sure to update your applications.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRegenerateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleRegenerateKey}>
                          Regenerate Key
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeKey(key.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {apiKeys.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No API Keys</h3>
              <p className="text-muted-foreground mb-4">
                Create your first API key to start integrating with PRMCMS
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">API Key Security</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Never commit API keys to version control</li>
                <li>• Use environment variables for storage</li>
                <li>• Rotate keys regularly</li>
                <li>• Set appropriate rate limits</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Access Control</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Grant minimum required permissions</li>
                <li>• Use IP restrictions when possible</li>
                <li>• Monitor key usage regularly</li>
                <li>• Revoke unused keys</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 