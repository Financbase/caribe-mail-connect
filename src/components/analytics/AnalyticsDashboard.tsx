/**
 * Analytics Dashboard Component
 * Story 1.5: Advanced Analytics & Reporting
 * 
 * Comprehensive analytics dashboard with business intelligence,
 * real-time metrics, interactive visualizations, and data insights
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Package,
  MessageSquare,
  Eye,
  Download,
  RefreshCw,
  Settings,
  Zap,
  Target,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Globe,
  Lightbulb
} from 'lucide-react';
import { useAnalytics, useBusinessIntelligence, useRealTimeAnalytics, useAnalyticsInsights } from '@/hooks/useAnalytics';
import { useSubscription } from '@/contexts/SubscriptionContext';

// =====================================================
// EXECUTIVE KPI CARDS
// =====================================================

function ExecutiveKPICards() {
  const { metrics, isLoading } = useBusinessIntelligence();

  if (isLoading || !metrics?.executive_kpis) {
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

  const kpis = metrics.executive_kpis;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.revenue_growth_rate?.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground flex items-center">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            vs last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customer Growth</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.customer_growth_rate?.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            CLV: ${kpis.customer_lifetime_value?.toFixed(0)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Package Volume</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.package_volume_growth?.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Growth rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.customer_satisfaction_score?.toFixed(1)}/5</div>
          <p className="text-xs text-muted-foreground">
            Efficiency: {kpis.operational_efficiency_score?.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// =====================================================
// REAL-TIME METRICS
// =====================================================

function RealTimeMetrics() {
  const { metrics, refresh } = useRealTimeAnalytics();

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Activity
          </CardTitle>
          <CardDescription>Live system metrics and activity</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.active_users}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{metrics.packages_in_transit}</div>
            <div className="text-sm text-muted-foreground">In Transit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.pending_deliveries}</div>
            <div className="text-sm text-muted-foreground">Pending Deliveries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">${metrics.revenue_today?.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Revenue Today</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span>System Health</span>
            <Badge variant={metrics.system_health_score > 95 ? 'default' : 'destructive'}>
              {metrics.system_health_score?.toFixed(1)}%
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span>Response Time</span>
            <span className="text-muted-foreground">{metrics.current_response_time}ms</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// BUSINESS INSIGHTS
// =====================================================

function BusinessInsights() {
  const { insights, refresh, isLoading } = useAnalyticsInsights();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>Actionable business intelligence</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">{insight.title}</h4>
                <Badge variant={insight.impact === 'positive' ? 'default' : insight.impact === 'negative' ? 'destructive' : 'secondary'}>
                  {insight.impact}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
              {insight.recommendations && (
                <div className="space-y-1">
                  <div className="text-sm font-medium">Recommendations:</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {insight.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-3 text-xs text-muted-foreground">
                Confidence: {(insight.confidence * 100).toFixed(0)}%
              </div>
            </div>
          ))}
          {insights.length === 0 && (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No insights available</h3>
              <p className="text-muted-foreground">Check back later for AI-powered business insights.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// PERFORMANCE OVERVIEW
// =====================================================

function PerformanceOverview() {
  const { metrics } = useBusinessIntelligence();

  if (!metrics?.operational_metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const operational = metrics.operational_metrics;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Overview
        </CardTitle>
        <CardDescription>Operational efficiency metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">Package Processing</div>
              <div className="text-sm text-muted-foreground">
                Avg time: {operational.average_package_handling_time?.toFixed(1)}h
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{operational.package_processing_efficiency?.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">efficiency</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">Delivery Success</div>
              <div className="text-sm text-muted-foreground">
                Customer satisfaction
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{operational.delivery_success_rate?.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">success rate</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">System Uptime</div>
              <div className="text-sm text-muted-foreground">
                Last 30 days
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{operational.system_uptime?.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">uptime</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">Staff Productivity</div>
              <div className="text-sm text-muted-foreground">
                Packages per employee
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{operational.packages_per_employee?.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">per day</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// MAIN ANALYTICS DASHBOARD
// =====================================================

export function AnalyticsDashboard() {
  const { subscription } = useSubscription();
  const { error, refetch, isLoading } = useAnalytics();

  useEffect(() => {
    if (subscription) {
      refetch();
    }
  }, [subscription, refetch]);

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
          <h1 className="text-3xl font-bold">Analytics & Business Intelligence</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Story 1.5: Advanced Analytics & Reporting
          </Badge>
          <Button variant="outline" onClick={refetch} disabled={isLoading}>
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

      <ExecutiveKPICards />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Real-Time</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealTimeMetrics />
            <PerformanceOverview />
          </div>
          <BusinessInsights />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <RealTimeMetrics />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Activity Feed
              </CardTitle>
              <CardDescription>
                Real-time system events and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Live activity feed coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <BusinessInsights />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predictive Analytics
              </CardTitle>
              <CardDescription>
                AI-powered forecasting and predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Predictive analytics interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Custom Reports
              </CardTitle>
              <CardDescription>
                Generate and export custom analytics reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Custom reporting interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
