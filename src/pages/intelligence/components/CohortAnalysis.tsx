'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { Download, Filter, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample cohort data
const cohortData = [
  {
    cohort: 'Jan 2023',
    size: 1200,
    retention: [100, 85, 72, 65, 60, 55, 50, 48, 45, 42, 40, 38],
    revenue: [12000, 10200, 9500, 8900, 8400, 8000, 7600, 7300, 7000, 6800, 6600, 6400],
  },
  {
    cohort: 'Feb 2023',
    size: 1450,
    retention: [100, 88, 78, 70, 65, 60, 56, 53, 50, 47, 44, 42],
    revenue: [14500, 12760, 11610, 10730, 10150, 9570, 9100, 8700, 8300, 7900, 7500, 7200],
  },
  {
    cohort: 'Mar 2023',
    size: 1600,
    retention: [100, 90, 82, 76, 72, 68, 65, 62, 59, 56, 53, 50],
    revenue: [16000, 14400, 13312, 12544, 11904, 11392, 10960, 10560, 10176, 9856, 9540, 9200],
  },
  {
    cohort: 'Apr 2023',
    size: 1800,
    retention: [100, 92, 86, 82, 78, 75, 72, 69, 66, 63, 60, 57],
    revenue: [18000, 16560, 15552, 14760, 14040, 13500, 12960, 12420, 11880, 11340, 10800, 10260],
  },
  {
    cohort: 'May 2023',
    size: 2000,
    retention: [100, 94, 89, 86, 83, 80, 77, 74, 71, 68, 65, 62],
    revenue: [20000, 18800, 17860, 17200, 16600, 16000, 15400, 14800, 14200, 13600, 13000, 12400],
  },
  {
    cohort: 'Jun 2023',
    size: 2200,
    retention: [100, 95, 92, 89, 87, 84, 81, 78, 75, 72, 69, 66],
    revenue: [22000, 20900, 20240, 19580, 19140, 18480, 17820, 17160, 16500, 15840, 15180, 14520],
  },
];

const months = [
  'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6',
  'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'
];

// Format data for retention heatmap
const getHeatmapData = (metric: 'retention' | 'revenue') => {
  return cohortData.map(cohort => ({
    cohort: cohort.cohort,
    ...months.reduce((acc, month, index) => ({
      ...acc,
      [month]: metric === 'retention' 
        ? cohort.retention[index] 
        : `$${cohort.revenue[index].toLocaleString()}`,
      [`${month}Value`]: metric === 'retention' 
        ? cohort.retention[index] 
        : cohort.revenue[index],
      [`${month}Raw`]: metric === 'retention' 
        ? `${cohort.retention[index]}%` 
        : `$${cohort.revenue[index].toLocaleString()}`,
    }), {})
  }));
};

