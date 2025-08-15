import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { usePerformance } from '@/hooks/usePerformance';
import { 
  Activity, 
  Zap, 
  Clock, 
  HardDrive, 
  Network, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Gauge
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function PerformanceDashboard() {
  const { 
    metrics, 
    performanceScore, 
    budgetViolations, 
    budget,
    trackAPICall 
  } = usePerformance();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-5 w-5 text-success" />;
    if (score >= 70) return <AlertTriangle className="h-5 w-5 text-warning" />;
    return <AlertTriangle className="h-5 w-5 text-destructive" />;
  };

  const webVitalsData = [
    {
      metric: 'LCP',
      value: metrics.lcp ? Math.round(metrics.lcp) : 0,
      budget: budget.maxLCP,
      unit: 'ms',
      description: 'Largest Contentful Paint',
      status: !metrics.lcp ? 'unknown' : metrics.lcp <= budget.maxLCP ? 'good' : metrics.lcp <= budget.maxLCP * 1.5 ? 'needs-improvement' : 'poor'
    },
    {
      metric: 'FID',
      value: metrics.fid ? Math.round(metrics.fid) : 0,
      budget: budget.maxFID,
      unit: 'ms',
      description: 'First Input Delay',
      status: !metrics.fid ? 'unknown' : metrics.fid <= budget.maxFID ? 'good' : metrics.fid <= budget.maxFID * 1.5 ? 'needs-improvement' : 'poor'
    },
    {
      metric: 'CLS',
      value: metrics.cls ? Number(metrics.cls.toFixed(3)) : 0,
      budget: budget.maxCLS,
      unit: '',
      description: 'Cumulative Layout Shift',
      status: !metrics.cls ? 'unknown' : metrics.cls <= budget.maxCLS ? 'good' : metrics.cls <= budget.maxCLS * 1.5 ? 'needs-improvement' : 'poor'
    },
    {
      metric: 'FCP',
      value: metrics.fcp ? Math.round(metrics.fcp) : 0,
      budget: budget.maxLCP / 2, // Use half of LCP budget
      unit: 'ms',
      description: 'First Contentful Paint',
      status: !metrics.fcp ? 'unknown' : metrics.fcp <= budget.maxLCP / 2 ? 'good' : metrics.fcp <= budget.maxLCP ? 'needs-improvement' : 'poor'
    }
  ];

  const apiResponseChartData = metrics.apiResponseTimes.slice(-10).map((api, index) => ({
    name: `${index + 1}`,
    responseTime: api.responseTime,
    endpoint: api.endpoint
  }));

  const memoryChartData = [
    { name: 'Used', value: metrics.jsHeapSize, color: '#3b82f6' },
    { name: 'Available', value: Math.max(0, metrics.jsHeapSizeLimit - metrics.jsHeapSize), color: '#e5e7eb' }
  ];

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      performanceScore,
      metrics,
      budgetViolations,
      recommendations: getRecommendations()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (metrics.lcp && metrics.lcp > budget.maxLCP) {
      recommendations.push('Optimize images and reduce server response times to improve LCP');
    }
    if (metrics.fid && metrics.fid > budget.maxFID) {
      recommendations.push('Reduce JavaScript execution time and defer non-critical scripts');
    }
    if (metrics.cls && metrics.cls > budget.maxCLS) {
      recommendations.push('Ensure images and ads have explicit dimensions to prevent layout shifts');
    }
    if (metrics.jsHeapSize > 30) {
      recommendations.push('Optimize memory usage by removing unused code and implementing lazy loading');
    }
    
    return recommendations;
  };

  return (
    <div className="space-y-6">
      {/* Performance Score Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Gauge className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Performance Score</h2>
              </div>
              <div className="flex items-center space-x-2">
                {getScoreIcon(performanceScore)}
                <span className={`text-3xl font-bold ${getScoreColor(performanceScore)}`}>
                  {performanceScore}
                </span>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={downloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          <Progress value={performanceScore} className="mt-4" />
          
          {budgetViolations.length > 0 && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Budget Violations:</strong>
                <ul className="mt-2 space-y-1">
                  {budgetViolations.map((violation, index) => (
                    <li key={index} className="text-sm">• {violation}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="vitals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vitals">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="api">API Performance</TabsTrigger>
          <TabsTrigger value="memory">Memory Usage</TabsTrigger>
          <TabsTrigger value="timing">Navigation Timing</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Core Web Vitals Tab */}
        <TabsContent value="vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {webVitalsData.map((vital) => (
              <Card key={vital.metric}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{vital.metric}</CardTitle>
                    <Badge variant={
                      vital.status === 'good' ? 'default' : 
                      vital.status === 'needs-improvement' ? 'secondary' : 
                      vital.status === 'poor' ? 'destructive' : 'outline'
                    }>
                      {vital.status === 'good' ? 'Good' : 
                       vital.status === 'needs-improvement' ? 'Needs Work' : 
                       vital.status === 'poor' ? 'Poor' : 'Unknown'}
                    </Badge>
                  </div>
                  <CardDescription>{vital.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {vital.value}{vital.unit}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Budget: {vital.budget}{vital.unit}
                  </p>
                  <Progress 
                    value={Math.min(100, (vital.value / vital.budget) * 100)} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* API Performance Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="h-5 w-5" />
                <span>API Response Times</span>
              </CardTitle>
              <CardDescription>
                Last 10 API calls response times
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apiResponseChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={apiResponseChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: unknown, name: unknown, props: unknown) => [
                        `${value}ms`,
                        props.payload.endpoint
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No API calls tracked yet
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Response Time by Endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(
                  metrics.apiResponseTimes.reduce((acc, api) => {
                    if (!acc[api.endpoint]) acc[api.endpoint] = [];
                    acc[api.endpoint].push(api.responseTime);
                    return acc;
                  }, {} as Record<string, number[]>)
                ).map(([endpoint, times]) => {
                  const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
                  return (
                    <div key={endpoint} className="flex justify-between items-center">
                      <span className="text-sm">{endpoint}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{avgTime}ms</span>
                        <Badge variant={avgTime <= budget.maxAPIResponse ? 'default' : 'destructive'}>
                          {avgTime <= budget.maxAPIResponse ? 'Good' : 'Slow'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Memory Usage Tab */}
        <TabsContent value="memory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5" />
                  <span>Memory Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Used Memory</span>
                      <span>{metrics.jsHeapSize}MB</span>
                    </div>
                    <Progress 
                      value={(metrics.jsHeapSize / metrics.jsHeapSizeLimit) * 100} 
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Used</span>
                      <div className="font-medium">{metrics.jsHeapSize}MB</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Limit</span>
                      <div className="font-medium">{metrics.jsHeapSizeLimit}MB</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={memoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}MB`, 'Memory']} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Navigation Timing Tab */}
        <TabsContent value="timing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Navigation Timing</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">DOM Content Loaded</span>
                  <div className="text-2xl font-bold">{Math.round(metrics.navigationTiming.domContentLoaded)}ms</div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Load Complete</span>
                  <div className="text-2xl font-bold">{Math.round(metrics.navigationTiming.loadComplete)}ms</div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Network Latency</span>
                  <div className="text-2xl font-bold">{Math.round(metrics.navigationTiming.networkLatency)}ms</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time to First Byte (TTFB)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold">
                  {metrics.ttfb ? Math.round(metrics.ttfb) : 0}ms
                </div>
                <Badge variant={
                  !metrics.ttfb ? 'outline' :
                  metrics.ttfb <= 200 ? 'default' : 
                  metrics.ttfb <= 500 ? 'secondary' : 'destructive'
                }>
                  {!metrics.ttfb ? 'Unknown' :
                   metrics.ttfb <= 200 ? 'Excellent' : 
                   metrics.ttfb <= 500 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Performance Recommendations</span>
              </CardTitle>
              <CardDescription>
                Actionable steps to improve your application's performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRecommendations().map((recommendation, index) => (
                  <Alert key={index}>
                    <Activity className="h-4 w-4" />
                    <AlertDescription>{recommendation}</AlertDescription>
                  </Alert>
                ))}
                
                {getRecommendations().length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Excellent Performance!</h3>
                    <p className="text-muted-foreground">
                      All metrics are within acceptable ranges. Keep up the good work!
                    </p>
                  </div>
                )}

                <div className="border-t pt-4 mt-6">
                  <h4 className="font-medium mb-2">General Optimization Tips:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Enable gzip compression for static assets</li>
                    <li>• Implement proper browser caching headers</li>
                    <li>• Use a Content Delivery Network (CDN)</li>
                    <li>• Optimize database queries and add indexes</li>
                    <li>• Implement code splitting and lazy loading</li>
                    <li>• Compress and optimize images</li>
                    <li>• Minimize and bundle JavaScript and CSS</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}