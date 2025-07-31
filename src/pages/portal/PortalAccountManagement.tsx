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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Building, 
  CreditCard, 
  FileText, 
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
  Umbrella as Stormy,
  Bell,
  Settings,
  Plus,
  X,
  Clock,
  MapPin,
  Package,
  Truck,
  Calendar as CalendarIcon,
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
  DollarSign,
  TrendingUp,
  Shield,
  UserCheck,
  UserX,
  UserPlus,
  UserMinus,
  UserCog,
  UserEdit,
  UserSearch,
  UserSettings,
  UserShield,
  UserStar,
  UserCheck as Admin,
  UserX as Guest,
  UserPlus as Invite,
  UserMinus as Remove,
  UserCog as Manage,
  UserEdit as EditUser,
  UserSearch as SearchUser,
  UserSettings as UserSettingsIcon,
  UserShield as Security,
  UserStar as VIP
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

interface PortalAccountManagementProps {
  customerData: CustomerData;
  onNavigate: (page: string) => void;
}

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  permissions: string[];
  lastActive: Date;
  avatar?: string;
  status: 'active' | 'pending' | 'suspended';
}

interface BusinessAccount {
  id: string;
  name: string;
  type: 'individual' | 'llc' | 'corporation' | 'partnership';
  taxId: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: 'active' | 'pending' | 'suspended';
  features: string[];
}

interface SpendingLimit {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  amount: number;
  current: number;
  resetDate: Date;
  active: boolean;
}

interface AutomaticPayment {
  id: string;
  method: 'credit_card' | 'bank_transfer' | 'paypal';
  account: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  nextPayment: Date;
  active: boolean;
}

interface TaxDocument {
  id: string;
  year: number;
  type: '1099' | 'w2' | 'schedule_c' | 'other';
  status: 'available' | 'processing' | 'unavailable';
  downloadUrl?: string;
  generatedDate?: Date;
}

