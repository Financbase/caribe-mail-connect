import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileText, 
  CreditCard, 
  Shield, 
  Truck, 
  Package,
  Camera,
  Download,
  Upload,
  Send,
  Save,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Star,
  Crown,
  Gift,
  MessageCircle,
  Mail,
  Smartphone,
  Tablet,
  Monitor,
  Watch,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Plus,
  X,
  Clock,
  MapPin,
  Users,
  Building,
  Home,
  Car,
  Plane,
  Ship,
  Train,
  Bus,
  Bike,
  Key,
  Fingerprint,
  Phone,
  Email,
  MessageSquare,
  PhoneCall,
  Video,
  Mic,
  MicOff,
  Headphones,
  Speaker,
  Vibrate,
  Moon,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Droplets,
  Umbrella,
  Sun as Sunny,
  Cloud as Cloudy,
  CloudRain as Rainy,
  CloudSnow as Snowy,
  Wind as Windy,
  Thermometer as Hot,
  Droplets as Humid,
  Umbrella as Stormy
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  loyaltyPoints?: number;
  avatarUrl?: string;
  preferredLanguage?: string;
  notificationsEnabled?: boolean;
  // Add more fields as needed
}

interface PortalDigitalServicesProps {
  customerData: CustomerData;
  onNavigate: (page: string) => void;
}

interface MailScanningRequest {
  id: string;
  date: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: 'standard' | 'express' | 'urgent';
  instructions: string;
  pages: number;
  cost: number;
}

interface CheckDeposit {
  id: string;
  date: Date;
  amount: number;
  bank: string;
  accountNumber: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  checkImage?: string;
}

interface ShreddingRequest {
  id: string;
  date: Date;
  weight: number;
  type: 'standard' | 'confidential' | 'top-secret';
  status: 'pending' | 'scheduled' | 'completed';
  instructions: string;
  cost: number;
}

