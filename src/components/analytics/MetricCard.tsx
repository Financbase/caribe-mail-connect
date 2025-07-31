import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: number;
  format?: 'number' | 'currency' | 'percentage';
  icon?: React.ComponentType<{ className?: string }>;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  description?: string;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  previousValue, 
  format = 'number',
  icon: Icon,
  trend,
  trendDirection,
  description,
  className
}: MetricCardProps) {
  const { t } = useLanguage();

  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  const calculateChange = () => {
    if (!previousValue || typeof value !== 'number') return null;
    
    const change = ((value - previousValue) / previousValue) * 100;
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  const change = calculateChange();

  return (
    <Card className={`relative overflow-hidden ${className || ''}`} data-testid="metric-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" data-testid="metric-icon" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">
          {formatValue(value)}
        </div>
        {(change || trend) && (
          <div className="flex items-center text-sm">
            {trend ? (
              <>
                {trendDirection === 'up' && <TrendingUp className="h-3 w-3 text-primary-palm mr-1" />}
                {trendDirection === 'down' && <TrendingDown className="h-3 w-3 text-coral mr-1" />}
                <span className={trendDirection === 'up' ? 'text-primary-palm' : 'text-coral'}>
                  {trend}
                </span>
              </>
            ) : change && (
              <>
                {change.direction === 'up' && (
                  <>
                    <TrendingUp className="h-3 w-3 text-primary-palm mr-1" />
                    <span className="text-primary-palm">+{change.value.toFixed(1)}%</span>
                  </>
                )}
                {change.direction === 'down' && (
                  <>
                    <TrendingDown className="h-3 w-3 text-coral mr-1" />
                    <span className="text-coral">-{change.value.toFixed(1)}%</span>
                  </>
                )}
                {change.direction === 'neutral' && (
                  <>
                    <Minus className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-muted-foreground">0%</span>
                  </>
                )}
                <span className="text-muted-foreground ml-1">
                  {t('from last period')}
                </span>
              </>
            )}
          </div>
        )}
        {description && (
          <div className="text-sm text-muted-foreground mt-1">
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}