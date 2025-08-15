import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  MessageSquare, 
  Smartphone,
  DollarSign,
  Clock,
  Users,
  Send,
  CheckCircle,
  XCircle,
  Eye,
  MousePointer
} from 'lucide-react';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';

export function NotificationAnalyticsDashboard() {
  const { analytics, analyticsLoading, templates } = useNotificationSystem();

  // 2025-08-13: derive metrics from Supabase analytics
  const summaryMetrics = useMemo(() => {
    const totals = analytics?.reduce(
      (acc, item) => {
        acc.totalSent += item.total_sent;
        acc.totalDelivered += item.total_delivered;
        acc.totalFailed += item.total_failed;
        acc.totalOpened += item.total_opened;
        acc.totalClicked += item.total_clicked;
        acc.totalCost += item.total_cost_cents;
        if (item.avg_response_time_minutes) {
          acc.responseTime += item.avg_response_time_minutes;
          acc.responseCount += 1;
        }
        return acc;
      },
      {
        totalSent: 0,
        totalDelivered: 0,
        totalFailed: 0,
        totalOpened: 0,
        totalClicked: 0,
        totalCost: 0,
        responseTime: 0,
        responseCount: 0,
      }
    );

    return {
      totalSent: totals?.totalSent ?? 0,
      totalDelivered: totals?.totalDelivered ?? 0,
      totalFailed: totals?.totalFailed ?? 0,
      totalOpened: totals?.totalOpened ?? 0,
      totalClicked: totals?.totalClicked ?? 0,
      totalCost: totals?.totalCost ?? 0,
      avgResponseTime:
        totals && totals.responseCount > 0
          ? Math.round(totals.responseTime / totals.responseCount)
          : 0,
    };
  }, [analytics]);

  const channelMetrics = useMemo(() => {
    const map = new Map<string, any>();
    analytics?.forEach((item) => {
      const current = map.get(item.channel) || {
        channel: item.channel,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        cost: 0,
      };
      current.sent += item.total_sent;
      current.delivered += item.total_delivered;
      current.opened += item.total_opened;
      current.clicked += item.total_clicked;
      current.cost += item.total_cost_cents;
      map.set(item.channel, current);
    });

    return Array.from(map.values()).map((channel) => {
      const icon =
        channel.channel === 'email'
          ? Mail
          : channel.channel === 'sms'
          ? MessageSquare
          : Smartphone;
      const color =
        channel.channel === 'email'
          ? 'text-blue-500'
          : channel.channel === 'sms'
          ? 'text-green-500'
          : 'text-green-600';
      return {
        ...channel,
        icon,
        color,
        deliveryRate:
          channel.sent > 0
            ? Number(((channel.delivered / channel.sent) * 100).toFixed(1))
            : 0,
        openRate:
          channel.delivered > 0
            ? Number(((channel.opened / channel.delivered) * 100).toFixed(1))
            : 0,
        clickRate:
          channel.opened > 0
            ? Number(((channel.clicked / channel.opened) * 100).toFixed(1))
            : 0,
      };
    });
  }, [analytics]);

  const topPerformingTemplates = useMemo(() => {
    const templateMap = Object.fromEntries(
      (templates || []).map((t) => [t.id, t])
    );
    return (
      analytics
        ?.filter((a) => a.template_id)
        .map((a) => {
          const tpl = templateMap[a.template_id!];
          return {
            name: tpl?.name || a.template_id!,
            type: tpl?.type || 'email',
            sent: a.total_sent,
            openRate: a.open_rate || 0,
            clickRate: a.click_rate || 0,
            category: tpl?.category,
          };
        })
        .sort((a, b) => b.openRate - a.openRate)
        .slice(0, 5) || []
    );
  }, [analytics, templates]);

  const recentActivity = useMemo(() => {
    return (
      analytics
        ?.slice(0, 5)
        .map((a, idx) => ({
          id: idx,
          type: a.total_failed > 0 ? 'warning' : 'success',
          message: `${a.channel} procesó ${a.total_sent} mensajes`,
          count: a.total_sent,
          timestamp: new Date(a.date).toLocaleString('es-PR'),
        })) || []
    );
  }, [analytics]);

  const calculateDeliveryRate = () => {
    return ((summaryMetrics.totalDelivered / summaryMetrics.totalSent) * 100).toFixed(1);
  };

  const calculateOpenRate = () => {
    return ((summaryMetrics.totalOpened / summaryMetrics.totalDelivered) * 100).toFixed(1);
  };

  const calculateClickRate = () => {
    return ((summaryMetrics.totalClicked / summaryMetrics.totalOpened) * 100).toFixed(1);
  };

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString('es-PR', {
      style: 'currency',
      currency: 'USD'
    });
  };

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p>Cargando analíticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enviadas</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% desde el mes pasado
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Entrega</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateDeliveryRate()}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{summaryMetrics.totalDelivered.toLocaleString()} entregadas</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Apertura</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateOpenRate()}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{summaryMetrics.totalOpened.toLocaleString()} abiertas</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryMetrics.totalCost)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% vs mes pasado
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="channels" className="space-y-6">
        <TabsList>
          <TabsTrigger value="channels">Por Canal</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-6">
          {/* Channel Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Canal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {channelMetrics.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <div key={channel.channel} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${channel.color}`} />
                          <span className="font-medium capitalize">{channel.channel}</span>
                          <Badge variant="outline">{channel.sent.toLocaleString()} enviadas</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(channel.cost)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Entrega</span>
                            <span className="font-medium">{channel.deliveryRate}%</span>
                          </div>
                          <Progress value={channel.deliveryRate} className="h-2" />
                        </div>
                        
                        {channel.openRate > 0 && (
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Apertura</span>
                              <span className="font-medium">{channel.openRate}%</span>
                            </div>
                            <Progress value={channel.openRate} className="h-2" />
                          </div>
                        )}
                        
                        {channel.clickRate > 0 && (
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Clics</span>
                              <span className="font-medium">{channel.clickRate}%</span>
                            </div>
                            <Progress value={channel.clickRate} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Top Performing Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Plantillas con Mejor Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingTemplates.map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{template.name}</span>
                        <Badge variant="outline">{template.type}</Badge>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {template.sent} enviadas
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-4 text-sm">
                        <span>📧 {template.openRate}%</span>
                        <span>👆 {template.clickRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                    <Badge variant="outline">{activity.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}