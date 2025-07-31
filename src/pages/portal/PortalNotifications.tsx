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
  Bell, 
  Clock, 
  MapPin, 
  Package, 
  Truck, 
  Calendar as CalendarIcon,
  Settings,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Users,
  Mail,
  Smartphone,
  Tablet,
  Monitor,
  Watch,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Send,
  Save,
  Edit,
  Trash2,
  Star,
  Crown,
  Gift,
  MessageCircle,
  FileText,
  Camera,
  CreditCard,
  Building,
  Home,
  Car,
  Plane,
  Ship,
  Train,
  Bus,
  Bike,
  
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Smartphone as Phone,
  Mail as Email,
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

interface PortalNotificationsProps {
  customerData: CustomerData;
  onNavigate: (page: string) => void;
}

interface NotificationPreference {
  id: string;
  type: 'email' | 'sms' | 'push' | 'in-app';
  category: 'delivery' | 'package' | 'billing' | 'security' | 'promotional';
  enabled: boolean;
  priority: 'high' | 'medium' | 'low';
  schedule?: {
    start: string;
    end: string;
    timezone: string;
  };
}

interface DeliveryWindow {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
  priority: 'preferred' | 'acceptable' | 'avoid';
}

interface AlternativeDelivery {
  id: string;
  type: 'neighbor' | 'locker' | 'office' | 'garage' | 'mailbox';
  address: string;
  instructions: string;
  enabled: boolean;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
}

interface VacationHold {
  id: string;
  startDate: Date;
  endDate: Date;
  instructions: string;
  autoResume: boolean;
  active: boolean;
}

interface SenderInstructions {
  sender: string;
  instructions: string;
  priority: 'high' | 'medium' | 'low';
  active: boolean;
}

interface ConsolidationRequest {
  id: string;
  packages: string[];
  requestedDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  savings: number;
  notes: string;
}

