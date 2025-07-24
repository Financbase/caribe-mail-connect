import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface PeakHoursHeatmapProps {
  data: Array<{
    hour: number;
    count: number;
  }>;
}

export function PeakHoursHeatmap({ data }: PeakHoursHeatmapProps) {
  const { t } = useLanguage();

  const maxCount = Math.max(...data.map(d => d.count));
  
  const getIntensity = (count: number) => {
    if (maxCount === 0) return 0;
    return count / maxCount;
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-100';
    if (intensity < 0.25) return 'bg-blue-200';
    if (intensity < 0.5) return 'bg-blue-400';
    if (intensity < 0.75) return 'bg-blue-600';
    return 'bg-blue-800';
  };

  const getIntensityTextColor = (intensity: number) => {
    return intensity > 0.5 ? 'text-white' : 'text-gray-700';
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Peak Hours Heatmap')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-6 gap-1 text-xs">
            {data.map((hourData) => {
              const intensity = getIntensity(hourData.count);
              return (
                <div
                  key={hourData.hour}
                  className={`
                    aspect-square flex flex-col items-center justify-center rounded
                    ${getIntensityColor(intensity)} ${getIntensityTextColor(intensity)}
                    transition-all duration-200 hover:scale-105 cursor-pointer
                  `}
                  title={`${formatHour(hourData.hour)}: ${hourData.count} packages`}
                >
                  <div className="font-medium text-xs">
                    {hourData.hour.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs">
                    {hourData.count}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>{t('Less activity')}</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded"></div>
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <div className="w-3 h-3 bg-blue-800 rounded"></div>
            </div>
            <span>{t('More activity')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}