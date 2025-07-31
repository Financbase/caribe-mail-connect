import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGoogleMaps } from './GoogleMapsProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Navigation, Package, Clock, MapPin } from 'lucide-react';

interface DeliveryVehicle {
  id: string;
  driverName: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'en_route' | 'delivering' | 'completed' | 'idle';
  eta: string;
  packageCount: number;
  vehicleType: 'car' | 'bike' | 'walking';
}

interface LiveTrackingMapProps {
  vehicles?: DeliveryVehicle[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function LiveTrackingMap({ 
  vehicles = [], 
  center = { lat: 18.4395043, lng: -65.9992275 }, // San Juan, PR
  zoom = 12 
}: LiveTrackingMapProps) {
  const { isLoaded, isError, error, isConfigured } = useGoogleMaps();
  const { language } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const polylinesRef = useRef<Map<string, google.maps.Polyline>>(new Map());
  const [selectedVehicle, setSelectedVehicle] = useState<DeliveryVehicle | null>(null);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const mapOptions: google.maps.MapOptions = {
      center,
      zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: true,
      maxZoom: 20,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };

    mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
  }, [isLoaded, center, zoom]);

  // Update vehicles on map
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    const map = mapInstanceRef.current;

    // Clear existing markers and polylines
    markersRef.current.forEach(marker => marker.setMap(null));
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    markersRef.current.clear();
    polylinesRef.current.clear();

    // Add new markers and routes
    vehicles.forEach(vehicle => {
      // Create vehicle marker
      const marker = new google.maps.Marker({
        position: vehicle.currentLocation,
        map,
        title: vehicle.driverName,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getVehicleColor(vehicle.status),
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        label: {
          text: getVehicleIcon(vehicle.vehicleType),
          className: 'vehicle-marker-label',
        }
      });

      // Create route polyline
      const polyline = new google.maps.Polyline({
        path: [vehicle.currentLocation, vehicle.destination],
        geodesic: true,
        strokeColor: getVehicleColor(vehicle.status),
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map
      });

      // Add click listener
      marker.addListener('click', () => {
        setSelectedVehicle(vehicle);
        map.setCenter(vehicle.currentLocation);
        map.setZoom(15);
      });

      markersRef.current.set(vehicle.id, marker);
      polylinesRef.current.set(vehicle.id, polyline);
    });

    // Fit bounds to show all vehicles
    if (vehicles.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      vehicles.forEach(vehicle => {
        bounds.extend(vehicle.currentLocation);
        bounds.extend(vehicle.destination);
      });
      map.fitBounds(bounds);
    }
  }, [vehicles, isLoaded]);

  const getVehicleColor = (status: DeliveryVehicle['status']) => {
    switch (status) {
      case 'en_route': return '#3B82F6'; // Blue
      case 'delivering': return '#F59E0B'; // Yellow
      case 'completed': return '#10B981'; // Green
      case 'idle': return '#6B7280'; // Gray
      default: return '#3B82F6';
    }
  };

  const getVehicleIcon = (type: DeliveryVehicle['vehicleType']) => {
    switch (type) {
      case 'car': return '🚗';
      case 'bike': return '🚲';
      case 'walking': return '🚶';
      default: return '📦';
    }
  };

  const getStatusText = (status: DeliveryVehicle['status']) => {
    if (language === 'es') {
      switch (status) {
        case 'en_route': return 'En Ruta';
        case 'delivering': return 'Entregando';
        case 'completed': return 'Completado';
        case 'idle': return 'Inactivo';
        default: return 'Desconocido';
      }
    } else {
      switch (status) {
        case 'en_route': return 'En Route';
        case 'delivering': return 'Delivering';
        case 'completed': return 'Completed';
        case 'idle': return 'Idle';
        default: return 'Unknown';
      }
    }
  };

  if (!isConfigured) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-amber-600">
            <MapPin className="h-5 w-5" />
            <span>{language === 'es' ? 'Google Maps no está configurado' : 'Google Maps not configured'}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            {language === 'es' 
              ? 'Configure VITE_GOOGLE_MAPS_API_KEY en su archivo .env para habilitar el seguimiento en vivo'
              : 'Configure VITE_GOOGLE_MAPS_API_KEY in your .env file to enable live tracking'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <MapPin className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{language === 'es' ? 'Cargando mapa...' : 'Loading map...'}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="h-5 w-5" />
            <span>{language === 'es' ? 'Seguimiento en Vivo' : 'Live Tracking'}</span>
            <Badge variant="secondary" className="ml-auto">
              {vehicles.length} {language === 'es' ? 'vehículos' : 'vehicles'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            ref={mapRef} 
            className="w-full h-96 rounded-b-lg"
            style={{ minHeight: '400px' }}
          />
        </CardContent>
      </Card>

      {selectedVehicle && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedVehicle.driverName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {selectedVehicle.packageCount} {language === 'es' ? 'paquetes' : 'packages'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  ETA: {selectedVehicle.eta}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {selectedVehicle.destination.address}
                </span>
              </div>
              <Badge 
                variant={selectedVehicle.status === 'completed' ? 'default' : 'secondary'}
                className="w-fit"
              >
                {getStatusText(selectedVehicle.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 