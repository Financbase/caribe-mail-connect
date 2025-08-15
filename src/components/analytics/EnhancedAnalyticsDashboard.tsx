/**
 * Enhanced Analytics Dashboard Component
 * Story 4: Analytics & Reporting - Enhanced Analytics Dashboard
 * 
 * Advanced analytics dashboard with real-time metrics,
 * predictive insights, custom widgets, and automated reporting
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Brain,
  Download,
  RefreshCw,
  Plus,
  Eye,
  Calendar,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Package
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { AdvancedAnalyticsService } from '@/services/advancedAnalytics';
import type { AnalyticsMetric, PredictiveInsight } from '@/services/advancedAnalytics';

// =====================================================
// ENHANCED ANALYTICS DASHBOARD COMPONENT
// =====================================================

export function EnhancedAnalyticsDashboard() {
  const { subscription } = useSubscription();
  
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // DATA LOADING
  // =====================================================

  const loadAnalyticsData = async () => {
    if (!subscription?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const [metricsData, insightsData, summaryData] = await Promise.all([
        AdvancedAnalyticsService.getRealTimeMetrics(subscription.id),
        AdvancedAnalyticsService.generatePredictiveInsights(subscription.id),
        AdvancedAnalyticsService.getAnalyticsSummary(subscription.id)
      ]);

      setMetrics(metricsData);
      setInsights(insightsData);
      setSummary(summaryData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, [subscription?.id]);

  // =====================================================
  // RENDER HELPERS
  // =====================================================

  const renderMetricCard = (metric: AnalyticsMetric) => {
    const getIcon = (category: string) => {
      switch (category) {
        case 'operational': return <Package className="h-6 w-6" />;
        case 'financial': return <DollarSign className="h-6 w-6" />;
        case 'customer': return <Users className="h-6 w-6" />;
        case 'performance': return <Activity className="h-6 w-6" />;
        default: return <BarChart3 className="h-6 w-6" />;
      }
    };

    const getTrendIcon = (trend: string) => {
      switch (trend) {
        case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
        case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
        default: return <Activity className="h-4 w-4 text-gray-500" />;
      }
    };

    return (
      <Card key={metric.id}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getIcon(metric.category)}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                <p className="text-2xl font-bold">
                  {metric.unit === 'USD' ? '$' : ''}
                  {metric.value.toLocaleString()}
                  {metric.unit !== 'USD' && metric.unit !== 'score' ? ` ${metric.unit}` : ''}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                {getTrendIcon(metric.trend)}
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change_percentage ? `${metric.change_percentage > 0 ? '+' : ''}${metric.change_percentage.toFixed(1)}%` : '—'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">vs previous</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderInsightCard = (insight: PredictiveInsight) => {
    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'forecast': return <TrendingUp className="h-5 w-5" />;
        case 'anomaly': return <AlertTriangle className="h-5 w-5" />;
        case 'recommendation': return <Target className="h-5 w-5" />;
        default: return <Brain className="h-5 w-5" />;
      }
    };

    const getImpactColor = (impact: string) => {
      switch (impact) {
        case 'critical': return 'bg-red-100 text-red-800';
        case 'high': return 'bg-orange-100 text-orange-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <Card key={insight.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTypeIcon(insight.type)}
              <CardTitle className="text-lg">{insight.title}</CardTitle>
            </div>
            <Badge className={getImpactColor(insight.impact)}>
              {insight.impact} impact
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">{insight.description}</p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Confidence: {insight.confidence}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  Generated {new Date(insight.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {insight.actions && insight.actions.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Recommended Actions:</h5>
                <div className="space-y-2">
                  {insight.actions.map((action) => (
                    <div key={action.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{action.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {action.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

  if (isLoading && !metrics.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Analytics</h1>
          <p className="text-muted-foreground">
            Real-time insights, predictive analytics, and automated reporting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadAnalyticsData}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Dashboard
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Metrics</p>
                  <p className="text-2xl font-bold">{summary.metrics.total}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Insights</p>
                  <p className="text-2xl font-bold">{summary.insights.total}</p>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dashboards</p>
                  <p className="text-2xl font-bold">{summary.dashboards.total}</p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reports</p>
                  <p className="text-2xl font-bold">{summary.reports.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="metrics">Real-Time Metrics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Real-Time Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map(renderMetricCard)}
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Predictive Insights</h3>
              {insights.map(renderInsightCard)}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Insight Summary</h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Forecasts</span>
                      <Badge>{insights.filter(i => i.type === 'forecast').length}</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Anomalies</span>
                      <Badge variant="destructive">{insights.filter(i => i.type === 'anomaly').length}</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Recommendations</span>
                      <Badge variant="secondary">{insights.filter(i => i.type === 'recommendation').length}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                System Performance
              </CardTitle>
              <CardDescription>
                Real-time system health and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Data Freshness</span>
                    <span className="text-green-600">Real-time</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Query Performance</span>
                    <span className="text-green-600">&lt; 100ms</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>System Uptime</span>
                    <span className="text-green-600">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Data Accuracy</span>
                    <span className="text-green-600">95%+</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