interface MailForwardingRule {
  id: string;
  sender: string;
  action: 'forward' | 'hold' | 'scan' | 'shred';
  destination: string;
  active: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface ReturnPackage {
  id: string;
  originalPackage: string;
  reason: string;
  returnAddress: string;
  status: 'pending' | 'approved' | 'shipped' | 'delivered';
  trackingNumber?: string;
  cost: number;
}

export default function PortalDigitalServices({ customerData, onNavigate }: PortalDigitalServicesProps) {
  const [activeTab, setActiveTab] = useState('mail-scanning');
  const [showMailScanningDialog, setShowMailScanningDialog] = useState(false);
  const [showCheckDepositDialog, setShowCheckDepositDialog] = useState(false);
  const [showShreddingDialog, setShowShreddingDialog] = useState(false);
  const [showForwardingDialog, setShowForwardingDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  // Mock data for digital services
  const mailScanningRequests: MailScanningRequest[] = [
    {
      id: '1',
      date: new Date('2024-12-15'),
      status: 'completed',
      priority: 'standard',
      instructions: 'Escanear todo el correo personal',
      pages: 12,
      cost: 5.00
    },
    {
      id: '2',
      date: new Date('2024-12-18'),
      status: 'processing',
      priority: 'express',
      instructions: 'Escanear facturas urgentes',
      pages: 3,
      cost: 8.00
    }
  ];

  const checkDeposits: CheckDeposit[] = [
    {
      id: '1',
      date: new Date('2024-12-14'),
      amount: 1250.00,
      bank: 'Banco Popular',
      accountNumber: '****1234',
      status: 'completed'
    },
    {
      id: '2',
      date: new Date('2024-12-17'),
      amount: 500.00,
      bank: 'FirstBank',
      accountNumber: '****5678',
      status: 'processing'
    }
  ];

  const shreddingRequests: ShreddingRequest[] = [
    {
      id: '1',
      date: new Date('2024-12-16'),
      weight: 2.5,
      type: 'confidential',
      status: 'completed',
      instructions: 'Destruir documentos financieros antiguos',
      cost: 15.00
    }
  ];

  const mailForwardingRules: MailForwardingRule[] = [
    {
      id: '1',
      sender: 'Amazon',
      action: 'forward',
      destination: 'casa@email.com',
      active: true,
      priority: 'high'
    },
    {
      id: '2',
      sender: 'IRS',
      action: 'scan',
      destination: 'impuestos@email.com',
      active: true,
      priority: 'high'
    },
    {
      id: '3',
      sender: 'spam@unwanted.com',
      action: 'shred',
      destination: '',
      active: true,
      priority: 'low'
    }
  ];

  const returnPackages: ReturnPackage[] = [
    {
      id: '1',
      originalPackage: 'PKG001',
      reason: 'Talla incorrecta',
      returnAddress: 'Amazon Returns Center',
      status: 'shipped',
      trackingNumber: 'RET123456789',
      cost: 8.50
    }
  ];

  useEffect(() => {
    checkOnlineStatus();
  }, []);

  const checkOnlineStatus = () => {
    setIsOffline(!navigator.onLine);
    window.addEventListener('online', () => setIsOffline(false));
    window.addEventListener('offline', () => setIsOffline(true));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'express': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'standard': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Servicios Digitales</h1>
          <p className="text-muted-foreground">Gestiona todos tus servicios digitales</p>
        </div>
        <div className="flex items-center space-x-4">
          {isOffline && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <WifiOff className="h-3 w-3 mr-1" />
              Modo Offline
            </Badge>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="mail-scanning">Escaneo</TabsTrigger>
          <TabsTrigger value="check-deposit">Depósitos</TabsTrigger>
          <TabsTrigger value="shredding">Destrucción</TabsTrigger>
          <TabsTrigger value="forwarding">Reenvío</TabsTrigger>
          <TabsTrigger value="returns">Devoluciones</TabsTrigger>
        </TabsList>

        {/* Mail Scanning Tab */}
        <TabsContent value="mail-scanning" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Escaneo de Correo</CardTitle>
                  <CardDescription>
                    Digitaliza tu correo físico para acceso remoto
                  </CardDescription>
                </div>
                <Button onClick={() => setShowMailScanningDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Solicitud
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mailScanningRequests.map((request) => (
                  <Card key={request.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              Solicitud #{request.id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(request.date, 'MMM dd, yyyy', { locale: es })} • {request.pages} páginas
                            </p>
                            <p className="text-sm text-muted-foreground">{request.instructions}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status === 'completed' ? 'Completado' :
                             request.status === 'processing' ? 'Procesando' :
                             request.status === 'pending' ? 'Pendiente' : 'Fallido'}
                          </Badge>
                          <p className="text-sm font-medium">${request.cost.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Check Deposit Tab */}
        <TabsContent value="check-deposit" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Depósito de Cheques</CardTitle>
                  <CardDescription>
                    Deposita cheques digitalmente en tu cuenta bancaria
                  </CardDescription>
                </div>
                <Button onClick={() => setShowCheckDepositDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Depósito
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checkDeposits.map((deposit) => (
                  <Card key={deposit.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CreditCard className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              ${deposit.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {deposit.bank} • {deposit.accountNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(deposit.date, 'MMM dd, yyyy', { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(deposit.status)}>
                            {deposit.status === 'completed' ? 'Completado' :
                             deposit.status === 'processing' ? 'Procesando' :
                             deposit.status === 'pending' ? 'Pendiente' : 'Fallido'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shredding Tab */}
        <TabsContent value="shredding" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Destrucción de Documentos</CardTitle>
                  <CardDescription>
                    Destrucción segura de documentos confidenciales
                  </CardDescription>
                </div>
                <Button onClick={() => setShowShreddingDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Solicitud
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shreddingRequests.map((request) => (
                  <Card key={request.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <Shield className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {request.weight} lbs • {request.type}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(request.date, 'MMM dd, yyyy', { locale: es })}
                            </p>
                            <p className="text-sm text-muted-foreground">{request.instructions}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status === 'completed' ? 'Completado' :
                             request.status === 'scheduled' ? 'Programado' : 'Pendiente'}
                          </Badge>
                          <p className="text-sm font-medium">${request.cost.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forwarding Tab */}
        <TabsContent value="forwarding" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reglas de Reenvío</CardTitle>
                  <CardDescription>
                    Configura el procesamiento automático de correo por remitente
                  </CardDescription>
                </div>
                <Button onClick={() => setShowForwardingDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Regla
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mailForwardingRules.map((rule) => (
                  <Card key={rule.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Truck className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{rule.sender}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {rule.action} → {rule.destination || 'Destruir'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(rule.priority)}>
                            {rule.priority}
                          </Badge>
                          <Switch checked={rule.active} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Returns Tab */}
        <TabsContent value="returns" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Devoluciones de Paquetes</CardTitle>
                  <CardDescription>
                    Gestiona devoluciones de paquetes recibidos
                  </CardDescription>
                </div>
                <Button onClick={() => setShowReturnDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Devolución
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnPackages.map((returnPkg) => (
                  <Card key={returnPkg.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Package className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {returnPkg.originalPackage} → {returnPkg.returnAddress}
                            </p>
                            <p className="text-sm text-muted-foreground">{returnPkg.reason}</p>
                            {returnPkg.trackingNumber && (
                              <p className="text-sm text-muted-foreground">
                                Tracking: {returnPkg.trackingNumber}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(returnPkg.status)}>
                            {returnPkg.status === 'delivered' ? 'Entregado' :
                             returnPkg.status === 'shipped' ? 'Enviado' :
                             returnPkg.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                          </Badge>
                          <p className="text-sm font-medium">${returnPkg.cost.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs will be implemented in the next part */}
    </div>
  );
} 