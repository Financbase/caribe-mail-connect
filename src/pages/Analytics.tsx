import { useState } from 'react';
import { ArrowLeft, Download, TrendingUp, Package, Users, DollarSign, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnalytics, type DateRange } from '@/hooks/useAnalytics';
import { toast } from '@/hooks/use-toast';

// Analytics components
import { MetricCard } from '@/components/analytics/MetricCard';
import { DateRangeSelector } from '@/components/analytics/DateRangeSelector';
import { PackageVolumeChart } from '@/components/analytics/PackageVolumeChart';
import { CarrierBreakdownChart } from '@/components/analytics/CarrierBreakdownChart';
import { PeakHoursHeatmap } from '@/components/analytics/PeakHoursHeatmap';
import { RevenueChart } from '@/components/analytics/RevenueChart';

interface AnalyticsProps {
  onNavigate: (page: string) => void;
}

export default function Analytics({ onNavigate }: AnalyticsProps) {
  const { t } = useLanguage();
  
  // Default to last 30 days
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);
    return { from, to };
  });

  const { data, loading, error, exportToCSV } = useAnalytics(dateRange);

  const handleExportPackages = () => {
    if (!data?.dailyPackageVolume) return;
    
    exportToCSV(data.dailyPackageVolume, 'package-volume-report');
    toast({
      title: t('Export Complete'),
      description: t('Package volume data has been exported to CSV'),
    });
  };

  const handleExportCustomers = () => {
    if (!data?.topCustomers) return;
    
    exportToCSV(data.topCustomers, 'top-customers-report');
    toast({
      title: t('Export Complete'),
      description: t('Customer data has been exported to CSV'),
    });
  };

  const handleExportRevenue = () => {
    if (!data?.monthlyRevenue) return;
    
    exportToCSV(data.monthlyRevenue, 'revenue-report');
    toast({
      title: t('Export Complete'),
      description: t('Revenue data has been exported to CSV'),
    });
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{t('Loading analytics...')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              {t('Retry')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">{t('Analytics Dashboard')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <DateRangeSelector 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Key Metrics */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title={t('Total Packages')}
              value={data.totalPackages}
              icon={Package}
            />
            <MetricCard
              title={t('Active Customers')}
              value={data.activeCustomers}
              icon={Users}
            />
            <MetricCard
              title={t('Total Revenue')}
              value={data.totalRevenue}
              format="currency"
              icon={DollarSign}
            />
            <MetricCard
              title={t('Mailbox Occupancy')}
              value={data.mailboxOccupancy}
              format="percentage"
              icon={Mail}
            />
          </div>
        )}

        {/* Analytics Tabs */}
        <Tabs defaultValue="packages" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="packages">{t('Packages')}</TabsTrigger>
            <TabsTrigger value="customers">{t('Customers')}</TabsTrigger>
            <TabsTrigger value="compliance">{t('Compliance')}</TabsTrigger>
            <TabsTrigger value="financial">{t('Financial')}</TabsTrigger>
          </TabsList>

          {/* Package Analytics */}
          <TabsContent value="packages" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{t('Package Analytics')}</h2>
              <Button onClick={handleExportPackages} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('Export CSV')}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data && (
                <>
                  <div className="lg:col-span-2">
                    <PackageVolumeChart data={data.dailyPackageVolume} />
                  </div>
                  <CarrierBreakdownChart data={data.carrierBreakdown} />
                  <PeakHoursHeatmap data={data.peakHours} />
                </>
              )}
            </div>

            {data && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('Package Metrics')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-accent/20 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{data.averagePickupTime}</div>
                      <div className="text-sm text-muted-foreground">{t('Avg. Pickup Time (days)')}</div>
                    </div>
                    <div className="text-center p-4 bg-accent/20 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {((data.packagesDelivered / data.totalPackages) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">{t('Delivery Rate')}</div>
                    </div>
                    <div className="text-center p-4 bg-accent/20 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {data.totalPackages - data.packagesDelivered}
                      </div>
                      <div className="text-sm text-muted-foreground">{t('Pending Deliveries')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Customer Analytics */}
          <TabsContent value="customers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{t('Customer Analytics')}</h2>
              <Button onClick={handleExportCustomers} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('Export CSV')}
              </Button>
            </div>

            {data && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top Customers */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('Top Customers by Package Volume')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.topCustomers.slice(0, 10).map((customer, index) => (
                        <div key={customer.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {customer.packageCount} {t('packages')}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                              }).format(customer.revenue)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Inactive Customers */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('Inactive Customers')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.inactiveCustomers.slice(0, 10).map((customer) => (
                        <div key={customer.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {t('Last activity')}: {new Date(customer.lastActivity).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-coral">
                              {customer.daysSinceActivity} {t('days ago')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Metrics */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>{t('Customer Metrics')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-accent/20 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{data.customerRetention}%</div>
                        <div className="text-sm text-muted-foreground">{t('Customer Retention Rate')}</div>
                      </div>
                      <div className="text-center p-4 bg-accent/20 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {data.newCustomers.reduce((sum, day) => sum + day.count, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">{t('New Customers (Period)')}</div>
                      </div>
                      <div className="text-center p-4 bg-accent/20 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{data.inactiveCustomers.length}</div>
                        <div className="text-sm text-muted-foreground">{t('Inactive Customers')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Compliance */}
          <TabsContent value="compliance" className="space-y-4">
            <h2 className="text-lg font-semibold">{t('Compliance Metrics')}</h2>
            
            {data && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title={t('Form 1583 Completion')}
                  value={data.form1583Completion}
                  format="percentage"
                />
                <MetricCard
                  title={t('Pending Verifications')}
                  value={data.pendingVerifications}
                />
                <MetricCard
                  title={t('CMRA Reports Completed')}
                  value={data.cmraReportStatus.completed}
                />
                <MetricCard
                  title={t('Overdue Compliance')}
                  value={data.cmraReportStatus.overdue}
                />
              </div>
            )}

            {data && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('CMRA Report Status')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-primary-palm/20 rounded-lg">
                      <div className="text-2xl font-bold text-primary-palm">{data.cmraReportStatus.completed}</div>
                      <div className="text-sm text-muted-foreground">{t('Completed')}</div>
                    </div>
                    <div className="text-center p-4 bg-sunset/20 rounded-lg">
                      <div className="text-2xl font-bold text-sunset">{data.cmraReportStatus.pending}</div>
                      <div className="text-sm text-muted-foreground">{t('Pending')}</div>
                    </div>
                    <div className="text-center p-4 bg-coral/20 rounded-lg">
                      <div className="text-2xl font-bold text-coral">{data.cmraReportStatus.overdue}</div>
                      <div className="text-sm text-muted-foreground">{t('Overdue')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Financial */}
          <TabsContent value="financial" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{t('Financial Overview')}</h2>
              <Button onClick={handleExportRevenue} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('Export CSV')}
              </Button>
            </div>

            {data && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard
                    title={t('Monthly Recurring Revenue')}
                    value={data.monthlyRevenue[data.monthlyRevenue.length - 1]?.mailboxRevenue || 0}
                    format="currency"
                    icon={TrendingUp}
                  />
                  <MetricCard
                    title={t('Package Fees')}
                    value={data.monthlyRevenue[data.monthlyRevenue.length - 1]?.packageFees || 0}
                    format="currency"
                  />
                  <MetricCard
                    title={t('Outstanding Balances')}
                    value={data.outstandingBalances}
                    format="currency"
                  />
                </div>

                <RevenueChart data={data.monthlyRevenue} />

                <Card>
                  <CardHeader>
                    <CardTitle>{t('Revenue by Service Type')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.revenueByService.map((service) => (
                        <div key={service.service} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="font-medium">{service.service}</div>
                            <div className="text-sm text-muted-foreground">
                              ({service.percentage.toFixed(1)}%)
                            </div>
                          </div>
                          <div className="font-medium">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            }).format(service.revenue)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}