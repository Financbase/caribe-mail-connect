import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInternational } from '@/hooks/useInternational';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  MapPin, 
  Package, 
  Globe, 
  Info,
  TrendingUp,
  Clock
} from 'lucide-react';

export const WorldMapView: React.FC = () => {
  const { t } = useLanguage();
  const { getWorldMapData, getCountryByCode } = useInternational();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const worldMapData = getWorldMapData();
  const selectedCountryData = selectedCountry ? getCountryByCode(selectedCountry) : null;

  // Simplified world map coordinates for Caribbean and Latin America
  const mapPoints = [
    // Caribbean Islands
    { code: 'PR', x: 20, y: 35, name: 'Puerto Rico' },
    { code: 'DO', x: 22, y: 38, name: 'Dominican Republic' },
    { code: 'JM', x: 18, y: 40, name: 'Jamaica' },
    { code: 'TT', x: 25, y: 45, name: 'Trinidad & Tobago' },
    { code: 'BB', x: 28, y: 42, name: 'Barbados' },
    
    // Central America
    { code: 'MX', x: 15, y: 30, name: 'Mexico' },
    
    // South America
    { code: 'CO', x: 22, y: 50, name: 'Colombia' },
    { code: 'BR', x: 30, y: 60, name: 'Brazil' },
    { code: 'AR', x: 25, y: 75, name: 'Argentina' },
    { code: 'CL', x: 20, y: 70, name: 'Chile' }
  ];

  const getZoneColor = (zoneId: string) => {
    const zone = worldMapData.shippingZones[zoneId];
    return zone?.color || '#6B7280';
  };

  const getActiveShipments = (countryCode: string) => {
    const country = worldMapData.countries[countryCode];
    return country?.activeShipments || 0;
  };

  const getShippingZone = (countryCode: string) => {
    const country = worldMapData.countries[countryCode];
    return country?.shippingZone || '';
  };

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-6 min-h-[400px]">
        {/* Map Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Globe className="h-64 w-64 text-gray-400" />
        </div>

        {/* Shipping Zones */}
        <div className="relative z-10">
          {/* Caribbean Zone */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/30 dark:bg-blue-800/30 rounded-full border-2 border-blue-400/50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Caribbean</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Zone 1</div>
            </div>
          </div>

          {/* Central America Zone */}
          <div className="absolute top-1/3 left-1/6 w-24 h-24 bg-green-200/30 dark:bg-green-800/30 rounded-full border-2 border-green-400/50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-medium text-green-700 dark:text-green-300">Central</div>
              <div className="text-xs text-green-600 dark:text-green-400">Zone 2</div>
            </div>
          </div>

          {/* South America Zone */}
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-orange-200/30 dark:bg-orange-800/30 rounded-full border-2 border-orange-400/50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-medium text-orange-700 dark:text-orange-300">South America</div>
              <div className="text-xs text-orange-600 dark:text-orange-400">Zone 3</div>
            </div>
          </div>

          {/* Country Points */}
          {mapPoints.map((point) => {
            const activeShipments = getActiveShipments(point.code);
            const zoneId = getShippingZone(point.code);
            const zoneColor = getZoneColor(zoneId);
            
            return (
              <div
                key={point.code}
                className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 ${
                  selectedCountry === point.code ? 'ring-4 ring-blue-500' : ''
                }`}
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedCountry(point.code)}
              >
                <div className="relative">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: zoneColor }}
                  />
                  {activeShipments > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      variant="destructive"
                    >
                      {activeShipments}
                    </Badge>
                  )}
                </div>
                
                {/* Country Label */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-medium shadow-sm">
                    {point.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Country Info */}
      {selectedCountryData && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{selectedCountryData.flag}</span>
              <div>
                <h3 className="font-semibold">{selectedCountryData.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCountryData.currency} ({selectedCountryData.currencySymbol})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('international.activeShipments', 'Active Shipments')}
                </p>
                <p className="font-medium">{getActiveShipments(selectedCountry)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('international.shippingZone', 'Shipping Zone')}
                </p>
                <p className="font-medium">{getShippingZone(selectedCountry)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('international.importDuty', 'Import Duty')}
                </p>
                <p className="font-medium">{(selectedCountryData.importDutyRate * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('international.vat', 'VAT')}
                </p>
                <p className="font-medium">{(selectedCountryData.vatRate * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shipping Zones Legend */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-4">{t('international.shippingZones', 'Shipping Zones')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(worldMapData.shippingZones).map(([zoneId, zone]) => (
              <div key={zoneId} className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: zone.color }}
                />
                <div>
                  <p className="font-medium text-sm">{zone.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {zone.countries.length} {t('international.countries', 'countries')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('international.totalActive', 'Total Active')}
                </p>
                <p className="text-xl font-bold">
                  {Object.values(worldMapData.countries).reduce((sum, country) => sum + country.activeShipments, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('international.shippingZones', 'Shipping Zones')}
                </p>
                <p className="text-xl font-bold">{Object.keys(worldMapData.shippingZones).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('international.avgTransit', 'Avg Transit')}
                </p>
                <p className="text-xl font-bold">6.5 {t('international.days', 'days')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 