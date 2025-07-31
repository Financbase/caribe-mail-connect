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
  Smartphone, 
  Fingerprint, 
  Camera, 
  Zap, 
  Wifi,
  WifiOff,
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
  Star,
  Crown,
  Gift,
  MessageCircle,
  Mail,
  Tablet,
  Monitor,
  Watch,
  Volume2,
  VolumeX,
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
  Shield,
  Zap as Lightning,
  Target,
  Sparkles,
  Palette,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Smartphone as Mobile,
  Tablet as TabletIcon,
  Monitor as Desktop,
  Watch as WatchIcon,
  Smartphone as PhoneIcon,
  Mail as EmailIcon,
  MessageSquare as ChatIcon,
  PhoneCall as CallIcon,
  Video as VideoIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Headphones as HeadphonesIcon,
  Speaker as SpeakerIcon,
  Vibrate as VibrateIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  Cloud as CloudIcon,
  CloudRain as RainIcon,
  CloudSnow as SnowIcon,
  Wind as WindIcon,
  Thermometer as TempIcon,
  Droplets as HumidityIcon,
  Umbrella as UmbrellaIcon
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

interface PortalMobileFeaturesProps {
  customerData: CustomerData;
  onNavigate: (page: string) => void;
}

interface BiometricAuth {
  type: 'fingerprint' | 'face' | 'voice';
  enabled: boolean;
  lastUsed: Date;
  device: string;
  status: 'active' | 'disabled' | 'error';
}

interface PackagePhoto {
  id: string;
  packageId: string;
  url: string;
  thumbnail: string;
  takenAt: Date;
  type: 'received' | 'damaged' | 'delivered' | 'return';
  description?: string;
}

interface OneTapAction {
  id: string;
  name: string;
  icon: string;
  action: string;
  enabled: boolean;
  usage: number;
  lastUsed: Date;
}

interface OfflineData {
  packages: number;
  documents: number;
  photos: number;
  lastSync: Date;
  syncStatus: 'synced' | 'syncing' | 'error';
  storageUsed: number;
  storageLimit: number;
}

interface Widget {
  id: string;
  name: string;
  type: 'package_status' | 'quick_actions' | 'notifications' | 'loyalty_points';
  enabled: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
}

