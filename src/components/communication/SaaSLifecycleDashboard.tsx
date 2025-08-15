/**
 * SaaS Lifecycle Dashboard Component
 * Story 1.3: Unified Communication System
 * 
 * Dashboard for managing SaaS lifecycle automation workflows,
 * customer engagement metrics, and communication analytics
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Mail, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  BarChart3,
  MessageSquare,
  UserCheck,
  UserX,
  Calendar,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Edit
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';

// =====================================================
// TYPES
// =====================================================

interface WorkflowExecution {
  id: string;
  workflow_id: string;
  customer_id: string;
  status: 'running' | 'waiting' | 'completed' | 'failed' | 'cancelled';
  current_step: number;
  started_at: string;
  completed_at?: string;
  workflow: {
    name: string;
    trigger_type: string;
  };
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface EngagementMetrics {
  total_customers: number;
  active_customers: number;
  trial_customers: number;
  churned_customers: number;
  average_engagement_score: number;
  churn_risk_customers: number;
  email_open_rate: number;
  automation_success_rate: number;
}

interface LifecycleEvent {
  id: string;
  event_type: string;
  customer_id: string;
  occurred_at: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export function SaaSLifecycleDashboard() {
  const { subscription } = useSubscription();
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [events, setEvents] = useState<LifecycleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subscription) {
      fetchData();
    }
  }, [subscription]);

  const fetchData = async () => {
    if (!subscription?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch workflow executions
      const { data: executionsData, error: executionsError } = await supabase
        .from('communication_workflow_executions')
        .select(`
          *,
          workflow:communication_workflows(name, trigger_type),
          customer:customers(first_name, last_name, email)
        `)
        .eq('subscription_id', subscription.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (executionsError) throw executionsError;

      // Fetch lifecycle events
      const { data: eventsData, error: eventsError } = await supabase
        .from('saas_lifecycle_events')
        .select(`
          *,
          customer:customers(first_name, last_name, email)
        `)
        .eq('subscription_id', subscription.id)
        .order('occurred_at', { ascending: false })
        .limit(20);

      if (eventsError) throw eventsError;

      // Calculate metrics
      const metricsData = await calculateMetrics(subscription.id);

      setExecutions(executionsData || []);
      setEvents(eventsData || []);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Error fetching SaaS lifecycle data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = async (subscriptionId: string): Promise<EngagementMetrics> => {
    // In a real implementation, this would be calculated server-side
    // For now, return mock data
    return {
      total_customers: 150,
      active_customers: 120,
      trial_customers: 25,
      churned_customers: 5,
      average_engagement_score: 0.75,
      churn_risk_customers: 8,
      email_open_rate: 0.68,
      automation_success_rate: 0.92
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'waiting': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'running': return <Play className="h-4 w-4" />;
      case 'waiting': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      case 'cancelled': return <Pause className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

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
          <h1 className="text-3xl font-bold">SaaS Lifecycle Automation</h1>
          <p className="text-muted-foreground">
            Manage customer lifecycle workflows and engagement automation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Story 1.3: Unified Communication System
          </Badge>
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold">{metrics.total_customers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Customers</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.active_customers}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Churn Risk</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.churn_risk_customers}</p>
                </div>
                <UserX className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Automation Success</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(metrics.automation_success_rate * 100).toFixed(0)}%
                  </p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Metrics */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Key performance indicators for SaaS lifecycle automation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Engagement Score</span>
                  <span>{(metrics.average_engagement_score * 100).toFixed(0)}%</span>
                </div>
                <Progress value={metrics.average_engagement_score * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Email Open Rate</span>
                  <span>{(metrics.email_open_rate * 100).toFixed(0)}%</span>
                </div>
                <Progress value={metrics.email_open_rate * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Automation Success</span>
                  <span>{(metrics.automation_success_rate * 100).toFixed(0)}%</span>
                </div>
                <Progress value={metrics.automation_success_rate * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="executions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="executions">Workflow Executions</TabsTrigger>
          <TabsTrigger value="events">Lifecycle Events</TabsTrigger>
          <TabsTrigger value="workflows">Manage Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="executions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Recent Workflow Executions
              </CardTitle>
              <CardDescription>
                Monitor automated workflow executions and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {executions.length === 0 ? (
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Workflow Executions</h3>
                  <p className="text-muted-foreground">Workflow executions will appear here as they run.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {executions.map((execution) => (
                    <div key={execution.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{execution.workflow?.name || 'Unknown Workflow'}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`flex items-center gap-1 ${getStatusColor(execution.status)}`}>
                            {getStatusIcon(execution.status)}
                            {execution.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Customer</div>
                          <div className="text-muted-foreground">
                            {execution.customer?.first_name} {execution.customer?.last_name}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Trigger</div>
                          <div className="text-muted-foreground capitalize">
                            {execution.workflow?.trigger_type?.replace('_', ' ')}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Current Step</div>
                          <div className="text-muted-foreground">Step {execution.current_step}</div>
                        </div>
                        <div>
                          <div className="font-medium">Started</div>
                          <div className="text-muted-foreground">
                            {new Date(execution.started_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {execution.status === 'running' && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Play className="h-4 w-4" />
                            Workflow is currently executing
                          </div>
                        </div>
                      )}

                      {execution.status === 'completed' && execution.completed_at && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            Completed on {new Date(execution.completed_at).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Lifecycle Events
              </CardTitle>
              <CardDescription>
                Track customer lifecycle events and automation triggers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Lifecycle Events</h3>
                  <p className="text-muted-foreground">Customer lifecycle events will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">
                          {event.event_type.replace('_', ' ')}
                        </h4>
                        <Badge variant="outline">
                          {new Date(event.occurred_at).toLocaleDateString()}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Customer: {event.customer?.first_name} {event.customer?.last_name}
                        <br />
                        Email: {event.customer?.email}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Workflow Management
              </CardTitle>
              <CardDescription>
                Configure and manage SaaS lifecycle automation workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Workflow Management</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced workflow configuration interface coming soon.
                </p>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Workflows
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
