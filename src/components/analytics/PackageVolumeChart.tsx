import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface PackageVolumeChartProps {
  data: Array<{
    date: string;
    received: number;
    delivered: number;
  }>;
}

export function PackageVolumeChart({ data }: PackageVolumeChartProps) {
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('Daily Package Volume')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date"
                tickFormatter={formatDate}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip 
                labelFormatter={(value) => formatDate(value as string)}
                formatter={(value, name) => [
                  value,
                  name === 'received' ? t('Received') : t('Delivered')
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="received" 
                stroke="hsl(var(--primary-ocean))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary-ocean))', strokeWidth: 2 }}
                name={t('Received')}
              />
              <Line 
                type="monotone" 
                dataKey="delivered" 
                stroke="hsl(var(--primary-palm))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary-palm))', strokeWidth: 2 }}
                name={t('Delivered')}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}