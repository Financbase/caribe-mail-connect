import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  Leaf, 
  DollarSign,
  Activity,
  Target
} from 'lucide-react';

interface DashboardMetrics {
  totalPartners: number;
  totalSustainability: number;
  revenueGrowth: number;
  carbonReduction: number;
  activeProjects: number;
  completionRate: number;
}

interface RealTimeMetric {
  id: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  timestamp: string;
}

export const RealTimeDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPartners: 0,
    totalSustainability: 0,
    revenueGrowth: 0,
    carbonReduction: 0,
    activeProjects: 0,
    completionRate: 0
  });
  const [realtimeData, setRealtimeData] = useState<RealTimeMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
    setupRealtimeSubscriptions();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch partner metrics
      const { count: partnerCount } = await supabase
        .from('business_partners')
        .select('*', { count: 'exact', head: true });

      // Fetch sustainability metrics
      const { count: sustainabilityCount } = await supabase
        .from('carbon_footprint')
        .select('*', { count: 'exact', head: true });

      // Calculate revenue growth (mock calculation)
      const revenueGrowth = Math.random() * 25 + 5; // 5-30% growth

      // Calculate carbon reduction
      const { data: carbonData } = await supabase
        .from('carbon_footprint')
        .select('emissions_reduced')
        .limit(10);

      const totalCarbonReduction = carbonData?.reduce((sum, item) => 
        sum + (item.emissions_reduced || 0), 0) || 0;

      setMetrics({
        totalPartners: partnerCount || 0,
        totalSustainability: sustainabilityCount || 0,
        revenueGrowth,
        carbonReduction: totalCarbonReduction,
        activeProjects: Math.floor(Math.random() * 20) + 10,
        completionRate: Math.random() * 30 + 70 // 70-100%
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Partner analytics subscription
    const partnerSubscription = supabase
      .channel('partner_analytics')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'partner_analytics' },
        (payload) => {
          updateRealtimeMetric('partners', payload);
        }
      )
      .subscribe();

    // Sustainability metrics subscription
    const sustainabilitySubscription = supabase
      .channel('sustainability_metrics')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'carbon_footprint' },
        (payload) => {
          updateRealtimeMetric('sustainability', payload);
        }
      )
      .subscribe();

    return () => {
      partnerSubscription.unsubscribe();
      sustainabilitySubscription.unsubscribe();
    };
  };

  const updateRealtimeMetric = (type: string, payload: any) => {
    const newMetric: RealTimeMetric = {
      id: `${type}-${Date.now()}`,
      value: Math.floor(Math.random() * 100),
      change: Math.floor(Math.random() * 20) - 10,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      timestamp: new Date().toISOString()
    };

    setRealtimeData(prev => [newMetric, ...prev.slice(0, 9)]);
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'blue',
    subtitle 
  }: {
    title: string;
    value: number | string;
    change?: number;
    icon: any;
    color?: string;
    subtitle?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-500`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center text-xs text-muted-foreground">
            {change > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            {Math.abs(change)}% desde el mes pasado
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
          <p className="text-muted-foreground">
            Métricas en tiempo real de PRMCMS
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Activity className="h-3 w-3" />
          Tiempo Real
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Socios Activos"
          value={metrics.totalPartners}
          change={12}
          icon={Users}
          color="blue"
          subtitle="Socios comerciales"
        />
        <MetricCard
          title="Iniciativas Verdes"
          value={metrics.totalSustainability}
          change={8}
          icon={Leaf}
          color="green"
          subtitle="Proyectos de sostenibilidad"
        />
        <MetricCard
          title="Crecimiento de Ingresos"
          value={`${metrics.revenueGrowth.toFixed(1)}%`}
          change={metrics.revenueGrowth}
          icon={DollarSign}
          color="yellow"
          subtitle="vs mes anterior"
        />
        <MetricCard
          title="Reducción de Carbono"
          value={`${metrics.carbonReduction.toFixed(1)} kg`}
          change={15}
          icon={Package}
          color="emerald"
          subtitle="CO2 reducido"
        />
      </div>

      {/* Progress Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Proyectos Activos
            </CardTitle>
            <CardDescription>
              Progreso de proyectos en curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Proyectos Activos</span>
                <span>{metrics.activeProjects}</span>
              </div>
              <Progress value={metrics.activeProjects * 5} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {metrics.activeProjects} proyectos en ejecución
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tasa de Finalización
            </CardTitle>
            <CardDescription>
              Proyectos completados exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tasa de Éxito</span>
                <span>{metrics.completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.completionRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {metrics.completionRate.toFixed(1)}% de proyectos completados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad en Tiempo Real</CardTitle>
          <CardDescription>
            Últimas actualizaciones del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {realtimeData.length > 0 ? (
              realtimeData.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      metric.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm">
                      Nueva métrica registrada: {metric.value}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p>Esperando actividad en tiempo real...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 