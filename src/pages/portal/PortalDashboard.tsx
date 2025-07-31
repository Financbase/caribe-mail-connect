import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  Search,
  Calendar,
  Navigation,
  QrCode,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Calendar as CalendarIcon,
  DollarSign,
  TrendingUp,
  Star,
  Crown,
  Gift,
  MessageCircle,
  Settings,
  Bell,
  CreditCard,
  Users,
  FileText,
  Camera,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Shield,
  Zap,
  Target,
  Award,
  Heart,
  Sparkles,
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Smartphone,
  Tablet,
  Monitor,
  Watch,
  Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

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

interface PortalDashboardProps {
  customerData: CustomerData;
  onNavigate: (page: string) => void;
}

interface Package {
  id: string;
  tracking_number: string;
  carrier: string;
  customer_name: string;
  size: string;
  status: string;
  received_at: string;
  delivered_at?: string;
  special_handling: boolean;
  requires_signature: boolean;
  notes?: string;
  value?: number;
  weight?: number;
}

interface SpendingData {
  month: string;
  amount: number;
  packages: number;
  services: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  type: 'discount' | 'service' | 'product';
  value: string;
  available: boolean;
}

interface LoyaltyData {
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextTier: number;
  progress: number;
  benefits: string[];
  rewards: Reward[];
}

interface DeliveryPreference {
  id: string;
  type: 'time' | 'location' | 'instructions';
  value: string;
  priority: 'high' | 'medium' | 'low';
  active: boolean;
}

