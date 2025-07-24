import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, CreditCard, Smartphone, DollarSign, Search, Receipt } from 'lucide-react';
import { useBilling } from '@/hooks/useBilling';
import { RecordPaymentDialog } from './RecordPaymentDialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function PaymentProcessing() {
  const { payments, loading } = useBilling();
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && payment.payment_method === activeTab;
  });

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'ath_movil':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      cash: 'Efectivo',
      card: 'Tarjeta',
      ath_movil: 'ATH Móvil',
      check: 'Cheque',
      bank_transfer: 'Transferencia',
    };
    return methods[method as keyof typeof methods] || method;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Completado', variant: 'default' as const },
      pending: { label: 'Pendiente', variant: 'secondary' as const },
      failed: { label: 'Fallido', variant: 'destructive' as const },
      refunded: { label: 'Reembolsado', variant: 'outline' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const dailyTotal = payments
    .filter(p => p.payment_date === new Date().toISOString().split('T')[0])
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total del Día</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(dailyTotal)}
            </div>
            <p className="text-xs text-muted-foreground">
              {payments.filter(p => p.payment_date === new Date().toISOString().split('T')[0]).length} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efectivo</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {formatCurrency(
                payments
                  .filter(p => p.payment_method === 'cash' && p.payment_date === new Date().toISOString().split('T')[0])
                  .reduce((sum, p) => sum + Number(p.amount), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Requiere conciliación
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digital</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(
                payments
                  .filter(p => ['card', 'ath_movil'].includes(p.payment_method) && p.payment_date === new Date().toISOString().split('T')[0])
                  .reduce((sum, p) => sum + Number(p.amount), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tarjeta y ATH Móvil
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Actions */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={() => setShowRecordPayment(true)}
          className="bg-primary hover:bg-primary-dark"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Pago
        </Button>
        
        <Button variant="outline">
          <Receipt className="w-4 h-4 mr-2" />
          Imprimir Recibo
        </Button>
        
        <Button variant="outline">
          <DollarSign className="w-4 h-4 mr-2" />
          Conciliación Diaria
        </Button>
      </div>

      {/* Payment History */}
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Historial de Pagos</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar pagos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="cash">Efectivo</TabsTrigger>
              <TabsTrigger value="card">Tarjeta</TabsTrigger>
              <TabsTrigger value="ath_movil">ATH Móvil</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Referencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No se encontraron pagos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.payment_number}</TableCell>
                      <TableCell>{payment.customer_name}</TableCell>
                      <TableCell>
                        {format(new Date(payment.payment_date), 'dd/MM/yyyy', { locale: es })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getPaymentMethodIcon(payment.payment_method)}
                          <span>{getPaymentMethodLabel(payment.payment_method)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.reference_number || '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Record Payment Dialog */}
      <RecordPaymentDialog 
        open={showRecordPayment}
        onOpenChange={setShowRecordPayment}
      />
    </div>
  );
}