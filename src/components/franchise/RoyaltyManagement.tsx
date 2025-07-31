import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  Upload,
  Plus,
  Search,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Calculator,
  Receipt,
  CreditCard,
  Banknote,
  Users,
  Target,
  Award,
  Shield,
  MessageSquare,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useRoyaltyManagement } from '@/hooks/useRoyaltyManagement';

interface RoyaltyCalculation {
  id: string;
  franchise_id: string;
  franchise_name: string;
  period: string;
  gross_revenue: number;
  royalty_rate: number;
  royalty_amount: number;
  marketing_fee: number;
  technology_fee: number;
  total_fees: number;
  net_payment: number;
  status: 'pending' | 'calculated' | 'approved' | 'paid' | 'disputed';
  calculated_at: string;
  due_date: string;
  paid_date?: string;
}

interface PaymentTracking {
  id: string;
  franchise_id: string;
  franchise_name: string;
  amount: number;
  payment_method: 'bank_transfer' | 'credit_card' | 'check' | 'cash';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transaction_id: string;
  reference_number: string;
  payment_date: string;
  processed_date?: string;
  notes: string;
}

interface RevenueReport {
  id: string;
  franchise_id: string;
  franchise_name: string;
  period: string;
  total_revenue: number;
  service_breakdown: {
    service: string;
    revenue: number;
    percentage: number;
  }[];
  growth_rate: number;
  comparison_previous_period: number;
  generated_at: string;
}

interface FeeStructure {
  id: string;
  name: string;
  description: string;
  fee_type: 'royalty' | 'marketing' | 'technology' | 'training' | 'support';
  calculation_method: 'percentage' | 'fixed' | 'tiered' | 'volume_based';
  rate: number;
  min_amount?: number;
  max_amount?: number;
  tiers?: {
    min_revenue: number;
    max_revenue: number;
    rate: number;
  }[];
  effective_date: string;
  expiry_date?: string;
  is_active: boolean;
  applicable_franchises: string[];
}

interface DisputeCase {
  id: string;
  franchise_id: string;
  franchise_name: string;
  royalty_calculation_id: string;
  dispute_type: 'calculation_error' | 'fee_structure' | 'payment_issue' | 'service_dispute' | 'other';
  description: string;
  disputed_amount: number;
  evidence_files: string[];
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  created_at: string;
  resolved_at?: string;
  resolution?: string;
  resolution_amount?: number;
}

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Transferencia Bancaria', icon: Banknote },
  { value: 'credit_card', label: 'Tarjeta de Crédito', icon: CreditCard },
  { value: 'check', label: 'Cheque', icon: Receipt },
  { value: 'cash', label: 'Efectivo', icon: DollarSign }
];

const DISPUTE_TYPES = [
  { value: 'calculation_error', label: 'Error de Cálculo', color: 'bg-red-100 text-red-800' },
  { value: 'fee_structure', label: 'Estructura de Tarifas', color: 'bg-blue-100 text-blue-800' },
  { value: 'payment_issue', label: 'Problema de Pago', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'service_dispute', label: 'Disputa de Servicio', color: 'bg-purple-100 text-purple-800' },
  { value: 'other', label: 'Otro', color: 'bg-gray-100 text-gray-800' }
];

