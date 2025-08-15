import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface RevenueChartProps {
  data: Array<{
    month: string;
    mailboxRevenue: number;
    packageFees: number;
    total: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { t } = useLanguage();

  const formatMonth = (monthString: string) => {
    const date = new Date(monthString + '-01');
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      year: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: unknown) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{formatMonth(label)}</p>
          {payload.map((entry: unknown, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
          <div className="border-t border-border pt-2 mt-2">
            <p className="font-medium text-sm">
              {t('Total')}: {formatCurrency(payload[0].payload.total)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Monthly Revenue Breakdown')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month"
                tickFormatter={formatMonth}
                className="text-xs"
              />
              <YAxis 
                tickFormatter={formatCurrency}
                className="text-xs"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="mailboxRevenue" 
                stackId="a" 
                fill="hsl(var(--primary-ocean))"
                name={t('Mailbox Revenue')}
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="packageFees" 
                stackId="a" 
                fill="hsl(var(--primary-palm))"
                name={t('Package Fees')}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}