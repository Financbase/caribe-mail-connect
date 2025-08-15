import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { CaribbeanButton } from '@/components/ui/caribbean-button';

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  loading?: boolean;
  onClick?: () => void;
}

export interface DashboardWidget {
  id: string;
  title: string;
  component: React.ReactNode;
  size: 'small' | 'medium' | 'large' | 'full';
  minHeight?: string;
  loading?: boolean;
  error?: string;
  refreshable?: boolean;
  onRefresh?: () => void;
}

export interface DashboardLayoutProps {
  title?: string;
  subtitle?: string;
  metrics?: DashboardMetric[];
  widgets?: DashboardWidget[];
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  className?: string;
  layout?: 'auto' | 'grid' | 'masonry';
  refreshInterval?: number;
}

/**
 * Caribbean-styled dashboard layout with metrics and widgets
 * Optimized for Puerto Rico mail carrier operations
 */
export function CaribbeanDashboard({
  title,
  subtitle,
  metrics = [],
  widgets = [],
  actions,
  loading = false,
  error,
  onRefresh,
  className,
  layout = 'auto',
  refreshInterval
}: DashboardLayoutProps) {
  const { t } = useLanguage();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Auto-refresh functionality
  useEffect(() => {
    if (!refreshInterval || !onRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
      setLastRefresh(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, onRefresh]);

  // Metric color classes
  const metricColorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-900',
    green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-900',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-900',
    red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-900',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-900'
  };

  // Widget size classes
  const widgetSizeClasses = {
    small: 'col-span-1 md:col-span-1',
    medium: 'col-span-1 md:col-span-2',
    large: 'col-span-1 md:col-span-3',
    full: 'col-span-1 md:col-span-4'
  };

  // Layout classes
  const layoutClasses = {
    auto: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    masonry: 'columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6'
  };

  const renderHeader = () => (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 caribbean-text">
            {title || t('dashboard', 'Panel de Control')}
          </h1>
          {subtitle && (
            <p className="mt-2 text-lg text-gray-600 caribbean-text">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-sm text-gray-500">
              {t('last_updated', 'Última actualización')}: {lastRefresh.toLocaleTimeString('es-PR')}
            </span>
          )}
          
          {onRefresh && (
            <CaribbeanButton
              variant="ghost"
              hierarchy="tertiary"
              size="sm"
              onClick={() => {
                onRefresh();
                setLastRefresh(new Date());
              }}
              disabled={loading}
            >
              🔄 {t('refresh', 'Actualizar')}
            </CaribbeanButton>
          )}
          
          {actions}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-red-600">⚠️</span>
            <p className="text-red-800 font-medium">
              {error}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderMetric = (metric: DashboardMetric) => {
    const colorClass = metricColorClasses[metric.color || 'blue'];
    
    return (
      <EnhancedCard
        key={metric.id}
        variant="interactive"
        className={cn(
          'cursor-pointer transition-all duration-200 hover:scale-105',
          colorClass,
          metric.onClick && 'hover:shadow-lg'
        )}
        onClick={metric.onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium opacity-80">
                {metric.title}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                {metric.loading ? (
                  <div className="w-16 h-8 bg-current opacity-20 rounded animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold">
                    {typeof metric.value === 'number' 
                      ? metric.value.toLocaleString('es-PR') 
                      : metric.value
                    }
                  </p>
                )}
                
                {metric.change && !metric.loading && (
                  <span className={cn(
                    'text-sm font-medium',
                    metric.change.type === 'increase' && 'text-green-600',
                    metric.change.type === 'decrease' && 'text-red-600',
                    metric.change.type === 'neutral' && 'text-gray-600'
                  )}>
                    {metric.change.type === 'increase' && '↗'}
                    {metric.change.type === 'decrease' && '↘'}
                    {metric.change.type === 'neutral' && '→'}
                    {Math.abs(metric.change.value)}% {metric.change.period}
                  </span>
                )}
              </div>
            </div>
            
            {metric.icon && (
              <div className="text-2xl opacity-60">
                {metric.icon}
              </div>
            )}
          </div>
        </CardContent>
      </EnhancedCard>
    );
  };

  const renderWidget = (widget: DashboardWidget) => {
    return (
      <EnhancedCard
        key={widget.id}
        variant="default"
        className={cn(
          widgetSizeClasses[widget.size],
          layout === 'masonry' && 'break-inside-avoid',
          widget.minHeight && `min-h-[${widget.minHeight}]`
        )}
        style={{ minHeight: widget.minHeight }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold caribbean-text">
            {widget.title}
          </CardTitle>
          
          {widget.refreshable && widget.onRefresh && (
            <CaribbeanButton
              variant="ghost"
              hierarchy="tertiary"
              size="sm"
              onClick={widget.onRefresh}
              disabled={widget.loading}
            >
              🔄
            </CaribbeanButton>
          )}
        </CardHeader>
        
        <CardContent className="pt-0">
          {widget.loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-primary-ocean border-t-transparent rounded-full animate-spin" />
                <span className="text-primary-ocean">
                  {t('loading', 'Cargando')}...
                </span>
              </div>
            </div>
          ) : widget.error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-3xl mb-3">⚠️</span>
              <p className="text-red-600 font-medium">
                {t('error_loading_widget', 'Error al cargar el componente')}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {widget.error}
              </p>
              {widget.onRefresh && (
                <CaribbeanButton
                  variant="ghost"
                  hierarchy="tertiary"
                  size="sm"
                  className="mt-3"
                  onClick={widget.onRefresh}
                >
                  {t('try_again', 'Intentar de nuevo')}
                </CaribbeanButton>
              )}
            </div>
          ) : (
            widget.component
          )}
        </CardContent>
      </EnhancedCard>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-ocean border-t-transparent rounded-full animate-spin" />
          <span className="text-xl text-primary-ocean font-medium">
            {t('loading_dashboard', 'Cargando panel de control')}...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('caribbean-dashboard p-6', className)}>
      {renderHeader()}
      
      {/* Metrics Grid */}
      {metrics.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map(renderMetric)}
          </div>
        </div>
      )}
      
      {/* Widgets Grid */}
      {widgets.length > 0 && (
        <div className={layoutClasses[layout]}>
          {widgets.map(renderWidget)}
        </div>
      )}
      
      {/* Empty State */}
      {metrics.length === 0 && widgets.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-6xl mb-4">📊</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 caribbean-text">
            {t('no_dashboard_data', 'No hay datos en el panel')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('add_widgets_message', 'Agrega métricas y componentes para comenzar')}
          </p>
          {onRefresh && (
            <CaribbeanButton
              variant="primary"
              hierarchy="primary"
              onClick={onRefresh}
            >
              {t('load_data', 'Cargar datos')}
            </CaribbeanButton>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-built dashboard widgets for common use cases
export const DashboardWidgets = {
  QuickStats: ({ stats }: { stats: Array<{ label: string; value: string | number; color?: string }> }) => (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">{stat.label}</span>
          <span className={cn(
            'text-lg font-bold',
            stat.color || 'text-primary-ocean'
          )}>
            {typeof stat.value === 'number' ? stat.value.toLocaleString('es-PR') : stat.value}
          </span>
        </div>
      ))}
    </div>
  ),

  RecentActivity: ({ activities }: { activities: Array<{ time: string; description: string; type?: 'info' | 'success' | 'warning' | 'error' }> }) => (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <div className={cn(
            'w-2 h-2 rounded-full mt-2 flex-shrink-0',
            activity.type === 'success' && 'bg-green-500',
            activity.type === 'warning' && 'bg-yellow-500',
            activity.type === 'error' && 'bg-red-500',
            (!activity.type || activity.type === 'info') && 'bg-blue-500'
          )} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700">{activity.description}</p>
            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  ),

  WeatherWidget: ({ weather }: { weather: { temperature: number; condition: string; humidity: number; location: string } }) => {
    const { t } = useLanguage();
    
    return (
      <div className="text-center">
        <div className="text-4xl mb-2">
          {weather.condition.includes('sol') || weather.condition.includes('sun') ? '☀️' : 
           weather.condition.includes('lluvia') || weather.condition.includes('rain') ? '🌧️' : 
           weather.condition.includes('nublado') || weather.condition.includes('cloud') ? '☁️' : '🌤️'}
        </div>
        <p className="text-3xl font-bold text-primary-ocean mb-1">
          {weather.temperature}°C
        </p>
        <p className="text-sm text-gray-600 mb-3">{weather.condition}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('humidity', 'Humedad')}:</span>
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span>{t('location', 'Ubicación')}:</span>
            <span>{weather.location}</span>
          </div>
        </div>
      </div>
    );
  }
};

export default CaribbeanDashboard;
