import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, User, Wrench, AlertTriangle, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { MailboxStats } from '@/hooks/useMailboxes';

interface MailboxStatsCardProps {
  stats: MailboxStats;
}

export function MailboxStatsCard({ stats }: MailboxStatsCardProps) {
  const { t } = useLanguage();

  const statItems = [
    {
      label: t('Total'),
      value: stats.total,
      icon: Mail,
      color: 'bg-gray-500'
    },
    {
      label: t('Available'),
      value: stats.available,
      icon: Mail,
      color: 'bg-primary-palm'
    },
    {
      label: t('Occupied'),
      value: stats.occupied,
      icon: User,
      color: 'bg-primary-ocean'
    },
    {
      label: t('Maintenance'),
      value: stats.maintenance,
      icon: Wrench,
      color: 'bg-gray-600'
    },
    {
      label: t('Expiring Soon'),
      value: stats.expiring,
      icon: Clock,
      color: 'bg-sunset'
    },
    {
      label: t('Overdue'),
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'bg-coral'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t('Mailbox Overview')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {statItems.map((item) => (
            <div key={item.label} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${item.color} mb-2`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {item.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}