import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Star,
  BarChart3,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';
import { useCustomers } from '@/hooks/useCustomers';
import { usePackages } from '@/hooks/usePackages';

interface MultiLocationDashboardProps {
  onNavigate: (page: string) => void;
}

export function MultiLocationDashboard({ onNavigate }: MultiLocationDashboardProps) {
  const { locations, currentLocation, switchLocation } = useLocations();
  const { customers } = useCustomers();
  const { packages } = usePackages();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data for demonstration
  const getLocationMetrics = (locationId: string) => {
    const locationCustomers = customers.filter(c => c.location_id === locationId);
    const locationPackages = packages.filter(p => p.location_id === locationId);
    
    return {
      customers: locationCustomers.length,
      packages: locationPackages.length,
      revenue: locationCustomers.length * 150, // Mock revenue calculation
      efficiency: Math.floor(Math.random() * 20) + 80, // Mock efficiency 80-100%
      growth: Math.floor(Math.random() * 20) - 10 // Mock growth -10% to +10%
    };
  };

  const formatOperatingHours = (hours: any) => {
    if (!hours) return 'Not set';
    
    const today = new Date().getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayHours = hours[days[today]];
    
    if (todayHours?.closed) return 'Closed';
    if (todayHours?.open && todayHours?.close) {
      return `${todayHours.open} - ${todayHours.close}`;
    }
    
    return 'Hours not set';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Multi-Location Overview</h2>
        <Button onClick={() => onNavigate('location-management')} variant="outline">
          <Building className="h-4 w-4 mr-2" />
          Manage Locations
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Location Quick Stats */}
          {currentLocation && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Current Location: {currentLocation.name}</span>
                  {currentLocation.is_primary && <Star className="h-4 w-4 text-yellow-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const metrics = getLocationMetrics(currentLocation.id);
                    return (
                      <>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{metrics.customers}</div>
                          <div className="text-sm text-muted-foreground">Customers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{metrics.packages}</div>
                          <div className="text-sm text-muted-foreground">Packages</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">${metrics.revenue}</div>
                          <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{metrics.efficiency}%</div>
                          <div className="text-sm text-muted-foreground">Efficiency</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => {
              const metrics = getLocationMetrics(location.id);
              const isCurrentLocation = currentLocation?.id === location.id;
              
              return (
                <Card 
                  key={location.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isCurrentLocation ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => switchLocation(location)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Building className="h-4 w-4" />
                        <span>{location.name}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        {location.is_primary && <Star className="h-4 w-4 text-yellow-500" />}
                        <Badge variant={location.status === 'active' ? 'default' : 'secondary'}>
                          {location.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {location.code} • {formatOperatingHours(location.operating_hours)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{metrics.customers} customers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{metrics.packages} packages</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>${metrics.revenue}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {metrics.growth >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={metrics.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {metrics.growth >= 0 ? '+' : ''}{metrics.growth}%
                        </span>
                      </div>
                    </div>
                    
                    {location.services_offered && location.services_offered.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {location.services_offered.slice(0, 2).map((service) => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {service.replace('_', ' ')}
                          </Badge>
                        ))}
                        {location.services_offered.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{location.services_offered.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.map((location) => {
              const metrics = getLocationMetrics(location.id);
              
              return (
                <Card key={location.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>{location.name}</span>
                      {location.is_primary && <Star className="h-4 w-4 text-yellow-500" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Efficiency</span>
                        <span className="font-medium">{metrics.efficiency}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${metrics.efficiency}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Monthly Growth</span>
                        <span className={`font-medium ${metrics.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {metrics.growth >= 0 ? '+' : ''}{metrics.growth}%
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center">
                          <div className="text-lg font-bold">{metrics.customers}</div>
                          <div className="text-xs text-muted-foreground">Customers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">${metrics.revenue}</div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Location Performance Ranking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locations
                  .map(location => ({
                    ...location,
                    metrics: getLocationMetrics(location.id)
                  }))
                  .sort((a, b) => b.metrics.revenue - a.metrics.revenue)
                  .map((location, index) => (
                    <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium flex items-center space-x-2">
                            <span>{location.name}</span>
                            {location.is_primary && <Star className="h-4 w-4 text-yellow-500" />}
                          </div>
                          <div className="text-sm text-muted-foreground">{location.code}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">${location.metrics.revenue}</div>
                        <div className="text-sm text-muted-foreground">
                          {location.metrics.customers} customers
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}