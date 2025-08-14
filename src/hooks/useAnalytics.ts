import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface AnalyticsData {
  // Key metrics
  totalPackages: number;
  packagesDelivered: number;
  activeCustomers: number;
  totalRevenue: number;
  mailboxOccupancy: number;

  // Package analytics
  dailyPackageVolume: Array<{
    date: string;
    received: number;
    delivered: number;
  }>;
  carrierBreakdown: Array<{
    carrier: string;
    count: number;
    percentage: number;
  }>;
  averagePickupTime: number;
  peakHours: Array<{
    hour: number;
    count: number;
  }>;

  // Customer analytics
  newCustomers: Array<{
    date: string;
    count: number;
  }>;
  customerRetention: number;
  topCustomers: Array<{
    id: string;
    name: string;
    packageCount: number;
    revenue: number;
  }>;
  inactiveCustomers: Array<{
    id: string;
    name: string;
    lastActivity: string;
    daysSinceActivity: number;
  }>;

  // Compliance metrics
  cmraReportStatus: {
    completed: number;
    pending: number;
    overdue: number;
  };
  pendingVerifications: number;
  form1583Completion: number;
  upcomingDeadlines: Array<{
    customer: string;
    deadline: string;
    type: string;
  }>;

  // Financial overview
  monthlyRevenue: Array<{
    month: string;
    mailboxRevenue: number;
    packageFees: number;
    total: number;
  }>;
  outstandingBalances: number;
  revenueByService: Array<{
    service: string;
    revenue: number;
    percentage: number;
  }>;
}

