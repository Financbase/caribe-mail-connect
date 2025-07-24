import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building, Star } from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';
import { cn } from '@/lib/utils';

interface LocationSelectorProps {
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
}

export function LocationSelector({ className, showIcon = true, compact = false }: LocationSelectorProps) {
  const { locations, currentLocation, switchLocation, loading } = useLocations();

  if (loading || !currentLocation) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {showIcon && <MapPin className="h-4 w-4 text-muted-foreground" />}
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const handleLocationChange = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      switchLocation(location);
    }
  };

  if (compact) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {showIcon && <MapPin className="h-4 w-4 text-primary" />}
        <Select value={currentLocation.id} onValueChange={handleLocationChange}>
          <SelectTrigger className="w-auto border-0 shadow-none p-0 h-auto focus:ring-0">
            <SelectValue>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-sm">{currentLocation.code}</span>
                {currentLocation.is_primary && <Star className="h-3 w-3 text-yellow-500" />}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-medium">{location.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({location.code})</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {location.is_primary && <Star className="h-3 w-3 text-yellow-500" />}
                    <Badge 
                      variant={location.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {location.status}
                    </Badge>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-2">
        {showIcon && <MapPin className="h-4 w-4 text-primary" />}
        <span className="text-sm font-medium">Current Location:</span>
      </div>
      <Select value={currentLocation.id} onValueChange={handleLocationChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{currentLocation.name}</span>
                <span className="text-sm text-muted-foreground">({currentLocation.code})</span>
              </div>
              <div className="flex items-center space-x-1">
                {currentLocation.is_primary && <Star className="h-4 w-4 text-yellow-500" />}
                <Badge 
                  variant={currentLocation.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {currentLocation.status}
                </Badge>
              </div>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">{location.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({location.code})</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {location.is_primary && <Star className="h-3 w-3 text-yellow-500" />}
                  <Badge 
                    variant={location.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {location.status}
                  </Badge>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}