import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGoogleMaps } from './GoogleMapsProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Navigation, Route, Clock, Package, Zap } from 'lucide-react';

interface DeliveryStop {
  id: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  packageCount: number;
  priority: 'high' | 'medium' | 'low';
  timeWindow?: {
    start: string;
    end: string;
  };
}

interface OptimizedRoute {
  stops: DeliveryStop[];
  totalDistance: string;
  totalDuration: string;
  fuelEfficiency: number;
  carbonSaved: number;
  routePolyline: google.maps.LatLng[];
}

interface RouteOptimizerProps {
  stops: DeliveryStop[];
  onRouteOptimized?: (route: OptimizedRoute) => void;
}

export function RouteOptimizer({ stops, onRouteOptimized }: RouteOptimizerProps) {
  const { isLoaded, google } = useGoogleMaps();
  const { language } = useLanguage();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [error, setError] = useState<string | null>(null);

  const optimizeRoute = async () => {
    if (!isLoaded || !google || stops.length < 2) {
      setError(language === 'es' ? 'Se requieren al menos 2 paradas' : 'At least 2 stops required');
      return;
    }

    setIsOptimizing(true);
    setError(null);

    try {
      const directionsService = new google.maps.DirectionsService();
      const waypoints = stops.slice(1, -1).map(stop => ({
        location: new google.maps.LatLng(stop.location.lat, stop.location.lng),
        stopover: true
      }));

      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(stops[0].location.lat, stops[0].location.lng),
        destination: new google.maps.LatLng(stops[stops.length - 1].location.lat, stops[stops.length - 1].location.lng),
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };

      const response = await directionsService.route(request);
      
      if (response.routes && response.routes.length > 0) {
        const route = response.routes[0];
        const leg = route.legs[0];
        
        // Calculate fuel efficiency and carbon savings
        const totalDistanceKm = parseFloat(leg.distance.text.replace(' km', ''));
        const fuelEfficiency = calculateFuelEfficiency(totalDistanceKm, stops.length);
        const carbonSaved = calculateCarbonSavings(totalDistanceKm, fuelEfficiency);

        const optimizedRouteData: OptimizedRoute = {
          stops: reorderStopsByRoute(stops, route),
          totalDistance: leg.distance.text,
          totalDuration: leg.duration.text,
          fuelEfficiency,
          carbonSaved,
          routePolyline: route.overview_path,
        };

        setOptimizedRoute(optimizedRouteData);
        onRouteOptimized?.(optimizedRouteData);
      }
    } catch (err) {
      setError(language === 'es' ? 'Error al optimizar ruta' : 'Error optimizing route');
      console.error('Route optimization error:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const calculateFuelEfficiency = (distanceKm: number, stopCount: number): number => {
    // Simplified fuel efficiency calculation
    // In a real implementation, this would consider vehicle type, traffic, etc.
    const baseEfficiency = 85; // 85% efficiency
    const stopPenalty = (stopCount - 1) * 2; // 2% penalty per stop
    return Math.max(60, baseEfficiency - stopPenalty);
  };

  const calculateCarbonSavings = (distanceKm: number, efficiency: number): number => {
    // Simplified carbon calculation
    // Assumes 0.2 kg CO2 per km for standard delivery vehicle
    const standardEmissions = distanceKm * 0.2;
    const optimizedEmissions = standardEmissions * (1 - efficiency / 100);
    return Math.round((standardEmissions - optimizedEmissions) * 100) / 100;
  };

  const reorderStopsByRoute = (originalStops: DeliveryStop[], route: google.maps.DirectionsRoute): DeliveryStop[] => {
    // This is a simplified implementation
    // In a real scenario, you'd parse the waypoint order from the route
    return originalStops;
  };

  const getPriorityColor = (priority: DeliveryStop['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: DeliveryStop['priority']) => {
    if (language === 'es') {
      switch (priority) {
        case 'high': return 'Alta';
        case 'medium': return 'Media';
        case 'low': return 'Baja';
        default: return 'Normal';
      }
    } else {
      switch (priority) {
        case 'high': return 'High';
        case 'medium': return 'Medium';
        case 'low': return 'Low';
        default: return 'Normal';
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Route className="h-5 w-5" />
            <span>{language === 'es' ? 'Optimización de Rutas' : 'Route Optimization'}</span>
            <Badge variant="secondary" className="ml-auto">
              {stops.length} {language === 'es' ? 'paradas' : 'stops'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Button 
                onClick={optimizeRoute} 
                disabled={isOptimizing || stops.length < 2}
                className="flex items-center space-x-2"
              >
                {isOptimizing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                <span>
                  {isOptimizing 
                    ? (language === 'es' ? 'Optimizando...' : 'Optimizing...')
                    : (language === 'es' ? 'Optimizar Ruta' : 'Optimize Route')
                  }
                </span>
              </Button>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            {optimizedRoute && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <Navigation className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">
                      {language === 'es' ? 'Distancia Total' : 'Total Distance'}
                    </div>
                    <div className="font-semibold text-blue-600">
                      {optimizedRoute.totalDistance}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <Clock className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">
                      {language === 'es' ? 'Tiempo Total' : 'Total Time'}
                    </div>
                    <div className="font-semibold text-green-600">
                      {optimizedRoute.totalDuration}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-600">
                      {language === 'es' ? 'Eficiencia' : 'Efficiency'}
                    </div>
                    <div className="font-semibold text-purple-600">
                      {optimizedRoute.fuelEfficiency}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-medium">
                {language === 'es' ? 'Paradas de Entrega' : 'Delivery Stops'}
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {stops.map((stop, index) => (
                  <div key={stop.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{stop.address}</div>
                        <div className="text-sm text-gray-500">
                          {stop.packageCount} {language === 'es' ? 'paquetes' : 'packages'}
                        </div>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(stop.priority)}>
                      {getPriorityText(stop.priority)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 