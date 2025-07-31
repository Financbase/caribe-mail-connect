import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Target,
  Users,
  DollarSign,
  Star,
  Award,
  Trophy,
  Medal,
  Crown,
  Zap,
  Activity,
  Globe,
  Building,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  MapPin,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { useFranchiseAnalytics } from '@/hooks/useFranchiseAnalytics';

interface NetworkGrowthMetrics {
  total_locations: number;
  new_locations_this_year: number;
  growth_rate: number;
  target_locations: number;
  market_coverage: number;
  expansion_opportunities: {
    region: string;
    potential_locations: number;
    market_size: number;
    competition_level: 'low' | 'medium' | 'high';
  }[];
  monthly_growth: {
    month: string;
    locations: number;
    revenue: number;
    customers: number;
  }[];
}

interface FranchiseeSatisfaction {
  overall_score: number;
  total_surveys: number;
  response_rate: number;
  satisfaction_breakdown: {
    category: string;
    score: number;
    responses: number;
  }[];
  top_concerns: {
    issue: string;
    frequency: number;
    severity: 'low' | 'medium' | 'high';
  }[];
  improvement_areas: {
    area: string;
    current_score: number;
    target_score: number;
    priority: 'low' | 'medium' | 'high';
  }[];
}

interface BrandConsistencyScore {
  overall_score: number;
  total_assessments: number;
  consistency_breakdown: {
    category: string;
    score: number;
    weight: number;
  }[];
  location_scores: {
    location_id: string;
    location_name: string;
    score: number;
    last_assessment: string;
    issues: string[];
  }[];
  improvement_recommendations: {
    category: string;
    recommendation: string;
    impact: 'low' | 'medium' | 'high';
    effort: 'low' | 'medium' | 'high';
  }[];
}

interface MarketPenetration {
  total_market_size: number;
  current_market_share: number;
  target_market_share: number;
  penetration_by_region: {
    region: string;
    current_share: number;
    target_share: number;
    growth_potential: number;
  }[];
  competitive_analysis: {
    competitor: string;
    market_share: number;
    strength: 'weak' | 'medium' | 'strong';
  }[];
  customer_segments: {
    segment: string;
    penetration_rate: number;
    growth_rate: number;
    potential: number;
  }[];
}

interface ROIAnalysis {
  average_roi: number;
  roi_by_location: {
    location_id: string;
    location_name: string;
    investment: number;
    annual_revenue: number;
    roi: number;
    payback_period: number;
  }[];
  roi_trends: {
    year: string;
    average_roi: number;
    best_performer: number;
    worst_performer: number;
  }[];
  roi_factors: {
    factor: string;
    impact: number;
    correlation: number;
  }[];
}

interface LeaderboardEntry {
  rank: number;
  location_id: string;
  location_name: string;
  owner: string;
  score: number;
  metrics: {
    revenue: number;
    growth_rate: number;
    customer_satisfaction: number;
    efficiency: number;
    compliance: number;
  };
  achievements: string[];
  badges: string[];
  trend: 'up' | 'down' | 'stable';
}

const ACHIEVEMENTS = [
  { id: 'top_performer', name: 'Mejor Rendimiento', icon: Trophy, color: 'text-yellow-600' },
  { id: 'growth_champion', name: 'Campeón de Crecimiento', icon: TrendingUp, color: 'text-green-600' },
  { id: 'customer_excellence', name: 'Excelencia al Cliente', icon: Star, color: 'text-blue-600' },
  { id: 'efficiency_master', name: 'Maestro de Eficiencia', icon: Zap, color: 'text-purple-600' },
  { id: 'compliance_leader', name: 'Líder en Cumplimiento', icon: CheckCircle, color: 'text-green-600' }
];

const BADGES = [
  { id: 'first_month', name: 'Primer Mes', icon: Calendar, color: 'bg-blue-100 text-blue-800' },
  { id: 'revenue_milestone', name: 'Hito de Ingresos', icon: DollarSign, color: 'bg-green-100 text-green-800' },
  { id: 'customer_loyalty', name: 'Lealtad del Cliente', icon: Users, color: 'bg-purple-100 text-purple-800' },
  { id: 'perfect_score', name: 'Puntuación Perfecta', icon: Award, color: 'bg-yellow-100 text-yellow-800' },
  { id: 'innovation', name: 'Innovación', icon: Zap, color: 'bg-orange-100 text-orange-800' }
];

