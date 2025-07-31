// Social Analytics Component
// Comprehensive social media analytics dashboard with charts and insights

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Clock,
  Globe,
  Target,
  Award,
  Zap,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  Download,
  Filter
} from 'lucide-react';
import { SocialAnalytics, SocialPost, PlatformAnalytics } from '@/types/social';

interface SocialAnalyticsProps {
  analytics: SocialAnalytics;
  posts: SocialPost[];
  onExportData: (format: 'csv' | 'pdf') => void;
  onDateRangeChange: (range: string) => void;
}

const SocialAnalytics: React.FC<SocialAnalyticsProps> = ({
  analytics,
  posts,
  onExportData,
  onDateRangeChange
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, React.ReactNode> = {
      instagram: <Instagram className="h-4 w-4" />,
      facebook: <Facebook className="h-4 w-4" />,
      twitter: <Twitter className="h-4 w-4" />,
      whatsapp: <MessageCircle className="h-4 w-4" />
    };
    return icons[platform] || <Globe className="h-4 w-4" />;
  };

  const getPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      twitter: 'Twitter',
      whatsapp: 'WhatsApp'
    };
    return names[platform] || platform;
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (growth < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) {
      return 'text-green-600';
    } else if (growth < 0) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  const calculateTotalFollowers = () => {
    return analytics.platformBreakdown.reduce((total, platform) => total + platform.followers, 0);
  };

  const calculateTotalEngagement = () => {
    return analytics.platformBreakdown.reduce((total, platform) => total + platform.engagement, 0);
  };

  const getTopPerformingPlatform = () => {
    return analytics.platformBreakdown.reduce((top, platform) => 
      platform.engagementRate > top.engagementRate ? platform : top
    );
  };

  const getBestPostingTime = () => {
    const bestTime = analytics.bestPostingTimes.reduce((best, time) => 
      time.engagementRate > best.engagementRate ? time : best
    );
    
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return {
      day: days[bestTime.dayOfWeek],
      hour: bestTime.hour,
      engagementRate: bestTime.engagementRate
    };
  };

  const filteredPosts = selectedPlatform === 'all' 
    ? posts 
    : posts.filter(post => post.platform === selectedPlatform);

  const totalFollowers = calculateTotalFollowers();
  const totalEngagement = calculateTotalEngagement();
  const topPlatform = getTopPerformingPlatform();
  const bestTime = getBestPostingTime();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analíticas Sociales</h1>
          <p className="text-muted-foreground">
            Métricas detalladas de rendimiento en redes sociales
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={(value) => {
            setSelectedPeriod(value);
            onDateRangeChange(value);
          }}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="90">Últimos 90 días</SelectItem>
              <SelectItem value="365">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => onExportData('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Seguidores</p>
                <p className="text-2xl font-bold">{formatNumber(totalFollowers)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(12)}
                  <span className={`text-sm ${getGrowthColor(12)}`}>+12%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Total</p>
                <p className="text-2xl font-bold">{formatNumber(totalEngagement)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(8)}
                  <span className={`text-sm ${getGrowthColor(8)}`}>+8%</span>
                </div>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alcance Total</p>
                <p className="text-2xl font-bold">{formatNumber(analytics.totalReach)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(15)}
                  <span className={`text-sm ${getGrowthColor(15)}`}>+15%</span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">{formatPercentage(analytics.averageEngagementRate)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {getGrowthIcon(2)}
                  <span className={`text-sm ${getGrowthColor(2)}`}>+2%</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Rendimiento por Plataforma
            </CardTitle>
            <CardDescription>
              Comparación de métricas entre plataformas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.platformBreakdown.map((platform) => (
                <div key={platform.platform} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getPlatformIcon(platform.platform)}
                    <div>
                      <p className="font-medium">{getPlatformName(platform.platform)}</p>
                      <p className="text-sm text-muted-foreground">{platform.posts} publicaciones</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatNumber(platform.followers)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPercentage(platform.engagementRate)} engagement
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Distribución de Engagement
            </CardTitle>
            <CardDescription>
              Cómo se distribuye el engagement entre plataformas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.platformBreakdown.map((platform) => {
                const percentage = (platform.engagement / totalEngagement) * 100;
                return (
                  <div key={platform.platform} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPlatformIcon(platform.platform)}
                        <span className="font-medium">{getPlatformName(platform.platform)}</span>
                      </div>
                      <span className="text-sm font-medium">{formatPercentage(percentage)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="posts">Publicaciones</TabsTrigger>
          <TabsTrigger value="audience">Audiencia</TabsTrigger>
          <TabsTrigger value="timing">Tiempo</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Performing Posts */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Mejores Publicaciones</CardTitle>
                <CardDescription>
                  Publicaciones con mayor engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topPerformingPosts.slice(0, 5).map((post, index) => (
                    <div key={post.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getPlatformIcon(post.platform)}
                          <span className="font-medium">{getPlatformName(post.platform)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPercentage(post.engagement.engagementRate)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(post.engagement.likes + post.engagement.comments + post.engagement.shares)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Insights</CardTitle>
                <CardDescription>
                  Datos clave para optimizar tu estrategia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Mejor Plataforma</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {getPlatformName(topPlatform.platform)} con {formatPercentage(topPlatform.engagementRate)} engagement
                  </p>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Mejor Horario</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {bestTime.day} a las {bestTime.hour}:00 ({formatPercentage(bestTime.engagementRate)} engagement)
                  </p>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Crecimiento</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    +{analytics.audienceGrowth[analytics.audienceGrowth.length - 1]?.growth || 0} seguidores este mes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Análisis de Publicaciones</h2>
              <p className="text-muted-foreground">
                Rendimiento detallado de tus publicaciones
              </p>
            </div>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las plataformas</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Publicaciones</p>
                    <p className="text-2xl font-bold">{filteredPosts.length}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Promedio Engagement</p>
                    <p className="text-2xl font-bold">
                      {filteredPosts.length > 0 
                        ? formatPercentage(filteredPosts.reduce((sum, post) => sum + post.engagement.engagementRate, 0) / filteredPosts.length)
                        : '0%'
                      }
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Alcance Promedio</p>
                    <p className="text-2xl font-bold">
                      {filteredPosts.length > 0 
                        ? formatNumber(filteredPosts.reduce((sum, post) => sum + post.engagement.reach, 0) / filteredPosts.length)
                        : '0'
                      }
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Publicaciones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPosts.slice(0, 10).map((post) => (
                  <div key={post.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="text-2xl">{getPlatformIcon(post.platform)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{getPlatformName(post.platform)}</span>
                        <Badge variant="outline">{post.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {post.content}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Heart className="h-3 w-3" />
                        <span>{formatNumber(post.engagement.likes)}</span>
                        <MessageSquare className="h-3 w-3" />
                        <span>{formatNumber(post.engagement.comments)}</span>
                        <Share2 className="h-3 w-3" />
                        <span>{formatNumber(post.engagement.shares)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatPercentage(post.engagement.engagementRate)} engagement
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crecimiento de Audiencia</CardTitle>
              <CardDescription>
                Evolución de seguidores a lo largo del tiempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.audienceGrowth.map((growth, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{growth.date.toLocaleDateString()}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatNumber(growth.followers)}</p>
                      <div className="flex items-center space-x-1">
                        {getGrowthIcon(growth.growth)}
                        <span className={`text-sm ${getGrowthColor(growth.growth)}`}>
                          {growth.growth > 0 ? '+' : ''}{growth.growth}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timing Tab */}
        <TabsContent value="timing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mejores Horarios de Publicación</CardTitle>
              <CardDescription>
                Horarios con mayor engagement rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.bestPostingTimes.map((time, index) => {
                  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                  return (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{days[time.dayOfWeek]}</span>
                        <span className="text-sm text-muted-foreground">{time.hour}:00</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(time.engagementRate / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{formatPercentage(time.engagementRate)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialAnalytics; 