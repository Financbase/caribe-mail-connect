/**
 * Performance Optimization Dashboard
 * Story 2.3: Performance Optimization & Scalability
 * 
 * Database optimization, caching strategies, CDN integration,
 * load balancing, and horizontal scaling capabilities
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Zap,
  Database,
  Globe,
  Server,
  BarChart3,
  Clock,
  Cpu,
  HardDrive,
  Network,
  Activity,
  TrendingUp,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Monitor,
  Layers,
  CloudLightning,
  Gauge,
  Target,
  Rocket,
  Shield,
  Eye,
  Download,
  Upload,
  Timer,
  MemoryStick,
  Wifi,
  Smartphone,
  Image,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import type { 
  PerformanceMetrics,
  CacheMetrics,
  DatabaseMetrics,
  ScalabilityMetrics,
  CDNMetrics
} from '@/types/performance';

// =====================================================
// MAIN COMPONENT
// =====================================================

export function PerformanceOptimizationDashboard() {
  const { subscription } = useSubscription();
  const {
    performanceMetrics,
    cacheMetrics,
    databaseMetrics,
    scalabilityMetrics,
    cdnMetrics,
    optimizationRecommendations,
    isLoading,
    error,
    refreshMetrics,
    runOptimization,
    clearCache,
    optimizeDatabase,
    scaleResources
  } = usePerformanceOptimization();

  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [optimizationRunning, setOptimizationRunning] = useState(false);

  useEffect(() => {
    if (subscription) {
      refreshMetrics(selectedTimeRange);
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

  const handleOptimization = async () => {
    setOptimizationRunning(true);
    try {
      await runOptimization();
      await refreshMetrics(selectedTimeRange);
    } finally {
      setOptimizationRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Optimization & Scalability</h1>
          <p className="text-muted-foreground">
            Database optimization, caching strategies, CDN integration, and horizontal scaling
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Story 2.3: Performance Optimization & Scalability
          </Badge>
          <Button 
            variant="outline" 
            onClick={() => refreshMetrics(selectedTimeRange)}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleOptimization}
            disabled={optimizationRunning}
          >
            <Rocket className={`h-4 w-4 mr-2 ${optimizationRunning ? 'animate-pulse' : ''}`} />
            {optimizationRunning ? 'Optimizing...' : 'Run Optimization'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Performance Overview */}
      {performanceMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Performance Score</p>
                  <p className="text-2xl font-bold">{performanceMetrics.overall_score}/100</p>
                  <p className="text-xs text-green-600">
                    {performanceMetrics.score_trend > 0 ? '+' : ''}{performanceMetrics.score_trend}
                  </p>
                </div>
                <Gauge className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="text-2xl font-bold">{performanceMetrics.avg_response_time}ms</p>
                  <p className="text-xs text-blue-600">
                    {performanceMetrics.response_time_trend < 0 ? '' : '+'}{performanceMetrics.response_time_trend}ms
                  </p>
                </div>
                <Timer className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cache Hit Rate</p>
                  <p className="text-2xl font-bold">{(cacheMetrics?.hit_rate * 100).toFixed(1)}%</p>
                  <p className="text-xs text-purple-600">
                    {cacheMetrics?.hit_rate_trend > 0 ? '+' : ''}{(cacheMetrics?.hit_rate_trend * 100).toFixed(1)}%
                  </p>
                </div>
                <Layers className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">DB Query Time</p>
                  <p className="text-2xl font-bold">{databaseMetrics?.avg_query_time}ms</p>
                  <p className="text-xs text-orange-600">
                    {databaseMetrics?.query_time_trend < 0 ? '' : '+'}{databaseMetrics?.query_time_trend}ms
                  </p>
                </div>
                <Database className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CDN Hit Rate</p>
                  <p className="text-2xl font-bold">{(cdnMetrics?.hit_rate * 100).toFixed(1)}%</p>
                  <p className="text-xs text-green-600">
                    {cdnMetrics?.bandwidth_saved} GB saved
                  </p>
                </div>
                <Globe className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Instances</p>
                  <p className="text-2xl font-bold">{scalabilityMetrics?.active_instances}</p>
                  <p className="text-xs text-red-600">
                    CPU: {scalabilityMetrics?.avg_cpu_usage}%
                  </p>
                </div>
                <Server className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="database">Database Optimization</TabsTrigger>
          <TabsTrigger value="caching">Caching Strategy</TabsTrigger>
          <TabsTrigger value="cdn">CDN & Assets</TabsTrigger>
          <TabsTrigger value="scaling">Auto Scaling</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Core Web Vitals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Core Web Vitals
                </CardTitle>
                <CardDescription>
                  Google's Core Web Vitals performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {performanceMetrics?.core_web_vitals && (
                  <div className="space-y-4">
                    {Object.entries(performanceMetrics.core_web_vitals).map(([metric, data]) => (
                      <div key={metric} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{metric.replace('_', ' ')}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{data.value}{data.unit}</span>
                            <Badge 
                              variant={
                                data.rating === 'good' ? 'default' :
                                data.rating === 'needs-improvement' ? 'secondary' : 'destructive'
                              }
                            >
                              {data.rating}
                            </Badge>
                          </div>
                        </div>
                        <Progress 
                          value={data.percentile} 
                          className={`h-2 ${
                            data.rating === 'good' ? 'bg-green-100' :
                            data.rating === 'needs-improvement' ? 'bg-yellow-100' : 'bg-red-100'
                          }`} 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resource Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Resource Usage
                </CardTitle>
                <CardDescription>
                  Current system resource utilization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      name: 'CPU Usage', 
                      value: scalabilityMetrics?.avg_cpu_usage || 0, 
                      icon: <Cpu className="h-4 w-4" />,
                      color: 'text-blue-600'
                    },
                    { 
                      name: 'Memory Usage', 
                      value: scalabilityMetrics?.avg_memory_usage || 0, 
                      icon: <MemoryStick className="h-4 w-4" />,
                      color: 'text-green-600'
                    },
                    { 
                      name: 'Disk I/O', 
                      value: scalabilityMetrics?.avg_disk_usage || 0, 
                      icon: <HardDrive className="h-4 w-4" />,
                      color: 'text-orange-600'
                    },
                    { 
                      name: 'Network', 
                      value: scalabilityMetrics?.avg_network_usage || 0, 
                      icon: <Network className="h-4 w-4" />,
                      color: 'text-purple-600'
                    }
                  ].map((resource) => (
                    <div key={resource.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={resource.color}>{resource.icon}</span>
                          <span className="font-medium">{resource.name}</span>
                        </div>
                        <span className="text-sm">{resource.value}%</span>
                      </div>
                      <Progress value={resource.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Optimization Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Optimization Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered recommendations to improve performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {optimizationRecommendations?.map((recommendation) => (
                  <div key={recommendation.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        recommendation.priority === 'high' ? 'bg-red-100 text-red-600' :
                        recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {recommendation.category === 'database' && <Database className="h-4 w-4" />}
                        {recommendation.category === 'caching' && <Layers className="h-4 w-4" />}
                        {recommendation.category === 'cdn' && <Globe className="h-4 w-4" />}
                        {recommendation.category === 'scaling' && <Server className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{recommendation.title}</h4>
                        <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                        <p className="text-xs text-green-600 mt-1">
                          Expected improvement: {recommendation.expected_improvement}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          recommendation.priority === 'high' ? 'destructive' :
                          recommendation.priority === 'medium' ? 'secondary' : 'outline'
                        }
                      >
                        {recommendation.priority}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Apply
                      </Button>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">System Optimized</h3>
                    <p className="text-muted-foreground">
                      No optimization recommendations at this time. Your system is performing well!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Performance
                </span>
                <Button onClick={optimizeDatabase}>
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize Database
                </Button>
              </CardTitle>
              <CardDescription>
                Database query optimization and performance tuning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    name: 'Query Performance',
                    value: `${databaseMetrics?.avg_query_time || 0}ms`,
                    trend: databaseMetrics?.query_time_trend || 0,
                    icon: <Search className="h-5 w-5" />,
                    color: 'bg-blue-100 text-blue-700'
                  },
                  {
                    name: 'Index Efficiency',
                    value: `${(databaseMetrics?.index_efficiency * 100).toFixed(1)}%`,
                    trend: databaseMetrics?.index_trend || 0,
                    icon: <Target className="h-5 w-5" />,
                    color: 'bg-green-100 text-green-700'
                  },
                  {
                    name: 'Connection Pool',
                    value: `${databaseMetrics?.active_connections}/${databaseMetrics?.max_connections}`,
                    trend: databaseMetrics?.connection_trend || 0,
                    icon: <Network className="h-5 w-5" />,
                    color: 'bg-purple-100 text-purple-700'
                  },
                  {
                    name: 'Cache Hit Rate',
                    value: `${(databaseMetrics?.cache_hit_rate * 100).toFixed(1)}%`,
                    trend: databaseMetrics?.cache_trend || 0,
                    icon: <Layers className="h-5 w-5" />,
                    color: 'bg-orange-100 text-orange-700'
                  }
                ].map((metric) => (
                  <div key={metric.name} className={`p-4 rounded-lg ${metric.color}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {metric.icon}
                      <span className="font-medium text-sm">{metric.name}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-xs">
                        {metric.trend > 0 ? '+' : ''}{metric.trend} from last hour
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="caching" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Caching Strategy
                </span>
                <Button onClick={clearCache} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
              </CardTitle>
              <CardDescription>
                Multi-layer caching performance and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced Caching System</h3>
                <p className="text-muted-foreground mb-4">
                  Multi-layer caching with Redis, browser cache, and CDN optimization
                </p>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Cache Strategy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cdn" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                CDN & Asset Optimization
              </CardTitle>
              <CardDescription>
                Content delivery network and static asset optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CloudLightning className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">CDN Performance</h3>
                <p className="text-muted-foreground mb-4">
                  Global content delivery with Cloudflare integration
                </p>
                <Button variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  View CDN Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scaling" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Auto Scaling
                </span>
                <Button onClick={scaleResources}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Scale Resources
                </Button>
              </CardTitle>
              <CardDescription>
                Horizontal scaling and load balancing configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Auto Scaling Configuration</h3>
                <p className="text-muted-foreground mb-4">
                  Automatic horizontal scaling based on demand
                </p>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Scaling Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Real-time Performance Monitoring
              </CardTitle>
              <CardDescription>
                Live performance metrics and alerting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Performance Monitoring</h3>
                <p className="text-muted-foreground mb-4">
                  Real-time monitoring with alerts and notifications
                </p>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Live Metrics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
