import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { FileDown, TrendingUp, Mail, DollarSign, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';
import { subDays, format } from 'date-fns';

interface VirtualMailAnalytics {
  totalMailPieces: number;
  totalActions: number;
  totalRevenue: number;
  averageProcessingTime: number;
  topActionTypes: Array<{ action_type: string; count: number; revenue: number }>;
  dailyVolume: Array<{ date: string; pieces: number; actions: number; revenue: number }>;
  customerSegmentation: Array<{ tier: string; customers: number; revenue: number; avgActions: number }>;
}

export function VirtualMailAnalytics() {
  const [analytics, setAnalytics] = useState<VirtualMailAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [reportType, setReportType] = useState('summary');
  const [customerFilter, setCustomerFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchAnalytics();
    }
  }, [dateRange]);

  const fetchAnalytics = async () => {
    if (!dateRange?.from || !dateRange?.to) return;

    setLoading(true);
    try {
      // Fetch mail pieces data
      const { data: mailPieces, error: mpError } = await supabase
        .from('mail_pieces')
        .select(`
          id,
          created_at,
          virtual_mailbox_id,
          virtual_mailboxes!inner(
            customer_id,
            service_tier
          )
        `)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());

      if (mpError) throw mpError;

      // Fetch mail actions data
      const { data: actions, error: actionsError } = await supabase
        .from('mail_actions')
        .select(`
          id,
          action_type,
          cost_amount,
          created_at,
          mail_piece_id,
          mail_pieces!inner(
            virtual_mailbox_id,
            virtual_mailboxes!inner(
              customer_id,
              service_tier
            )
          )
        `)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());

      if (actionsError) throw actionsError;

      // Process analytics data
      const totalMailPieces = mailPieces?.length || 0;
      const totalActions = actions?.length || 0;
      const totalRevenue = actions?.reduce((sum, action) => sum + (Number(action.cost_amount) || 0), 0) || 0;
      const averageProcessingTime = 15; // Default processing time in minutes

      // Group actions by type
      const actionsByType = actions?.reduce((acc, action) => {
        const type = action.action_type;
        if (!acc[type]) {
          acc[type] = { count: 0, revenue: 0 };
        }
        acc[type].count++;
        acc[type].revenue += Number(action.cost_amount) || 0;
        return acc;
      }, {} as Record<string, { count: number; revenue: number }>) || {};

      const topActionTypes = Object.entries(actionsByType)
        .map(([action_type, data]) => ({ action_type, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Daily volume analysis
      const dailyData = {} as Record<string, { pieces: number; actions: number; revenue: number }>;
      
      mailPieces?.forEach(piece => {
        const date = format(new Date(piece.created_at), 'yyyy-MM-dd');
        if (!dailyData[date]) {
          dailyData[date] = { pieces: 0, actions: 0, revenue: 0 };
        }
        dailyData[date].pieces++;
      });

      actions?.forEach(action => {
        const date = format(new Date(action.created_at), 'yyyy-MM-dd');
        if (!dailyData[date]) {
          dailyData[date] = { pieces: 0, actions: 0, revenue: 0 };
        }
        dailyData[date].actions++;
        dailyData[date].revenue += Number(action.cost_amount) || 0;
      });

      const dailyVolume = Object.entries(dailyData)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Customer segmentation
      const tierData = {} as Record<string, { customers: Set<string>; revenue: number; actions: number }>;
      
      actions?.forEach(action => {
        const tier = action.mail_pieces?.virtual_mailboxes?.service_tier || 'basic';
        const customerId = action.mail_pieces?.virtual_mailboxes?.customer_id;
        
        if (!tierData[tier]) {
          tierData[tier] = { customers: new Set(), revenue: 0, actions: 0 };
        }
        
        if (customerId) {
          tierData[tier].customers.add(customerId);
        }
        tierData[tier].revenue += Number(action.cost_amount) || 0;
        tierData[tier].actions++;
      });

      const customerSegmentation = Object.entries(tierData)
        .map(([tier, data]) => ({
          tier,
          customers: data.customers.size,
          revenue: data.revenue,
          avgActions: data.customers.size > 0 ? data.actions / data.customers.size : 0
        }));

      setAnalytics({
        totalMailPieces,
        totalActions,
        totalRevenue,
        averageProcessingTime,
        topActionTypes,
        dailyVolume,
        customerSegmentation
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    if (!analytics || !dateRange?.from || !dateRange?.to) return;

    setExporting(true);
    try {
      const { error } = await supabase.functions.invoke('export-virtual-mail-report', {
        body: {
          reportType,
          dateRange: {
            from: dateRange.from.toISOString(),
            to: dateRange.to.toISOString()
          },
          customerFilter,
          analytics
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report exported successfully and sent to your email",
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Virtual Mail Analytics</CardTitle>
          <CardDescription>
            Comprehensive reporting for virtual mailbox services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="date-range">Date Range</Label>
              <div className="text-sm text-muted-foreground">
                {dateRange?.from && dateRange?.to 
                  ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                  : 'Select date range'
                }
              </div>
            </div>

            <div>
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Executive Summary</SelectItem>
                  <SelectItem value="detailed">Detailed Analytics</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                  <SelectItem value="operational">Operational Metrics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="customer-filter">Customer Filter</Label>
              <Select value={customerFilter} onValueChange={setCustomerFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="basic">Basic Tier</SelectItem>
                  <SelectItem value="premium">Premium Tier</SelectItem>
                  <SelectItem value="enterprise">Enterprise Tier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={exportReport} disabled={exporting} className="w-full">
                <FileDown className="h-4 w-4 mr-2" />
                {exporting ? "Exporting..." : "Export Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Mail Pieces</p>
                <p className="text-2xl font-bold">{analytics?.totalMailPieces || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Total Actions</p>
                <p className="text-2xl font-bold">{analytics?.totalActions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold">${(analytics?.totalRevenue || 0).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Avg Processing Time</p>
                <p className="text-2xl font-bold">{(analytics?.averageProcessingTime || 0).toFixed(1)}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Types Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Top Action Types</CardTitle>
          <CardDescription>Most common mail actions by volume and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics?.topActionTypes.map((action, index) => (
              <div key={action.action_type} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium capitalize">{action.action_type}</p>
                    <p className="text-sm text-muted-foreground">{action.count} actions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${action.revenue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    ${(action.revenue / action.count).toFixed(2)} avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Segmentation */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segmentation</CardTitle>
          <CardDescription>Revenue and usage by service tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics?.customerSegmentation.map((segment) => (
              <div key={segment.tier} className="p-4 border rounded-lg">
                <h3 className="font-semibold capitalize mb-2">{segment.tier} Tier</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Customers:</span>
                    <span className="font-medium">{segment.customers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-medium">${segment.revenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Actions:</span>
                    <span className="font-medium">{segment.avgActions.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue/Customer:</span>
                    <span className="font-medium">
                      ${segment.customers > 0 ? (segment.revenue / segment.customers).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}