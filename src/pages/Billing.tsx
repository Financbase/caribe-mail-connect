import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, Receipt, DollarSign, TrendingUp, FileText, Calendar, Filter } from 'lucide-react';
import { MobileHeader } from '@/components/MobileHeader';
import { InvoiceList } from '@/components/billing/InvoiceList';
import { PaymentProcessing } from '@/components/billing/PaymentProcessing';
import { BillingRuns } from '@/components/billing/BillingRuns';
import { FinancialReports } from '@/components/billing/FinancialReports';
import { CreateInvoiceDialog } from '@/components/billing/CreateInvoiceDialog';
import { useBilling } from '@/hooks/useBilling';

interface BillingProps {
  onNavigate: (page: string) => void;
}

export default function Billing({ onNavigate }: BillingProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const { summary, loading } = useBilling();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <MobileHeader title="Facturación / Billing" />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${summary?.monthlyRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                +20.1% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cuentas por Cobrar</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                ${summary?.outstandingBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                {summary?.outstandingInvoices || 0} facturas pendientes
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Hoy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${summary?.dailyPayments?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                {summary?.dailyPaymentCount || 0} transacciones
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facturas Vencidas</CardTitle>
              <FileText className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {summary?.overdueInvoices || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren atención inmediata
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => setShowCreateInvoice(true)}
            className="bg-primary hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>
          
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Ejecutar Facturación
          </Button>
          
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="invoices">Facturas</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Facturas Recientes</CardTitle>
                  <CardDescription>Últimas 5 facturas generadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <InvoiceList limit={5} variant="summary" />
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Próximas Facturaciones</CardTitle>
                  <CardDescription>Clientes con vencimiento próximo</CardDescription>
                </CardHeader>
                <CardContent>
                  <BillingRuns variant="upcoming" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            <InvoiceList />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentProcessing />
          </TabsContent>

          <TabsContent value="reports">
            <FinancialReports />
          </TabsContent>
        </Tabs>

        {/* Create Invoice Dialog */}
        <CreateInvoiceDialog 
          open={showCreateInvoice}
          onOpenChange={setShowCreateInvoice}
        />
      </div>
    </div>
  );
}