import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Truck, Clock, MapPin, User, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DeliveryRoute, DriverAssignment } from '@/hooks/useRoutes';

interface RouteListProps {
  routes: DeliveryRoute[];
  drivers: DriverAssignment[];
  onAssignDriver: (routeId: string, driverId: string) => void;
  onOptimizeRoute: (routeId: string) => void;
  onViewRoute: (route: DeliveryRoute) => void;
}

export function RouteList({ 
  routes, 
  drivers, 
  onAssignDriver, 
  onOptimizeRoute,
  onViewRoute 
}: RouteListProps) {
  const { t } = useLanguage();
  const [assigningRoute, setAssigningRoute] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-primary-palm text-white';
      case 'in_progress': return 'bg-primary-sunrise text-white';
      case 'planned': return 'bg-primary-ocean text-white';
      case 'cancelled': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return t('Completed');
      case 'in_progress': return t('In Progress');
      case 'planned': return t('Planned');
      case 'cancelled': return t('Cancelled');
      default: return status;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleDriverAssignment = async (routeId: string, driverId: string) => {
    setAssigningRoute(routeId);
    await onAssignDriver(routeId, driverId);
    setAssigningRoute(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('Delivery Routes')}</span>
          <div className="text-sm text-muted-foreground">
            {routes.length} {t('routes')}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {routes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('No routes scheduled for today')}</p>
            </div>
          ) : (
            routes.map((route) => (
              <div 
                key={route.id} 
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onViewRoute(route)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{route.name}</h3>
                      <Badge className={getStatusColor(route.status)}>
                        {getStatusLabel(route.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{route.total_stops || 0} {t('stops')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {route.estimated_duration ? formatDuration(route.estimated_duration) : t('No estimate')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>
                          {route.completed_stops || 0}/{route.total_stops || 0} {t('completed')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>
                          {route.driver ? 
                            `${route.driver.first_name} ${route.driver.last_name}` : 
                            t('Unassigned')
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driver Assignment */}
                {!route.driver_id && (
                  <div className="flex items-center gap-2 mb-3" onClick={(e) => e.stopPropagation()}>
                    <Select 
                      onValueChange={(driverId) => handleDriverAssignment(route.id, driverId)}
                      disabled={assigningRoute === route.id}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder={t('Assign driver')} />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.user_id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {driver.user?.first_name?.[0]}{driver.user?.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span>{driver.user?.first_name} {driver.user?.last_name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({driver.vehicle_type})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Deliveries Preview */}
                {route.deliveries && route.deliveries.length > 0 && (
                  <div className="border-t pt-3 mt-3">
                    <div className="text-sm font-medium mb-2">{t('Upcoming Deliveries')}</div>
                    <div className="space-y-2">
                      {route.deliveries.slice(0, 3).map((delivery) => (
                        <div key={delivery.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              delivery.status === 'delivered' ? 'bg-green-500' :
                              delivery.status === 'in_transit' ? 'bg-yellow-500' :
                              delivery.status === 'failed' ? 'bg-red-500' :
                              'bg-gray-400'
                            }`} />
                            <span className="font-medium">
                              {delivery.customer?.first_name} {delivery.customer?.last_name}
                            </span>
                            <span className="text-muted-foreground">
                              • {delivery.address_line1}, {delivery.city}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {delivery.priority && delivery.priority > 1 && (
                              <Badge variant="outline" className="text-xs">
                                {t('Priority')} {delivery.priority}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {delivery.zone || t('No zone')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      
                      {route.deliveries.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{route.deliveries.length - 3} {t('more deliveries')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onOptimizeRoute(route.id)}
                    disabled={!route.deliveries || route.deliveries.length === 0}
                  >
                    {t('Optimize Route')}
                  </Button>
                  {route.driver_id && route.status === 'planned' && (
                    <Button size="sm">
                      {t('Start Route')}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}