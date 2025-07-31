// Mention Monitor Component
// Comprehensive social media mention tracking and response management

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Reply,
  Heart,
  Share2,
  Eye,
  Flag,
  User,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Instagram,
  Facebook,
  Twitter,
  MessageSquare,
  Bell,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SocialMention, ResponseTemplate, Sentiment, MentionPriority } from '@/types/social';

interface MentionMonitorProps {
  mentions: SocialMention[];
  responseTemplates: ResponseTemplate[];
  onReplyToMention: (mentionId: string, reply: string) => void;
  onMarkAsReplied: (mentionId: string) => void;
  onFlagMention: (mentionId: string, reason: string) => void;
  onFilterMentions: (filters: MentionFilters) => void;
}

interface MentionFilters {
  platform?: string;
  sentiment?: Sentiment;
  priority?: MentionPriority;
  isReplied?: boolean;
  dateRange?: { start: Date; end: Date };
}

const MentionMonitor: React.FC<MentionMonitorProps> = ({
  mentions,
  responseTemplates,
  onReplyToMention,
  onMarkAsReplied,
  onFlagMention,
  onFilterMentions
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMention, setSelectedMention] = useState<SocialMention | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MentionFilters>({});

  const unrepliedMentions = mentions.filter(mention => !mention.isReplied);
  const urgentMentions = mentions.filter(mention => mention.priority === 'urgent');
  const positiveMentions = mentions.filter(mention => mention.sentiment === 'positive');
  const negativeMentions = mentions.filter(mention => mention.sentiment === 'negative');
  const neutralMentions = mentions.filter(mention => mention.sentiment === 'neutral');

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, React.ReactNode> = {
      instagram: <Instagram className="h-4 w-4" />,
      facebook: <Facebook className="h-4 w-4" />,
      twitter: <Twitter className="h-4 w-4" />,
      whatsapp: <MessageSquare className="h-4 w-4" />
    };
    return icons[platform] || <MessageCircle className="h-4 w-4" />;
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

  const getSentimentIcon = (sentiment: Sentiment) => {
    const icons: Record<Sentiment, React.ReactNode> = {
      positive: <TrendingUp className="h-4 w-4 text-green-600" />,
      negative: <TrendingDown className="h-4 w-4 text-red-600" />,
      neutral: <Minus className="h-4 w-4 text-gray-600" />,
      mixed: <AlertTriangle className="h-4 w-4 text-yellow-600" />
    };
    return icons[sentiment];
  };

  const getSentimentColor = (sentiment: Sentiment) => {
    const colors: Record<Sentiment, string> = {
      positive: 'text-green-600 bg-green-50 border-green-200',
      negative: 'text-red-600 bg-red-50 border-red-200',
      neutral: 'text-gray-600 bg-gray-50 border-gray-200',
      mixed: 'text-yellow-600 bg-yellow-50 border-yellow-200'
    };
    return colors[sentiment];
  };

  const getPriorityColor = (priority: MentionPriority) => {
    const colors: Record<MentionPriority, string> = {
      low: 'text-gray-500 bg-gray-50 border-gray-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      high: 'text-orange-600 bg-orange-50 border-orange-200',
      urgent: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[priority];
  };

  const formatDate = (date: Date) => {
    return format(date, 'PPP', { locale: es });
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const handleReply = () => {
    if (selectedMention && replyContent.trim()) {
      onReplyToMention(selectedMention.id, replyContent);
      setReplyContent('');
      setSelectedMention(null);
    }
  };

  const handleUseTemplate = (template: ResponseTemplate) => {
    setReplyContent(template.content);
    setSelectedTemplate(template.id);
  };

  const handleQuickReply = (mentionId: string, template: ResponseTemplate) => {
    onReplyToMention(mentionId, template.content);
  };

  const filteredMentions = mentions.filter(mention => {
    if (searchQuery && !mention.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mention.username.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.platform && mention.platform !== filters.platform) {
      return false;
    }
    if (filters.sentiment && mention.sentiment !== filters.sentiment) {
      return false;
    }
    if (filters.priority && mention.priority !== filters.priority) {
      return false;
    }
    if (filters.isReplied !== undefined && mention.isReplied !== filters.isReplied) {
      return false;
    }
    return true;
  });

  const getMentionsByTab = (tab: string) => {
    switch (tab) {
      case 'unreplied':
        return unrepliedMentions;
      case 'urgent':
        return urgentMentions;
      case 'positive':
        return positiveMentions;
      case 'negative':
        return negativeMentions;
      case 'neutral':
        return neutralMentions;
      default:
        return filteredMentions;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Menciones</p>
                <p className="text-2xl font-bold">{mentions.length}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sin Responder</p>
                <p className="text-2xl font-bold">{unrepliedMentions.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Urgentes</p>
                <p className="text-2xl font-bold">{urgentMentions.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Positivas</p>
                <p className="text-2xl font-bold">{positiveMentions.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Negativas</p>
                <p className="text-2xl font-bold">{negativeMentions.length}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar menciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filters.platform || ''} onValueChange={(value) => setFilters({...filters, platform: value || undefined})}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.sentiment || ''} onValueChange={(value) => setFilters({...filters, sentiment: value as Sentiment || undefined})}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sentimiento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="positive">Positivo</SelectItem>
                  <SelectItem value="negative">Negativo</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="mixed">Mixto</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.priority || ''} onValueChange={(value) => setFilters({...filters, priority: value as MentionPriority || undefined})}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentions List */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="unreplied">Sin Responder</TabsTrigger>
              <TabsTrigger value="urgent">Urgentes</TabsTrigger>
              <TabsTrigger value="positive">Positivas</TabsTrigger>
              <TabsTrigger value="negative">Negativas</TabsTrigger>
              <TabsTrigger value="neutral">Neutrales</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {getMentionsByTab(activeTab).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No hay menciones</h3>
                    <p className="text-muted-foreground">
                      {activeTab === 'all' ? 'No se encontraron menciones con los filtros actuales' :
                       `No hay menciones ${activeTab === 'unreplied' ? 'sin responder' :
                       activeTab === 'urgent' ? 'urgentes' :
                       activeTab === 'positive' ? 'positivas' :
                       activeTab === 'negative' ? 'negativas' : 'neutrales'}`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {getMentionsByTab(activeTab).map((mention) => (
                    <Card key={mention.id} className={`cursor-pointer transition-colors ${
                      selectedMention?.id === mention.id ? 'ring-2 ring-primary' : ''
                    }`} onClick={() => setSelectedMention(mention)}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/images/avatars/${mention.username}.jpg`} />
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">@{mention.username}</span>
                              <div className="flex items-center space-x-1">
                                {getPlatformIcon(mention.platform)}
                                <span className="text-sm text-muted-foreground">
                                  {getPlatformName(mention.platform)}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm mb-3">{mention.content}</p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Badge className={getSentimentColor(mention.sentiment)}>
                                  {getSentimentIcon(mention.sentiment)}
                                  <span className="ml-1 capitalize">{mention.sentiment}</span>
                                </Badge>
                                <Badge className={getPriorityColor(mention.priority)}>
                                  {mention.priority}
                                </Badge>
                                {mention.isReplied && (
                                  <Badge variant="default" className="flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Respondido
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(mention.timestamp)}</span>
                                <span>•</span>
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(mention.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Reply Panel */}
        <div className="space-y-6">
          {selectedMention ? (
            <>
              {/* Mention Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalles de la Mención</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/images/avatars/${selectedMention.username}.jpg`} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">@{selectedMention.username}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getPlatformName(selectedMention.platform)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm">{selectedMention.content}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getSentimentColor(selectedMention.sentiment)}>
                      {getSentimentIcon(selectedMention.sentiment)}
                      <span className="ml-1 capitalize">{selectedMention.sentiment}</span>
                    </Badge>
                    <Badge className={getPriorityColor(selectedMention.priority)}>
                      {selectedMention.priority}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>Recibido: {formatDate(selectedMention.timestamp)} a las {formatTime(selectedMention.timestamp)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Reply Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Responder</CardTitle>
                  <CardDescription>
                    {selectedMention.isReplied ? 'Ya respondiste a esta mención' : 'Escribe tu respuesta'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedMention.isReplied ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Respondido</span>
                      </div>
                      <p className="text-sm text-green-700">{selectedMention.replyContent}</p>
                      <p className="text-xs text-green-600 mt-2">
                        Respondido el {selectedMention.replyTime ? formatDate(selectedMention.replyTime) : ''}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Respuesta</Label>
                        <Textarea
                          placeholder="Escribe tu respuesta..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Plantillas de Respuesta</Label>
                        <div className="space-y-2">
                          {responseTemplates
                            .filter(template => template.platform === selectedMention.platform || template.platform === 'all')
                            .slice(0, 3)
                            .map((template) => (
                              <Button
                                key={template.id}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-left"
                                onClick={() => handleUseTemplate(template)}
                              >
                                <span className="truncate">{template.name}</span>
                              </Button>
                            ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1"
                          onClick={handleReply}
                          disabled={!replyContent.trim()}
                        >
                          <Reply className="h-4 w-4 mr-2" />
                          Responder
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => onMarkAsReplied(selectedMention.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar como Respondido
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Perfil
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Me Gusta
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Flag className="h-4 w-4 mr-2" />
                    Reportar
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecciona una Mención</h3>
                <p className="text-muted-foreground">
                  Haz clic en una mención de la lista para ver los detalles y responder
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentionMonitor; 