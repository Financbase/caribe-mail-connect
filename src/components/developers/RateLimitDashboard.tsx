import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  RefreshCw,
  Download,
  Activity,
  Zap,
  Shield,
  Users,
  Globe
} from 'lucide-react';
import { useDevelopers } from '@/hooks/useDevelopers';

interface RateLimit {
  endpoint: string;
  current_usage: number;
  limit: number;
  reset_time: string;
  window: 'minute' | 'hour' | 'day';
  remaining: number;
}

interface UsageMetric {
  timestamp: string;
  endpoint: string;
  requests: number;
  errors: number;
  avg_response_time: number;
  unique_users: number;
}

export function RateLimitDashboard() {
  const { rateLimits, usageMetrics, loading } = useDevelopers();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedEndpoint, setSelectedEndpoint] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const timeframes = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const endpoints = ['all', ...Array.from(new Set(rateLimits.map(r => r.endpoint)))];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.round((current / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUsageBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-PR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRateLimits = selectedEndpoint === 'all' 
    ? rateLimits 
    : rateLimits.filter(r => r.endpoint === selectedEndpoint);

  const totalRequests = usageMetrics.reduce((sum, metric) => sum + metric.requests, 0);
  const totalErrors = usageMetrics.reduce((sum, metric) => sum + metric.errors, 0);
  const avgResponseTime = usageMetrics.length > 0 
    ? Math.round(usageMetrics.reduce((sum, metric) => sum + metric.avg_response_time, 0) / usageMetrics.length)
    : 0;
  const uniqueUsers = new Set(usageMetrics.flatMap(m => [m.unique_users])).size;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando métricas de uso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Rate Limit Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Monitor API usage, rate limits, and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((timeframe) => (
                <SelectItem key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Requests</span>
            </div>
            <p className="text-2xl font-bold">{totalRequests.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Error Rate</span>
            </div>
            <p className="text-2xl font-bold">{totalErrors.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              {totalRequests > 0 ? ((totalErrors / totalRequests) * 100).toFixed(2) : 0}% error rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Avg Response Time</span>
            </div>
            <p className="text-2xl font-bold">{avgResponseTime}ms</p>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              -5% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Active Users</span>
            </div>
            <p className="text-2xl font-bold">{uniqueUsers}</p>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rate Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Rate Limits</span>
          </CardTitle>
          <CardDescription>
            Current usage and limits for each API endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by endpoint" />
                </SelectTrigger>
                <SelectContent>
                  {endpoints.map((endpoint) => (
                    <SelectItem key={endpoint} value={endpoint}>
                      {endpoint === 'all' ? 'All Endpoints' : endpoint}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>

            <div className="space-y-3">
              {filteredRateLimits.map((rateLimit) => {
                const usagePercentage = getUsagePercentage(rateLimit.current_usage, rateLimit.limit);
                return (
                  <div key={rateLimit.endpoint} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {rateLimit.endpoint}
                        </code>
                        <Badge variant="outline" className="text-xs">
                          {rateLimit.window}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {rateLimit.current_usage.toLocaleString()} / {rateLimit.limit.toLocaleString()}
                        </p>
                        <p className={`text-xs ${getUsageColor(usagePercentage)}`}>
                          {usagePercentage}% used
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getUsageBarColor(usagePercentage)}`}
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{rateLimit.remaining.toLocaleString()} remaining</span>
                        <span>Resets at {formatTime(rateLimit.reset_time)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Usage Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="requests" className="w-full">
            <TabsList>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
              <TabsTrigger value="response-time">Response Time</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests" className="space-y-4">
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Request volume chart would be displayed here</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="errors" className="space-y-4">
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Error rate chart would be displayed here</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="response-time" className="space-y-4">
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Response time chart would be displayed here</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Alerts and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Rate Limit Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRateLimits
              .filter(r => getUsagePercentage(r.current_usage, r.limit) >= 75)
              .map((rateLimit) => {
                const usagePercentage = getUsagePercentage(rateLimit.current_usage, rateLimit.limit);
                return (
                  <Alert key={rateLimit.endpoint} className={usagePercentage >= 90 ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
                    <AlertTriangle className={`h-4 w-4 ${usagePercentage >= 90 ? 'text-red-600' : 'text-yellow-600'}`} />
                    <AlertDescription>
                      <strong>{rateLimit.endpoint}</strong> is at {usagePercentage}% capacity. 
                      {usagePercentage >= 90 ? ' Consider upgrading your plan or implementing caching.' : ' Monitor usage closely.'}
                    </AlertDescription>
                  </Alert>
                );
              })}
            
            {filteredRateLimits.filter(r => getUsagePercentage(r.current_usage, r.limit) >= 75).length === 0 && (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p className="text-muted-foreground">No rate limit alerts at this time</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Rate Limiting Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Optimization Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Implement client-side caching to reduce API calls</li>
                <li>• Use batch endpoints when available</li>
                <li>• Implement exponential backoff for retries</li>
                <li>• Monitor rate limit headers in responses</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Monitoring</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Set up alerts for 80%+ usage</li>
                <li>• Track usage patterns over time</li>
                <li>• Monitor error rates and response times</li>
                <li>• Plan for traffic spikes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 