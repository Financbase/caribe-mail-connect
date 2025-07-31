'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Download, Filter, RefreshCw, AlertCircle, Info, Users, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

// Sample retention data
const retentionData = [
  { day: 1, actual: 100, predicted: 100, churnRisk: 5 },
  { day: 2, actual: 85, predicted: 88, churnRisk: 8 },
  { day: 3, actual: 78, predicted: 80, churnRisk: 12 },
  { day: 4, actual: 72, predicted: 75, churnRisk: 15 },
  { day: 5, actual: 68, predicted: 72, churnRisk: 18 },
  { day: 6, actual: 65, predicted: 70, churnRisk: 20 },
  { day: 7, actual: 62, predicted: 68, churnRisk: 22 },
  { day: 14, actual: 58, predicted: 65, churnRisk: 25 },
  { day: 21, actual: 55, predicted: 62, churnRisk: 28 },
  { day: 30, actual: 52, predicted: 60, churnRisk: 30 },
  { day: 45, actual: 48, predicted: 55, churnRisk: 35 },
  { day: 60, actual: 45, predicted: 50, churnRisk: 40 },
  { day: 90, actual: 40, predicted: 45, churnRisk: 45 },
  { day: 120, actual: 35, predicted: 40, churnRisk: 50 },
  { day: 150, actual: 30, predicted: 35, churnRisk: 55 },
  { day: 180, actual: 25, predicted: 30, churnRisk: 60 },
];

// User segments with retention predictions
const userSegments = [
  {
    id: 1,
    name: 'Power Users',
    size: '15%',
    day1Retention: 98,
    day7Retention: 92,
    day30Retention: 85,
    predicted180DayRetention: 75,
    churnRisk: 8,
    trend: 'up',
  },
  {
    id: 2,
    name: 'Regular Users',
    size: '45%',
    day1Retention: 90,
    day7Retention: 75,
    day30Retention: 60,
    predicted180DayRetention: 45,
    churnRisk: 25,
    trend: 'stable',
  },
  {
    id: 3,
    name: 'Casual Users',
    size: '25%',
    day1Retention: 80,
    day7Retention: 55,
    day30Retention: 35,
    predicted180DayRetention: 20,
    churnRisk: 65,
    trend: 'down',
  },
  {
    id: 4,
    name: 'At Risk',
    size: '15%',
    day1Retention: 65,
    day7Retention: 30,
    day30Retention: 15,
    predicted180DayRetention: 5,
    churnRisk: 85,
    trend: 'down',
  },
];

// Features influencing retention
const retentionDrivers = [
  { name: 'Feature A Usage', impact: 0.85, correlation: 0.78 },
  { name: 'Feature B Engagement', impact: 0.72, correlation: 0.65 },
  { name: 'Session Duration', impact: 0.68, correlation: 0.62 },
  { name: 'Login Frequency', impact: 0.65, correlation: 0.58 },
  { name: 'Notification Opens', impact: 0.58, correlation: 0.52 },
  { name: 'Social Interactions', impact: 0.45, correlation: 0.42 },
];

// Predicted churn risk
const churnRiskData = [
  { name: 'Very Low', value: 15, color: '#10B981' },
  { name: 'Low', value: 25, color: '#34D399' },
  { name: 'Medium', value: 30, color: '#FBBF24' },
  { name: 'High', value: 20, color: '#F59E0B' },
  { name: 'Very High', value: 10, color: '#EF4444' },
];

export default function RetentionPredictions() {
  const [timeframe, setTimeframe] = useState('30d');
  const [view, setView] = useState<'retention' | 'churn'>('retention');
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        day: number;
        actual: number;
        predicted: number;
        churnRisk: number;
      };
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-bold">Day {data.day}</p>
          <p>Retention: {data.actual}%</p>
          <p>Predicted: {data.predicted}%</p>
          <p>Churn Risk: {data.churnRisk}%</p>
        </div>
      );
    }
    return null;
  };

  const getFilteredData = () => {
    if (timeframe === '7d') return retentionData.filter(d => d.day <= 7);
    if (timeframe === '30d') return retentionData.filter(d => d.day <= 30);
    if (timeframe === '90d') return retentionData.filter(d => d.day <= 90);
    return retentionData;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend === 'down') {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <span className="h-4 w-4">-</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Retention Predictions</h2>
          <p className="text-sm text-muted-foreground">
            Forecast user retention and identify at-risk segments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="180d">180 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Predicted 180-Day Retention</CardDescription>
            <CardTitle className="text-3xl">42.5%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+3.2%</span> from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Churn Risk</CardDescription>
            <CardTitle className="text-3xl">28.5%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-red-500 font-medium">-1.8%</span> from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Predicted LTV</CardDescription>
            <CardTitle className="text-3xl">$245.75</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+12.5%</span> from last quarter
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs 
        value={view} 
        onValueChange={(value) => setView(value as 'retention' | 'churn')}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="retention">Retention Forecast</TabsTrigger>
          <TabsTrigger value="churn">Churn Prediction</TabsTrigger>
        </TabsList>
        
        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Retention Curve</CardTitle>
              <CardDescription>
                Actual vs. predicted user retention over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={getFilteredData()}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="day" 
                      tickFormatter={(value) => `Day ${value}`}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorActual)"
                      name="Actual Retention"
                    />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorPredicted)"
                      name="Predicted Retention"
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Segments</CardTitle>
                <CardDescription>Retention by user segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userSegments.map((segment) => (
                    <div key={segment.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{segment.name}</span>
                          <span className="text-xs text-muted-foreground">{segment.size} of users</span>
                        </div>
                        <div className="flex items-center">
                          {getTrendIcon(segment.trend)}
                          <span className={`ml-1 text-sm font-medium ${
                            segment.trend === 'up' ? 'text-green-600' : 
                            segment.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {segment.predicted180DayRetention}%
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-center">
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="font-medium">{segment.day1Retention}%</div>
                          <div className="text-muted-foreground">Day 1</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="font-medium">{segment.day7Retention}%</div>
                          <div className="text-muted-foreground">Day 7</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="font-medium">{segment.day30Retention}%</div>
                          <div className="text-muted-foreground">Day 30</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Churn Risk: {segment.churnRisk}%</span>
                        <span className="text-blue-600 cursor-pointer hover:underline">View details</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retention Drivers</CardTitle>
                <CardDescription>Key factors influencing user retention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {retentionDrivers.map((driver, index) => (
                    <div key={driver.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{driver.name}</span>
                        <span className="font-medium">
                          {(driver.impact * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={driver.impact * 100} 
                          className="h-2"
                          indicatorClassName={`${
                            index < 2 ? 'bg-green-500' : 
                            index < 4 ? 'bg-blue-500' : 
                            'bg-yellow-500'
                          }`}
                        />
                        <span className="text-xs text-muted-foreground w-12">
                          r={driver.correlation.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Retention Insights
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Focus on improving engagement with Feature A and B, as they have the highest impact on long-term retention.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="churn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Churn Risk Analysis</CardTitle>
              <CardDescription>
                Identify users at risk of churning and take proactive measures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getFilteredData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="day" 
                      tickFormatter={(value) => `Day ${value}`}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [`${value}%`, name === 'churnRisk' ? 'Churn Risk' : 'Retention']}
                      labelFormatter={(label) => `Month ${label}`}