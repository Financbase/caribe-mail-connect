import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface AnalyticsData {
  totalPackages: number;
  totalRevenue: number;
  totalCustomers: number;
  avgProcessingTime: number;
  packagesByCarrier: { carrier: string; count: number; percentage: number }[];
  volumeByDay: { date: string; packages: number; revenue: number }[];
  peakHours: { hour: number; packages: number }[];
  revenueByService: { service: string; revenue: number }[];
}

export function useAnalytics(dateRange: DateRange) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = useCallback(async () => {
    if (!dateRange.from || !dateRange.to) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch packages data
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select(`
          id,
          tracking_number,
          carrier,
          status,
          arrival_date,
          notification_sent_at,
          created_at,
          customers (id, name, email)
        `)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());

      if (packagesError) throw packagesError;

      // Process the data
      const totalPackages = packagesData?.length || 0;
      
      // Calculate revenue (mock calculation for now)
      const totalRevenue = totalPackages * 5.50; // Average $5.50 per package

      // Get unique customers
      const uniqueCustomers = new Set(packagesData?.map(p => p.customers?.id).filter(Boolean)).size;

      // Calculate average processing time (mock for now)
      const avgProcessingTime = 24; // 24 hours average

      // Group by carrier
      const carrierCounts: Record<string, number> = {};
      packagesData?.forEach(pkg => {
        const carrier = pkg.carrier || 'Unknown';
        carrierCounts[carrier] = (carrierCounts[carrier] || 0) + 1;
      });

      const packagesByCarrier = Object.entries(carrierCounts).map(([carrier, count]) => ({
        carrier,
        count,
        percentage: totalPackages > 0 ? (count / totalPackages) * 100 : 0
      }));

      // Group by day
      const dayGroups: Record<string, { packages: number; revenue: number }> = {};
      packagesData?.forEach(pkg => {
        const date = new Date(pkg.created_at).toISOString().split('T')[0];
        if (!dayGroups[date]) {
          dayGroups[date] = { packages: 0, revenue: 0 };
        }
        dayGroups[date].packages += 1;
        dayGroups[date].revenue += 5.50; // Mock revenue per package
      });

      const volumeByDay = Object.entries(dayGroups).map(([date, data]) => ({
        date,
        packages: data.packages,
        revenue: data.revenue
      }));

      // Calculate peak hours (mock data)
      const peakHours = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        packages: Math.floor(Math.random() * 20) + 1
      }));

      // Revenue by service (mock data)
      const revenueByService = [
        { service: 'Standard Delivery', revenue: totalRevenue * 0.6 },
        { service: 'Express Delivery', revenue: totalRevenue * 0.3 },
        { service: 'VIP Service', revenue: totalRevenue * 0.1 }
      ];

      setData({
        totalPackages,
        totalRevenue,
        totalCustomers: uniqueCustomers,
        avgProcessingTime,
        packagesByCarrier,
        volumeByDay,
        peakHours,
        revenueByService
      });

    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const exportToCSV = useCallback(() => {
    if (!data) return;

    // Create CSV content
    const csvContent = [
      'Metric,Value',
      `Total Packages,${data.totalPackages}`,
      `Total Revenue,$${data.totalRevenue.toFixed(2)}`,
      `Total Customers,${data.totalCustomers}`,
      `Avg Processing Time,${data.avgProcessingTime} hours`,
      '',
      'Daily Volume',
      'Date,Packages,Revenue',
      ...data.volumeByDay.map(day => `${day.date},${day.packages},$${day.revenue.toFixed(2)}`),
      '',
      'Carrier Breakdown',
      'Carrier,Packages,Percentage',
      ...data.packagesByCarrier.map(carrier => `${carrier.carrier},${carrier.count},${carrier.percentage.toFixed(1)}%`)
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${dateRange.from.toISOString().split('T')[0]}-${dateRange.to.toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [data, dateRange]);

  return {
    data,
    loading,
    error,
    exportToCSV,
    refresh: fetchAnalyticsData
  };
}