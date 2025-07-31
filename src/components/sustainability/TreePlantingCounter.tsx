import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TreePine, Leaf, MapPin, Calendar } from 'lucide-react';
import { TreePlantingCounter as TreePlantingCounterType } from '@/types/sustainability';

interface TreePlantingCounterProps {
  data: TreePlantingCounterType;
}

export default function TreePlantingCounter({ data }: TreePlantingCounterProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <TreePine className="h-6 w-6" />
          Tree Planting Counter
        </CardTitle>
        <CardDescription>
          Track our reforestation efforts and environmental impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Counter */}
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {formatNumber(data.totalPlanted)}
            </div>
            <div className="text-sm text-green-700 mb-4">Trees Planted</div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Goal</span>
                <span>{data.progress}%</span>
              </div>
              <Progress value={data.progress} className="h-3" />
              <div className="text-xs text-gray-600">
                Goal: {formatNumber(data.goal)} trees
              </div>
            </div>
          </div>

          {/* Carbon Offset */}
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatNumber(data.totalCarbonOffset)}
            </div>
            <div className="text-sm text-blue-700 mb-4">kg CO2 Offset</div>
            
            <div className="text-xs text-gray-600">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Leaf className="h-3 w-3" />
                <span>Lifetime carbon sequestration</span>
              </div>
              <div>~{Math.round(data.totalCarbonOffset / 22)} kg CO2 per tree</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Recent Plantings
            </h3>
            <div className="space-y-2">
              {data.recentPlantings.slice(0, 3).map((planting) => (
                <div key={planting.id} className="text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{planting.species}</span>
                    <Badge variant="outline" className="text-xs">
                      {planting.quantity}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {planting.location}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(planting.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location Breakdown */}
        <div className="mt-6">
          <h3 className="font-semibold text-sm mb-3">Planting Locations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.locations.map((location, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border">
                <div className="text-sm font-medium text-gray-900">{location.location}</div>
                <div className="text-lg font-bold text-green-600">{formatNumber(location.count)}</div>
                <div className="text-xs text-gray-600">
                  {formatNumber(location.carbonOffset)} kg CO2 offset
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 