export function useAnalytics(dateRange: DateRange) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user, dateRange]);

  const fetchAnalyticsData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const fromDate = dateRange.from.toISOString().split('T')[0];
      const toDate = dateRange.to.toISOString().split('T')[0];

      // Fetch packages data
      const { data: packages } = await supabase
        .from('packages')
        .select('*')
        .gte('received_at', fromDate)
        .lte('received_at', toDate);

      // Fetch customers data
      const { data: customers } = await supabase
        .from('customers')
        .select('*');

      // Fetch mailboxes data
      const { data: mailboxes } = await supabase
        .from('mailboxes')
        .select('*');

      // Fetch compliance data
      const { data: compliance } = await supabase
        .from('customer_compliance')
        .select('*');

      // Calculate analytics
      const analyticsData = calculateAnalytics(
        packages || [],
        customers || [],
        mailboxes || [],
        compliance || [],
        dateRange
      );

      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (
    packages: unknown[],
    customers: unknown[],
    mailboxes: unknown[],
    compliance: unknown[],
    dateRange: DateRange
  ): AnalyticsData => {
    // Key metrics
    const totalPackages = packages.length;
    const packagesDelivered = packages.filter(p => p.status === 'Delivered').length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const occupiedMailboxes = mailboxes.filter(m => m.status === 'occupied').length;
    const mailboxOccupancy = mailboxes.length > 0 ? (occupiedMailboxes / mailboxes.length) * 100 : 0;

    // Calculate revenue (placeholder calculations)
    const mailboxRevenue = occupiedMailboxes * 35; // Average monthly rate
    const packageFees = totalPackages * 2.5; // $2.50 per package handling
    const totalRevenue = mailboxRevenue + packageFees;

    // Daily package volume
    const dailyVolume = calculateDailyVolume(packages, dateRange);

    // Carrier breakdown
    const carrierBreakdown = calculateCarrierBreakdown(packages);

    // Peak hours analysis
    const peakHours = calculatePeakHours(packages);

    // Customer analytics
    const newCustomers = calculateNewCustomers(customers, dateRange);
    const topCustomers = calculateTopCustomers(customers, packages);
    const inactiveCustomers = calculateInactiveCustomers(customers, packages);

    // Compliance metrics
    const cmraReportStatus = {
      completed: compliance.filter(c => c.ps_form_1583_status === 'completed').length,
      pending: compliance.filter(c => c.ps_form_1583_status === 'pending').length,
      overdue: compliance.filter(c => c.compliance_score < 50).length
    };

    const form1583Completion = compliance.length > 0 
      ? (cmraReportStatus.completed / compliance.length) * 100 
      : 0;

    // Financial overview
    const monthlyRevenue = calculateMonthlyRevenue(dateRange);
    const revenueByService = [
      { service: 'Mailbox Rental', revenue: mailboxRevenue, percentage: (mailboxRevenue / totalRevenue) * 100 },
      { service: 'Package Handling', revenue: packageFees, percentage: (packageFees / totalRevenue) * 100 }
    ];

    return {
      totalPackages,
      packagesDelivered,
      activeCustomers,
      totalRevenue,
      mailboxOccupancy,
      dailyPackageVolume: dailyVolume,
      carrierBreakdown,
      averagePickupTime: 2.5, // Placeholder: 2.5 days
      peakHours,
      newCustomers,
      customerRetention: 95.5, // Placeholder
      topCustomers,
      inactiveCustomers,
      cmraReportStatus,
      pendingVerifications: compliance.filter(c => c.id_verification_status === 'pending').length,
      form1583Completion,
      upcomingDeadlines: [], // Placeholder
      monthlyRevenue,
      outstandingBalances: 1250.00, // Placeholder
      revenueByService
    };
  };

  const calculateDailyVolume = (packages: unknown[], dateRange: DateRange) => {
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    const volume = [];

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(dateRange.from);
      currentDate.setDate(currentDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];

      const dayPackages = packages.filter(p => 
        p.received_at.startsWith(dateString)
      );

      volume.push({
        date: dateString,
        received: dayPackages.length,
        delivered: dayPackages.filter(p => p.status === 'Delivered').length
      });
    }

    return volume;
  };

  const calculateCarrierBreakdown = (packages: unknown[]) => {
    const carriers = packages.reduce((acc, pkg) => {
      const carrier = pkg.carrier || 'Unknown';
      acc[carrier] = (acc[carrier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = packages.length;
    return Object.entries(carriers).map(([carrier, count]) => ({
      carrier,
      count: Number(count),
      percentage: total > 0 ? (Number(count) / total) * 100 : 0
    }));
  };

  const calculatePeakHours = (packages: unknown[]) => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
    
    packages.forEach(pkg => {
      const hour = new Date(pkg.received_at).getHours();
      hours[hour].count++;
    });

    return hours;
  };

  const calculateNewCustomers = (customers: unknown[], dateRange: DateRange) => {
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    const newCustomers = [];

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(dateRange.from);
      currentDate.setDate(currentDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];

      const dayCustomers = customers.filter(c => 
        c.created_at.startsWith(dateString)
      );

      newCustomers.push({
        date: dateString,
        count: dayCustomers.length
      });
    }

    return newCustomers;
  };

  const calculateTopCustomers = (customers: unknown[], packages: unknown[]) => {
    return customers
      .map(customer => {
        const customerPackages = packages.filter(p => p.customer_id === customer.id);
        const packageCount = customerPackages.length;
        return {
          id: customer.id,
          name: `${customer.first_name} ${customer.last_name}`,
          packageCount,
          revenue: packageCount * 2.5 + 35 // Package fees + mailbox rental
        };
      })
      .sort((a, b) => b.packageCount - a.packageCount)
      .slice(0, 10);
  };

  const calculateInactiveCustomers = (customers: unknown[], packages: unknown[]) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return customers
      .map(customer => {
        const lastPackage = packages
          .filter(p => p.customer_id === customer.id)
          .sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime())[0];

        const lastActivity = lastPackage ? lastPackage.received_at : customer.created_at;
        const daysSinceActivity = Math.floor(
          (new Date().getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          id: customer.id,
          name: `${customer.first_name} ${customer.last_name}`,
          lastActivity,
          daysSinceActivity
        };
      })
      .filter(customer => customer.daysSinceActivity > 30)
      .sort((a, b) => b.daysSinceActivity - a.daysSinceActivity);
  };

  const calculateMonthlyRevenue = (dateRange: DateRange) => {
    // Placeholder monthly revenue calculation
    const months = [];
    const current = new Date(dateRange.from);
    
    while (current <= dateRange.to) {
      const monthStr = current.toISOString().substr(0, 7);
      months.push({
        month: monthStr,
        mailboxRevenue: 3500 + Math.random() * 1000,
        packageFees: 500 + Math.random() * 300,
        total: 4000 + Math.random() * 1300
      });
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    const csvContent = convertToCSV(data);
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  const convertToCSV = (data: Record<string, unknown>[]) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return {
    data,
    loading,
    error,
    refetch: fetchAnalyticsData,
    exportToCSV
  };
}