export function FranchiseAnalytics() {
  const { 
    networkGrowth, 
    franchiseeSatisfaction, 
    brandConsistency, 
    marketPenetration, 
    roiAnalysis,
    leaderboard,
    loading 
  } = useFranchiseAnalytics();

  const [selectedPeriod, setSelectedPeriod] = useState('12m');
  const [selectedMetric, setSelectedMetric] = useState('overall');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-yellow-100';
    if (score >= 70) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getAchievementIcon = (achievementId: string) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return null;
    const Icon = achievement.icon;
    return <Icon className={`h-5 w-5 ${achievement.color}`} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics de Franquicias</h1>
          <p className="text-muted-foreground mt-2">
            Análisis profundo del rendimiento y crecimiento de la red
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Mes</SelectItem>
              <SelectItem value="3m">3 Meses</SelectItem>
              <SelectItem value="6m">6 Meses</SelectItem>
              <SelectItem value="12m">12 Meses</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crecimiento de Red</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{networkGrowth?.growth_rate || 0}%
            </div>
            <Progress value={networkGrowth?.growth_rate || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {networkGrowth?.new_locations_this_year || 0} nuevas locaciones este año
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {franchiseeSatisfaction?.overall_score || 0}/100
            </div>
            <Progress value={franchiseeSatisfaction?.overall_score || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {franchiseeSatisfaction?.total_surveys || 0} encuestas respondidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consistencia de Marca</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {brandConsistency?.overall_score || 0}/100
            </div>
            <Progress value={brandConsistency?.overall_score || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {brandConsistency?.total_assessments || 0} evaluaciones completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {roiAnalysis?.average_roi || 0}%
            </div>
            <Progress value={Math.min(roiAnalysis?.average_roi || 0, 100)} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Retorno de inversión promedio
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="growth" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="growth">Crecimiento</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfacción</TabsTrigger>
          <TabsTrigger value="consistency">Consistencia</TabsTrigger>
          <TabsTrigger value="penetration">Penetración</TabsTrigger>
          <TabsTrigger value="roi">ROI</TabsTrigger>
          <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Métricas de Crecimiento de Red</h2>
            <p className="text-muted-foreground">
              Análisis del crecimiento y expansión de la red de franquicias
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Oportunidades de Expansión</CardTitle>
                <CardDescription>
                  Regiones con mayor potencial de crecimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {networkGrowth?.expansion_opportunities?.map((opportunity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{opportunity.region}</p>
                        <p className="text-sm text-muted-foreground">
                          {opportunity.potential_locations} locaciones potenciales
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">${opportunity.market_size.toLocaleString()}</div>
                        <Badge variant={
                          opportunity.competition_level === 'low' ? 'default' :
                          opportunity.competition_level === 'medium' ? 'secondary' : 'destructive'
                        }>
                          {opportunity.competition_level === 'low' ? 'Baja' :
                           opportunity.competition_level === 'medium' ? 'Media' : 'Alta'} competencia
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cobertura de Mercado</CardTitle>
                <CardDescription>
                  Progreso hacia objetivos de cobertura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {networkGrowth?.market_coverage || 0}%
                    </div>
                    <p className="text-sm text-muted-foreground">Cobertura Actual</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Locaciones Actuales</span>
                      <span className="font-medium">{networkGrowth?.total_locations || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Objetivo</span>
                      <span className="font-medium">{networkGrowth?.target_locations || 0}</span>
                    </div>
                    <Progress value={networkGrowth?.market_coverage || 0} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Análisis de Satisfacción</h2>
            <p className="text-muted-foreground">
              Métricas de satisfacción de franquiciados y áreas de mejora
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Desglose por Categoría</CardTitle>
                <CardDescription>
                  Puntuaciones de satisfacción por área
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {franchiseeSatisfaction?.satisfaction_breakdown?.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category.category}</span>
                        <span className={`text-sm font-bold ${getScoreColor(category.score)}`}>
                          {category.score}/100
                        </span>
                      </div>
                      <Progress value={category.score} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {category.responses} respuestas
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Principales Preocupaciones</CardTitle>
                <CardDescription>
                  Problemas más reportados por franquiciados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {franchiseeSatisfaction?.top_concerns?.map((concern, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{concern.issue}</p>
                        <p className="text-sm text-muted-foreground">
                          {concern.frequency} reportes
                        </p>
                      </div>
                      <Badge variant={
                        concern.severity === 'high' ? 'destructive' :
                        concern.severity === 'medium' ? 'secondary' : 'outline'
                      }>
                        {concern.severity === 'high' ? 'Alta' :
                         concern.severity === 'medium' ? 'Media' : 'Baja'} severidad
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consistency" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Consistencia de Marca</h2>
            <p className="text-muted-foreground">
              Evaluación de la consistencia en la aplicación de estándares de marca
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Puntuaciones por Locación</CardTitle>
                <CardDescription>
                  Consistencia de marca por franquicia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brandConsistency?.location_scores?.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{location.location_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Evaluado: {new Date(location.last_assessment).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(location.score)}`}>
                          {location.score}/100
                        </div>
                        {location.issues.length > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {location.issues.length} problemas
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones de Mejora</CardTitle>
                <CardDescription>
                  Acciones sugeridas para mejorar la consistencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brandConsistency?.improvement_recommendations?.map((rec, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{rec.category}</span>
                        <div className="flex space-x-1">
                          <Badge variant="outline" className="text-xs">
                            Impacto: {rec.impact}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Esfuerzo: {rec.effort}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="penetration" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Análisis de Penetración de Mercado</h2>
            <p className="text-muted-foreground">
              Evaluación de la presencia en el mercado y oportunidades de crecimiento
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Penetración por Región</CardTitle>
                <CardDescription>
                  Cuota de mercado por región geográfica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketPenetration?.penetration_by_region?.map((region, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{region.region}</span>
                        <span className="text-sm font-bold">{region.current_share}%</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Actual</span>
                          <span>Objetivo: {region.target_share}%</span>
                        </div>
                        <Progress value={region.current_share} className="h-2" />
                        <div className="flex justify-between text-xs">
                          <span>Potencial de crecimiento</span>
                          <span className="text-green-600">+{region.growth_potential}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis Competitivo</CardTitle>
                <CardDescription>
                  Comparación con competidores del mercado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketPenetration?.competitive_analysis?.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{competitor.competitor}</p>
                        <p className="text-sm text-muted-foreground">
                          Cuota de mercado: {competitor.market_share}%
                        </p>
                      </div>
                      <Badge variant={
                        competitor.strength === 'strong' ? 'destructive' :
                        competitor.strength === 'medium' ? 'secondary' : 'outline'
                      }>
                        {competitor.strength === 'strong' ? 'Fuerte' :
                         competitor.strength === 'medium' ? 'Media' : 'Débil'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Análisis de ROI</h2>
            <p className="text-muted-foreground">
              Retorno de inversión por franquicia y factores de rendimiento
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ROI por Locación</CardTitle>
                <CardDescription>
                  Rendimiento de inversión por franquicia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roiAnalysis?.roi_by_location?.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{location.location_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Inversión: ${location.investment.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${location.roi >= 20 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {location.roi}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Recuperación: {location.payback_period} meses
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Factores de ROI</CardTitle>
                <CardDescription>
                  Elementos que más impactan el retorno de inversión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roiAnalysis?.roi_factors?.map((factor, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{factor.factor}</span>
                        <span className="text-sm font-bold">{factor.impact}%</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Correlación</span>
                        <span>{factor.correlation}</span>
                      </div>
                      <Progress value={Math.abs(factor.impact)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Ranking de Franquicias</h2>
            <p className="text-muted-foreground">
              Clasificación de franquicias con elementos de gamificación
            </p>
          </div>

          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <Card key={entry.location_id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600">
                        {index === 0 && <Crown className="h-6 w-6 text-white" />}
                        {index === 1 && <Medal className="h-6 w-6 text-white" />}
                        {index === 2 && <Trophy className="h-6 w-6 text-white" />}
                        {index > 2 && <span className="text-white font-bold text-lg">{entry.rank}</span>}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{entry.location_name}</CardTitle>
                        <CardDescription>{entry.owner}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{entry.score}</div>
                        <div className="text-sm text-muted-foreground">Puntuación</div>
                      </div>
                      {getTrendIcon(entry.trend)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">Ingresos</div>
                      <div className="text-lg font-bold text-green-600">
                        ${entry.metrics.revenue.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Crecimiento</div>
                      <div className="text-lg font-bold text-blue-600">
                        {entry.metrics.growth_rate}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Satisfacción</div>
                      <div className="text-lg font-bold text-yellow-600">
                        {entry.metrics.customer_satisfaction}/5
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Eficiencia</div>
                      <div className="text-lg font-bold text-purple-600">
                        {entry.metrics.efficiency}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Cumplimiento</div>
                      <div className="text-lg font-bold text-green-600">
                        {entry.metrics.compliance}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Logros:</span>
                      <div className="flex space-x-1">
                        {entry.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center space-x-1">
                            {getAchievementIcon(achievement)}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Insignias:</span>
                      <div className="flex space-x-1">
                        {entry.badges.map((badge, idx) => {
                          const badgeConfig = BADGES.find(b => b.id === badge);
                          if (!badgeConfig) return null;
                          return (
                            <Badge key={idx} className={badgeConfig.color}>
                              {badgeConfig.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 