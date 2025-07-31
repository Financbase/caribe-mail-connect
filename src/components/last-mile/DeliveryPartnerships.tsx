import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Users, 
  Star, 
  DollarSign, 
  Shield, 
  Car, 
  Bike,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  Target
} from 'lucide-react';

interface GigDriver {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  vehicleType: 'car' | 'bike' | 'walking' | 'electric';
  rating: number;
  totalDeliveries: number;
  completionRate: number;
  averageTime: number;
  earnings: number;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  backgroundCheck: 'passed' | 'pending' | 'failed' | 'expired';
  availability: 'full-time' | 'part-time' | 'weekend-only';
  joinDate: string;
  lastActive: string;
  preferredAreas: string[];
}

interface PartnerPerformance {
  id: string;
  partnerName: string;
  partnerType: 'gig-driver' | 'local-courier' | 'fleet-partner';
  monthlyDeliveries: number;
  customerSatisfaction: number;
  onTimeDelivery: number;
  averageRating: number;
  totalEarnings: number;
  commission: number;
  status: 'active' | 'inactive' | 'suspended';
}

interface PaymentDistribution {
  id: string;
  partnerId: string;
  partnerName: string;
  period: string;
  basePay: number;
  bonuses: number;
  deductions: number;
  netPay: number;
  status: 'pending' | 'processed' | 'paid';
  paymentMethod: 'bank-transfer' | 'paypal' | 'cash';
}

