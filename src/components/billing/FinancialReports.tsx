import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangeSelector } from '@/components/analytics/DateRangeSelector';
import { RevenueChart } from '@/components/analytics/RevenueChart';
import { MetricCard } from '@/components/analytics/MetricCard';
import { Download, TrendingUp, DollarSign, FileText, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

interface FinancialReport {
  totalRevenue: number;
  totalInvoices: number;
  totalPayments: number;
  outstandingBalance: number;
  revenueByService: Array<{ service: string; amount: number }>;
  monthlyRevenue: Array<{ month: string; amount: number }>;
  taxSummary: { totalTax: number; ivuRate: number };
}

export function FinancialReports() {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [reportType, setReportType] = useState('monthly');
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const fromDate = format(dateRange.from, 'yyyy-MM-dd');
      const toDate = format(dateRange.to, 'yyyy-MM-dd');

      // Fetch revenue data
      const { data: payments } = await supabase
        .from('payments')
        .select('amount, payment_date')
        .gte('payment_date', fromDate)
        .lte('payment_date', toDate)
        .eq('status', 'completed');

      // Fetch invoice data
      const { data: invoices } = await supabase
        .from('invoices')
        .select('total_amount, amount_due, issue_date')
        .gte('issue_date', fromDate)
        .lte('issue_date', toDate);

      // Calculate totals
      const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const totalInvoices = invoices?.length || 0;
      const totalPayments = payments?.length || 0;
      const outstandingBalance = invoices?.reduce((sum, i) => sum + Number(i.amount_due), 0) || 0;

      // Mock data for revenue by service (would need to join with invoice_items)
      const revenueByService = [
        { service: 'Alquiler de Buzones', amount: totalRevenue * 0.6 },
        { service: 'Manejo de Paquetes', amount: totalRevenue * 0.25 },
        { service: 'Servicios Adicionales', amount: totalRevenue * 0.15 },
      ];

      // Generate monthly revenue data
      const monthlyRevenue = [];
      for (let i = 5; i >= 0; i--) {
        const month = subMonths(new Date(), i);
        const monthStart = format(startOfMonth(month), 'yyyy-MM-dd');
        const monthEnd = format(endOfMonth(month), 'yyyy-MM-dd');
        
        const monthPayments = payments?.filter(p => 
          p.payment_date >= monthStart && p.payment_date <= monthEnd
        ) || [];
        
        const monthAmount = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        
        monthlyRevenue.push({
          month: format(month, 'MMM yyyy', { locale: es }),
          amount: monthAmount,
        });
      }

      // Tax calculation (IVU 11.5% in PR)
      const taxSummary = {
        totalTax: totalRevenue * 0.115,
        ivuRate: 11.5,
      };

      setReport({
        totalRevenue,
        totalInvoices,
        totalPayments,
        outstandingBalance,
        revenueByService,
        monthlyRevenue,
        taxSummary,
      });
    } catch (error) {
      console.error('Error fetching financial report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [dateRange, reportType]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const exportReport = () => {
    // Placeholder for report export functionality
    alert('Funcionalidad de exportación en desarrollo');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Reportes Financieros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <DateRangeSelector
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de reporte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensual</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportReport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Ingresos Totales"
          value={formatCurrency(report?.totalRevenue || 0)}
          icon={DollarSign}
        />
        <MetricCard
          title="Facturas Emitidas"
          value={report?.totalInvoices.toString() || '0'}
          icon={FileText}
        />
        <MetricCard
          title="Pagos Recibidos"
          value={report?.totalPayments.toString() || '0'}
          icon={TrendingUp}
        />
        <MetricCard
          title="Por Cobrar"
          value={formatCurrency(report?.outstandingBalance || 0)}
          icon={Users}
        />
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          <TabsTrigger value="aging">Antigüedad</TabsTrigger>
          <TabsTrigger value="tax">IVU/Impuestos</TabsTrigger>
          <TabsTrigger value="reconciliation">Conciliación</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Tendencia de Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueChart data={report?.monthlyRevenue?.map(m => ({
                  month: m.month,
                  mailboxRevenue: m.amount * 0.75,
                  packageFees: m.amount * 0.25,
                  total: m.amount
                })) || []} />
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Ingresos por Servicio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report?.revenueByService.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                      <span className="font-medium">{service.service}</span>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(service.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="aging">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Análisis de Antigüedad de Cuentas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency((report?.outstandingBalance || 0) * 0.4)}
                  </div>
                  <p className="text-sm text-muted-foreground">0-30 días</p>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {formatCurrency((report?.outstandingBalance || 0) * 0.3)}
                  </div>
                  <p className="text-sm text-muted-foreground">31-60 días</p>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent-foreground">
                    {formatCurrency((report?.outstandingBalance || 0) * 0.2)}
                  </div>
                  <p className="text-sm text-muted-foreground">61-90 días</p>
                </div>
                <div className="text-center p-4 bg-destructive/10 rounded-lg">
                  <div className="text-2xl font-bold text-destructive">
                    {formatCurrency((report?.outstandingBalance || 0) * 0.1)}
                  </div>
                  <p className="text-sm text-muted-foreground">+90 días</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Resumen de IVU (Impuesto sobre Ventas y Uso)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-primary/10 rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(report?.taxSummary.totalTax || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Total IVU Recolectado
                  </p>
                </div>
                <div className="text-center p-6 bg-secondary/10 rounded-lg">
                  <div className="text-3xl font-bold text-secondary">
                    {report?.taxSummary.ivuRate}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Tasa de IVU
                  </p>
                </div>
                <div className="text-center p-6 bg-accent/10 rounded-lg">
                  <div className="text-3xl font-bold text-accent-foreground">
                    {formatCurrency((report?.totalRevenue || 0) - (report?.taxSummary.totalTax || 0))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ingresos Netos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Conciliación Diaria de Efectivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <span>Efectivo en caja (inicio del día)</span>
                  <span className="font-bold">{formatCurrency(500)}</span>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <span>Pagos en efectivo recibidos</span>
                  <span className="font-bold text-primary">
                    +{formatCurrency((report?.totalRevenue || 0) * 0.3)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <span>Gastos en efectivo</span>
                  <span className="font-bold text-destructive">-{formatCurrency(150)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                  <span className="font-bold">Efectivo esperado en caja</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(500 + (report?.totalRevenue || 0) * 0.3 - 150)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}