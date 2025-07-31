import { useState } from 'react';
import { ArrowLeft, Plus, Calendar, Truck, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRoutes } from '@/hooks/useRoutes';
import { toast } from '@/hooks/use-toast';

// Route components
import { RouteMap } from '@/components/routes/RouteMap';
import { RouteList } from '@/components/routes/RouteList';

interface Route {
  id: string;
  name: string;
  driver_id?: string;
  vehicle_id?: string;
  start_location: string;
  end_location: string;
  estimated_duration: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface RoutesProps {
  onNavigate: (page: string) => void;
}

export default function Routes({ onNavigate }: RoutesProps) {
  const { t } = useLanguage();
  const { 
    routes, 
    deliveries, 
    drivers, 
    loading, 
    error,
    assignDriverToRoute,
    optimizeRoute
  } = useRoutes();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleAssignDriver = async (routeId: string, driverId: string) => {
    const result = await assignDriverToRoute(routeId, driverId);
    if (result.success) {
      toast({
        title: t('Driver Assigned'),
        description: t('Driver has been successfully assigned to the route'),
      });
    } else {
      toast({
        title: t('Error'),
        description: result.error || t('Failed to assign driver'),
        variant: 'destructive',
      });
    }
  };

  const handleOptimizeRoute = async (routeId: string) => {
    const result = await optimizeRoute(routeId);
    if (result.success) {
      toast({
        title: t('Route Optimized'),
        description: t('Route has been optimized for efficiency'),
      });
    } else {
      toast({
        title: t('Error'),
        description: result.error || t('Failed to optimize route'),
        variant: 'destructive',
      });
    }
  };

  const handleViewRoute = (route: Route) => {
    // Navigate to detailed route view
    console.log('View route:', route);
  };

  // Calculate route statistics
  const totalDeliveries = deliveries.length;
  const completedDeliveries = deliveries.filter(d => d.status === 'delivered').length;
  const inTransitDeliveries = deliveries.filter(d => d.status === 'in_transit').length;
  const failedDeliveries = deliveries.filter(d => d.status === 'failed').length;

  const activeRoutes = routes.filter(r => r.status === 'in_progress').length;
  const completedRoutes = routes.filter(r => r.status === 'completed').length;

  if (loading && routes.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{t('Loading routes...')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              {t('Retry')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">{t('Delivery Routes')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              {selectedDate.toLocaleDateString()}
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t('New Route')}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{routes.length}</div>
              <div className="text-sm text-muted-foreground">{t('Total Routes')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-sunrise">{activeRoutes}</div>
              <div className="text-sm text-muted-foreground">{t('Active Routes')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-palm">{completedDeliveries}</div>
              <div className="text-sm text-muted-foreground">{t('Completed')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-coral">{failedDeliveries}</div>
              <div className="text-sm text-muted-foreground">{t('Failed')}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{t('Overview')}</TabsTrigger>
            <TabsTrigger value="planning">{t('Planning')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('Analytics')}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RouteMap routes={routes} deliveries={deliveries} />
              <RouteList 
                routes={routes}
                drivers={drivers}
                onAssignDriver={handleAssignDriver}
                onOptimizeRoute={handleOptimizeRoute}
                onViewRoute={handleViewRoute}
              />
            </div>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  {t('Route Planning')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Truck className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">{t('Advanced Route Planning')}</h3>
                  <p className="mb-6">{t('Drag and drop deliveries, set time windows, and optimize routes')}</p>
                  <Button>
                    {t('Start Planning')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {t('Delivery Performance')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('Success Rate')}</span>
                      <span className="text-lg font-bold text-primary-palm">
                        {totalDeliveries > 0 ? ((completedDeliveries / totalDeliveries) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-palm h-2 rounded-full" 
                        style={{ 
                          width: totalDeliveries > 0 ? `${(completedDeliveries / totalDeliveries) * 100}%` : '0%' 
                        }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary-palm">{completedDeliveries}</div>
                        <div className="text-xs text-muted-foreground">{t('Delivered')}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary-sunrise">{inTransitDeliveries}</div>
                        <div className="text-xs text-muted-foreground">{t('In Transit')}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-coral">{failedDeliveries}</div>
                        <div className="text-xs text-muted-foreground">{t('Failed')}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Route Efficiency */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('Route Efficiency')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('Average Delivery Time')}</span>
                      <span className="text-lg font-bold">2.5h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('Distance per Delivery')}</span>
                      <span className="text-lg font-bold">12.3 km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('Fuel Efficiency')}</span>
                      <span className="text-lg font-bold">8.2 L/100km</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Performance */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{t('Driver Performance')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {drivers.slice(0, 5).map((driver, index) => (
                      <div key={driver.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">
                              {driver.user?.first_name} {driver.user?.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {driver.vehicle_type} • {driver.license_number}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary-palm">
                            {Math.floor(Math.random() * 20) + 80}%
                          </div>
                          <div className="text-sm text-muted-foreground">{t('Success Rate')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}