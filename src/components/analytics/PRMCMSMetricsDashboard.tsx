import React, { useState, useEffect } from 'react';
import {
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

// Import the Untitled UI metrics component
import { MetricsCardGrayLight } from '../marketing/metrics/metrics-card-gray-light';

interface MetricData {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  icon: any;
  color: string;
}

interface PRMCMSMetricsDashboardProps {
  language?: 'es' | 'en';
  timeRange?: 'today' | 'week' | 'month' | 'year';
  onTimeRangeChange?: (range: string) => void;
}

const translations = {
  es: {
    title: "Panel de Métricas PRMCMS",
    subtitle: "Análisis en tiempo real del rendimiento operacional",
    timeRanges: {
      today: "Hoy",
      week: "Esta Semana",
      month: "Este Mes",
      year: "Este Año"
    },
    metrics: {
      packagesProcessed: "Paquetes Procesados",
      activeCustomers: "Clientes Activos",
      revenue: "Ingresos",
      avgProcessingTime: "Tiempo Promedio",
      deliveryRate: "Tasa de Entrega",
      customerSatisfaction: "Satisfacción",
      pendingPackages: "Paquetes Pendientes",
      notifications: "Notificaciones"
    },
    periods: {
      vs_yesterday: "vs ayer",
      vs_last_week: "vs semana anterior",
      vs_last_month: "vs mes anterior",
      vs_last_year: "vs año anterior"
    },
    insights: {
      title: "Insights Clave",
      peak_hours: "Horas pico: 9-11 AM y 2-4 PM",
      top_location: "Ubicación más activa: San Juan Centro",
      growth_trend: "Crecimiento constante en satisfacción del cliente"
    }
  },
  en: {
    title: "PRMCMS Metrics Dashboard",
    subtitle: "Real-time operational performance analytics",
    timeRanges: {
      today: "Today",
      week: "This Week",
      month: "This Month",
      year: "This Year"
    },
    metrics: {
      packagesProcessed: "Packages Processed",
      activeCustomers: "Active Customers",
      revenue: "Revenue",
      avgProcessingTime: "Avg Processing Time",
      deliveryRate: "Delivery Rate",
      customerSatisfaction: "Customer Satisfaction",
      pendingPackages: "Pending Packages",
      notifications: "Notifications"
    },
    periods: {
      vs_yesterday: "vs yesterday",
      vs_last_week: "vs last week",
      vs_last_month: "vs last month",
      vs_last_year: "vs last year"
    },
    insights: {
      title: "Key Insights",
      peak_hours: "Peak hours: 9-11 AM and 2-4 PM",
      top_location: "Most active location: San Juan Centro",
      growth_trend: "Consistent growth in customer satisfaction"
    }
  }
};

// Mock data generator
const generateMetrics = (timeRange: string, language: 'es' | 'en'): MetricData[] => {
  const t = translations[language];
  
  const baseMetrics = {
    today: {
      packages: 127,
      customers: 89,
      revenue: 2340,
      avgTime: 8.5,
      deliveryRate: 94,
      satisfaction: 4.7,
      pending: 23,
      notifications: 156
    },
    week: {
      packages: 856,
      customers: 234,
      revenue: 15680,
      avgTime: 7.2,
      deliveryRate: 96,
      satisfaction: 4.8,
      pending: 45,
      notifications: 1024
    },
    month: {
      packages: 3420,
      customers: 567,
      revenue: 68900,
      avgTime: 6.8,
      deliveryRate: 97,
      satisfaction: 4.9,
      pending: 67,
      notifications: 4567
    },
    year: {
      packages: 45000,
      customers: 2340,
      revenue: 856000,
      avgTime: 7.0,
      deliveryRate: 95,
      satisfaction: 4.6,
      pending: 234,
      notifications: 45000
    }
  };

  const data = baseMetrics[timeRange as keyof typeof baseMetrics];
  
  return [
    {
      id: 'packages',
      title: t.metrics.packagesProcessed,
      value: data.packages.toLocaleString(),
      subtitle: t.periods[`vs_${timeRange === 'today' ? 'yesterday' : timeRange === 'week' ? 'last_week' : timeRange === 'month' ? 'last_month' : 'last_year'}` as keyof typeof t.periods],
      change: {
        value: 12.5,
        type: 'increase' as const,
        period: timeRange
      },
      icon: Package,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'customers',
      title: t.metrics.activeCustomers,
      value: data.customers.toLocaleString(),
      subtitle: t.periods[`vs_${timeRange === 'today' ? 'yesterday' : timeRange === 'week' ? 'last_week' : timeRange === 'month' ? 'last_month' : 'last_year'}` as keyof typeof t.periods],
      change: {
        value: 8.3,
        type: 'increase' as const,
        period: timeRange
      },
      icon: Users,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'revenue',
      title: t.metrics.revenue,
      value: `$${data.revenue.toLocaleString()}`,
      subtitle: t.periods[`vs_${timeRange === 'today' ? 'yesterday' : timeRange === 'week' ? 'last_week' : timeRange === 'month' ? 'last_month' : 'last_year'}` as keyof typeof t.periods],
      change: {
        value: 15.7,
        type: 'increase' as const,
        period: timeRange
      },
      icon: DollarSign,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'processing_time',
      title: t.metrics.avgProcessingTime,
      value: `${data.avgTime} min`,
      subtitle: t.periods[`vs_${timeRange === 'today' ? 'yesterday' : timeRange === 'week' ? 'last_week' : timeRange === 'month' ? 'last_month' : 'last_year'}` as keyof typeof t.periods],
      change: {
        value: -5.2,
        type: 'decrease' as const,
        period: timeRange
      },
      icon: Clock,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'delivery_rate',
      title: t.metrics.deliveryRate,
      value: `${data.deliveryRate}%`,
      subtitle: t.periods[`vs_${timeRange === 'today' ? 'yesterday' : timeRange === 'week' ? 'last_week' : timeRange === 'month' ? 'last_month' : 'last_year'}` as keyof typeof t.periods],
      change: {
        value: 2.1,
        type: 'increase' as const,
        period: timeRange
      },
      icon: CheckCircle,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      id: 'satisfaction',
      title: t.metrics.customerSatisfaction,
      value: `${data.satisfaction}/5.0`,
      subtitle: t.periods[`vs_${timeRange === 'today' ? 'yesterday' : timeRange === 'week' ? 'last_week' : timeRange === 'month' ? 'last_month' : 'last_year'}` as keyof typeof t.periods],
      change: {
        value: 0.3,
        type: 'increase' as const,
        period: timeRange
      },
      icon: TrendingUp,
      color: 'bg-pink-100 text-pink-600'
    }
  ];
};

export function PRMCMSMetricsDashboard({ 
  language = 'es', 
  timeRange = 'today',
  onTimeRangeChange 
}: PRMCMSMetricsDashboardProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const t = translations[language];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMetrics(generateMetrics(timeRange, language));
      setLoading(false);
    }, 500);
  }, [timeRange, language]);

  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decrease':
        return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-ocean-50 via-orange-50 to-green-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-ocean-600 to-orange-600 rounded-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
            {Object.entries(t.timeRanges).map(([key, label]) => (
              <button
                key={key}
                onClick={() => onTimeRangeChange?.(key)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  timeRange === key
                    ? 'bg-ocean-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {metric.change && (
                    <div className={`flex items-center space-x-1 ${getChangeColor(metric.change.type)}`}>
                      {getChangeIcon(metric.change.type)}
                      <span className="text-sm font-medium">
                        {Math.abs(metric.change.value)}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    {metric.title}
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {metric.value}
                  </div>
                  <p className="text-xs text-gray-500">
                    {metric.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Key Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-ocean-600" />
          {t.insights.title}
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-800">{t.insights.peak_hours}</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-orange-800">{t.insights.top_location}</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-800">{t.insights.growth_trend}</span>
          </div>
        </div>
      </div>

      {/* Untitled UI Metrics Integration */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-ocean-50 to-orange-50">
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'es' ? 'Métricas Empresariales' : 'Business Metrics'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {language === 'es' 
              ? 'Indicadores clave de rendimiento empresarial' 
              : 'Key business performance indicators'
            }
          </p>
        </div>
        <MetricsCardGrayLight />
      </div>
    </div>
  );
}

export default PRMCMSMetricsDashboard;
