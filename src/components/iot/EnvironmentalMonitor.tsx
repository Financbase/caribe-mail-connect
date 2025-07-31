import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Zap, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { EnvironmentalData } from '@/hooks/useIotTracking';

interface EnvironmentalMonitorProps {
  environmentalData: EnvironmentalData;
  isLive?: boolean;
  onThresholdChange?: (thresholds: EnvironmentalData['thresholds']) => void;
  className?: string;
}

interface SensorReading {
  timestamp: Date;
  temperature?: number;
  humidity?: number;
  shock?: number;
}

export function EnvironmentalMonitor({
  environmentalData,
  isLive = false,
  onThresholdChange,
  className = ''
}: EnvironmentalMonitorProps) {
  const [showChart, setShowChart] = useState(false);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('6h');
  const [chartData, setChartData] = useState<SensorReading[]>([]);
  const [isAlert, setIsAlert] = useState(false);

  // Simulate historical data for chart
  useEffect(() => {
    const generateChartData = () => {
      const data: SensorReading[] = [];
      const now = new Date();
      const points = timeRange === '1h' ? 60 : timeRange === '6h' ? 72 : 144;
      
      for (let i = points; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - (i * (timeRange === '1h' ? 60000 : timeRange === '6h' ? 300000 : 600000)));
        data.push({
          timestamp,
          temperature: environmentalData.temperature ? 
            environmentalData.temperature + (Math.random() - 0.5) * 5 : undefined,
          humidity: environmentalData.humidity ? 
            environmentalData.humidity + (Math.random() - 0.5) * 10 : undefined,
          shock: Math.random() > 0.95 ? Math.random() * 20 : 0
        });
      }
      
      setChartData(data);
    };

    generateChartData();
  }, [environmentalData, timeRange]);

  // Check for alerts
  useEffect(() => {
    const hasAlert = 
      (environmentalData.temperature && environmentalData.thresholds?.max_temperature && 
       environmentalData.temperature > environmentalData.thresholds.max_temperature) ||
      (environmentalData.humidity && environmentalData.thresholds?.max_humidity && 
       environmentalData.humidity > environmentalData.thresholds.max_humidity) ||
      environmentalData.shock_events.some(shock => shock.level > (environmentalData.thresholds?.max_shock || 10));
    
    setIsAlert(hasAlert);
  }, [environmentalData]);

  const getTemperatureStatus = () => {
    if (!environmentalData.temperature) return 'normal';
    if (environmentalData.thresholds?.max_temperature && 
        environmentalData.temperature > environmentalData.thresholds.max_temperature) return 'high';
    if (environmentalData.thresholds?.min_temperature && 
        environmentalData.temperature < environmentalData.thresholds.min_temperature) return 'low';
    return 'normal';
  };

  const getHumidityStatus = () => {
    if (!environmentalData.humidity) return 'normal';
    if (environmentalData.thresholds?.max_humidity && 
        environmentalData.humidity > environmentalData.thresholds.max_humidity) return 'high';
    return 'normal';
  };

  const getShockStatus = () => {
    const maxShock = Math.max(...environmentalData.shock_events.map(s => s.level), 0);
    if (maxShock > (environmentalData.thresholds?.max_shock || 10)) return 'high';
    if (maxShock > 5) return 'medium';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-green-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high': return <TrendingUp className="w-4 h-4" />;
      case 'low': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp > 30) return 'text-red-600';
    if (temp > 25) return 'text-orange-600';
    if (temp < 10) return 'text-blue-600';
    return 'text-green-600';
  };

  const getHumidityColor = (humidity: number) => {
    if (humidity > 80) return 'text-red-600';
    if (humidity > 70) return 'text-yellow-600';
    if (humidity < 30) return 'text-blue-600';
    return 'text-green-600';
  };

  const getShockColor = (level: number) => {
    if (level > 15) return 'text-red-600';
    if (level > 10) return 'text-orange-600';
    if (level > 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5" />
            Environmental Monitoring
            {isAlert && (
              <Badge variant="destructive" className="ml-2">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Alert
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isLive && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse mr-1" />
                Live
              </Badge>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  View Chart
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Environmental Data History</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={timeRange === '1h' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeRange('1h')}
                    >
                      1 Hour
                    </Button>
                    <Button
                      variant={timeRange === '6h' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeRange('6h')}
                    >
                      6 Hours
                    </Button>
                    <Button
                      variant={timeRange === '24h' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeRange('24h')}
                    >
                      24 Hours
                    </Button>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        formatter={(value, name) => [
                          value, 
                          name === 'temperature' ? 'Temperature (°C)' :
                          name === 'humidity' ? 'Humidity (%)' : 'Shock (g)'
                        ]}
                      />
                      {environmentalData.temperature !== undefined && (
                        <Line 
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          dot={false}
                        />
                      )}
                      {environmentalData.humidity !== undefined && (
                        <Line 
                          type="monotone" 
                          dataKey="humidity" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={false}
                        />
                      )}
                      <Line 
                        type="monotone" 
                        dataKey="shock" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Temperature */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-red-500" />
                <span className="font-medium">Temperature</span>
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(getTemperatureStatus())}
                <Badge variant={getTemperatureStatus() === 'normal' ? 'secondary' : 'destructive'}>
                  {getTemperatureStatus()}
                </Badge>
              </div>
            </div>
            
            {environmentalData.temperature !== undefined ? (
              <>
                <div className="text-2xl font-bold text-center">
                  <span className={getTemperatureColor(environmentalData.temperature)}>
                    {environmentalData.temperature.toFixed(1)}°C
                  </span>
                </div>
                
                {environmentalData.thresholds?.max_temperature && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Threshold: {environmentalData.thresholds.max_temperature}°C</span>
                      <span>{Math.round((environmentalData.temperature / environmentalData.thresholds.max_temperature) * 100)}%</span>
                    </div>
                    <Progress 
                      value={Math.min((environmentalData.temperature / environmentalData.thresholds.max_temperature) * 100, 100)} 
                      className="h-2" 
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No temperature data
              </div>
            )}
          </div>

          {/* Humidity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Humidity</span>
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(getHumidityStatus())}
                <Badge variant={getHumidityStatus() === 'normal' ? 'secondary' : 'destructive'}>
                  {getHumidityStatus()}
                </Badge>
              </div>
            </div>
            
            {environmentalData.humidity !== undefined ? (
              <>
                <div className="text-2xl font-bold text-center">
                  <span className={getHumidityColor(environmentalData.humidity)}>
                    {environmentalData.humidity.toFixed(1)}%
                  </span>
                </div>
                
                {environmentalData.thresholds?.max_humidity && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Threshold: {environmentalData.thresholds.max_humidity}%</span>
                      <span>{Math.round((environmentalData.humidity / environmentalData.thresholds.max_humidity) * 100)}%</span>
                    </div>
                    <Progress 
                      value={Math.min((environmentalData.humidity / environmentalData.thresholds.max_humidity) * 100, 100)} 
                      className="h-2" 
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No humidity data
              </div>
            )}
          </div>

          {/* Shock Events */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Shock Events</span>
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(getShockStatus())}
                <Badge variant={getShockStatus() === 'normal' ? 'secondary' : 'destructive'}>
                  {getShockStatus()}
                </Badge>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-center">
              <span className={getShockColor(Math.max(...environmentalData.shock_events.map(s => s.level), 0))}>
                {environmentalData.shock_events.length}
              </span>
            </div>
            
            {environmentalData.shock_events.length > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Max: {Math.max(...environmentalData.shock_events.map(s => s.level)).toFixed(1)}g</span>
                  <span>Threshold: {environmentalData.thresholds?.max_shock || 10}g</span>
                </div>
                <Progress 
                  value={Math.min((Math.max(...environmentalData.shock_events.map(s => s.level)) / (environmentalData.thresholds?.max_shock || 10)) * 100, 100)} 
                  className="h-2" 
                />
              </div>
            )}
            
            {environmentalData.shock_events.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No shock events
              </div>
            )}
          </div>
        </div>

        {/* Recent Shock Events */}
        {environmentalData.shock_events.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Recent Shock Events</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {environmentalData.shock_events
                .slice(-5)
                .reverse()
                .map((shock, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{shock.level.toFixed(1)}g</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {shock.timestamp.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Thresholds */}
        {environmentalData.thresholds && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Alert Thresholds</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {environmentalData.thresholds.max_temperature && (
                <div>
                  <span className="text-gray-600">Max Temperature:</span>
                  <span className="ml-2 font-medium">{environmentalData.thresholds.max_temperature}°C</span>
                </div>
              )}
              {environmentalData.thresholds.min_temperature && (
                <div>
                  <span className="text-gray-600">Min Temperature:</span>
                  <span className="ml-2 font-medium">{environmentalData.thresholds.min_temperature}°C</span>
                </div>
              )}
              {environmentalData.thresholds.max_humidity && (
                <div>
                  <span className="text-gray-600">Max Humidity:</span>
                  <span className="ml-2 font-medium">{environmentalData.thresholds.max_humidity}%</span>
                </div>
              )}
              {environmentalData.thresholds.max_shock && (
                <div>
                  <span className="text-gray-600">Max Shock:</span>
                  <span className="ml-2 font-medium">{environmentalData.thresholds.max_shock}g</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 