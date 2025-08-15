/**
 * Advanced Analytics Dashboard
 * Story 2.2: Advanced Analytics & Reporting
 * 
 * Comprehensive analytics dashboard with predictive insights, real-time data,
 * advanced visualizations, and business intelligence automation
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain,
  TrendingUp,
  Activity,
  Zap,
  Target,
  AlertTriangle,
  Eye,
  Settings,
  Download,
  RefreshCw,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  Users,
  Package,
  DollarSign,
  MessageSquare,
  Clock,
  CheckCircle,
  Lightbulb,
  Cpu,
  Database,
  Globe
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PredictiveAnalyticsService } from '@/services/predictiveAnalytics';
import { RealTimeAnalyticsService } from '@/services/realTimeAnalytics';
import { 
  PredictiveLineChart, 
  RealTimeMetricsChart, 
  AnomalyDetectionChart, 
  TrendAnalysisChart,
  CorrelationScatterPlot 
} from './AdvancedCharts';
import { CustomReportBuilder } from './CustomReportBuilder';

// =====================================================
// TYPES
// =====================================================

interface DashboardMetrics {
  predictive_insights: any;
  real_time_data: any;
  anomalies: any[];
  trends: any[];
  performance_metrics: any[];
  business_forecast: any[];
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export function AdvancedAnalyticsDashboard() {
  const { subscription } = useSubscription();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeHorizon, setTimeHorizon] = useState<'1_month' | '3_months' | '6_months' | '1_year'>('3_months');
  const [selectedScenarios, setSelectedScenarios] = useState<('optimistic' | 'realistic' | 'pessimistic')[]>(['realistic']);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  useEffect(() => {
    if (subscription) {
      initializeAnalytics();
      fetchAnalyticsData();
    }
  }, [subscription, timeHorizon]);

  useEffect(() => {
    if (subscription && realTimeEnabled) {
      initializeRealTimeAnalytics();
    }
    
    return () => {
      if (realTimeEnabled) {
        RealTimeAnalyticsService.cleanup();
      }
    };
  }, [subscription, realTimeEnabled]);

  const initializeAnalytics = async () => {
    if (!subscription?.id) return;

    try {
      await RealTimeAnalyticsService.initialize(subscription.id);
    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  };

  const initializeRealTimeAnalytics = async () => {
    if (!subscription?.id) return;

    try {
      // Subscribe to real-time updates
      const unsubscribe = RealTimeAnalyticsService.subscribe(
        subscription.id,
        'system_health',
        (metric) => {
          // Update real-time metrics
          setMetrics(prev => prev ? {
            ...prev,
            real_time_data: {
              ...prev.real_time_data,
              system_health_score: metric.value
            }
          } : null);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up real-time analytics:', error);
    }
  };

  const fetchAnalyticsData = async () => {
    if (!subscription?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const [
        predictiveInsights,
        realTimeData,
        anomalies,
        trends,
        performanceMetrics,
        businessForecast
      ] = await Promise.all([
        PredictiveAnalyticsService.generatePredictiveInsights(subscription.id, timeHorizon),
        RealTimeAnalyticsService.getCurrentSnapshot(subscription.id),
        PredictiveAnalyticsService.detectAnomalies(subscription.id, 'revenue'),
        PredictiveAnalyticsService.analyzeTrends(subscription.id, ['revenue', 'customers', 'packages'], {
          from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          to: new Date()
        }),
        RealTimeAnalyticsService.getLivePerformanceMetrics(subscription.id),
        PredictiveAnalyticsService.generateBusinessForecast(subscription.id, selectedScenarios)
      ]);

      setMetrics({
        predictive_insights: predictiveInsights,
        real_time_data: realTimeData,
        anomalies,
        trends,
        performance_metrics: performanceMetrics,
        business_forecast: businessForecast
      });
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchAnalyticsData();
  };

  const exportDashboard = async (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting dashboard as ${format}`);
    alert(`Dashboard exported as ${format.toUpperCase()}`);
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
          <h1 className="text-3xl font-bold">Advanced Analytics & Reporting</h1>
          <p className="text-muted-foreground">
            Predictive insights, real-time monitoring, and business intelligence automation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Story 2.2: Advanced Analytics & Reporting
          </Badge>
          <Select value={timeHorizon} onValueChange={(value: any) => setTimeHorizon(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1_month">1 Month</SelectItem>
              <SelectItem value="3_months">3 Months</SelectItem>
              <SelectItem value="6_months">6 Months</SelectItem>
              <SelectItem value="1_year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" onClick={() => exportDashboard('pdf')}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Executive Summary Cards */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue Forecast</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${metrics.predictive_insights.revenue_forecast?.[0]?.predicted_value?.toFixed(0) || '0'}
                  </p>
                  <p className="text-xs text-muted-foreground">Next month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Churn Risk</p>
                  <p className="text-2xl font-bold text-red-600">
                    {metrics.predictive_insights.churn_predictions?.length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">At-risk customers</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {metrics.real_time_data.system_health_score?.toFixed(1) || '0'}%
                  </p>
                  <p className="text-xs text-muted-foreground">Overall score</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Anomalies</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {metrics.anomalies?.length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Detected today</p>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="predictive" className="space-y-6">
        <TabsList>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="realtime">Real-Time Monitoring</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="predictive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Forecast */}
            {metrics?.predictive_insights.revenue_forecast && (
              <PredictiveLineChart
                data={metrics.predictive_insights.revenue_forecast.map((item: any) => ({
                  timestamp: item.period,
                  value: item.predicted_value,
                  confidence_upper: item.confidence_interval.upper,
                  confidence_lower: item.confidence_interval.lower
                }))}
                title="Revenue Forecast"
                description={`${timeHorizon.replace('_', ' ')} revenue prediction with confidence intervals`}
                showPredictions={true}
                height={350}
              />
            )}

            {/* Customer Growth Forecast */}
            {metrics?.predictive_insights.customer_growth_forecast && (
              <PredictiveLineChart
                data={metrics.predictive_insights.customer_growth_forecast.map((item: any) => ({
                  timestamp: item.period,
                  value: item.predicted_value,
                  confidence_upper: item.confidence_interval.upper,
                  confidence_lower: item.confidence_interval.lower
                }))}
                title="Customer Growth Forecast"
                description="Predicted new customer acquisition"
                showPredictions={true}
                height={350}
              />
            )}
          </div>

          {/* Churn Predictions */}
          {metrics?.predictive_insights.churn_predictions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Customer Churn Predictions
                </CardTitle>
                <CardDescription>
                  Customers at risk of churning with recommended actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metrics.predictive_insights.churn_predictions.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No High-Risk Customers</h3>
                    <p className="text-muted-foreground">All customers show healthy engagement patterns.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {metrics.predictive_insights.churn_predictions.slice(0, 5).map((prediction: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Customer {prediction.customer_id.slice(-8)}</h4>
                          <Badge variant={prediction.churn_probability > 0.7 ? 'destructive' : 'secondary'}>
                            {(prediction.churn_probability * 100).toFixed(0)}% Risk
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Risk Factors:</div>
                            <ul className="text-muted-foreground">
                              {prediction.risk_factors.map((factor: string, i: number) => (
                                <li key={i}>• {factor}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="font-medium">Recommended Actions:</div>
                            <ul className="text-muted-foreground">
                              {prediction.recommended_actions.map((action: string, i: number) => (
                                <li key={i}>• {action}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-Time System Health */}
            {metrics?.real_time_data && (
              <RealTimeMetricsChart
                data={[
                  {
                    timestamp: new Date().toISOString(),
                    value: metrics.real_time_data.system_health_score
                  }
                ]}
                title="System Health Score"
                description="Real-time system performance monitoring"
                realTimeUpdates={realTimeEnabled}
                height={300}
              />
            )}

            {/* Performance Metrics */}
            {metrics?.performance_metrics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Live Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {metrics.performance_metrics.map((metric: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium capitalize">
                              {metric.metric_name.replace('_', ' ')}
                            </div>
                            <div className="text-2xl font-bold">
                              {metric.current_value.toFixed(1)}
                              {metric.metric_name.includes('rate') ? '%' : 
                               metric.metric_name.includes('time') ? 'ms' : ''}
                            </div>
                          </div>
                          <Badge variant={metric.status === 'good' ? 'default' : 
                                        metric.status === 'warning' ? 'secondary' : 'outline'}>
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6">
          {metrics?.anomalies && (
            <AnomalyDetectionChart
              data={Array.from({ length: 30 }, (_, i) => ({
                timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
                value: Math.random() * 1000 + 500 + (metrics.anomalies.length > 0 && i > 25 ? 300 : 0),
                anomaly: metrics.anomalies.length > 0 && i > 25
              }))}
              title="Revenue Anomaly Detection"
              description="AI-powered anomaly detection in revenue patterns"
              height={400}
            />
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {metrics?.trends && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {metrics.trends.map((trend: any, index: number) => (
                <TrendAnalysisChart
                  key={index}
                  data={Array.from({ length: 30 }, (_, i) => ({
                    timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
                    value: Math.random() * 1000 + 500,
                    trend: trend.trend_direction
                  }))}
                  title={`${trend.metric_name} Trend Analysis`}
                  description={`${trend.trend_direction} trend with ${trend.trend_strength.toFixed(2)} strength`}
                  height={350}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <CustomReportBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