const PRIORITIES = [
  { value: 'low', label: 'Baja', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800' }
];

export function RoyaltyManagement() {
  const { 
    royaltyCalculations, 
    paymentTracking, 
    revenueReports, 
    feeStructures, 
    disputeCases,
    loading 
  } = useRoyaltyManagement();

  const [showCreateDispute, setShowCreateDispute] = useState(false);
  const [newDispute, setNewDispute] = useState({
    franchise_id: '',
    royalty_calculation_id: '',
    dispute_type: 'calculation_error' as string,
    description: '',
    disputed_amount: 0,
    priority: 'medium' as string
  });

  const totalRoyalties = royaltyCalculations.reduce((sum, calc) => sum + calc.royalty_amount, 0);
  const totalPayments = paymentTracking.filter(p => p.status === 'completed').reduce((sum, payment) => sum + payment.amount, 0);
  const pendingDisputes = disputeCases.filter(d => d.status === 'open').length;
  const overduePayments = royaltyCalculations.filter(calc => 
    calc.status === 'approved' && new Date(calc.due_date) < new Date()
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'calculated': return 'text-blue-600 bg-blue-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'disputed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDisputeTypeColor = (type: string) => {
    const disputeType = DISPUTE_TYPES.find(d => d.value === type);
    return disputeType?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const pri = PRIORITIES.find(p => p.value === priority);
    return pri?.color || 'bg-gray-100 text-gray-800';
  };

  const createDispute = async () => {
    if (!newDispute.description.trim()) {
      return;
    }

    // Mock implementation
    console.log('Creating dispute:', newDispute);
    setNewDispute({
      franchise_id: '',
      royalty_calculation_id: '',
      dispute_type: 'calculation_error',
      description: '',
      disputed_amount: 0,
      priority: 'medium'
    });
    setShowCreateDispute(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Regalías</h1>
          <p className="text-muted-foreground mt-2">
            Administración automatizada de regalías y pagos de franquicias
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="px-4 py-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Regalías Totales</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalRoyalties.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          <Card className="px-4 py-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Pagos Completados</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${totalPayments.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regalías Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${royaltyCalculations.filter(c => c.status === 'approved').reduce((sum, calc) => sum + calc.royalty_amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {overduePayments} pagos vencidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disputas Abiertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pendingDisputes}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Cobro</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRoyalties > 0 ? Math.round((totalPayments / totalRoyalties) * 100) : 0}%
            </div>
            <Progress value={totalRoyalties > 0 ? (totalPayments / totalRoyalties) * 100 : 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Eficiencia de cobro
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Franquicias Activas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(royaltyCalculations.map(c => c.franchise_id)).size}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Generando regalías
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calculations" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculations">Cálculos</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="fees">Tarifas</TabsTrigger>
          <TabsTrigger value="disputes">Disputas</TabsTrigger>
        </TabsList>

        <TabsContent value="calculations" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Cálculos de Regalías</h2>
            <p className="text-muted-foreground">
              Cálculos automatizados de regalías por franquicia
            </p>
          </div>

          <div className="space-y-4">
            {royaltyCalculations.map((calculation) => (
              <Card key={calculation.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{calculation.franchise_name}</CardTitle>
                      <CardDescription>Período: {calculation.period}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(calculation.status)}>
                        {calculation.status === 'pending' ? 'Pendiente' :
                         calculation.status === 'calculated' ? 'Calculado' :
                         calculation.status === 'approved' ? 'Aprobado' :
                         calculation.status === 'paid' ? 'Pagado' : 'Disputado'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Ingresos Brutos</Label>
                      <div className="text-lg font-bold">${calculation.gross_revenue.toLocaleString()}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Tasa de Regalía</Label>
                      <div className="text-lg font-bold">{calculation.royalty_rate}%</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Regalía</Label>
                      <div className="text-lg font-bold text-blue-600">${calculation.royalty_amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Total a Pagar</Label>
                      <div className="text-lg font-bold text-green-600">${calculation.total_fees.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span>Fecha de Vencimiento:</span>
                      <span>{new Date(calculation.due_date).toLocaleDateString()}</span>
                    </div>
                    {calculation.paid_date && (
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span>Fecha de Pago:</span>
                        <span>{new Date(calculation.paid_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Seguimiento de Pagos</h2>
            <p className="text-muted-foreground">
              Estado y seguimiento de todos los pagos de regalías
            </p>
          </div>

          <div className="space-y-4">
            {paymentTracking.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{payment.franchise_name}</CardTitle>
                      <CardDescription>ID: {payment.transaction_id}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPaymentStatusColor(payment.status)}>
                        {payment.status === 'pending' ? 'Pendiente' :
                         payment.status === 'processing' ? 'Procesando' :
                         payment.status === 'completed' ? 'Completado' :
                         payment.status === 'failed' ? 'Fallido' : 'Reembolsado'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Monto</Label>
                      <div className="text-lg font-bold text-green-600">${payment.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Método de Pago</Label>
                      <div className="text-sm font-medium">
                        {PAYMENT_METHODS.find(m => m.value === payment.payment_method)?.label}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Fecha de Pago</Label>
                      <div className="text-sm">{new Date(payment.payment_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  {payment.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <Label className="text-sm text-muted-foreground">Notas</Label>
                      <p className="text-sm">{payment.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Reportes de Ingresos</h2>
            <p className="text-muted-foreground">
              Análisis detallado de ingresos por franquicia
            </p>
          </div>

          <div className="space-y-4">
            {revenueReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{report.franchise_name}</CardTitle>
                      <CardDescription>Período: {report.period}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-lg font-bold">${report.total_revenue.toLocaleString()}</div>
                        <div className={`text-sm ${report.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {report.growth_rate >= 0 ? '+' : ''}{report.growth_rate}% vs período anterior
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Desglose de Servicios</Label>
                      <div className="space-y-2 mt-2">
                        {report.service_breakdown.map((service, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{service.service}</span>
                            <div className="text-right">
                              <div className="text-sm font-medium">${service.revenue.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">{service.percentage}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Generado: {new Date(report.generated_at).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Estructuras de Tarifas</h2>
            <p className="text-muted-foreground">
              Configuración de tarifas y estructuras de cobro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feeStructures.map((fee) => (
              <Card key={fee.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{fee.name}</CardTitle>
                      <CardDescription>{fee.description}</CardDescription>
                    </div>
                    <Badge variant={fee.is_active ? 'default' : 'secondary'}>
                      {fee.is_active ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tipo:</span>
                        <p className="font-medium capitalize">{fee.fee_type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Método:</span>
                        <p className="font-medium capitalize">{fee.calculation_method.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tasa:</span>
                        <p className="font-medium">{fee.rate}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Efectiva:</span>
                        <p className="font-medium">{new Date(fee.effective_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {fee.tiers && fee.tiers.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Niveles de Tarifa</Label>
                        <div className="space-y-1 mt-2">
                          {fee.tiers.map((tier, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>${tier.min_revenue.toLocaleString()} - ${tier.max_revenue.toLocaleString()}</span>
                              <span className="font-medium">{tier.rate}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="disputes" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Resolución de Disputas</h2>
              <p className="text-muted-foreground">
                Gestión de disputas y controversias de regalías
              </p>
            </div>
            <Dialog open={showCreateDispute} onOpenChange={setShowCreateDispute}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Disputa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Disputa</DialogTitle>
                  <DialogDescription>
                    Registra una disputa sobre cálculos de regalías
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dispute-description">Descripción</Label>
                    <Textarea
                      id="dispute-description"
                      value={newDispute.description}
                      onChange={(e) => setNewDispute(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe la disputa en detalle"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dispute-type">Tipo de Disputa</Label>
                      <Select value={newDispute.dispute_type} onValueChange={(value) => setNewDispute(prev => ({ ...prev, dispute_type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DISPUTE_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dispute-priority">Prioridad</Label>
                      <Select value={newDispute.priority} onValueChange={(value) => setNewDispute(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITIES.map(priority => (
                            <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dispute-amount">Monto Disputado</Label>
                    <Input
                      id="dispute-amount"
                      type="number"
                      value={newDispute.disputed_amount}
                      onChange={(e) => setNewDispute(prev => ({ ...prev, disputed_amount: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDispute(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={createDispute}>
                    Crear Disputa
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {disputeCases.map((dispute) => (
              <Card key={dispute.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{dispute.franchise_name}</CardTitle>
                      <CardDescription>ID: {dispute.id}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getDisputeTypeColor(dispute.dispute_type)}>
                        {DISPUTE_TYPES.find(t => t.value === dispute.dispute_type)?.label}
                      </Badge>
                      <Badge className={getPriorityColor(dispute.priority)}>
                        {PRIORITIES.find(p => p.value === dispute.priority)?.label}
                      </Badge>
                      <Badge variant={dispute.status === 'open' ? 'destructive' : 'secondary'}>
                        {dispute.status === 'open' ? 'Abierta' :
                         dispute.status === 'under_review' ? 'En Revisión' :
                         dispute.status === 'resolved' ? 'Resuelta' : 'Cerrada'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{dispute.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Monto Disputado:</span>
                        <div className="font-bold text-red-600">${dispute.disputed_amount.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Creada:</span>
                        <div>{new Date(dispute.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {dispute.resolution && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Resolución:</p>
                        <p className="text-sm text-green-700">{dispute.resolution}</p>
                        {dispute.resolution_amount && (
                          <p className="text-sm text-green-700 mt-1">
                            Monto acordado: ${dispute.resolution_amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Comunicar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 