export default function PortalNotifications({ customerData, onNavigate }: PortalNotificationsProps) {
  const [activeTab, setActiveTab] = useState('preferences');
  const [showDeliveryWindowDialog, setShowDeliveryWindowDialog] = useState(false);
  const [showAlternativeDeliveryDialog, setShowAlternativeDeliveryDialog] = useState(false);
  const [showVacationHoldDialog, setShowVacationHoldDialog] = useState(false);
  const [showConsolidationDialog, setShowConsolidationDialog] = useState(false);
  const [showSenderInstructionsDialog, setShowSenderInstructionsDialog] = useState(false);
  const [showPWAInstall, setShowPWAInstall] = useState(false);
  const [showPushNotification, setShowPushNotification] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  // Mock data for enhanced features
  const notificationPreferences: NotificationPreference[] = [
    { id: '1', type: 'push', category: 'delivery', enabled: true, priority: 'high' },
    { id: '2', type: 'email', category: 'package', enabled: true, priority: 'medium' },
    { id: '3', type: 'sms', category: 'delivery', enabled: false, priority: 'high' },
    { id: '4', type: 'in-app', category: 'billing', enabled: true, priority: 'low' },
    { id: '5', type: 'email', category: 'promotional', enabled: false, priority: 'low' },
  ];

  const deliveryWindows: DeliveryWindow[] = [
    { id: '1', day: 'Lunes', startTime: '18:00', endTime: '20:00', enabled: true, priority: 'preferred' },
    { id: '2', day: 'Martes', startTime: '18:00', endTime: '20:00', enabled: true, priority: 'preferred' },
    { id: '3', day: 'Miércoles', startTime: '18:00', endTime: '20:00', enabled: true, priority: 'preferred' },
    { id: '4', day: 'Jueves', startTime: '18:00', endTime: '20:00', enabled: true, priority: 'preferred' },
    { id: '5', day: 'Viernes', startTime: '18:00', endTime: '20:00', enabled: true, priority: 'preferred' },
    { id: '6', day: 'Sábado', startTime: '09:00', endTime: '14:00', enabled: false, priority: 'acceptable' },
    { id: '7', day: 'Domingo', startTime: '09:00', endTime: '14:00', enabled: false, priority: 'avoid' },
  ];

  const alternativeDeliveries: AlternativeDelivery[] = [
    {
      id: '1',
      type: 'neighbor',
      address: 'Casa del vecino - María González',
      instructions: 'Entregar a María si no estoy en casa',
      enabled: true,
      contact: {
        name: 'María González',
        phone: '+1-787-555-0123',
        email: 'maria@email.com'
      }
    },
    {
      id: '2',
      type: 'locker',
      address: 'Locker #A15 - Centro Comercial Plaza',
      instructions: 'Usar código 1234 para acceso',
      enabled: false,
      contact: {
        name: 'Locker System',
        phone: '+1-787-555-0000',
        email: 'locker@plaza.com'
      }
    }
  ];

  const vacationHolds: VacationHold[] = [
    {
      id: '1',
      startDate: new Date('2024-12-20'),
      endDate: new Date('2024-12-27'),
      instructions: 'Retener todo el correo hasta el 27 de diciembre',
      autoResume: true,
      active: false
    }
  ];

  const senderInstructions: SenderInstructions[] = [
    {
      sender: 'Amazon',
      instructions: 'Entregar en la puerta principal, no en el buzón',
      priority: 'high',
      active: true
    },
    {
      sender: 'Walmart',
      instructions: 'Llamar antes de entregar',
      priority: 'medium',
      active: true
    }
  ];

  const consolidationRequests: ConsolidationRequest[] = [
    {
      id: '1',
      packages: ['PKG001', 'PKG002', 'PKG003'],
      requestedDate: new Date('2024-12-15'),
      status: 'approved',
      savings: 15.50,
      notes: 'Consolidar envíos de Amazon'
    }
  ];

  useEffect(() => {
    checkOnlineStatus();
    checkPWAInstallation();
  }, []);

  const checkOnlineStatus = () => {
    setIsOffline(!navigator.onLine);
    window.addEventListener('online', () => setIsOffline(false));
    window.addEventListener('offline', () => setIsOffline(true));
  };

  const checkPWAInstallation = () => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (!isInstalled && 'serviceWorker' in navigator) {
      setShowPWAInstall(true);
    }
  };

  const handleNotificationToggle = (id: string, enabled: boolean) => {
    toast({
      title: enabled ? 'Notificaciones activadas' : 'Notificaciones desactivadas',
      description: 'Tu preferencia ha sido guardada',
    });
  };

  const handlePushNotificationOptIn = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          toast({
            title: 'Notificaciones Push Activadas',
            description: 'Recibirás alertas instantáneas',
          });
          setShowPushNotification(false);
        }
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'push': return <Bell className="h-4 w-4" />;
      case 'in-app': return <MessageSquare className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'delivery': return <Truck className="h-4 w-4" />;
      case 'package': return <Package className="h-4 w-4" />;
      case 'billing': return <CreditCard className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'promotional': return <Gift className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getDeliveryTypeIcon = (type: string) => {
    switch (type) {
      case 'neighbor': return <Users className="h-4 w-4" />;
      case 'locker': return <Lock className="h-4 w-4" />;
      case 'office': return <Building className="h-4 w-4" />;
      case 'garage': return <Home className="h-4 w-4" />;
      case 'mailbox': return <Mail className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* PWA Install Prompt */}
      {showPWAInstall && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Download className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Instalar App</h3>
                  <p className="text-sm text-blue-700">Recibe notificaciones push instantáneas</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => setShowPWAInstall(false)} variant="outline">
                  Más tarde
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Instalar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Push Notification Opt-in */}
      {showPushNotification && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Notificaciones Push</h3>
                  <p className="text-sm text-green-700">Recibe alertas instantáneas sobre tus paquetes</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => setShowPushNotification(false)} variant="outline">
                  No gracias
                </Button>
                <Button size="sm" onClick={handlePushNotificationOptIn} className="bg-green-600 hover:bg-green-700">
                  Activar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notificaciones Avanzadas</h1>
          <p className="text-muted-foreground">Gestiona todas tus preferencias de notificaciones</p>
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          <TabsTrigger value="delivery-windows">Horarios</TabsTrigger>
          <TabsTrigger value="alternative-delivery">Entrega Alternativa</TabsTrigger>
          <TabsTrigger value="vacation-holds">Retención</TabsTrigger>
          <TabsTrigger value="consolidation">Consolidación</TabsTrigger>
          <TabsTrigger value="sender-instructions">Instrucciones</TabsTrigger>
        </TabsList>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>
                Configura cómo y cuándo recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationPreferences.map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getTypeIcon(pref.type)}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{pref.type}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {pref.category} • Prioridad {pref.priority}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(pref.priority)}>
                        {pref.priority}
                      </Badge>
                      <Switch
                        checked={pref.enabled}
                        onCheckedChange={(enabled) => handleNotificationToggle(pref.id, enabled)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferencias por Dispositivo</CardTitle>
              <CardDescription>
                Configura notificaciones específicas por dispositivo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Móvil</p>
                    <p className="text-sm text-muted-foreground">Notificaciones push</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Tablet className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Tablet</p>
                    <p className="text-sm text-muted-foreground">Notificaciones push</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Monitor className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Desktop</p>
                    <p className="text-sm text-muted-foreground">Notificaciones del navegador</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Windows Tab */}
        <TabsContent value="delivery-windows" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ventanas de Entrega</CardTitle>
                  <CardDescription>
                    Configura tus horarios preferidos de entrega
                  </CardDescription>
                </div>
                <Button onClick={() => setShowDeliveryWindowDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Horario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deliveryWindows.map((window) => (
                  <div key={window.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{window.day}</p>
                        <p className="text-sm text-muted-foreground">
                          {window.startTime} - {window.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={window.priority === 'preferred' ? 'default' : 'secondary'}>
                        {window.priority === 'preferred' ? 'Preferido' : 
                         window.priority === 'acceptable' ? 'Aceptable' : 'Evitar'}
                      </Badge>
                      <Switch checked={window.enabled} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alternative Delivery Tab */}
        <TabsContent value="alternative-delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Opciones de Entrega Alternativa</CardTitle>
                  <CardDescription>
                    Configura entregas cuando no estés en casa
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAlternativeDeliveryDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Opción
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alternativeDeliveries.map((delivery) => (
                  <Card key={delivery.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getDeliveryTypeIcon(delivery.type)}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{delivery.type}</p>
                            <p className="text-sm text-muted-foreground">{delivery.address}</p>
                            <p className="text-xs text-muted-foreground">{delivery.instructions}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Switch checked={delivery.enabled} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vacation Holds Tab */}
        <TabsContent value="vacation-holds" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Retención de Correo</CardTitle>
                  <CardDescription>
                    Programa retenciones cuando estés de vacaciones
                  </CardDescription>
                </div>
                <Button onClick={() => setShowVacationHoldDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Programar Retención
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vacationHolds.map((hold) => (
                  <Card key={hold.id} className={cn(
                    "border-l-4",
                    hold.active ? "border-l-green-500" : "border-l-gray-300"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <CalendarIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {format(hold.startDate, 'MMM dd', { locale: es })} - {format(hold.endDate, 'MMM dd, yyyy', { locale: es })}
                            </p>
                            <p className="text-sm text-muted-foreground">{hold.instructions}</p>
                            <p className="text-xs text-muted-foreground">
                              {hold.autoResume ? 'Reanudación automática' : 'Reanudación manual'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={hold.active ? 'default' : 'secondary'}>
                            {hold.active ? 'Activo' : 'Inactivo'}
                          </Badge>
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

        {/* Consolidation Tab */}
        <TabsContent value="consolidation" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Solicitudes de Consolidación</CardTitle>
                  <CardDescription>
                    Consolida múltiples paquetes para ahorrar en envíos
                  </CardDescription>
                </div>
                <Button onClick={() => setShowConsolidationDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Solicitud
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consolidationRequests.map((request) => (
                  <Card key={request.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Package className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              Paquetes: {request.packages.join(', ')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Solicitado: {format(request.requestedDate, 'MMM dd, yyyy', { locale: es })}
                            </p>
                            <p className="text-sm text-green-600 font-medium">
                              Ahorro estimado: ${request.savings.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {request.status === 'approved' ? 'Aprobado' : 
                             request.status === 'pending' ? 'Pendiente' : 
                             request.status === 'rejected' ? 'Rechazado' : 'Completado'}
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

        {/* Sender Instructions Tab */}
        <TabsContent value="sender-instructions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Instrucciones por Remitente</CardTitle>
                  <CardDescription>
                    Configura instrucciones específicas por remitente
                  </CardDescription>
                </div>
                <Button onClick={() => setShowSenderInstructionsDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Instrucción
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {senderInstructions.map((instruction, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{instruction.sender}</p>
                            <p className="text-sm text-muted-foreground">{instruction.instructions}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(instruction.priority)}>
                            {instruction.priority}
                          </Badge>
                          <Switch checked={instruction.active} />
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