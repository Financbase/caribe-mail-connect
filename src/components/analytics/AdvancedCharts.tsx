/**
 * Advanced Data Visualization Components
 * Story 2.2: Advanced Analytics & Reporting
 * 
 * Advanced chart components with interactive features, real-time updates,
 * predictive overlays, and sophisticated data visualization
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ComposedChart,
  LineChart,
  AreaChart,
  ScatterChart,
  Scatter,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Brush,
  Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Zap, 
  AlertTriangle,
  Eye,
  Settings,
  Download,
  Maximize2,
  RefreshCw
} from 'lucide-react';

// =====================================================
// TYPES
// =====================================================

interface ChartDataPoint {
  timestamp: string;
  value: number;
  predicted?: number;
  confidence_upper?: number;
  confidence_lower?: number;
  anomaly?: boolean;
  trend?: 'up' | 'down' | 'stable';
}

interface AdvancedChartProps {
  data: ChartDataPoint[];
  title: string;
  description?: string;
  type: 'line' | 'area' | 'composed' | 'scatter' | 'heatmap';
  showPredictions?: boolean;
  showAnomalies?: boolean;
  showTrends?: boolean;
  realTimeUpdates?: boolean;
  height?: number;
  onDataPointClick?: (point: ChartDataPoint) => void;
}

// =====================================================
// PREDICTIVE LINE CHART
// =====================================================

export function PredictiveLineChart({ 
  data, 
  title, 
  description, 
  showPredictions = true,
  showAnomalies = true,
  height = 400,
  onDataPointClick
}: AdvancedChartProps) {
  const [timeRange, setTimeRange] = useState('all');
  const [showConfidenceInterval, setShowConfidenceInterval] = useState(true);

  const filteredData = useMemo(() => {
    if (timeRange === 'all') return data;
    
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoff = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    
    return data.filter(d => new Date(d.timestamp) >= cutoff);
  }, [data, timeRange]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{new Date(label).toLocaleDateString()}</p>
          <p className="text-blue-600">
            Actual: {payload[0].value?.toFixed(2)}
          </p>
          {data.predicted && (
            <p className="text-purple-600">
              Predicted: {data.predicted.toFixed(2)}
            </p>
          )}
          {data.anomaly && (
            <Badge variant="destructive" className="mt-1">
              Anomaly Detected
            </Badge>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
                <SelectItem value="90d">90d</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="confidence"
              checked={showConfidenceInterval}
              onCheckedChange={setShowConfidenceInterval}
            />
            <Label htmlFor="confidence" className="text-sm">Confidence Interval</Label>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredData} onClick={onDataPointClick}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Confidence interval area */}
              {showConfidenceInterval && showPredictions && (
                <Area
                  type="monotone"
                  dataKey="confidence_upper"
                  stackId="confidence"
                  stroke="none"
                  fill="rgba(139, 92, 246, 0.1)"
                  connectNulls={false}
                />
              )}
              
              {showConfidenceInterval && showPredictions && (
                <Area
                  type="monotone"
                  dataKey="confidence_lower"
                  stackId="confidence"
                  stroke="none"
                  fill="rgba(255, 255, 255, 1)"
                  connectNulls={false}
                />
              )}
              
              {/* Actual data line */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={(props) => {
                  const { payload } = props;
                  if (showAnomalies && payload?.anomaly) {
                    return <circle {...props} fill="red" stroke="red" strokeWidth={2} r={4} />;
                  }
                  return <circle {...props} fill="hsl(var(--primary))" r={2} />;
                }}
                name="Actual"
              />
              
              {/* Predicted data line */}
              {showPredictions && (
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="rgba(139, 92, 246, 0.8)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Predicted"
                  connectNulls={false}
                />
              )}
              
              <Brush dataKey="timestamp" height={30} stroke="hsl(var(--primary))" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// REAL-TIME METRICS CHART
// =====================================================

export function RealTimeMetricsChart({ 
  data, 
  title, 
  description,
  realTimeUpdates = true,
  height = 300 
}: AdvancedChartProps) {
  const [isLive, setIsLive] = useState(realTimeUpdates);
  const [refreshInterval, setRefreshInterval] = useState(5);

  // Keep only last 50 data points for real-time view
  const realtimeData = useMemo(() => {
    return data.slice(-50);
  }, [data]);

  const getStatusColor = (value: number, threshold: number) => {
    if (value > threshold * 0.9) return 'text-red-500';
    if (value > threshold * 0.7) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {title}
              {isLive && (
                <Badge variant="outline" className="ml-2 animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  Live
                </Badge>
              )}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => [value.toFixed(2), 'Value']}
              />
              
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// ANOMALY DETECTION CHART
// =====================================================

export function AnomalyDetectionChart({ 
  data, 
  title, 
  description,
  height = 350 
}: AdvancedChartProps) {
  const [selectedAnomaly, setSelectedAnomaly] = useState<ChartDataPoint | null>(null);

  const anomalies = useMemo(() => {
    return data.filter(d => d.anomaly);
  }, [data]);

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.anomaly) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill="red"
          stroke="darkred"
          strokeWidth={2}
          className="cursor-pointer animate-pulse"
          onClick={() => setSelectedAnomaly(payload)}
        />
      );
    }
    return <circle cx={cx} cy={cy} r={2} fill="hsl(var(--primary))" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          
          <Badge variant="outline">
            {anomalies.length} Anomalies Detected
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{new Date(label).toLocaleDateString()}</p>
                        <p className="text-blue-600">Value: {payload[0].value?.toFixed(2)}</p>
                        {data.anomaly && (
                          <div className="mt-2">
                            <Badge variant="destructive">Anomaly Detected</Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              Unusual pattern detected in data
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={<CustomDot />}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {selectedAnomaly && (
          <div className="mt-4 p-3 border rounded-lg bg-red-50 dark:bg-red-950">
            <h4 className="font-medium text-red-800 dark:text-red-200">
              Anomaly Details
            </h4>
            <p className="text-sm text-red-600 dark:text-red-300">
              Date: {new Date(selectedAnomaly.timestamp).toLocaleDateString()}
            </p>
            <p className="text-sm text-red-600 dark:text-red-300">
              Value: {selectedAnomaly.value.toFixed(2)}
            </p>
            <p className="text-sm text-red-600 dark:text-red-300">
              This data point deviates significantly from expected patterns.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =====================================================
// TREND ANALYSIS CHART
// =====================================================

export function TrendAnalysisChart({ 
  data, 
  title, 
  description,
  height = 400 
}: AdvancedChartProps) {
  const [showTrendLine, setShowTrendLine] = useState(true);
  const [trendPeriod, setTrendPeriod] = useState('30');

  // Calculate trend line
  const trendData = useMemo(() => {
    if (!showTrendLine || data.length < 2) return data;

    // Simple linear regression for trend line
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    data.forEach((point, index) => {
      sumX += index;
      sumY += point.value;
      sumXY += index * point.value;
      sumXX += index * index;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map((point, index) => ({
      ...point,
      trend: slope * index + intercept
    }));
  }, [data, showTrendLine]);

  const trendDirection = useMemo(() => {
    if (data.length < 2) return 'stable';
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.value, 0) / secondHalf.length;
    
    const change = (secondAvg - firstAvg) / firstAvg;
    
    if (change > 0.05) return 'up';
    if (change < -0.05) return 'down';
    return 'stable';
  }, [data]);

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getTrendIcon()}
              {title}
              <Badge variant="outline" className="ml-2">
                Trend: {trendDirection}
              </Badge>
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="trend-line"
                checked={showTrendLine}
                onCheckedChange={setShowTrendLine}
              />
              <Label htmlFor="trend-line" className="text-sm">Trend Line</Label>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number, name: string) => [
                  value.toFixed(2), 
                  name === 'trend' ? 'Trend' : 'Actual'
                ]}
              />
              <Legend />
              
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Actual"
              />
              
              {showTrendLine && (
                <Line
                  type="monotone"
                  dataKey="trend"
                  stroke="rgba(255, 99, 132, 0.8)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Trend"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// CORRELATION SCATTER PLOT
// =====================================================

export function CorrelationScatterPlot({
  data,
  title,
  description,
  height = 400,
  xAxisLabel = 'X Axis',
  yAxisLabel = 'Y Axis'
}: AdvancedChartProps & { xAxisLabel?: string; yAxisLabel?: string }) {
  const [showCorrelationLine, setShowCorrelationLine] = useState(true);

  // Calculate correlation coefficient
  const correlation = useMemo(() => {
    if (data.length < 2) return 0;

    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + d.value, 0);
    const sumY = data.reduce((sum, d) => sum + (d.predicted || 0), 0);
    const sumXY = data.reduce((sum, d) => sum + d.value * (d.predicted || 0), 0);
    const sumXX = data.reduce((sum, d) => sum + d.value * d.value, 0);
    const sumYY = data.reduce((sum, d) => sum + (d.predicted || 0) * (d.predicted || 0), 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>

          <Badge variant="outline">
            Correlation: {correlation.toFixed(3)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="value"
                name={xAxisLabel}
                className="text-xs"
              />
              <YAxis
                dataKey="predicted"
                name={yAxisLabel}
                className="text-xs"
              />
              <Tooltip
                formatter={(value: number, name: string) => [value.toFixed(2), name]}
                labelFormatter={() => ''}
              />

              <Scatter
                dataKey="predicted"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
