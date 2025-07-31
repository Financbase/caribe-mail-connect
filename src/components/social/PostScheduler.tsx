// Post Scheduler Component
// Comprehensive social media post scheduling and management

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar as CalendarIcon,
  Clock,
  Image,
  Hash,
  AtSign,
  MapPin,
  Globe,
  Send,
  Save,
  Eye,
  Edit,
  Trash2,
  Plus,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SocialPost, PostTemplate, SocialAccount } from '@/types/social';
import { cn } from '@/lib/utils';

interface PostSchedulerProps {
  posts: SocialPost[];
  templates: PostTemplate[];
  accounts: SocialAccount[];
  onCreatePost: (post: Omit<SocialPost, 'id' | 'engagement'>) => void;
  onUpdatePost: (postId: string, updates: Partial<SocialPost>) => void;
  onDeletePost: (postId: string) => void;
  onPublishNow: (postId: string) => void;
}

const PostScheduler: React.FC<PostSchedulerProps> = ({
  posts,
  templates,
  accounts,
  onCreatePost,
  onUpdatePost,
  onDeletePost,
  onPublishNow
}) => {
  const [activeTab, setActiveTab] = useState('compose');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [postContent, setPostContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [isSponsored, setIsSponsored] = useState(false);
  const [budget, setBudget] = useState('');
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  const connectedAccounts = accounts.filter(account => account.isConnected && account.isActive);
  const scheduledPosts = posts.filter(post => post.status === 'scheduled');
  const publishedPosts = posts.filter(post => post.status === 'published');
  const draftPosts = posts.filter(post => post.status === 'draft');

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

  const formatDate = (date: Date) => {
    return format(date, 'PPP', { locale: es });
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const handleAddHashtag = (hashtag: string) => {
    if (hashtag && !hashtags.includes(hashtag)) {
      setHashtags([...hashtags, hashtag.startsWith('#') ? hashtag : `#${hashtag}`]);
    }
  };

  const handleRemoveHashtag = (hashtag: string) => {
    setHashtags(hashtags.filter(h => h !== hashtag));
  };

  const handleAddMention = (mention: string) => {
    if (mention && !mentions.includes(mention)) {
      setMentions([...mentions, mention.startsWith('@') ? mention : `@${mention}`]);
    }
  };

  const handleRemoveMention = (mention: string) => {
    setMentions(mentions.filter(m => m !== mention));
  };

  const handleUseTemplate = (template: PostTemplate) => {
    setPostContent(template.content);
    setHashtags(template.hashtags);
    setLanguage(template.language);
  };

  const handleSchedulePost = () => {
    if (!selectedDate || selectedPlatforms.length === 0 || !postContent.trim()) {
      return;
    }

    const scheduledTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const newPost: Omit<SocialPost, 'id' | 'engagement'> = {
      platform: selectedPlatforms[0] as any, // For now, single platform
      content: postContent,
      mediaUrls,
      scheduledTime,
      status: 'scheduled',
      hashtags,
      mentions,
      location: location || undefined,
      isSponsored,
      budget: budget ? parseFloat(budget) : undefined,
      targetAudience: targetAudience.length > 0 ? targetAudience : undefined,
      language
    };

    onCreatePost(newPost);
    
    // Reset form
    setPostContent('');
    setMediaUrls([]);
    setHashtags([]);
    setMentions([]);
    setLocation('');
    setIsSponsored(false);
    setBudget('');
    setTargetAudience([]);
    setSelectedDate(undefined);
    setSelectedTime('09:00');
    setSelectedPlatforms([]);
  };

  const handlePublishNow = () => {
    if (selectedPlatforms.length === 0 || !postContent.trim()) {
      return;
    }

    const newPost: Omit<SocialPost, 'id' | 'engagement'> = {
      platform: selectedPlatforms[0] as any,
      content: postContent,
      mediaUrls,
      publishedTime: new Date(),
      status: 'published',
      hashtags,
      mentions,
      location: location || undefined,
      isSponsored,
      budget: budget ? parseFloat(budget) : undefined,
      targetAudience: targetAudience.length > 0 ? targetAudience : undefined,
      language
    };

    onCreatePost(newPost);
    
    // Reset form
    setPostContent('');
    setMediaUrls([]);
    setHashtags([]);
    setMentions([]);
    setLocation('');
    setIsSponsored(false);
    setBudget('');
    setTargetAudience([]);
    setSelectedPlatforms([]);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compose">Componer</TabsTrigger>
          <TabsTrigger value="scheduled">Programadas</TabsTrigger>
          <TabsTrigger value="published">Publicadas</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Post Composition */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Componer Publicación</CardTitle>
                  <CardDescription>
                    Crea y programa publicaciones para tus redes sociales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Platform Selection */}
                  <div className="space-y-2">
                    <Label>Plataformas</Label>
                    <div className="flex flex-wrap gap-2">
                      {connectedAccounts.map((account) => (
                        <Button
                          key={account.id}
                          variant={selectedPlatforms.includes(account.platform) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (selectedPlatforms.includes(account.platform)) {
                              setSelectedPlatforms(selectedPlatforms.filter(p => p !== account.platform));
                            } else {
                              setSelectedPlatforms([...selectedPlatforms, account.platform]);
                            }
                          }}
                        >
                          {getPlatformIcon(account.platform)}
                          <span className="ml-2">{getPlatformName(account.platform)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label>Contenido</Label>
                    <Textarea
                      placeholder="¿Qué quieres compartir hoy?"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Caracteres: {postContent.length}</span>
                      <span>Límite: 280</span>
                    </div>
                  </div>

                  {/* Media Upload */}
                  <div className="space-y-2">
                    <Label>Medios</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Arrastra imágenes o videos aquí, o haz clic para seleccionar
                      </p>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Medios
                      </Button>
                    </div>
                  </div>

                  {/* Hashtags */}
                  <div className="space-y-2">
                    <Label>Hashtags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {hashtags.map((hashtag) => (
                        <Badge key={hashtag} variant="secondary" className="cursor-pointer">
                          {hashtag}
                          <button
                            onClick={() => handleRemoveHashtag(hashtag)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Agregar hashtag"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddHashtag(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button variant="outline" size="sm">
                        <Hash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Mentions */}
                  <div className="space-y-2">
                    <Label>Menciones</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {mentions.map((mention) => (
                        <Badge key={mention} variant="secondary" className="cursor-pointer">
                          {mention}
                          <button
                            onClick={() => handleRemoveMention(mention)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Agregar mención"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddMention(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button variant="outline" size="sm">
                        <AtSign className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label>Ubicación</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Agregar ubicación"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select value={language} onValueChange={(value: 'es' | 'en') => setLanguage(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sponsored Post */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isSponsored}
                      onCheckedChange={setIsSponsored}
                    />
                    <Label>Publicación Patrocinada</Label>
                  </div>

                  {isSponsored && (
                    <div className="space-y-2">
                      <Label>Presupuesto (USD)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Scheduling Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Programación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? formatDate(selectedDate) : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <Label>Hora</Label>
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={handleSchedulePost}
                      disabled={!selectedDate || selectedPlatforms.length === 0 || !postContent.trim()}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Programar Publicación
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handlePublishNow}
                      disabled={selectedPlatforms.length === 0 || !postContent.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publicar Ahora
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Vista Previa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center space-x-2 mb-3">
                      {selectedPlatforms[0] && getPlatformIcon(selectedPlatforms[0])}
                      <span className="font-medium">
                        {selectedPlatforms[0] ? getPlatformName(selectedPlatforms[0]) : 'Plataforma'}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{postContent || 'Tu contenido aparecerá aquí...'}</p>
                    {hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hashtags.map((hashtag) => (
                          <span key={hashtag} className="text-blue-600 text-sm">{hashtag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Scheduled Posts Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publicaciones Programadas</CardTitle>
              <CardDescription>
                {scheduledPosts.length} publicaciones programadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scheduledPosts.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay publicaciones programadas</h3>
                  <p className="text-muted-foreground">
                    Programa tu primera publicación en la pestaña "Componer"
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scheduledPosts.map((post) => (
                    <div key={post.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="text-2xl">{getPlatformIcon(post.platform)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">{getPlatformName(post.platform)}</span>
                          <Badge variant="secondary">
                            {post.scheduledTime ? formatDate(post.scheduledTime) : ''} a las {post.scheduledTime ? formatTime(post.scheduledTime) : ''}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{post.content}</p>
                        {post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {post.hashtags.map((hashtag) => (
                              <Badge key={hashtag} variant="outline" className="text-xs">
                                {hashtag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onPublishNow(post.id)}>
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onDeletePost(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Published Posts Tab */}
        <TabsContent value="published" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publicaciones Recientes</CardTitle>
              <CardDescription>
                {publishedPosts.length} publicaciones publicadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {publishedPosts.length === 0 ? (
                <div className="text-center py-8">
                  <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay publicaciones publicadas</h3>
                  <p className="text-muted-foreground">
                    Tus publicaciones aparecerán aquí una vez que las publiques
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {publishedPosts.slice(0, 10).map((post) => (
                    <div key={post.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="text-2xl">{getPlatformIcon(post.platform)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">{getPlatformName(post.platform)}</span>
                          <Badge variant="default">
                            {post.publishedTime ? formatDate(post.publishedTime) : ''}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{post.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {post.engagement.likes} likes
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {post.engagement.comments} comments
                          </span>
                          <span className="flex items-center">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            {post.engagement.engagementRate.toFixed(1)}% engagement
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Publicación</CardTitle>
              <CardDescription>
                Usa plantillas predefinidas para crear publicaciones rápidamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{template.name}</h3>
                      <Badge variant="outline" className="capitalize">
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    <p className="text-sm mb-3">{template.content}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.hashtags.map((hashtag) => (
                        <Badge key={hashtag} variant="secondary" className="text-xs">
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Usado {template.usageCount} veces
                      </span>
                      <Button size="sm" onClick={() => handleUseTemplate(template)}>
                        Usar Plantilla
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostScheduler; 