export default function DeliveryPartnerships() {
  const { language } = useLanguage();
  const [selectedPartnerType, setSelectedPartnerType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showBackgroundChecks, setShowBackgroundChecks] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);

  const isSpanish = language === 'es';

  const gigDrivers: GigDriver[] = [
    {
      id: '1',
      name: 'Carlos Méndez',
      email: 'carlos.mendez@email.com',
      phone: '+1-787-555-0123',
      vehicleType: 'car',
      rating: 4.8,
      totalDeliveries: 156,
      completionRate: 98,
      averageTime: 22,
      earnings: 2840,
      status: 'active',
      backgroundCheck: 'passed',
      availability: 'full-time',
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      preferredAreas: ['San Juan', 'Bayamón']
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+1-787-555-0456',
      vehicleType: 'bike',
      rating: 4.9,
      totalDeliveries: 89,
      completionRate: 100,
      averageTime: 18,
      earnings: 1650,
      status: 'active',
      backgroundCheck: 'passed',
      availability: 'part-time',
      joinDate: '2024-02-01',
      lastActive: '2024-01-20',
      preferredAreas: ['Condado', 'Santurce']
    },
    {
      id: '3',
      name: 'Luis Rodríguez',
      email: 'luis.rodriguez@email.com',
      phone: '+1-787-555-0789',
      vehicleType: 'electric',
      rating: 4.6,
      totalDeliveries: 203,
      completionRate: 95,
      averageTime: 25,
      earnings: 3120,
      status: 'active',
      backgroundCheck: 'passed',
      availability: 'full-time',
      joinDate: '2023-11-20',
      lastActive: '2024-01-20',
      preferredAreas: ['Caguas', 'Gurabo']
    },
    {
      id: '4',
      name: 'Ana Torres',
      email: 'ana.torres@email.com',
      phone: '+1-787-555-0321',
      vehicleType: 'walking',
      rating: 4.7,
      totalDeliveries: 67,
      completionRate: 97,
      averageTime: 15,
      earnings: 980,
      status: 'inactive',
      backgroundCheck: 'expired',
      availability: 'weekend-only',
      joinDate: '2024-03-10',
      lastActive: '2024-01-15',
      preferredAreas: ['Viejo San Juan']
    }
  ];

  const partnerPerformance: PartnerPerformance[] = [
    {
      id: '1',
      partnerName: 'Carlos Méndez',
      partnerType: 'gig-driver',
      monthlyDeliveries: 156,
      customerSatisfaction: 98,
      onTimeDelivery: 96,
      averageRating: 4.8,
      totalEarnings: 2840,
      commission: 15,
      status: 'active'
    },
    {
      id: '2',
      partnerName: 'María González',
      partnerType: 'gig-driver',
      monthlyDeliveries: 89,
      customerSatisfaction: 100,
      onTimeDelivery: 98,
      averageRating: 4.9,
      totalEarnings: 1650,
      commission: 12,
      status: 'active'
    },
    {
      id: '3',
      partnerName: 'Express Couriers PR',
      partnerType: 'fleet-partner',
      monthlyDeliveries: 450,
      customerSatisfaction: 94,
      onTimeDelivery: 92,
      averageRating: 4.6,
      totalEarnings: 12500,
      commission: 20,
      status: 'active'
    }
  ];

  const paymentDistributions: PaymentDistribution[] = [
    {
      id: '1',
      partnerId: '1',
      partnerName: 'Carlos Méndez',
      period: 'Enero 2024',
      basePay: 2400,
      bonuses: 440,
      deductions: 0,
      netPay: 2840,
      status: 'paid',
      paymentMethod: 'bank-transfer'
    },
    {
      id: '2',
      partnerId: '2',
      partnerName: 'María González',
      period: 'Enero 2024',
      basePay: 1400,
      bonuses: 250,
      deductions: 0,
      netPay: 1650,
      status: 'processed',
      paymentMethod: 'paypal'
    },
    {
      id: '3',
      partnerId: '3',
      partnerName: 'Express Couriers PR',
      period: 'Enero 2024',
      basePay: 10000,
      bonuses: 2500,
      deductions: 0,
      netPay: 12500,
      status: 'pending',
      paymentMethod: 'bank-transfer'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getBackgroundCheckColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'expired': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car': return <Car className="w-4 h-4" />;
      case 'bike': return <Bike className="w-4 h-4" />;
      case 'walking': return <Walking className="w-4 h-4" />;
      case 'electric': return <Zap className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'processed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="partner-type" className="text-sm font-medium">
              {isSpanish ? 'Tipo de Socio:' : 'Partner Type:'}
            </Label>
            <Select value={selectedPartnerType} onValueChange={setSelectedPartnerType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isSpanish ? 'Todos' : 'All'}</SelectItem>
                <SelectItem value="gig-driver">{isSpanish ? 'Conductores Gig' : 'Gig Drivers'}</SelectItem>
                <SelectItem value="local-courier">{isSpanish ? 'Mensajeros Locales' : 'Local Couriers'}</SelectItem>
                <SelectItem value="fleet-partner">{isSpanish ? 'Flotas' : 'Fleet Partners'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="status" className="text-sm font-medium">
              {isSpanish ? 'Estado:' : 'Status:'}
            </Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isSpanish ? 'Todos' : 'All'}</SelectItem>
                <SelectItem value="active">{isSpanish ? 'Activos' : 'Active'}</SelectItem>
                <SelectItem value="inactive">{isSpanish ? 'Inactivos' : 'Inactive'}</SelectItem>
                <SelectItem value="suspended">{isSpanish ? 'Suspendidos' : 'Suspended'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="background-checks"
              checked={showBackgroundChecks}
              onCheckedChange={setShowBackgroundChecks}
            />
            <Label htmlFor="background-checks" className="text-sm">
              {isSpanish ? 'Verificaciones' : 'Background Checks'}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-approve"
              checked={autoApprove}
              onCheckedChange={setAutoApprove}
            />
            <Label htmlFor="auto-approve" className="text-sm">
              {isSpanish ? 'Auto-Aprobar' : 'Auto-Approve'}
            </Label>
          </div>
          <Button size="sm">
            <Users className="w-4 h-4 mr-2" />
            {isSpanish ? 'Agregar Socio' : 'Add Partner'}
          </Button>
        </div>
      </div>

      {/* Gig Drivers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {isSpanish ? 'Conductores Gig' : 'Gig Drivers'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Gestión de conductores independientes y sus rendimientos'
              : 'Management of independent drivers and their performance'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {gigDrivers.map((driver) => (
              <Card key={driver.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={driver.avatar} />
                        <AvatarFallback>
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{driver.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          {getVehicleIcon(driver.vehicleType)}
                          <span>{driver.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(driver.status)}>
                        {isSpanish 
                          ? (driver.status === 'active' ? 'Activo' :
                             driver.status === 'inactive' ? 'Inactivo' :
                             driver.status === 'suspended' ? 'Suspendido' : 'Pendiente')
                          : driver.status.charAt(0).toUpperCase() + driver.status.slice(1)
                        }
                      </Badge>
                      <Badge className={getBackgroundCheckColor(driver.backgroundCheck)}>
                        {isSpanish 
                          ? (driver.backgroundCheck === 'passed' ? 'Verificado' :
                             driver.backgroundCheck === 'pending' ? 'Pendiente' :
                             driver.backgroundCheck === 'failed' ? 'Fallido' : 'Expirado')
                          : driver.backgroundCheck.charAt(0).toUpperCase() + driver.backgroundCheck.slice(1)
                        }
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold">{driver.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Calificación' : 'Rating'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-green-600">${driver.earnings}</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Ganancias' : 'Earnings'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{driver.totalDeliveries}</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Entregas' : 'Deliveries'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-purple-600">{driver.completionRate}%</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Completadas' : 'Completion'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{driver.averageTime}m {isSpanish ? 'promedio' : 'avg'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{isSpanish ? 'Último activo:' : 'Last active:'} {driver.lastActive}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      {isSpanish ? 'Llamar' : 'Call'}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      {isSpanish ? 'Email' : 'Email'}
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Target className="w-4 h-4 mr-2" />
                      {isSpanish ? 'Ver Detalles' : 'View Details'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Partner Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {isSpanish ? 'Rendimiento de Socios' : 'Partner Performance'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Métricas de rendimiento y satisfacción del cliente'
              : 'Performance metrics and customer satisfaction'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {partnerPerformance.map((partner) => (
              <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{partner.partnerName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isSpanish 
                        ? (partner.partnerType === 'gig-driver' ? 'Conductor Gig' :
                           partner.partnerType === 'local-courier' ? 'Mensajero Local' : 'Flota')
                        : partner.partnerType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{partner.monthlyDeliveries}</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Entregas' : 'Deliveries'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-green-600">{partner.customerSatisfaction}%</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Satisfacción' : 'Satisfaction'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-purple-600">{partner.onTimeDelivery}%</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'A Tiempo' : 'On Time'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold">{partner.averageRating}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Calificación' : 'Rating'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-green-600">${partner.totalEarnings}</div>
                    <div className="text-xs text-gray-500">
                      {isSpanish ? 'Ganancias' : 'Earnings'}
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(partner.status)}>
                    {isSpanish 
                      ? (partner.status === 'active' ? 'Activo' :
                         partner.status === 'inactive' ? 'Inactivo' : 'Suspendido')
                      : partner.status.charAt(0).toUpperCase() + partner.status.slice(1)
                    }
                  </Badge>
                  
                  <Button size="sm" variant="outline">
                    {isSpanish ? 'Ver Detalles' : 'View Details'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {isSpanish ? 'Distribución de Pagos' : 'Payment Distribution'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Gestión de pagos y comisiones para socios'
              : 'Payment and commission management for partners'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentDistributions.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{payment.partnerName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{payment.period}</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="font-bold text-blue-600">${payment.basePay}</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Salario Base' : 'Base Pay'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-green-600">${payment.bonuses}</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Bonificaciones' : 'Bonuses'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-red-600">${payment.deductions}</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Deducciones' : 'Deductions'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-purple-600">${payment.netPay}</div>
                      <div className="text-xs text-gray-500">
                        {isSpanish ? 'Pago Neto' : 'Net Pay'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge className={getPaymentStatusColor(payment.status)}>
                    {isSpanish 
                      ? (payment.status === 'paid' ? 'Pagado' :
                         payment.status === 'processed' ? 'Procesado' : 'Pendiente')
                      : payment.status.charAt(0).toUpperCase() + payment.status.slice(1)
                    }
                  </Badge>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {isSpanish 
                      ? (payment.paymentMethod === 'bank-transfer' ? 'Transferencia Bancaria' :
                         payment.paymentMethod === 'paypal' ? 'PayPal' : 'Efectivo')
                      : payment.paymentMethod.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                    }
                  </div>
                  
                  <Button size="sm" variant="outline">
                    {isSpanish ? 'Ver Detalles' : 'View Details'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Background Checks */}
      {showBackgroundChecks && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {isSpanish ? 'Verificaciones de Antecedentes' : 'Background Checks'}
            </CardTitle>
            <CardDescription>
              {isSpanish 
                ? 'Estado de verificaciones de seguridad y documentación'
                : 'Security verification status and documentation'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                <div className="text-sm font-medium mb-1">
                  {isSpanish ? 'Verificados' : 'Verified'}
                </div>
                <div className="text-xs text-gray-500">
                  {isSpanish ? 'Antecedentes Limpios' : 'Clean Background'}
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-yellow-600 mb-2">3</div>
                <div className="text-sm font-medium mb-1">
                  {isSpanish ? 'Pendientes' : 'Pending'}
                </div>
                <div className="text-xs text-gray-500">
                  {isSpanish ? 'En Revisión' : 'Under Review'}
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-red-600 mb-2">1</div>
                <div className="text-sm font-medium mb-1">
                  {isSpanish ? 'Rechazados' : 'Rejected'}
                </div>
                <div className="text-xs text-gray-500">
                  {isSpanish ? 'No Aprobados' : 'Not Approved'}
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-orange-600 mb-2">2</div>
                <div className="text-sm font-medium mb-1">
                  {isSpanish ? 'Expirados' : 'Expired'}
                </div>
                <div className="text-xs text-gray-500">
                  {isSpanish ? 'Necesitan Renovar' : 'Need Renewal'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 