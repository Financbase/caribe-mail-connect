import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Home, MapPin, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';
import type { VirtualMailbox, MailPiece } from '@/hooks/useVirtualMailbox';

interface VirtualMailboxDashboardProps {
  virtualMailboxes: VirtualMailbox[];
  mailPieces: MailPiece[];
  loading: boolean;
}

export function VirtualMailboxDashboard({ 
  virtualMailboxes, 
  mailPieces, 
  loading 
}: VirtualMailboxDashboardProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = {
    totalMailboxes: virtualMailboxes.length,
    activeMailboxes: virtualMailboxes.filter(vm => vm.status === 'active').length,
    totalRevenue: virtualMailboxes.reduce((sum, vm) => sum + vm.monthly_fee, 0),
    averageActivity: mailPieces.length / Math.max(virtualMailboxes.length, 1),
  };

  const tierStats = virtualMailboxes.reduce((acc, vm) => {
    acc[vm.service_tier] = (acc[vm.service_tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Home className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalMailboxes}</p>
                <p className="text-sm text-muted-foreground">
                  {isSpanish ? 'Buzones Totales' : 'Total Mailboxes'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.activeMailboxes}</p>
                <p className="text-sm text-muted-foreground">
                  {isSpanish ? 'Activos' : 'Active'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-muted-foreground">
                  {isSpanish ? 'Ingresos Mensuales' : 'Monthly Revenue'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">{stats.averageActivity.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">
                  {isSpanish ? 'Actividad Promedio' : 'Avg Activity'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Tier Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isSpanish ? 'Distribución de Niveles de Servicio' : 'Service Tier Distribution'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(tierStats).map(([tier, count]) => {
              const percentage = (count / stats.totalMailboxes) * 100;
              return (
                <div key={tier} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {tier}
                      </Badge>
                      <span className="text-sm">
                        {count} {isSpanish ? 'buzones' : 'mailboxes'}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Mailboxes */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isSpanish ? 'Buzones Recientes' : 'Recent Mailboxes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {virtualMailboxes.slice(0, 5).map((mailbox) => {
              const recentMail = mailPieces.filter(mp => mp.virtual_mailbox_id === mailbox.id);
              
              return (
                <div key={mailbox.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {mailbox.address_line1}
                      </span>
                      <Badge variant="outline" className="capitalize">
                        {mailbox.service_tier}
                      </Badge>
                      <Badge 
                        variant={mailbox.status === 'active' ? 'default' : 'secondary'}
                      >
                        {mailbox.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {mailbox.city}, {mailbox.state} {mailbox.zip_code}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(mailbox.monthly_fee)}
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {recentMail.length} {isSpanish ? 'correos' : 'pieces'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}