// Format data for line chart
const getLineData = (metric: 'retention' | 'revenue') => {
  return cohortData.map(cohort => ({
    name: cohort.cohort,
    ...months.reduce((acc, month, index) => ({
      ...acc,
      [month]: metric === 'retention' 
        ? cohort.retention[index] 
        : cohort.revenue[index],
    }), {})
  }));
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

interface CohortRow {
  [key: string]: number;
}

export default function CohortAnalysis() {
  const [view, setView] = useState<'retention' | 'revenue'>('retention');
  const [timeframe, setTimeframe] = useState('6m');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const heatmapData = getHeatmapData(view);
  const lineData = getLineData(view);
  const displayMonths = months.slice(0, timeframe === '3m' ? 3 : timeframe === '6m' ? 6 : 12);

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {view === 'retention' ? `${entry.value}%` : `$${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getColorForValue = (value: number) => {
    if (view === 'retention') {
      if (value >= 80) return 'bg-green-100 text-green-800';
      if (value >= 60) return 'bg-blue-100 text-blue-800';
      if (value >= 40) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    } else {
      // For revenue, we'll use a different scale
      const maxRevenue = Math.max(...cohortData.flatMap(c => c.revenue));
      const ratio = value / maxRevenue;
      if (ratio > 0.8) return 'bg-green-100 text-green-800';
      if (ratio > 0.5) return 'bg-blue-100 text-blue-800';
      if (ratio > 0.3) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    }
  };

  const getCellValue = (row: CohortRow, month: string) => {
    return view === 'retention' 
      ? `${row[month]}%` 
      : `$${Number(row[month]).toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Cohort Analysis</h2>
          <p className="text-sm text-muted-foreground">Track how groups of users behave over time</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="12m">12 Months</SelectItem>
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
            <CardDescription>Average Retention (30d)</CardDescription>
            <CardTitle className="text-3xl">74.5%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+8.2%</span> from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Best Performing Cohort</CardDescription>
            <CardTitle className="text-3xl">Jun 2023</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              95% retention after 30 days
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Cohorts Analyzed</CardDescription>
            <CardTitle className="text-3xl">{cohortData.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+2</span> from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs 
        value={view} 
        onValueChange={(value) => setView(value as 'retention' | 'revenue')}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="retention">Retention Rate</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        <TabsContent value={view} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {view === 'retention' ? 'User Retention Over Time' : 'Revenue by Cohort'}
              </CardTitle>
              <CardDescription>
                {view === 'retention' 
                  ? 'Percentage of users from each cohort who are still active' 
                  : 'Total revenue generated by each cohort over time'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={lineData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={value => view === 'retention' ? `${value}%` : `$${value / 1000}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => 
                        view === 'retention' 
                          ? [`${value}%`, 'Retention'] 
                          : [`$${value.toLocaleString()}`, 'Revenue']
                      }
                    />
                    <Legend />
                    {cohortData.map((cohort, index) => (
                      <Line
                        key={cohort.cohort}
                        type="monotone"
                        dataKey={cohort.cohort}
                        data={lineData}
                        name={cohort.cohort}
                        stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
                        strokeWidth={selectedCohort === cohort.cohort ? 3 : 1.5}
                        activeDot={{ r: 6 }}
                        onClick={() => setSelectedCohort(
                          selectedCohort === cohort.cohort ? null : cohort.cohort
                        )}
                        style={{
                          cursor: 'pointer',
                          opacity: !selectedCohort || selectedCohort === cohort.cohort ? 1 : 0.3
                        }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Cohort Heatmap</CardTitle>
          <CardDescription>
            {view === 'retention' 
              ? 'User retention rates by cohort and time period' 
              : 'Revenue generated by cohort and time period'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cohort
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  {displayMonths.map((month, index) => (
                    <th key={month} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {heatmapData.map((row) => (
                  <tr key={row.cohort} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.cohort}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {row.size.toLocaleString()}
                    </td>
                    {displayMonths.map((month) => {
                      const value = row[`${month}Value` as keyof typeof row] as number;
                      const rawValue = row[`${month}Raw` as keyof typeof row];
                      return (
                        <td 
                          key={`${row.cohort}-${month}`}
                          className={`px-4 py-3 whitespace-nowrap text-sm text-center ${getColorForValue(value)}`}
                          title={`${row.cohort} - ${month}: ${rawValue}`}
                        >
                          {view === 'retention' ? `${value}%` : `$${(value / 1000).toFixed(1)}k`}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cohort Insights</CardTitle>
            <CardDescription>Key findings from cohort analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">Improving Retention</h4>
                <p className="text-sm text-blue-700 mt-1">
                  The most recent cohorts show a 15% higher 30-day retention rate compared to the start of the year.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Revenue Growth</h4>
                <p className="text-sm text-green-700 mt-1">
                  June 2023 cohort has generated 22% more revenue in the first month compared to the January 2023 cohort.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Actions to improve cohort performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800">Onboarding Optimization</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Improve the first-week experience to match the success of the June 2023 cohort.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800">Engagement Campaigns</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Target users at the 60-day mark when engagement typically drops by 15%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