export default function PortalAccountManagement({ customerData, onNavigate }: PortalAccountManagementProps) {
  const [activeTab, setActiveTab] = useState('family-access');
  const [showFamilyMemberDialog, setShowFamilyMemberDialog] = useState(false);
  const [showBusinessAccountDialog, setShowBusinessAccountDialog] = useState(false);
  const [showSpendingLimitDialog, setShowSpendingLimitDialog] = useState(false);
  const [showAutomaticPaymentDialog, setShowAutomaticPaymentDialog] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  // Mock data for account management
  const familyMembers: FamilyMember[] = [
    {
      id: '1',
      name: 'María González',
      email: 'maria@email.com',
      role: 'admin',
      permissions: ['view_packages', 'manage_account', 'view_billing'],
      lastActive: new Date('2024-12-18'),
      status: 'active'
    },
    {
      id: '2',
      name: 'Carlos González',
      email: 'carlos@email.com',
      role: 'member',
      permissions: ['view_packages', 'view_billing'],
      lastActive: new Date('2024-12-17'),
      status: 'active'
    },
    {
      id: '3',
      name: 'Ana González',
      email: 'ana@email.com',
      role: 'viewer',
      permissions: ['view_packages'],
      lastActive: new Date('2024-12-15'),
      status: 'pending'
    }
  ];

  const businessAccounts: BusinessAccount[] = [
    {
      id: '1',
      name: 'González Consulting LLC',
      type: 'llc',
      taxId: '12-3456789',
      address: '123 Calle Principal, San Juan, PR 00901',
      contactPerson: 'Juan González',
      phone: '+1-787-555-0123',
      email: 'juan@gonzalezconsulting.com',
      status: 'active',
      features: ['bulk_shipping', 'api_access', 'priority_support', 'custom_billing']
    }
  ];

  const spendingLimits: SpendingLimit[] = [
    {
      id: '1',
      type: 'monthly',
      amount: 500,
      current: 342.50,
      resetDate: new Date('2025-01-01'),
      active: true
    },
    {
      id: '2',
      type: 'daily',
      amount: 50,
      current: 12.75,
      resetDate: new Date('2024-12-19'),
      active: true
    }
  ];

  const automaticPayments: AutomaticPayment[] = [
    {
      id: '1',
      method: 'credit_card',
      account: '****1234',
      amount: 100,
      frequency: 'monthly',
      nextPayment: new Date('2025-01-01'),
      active: true
    }
  ];

  const taxDocuments: TaxDocument[] = [
    {
      id: '1',
      year: 2024,
      type: '1099',
      status: 'available',
      generatedDate: new Date('2024-12-15')
    },
    {
      id: '2',
      year: 2023,
      type: '1099',
      status: 'available',
      generatedDate: new Date('2024-01-15')
    },
    {
      id: '3',
      year: 2024,
      type: 'schedule_c',
      status: 'processing'
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'member': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewer': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'llc': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'corporation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'partnership': return 'bg-green-100 text-green-800 border-green-200';
      case 'individual': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unavailable': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Admin className="h-4 w-4" />;
      case 'member': return <UserCheck className="h-4 w-4" />;
      case 'viewer': return <Guest className="h-4 w-4" />;
      default: return <UserSettingsIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Cuenta</h1>
          <p className="text-muted-foreground">Administra tu cuenta y configuraciones</p>
        </div>
        <div className="flex items-center space-x-4">
          {isOffline && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <WifiOff className="h-3 w-3 mr-1" />
              Modo Offline
            </Badge>
          )}
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="family-access">Acceso Familiar</TabsTrigger>
          <TabsTrigger value="business-account">Cuenta Empresarial</TabsTrigger>
          <TabsTrigger value="spending-limits">Límites de Gasto</TabsTrigger>
          <TabsTrigger value="automatic-payments">Pagos Automáticos</TabsTrigger>
          <TabsTrigger value="tax-documents">Documentos Fiscales</TabsTrigger>
        </TabsList>

        {/* Family Access Tab */}
        <TabsContent value="family-access" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Acceso Familiar</CardTitle>
                  <CardDescription>
                    Gestiona el acceso de miembros de tu familia a tu cuenta
                  </CardDescription>
                </div>
                <Button onClick={() => setShowFamilyMemberDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invitar Miembro
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {familyMembers.map((member) => (
                  <Card key={member.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Último acceso: {format(member.lastActive, 'MMM dd, HH:mm', { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getRoleColor(member.role)}>
                            {getRoleIcon(member.role)}
                            <span className="ml-1 capitalize">{member.role}</span>
                          </Badge>
                          <Badge className={getStatusColor(member.status)}>
                            {member.status === 'active' ? 'Activo' :
                             member.status === 'pending' ? 'Pendiente' : 'Suspendido'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <EditUser className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Account Tab */}
        <TabsContent value="business-account" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cuenta Empresarial</CardTitle>
                  <CardDescription>
                    Configura tu cuenta para uso empresarial
                  </CardDescription>
                </div>
                <Button onClick={() => setShowBusinessAccountDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Cuenta
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessAccounts.map((account) => (
                  <Card key={account.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Building className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {account.contactPerson} • {account.phone}
                            </p>
                            <p className="text-sm text-muted-foreground">{account.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getAccountTypeColor(account.type)}>
                            {account.type.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(account.status)}>
                            {account.status === 'active' ? 'Activo' :
                             account.status === 'pending' ? 'Pendiente' : 'Suspendido'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Características:</p>
                        <div className="flex flex-wrap gap-2">
                          {account.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spending Limits Tab */}
        <TabsContent value="spending-limits" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Límites de Gasto</CardTitle>
                  <CardDescription>
                    Configura límites para controlar tus gastos
                  </CardDescription>
                </div>
                <Button onClick={() => setShowSpendingLimitDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Límite
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spendingLimits.map((limit) => (
                  <Card key={limit.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <DollarSign className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium capitalize">{limit.type}</p>
                              <p className="text-sm text-muted-foreground">
                                ${limit.current.toFixed(2)} / ${limit.amount.toFixed(2)}
                              </p>
                            </div>
                            <Progress 
                              value={(limit.current / limit.amount) * 100} 
                              className="h-2"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Se reinicia: {format(limit.resetDate, 'MMM dd, yyyy', { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch checked={limit.active} />
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automatic Payments Tab */}
        <TabsContent value="automatic-payments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pagos Automáticos</CardTitle>
                  <CardDescription>
                    Configura pagos automáticos para tu cuenta
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAutomaticPaymentDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Pago
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automaticPayments.map((payment) => (
                  <Card key={payment.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CreditCard className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              ${payment.amount.toFixed(2)} • {payment.account}
                            </p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {payment.frequency} • {payment.method.replace('_', ' ')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Próximo pago: {format(payment.nextPayment, 'MMM dd, yyyy', { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch checked={payment.active} />
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Documents Tab */}
        <TabsContent value="tax-documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Documentos Fiscales</CardTitle>
                <CardDescription>
                  Descarga tus documentos fiscales anuales
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxDocuments.map((document) => (
                  <Card key={document.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {document.type.toUpperCase()} - {document.year}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Documento fiscal anual
                            </p>
                            {document.generatedDate && (
                              <p className="text-sm text-muted-foreground">
                                Generado: {format(document.generatedDate, 'MMM dd, yyyy', { locale: es })}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getDocumentStatusColor(document.status)}>
                            {document.status === 'available' ? 'Disponible' :
                             document.status === 'processing' ? 'Procesando' : 'No disponible'}
                          </Badge>
                          {document.status === 'available' && (
                            <Button size="sm">
                              <Download className="h-3 w-3 mr-1" />
                              Descargar
                            </Button>
                          )}
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