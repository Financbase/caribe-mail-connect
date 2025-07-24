import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface RouteMapProps {
  routes: any[];
  deliveries: any[];
}

export function RouteMap({ routes, deliveries }: RouteMapProps) {
  const { t } = useLanguage();

  // Placeholder map data - zones in Puerto Rico
  const zones = [
    { name: 'San Juan', color: '#0B5394', deliveries: 12, coordinates: [18.4655, -66.1057] },
    { name: 'Bayamón', color: '#FF6B35', deliveries: 8, coordinates: [18.3965, -66.1557] },
    { name: 'Carolina', color: '#2ECC71', deliveries: 6, coordinates: [18.3834, -65.9645] },
    { name: 'Trujillo Alto', color: '#E74C3C', deliveries: 4, coordinates: [18.3644, -66.0130] },
    { name: 'Caguas', color: '#9B59B6', deliveries: 7, coordinates: [18.2342, -66.0356] }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('Delivery Routes Map')}</span>
          <div className="text-sm text-muted-foreground">
            {t('Total Deliveries')}: {deliveries.length}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-blue-50 rounded-lg h-96 overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200">
            {/* Puerto Rico outline placeholder */}
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Simple Puerto Rico shape */}
              <path
                d="M50 120 L350 100 L370 130 L340 150 L280 160 L150 170 L80 160 L50 140 Z"
                fill="hsl(var(--primary-palm)/20)"
                stroke="hsl(var(--primary-ocean))"
                strokeWidth="2"
              />
              
              {/* Zone markers */}
              {zones.map((zone, index) => {
                const x = 50 + (zone.coordinates[1] + 66.5) * 600; // Rough longitude conversion
                const y = 50 + (18.6 - zone.coordinates[0]) * 800; // Rough latitude conversion
                
                return (
                  <g key={zone.name}>
                    <circle
                      cx={x}
                      cy={y}
                      r={Math.max(8, zone.deliveries * 2)}
                      fill={zone.color}
                      className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
                    />
                    <text
                      x={x}
                      y={y + 25}
                      textAnchor="middle"
                      className="text-xs font-medium fill-current"
                      fill="#374151"
                    >
                      {zone.name}
                    </text>
                    <text
                      x={x}
                      y={y + 38}
                      textAnchor="middle"
                      className="text-xs fill-current"
                      fill="#6B7280"
                    >
                      {zone.deliveries} {t('deliveries')}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-xs font-medium text-gray-700 mb-2">{t('Delivery Zones')}</div>
            <div className="space-y-1">
              {zones.map((zone) => (
                <div key={zone.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: zone.color }}
                  />
                  <span className="text-xs text-gray-600">
                    {zone.name} ({zone.deliveries})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Route Status */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-xs font-medium text-gray-700 mb-2">{t('Route Status')}</div>
            <div className="space-y-1">
              {routes.map((route, index) => (
                <div key={route.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        route.status === 'completed' ? 'bg-green-500' :
                        route.status === 'in_progress' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}
                    />
                    <span className="text-xs text-gray-600">{route.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {route.completed_stops || 0}/{route.total_stops || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay for future map integration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 hover:opacity-50 transition-opacity">
            <div className="text-center p-4 bg-white/80 rounded-lg">
              <div className="text-sm font-medium text-gray-700">
                {t('Interactive Map Coming Soon')}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t('Click to integrate with Google Maps')}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}