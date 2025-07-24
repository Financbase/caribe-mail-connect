import { useState } from 'react';
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
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const { analytics, analyticsLoading } = useNotificationSystem();

  // Mock data for demonstration - in real implementation, this would come from the analytics
  const summaryMetrics = {
    totalSent: 2847,
    totalDelivered: 2654,
    totalFailed: 193,
    totalOpened: 1823,
    totalClicked: 456,
    totalCost: 14235, // in cents
    avgResponseTime: 23 // minutes
  };

  const channelMetrics = [
    {
      channel: 'email',
      icon: Mail,
      color: 'text-blue-500',
      sent: 1523,
      delivered: 1445,
      opened: 1234,
      clicked: 345,
      cost: 7615, // cents
      deliveryRate: 94.8,
      openRate: 85.4,
      clickRate: 28.0
    },
    {
      channel: 'sms',
      icon: MessageSquare,
      color: 'text-green-500',
      sent: 856,
      delivered: 832,
      opened: 589,
      clicked: 111,
      cost: 5120,
      deliveryRate: 97.2,
      openRate: 70.8,
      clickRate: 18.8
    },
    {
      channel: 'whatsapp',
      icon: Smartphone,
      color: 'text-green-600',
      sent: 468,
      delivered: 377,
      opened: 0, // WhatsApp doesn't track opens
      clicked: 0,
      cost: 1500,
      deliveryRate: 80.6,
      openRate: 0,
      clickRate: 0
    }
  ];

  const topPerformingTemplates = [
    {
      name: 'Package Arrival - Spanish',
      type: 'email',
      sent: 456,
      openRate: 92.3,
      clickRate: 34.2,
      category: 'arrival'
    },
    {
      name: 'Package Reminder - SMS',
      type: 'sms',
      sent: 234,
      openRate: 78.9,
      clickRate: 23.1,
      category: 'reminder'
    },
    {
      name: 'Mailbox Expiry Notice',
      type: 'email',
      sent: 123,
      openRate: 88.6,
      clickRate: 45.7,
      category: 'payment'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'success',
      message: 'Email batch enviado exitosamente',
      count: 245,
      timestamp: '2 minutos atrás'
    },
    {
      id: 2,
      type: 'warning',
      message: 'SMS batch con fallos parciales',
      count: 23,
      timestamp: '15 minutos atrás'
    },
    {
      id: 3,
      type: 'info',
      message: 'WhatsApp template aprobado',
      count: 1,
      timestamp: '1 hora atrás'
    }
  ];

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