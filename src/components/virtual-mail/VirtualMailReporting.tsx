import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as DatePicker } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, DollarSign, Package, Users, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ReportData {
  virtualMailboxes: unknown[];
  revenue: unknown[];
  actionBreakdown: unknown[];
  customerTiers: unknown[];
  monthlyTrends: unknown[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export function VirtualMailReporting() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [reportType, setReportType] = useState('summary');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch virtual mailbox statistics
      const { data: virtualMailboxes, error: vmError } = await supabase
        .from('virtual_mailboxes')
        .select(`
          id,
          service_tier,
          status,
          created_at,
          customers!inner(first_name, last_name, email)
        `);

      if (vmError) throw vmError;

      // Fetch revenue data
      const { data: billing, error: billingError } = await supabase
        .from('virtual_mailbox_billing')
        .select('*')
        .gte('billing_period_start', dateRange.start.toISOString().split('T')[0])
        .lte('billing_period_end', dateRange.end.toISOString().split('T')[0]);

      if (billingError) throw billingError;

      // Fetch action breakdown
      const { data: actions, error: actionsError } = await supabase
        .from('mail_actions')
        .select(`
          action_type,
          cost_amount,
          created_at,
          mail_pieces!inner(virtual_mailbox_id)
        `)
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString());

      if (actionsError) throw actionsError;

      // Process data for charts
      const actionBreakdown = processActionBreakdown(actions || []);
      const customerTiers = processCustomerTiers(virtualMailboxes || []);
      const revenue = processRevenueData(billing || []);
      const monthlyTrends = processMonthlyTrends(actions || [], billing || []);

      setReportData({
        virtualMailboxes: virtualMailboxes || [],
        revenue,
        actionBreakdown,
        customerTiers,
        monthlyTrends
      });

    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processActionBreakdown = (actions: unknown[]) => {
    const breakdown = actions.reduce((acc, action) => {
      const type = action.action_type || 'unknown';
      acc[type] = (acc[type] || 0) + (action.cost_amount || 0);
      return acc;
    }, {});

    return Object.entries(breakdown).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      count: actions.filter(a => a.action_type === name).length
    }));
  };

  const processCustomerTiers = (virtualMailboxes: unknown[]) => {
    const tiers = virtualMailboxes.reduce((acc, vm) => {
      const tier = vm.service_tier || 'basic';
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(tiers).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };

  const processRevenueData = (billing: unknown[]) => {
    return billing.map(bill => ({
      date: bill.billing_period_end,
      amount: bill.total_amount,
      status: bill.status
    }));
  };

  const processMonthlyTrends = (actions: unknown[], billing: unknown[]) => {
    const months: { [key: string]: { actions: number, revenue: number } } = {};
    
    // Process actions
    actions.forEach(action => {
      const month = new Date(action.created_at).toISOString().slice(0, 7);
      if (!months[month]) months[month] = { actions: 0, revenue: 0 };
      months[month].actions++;
    });

    // Process revenue
    billing.forEach(bill => {
      const month = bill.billing_period_end.slice(0, 7);
      if (!months[month]) months[month] = { actions: 0, revenue: 0 };
      months[month].revenue += bill.total_amount;
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      actions: data.actions,
      revenue: data.revenue
    })).sort((a, b) => a.month.localeCompare(b.month));
  };

  const exportReport = async () => {
    try {
      const { error } = await supabase.functions.invoke('export-virtual-mail-report', {
        body: { 
          reportData,
          dateRange,
          reportType 
        }
      });

      if (error) throw error;
      
      // Handle download...
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  const totalMailboxes = reportData?.virtualMailboxes.length || 0;
  const totalRevenue = reportData?.revenue.reduce((sum, r) => sum + r.amount, 0) || 0;
  const totalActions = reportData?.actionBreakdown.reduce((sum, a) => sum + a.count, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Virtual Mail Analytics</h2>
          <p className="text-muted-foreground">Comprehensive reporting and insights</p>
        </div>
        <div className="flex space-x-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Summary Report</SelectItem>
              <SelectItem value="revenue">Revenue Analysis</SelectItem>
              <SelectItem value="usage">Usage Analytics</SelectItem>
              <SelectItem value="customers">Customer Insights</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Virtual Mailboxes</p>
                <p className="text-2xl font-bold">{totalMailboxes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Actions</p>
                <p className="text-2xl font-bold">{totalActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Avg Revenue/Mailbox</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalMailboxes > 0 ? totalRevenue / totalMailboxes : 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Actions and revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData?.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="actions" fill="hsl(var(--primary))" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(var(--secondary))" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Action Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Action Breakdown</CardTitle>
            <CardDescription>Distribution of mail actions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData?.actionBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {reportData?.actionBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Tiers */}
        <Card>
          <CardHeader>
            <CardTitle>Service Tiers</CardTitle>
            <CardDescription>Customer distribution by tier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData?.customerTiers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Billing Activity</CardTitle>
            <CardDescription>Latest billing records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData?.revenue.slice(0, 5).map((bill, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{formatDate(bill.date)}</p>
                    <Badge variant={bill.status === 'paid' ? 'default' : 'secondary'}>
                      {bill.status}
                    </Badge>
                  </div>
                  <p className="font-bold">{formatCurrency(bill.amount)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}