export default function PortalMobileFeatures({ customerData, onNavigate }: PortalMobileFeaturesProps) {
  const [activeTab, setActiveTab] = useState('biometric');
  const [showBiometricDialog, setShowBiometricDialog] = useState(false);
  const [showPhotoGalleryDialog, setShowPhotoGalleryDialog] = useState(false);
  const [showOneTapDialog, setShowOneTapDialog] = useState(false);
  const [showWidgetDialog, setShowWidgetDialog] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  // Mock data for mobile features
  const biometricAuths: BiometricAuth[] = [
    {
      type: 'fingerprint',
      enabled: true,
      lastUsed: new Date('2024-12-18T10:30:00'),
      device: 'iPhone 15 Pro',
      status: 'active'
    },
    {
      type: 'face',
      enabled: true,
      lastUsed: new Date('2024-12-18T09:15:00'),
      device: 'iPhone 15 Pro',
      status: 'active'
    },
    {
      type: 'voice',
      enabled: false,
      lastUsed: new Date('2024-12-15T14:20:00'),
      device: 'iPhone 15 Pro',
      status: 'disabled'
    }
  ];

  const packagePhotos: PackagePhoto[] = [
    {
      id: '1',
      packageId: 'PKG001',
      url: '/api/photos/pkg001-received.jpg',
      thumbnail: '/api/photos/pkg001-received-thumb.jpg',
      takenAt: new Date('2024-12-18T08:30:00'),
      type: 'received',
      description: 'Paquete recibido en buen estado'
    },
    {
      id: '2',
      packageId: 'PKG002',
      url: '/api/photos/pkg002-damaged.jpg',
      thumbnail: '/api/photos/pkg002-damaged-thumb.jpg',
      takenAt: new Date('2024-12-17T16:45:00'),
      type: 'damaged',
      description: 'Esquina dañada durante el transporte'
    },
    {
      id: '3',
      packageId: 'PKG003',
      url: '/api/photos/pkg003-delivered.jpg',
      thumbnail: '/api/photos/pkg003-delivered-thumb.jpg',
      takenAt: new Date('2024-12-16T12:20:00'),
      type: 'delivered',
      description: 'Entrega exitosa en puerta principal'
    }
  ];

  const oneTapActions: OneTapAction[] = [
    {
      id: '1',
      name: 'Marcar como Recibido',
      icon: 'CheckCircle',
      action: 'mark_received',
      enabled: true,
      usage: 45,
      lastUsed: new Date('2024-12-18T10:30:00')
    },
    {
      id: '2',
      name: 'Solicitar Entrega',
      icon: 'Truck',
      action: 'request_delivery',
      enabled: true,
      usage: 23,
      lastUsed: new Date('2024-12-17T15:20:00')
    },
    {
      id: '3',
      name: 'Reportar Problema',
      icon: 'AlertCircle',
      action: 'report_issue',
      enabled: true,
      usage: 8,
      lastUsed: new Date('2024-12-16T09:15:00')
    },
    {
      id: '4',
      name: 'Escanear Código',
      icon: 'Camera',
      action: 'scan_code',
      enabled: false,
      usage: 12,
      lastUsed: new Date('2024-12-15T14:30:00')
    }
  ];

  const offlineData: OfflineData = {
    packages: 15,
    documents: 8,
    photos: 23,
    lastSync: new Date('2024-12-18T10:30:00'),
    syncStatus: 'synced',
    storageUsed: 45.2,
    storageLimit: 100
  };

  const widgets: Widget[] = [
    {
      id: '1',
      name: 'Estado de Paquetes',
      type: 'package_status',
      enabled: true,
      position: 1,
      size: 'medium'
    },
    {
      id: '2',
      name: 'Acciones Rápidas',
      type: 'quick_actions',
      enabled: true,
      position: 2,
      size: 'small'
    },
    {
      id: '3',
      name: 'Notificaciones',
      type: 'notifications',
      enabled: false,
      position: 3,
      size: 'large'
    },
    {
      id: '4',
      name: 'Puntos de Lealtad',
      type: 'loyalty_points',
      enabled: true,
      position: 4,
      size: 'small'
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

  const getBiometricIcon = (type: string) => {
    switch (type) {
      case 'fingerprint': return <Fingerprint className="h-4 w-4" />;
      case 'face': return <UserCheck className="h-4 w-4" />;
      case 'voice': return <Mic className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'disabled': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'synced': return 'bg-green-100 text-green-800 border-green-200';
      case 'syncing': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPhotoTypeColor = (type: string) => {
    switch (type) {
      case 'received': return 'bg-green-100 text-green-800 border-green-200';
      case 'damaged': return 'bg-red-100 text-red-800 border-red-200';
      case 'delivered': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'return': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWidgetTypeIcon = (type: string) => {
    switch (type) {
      case 'package_status': return <Package className="h-4 w-4" />;
      case 'quick_actions': return <Zap className="h-4 w-4" />;
      case 'notifications': return <Bell className="h-4 w-4" />;
      case 'loyalty_points': return <Star className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Características Móviles</h1>
          <p className="text-muted-foreground">Configura las funciones avanzadas de la app móvil</p>
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
          <TabsTrigger value="biometric">Biométrico</TabsTrigger>
          <TabsTrigger value="photos">Galería</TabsTrigger>
          <TabsTrigger value="one-tap">Acciones Rápidas</TabsTrigger>
          <TabsTrigger value="offline">Modo Offline</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
        </TabsList>

        {/* Biometric Authentication Tab */}
        <TabsContent value="biometric" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Autenticación Biométrica</CardTitle>
                  <CardDescription>
                    Configura métodos de autenticación seguros
                  </CardDescription>
                </div>
                <Button onClick={() => setShowBiometricDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Método
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {biometricAuths.map((auth) => (
                  <Card key={auth.type} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getBiometricIcon(auth.type)}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{auth.type}</p>
                            <p className="text-sm text-muted-foreground">{auth.device}</p>
                            <p className="text-xs text-muted-foreground">
                              Último uso: {format(auth.lastUsed, 'MMM dd, HH:mm', { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(auth.status)}>
                            {auth.status === 'active' ? 'Activo' :
                             auth.status === 'disabled' ? 'Deshabilitado' : 'Error'}
                          </Badge>
                          <Switch checked={auth.enabled} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photo Gallery Tab */}
        <TabsContent value="photos" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Galería de Fotos</CardTitle>
                  <CardDescription>
                    Fotos de tus paquetes y entregas
                  </CardDescription>
                </div>
                <Button onClick={() => setShowPhotoGalleryDialog(true)}>
                  <Camera className="h-4 w-4 mr-2" />
                  Tomar Foto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packagePhotos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <div className="aspect-square bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                      <Badge className="absolute top-2 right-2" className={getPhotoTypeColor(photo.type)}>
                        {photo.type === 'received' ? 'Recibido' :
                         photo.type === 'damaged' ? 'Dañado' :
                         photo.type === 'delivered' ? 'Entregado' : 'Devolución'}
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium text-sm">{photo.packageId}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(photo.takenAt, 'MMM dd, HH:mm', { locale: es })}
                      </p>
                      {photo.description && (
                        <p className="text-xs text-muted-foreground mt-1">{photo.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* One-Tap Actions Tab */}
        <TabsContent value="one-tap" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Acciones de Un Toque</CardTitle>
                  <CardDescription>
                    Acciones rápidas para uso frecuente
                  </CardDescription>
                </div>
                <Button onClick={() => setShowOneTapDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Acción
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {oneTapActions.map((action) => (
                  <Card key={action.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Zap className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{action.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Usado {action.usage} veces
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Último uso: {format(action.lastUsed, 'MMM dd, HH:mm', { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch checked={action.enabled} />
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

        {/* Offline Mode Tab */}
        <TabsContent value="offline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modo Offline</CardTitle>
              <CardDescription>
                Datos disponibles sin conexión a internet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Storage Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Almacenamiento</p>
                    <p className="text-sm text-muted-foreground">
                      {offlineData.storageUsed.toFixed(1)}GB / {offlineData.storageLimit}GB
                    </p>
                  </div>
                  <Progress 
                    value={(offlineData.storageUsed / offlineData.storageLimit) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Data Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Paquetes</span>
                      </div>
                      <p className="text-2xl font-bold">{offlineData.packages}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Documentos</span>
                      </div>
                      <p className="text-2xl font-bold">{offlineData.documents}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Camera className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Fotos</span>
                      </div>
                      <p className="text-2xl font-bold">{offlineData.photos}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Sync Status */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Wifi className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Estado de Sincronización</p>
                          <p className="text-sm text-muted-foreground">
                            Última sincronización: {format(offlineData.lastSync, 'MMM dd, HH:mm', { locale: es })}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(offlineData.syncStatus)}>
                        {offlineData.syncStatus === 'synced' ? 'Sincronizado' :
                         offlineData.syncStatus === 'syncing' ? 'Sincronizando' : 'Error'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Widgets Tab */}
        <TabsContent value="widgets" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Widgets del Sistema</CardTitle>
                  <CardDescription>
                    Configura widgets para tu pantalla de inicio
                  </CardDescription>
                </div>
                <Button onClick={() => setShowWidgetDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Widget
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {widgets.map((widget) => (
                  <Card key={widget.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            {getWidgetTypeIcon(widget.type)}
                          </div>
                          <div>
                            <p className="font-medium">{widget.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              Tamaño: {widget.size} • Posición: {widget.position}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {widget.size}
                          </Badge>
                          <Switch checked={widget.enabled} />
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
      </Tabs>

      {/* Dialogs will be implemented in the next part */}
    </div>
  );
} 