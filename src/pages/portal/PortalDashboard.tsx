import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Calendar as CalendarIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PortalDashboardProps {
  customerData: unknown;
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
}

export default function PortalDashboard({ customerData, onNavigate }: PortalDashboardProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (customerData) {
      fetchPackages();
    }
  }, [customerData]);

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
      case 'received': return <Package className="w-4 h-4" />;
      case 'ready for pickup': return <CheckCircle className="w-4 h-4" />;
      case 'delivered': return <Truck className="w-4 h-4" />;
      case 'in transit': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'received': return 'Recibido';
      case 'ready for pickup': return 'Listo para Recoger';
      case 'delivered': return 'Entregado';
      case 'in transit': return 'En Tránsito';
      default: return status;
    }
  };

  const openDirections = () => {
    // Example location - replace with actual mail center coordinates
    const mapsUrl = `https://maps.google.com/?q=Centro+de+Correo+PRMCMS,+San+Juan,+PR`;
    window.open(mapsUrl, '_blank');
  };

  const showQRCode = () => {
    toast({
      title: 'Código QR',
      description: 'Muestre este código al personal para check-in rápido',
    });
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.carrier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePackages = filteredPackages.filter(pkg => 
    !['delivered'].includes(pkg.status.toLowerCase())
  );

  const recentPackages = filteredPackages.filter(pkg => 
    ['delivered'].includes(pkg.status.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Bienvenido, {customerData?.first_name}
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Buzón: {customerData?.mailbox_number || 'No asignado'}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white/50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              size="sm"
              onClick={openDirections}
              className="bg-primary/90"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Cómo Llegar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={showQRCode}
              className="bg-white/50"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Check-in QR
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por número de seguimiento o transportista..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Active Packages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Paquetes Activos</h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {activePackages.length}
          </Badge>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : activePackages.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No hay paquetes activos</p>
              <p className="text-sm text-muted-foreground mt-1">
                Sus nuevos paquetes aparecerán aquí
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {activePackages.map((pkg) => (
              <Card key={pkg.id} className="border-l-4 border-l-primary/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">#{pkg.tracking_number}</p>
                      <p className="text-xs text-muted-foreground">{pkg.carrier}</p>
                    </div>
                    <Badge className={getStatusColor(pkg.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(pkg.status)}
                        <span>{getStatusLabel(pkg.status)}</span>
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>
                        {format(new Date(pkg.received_at), 'dd MMM yyyy', { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="w-3 h-3" />
                      <span>{pkg.size}</span>
                    </div>
                  </div>

                  {pkg.special_handling && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        Manejo Especial
                      </Badge>
                    </div>
                  )}

                  {pkg.notes && (
                    <p className="text-xs text-muted-foreground mt-2 bg-accent/10 p-2 rounded">
                      {pkg.notes}
                    </p>
                  )}

                  {pkg.status.toLowerCase() === 'ready for pickup' && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          ¡Listo para recoger!
                        </span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        Horario: Lun-Vie 8:00 AM - 6:00 PM, Sáb 9:00 AM - 2:00 PM
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Deliveries */}
      {recentPackages.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Entregas Recientes</h2>
          <div className="space-y-2">
            {recentPackages.map((pkg) => (
              <Card key={pkg.id} className="bg-gray-50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">#{pkg.tracking_number}</p>
                      <p className="text-xs text-muted-foreground">{pkg.carrier}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(pkg.status)}>
                        {getStatusLabel(pkg.status)}
                      </Badge>
                      {pkg.delivered_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(pkg.delivered_at), 'dd MMM', { locale: es })}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-auto py-3 flex-col"
              onClick={() => onNavigate('notifications')}
            >
              <Clock className="w-5 h-5 mb-1" />
              <span className="text-xs">Programar Recogida</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-3 flex-col"
              onClick={() => onNavigate('documents')}
            >
              <MapPin className="w-5 h-5 mb-1" />
              <span className="text-xs">Retener Correo</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-3 flex-col"
              onClick={() => onNavigate('notifications')}
            >
              <Package className="w-5 h-5 mb-1" />
              <span className="text-xs">Avisos</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-3 flex-col"
              onClick={() => onNavigate('documents')}
            >
              <Truck className="w-5 h-5 mb-1" />
              <span className="text-xs">Documentos</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}