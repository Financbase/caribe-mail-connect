import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Zap,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  users: {
    total: number;
    active: number;
    new: number;
    returning: number;
  };
  performance: {
    avgLoadTime: number;
    errorRate: number;
    uptime: number;
    pageViews: number;
  };
  errors: {
    total: number;
    critical: number;
    resolved: number;
    pending: number;
  };
  feedback: {
    total: number;
    positive: number;
    negative: number;
    averageRating: number;
  };
  timeSeries: {
    timestamp: number;
    users: number;
    errors: number;
    loadTime: number;
  }[];
}

interface AnalyticsDashboardProps {
  refreshInterval?: number; // in milliseconds
  showRealTime?: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  refreshInterval = 30000, // 30 seconds
  showRealTime = true
}) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchAnalyticsData();
    
    if (showRealTime && refreshInterval > 0) {
      const interval = setInterval(fetchAnalyticsData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [timeRange, refreshInterval, showRealTime]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would fetch from your analytics API
      const mockData: AnalyticsData = {
        users: {
          total: 1247,
          active: 89,
          new: 23,
          returning: 66
        },
        performance: {
          avgLoadTime: 2.3,
          errorRate: 0.8,
          uptime: 99.7,
          pageViews: 15420
        },
        errors: {
          total: 45,
          critical: 3,
          resolved: 38,
          pending: 4
        },
        feedback: {
          total: 156,
          positive: 134,
          negative: 22,
          averageRating: 4.2
        },
        timeSeries: generateTimeSeriesData(timeRange)
      };

      setData(mockData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSeriesData = (range: string) => {
    const now = Date.now();
    const dataPoints = range === '1h' ? 60 : range === '24h' ? 24 : range === '7d' ? 7 : 30;
    const interval = range === '1h' ? 60000 : range === '24h' ? 3600000 : range === '7d' ? 86400000 : 86400000;
    
    return Array.from({ length: dataPoints }, (_, i) => ({
      timestamp: now - (dataPoints - i) * interval,
      users: Math.floor(Math.random() * 100) + 50,
      errors: Math.floor(Math.random() * 10),
      loadTime: Math.random() * 5 + 1
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusColor = (value: number, threshold: number) => {
    return value <= threshold ? 'text-green-600' : 'text-red-600';
  };

  const exportData = () => {
    if (!data) return;
    
    const csvContent = [
      'Metric,Value',
      `Total Users,${data.users.total}`,
      `Active Users,${data.users.active}`,
      `Average Load Time,${data.performance.avgLoadTime}s`,
      `Error Rate,${data.performance.errorRate}%`,
      `Uptime,${data.performance.uptime}%`
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-gray-600">Analytics data is not available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Last updated: {lastUpdated.toLocaleTimeString()}
            {showRealTime && <Badge className="ml-2">Live</Badge>}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={fetchAnalyticsData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.users.total)}</div>
            <p className="text-xs text-muted-foreground">
              +{data.users.new} new this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.users.active}</div>
            <p className="text-xs text-muted-foreground">
              {((data.users.active / data.users.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Load Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(data.performance.avgLoadTime, 3)}`}>
              {data.performance.avgLoadTime}s
            </div>
            <p className="text-xs text-muted-foreground">
              Target: &lt;3s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(data.performance.errorRate, 1)}`}>
              {data.performance.errorRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {data.errors.critical} critical errors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Uptime</span>
              <span className="font-semibold">{data.performance.uptime}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Page Views</span>
              <span className="font-semibold">{formatNumber(data.performance.pageViews)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Average Session Duration</span>
              <span className="font-semibold">4m 32s</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Bounce Rate</span>
              <span className="font-semibold">23.4%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Error Tracking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Errors</span>
              <span className="font-semibold">{data.errors.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Critical Errors</span>
              <span className="font-semibold text-red-600">{data.errors.critical}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Resolved</span>
              <span className="font-semibold text-green-600">{data.errors.resolved}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Pending</span>
              <span className="font-semibold text-yellow-600">{data.errors.pending}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="w-5 h-5" />
            <span>User Feedback</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{data.feedback.total}</div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.feedback.positive}</div>
              <div className="text-sm text-gray-600">Positive</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{data.feedback.negative}</div>
              <div className="text-sm text-gray-600">Negative</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.feedback.averageRating}/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Series Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LineChart className="w-5 h-5" />
            <span>User Activity Over Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Chart visualization would be implemented here</p>
              <p className="text-sm text-gray-500">
                {data.timeSeries.length} data points for {timeRange}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Hook for using analytics data
export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (timeRange: string = '24h') => {
    setLoading(true);
    try {
      // Implement actual API call here
      const response = await fetch(`/api/analytics?range=${timeRange}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return { analyticsData, loading, fetchData };
}; 