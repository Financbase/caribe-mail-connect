'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, RefreshCw, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const featureImportance = [
  { name: 'Price Sensitivity', value: 0.28 },
  { name: 'Product Category', value: 0.22 },
  { name: 'Purchase Frequency', value: 0.18 },
  { name: 'Customer Lifetime', value: 0.15 },
  { name: 'Region', value: 0.09 },
  { name: 'Other', value: 0.08 },
];

const modelPerformance = {
  accuracy: 0.894,
  precision: 0.876,
  recall: 0.912,
  f1: 0.893,
  rocAuc: 0.932,
};

const customerSegments = [
  { name: 'Loyal Customers', value: 28, fill: '#0088FE' },
  { name: 'At Risk', value: 15, fill: '#FF8042' },
  { name: 'New Customers', value: 22, fill: '#00C49F' },
  { name: 'Dormant', value: 25, fill: '#FFBB28' },
  { name: 'High Value', value: 10, fill: '#8884d8' },
];

const sentimentData = [
  { name: 'Jan', positive: 65, negative: 15, neutral: 20 },
  { name: 'Feb', positive: 70, negative: 10, neutral: 20 },
  { name: 'Mar', positive: 68, negative: 12, neutral: 20 },
  { name: 'Apr', positive: 72, negative: 8, neutral: 20 },
  { name: 'May', positive: 75, negative: 5, neutral: 20 },
];

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

export default function MachineLearningInsights() {
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: CustomLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="#333" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Machine Learning Insights</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
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
            <CardDescription>Model Accuracy</CardDescription>
            <CardTitle className="text-3xl">{(modelPerformance.accuracy * 100).toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <div className="flex justify-between mb-1">
                <span>Precision</span>
                <span>{(modelPerformance.precision * 100).toFixed(1)}%</span>
              </div>
              <Progress value={modelPerformance.precision * 100} className="h-1" />
              <div className="flex justify-between mt-3 mb-1">
                <span>Recall</span>
                <span>{(modelPerformance.recall * 100).toFixed(1)}%</span>
              </div>
              <Progress value={modelPerformance.recall * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Model Performance</CardDescription>
            <CardTitle className="text-3xl">Excellent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground space-y-2">
              <div>
                <div className="flex justify-between">
                  <span>F1 Score</span>
                  <span>{modelPerformance.f1.toFixed(3)}</span>
                </div>
                <Progress value={modelPerformance.f1 * 100} className="h-1" />
              </div>
              <div>
                <div className="flex justify-between">
                  <span>ROC AUC</span>
                  <span>{modelPerformance.rocAuc.toFixed(3)}</span>
                </div>
                <Progress value={modelPerformance.rocAuc * 100} className="h-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Data Quality</CardDescription>
            <CardTitle className="text-3xl">92.5%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>Complete: 92.5%</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span>Needs Review: 5.2%</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                <span>Missing: 2.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Feature Importance</CardTitle>
            <CardDescription>Key factors influencing predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[...featureImportance].sort((a, b) => b.value - a.value)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 0.3]} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip formatter={(value) => [(value as number * 100).toFixed(1) + '%', 'Importance']} />
                  <Bar dataKey="value" fill="#8884d8" name="Importance">
                    {featureImportance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Distribution of customer groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {customerSegments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
          <CardDescription>Customer feedback sentiment over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sentimentData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="positive" stroke="#4CAF50" strokeWidth={2} name="Positive %" />
                <Line type="monotone" dataKey="negative" stroke="#F44336" strokeWidth={2} name="Negative %" />
                <Line type="monotone" dataKey="neutral" stroke="#9E9E9E" strokeWidth={2} name="Neutral %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Key Insights</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <TrendingUp className="h-4 w-4 mr-1" />
                Positive Trend
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">High-Value Segment Growth</h4>
                    <p className="mt-1 text-sm text-gray-600">The high-value customer segment has grown by 15% this quarter, contributing to 42% of total revenue.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100 text-yellow-600">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">At-Risk Customers</h4>
                    <p className="mt-1 text-sm text-gray-600">12% of customers show signs of churn risk. Proactive engagement recommended.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recommendations</CardTitle>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Action Items
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Upsell Opportunity</h4>
                    <p className="mt-1 text-sm text-gray-600">23% of customers in the mid-tier segment are ready for premium offerings.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Customer Experience</h4>
                    <p className="mt-1 text-sm text-gray-600">Improvement opportunities identified in the checkout process with 18% drop-off rate.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
