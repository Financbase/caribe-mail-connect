import { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Clock, 
  Thermometer, 
  Zap, 
  AlertTriangle, 
  Package, 
  User, 
  Camera, 
  QrCode,
  Download,
  Share,
  Navigation,
  Activity,
  Battery,
  Signal,
  Globe,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  ArrowLeft,
  RefreshCw,
  Play,
  Pause,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIotTracking, type PackageJourney, type TrackingEvent } from '@/hooks/useIotTracking';
import { usePackages } from '@/hooks/usePackages';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from '@/hooks/use-toast';

interface PackageDetailsProps {
  packageId: string;
  onNavigate: (page: string) => void;
}

interface MapPoint {
  lat: number;
  lng: number;
  timestamp: Date;
  event_type?: string;
  label?: string;
}

export default function PackageDetails({ packageId, onNavigate }: PackageDetailsProps) {
  const { t } = useLanguage();
  const { packages } = usePackages();
  const { startTracking, stopTracking, activeTrackings } = useIotTracking();
  
  const [journey, setJourney] = useState<PackageJourney | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TrackingEvent | null>(null);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const trackingInterval = useRef<NodeJS.Timeout | null>(null);

  const packageData = packages.find(p => p.id === packageId);

  useEffect(() => {
    if (packageId) {
      initializeTracking();
    }

    return () => {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
      }
    };
  }, [packageId]);

  useEffect(() => {
    // Update journey from active trackings
    const activeJourney = activeTrackings.find(j => j.package_id === packageId);
    if (activeJourney) {
      setJourney(activeJourney);
      updateMapPoints(activeJourney);
    }
  }, [activeTrackings, packageId]);

  const initializeTracking = async () => {
    try {
      const journeyData = await startTracking(packageId);
      setJourney(journeyData);
      setIsTracking(true);
      updateMapPoints(journeyData);
      
      // Start real-time updates
      trackingInterval.current = setInterval(() => {
        updateCurrentLocation();
      }, 3000);
      
    } catch (error) {
      console.error('Error starting tracking:', error);
      toast({
        title: "Tracking Error",
        description: "Failed to start package tracking.",
        variant: "destructive"
      });
    }
  };

  const updateMapPoints = (journeyData: PackageJourney) => {
    const points: MapPoint[] = [];
    
    // Add current location
    if (journeyData.current_location) {
      points.push({
        ...journeyData.current_location,
        timestamp: new Date(),
        label: 'Current Location',
        event_type: 'current'
      });
    }
    
    // Add event locations
    journeyData.events.forEach(event => {
      if (event.location) {
        points.push({
          ...event.location,
          timestamp: event.timestamp,
          label: event.event_type,
          event_type: event.event_type
        });
      }
    });
    
    // Add shock event locations
    journeyData.environmental_data.shock_events.forEach(shock => {
      if (shock.location) {
        points.push({
          ...shock.location,
          timestamp: shock.timestamp,
          label: `Shock: ${shock.level}g`,
          event_type: 'shock'
        });
      }
    });
    
    setMapPoints(points);
  };

  const updateCurrentLocation = () => {
    if (journey) {
      // Simulate movement along a route
      const newLat = journey.current_location.lat + (Math.random() - 0.5) * 0.0001;
      const newLng = journey.current_location.lng + (Math.random() - 0.5) * 0.0001;
      
      setCurrentLocation({ lat: newLat, lng: newLng });
    }
  };

  const stopTrackingHandler = () => {
    stopTracking(packageId);
    setIsTracking(false);
    if (trackingInterval.current) {
      clearInterval(trackingInterval.current);
      trackingInterval.current = null;
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'location_update': return <MapPin className="w-4 h-4" />;
      case 'status_change': return <Package className="w-4 h-4" />;
      case 'environmental_alert': return <AlertTriangle className="w-4 h-4" />;
      case 'shock_detected': return <Zap className="w-4 h-4" />;
      case 'temperature_alert': return <Thermometer className="w-4 h-4" />;
      case 'delivery_milestone': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'shock_detected': return 'text-red-500';
      case 'temperature_alert': return 'text-orange-500';
      case 'environmental_alert': return 'text-yellow-500';
      case 'delivery_milestone': return 'text-green-500';
      default: return 'text-blue-500';
    }
  };

  const generateQRCode = () => {
    if (journey?.qr_code) {
      return journey.qr_code;
    }
    return `https://prmcms.com/track/${packageId}`;
  };

  const downloadJourneyReport = () => {
    if (!journey) return;
    
    const report = {
      tracking_number: journey.tracking_number,
      status: journey.status,
      events: journey.events,
      environmental_data: journey.environmental_data,
      chain_of_custody: journey.chain_of_custody,
      generated_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `package-${journey.tracking_number}-report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Package not found</p>
          <Button onClick={() => onNavigate('/packages')} className="mt-2">
            Back to Packages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/packages')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Package #{packageData.tracking_number}
              </h1>
              <p className="text-gray-600">
                {packageData.customer_name} • {packageData.carrier}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isTracking) {
                  stopTrackingHandler();
                } else {
                  initializeTracking();
                }
              }}
            >
              {isTracking ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Tracking
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Tracking
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Status Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Package Status</CardTitle>
                  <Badge variant={packageData.status === 'Delivered' ? 'default' : 'secondary'}>
                    {packageData.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {packageData.size}
                    </div>
                    <div className="text-sm text-gray-500">Size</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {packageData.weight || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Weight</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {packageData.requires_signature ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-gray-500">Signature</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {packageData.special_handling ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-gray-500">Special</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Map */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Live Tracking Map</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {mapPoints.length} waypoints
                    </Badge>
                    {isTracking && (
                      <div className="flex items-center gap-1 text-green-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                        Live
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  ref={mapRef}
                  className={`w-full bg-gray-100 rounded-lg overflow-hidden ${
                    isFullscreen ? 'h-[600px]' : 'h-[400px]'
                  }`}
                >
                  {/* Simulated Map - In production, integrate with Google Maps or Mapbox */}
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100">
                    {/* Map points */}
                    {mapPoints.map((point, index) => (
                      <div
                        key={index}
                        className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-2 -translate-y-2 ${
                          point.event_type === 'current' ? 'bg-blue-500 animate-pulse' :
                          point.event_type === 'shock' ? 'bg-red-500' :
                          point.event_type === 'temperature_alert' ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}
                        style={{
                          left: `${((point.lat + 18.5) * 1000) % 100}%`,
                          top: `${((point.lng + 66.5) * 1000) % 100}%`
                        }}
                        onClick={() => {
                          const event = journey?.events.find(e => 
                            e.location?.lat === point.lat && e.location?.lng === point.lng
                          );
                          if (event) setSelectedEvent(event);
                        }}
                        title={point.label}
                      />
                    ))}
                    
                    {/* Route line */}
                    {mapPoints.length > 1 && (
                      <svg className="absolute inset-0 w-full h-full">
                        <polyline
                          points={mapPoints.map(point => 
                            `${((point.lat + 18.5) * 1000) % 100}%,${((point.lng + 66.5) * 1000) % 100}%`
                          ).join(' ')}
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      </svg>
                    )}
                    
                    {/* Map legend */}
                    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                      <div className="text-sm font-medium mb-2">Legend</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          Current Location
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          Events
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Events Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Journey Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {journey?.events.map((event, index) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getEventColor(event.event_type)}`}>
                          {getEventIcon(event.event_type)}
                        </div>
                        {index < journey.events.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium capitalize">
                            {event.event_type.replace('_', ' ')}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {event.timestamp.toLocaleString()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          {JSON.stringify(event.event_data)}
                        </p>
                        
                        {event.location && (
                          <p className="text-xs text-gray-500 mt-1">
                            📍 {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
                          </p>
                        )}
                        
                        {event.notes && (
                          <p className="text-sm text-gray-600 mt-1 italic">
                            "{event.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Environmental Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  Environmental Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {journey?.environmental_data.temperature && (
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Temperature</span>
                      <span className="font-medium">
                        {journey.environmental_data.temperature}°C
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((journey.environmental_data.temperature / 50) * 100, 100)} 
                      className="h-2 mt-1" 
                    />
                  </div>
                )}
                
                {journey?.environmental_data.humidity && (
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Humidity</span>
                      <span className="font-medium">
                        {journey.environmental_data.humidity}%
                      </span>
                    </div>
                    <Progress value={journey.environmental_data.humidity} className="h-2 mt-1" />
                  </div>
                )}
                
                {journey?.environmental_data.shock_events.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Shock Events</span>
                      <span className="font-medium text-red-600">
                        {journey.environmental_data.shock_events.length}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Max: {Math.max(...journey.environmental_data.shock_events.map(s => s.level))}g
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chain of Custody */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Chain of Custody
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {journey?.chain_of_custody.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{entry.handler_name}</div>
                        <div className="text-xs text-gray-600">{entry.action}</div>
                        <div className="text-xs text-gray-500">
                          {entry.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => navigator.clipboard.writeText(generateQRCode())}>
                  <QrCode className="w-4 h-4 mr-2" />
                  Copy QR Code
                </Button>
                
                <Button variant="outline" className="w-full" onClick={downloadJourneyReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                
                <Button variant="outline" className="w-full" onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Package ${packageData.tracking_number}`,
                      text: `Track your package: ${generateQRCode()}`,
                      url: generateQRCode()
                    });
                  } else {
                    navigator.clipboard.writeText(generateQRCode());
                    toast({
                      title: "Link Copied",
                      description: "Tracking link copied to clipboard.",
                    });
                  }
                }}>
                  <Share className="w-4 h-4 mr-2" />
                  Share Tracking
                </Button>
              </CardContent>
            </Card>

            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle>Package Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Carrier:</span>
                  <span className="font-medium">{packageData.carrier}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Received:</span>
                  <span className="font-medium">
                    {new Date(packageData.received_at).toLocaleDateString()}
                  </span>
                </div>
                
                {packageData.delivered_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivered:</span>
                    <span className="font-medium">
                      {new Date(packageData.delivered_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {packageData.notes && (
                  <div>
                    <span className="text-gray-600">Notes:</span>
                    <p className="text-sm mt-1">{packageData.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold capitalize">
                  {selectedEvent.event_type.replace('_', ' ')}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Time:</span>
                  <p className="font-medium">{selectedEvent.timestamp.toLocaleString()}</p>
                </div>
                
                {selectedEvent.location && (
                  <div>
                    <span className="text-sm text-gray-600">Location:</span>
                    <p className="font-medium">
                      {selectedEvent.location.lat.toFixed(6)}, {selectedEvent.location.lng.toFixed(6)}
                    </p>
                  </div>
                )}
                
                <div>
                  <span className="text-sm text-gray-600">Data:</span>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(selectedEvent.event_data, null, 2)}
                  </pre>
                </div>
                
                {selectedEvent.notes && (
                  <div>
                    <span className="text-sm text-gray-600">Notes:</span>
                    <p className="font-medium">{selectedEvent.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 