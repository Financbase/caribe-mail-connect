import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Zap, Thermometer, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { LocationData, TrackingEvent } from '@/hooks/useIotTracking';

interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  timestamp: Date;
  event_type: 'current' | 'milestone' | 'shock' | 'temperature' | 'location';
  label: string;
  data?: Record<string, unknown>;
}

interface PackageTrackingMapProps {
  packageId: string;
  currentLocation: LocationData;
  events: TrackingEvent[];
  shockEvents: Array<{ timestamp: Date; level: number; location?: LocationData }>;
  isLive?: boolean;
  onPointClick?: (point: MapPoint) => void;
  className?: string;
}

export function PackageTrackingMap({
  packageId,
  currentLocation,
  events,
  shockEvents,
  isLive = false,
  onPointClick,
  className = ''
}: PackageTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Puerto Rico bounding box for map positioning
  const PR_BOUNDS = {
    north: 18.5200,
    south: 17.8830,
    east: -65.2200,
    west: -67.9450
  };

  // Convert lat/lng to map coordinates (0-100%)
  const latToY = (lat: number) => {
    return ((lat - PR_BOUNDS.south) / (PR_BOUNDS.north - PR_BOUNDS.south)) * 100;
  };

  const lngToX = (lng: number) => {
    return ((lng - PR_BOUNDS.west) / (PR_BOUNDS.east - PR_BOUNDS.west)) * 100;
  };

  useEffect(() => {
    updateMapPoints();
  }, [currentLocation, events, shockEvents]);

  const updateMapPoints = () => {
    const points: MapPoint[] = [];

    // Add current location
    if (currentLocation) {
      points.push({
        id: 'current',
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        timestamp: new Date(),
        event_type: 'current',
        label: 'Current Location'
      });
    }

    // Add milestone events
    events.forEach((event, index) => {
      if (event.location) {
        points.push({
          id: `event-${index}`,
          lat: event.location.lat,
          lng: event.location.lng,
          timestamp: event.timestamp,
          event_type: event.event_type === 'delivery_milestone' ? 'milestone' : 'location',
          label: event.event_type.replace('_', ' '),
          data: event.event_data
        });
      }
    });

    // Add shock events
    shockEvents.forEach((shock, index) => {
      if (shock.location) {
        points.push({
          id: `shock-${index}`,
          lat: shock.location.lat,
          lng: shock.location.lng,
          timestamp: shock.timestamp,
          event_type: 'shock',
          label: `Shock: ${shock.level}g`,
          data: { level: shock.level }
        });
      }
    });

    setMapPoints(points);
  };

  const getPointIcon = (eventType: string) => {
    switch (eventType) {
      case 'current': return <Navigation className="w-4 h-4" />;
      case 'milestone': return <MapPin className="w-4 h-4" />;
      case 'shock': return <Zap className="w-4 h-4" />;
      case 'temperature': return <Thermometer className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getPointColor = (eventType: string) => {
    switch (eventType) {
      case 'current': return 'bg-blue-500 border-blue-600';
      case 'milestone': return 'bg-green-500 border-green-600';
      case 'shock': return 'bg-red-500 border-red-600';
      case 'temperature': return 'bg-orange-500 border-orange-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getPointSize = (eventType: string) => {
    switch (eventType) {
      case 'current': return 'w-6 h-6';
      case 'shock': return 'w-5 h-5';
      default: return 'w-4 h-4';
    }
  };

  const handlePointClick = (point: MapPoint) => {
    setSelectedPoint(point);
    onPointClick?.(point);
  };

  const animateRoute = () => {
    if (mapPoints.length < 2) return;
    
    setIsAnimating(true);
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < mapPoints.length - 1) {
        currentIndex++;
        // Trigger animation by updating a state
        setMapPoints(prev => [...prev]);
      } else {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 1000);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Package Journey
          </CardTitle>
          <div className="flex items-center gap-2">
            {isLive && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse mr-1" />
                Live
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={animateRoute}
              disabled={isAnimating || mapPoints.length < 2}
            >
              Animate Route
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[400px] bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border">
          {/* Map Background with Puerto Rico outline */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Simplified Puerto Rico shape */}
              <path
                d="M20 30 L80 30 L85 40 L80 70 L20 70 L15 50 Z"
                fill="#3B82F6"
                stroke="#1E40AF"
                strokeWidth="0.5"
              />
            </svg>
          </div>

          {/* Route Line */}
          {mapPoints.length > 1 && (
            <svg className="absolute inset-0 w-full h-full">
              <polyline
                points={mapPoints.map(point => 
                  `${lngToX(point.lng)},${latToY(point.lat)}`
                ).join(' ')}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray="5,5"
                className={isAnimating ? 'animate-pulse' : ''}
              />
            </svg>
          )}

          {/* Map Points */}
          {mapPoints.map((point, index) => (
            <div
              key={point.id}
              className={`absolute ${getPointSize(point.event_type)} ${getPointColor(point.event_type)} rounded-full border-2 shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
                point.event_type === 'current' ? 'animate-pulse' : ''
              } ${
                isAnimating && index <= currentIndex ? 'animate-bounce' : ''
              }`}
              style={{
                left: `${lngToX(point.lng)}%`,
                top: `${latToY(point.lat)}%`,
                zIndex: point.event_type === 'current' ? 10 : 5
              }}
              onClick={() => handlePointClick(point)}
              title={point.label}
            >
              <div className="w-full h-full flex items-center justify-center text-white">
                {getPointIcon(point.event_type)}
              </div>
              
              {/* Point label */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                {point.label}
              </div>
            </div>
          ))}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
            <div className="text-sm font-medium mb-2">Legend</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                Current Location
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                Milestones
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                Shock Events
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                Alerts
              </div>
            </div>
          </div>

          {/* Journey Stats */}
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border">
            <div className="text-sm font-medium mb-2">Journey Stats</div>
            <div className="space-y-1 text-xs">
              <div>Total Points: {mapPoints.length}</div>
              <div>Events: {events.length}</div>
              <div>Shock Events: {shockEvents.length}</div>
              {currentLocation.accuracy && (
                <div>Accuracy: ±{currentLocation.accuracy}m</div>
              )}
            </div>
          </div>
        </div>

        {/* Point Details Panel */}
        {selectedPoint && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium capitalize">
                {selectedPoint.event_type.replace('_', ' ')}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPoint(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Time:</span>
                <span className="ml-2 font-medium">
                  {selectedPoint.timestamp.toLocaleString()}
                </span>
              </div>
              
              <div>
                <span className="text-gray-600">Location:</span>
                <span className="ml-2 font-medium">
                  {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
                </span>
              </div>
              
              {selectedPoint.data && (
                <div>
                  <span className="text-gray-600">Data:</span>
                  <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(selectedPoint.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 