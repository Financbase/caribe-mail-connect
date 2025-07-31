// Social Media Hub - Main Page
// Comprehensive social media management dashboard

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSocial } from '@/hooks/useSocial';
import { AIContentSuggestion } from '@/components/social/AIContentSuggestion';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  TrendingUp, 
  Calendar,
  Users,
  Share2,
  Heart,
  MessageSquare,
  Eye,
  BarChart3,
  Plus,
  Settings,
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  Smartphone,
  Activity,
  Sparkles
} from 'lucide-react';

const Social: React.FC = () => {
  const {
    selectedPlatform,
    setSelectedPlatform,
    socialAccounts,
    socialPosts,
    socialMentions,
    socialAnalytics,
    socialSettings,
    accountsLoading,
    postsLoading,
    mentionsLoading,
    analyticsLoading,
    getConnectedAccounts,
    getActiveAccounts,
    getScheduledPosts,
    getPublishedPosts,
    getUnrepliedMentions,
    getUrgentMentions,
    calculateTotalEngagement,
    calculateAverageEngagementRate,
    getTopPerformingPosts,
    formatEngagementNumber,
    getPlatformIcon,
    getSentimentIcon,
    getPriorityColor
  } = useSocial();

  const [activeTab, setActiveTab] = useState('dashboard');

  const connectedAccounts = getConnectedAccounts();
  const activeAccounts = getActiveAccounts();
  const scheduledPosts = getScheduledPosts();
  const publishedPosts = getPublishedPosts();
  const unrepliedMentions = getUnrepliedMentions();
  const urgentMentions = getUrgentMentions();
  const topPosts = getTopPerformingPosts(5);

  const totalEngagement = calculateTotalEngagement();
  const avgEngagementRate = calculateAverageEngagementRate();

  const getPlatformStats = (platform: string) => {
    const account = socialAccounts.find(acc => acc.platform === platform);
    const posts = socialPosts.filter(post => post.platform === platform);
    const totalLikes = posts.reduce((sum, post) => sum + post.engagement.likes, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.engagement.comments, 0);
    const totalShares = posts.reduce((sum, post) => sum + post.engagement.shares, 0);

    return {
      followers: account?.followers || 0,
      posts: posts.length,
      likes: totalLikes,
      comments: totalComments,
      shares: totalShares,
      engagementRate: account?.engagementRate || 0
    };
  };

  if (accountsLoading || postsLoading || mentionsLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando centro social...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro Social</h1>
          <p className="text-muted-foreground">
            Gestiona todas tus redes sociales desde un solo lugar
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Publicación
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cuentas Conectadas</p>
                <p className="text-2xl font-bold">{connectedAccounts.length}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Total</p>
                <p className="text-2xl font-bold">{formatEngagementNumber(totalEngagement)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Menciones Pendientes</p>
                <p className="text-2xl font-bold">{unrepliedMentions.length}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Publicaciones Programadas</p>
                <p className="text-2xl font-bold">{scheduledPosts.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="accounts">Cuentas</TabsTrigger>
          <TabsTrigger value="posts">Publicaciones</TabsTrigger>
          <TabsTrigger value="mentions">Menciones</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="community">Comunidad</TabsTrigger>
          <TabsTrigger value="ai-content">
            <Sparkles className="h-4 w-4 mr-2" />
            IA
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Connected Accounts Overview */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Cuentas Conectadas
                </CardTitle>
                <CardDescription>
                  {connectedAccounts.length} de {socialAccounts.length} cuentas activas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {connectedAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getPlatformIcon(account.platform)}</div>
                      <div>
                        <p className="font-medium">{account.displayName}</p>
                        <p className="text-sm text-muted-foreground">@{account.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatEngagementNumber(account.followers)}</p>
                      <p className="text-xs text-muted-foreground">seguidores</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription>
                  Últimas interacciones y publicaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="text-xl">{getPlatformIcon(post.platform)}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{post.content.substring(0, 100)}...</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {post.engagement.likes}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {post.engagement.comments}
                          </span>
                          <span className="flex items-center">
                            <Share2 className="h-3 w-3 mr-1" />
                            {post.engagement.shares}
                          </span>
                        </div>
                      </div>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Rendimiento por Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['instagram', 'facebook', 'twitter'].map((platform) => {
                  const stats = getPlatformStats(platform);
                  return (
                    <div key={platform} className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl">{getPlatformIcon(platform)}</span>
                        <h3 className="font-medium capitalize">{platform}</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Seguidores:</span>
                          <span className="font-medium">{formatEngagementNumber(stats.followers)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Publicaciones:</span>
                          <span className="font-medium">{stats.posts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Engagement:</span>
                          <span className="font-medium">{stats.engagementRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Cuentas</CardTitle>
              <CardDescription>
                Conecta y gestiona tus redes sociales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialAccounts.map((account) => (
                  <Card key={account.id} className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-3xl">{getPlatformIcon(account.platform)}</div>
                      <div>
                        <h3 className="font-medium capitalize">{account.platform}</h3>
                        <p className="text-sm text-muted-foreground">@{account.username}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Estado:</span>
                        <Badge variant={account.isConnected ? 'default' : 'secondary'}>
                          {account.isConnected ? 'Conectado' : 'Desconectado'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Seguidores:</span>
                        <span className="font-medium">{formatEngagementNumber(account.followers)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Engagement:</span>
                        <span className="font-medium">{account.engagementRate.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {account.isConnected ? (
                        <Button variant="outline" size="sm" className="flex-1">
                          Gestionar
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1">
                          Conectar
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Publicaciones</h2>
              <p className="text-muted-foreground">
                Gestiona y programa tus publicaciones
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Publicación
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Published Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Publicadas
                </CardTitle>
                <CardDescription>{publishedPosts.length} publicaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {publishedPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                      <span className="text-sm text-muted-foreground">
                        {post.publishedTime?.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{post.content.substring(0, 80)}...</p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {post.engagement.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {post.engagement.comments}
                      </span>
                      <span className="flex items-center">
                        <Share2 className="h-3 w-3 mr-1" />
                        {post.engagement.shares}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Scheduled Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Programadas
                </CardTitle>
                <CardDescription>{scheduledPosts.length} publicaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduledPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                      <span className="text-sm text-muted-foreground">
                        {post.scheduledTime?.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{post.content.substring(0, 80)}...</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="outline" size="sm">Cancelar</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Performing Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
                  Mejor Rendimiento
                </CardTitle>
                <CardDescription>Publicaciones con mayor engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPosts.map((post) => (
                  <div key={post.id} className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                      <span className="text-sm font-medium">
                        {post.engagement.engagementRate.toFixed(1)}% engagement
                      </span>
                    </div>
                    <p className="text-sm mb-2">{post.content.substring(0, 60)}...</p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span>{formatEngagementNumber(post.engagement.likes)} likes</span>
                      <span>{formatEngagementNumber(post.engagement.comments)} comments</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mentions Tab */}
        <TabsContent value="mentions" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Menciones</h2>
              <p className="text-muted-foreground">
                Monitorea y responde a las menciones de tu marca
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="destructive" className="flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {urgentMentions.length} urgentes
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                {unrepliedMentions.length} sin responder
              </Badge>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {socialMentions.map((mention) => (
                  <div key={mention.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="text-2xl">{getPlatformIcon(mention.platform)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">@{mention.username}</span>
                        <span className="text-2xl">{getSentimentIcon(mention.sentiment)}</span>
                        <Badge variant={mention.isReplied ? 'default' : 'secondary'}>
                          {mention.isReplied ? 'Respondido' : 'Sin responder'}
                        </Badge>
                        <Badge className={getPriorityColor(mention.priority)}>
                          {mention.priority}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{mention.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {mention.timestamp.toLocaleDateString()}
                        </span>
                        {!mention.isReplied && (
                          <Button size="sm">Responder</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Analíticas</h2>
            <p className="text-muted-foreground">
              Métricas detalladas de rendimiento social
            </p>
          </div>

          {socialAnalytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento General</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total de Publicaciones:</span>
                      <span className="font-medium">{socialAnalytics.totalPosts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement Total:</span>
                      <span className="font-medium">{formatEngagementNumber(socialAnalytics.totalEngagement)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alcance Total:</span>
                      <span className="font-medium">{formatEngagementNumber(socialAnalytics.totalReach)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impresiones:</span>
                      <span className="font-medium">{formatEngagementNumber(socialAnalytics.totalImpressions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement Rate Promedio:</span>
                      <span className="font-medium">{socialAnalytics.averageEngagementRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Desglose por Plataforma</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {socialAnalytics.platformBreakdown.map((platform) => (
                      <div key={platform.platform} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getPlatformIcon(platform.platform)}</span>
                          <span className="font-medium capitalize">{platform.platform}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatEngagementNumber(platform.followers)}</p>
                          <p className="text-xs text-muted-foreground">{platform.engagementRate.toFixed(1)}% engagement</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Comunidad</h2>
            <p className="text-muted-foreground">
              Gestiona tu comunidad y eventos locales
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Community Forums */}
            <Card>
              <CardHeader>
                <CardTitle>Foros Comunitarios</CardTitle>
                <CardDescription>
                  Espacios de discusión para clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {communityForums.map((forum) => (
                    <div key={forum.id} className="p-3 border rounded-lg">
                      <h3 className="font-medium mb-1">{forum.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{forum.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{forum.members} miembros</span>
                        <span className="capitalize">{forum.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Local Events */}
            <Card>
              <CardHeader>
                <CardTitle>Eventos Locales</CardTitle>
                <CardDescription>
                  Eventos y meetups de la comunidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {localEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <h3 className="font-medium mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{event.attendees.length} asistentes</span>
                        <span>{event.startDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Content Tab */}
        <TabsContent value="ai-content" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              Sugerencias de IA
            </h2>
            <p className="text-muted-foreground">
              Genera contenido optimizado para redes sociales usando inteligencia artificial
            </p>
          </div>
          
          <AIContentSuggestion />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Social; 