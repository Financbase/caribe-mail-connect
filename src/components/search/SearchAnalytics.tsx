import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Search, AlertTriangle } from 'lucide-react';

interface SearchAnalyticsProps {
  searchHistory: Array<{ query: string; timestamp: Date; results: number }>;
  popularSearches: string[];
  noResultsQueries: string[];
}

export function SearchAnalytics({ 
  searchHistory, 
  popularSearches, 
  noResultsQueries 
}: SearchAnalyticsProps) {
  const analytics = useMemo(() => {
    const totalSearches = searchHistory.length;
    const successfulSearches = searchHistory.filter(s => s.results > 0).length;
    const avgResults = searchHistory.reduce((acc, s) => acc + s.results, 0) / totalSearches || 0;
    
    // Calculate trends (last 7 days vs previous 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const recentSearches = searchHistory.filter(s => s.timestamp >= sevenDaysAgo);
    const previousSearches = searchHistory.filter(s => 
      s.timestamp >= fourteenDaysAgo && s.timestamp < sevenDaysAgo
    );
    
    const trend = recentSearches.length - previousSearches.length;
    
    return {
      totalSearches,
      successfulSearches,
      successRate: totalSearches > 0 ? (successfulSearches / totalSearches) * 100 : 0,
      avgResults: Math.round(avgResults * 10) / 10,
      trend,
      recentCount: recentSearches.length
    };
  }, [searchHistory]);

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total búsquedas</p>
                <p className="text-2xl font-bold">{analytics.totalSearches}</p>
              </div>
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa de éxito</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(analytics.successRate)}`}>
                  {analytics.successRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Promedio resultados</p>
                <p className="text-2xl font-bold">{analytics.avgResults}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tendencia 7d</p>
                <div className="flex items-center space-x-1">
                  <p className={`text-2xl font-bold ${analytics.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.trend >= 0 ? '+' : ''}{analytics.trend}
                  </p>
                  {analytics.trend >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Searches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Búsquedas populares
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularSearches.length > 0 ? (
              popularSearches.map((query, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm truncate flex-1">{query}</span>
                  <Badge variant="secondary" className="ml-2">
                    #{index + 1}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay datos suficientes</p>
            )}
          </CardContent>
        </Card>

        {/* Success Rate Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Búsquedas exitosas</span>
                <span>{analytics.successfulSearches}/{analytics.totalSearches}</span>
              </div>
              <Progress value={analytics.successRate} className="h-2" />
            </div>
            
            <div className="pt-2 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Excelente (&gt;80%)</span>
                <span className="text-green-600">Óptimo</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Bueno (60-80%)</span>
                <span className="text-yellow-600">Mejorable</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Bajo (&lt;60%)</span>
                <span className="text-red-600">Crítico</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* No Results Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Sin resultados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {noResultsQueries.length > 0 ? (
              noResultsQueries.slice(0, 5).map((query, index) => (
                <div key={index} className="p-2 bg-muted rounded-lg">
                  <p className="text-sm font-medium truncate">{query}</p>
                  <p className="text-xs text-muted-foreground">
                    Considera agregar contenido relacionado
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                ¡Excelente! Todas las búsquedas tienen resultados
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}