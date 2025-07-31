'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, ReferenceLine } from 'recharts';
import { AlertCircle, Bell, Download, Filter, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Sample anomaly data
const anomalyData = [
  { date: '2023-01-01', value: 120, expected: 125, threshold: 150, isAnomaly: false },
  { date: '2023-01-02', value: 130, expected: 128, threshold: 155, isAnomaly: false },
  { date: '2023-01-03', value: 125, expected: 130, threshold: 160, isAnomaly: false },
  { date: '2023-01-04', value: 140, expected: 132, threshold: 165, isAnomaly: false },
  { date: '2023-01-05', value: 160, expected: 135, threshold: 170, isAnomaly: false },
  { date: '2023-01-06', value: 180, expected: 140, threshold: 175, isAnomaly: true },
  { date: '2023-01-07', value: 200, expected: 145, threshold: 180, isAnomaly: true },
  { date: '2023-01-08', value: 220, expected: 150, threshold: 185, isAnomaly: true },
  { date: '2023-01-09', value: 210, expected: 155, threshold: 190, isAnomaly: true },
  { date: '2023-01-10', value: 190, expected: 160, threshold: 195, isAnomaly: true },
  { date: '2023-01-11', value: 170, expected: 165, threshold: 200, isAnomaly: false },
  { date: '2023-01-12', value: 150, expected: 170, threshold: 205, isAnomaly: false },
];

const anomalyAlerts = [
  {
    id: 1,
    date: '2023-01-08 14:32:45',
    severity: 'high',
    type: 'Spike in User Activity',
    description: 'Unusual 45% increase in user activity detected',
    metric: 'Active Users',
    value: '1,245 (45% ↑)',
    expected: '860',
    status: 'new',
  },
  {
    id: 2,
    date: '2023-01-07 09:15:22',
    severity: 'medium',
    type: 'Decreased Conversion',
    description: 'Checkout conversion rate dropped by 18%',
    metric: 'Conversion Rate',
    value: '2.8% (18% ↓)',
    expected: '3.4%',
    status: 'in-progress',
  },
  {
    id: 3,
    date: '2023-01-06 16:45:10',
    severity: 'low',
    type: 'Page Load Time',
    description: 'Homepage load time increased by 2.3s',
    metric: 'Load Time',
    value: '4.2s (121% ↑)',
    expected: '1.9s',
    status: 'resolved',
  },
];

const anomalyTypes = [
  { name: 'Spike in User Activity', count: 12, change: '+25%' },
  { name: 'Unusual Login Attempts', count: 8, change: '-10%' },
  { name: 'Checkout Abandonment', count: 5, change: '+15%' },
  { name: 'Page Load Time', count: 3, change: '0%' },
  { name: 'API Error Rate', count: 2, change: '-5%' },
];

export default function AnomalyDetection() {
  const [showExpected, setShowExpected] = useState(true);
  const [showThreshold, setShowThreshold] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
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
        value: number;
        expected: number;
        threshold: number;
        isAnomaly: boolean;
      };
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-bold">{label}</p>
          <p>Value: <span className={data.isAnomaly ? 'text-red-500 font-medium' : ''}>{data.value}</span></p>
          <p>Expected: {data.expected}</p>
          <p>Threshold: {data.threshold}</p>
          {data.isAnomaly && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
              <AlertCircle className="inline h-4 w-4 mr-1" />
              Anomaly detected
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Anomaly Detection</h2>
          <p className="text-sm text-muted-foreground">Identify unusual patterns and potential issues in your data</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Switch id="show-expected" checked={showExpected} onCheckedChange={setShowExpected} />
              <Label htmlFor="show-expected" className="text-sm">Expected</Label>
            </div>
            <div className="flex items-center space-x-1">
              <Switch id="show-threshold" checked={showThreshold} onCheckedChange={setShowThreshold} />
              <Label htmlFor="show-threshold" className="text-sm">Threshold</Label>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Anomalies</CardDescription>
            <CardTitle className="text-3xl">24</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-red-500 font-medium">+5</span> from last week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>High Severity</CardDescription>
            <CardTitle className="text-3xl">8</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-red-500 font-medium">+3</span> from last week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Resolution Time</CardDescription>
            <CardTitle className="text-3xl">4h 23m</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">-12%</span> from last week
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anomaly Overview</CardTitle>
          <CardDescription>Track and analyze unusual patterns in your metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anomalyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                  name="Actual" 
                />
                {showExpected && (
                  <Line 
                    type="monotone" 
                    dataKey="expected" 
                    stroke="#82ca9d" 
                    strokeWidth={1.5} 
                    strokeDasharray="5 5" 
                    name="Expected" 
                  />
                )}
                {showThreshold && (
                  <Line 
                    type="monotone" 
                    dataKey="threshold" 
                    stroke="#ff7300" 
                    strokeWidth={1.5} 
                    strokeDasharray="3 3" 
                    name="Threshold" 
                  />
                )}
                {anomalyData
                  .filter(d => d.isAnomaly)
                  .map((entry, index) => (
                    <ReferenceLine 
                      key={`anomaly-${index}`}
                      x={entry.date}
                      stroke="#ff4d4f"
                      strokeDasharray="3 3"
                      strokeWidth={1.5}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest detected anomalies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anomalyAlerts.map((alert) => (
                <Alert key={alert.id} className="border-l-4 border-l-red-500">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <AlertTitle className="flex items-center gap-2">
                          {getSeverityBadge(alert.severity)}
                          {alert.type}
                        </AlertTitle>
                        <div className="text-xs text-muted-foreground">
                          {alert.date}
                        </div>
                      </div>
                      <AlertDescription className="mt-2">
                        <p>{alert.description}</p>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <div className="font-medium">Metric</div>
                            <div>{alert.metric}</div>
                          </div>
                          <div>
                            <div className="font-medium">Value</div>
                            <div className={alert.severity === 'high' ? 'text-red-500 font-medium' : ''}>
                              {alert.value}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Expected</div>
                            <div>{alert.expected}</div>
                          </div>
                        </div>
                      </AlertDescription>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(alert.status)}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Anomaly Types</CardTitle>
                <CardDescription>Distribution by anomaly category</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid />
                    <XAxis type="number" dataKey="count" name="Count" />
                    <YAxis dataKey="name" type="category" />
                    <ZAxis type="number" range={[100, 400]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Anomalies" data={anomalyTypes} fill="#8884d8">
                      {anomalyTypes.map((entry, index) => (
                        <text
                          key={`anomaly-${index}`}
                          x={entry.count * 20}
                          y={index * 20 + 10}
                          textAnchor="middle"
                          fill="#000"
                          fontSize={12}
                        >
                          {entry.count}
                        </text>
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2">
                {anomalyTypes.map((type) => (
                  <div key={type.name} className="flex items-center justify-between">
                    <div className="text-sm font-medium">{type.name}</div>
                    <div className="flex items-center space-x-4">
                      <div className="w-20">
                        <div className="relative pt-1">
                          <div className="flex h-2 overflow-hidden text-xs bg-gray-200 rounded">
                            <div 
                              style={{ width: `${(type.count / 12) * 100}%` }}
                              className="flex flex-col justify-center text-center text-white bg-blue-500 shadow-none whitespace-nowrap"
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 text-right text-sm text-muted-foreground">
                        {type.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anomaly Detection Settings</CardTitle>
          <CardDescription>Configure how anomalies are detected and alerted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive email alerts for new anomalies</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Slack Integration</h4>
                <p className="text-sm text-muted-foreground">Send alerts to your Slack channel</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">SMS Alerts</h4>
                <p className="text-sm text-muted-foreground">Get critical alerts via SMS</p>
              </div>
              <Switch />
            </div>
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Alert Thresholds</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>High Severity</span>
                    <span>3.0σ+</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Medium Severity</span>
                    <span>2.0σ - 3.0σ</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Low Severity</span>
                    <span>1.5σ - 2.0σ</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '33%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