interface VirtualAssistantMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function PortalDashboard({ customerData, onNavigate }: PortalDashboardProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showVirtualAssistant, setShowVirtualAssistant] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<VirtualAssistantMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showPWAInstall, setShowPWAInstall] = useState(false);
  const [showPushNotification, setShowPushNotification] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for enhanced features
  const spendingData: SpendingData[] = [
    { month: 'Ene', amount: 125, packages: 8, services: 3 },
    { month: 'Feb', amount: 98, packages: 6, services: 2 },
    { month: 'Mar', amount: 156, packages: 10, services: 4 },
    { month: 'Abr', amount: 142, packages: 9, services: 3 },
    { month: 'May', amount: 189, packages: 12, services: 5 },
    { month: 'Jun', amount: 167, packages: 11, services: 4 },
  ];

  const loyaltyData: LoyaltyData = {
    points: 2847,
    tier: 'gold',
    nextTier: 3000,
    progress: 85,
    benefits: [
      'Entrega gratuita en 24h',
      'Escaneo de correo prioritario',
      'Soporte VIP',
      'Descuentos exclusivos'
    ],
    rewards: [
      { id: 1, name: 'Entrega gratuita', pointsRequired: 500, type: 'service', value: 'Entrega gratuita', available: true },
      { id: 2, name: 'Escaneo de documento', pointsRequired: 200, type: 'service', value: 'Escaneo de documento', available: true },
      { id: 3, name: 'Descuento 10%', pointsRequired: 1000, type: 'discount', value: '10% de descuento', available: false },
    ]
  };

  const deliveryPreferences: DeliveryPreference[] = [
    { id: '1', type: 'time', value: '18:00 - 20:00', priority: 'high', active: true },
    { id: '2', type: 'location', value: 'Puerta principal', priority: 'medium', active: true },
    { id: '3', type: 'instructions', value: 'Llamar antes de entregar', priority: 'low', active: false },
  ];

  useEffect(() => {
    if (customerData) {
      fetchPackages();
      checkOnlineStatus();
      checkPWAInstallation();
      initializeVirtualAssistant();
    }
  }, [customerData]);

  useEffect(() => {
    scrollToBottom();
  }, [assistantMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('customer_id', customerData.id)
        .order('received_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar sus paquetes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPackages();
    setRefreshing(false);
    toast({
      title: 'Actualizado',
      description: 'Lista de paquetes actualizada',
    });
  };

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

  const initializeVirtualAssistant = () => {
    setAssistantMessages([
      {
        id: '1',
        type: 'assistant',
        content: '¡Hola! Soy tu asistente virtual de PRMCMS. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
      }
    ]);
  };

  const handleAssistantMessage = async (message: string) => {
    const userMessage: VirtualAssistantMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setAssistantMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Entiendo tu consulta. Déjame verificar esa información para ti.',
        'Te ayudo con eso. ¿Podrías proporcionarme más detalles?',
        'Perfecto, puedo ayudarte con esa solicitud.',
        'He procesado tu solicitud. ¿Hay algo más en lo que pueda asistirte?'
      ];
      
      const assistantMessage: VirtualAssistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setAssistantMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        handleAssistantMessage('Necesito ayuda con mi paquete');
        setIsListening(false);
      }, 2000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'received': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready for pickup': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in transit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'received': return <Package className="h-4 w-4" />;
      case 'ready for pickup': return <CheckCircle className="h-4 w-4" />;
      case 'delivered': return <Truck className="h-4 w-4" />;
      case 'in transit': return <Navigation className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'received': return 'Recibido';
      case 'ready for pickup': return 'Listo para recoger';
      case 'delivered': return 'Entregado';
      case 'in transit': return 'En tránsito';
      default: return status;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return <Star className="h-4 w-4" />;
      case 'silver': return <Star className="h-4 w-4" />;
      case 'gold': return <Crown className="h-4 w-4" />;
      case 'platinum': return <Sparkles className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSpending = spendingData.reduce((sum, item) => sum + item.amount, 0);
  const averageSpending = totalSpending / spendingData.length;
  const totalPackages = packages.length;
  const pendingPackages = packages.filter(pkg => pkg.status === 'received' || pkg.status === 'ready for pickup').length;

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
                  <p className="text-sm text-blue-700">Accede más rápido desde tu pantalla de inicio</p>
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
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Activar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Panel de Cliente Premium</h1>
          <p className="text-muted-foreground">Bienvenido de vuelta, {customerData?.name || 'Cliente'}</p>
        </div>
        <div className="flex items-center space-x-4">
          {isOffline && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <WifiOff className="h-3 w-3 mr-1" />
              Modo Offline
            </Badge>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowVirtualAssistant(true)}
            className="relative"
          >
            <Bot className="h-4 w-4" />
            {assistantMessages.length > 1 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                {assistantMessages.length - 1}
              </Badge>
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Loyalty Program Status */}
      <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-yellow-900">Programa de Lealtad</h3>
                  <Badge className={getTierColor(loyaltyData.tier)}>
                    {getTierIcon(loyaltyData.tier)}
                    <span className="ml-1 capitalize">{loyaltyData.tier}</span>
                  </Badge>
                </div>
                <p className="text-sm text-yellow-700">{loyaltyData.points} puntos acumulados</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Progress value={loyaltyData.progress} className="w-32" />
                  <span className="text-xs text-yellow-600">
                    {loyaltyData.nextTier - loyaltyData.points} puntos para {loyaltyData.tier === 'gold' ? 'Platinum' : 'Siguiente nivel'}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => onNavigate('loyalty')}>
              Ver Beneficios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="packages">Paquetes</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Gasto Mensual</span>
                </div>
                <p className="text-2xl font-bold">${averageSpending.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Promedio</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Paquetes Totales</span>
                </div>
                <p className="text-2xl font-bold">{totalPackages}</p>
                <p className="text-xs text-muted-foreground">Este año</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Pendientes</span>
                </div>
                <p className="text-2xl font-bold">{pendingPackages}</p>
                <p className="text-xs text-muted-foreground">Por recoger</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Eficiencia</span>
                </div>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-muted-foreground">Entrega a tiempo</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPackages.slice(0, 5).map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(pkg.status)}
                      <div>
                        <p className="font-medium">{pkg.tracking_number}</p>
                        <p className="text-sm text-muted-foreground">{pkg.carrier}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(pkg.status)}>
                        {getStatusLabel(pkg.status)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(pkg.received_at), 'MMM dd', { locale: es })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Spending Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Gastos</CardTitle>
              <CardDescription>Tu historial de gastos en los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Package Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Paquetes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Recibidos', value: packages.filter(p => p.status === 'received').length },
                        { name: 'Entregados', value: packages.filter(p => p.status === 'delivered').length },
                        { name: 'En Tránsito', value: packages.filter(p => p.status === 'in transit').length },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Servicios Utilizados</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={spendingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="services" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar paquetes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={() => onNavigate('packages')}>
                  Ver Todos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Package List */}
          <div className="space-y-4">
            {filteredPackages.slice(0, 10).map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getStatusIcon(pkg.status)}
                      </div>
                      <div>
                        <p className="font-medium">{pkg.tracking_number}</p>
                        <p className="text-sm text-muted-foreground">{pkg.carrier} • {pkg.size}</p>
                        <p className="text-xs text-muted-foreground">
                          Recibido: {format(new Date(pkg.received_at), 'MMM dd, yyyy', { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(pkg.status)}>
                        {getStatusLabel(pkg.status)}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => onNavigate(`packages/${pkg.id}`)}>
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          {/* Delivery Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Entrega</CardTitle>
              <CardDescription>Configura cómo prefieres recibir tus paquetes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryPreferences.map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {pref.type === 'time' && <Clock className="h-4 w-4 text-blue-600" />}
                        {pref.type === 'location' && <MapPin className="h-4 w-4 text-blue-600" />}
                        {pref.type === 'instructions' && <FileText className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{pref.value}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {pref.type} • Prioridad {pref.priority}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={pref.active ? 'default' : 'secondary'}>
                        {pref.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Preferencia
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones IA</CardTitle>
              <CardDescription>Basado en tu historial de paquetes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Optimizar horarios de entrega</p>
                    <p className="text-sm text-muted-foreground">
                      Basado en tu patrón, te recomendamos horarios de 18:00-20:00
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Consolidar envíos</p>
                    <p className="text-sm text-muted-foreground">
                      Puedes ahorrar 15% consolidando múltiples paquetes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mail Scanning */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('mail-scanning')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Escaneo de Correo</h3>
                    <p className="text-sm text-muted-foreground">Digitaliza tu correo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Check Deposit */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('check-deposit')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Depósito de Cheques</h3>
                    <p className="text-sm text-muted-foreground">Deposita cheques digitalmente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Shredding */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('shredding')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Destrucción de Documentos</h3>
                    <p className="text-sm text-muted-foreground">Destrucción segura</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mail Forwarding */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('mail-forwarding')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Reenvío de Correo</h3>
                    <p className="text-sm text-muted-foreground">Configura reenvíos automáticos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Package Returns */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('package-returns')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Package className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Devoluciones</h3>
                    <p className="text-sm text-muted-foreground">Gestiona devoluciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Family Access */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('family-access')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Users className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Acceso Familiar</h3>
                    <p className="text-sm text-muted-foreground">Gestiona acceso familiar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Virtual Assistant Dialog */}
      <Dialog open={showVirtualAssistant} onOpenChange={setShowVirtualAssistant}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Asistente Virtual</span>
            </DialogTitle>
            <DialogDescription>
              ¿En qué puedo ayudarte hoy?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Messages */}
            <div className="h-64 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-lg">
              {assistantMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {format(message.timestamp, 'HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Escribe tu mensaje..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleAssistantMessage(e.currentTarget.value.trim());
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                size="icon"
                variant={isListening ? 'default' : 'outline'}
                onClick={toggleVoiceInput}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}