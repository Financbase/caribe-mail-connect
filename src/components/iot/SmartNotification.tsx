import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Thermometer, 
  Zap, 
  Truck, 
  Cloud, 
  Navigation,
  CheckCircle,
  XCircle,
  Bell,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { IotAlert, PackageJourney } from '@/hooks/useIotTracking';

interface SmartNotificationProps {
  alert: IotAlert;
  journey?: PackageJourney;
  onAcknowledge?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  className?: string;
}

interface WeatherData {
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

interface TrafficData {
  congestion: 'low' | 'medium' | 'high';
  delay: number; // minutes
  route: string;
}

export function SmartNotification({
  alert,
  journey,
  onAcknowledge,
  onResolve,
  onDismiss,
  className = ''
}: SmartNotificationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [predictedDelivery, setPredictedDelivery] = useState<Date | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
    weather_alerts: true,
    traffic_alerts: true
  });

  // Simulate weather and traffic data
  useEffect(() => {
    if (journey?.current_location) {
      // Simulate weather data
      setWeatherData({
        condition: Math.random() > 0.7 ? 'Rain' : 'Clear',
        temperature: 20 + Math.random() * 15,
        humidity: 60 + Math.random() * 30,
        windSpeed: Math.random() * 20,
        precipitation: Math.random() * 10
      });

      // Simulate traffic data
      setTrafficData({
        congestion: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
        delay: Math.floor(Math.random() * 30),
        route: 'PR-1 to San Juan'
      });

      // Calculate predicted delivery time
      const baseTime = new Date();
      const weatherDelay = weatherData?.condition === 'Rain' ? 15 : 0;
      const trafficDelay = trafficData?.delay || 0;
      const totalDelay = weatherDelay + trafficDelay;
      
      setPredictedDelivery(new Date(baseTime.getTime() + totalDelay * 60000));
    }
  }, [journey]);

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'temperature': return <Thermometer className="w-5 h-5" />;
      case 'shock': return <Zap className="w-5 h-5" />;
      case 'battery_low': return <AlertTriangle className="w-5 h-5" />;
      case 'device_offline': return <XCircle className="w-5 h-5" />;
      case 'delivery_delay': return <Clock className="w-5 h-5" />;
      case 'route_deviation': return <Navigation className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrafficColor = (congestion: string) => {
    switch (congestion) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'rain': return <Cloud className="w-4 h-4 text-blue-500" />;
      case 'clear': return <Cloud className="w-4 h-4 text-yellow-500" />;
      default: return <Cloud className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDelayMessage = () => {
    if (!weatherData && !trafficData) return null;
    
    const delays = [];
    if (weatherData?.condition === 'Rain') delays.push('weather');
    if (trafficData?.congestion === 'high') delays.push('traffic');
    
    if (delays.length === 0) return null;
    
    return `Expected ${delays.join(' and ')} delays`;
  };

  return (
    <Card className={`transition-all duration-300 ${className} ${
      isExpanded ? 'ring-2 ring-primary' : 'hover:shadow-md'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
              {getAlertIcon(alert.alert_type)}
            </div>
            <div>
              <CardTitle className="text-lg">{alert.title}</CardTitle>
              <p className="text-sm text-gray-600">{alert.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getSeverityColor(alert.severity)}>
              {alert.severity}
            </Badge>
            <Badge variant="outline">
              {alert.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Alert Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Created:</span>
            <span className="font-medium">
              {new Date(alert.created_at).toLocaleString()}
            </span>
          </div>
          
          {alert.alert_data && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Alert Data:</h4>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(alert.alert_data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Smart Context Information */}
        {(weatherData || trafficData || predictedDelivery) && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Smart Context
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weather Information */}
              {weatherData && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getWeatherIcon(weatherData.condition)}
                    <span className="font-medium text-sm">Weather</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Condition:</span>
                      <span className="font-medium">{weatherData.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span className="font-medium">{weatherData.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Humidity:</span>
                      <span className="font-medium">{weatherData.humidity.toFixed(1)}%</span>
                    </div>
                    {weatherData.condition === 'Rain' && (
                      <div className="text-yellow-600 text-xs">
                        ⚠️ Weather may cause delivery delays
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Traffic Information */}
              {trafficData && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span className="font-medium text-sm">Traffic</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Congestion:</span>
                      <span className={`font-medium ${getTrafficColor(trafficData.congestion)}`}>
                        {trafficData.congestion}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delay:</span>
                      <span className="font-medium">{trafficData.delay} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Route:</span>
                      <span className="font-medium text-xs">{trafficData.route}</span>
                    </div>
                    {trafficData.congestion === 'high' && (
                      <div className="text-red-600 text-xs">
                        ⚠️ High traffic may delay delivery
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Predicted Delivery Time */}
            {predictedDelivery && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm text-blue-800">Predicted Delivery</span>
                </div>
                <div className="text-lg font-bold text-blue-900">
                  {formatTime(predictedDelivery)}
                </div>
                {getDelayMessage() && (
                  <p className="text-sm text-blue-700 mt-1">
                    {getDelayMessage()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Package Location (if available) */}
        {journey?.current_location && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium text-sm">Current Location</span>
            </div>
            <div className="text-sm text-gray-600">
              {journey.current_location.lat.toFixed(4)}, {journey.current_location.lng.toFixed(4)}
              {journey.current_location.accuracy && (
                <span className="ml-2 text-xs">
                  (±{journey.current_location.accuracy}m)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {alert.status === 'active' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAcknowledge?.(alert.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Acknowledge
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onResolve?.(alert.id)}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Resolve
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notification Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, email: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <Switch
                      id="sms-notifications"
                      checked={notificationSettings.sms}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, sms: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch
                      id="push-notifications"
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, push: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weather-alerts">Weather Alerts</Label>
                    <Switch
                      id="weather-alerts"
                      checked={notificationSettings.weather_alerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, weather_alerts: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="traffic-alerts">Traffic Alerts</Label>
                    <Switch
                      id="traffic-alerts"
                      checked={notificationSettings.traffic_alerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, traffic_alerts: checked }))
                      }
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 