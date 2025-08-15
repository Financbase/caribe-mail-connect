/**
 * Communication Dashboard Component
 * Story 1.3: Unified Communication System
 * 
 * Comprehensive communication management dashboard with multi-channel support,
 * templates, workflows, and analytics
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Send, 
  TrendingUp, 
  TrendingDown,
  Users,
  Template,
  Workflow,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react';
import { useCommunication } from '@/hooks/useCommunication';
import { useSubscription } from '@/contexts/SubscriptionContext';
import type { CommunicationChannel } from '@/types/communication';

// =====================================================
// COMMUNICATION STATS CARDS
// =====================================================

function CommunicationStatsCards() {
  const { analytics, recentCommunications, isLoading } = useCommunication();

  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const deliveryRate = analytics.total_sent > 0 ? (analytics.total_delivered / analytics.total_sent) * 100 : 0;
  const openRate = analytics.total_delivered > 0 ? (analytics.total_opened / analytics.total_delivered) * 100 : 0;
  const todayCount = recentCommunications.filter(c => {
    const today = new Date().toDateString();
    return new Date(c.created_at).toDateString() === today;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
          <Send className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.total_sent}</div>
          <p className="text-xs text-muted-foreground">
            {todayCount} sent today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{deliveryRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {analytics.total_delivered} delivered
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {analytics.total_opened} opened
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed Rate</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics.total_sent > 0 ? ((analytics.total_failed / analytics.total_sent) * 100).toFixed(1) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            {analytics.total_failed} failed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// =====================================================
// CHANNEL PERFORMANCE
// =====================================================

function ChannelPerformance() {
  const { analytics } = useCommunication();

  if (!analytics?.channel_metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Channel Performance</CardTitle>
          <CardDescription>Performance metrics by communication channel</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <Smartphone className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Send className="h-4 w-4" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'text-blue-600';
      case 'sms':
        return 'text-green-600';
      case 'whatsapp':
        return 'text-emerald-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Channel Performance
        </CardTitle>
        <CardDescription>Performance metrics by communication channel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(analytics.channel_metrics).map(([channel, metrics]: [string, any]) => (
            <div key={channel} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={getChannelColor(channel)}>
                  {getChannelIcon(channel)}
                </div>
                <div>
                  <h4 className="font-medium capitalize">{channel}</h4>
                  <p className="text-sm text-muted-foreground">
                    {metrics.sent} sent • {metrics.delivered} delivered
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{metrics.delivery_rate?.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">delivery rate</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// RECENT COMMUNICATIONS
// =====================================================

function RecentCommunications() {
  const { recentCommunications, isLoading } = useCommunication();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sent: { label: 'Sent', variant: 'default' as const },
      delivered: { label: 'Delivered', variant: 'default' as const },
      read: { label: 'Read', variant: 'default' as const },
      failed: { label: 'Failed', variant: 'destructive' as const },
      queued: { label: 'Queued', variant: 'secondary' as const },
      sending: { label: 'Sending', variant: 'secondary' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.queued;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getChannelIcon = (channel: CommunicationChannel) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <Smartphone className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      default:
        return <Send className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-4 w-4 bg-muted rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-6 w-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Communications
        </CardTitle>
        <CardDescription>Latest communication activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentCommunications.slice(0, 10).map((comm) => (
            <div key={comm.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getChannelIcon(comm.channel)}
                <div>
                  <h4 className="font-medium">{comm.subject || comm.type}</h4>
                  <p className="text-sm text-muted-foreground">
                    {comm.recipient_email || comm.recipient_phone} • {new Date(comm.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {getStatusBadge(comm.status)}
            </div>
          ))}
          {recentCommunications.length === 0 && (
            <div className="text-center py-8">
              <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No communications yet</h3>
              <p className="text-muted-foreground">Start sending communications to see them here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// QUICK ACTIONS
// =====================================================

function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>Common communication tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start" variant="outline">
          <Template className="mr-2 h-4 w-4" />
          Create Template
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Workflow className="mr-2 h-4 w-4" />
          Setup Workflow
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Send className="mr-2 h-4 w-4" />
          Send Broadcast
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Manage Segments
        </Button>
      </CardContent>
    </Card>
  );
}

// =====================================================
// MAIN COMMUNICATION DASHBOARD
// =====================================================

export function CommunicationDashboard() {
  const { subscription } = useSubscription();
  const { error } = useCommunication();

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
          <h1 className="text-3xl font-bold">Communication Center</h1>
          <p className="text-muted-foreground">
            Manage multi-channel communications with customers
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          Story 1.3: Unified Communication System
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CommunicationStatsCards />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ChannelPerformance />
              <RecentCommunications />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Template className="h-5 w-5" />
                Communication Templates
              </CardTitle>
              <CardDescription>
                Manage email, SMS, and WhatsApp templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Template management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Communication Workflows
              </CardTitle>
              <CardDescription>
                Automated communication sequences and triggers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Workflow management interface coming soon...</p>
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
                Detailed performance metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Advanced analytics interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
