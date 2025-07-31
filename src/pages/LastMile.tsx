import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, TrendingUp, Package, Users, Leaf, Clock, MapPin } from 'lucide-react';
import { useLastMileMetrics } from '@/hooks/useLastMile';
import { RouteOptimizer } from '@/components/maps/RouteOptimizer';

// Import last-mile components
import DeliveryOptimization from '@/components/last-mile/DeliveryOptimization';
import DynamicRouting from '@/components/last-mile/DynamicRouting';
import DeliveryPartnerships from '@/components/last-mile/DeliveryPartnerships';
import CustomerCommunication from '@/components/last-mile/CustomerCommunication';
import EfficiencyTools from '@/components/last-mile/EfficiencyTools';
import LastMileLiveTrackingMap from '@/components/last-mile/LiveTrackingMap';

export default function LastMile() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('optimization');
  
  // Use real data from custom hooks
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useLastMileMetrics();

  const isEnglish = language === 'en';

  const translations = {
    title: isEnglish ? 'Last-Mile Delivery' : 'Entrega de Última Milla',
    description: isEnglish 
      ? 'Optimize delivery routes, manage partnerships, and track deliveries in real-time'
      : 'Optimiza rutas de entrega, gestiona asociaciones y rastrea entregas en tiempo real',
    optimization: isEnglish ? 'Optimization' : 'Optimización',
    routing: isEnglish ? 'Dynamic Routing' : 'Enrutamiento Dinámico',
    partnerships: isEnglish ? 'Partnerships' : 'Asociaciones',
    communication: isEnglish ? 'Communication' : 'Comunicación',
    efficiency: isEnglish ? 'Efficiency Tools' : 'Herramientas de Eficiencia',
    tracking: isEnglish ? 'Live Tracking' : 'Seguimiento en Vivo',
    totalDeliveries: isEnglish ? 'Total Deliveries' : 'Entregas Totales',
    completedToday: isEnglish ? 'Completed Today' : 'Completadas Hoy',
    avgDeliveryTime: isEnglish ? 'Avg Delivery Time' : 'Tiempo Promedio',
    efficiencyScore: isEnglish ? 'Efficiency Score' : 'Puntuación de Eficiencia',
    activeDrivers: isEnglish ? 'Active Drivers' : 'Conductores Activos',
    carbonSaved: isEnglish ? 'Carbon Saved' : 'Carbono Ahorrado',
    totalRoutes: isEnglish ? 'Total Routes' : 'Rutas Totales',
    activePartnerships: isEnglish ? 'Active Partnerships' : 'Asociaciones Activas',
    minutes: isEnglish ? 'min' : 'min',
    kg: isEnglish ? 'kg' : 'kg',
    routes: isEnglish ? 'routes' : 'rutas',
    drivers: isEnglish ? 'drivers' : 'conductores',
    partnershipCount: isEnglish ? 'partnerships' : 'asociaciones'
  };

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{isEnglish ? 'Loading last-mile data...' : 'Cargando datos de última milla...'}</span>
        </div>
      </div>
    );
  }

  if (metricsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            {isEnglish ? 'Error loading last-mile data' : 'Error al cargar datos de última milla'}
          </div>
          <Button onClick={() => window.location.reload()}>
            {isEnglish ? 'Retry' : 'Reintentar'}
          </Button>
        </div>
      </div>
    );
  }

  const defaultMetrics = {
    total_deliveries: 0,
    completed_today: 0,
    average_delivery_time: 0,
    efficiency_score: 0,
    active_drivers: 0,
    carbon_saved: 0,
    total_routes: 0,
    active_partnerships: 0
  };

  const currentMetrics = metrics || defaultMetrics;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{translations.title}</h1>
        <p className="text-muted-foreground">{translations.description}</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.totalDeliveries}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.total_deliveries}</div>
            <p className="text-xs text-muted-foreground">
              {translations.completedToday}: {currentMetrics.completed_today}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.avgDeliveryTime}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.average_delivery_time} {translations.minutes}</div>
            <Progress value={Math.min(currentMetrics.average_delivery_time, 60)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.efficiencyScore}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.efficiency_score}%</div>
            <Progress value={currentMetrics.efficiency_score} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.carbonSaved}</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.carbon_saved.toFixed(1)} {translations.kg}</div>
            <p className="text-xs text-muted-foreground">
              {isEnglish ? 'CO₂ emissions reduced' : 'Emisiones de CO₂ reducidas'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.activeDrivers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.active_drivers}</div>
            <p className="text-xs text-muted-foreground">
              {isEnglish ? 'Currently online' : 'Actualmente en línea'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.totalRoutes}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.total_routes}</div>
            <p className="text-xs text-muted-foreground">
              {isEnglish ? 'Active routes' : 'Rutas activas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.activePartnerships}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.active_partnerships}</div>
            <p className="text-xs text-muted-foreground">
              {isEnglish ? 'Delivery partners' : 'Socios de entrega'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>{translations.title}</CardTitle>
          <CardDescription>
            {isEnglish 
              ? 'Manage and optimize your last-mile delivery operations'
              : 'Gestiona y optimiza tus operaciones de entrega de última milla'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="optimization">{translations.optimization}</TabsTrigger>
              <TabsTrigger value="routing">{translations.routing}</TabsTrigger>
              <TabsTrigger value="partnerships">{translations.partnerships}</TabsTrigger>
              <TabsTrigger value="communication">{translations.communication}</TabsTrigger>
              <TabsTrigger value="efficiency">{translations.efficiency}</TabsTrigger>
              <TabsTrigger value="tracking">{translations.tracking}</TabsTrigger>
            </TabsList>

                    <TabsContent value="optimization" className="space-y-4">
          <DeliveryOptimization />
          <RouteOptimizer 
            stops={[
              {
                id: '1',
                address: 'San Juan, PR',
                location: { lat: 18.4395043, lng: -65.9992275 },
                packageCount: 5,
                priority: 'high'
              },
              {
                id: '2',
                address: 'Bayamón, PR',
                location: { lat: 18.3985, lng: -66.1614 },
                packageCount: 3,
                priority: 'medium'
              },
              {
                id: '3',
                address: 'Caguas, PR',
                location: { lat: 18.2341, lng: -66.0355 },
                packageCount: 2,
                priority: 'low'
              }
            ]}
          />
        </TabsContent>

            <TabsContent value="routing" className="space-y-4">
              <DynamicRouting />
            </TabsContent>

            <TabsContent value="partnerships" className="space-y-4">
              <DeliveryPartnerships />
            </TabsContent>

            <TabsContent value="communication" className="space-y-4">
              <CustomerCommunication />
            </TabsContent>

            <TabsContent value="efficiency" className="space-y-4">
              <EfficiencyTools />
            </TabsContent>

                    <TabsContent value="tracking" className="space-y-4">
          <LastMileLiveTrackingMap 
            vehicles={[
              {
                id: '1',
                driverName: 'Carlos Rodríguez',
                currentLocation: { lat: 18.4395043, lng: -65.9992275 },
                destination: { 
                  lat: 18.3985, 
                  lng: -66.1614, 
                  address: 'Bayamón, PR' 
                },
                status: 'en_route',
                eta: '15 min',
                packageCount: 5,
                vehicleType: 'car'
              },
              {
                id: '2',
                driverName: 'María González',
                currentLocation: { lat: 18.2341, lng: -66.0355 },
                destination: { 
                  lat: 18.4395043, 
                  lng: -65.9992275, 
                  address: 'San Juan, PR' 
                },
                status: 'delivering',
                eta: '8 min',
                packageCount: 3,
                vehicleType: 'bike'
              }
            ]}
          />
        </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 