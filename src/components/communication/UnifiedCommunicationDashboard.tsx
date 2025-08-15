/**
 * Unified Communication Dashboard
 * Story 1.3: Unified Communication System
 * 
 * Comprehensive dashboard for managing multi-channel communications,
 * SaaS lifecycle automation, templates, and analytics
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Mail,
  MessageSquare,
  Phone,
  Send,
  Users,
  BarChart3,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  MessageCircle,
  Smartphone,
  Globe,
  Zap,
  Target,
  Calendar,
  Filter,
  Download,
  Upload,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useCommunication } from '@/hooks/useCommunication';
import type { CommunicationChannel, CommunicationType } from '@/types/communication';

// =====================================================
// MAIN COMPONENT
// =====================================================

export function UnifiedCommunicationDashboard() {
  const { subscription } = useSubscription();
  const {
    templates,
    workflows,
    recentCommunications,
    analytics,
    isLoading,
    error,
    sendCommunication,
    getTemplates,
    getWorkflows,
    getCommunicationHistory,
    getAnalytics
  } = useCommunication();

  const [selectedChannel, setSelectedChannel] = useState<CommunicationChannel>('email');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    if (subscription) {
      getTemplates();
      getWorkflows();
      getCommunicationHistory();
      getAnalytics(selectedTimeRange);
    }
  }, [subscription, selectedTimeRange]);

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
          <h1 className="text-3xl font-bold">Unified Communication System</h1>
          <p className="text-muted-foreground">
            Multi-channel communications with SaaS lifecycle automation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Story 1.3: Unified Communication System
          </Badge>
          <Button variant="outline" onClick={() => getAnalytics(selectedTimeRange)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Refresh Analytics
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Communication Overview */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sent</p>
                  <p className="text-2xl font-bold">{analytics.total_sent.toLocaleString()}</p>
                </div>
                <Send className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Rate</p>
                  <p className="text-2xl font-bold">{(analytics.delivery_rate * 100).toFixed(1)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Rate</p>
                  <p className="text-2xl font-bold">{(analytics.open_rate * 100).toFixed(1)}%</p>
                </div>
                <Mail className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Click Rate</p>
                  <p className="text-2xl font-bold">{(analytics.click_rate * 100).toFixed(1)}%</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Templates</p>
                  <p className="text-2xl font-bold">{templates.filter(t => t.is_active).length}</p>
                </div>
                <Edit className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Workflows</p>
                  <p className="text-2xl font-bold">{workflows.filter(w => w.is_active).length}</p>
                </div>
                <Zap className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Channel Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Channel Performance
                </CardTitle>
                <CardDescription>
                  Performance metrics by communication channel
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.channel_performance && (
                  <div className="space-y-4">
                    {Object.entries(analytics.channel_performance).map(([channel, metrics]) => (
                      <div key={channel} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {channel === 'email' && <Mail className="h-4 w-4" />}
                            {channel === 'sms' && <MessageSquare className="h-4 w-4" />}
                            {channel === 'whatsapp' && <MessageCircle className="h-4 w-4" />}
                            {channel === 'push' && <Smartphone className="h-4 w-4" />}
                            <span className="capitalize font-medium">{channel}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {metrics.sent} sent
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Delivery Rate</span>
                            <span>{(metrics.delivery_rate * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={metrics.delivery_rate * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Communications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Communications
                </CardTitle>
                <CardDescription>
                  Latest communication activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCommunications.slice(0, 5).map((comm) => (
                    <div key={comm.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {comm.channel === 'email' && <Mail className="h-4 w-4 text-blue-500" />}
                        {comm.channel === 'sms' && <MessageSquare className="h-4 w-4 text-green-500" />}
                        {comm.channel === 'whatsapp' && <MessageCircle className="h-4 w-4 text-green-600" />}
                        <div>
                          <p className="font-medium text-sm">{comm.subject || comm.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {comm.recipient_email || comm.recipient_phone}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={
                            comm.status === 'delivered' ? 'default' :
                            comm.status === 'failed' ? 'destructive' :
                            comm.status === 'sent' ? 'secondary' : 'outline'
                          }
                        >
                          {comm.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(comm.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SaaS Lifecycle Automation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                SaaS Lifecycle Automation
              </CardTitle>
              <CardDescription>
                Automated communication workflows for customer lifecycle stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { stage: 'Welcome', type: 'welcome', icon: <Users className="h-5 w-5" />, color: 'bg-blue-100 text-blue-700' },
                  { stage: 'Onboarding', type: 'onboarding', icon: <Play className="h-5 w-5" />, color: 'bg-green-100 text-green-700' },
                  { stage: 'Retention', type: 'retention_campaign', icon: <Target className="h-5 w-5" />, color: 'bg-purple-100 text-purple-700' },
                  { stage: 'Billing', type: 'billing_reminder', icon: <Calendar className="h-5 w-5" />, color: 'bg-orange-100 text-orange-700' }
                ].map((automation) => (
                  <div key={automation.stage} className={`p-4 rounded-lg ${automation.color}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {automation.icon}
                      <span className="font-medium">{automation.stage}</span>
                    </div>
                    <p className="text-sm opacity-80">
                      Automated {automation.stage.toLowerCase()} communications
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs">Active</span>
                      <Badge variant="outline" className="text-xs">
                        {workflows.filter(w => w.trigger_type === automation.type && w.is_active).length} workflows
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Communication Templates
                </span>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </CardTitle>
              <CardDescription>
                Manage email, SMS, and WhatsApp templates for automated communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {template.channel === 'email' && <Mail className="h-5 w-5 text-blue-500" />}
                      {template.channel === 'sms' && <MessageSquare className="h-5 w-5 text-green-500" />}
                      {template.channel === 'whatsapp' && <MessageCircle className="h-5 w-5 text-green-600" />}
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.type} • {template.language}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={template.is_active ? 'default' : 'secondary'}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Automation Workflows
                </span>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Workflow
                </Button>
              </CardTitle>
              <CardDescription>
                Automated communication workflows for customer lifecycle management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-purple-500" />
                      <div>
                        <h4 className="font-medium">{workflow.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {workflow.trigger_type} • {workflow.steps.length} steps
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={workflow.is_active ? 'default' : 'secondary'}>
                        {workflow.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Communication Analytics
              </CardTitle>
              <CardDescription>
                Detailed analytics and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed communication analytics and insights coming soon
                </p>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Communication Settings
              </CardTitle>
              <CardDescription>
                Configure communication providers and global settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Communication Settings</h3>
                <p className="text-muted-foreground mb-4">
                  Provider configuration and global communication settings
                </p>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Providers
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
