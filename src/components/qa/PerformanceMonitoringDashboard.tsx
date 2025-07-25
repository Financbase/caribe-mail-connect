import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Clock, 
  Database, 
  Globe, 
  MemoryStick, 
  TrendingUp, 
  TrendingDown,
  Zap
} from 'lucide-react';
import { useQA } from '@/hooks/useQA';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const PerformanceMonitoringDashboard = () => {
  const { performanceMetrics } = useQA();

  // Process performance metrics
  const responseTimeMetrics = performanceMetrics
    .filter(m => m.metric_type === 'api_response' && m.response_time_ms)
    .slice(-24)
    .map(m => ({
      time: new Date(m.recorded_at).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      responseTime: m.response_time_ms,
      endpoint: m.endpoint_or_page
    }));

  const pageLoadMetrics = performanceMetrics
    .filter(m => m.metric_type === 'page_load' && m.response_time_ms)
    .slice(-24)
    .map(m => ({
      time: new Date(m.recorded_at).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      loadTime: m.response_time_ms,
      page: m.endpoint_or_page
    }));

  const memoryMetrics = performanceMetrics
    .filter(m => m.metric_type === 'memory_usage' && m.memory_usage_mb)
    .slice(-24)
    .map(m => ({
      time: new Date(m.recorded_at).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      memory: m.memory_usage_mb
    }));

  // Calculate averages and trends
  const avgResponseTime = responseTimeMetrics.length > 0 
    ? responseTimeMetrics.reduce((acc, m) => acc + (m.responseTime || 0), 0) / responseTimeMetrics.length 
    : 0;

  const avgPageLoad = pageLoadMetrics.length > 0 
    ? pageLoadMetrics.reduce((acc, m) => acc + (m.loadTime || 0), 0) / pageLoadMetrics.length 
    : 0;

  const avgMemoryUsage = memoryMetrics.length > 0 
    ? memoryMetrics.reduce((acc, m) => acc + (m.memory || 0), 0) / memoryMetrics.length 
    : 0;

  const errorRateMetrics = performanceMetrics
    .filter(m => m.error_rate !== null && m.error_rate !== undefined)
    .slice(-24);
  
  const avgErrorRate = errorRateMetrics.length > 0 
    ? errorRateMetrics.reduce((acc, m) => acc + (m.error_rate || 0), 0) / errorRateMetrics.length 
    : 0;

  // Performance scoring
  const getPerformanceScore = (value: number, thresholds: { good: number; fair: number }) => {
    if (value <= thresholds.good) return { score: 100, status: 'excellent', color: 'text-success' };
    if (value <= thresholds.fair) return { score: 80, status: 'good', color: 'text-warning' };
    return { score: 50, status: 'poor', color: 'text-destructive' };
  };

  const responseTimeScore = getPerformanceScore(avgResponseTime, { good: 200, fair: 500 });
  const pageLoadScore = getPerformanceScore(avgPageLoad, { good: 1000, fair: 3000 });
  const memoryScore = getPerformanceScore(avgMemoryUsage, { good: 100, fair: 200 });

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime.toFixed(0)}ms</div>
            <Progress value={responseTimeScore.score} className="mt-2" />
            <p className={`text-xs mt-2 ${responseTimeScore.color}`}>
              {responseTimeScore.status}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Load Time</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgPageLoad / 1000).toFixed(1)}s</div>
            <Progress value={pageLoadScore.score} className="mt-2" />
            <p className={`text-xs mt-2 ${pageLoadScore.color}`}>
              {pageLoadScore.status}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMemoryUsage.toFixed(0)}MB</div>
            <Progress value={memoryScore.score} className="mt-2" />
            <p className={`text-xs mt-2 ${memoryScore.color}`}>
              {memoryScore.status}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgErrorRate.toFixed(1)}%</div>
            <div className="flex items-center gap-1 mt-2">
              {avgErrorRate < 1 ? (
                <TrendingDown className="h-3 w-3 text-success" />
              ) : (
                <TrendingUp className="h-3 w-3 text-destructive" />
              )}
              <p className={`text-xs ${avgErrorRate < 1 ? 'text-success' : 'text-destructive'}`}>
                {avgErrorRate < 1 ? 'Low' : avgErrorRate < 5 ? 'Moderate' : 'High'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              API Response Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeMetrics}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Page Load Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pageLoadMetrics}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Load Time (ms)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="loadTime" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Memory Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MemoryStick className="h-5 w-5" />
            Memory Usage Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={memoryMetrics}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="time" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
                label={{ value: 'Memory (MB)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {avgResponseTime > 500 && (
              <div className="p-4 border-l-4 border-l-warning bg-warning/10 rounded-lg">
                <h4 className="font-medium text-warning">Slow API Response Times</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Average response time is {avgResponseTime.toFixed(0)}ms. Consider optimizing database queries, 
                  adding caching, or scaling server resources.
                </p>
              </div>
            )}
            
            {avgPageLoad > 3000 && (
              <div className="p-4 border-l-4 border-l-destructive bg-destructive/10 rounded-lg">
                <h4 className="font-medium text-destructive">Slow Page Load Times</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Average page load time is {(avgPageLoad / 1000).toFixed(1)}s. Consider optimizing images, 
                  minifying assets, or implementing lazy loading.
                </p>
              </div>
            )}
            
            {avgMemoryUsage > 200 && (
              <div className="p-4 border-l-4 border-l-warning bg-warning/10 rounded-lg">
                <h4 className="font-medium text-warning">High Memory Usage</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Average memory usage is {avgMemoryUsage.toFixed(0)}MB. Monitor for memory leaks and 
                  consider optimizing data structures.
                </p>
              </div>
            )}
            
            {avgErrorRate > 5 && (
              <div className="p-4 border-l-4 border-l-destructive bg-destructive/10 rounded-lg">
                <h4 className="font-medium text-destructive">High Error Rate</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Error rate is {avgErrorRate.toFixed(1)}%. Review error logs and implement better 
                  error handling and monitoring.
                </p>
              </div>
            )}
            
            {avgResponseTime <= 200 && avgPageLoad <= 1000 && avgMemoryUsage <= 100 && avgErrorRate < 1 && (
              <div className="p-4 border-l-4 border-l-success bg-success/10 rounded-lg">
                <h4 className="font-medium text-success">Excellent Performance</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  All performance metrics are within optimal ranges. Keep up the good work!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};