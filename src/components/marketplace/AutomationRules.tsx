import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Zap,
  Plus,
  Settings,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  Filter,
  Mail,
  Package,
  Truck,
  Bell,
  Webhook,
  FileText,
  Eye,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMarketplace } from '@/hooks/useMarketplace';
import { MarketplaceIntegration, MarketplaceType, AutomationType } from '@/types/marketplace';
import { toast } from '@/hooks/use-toast';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  type: AutomationType;
  marketplace?: MarketplaceType;
  isActive: boolean;
  trigger: {
    event: string;
    schedule?: string;
    conditions?: Record<string, unknown>;
  };
  actions: Array<{
    type: string;
    parameters: Record<string, unknown>;
  }>;
  lastExecution: string;
  executionCount: number;
  errorCount: number;
  createdAt: string;
}

interface CreateRuleFormProps {
  integrations: MarketplaceIntegration[];
  initialData?: Partial<AutomationRule>;
  onCreateRule: (data: AutomationRule) => void;
  onClose: () => void;
}

const automationTypes: Record<AutomationType, { icon: React.ReactNode; label: string; description: string }> = {
  order_import: {
    icon: <Package className="h-4 w-4" />,
    label: 'Order Import',
    description: 'Automatically import new orders from marketplaces'
  },
  status_sync: {
    icon: <Activity className="h-4 w-4" />,
    label: 'Status Sync',
    description: 'Sync order status changes between systems'
  },
  label_print: {
    icon: <FileText className="h-4 w-4" />,
    label: 'Label Printing',
    description: 'Auto-generate and print shipping labels'
  },
  notification: {
    icon: <Bell className="h-4 w-4" />,
    label: 'Notifications',
    description: 'Send automated notifications and alerts'
  },
  inventory_sync: {
    icon: <Package className="h-4 w-4" />,
    label: 'Inventory Sync',
    description: 'Keep inventory levels synchronized'
  }
};

const mockRules = [
  {
    id: 'rule-1',
    name: 'Auto Import Amazon Orders',
    description: 'Automatically import new orders from Amazon every 15 minutes',
    type: 'order_import' as AutomationType,
    marketplace: 'amazon' as MarketplaceType,
    isActive: true,
    trigger: {
      event: 'schedule',
      schedule: '*/15 * * * *'
    },
    actions: [
      { type: 'import_orders', parameters: { status: 'pending' } }
    ],
    lastExecution: '2024-01-15T10:30:00Z',
    executionCount: 1247,
    errorCount: 3,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'rule-2',
    name: 'eBay Status Updates',
    description: 'Update eBay order status when packages are shipped',
    type: 'status_sync' as AutomationType,
    marketplace: 'ebay' as MarketplaceType,
    isActive: true,
    trigger: {
      event: 'order_status_change',
      conditions: { status: 'shipped' }
    },
    actions: [
      { type: 'update_marketplace_status', parameters: { status: 'shipped' } },
      { type: 'send_tracking_info', parameters: {} }
    ],
    lastExecution: '2024-01-15T09:45:00Z',
    executionCount: 567,
    errorCount: 0,
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'rule-3',
    name: 'Priority Order Notifications',
    description: 'Send SMS alerts for high-priority orders',
    type: 'notification' as AutomationType,
    marketplace: undefined,
    isActive: true,
    trigger: {
      event: 'order_created',
      conditions: { priority: 'high' }
    },
    actions: [
      { type: 'send_sms', parameters: { message: 'High priority order received' } },
      { type: 'send_email', parameters: { template: 'priority_order' } }
    ],
    lastExecution: '2024-01-15T08:20:00Z',
    executionCount: 89,
    errorCount: 1,
    createdAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 'rule-4',
    name: 'Shopify Inventory Sync',
    description: 'Sync inventory levels with Shopify store',
    type: 'inventory_sync' as AutomationType,
    marketplace: 'shopify' as MarketplaceType,
    isActive: false,
    trigger: {
      event: 'inventory_change',
      conditions: {}
    },
    actions: [
      { type: 'update_inventory', parameters: { sync_direction: 'bidirectional' } }
    ],
    lastExecution: '2024-01-14T18:30:00Z',
    executionCount: 234,
    errorCount: 12,
    createdAt: '2024-01-04T00:00:00Z'
  }
];

export function AutomationRules({ integrations, loading }: { integrations: MarketplaceIntegration[], loading: boolean }) {
  const [rules, setRules] = useState<AutomationRule[]>(mockRules);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [filterType, setFilterType] = useState<AutomationType | 'all'>('all');
  const [filterMarketplace, setFilterMarketplace] = useState<MarketplaceType | 'all'>('all');

  const { createAutomationRule, toggleAutomationRule } = useMarketplace();

  const filteredRules = rules.filter(rule => {
    const matchesType = filterType === 'all' || rule.type === filterType;
    const matchesMarketplace = filterMarketplace === 'all' || rule.marketplace === filterMarketplace;
    return matchesType && matchesMarketplace;
  });

  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: enabled } : rule
    ));
    await toggleAutomationRule(ruleId, enabled);
  };

  const handleCreateRule = async (ruleData: AutomationRule) => {
    try {
      // Implementation would create rule in database
      toast.success('Regla de automatización creada exitosamente');
    } catch (error) {
      toast.error('Error al crear regla de automatización');
    }
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
          <h2 className="text-2xl font-bold">Automation Rules</h2>
          <p className="text-muted-foreground">
            Configure automated workflows and business rules
          </p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Automation Rule</DialogTitle>
              <DialogDescription>
                Set up a new automated workflow for your marketplace operations
              </DialogDescription>
            </DialogHeader>
            <CreateRuleForm 
              integrations={integrations}
              onCreateRule={handleCreateRule}
              onClose={() => setIsCreating(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Automation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Rules</p>
                <p className="text-2xl font-bold">{rules.length}</p>
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
                <p className="text-2xl font-bold">{rules.filter(r => r.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Executions</p>
                <p className="text-2xl font-bold">
                  {rules.reduce((sum, r) => sum + r.executionCount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold">{rules.reduce((sum, r) => sum + r.errorCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">97.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rule Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Templates</CardTitle>
          <CardDescription>
            Get started quickly with pre-configured automation templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(automationTypes).map(([type, config]) => (
              <Card key={type} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{config.label}</h3>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-3 w-3 mr-1" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automation Rules Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>
                Manage your automated workflows and business rules
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(automationTypes).map(([type, config]) => (
                    <SelectItem key={type} value={type}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterMarketplace} onValueChange={(value) => setFilterMarketplace(value as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Marketplaces</SelectItem>
                  {integrations.map((integration) => (
                    <SelectItem key={integration.id} value={integration.marketplace}>
                      {integration.marketplace.charAt(0).toUpperCase() + integration.marketplace.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Marketplace</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.map((rule) => {
                const successRate = rule.executionCount > 0 
                  ? ((rule.executionCount - rule.errorCount) / rule.executionCount * 100) 
                  : 100;

                return (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-xs text-muted-foreground">{rule.description}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {automationTypes[rule.type].icon}
                        <span className="text-sm">{automationTypes[rule.type].label}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {rule.marketplace ? (
                        <Badge variant="secondary" className="capitalize">
                          {rule.marketplace}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">All</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                          size="sm"
                        />
                        <Badge className={cn(
                          "text-xs",
                          rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        )}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="font-medium">{rule.executionCount.toLocaleString()}</p>
                        {rule.errorCount > 0 && (
                          <p className="text-xs text-red-600">{rule.errorCount} errors</p>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {rule.lastExecution 
                          ? new Date(rule.lastExecution).toLocaleString()
                          : 'Never'
                        }
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={cn(
                          "text-sm font-medium",
                          successRate >= 95 ? 'text-green-600' :
                          successRate >= 80 ? 'text-yellow-600' :
                          'text-red-600'
                        )}>
                          {successRate.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingRule(rule)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredRules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No automation rules found</p>
              <p className="text-sm">Create your first rule to automate your workflows</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Rule Dialog */}
      <Dialog open={!!editingRule} onOpenChange={() => setEditingRule(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Automation Rule</DialogTitle>
            <DialogDescription>
              Modify the automation rule configuration
            </DialogDescription>
          </DialogHeader>
          {editingRule && (
            <CreateRuleForm 
              integrations={integrations}
              initialData={editingRule}
              onCreateRule={(data) => {
                setRules(prev => prev.map(rule => 
                  rule.id === editingRule.id ? { ...rule, ...data } : rule
                ));
                setEditingRule(null);
              }}
              onClose={() => setEditingRule(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateRuleForm({ 
  integrations, 
  initialData, 
  onCreateRule, 
  onClose 
}: CreateRuleFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    type: initialData?.type || 'order_import',
    marketplace: initialData?.marketplace || '',
    isActive: initialData?.isActive ?? true,
    triggerEvent: initialData?.trigger?.event || 'schedule',
    triggerConditions: initialData?.trigger?.conditions || {},
    actions: initialData?.actions || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ruleData = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      marketplace: formData.marketplace || undefined,
      isActive: formData.isActive,
      trigger: {
        event: formData.triggerEvent,
        conditions: formData.triggerConditions
      },
      actions: formData.actions.length > 0 ? formData.actions : [
        { type: 'default_action', parameters: {} }
      ]
    };
    
    onCreateRule(ruleData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="rule-name">Rule Name</Label>
          <Input
            id="rule-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter rule name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="rule-description">Description</Label>
          <Textarea
            id="rule-description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe what this rule does"
            rows={2}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rule-type">Automation Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(automationTypes).map(([type, config]) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center space-x-2">
                      {config.icon}
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="rule-marketplace">Marketplace (Optional)</Label>
            <Select value={formData.marketplace} onValueChange={(value) => setFormData(prev => ({ ...prev, marketplace: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All marketplaces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All marketplaces</SelectItem>
                {integrations.map((integration) => (
                  <SelectItem key={integration.id} value={integration.marketplace}>
                    {integration.marketplace.charAt(0).toUpperCase() + integration.marketplace.slice(1)} - {integration.accountName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Trigger Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Trigger Configuration</h3>
        
        <div>
          <Label htmlFor="trigger-event">Trigger Event</Label>
          <Select value={formData.triggerEvent} onValueChange={(value) => setFormData(prev => ({ ...prev, triggerEvent: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="schedule">Schedule (Time-based)</SelectItem>
              <SelectItem value="order_created">Order Created</SelectItem>
              <SelectItem value="order_status_change">Order Status Change</SelectItem>
              <SelectItem value="inventory_change">Inventory Change</SelectItem>
              <SelectItem value="webhook">Webhook Received</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.triggerEvent === 'schedule' && (
          <div>
            <Label htmlFor="schedule">Schedule</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="*/15 * * * *">Every 15 minutes</SelectItem>
                <SelectItem value="0 * * * *">Every hour</SelectItem>
                <SelectItem value="0 */6 * * *">Every 6 hours</SelectItem>
                <SelectItem value="0 9 * * *">Daily at 9 AM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Actions Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Actions</h3>
        
        <div className="p-4 border rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground">
            Actions will be configured based on the automation type selected. 
            Advanced action configuration will be available after creating the rule.
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label>Enable rule immediately</Label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Rule' : 'Create Rule'}
        </Button>
      </div>
    </form>
  );
} 