import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Copy, 
  Wand2, 
  Clock, 
  TrendingUp, 
  MessageSquare,
  Hash,
  Globe,
  Target,
  Zap
} from 'lucide-react';
import { useAIContent, ContentSuggestion, ContentRequest } from '@/hooks/useAIContent';
import { useLanguage } from '@/contexts/LanguageContext';

export const AIContentSuggestion = () => {
  const { language } = useLanguage();
  const {
    generateContent,
    suggestions,
    isLoading,
    error,
    metadata,
    optimizeForPlatform,
    analyzeContent
  } = useAIContent();

  const [request, setRequest] = useState<Partial<ContentRequest>>({
    platform: 'instagram',
    language: language as 'es' | 'en',
    category: 'promotional',
    keywords: [],
    tone: 'friendly',
    length: 'medium',
    includeHashtags: true,
    includeCallToAction: true
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<ContentSuggestion | null>(null);

  const isSpanish = language === 'es';

  const handleGenerate = () => {
    if (request.platform && request.language && request.category && request.keywords?.length) {
      generateContent(request as ContentRequest);
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && request.keywords) {
      setRequest({
        ...request,
        keywords: [...request.keywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    if (request.keywords) {
      setRequest({
        ...request,
        keywords: request.keywords.filter((_, i) => i !== index)
      });
    }
  };

  const handleUseSuggestion = (suggestion: ContentSuggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return '📸';
      case 'facebook': return '📘';
      case 'twitter': return '🐦';
      case 'linkedin': return '💼';
      default: return '📱';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'promotional': return 'bg-blue-100 text-blue-800';
      case 'educational': return 'bg-green-100 text-green-800';
      case 'community': return 'bg-purple-100 text-purple-800';
      case 'announcement': return 'bg-orange-100 text-orange-800';
      case 'engagement': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            {isSpanish ? 'Sugerencias de IA' : 'AI Content Suggestions'}
          </CardTitle>
          <CardDescription>
            {isSpanish 
              ? 'Genera contenido optimizado para redes sociales usando inteligencia artificial'
              : 'Generate optimized social media content using artificial intelligence'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generator">
                <Wand2 className="h-4 w-4 mr-2" />
                {isSpanish ? 'Generador' : 'Generator'}
              </TabsTrigger>
              <TabsTrigger value="suggestions">
                <MessageSquare className="h-4 w-4 mr-2" />
                {isSpanish ? 'Sugerencias' : 'Suggestions'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isSpanish ? 'Plataforma' : 'Platform'}</Label>
                  <Select 
                    value={request.platform} 
                    onValueChange={(value) => setRequest({ ...request, platform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">📸 Instagram</SelectItem>
                      <SelectItem value="facebook">📘 Facebook</SelectItem>
                      <SelectItem value="twitter">🐦 Twitter</SelectItem>
                      <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{isSpanish ? 'Categoría' : 'Category'}</Label>
                  <Select 
                    value={request.category} 
                    onValueChange={(value) => setRequest({ ...request, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promotional">
                        {isSpanish ? 'Promocional' : 'Promotional'}
                      </SelectItem>
                      <SelectItem value="educational">
                        {isSpanish ? 'Educativo' : 'Educational'}
                      </SelectItem>
                      <SelectItem value="community">
                        {isSpanish ? 'Comunidad' : 'Community'}
                      </SelectItem>
                      <SelectItem value="announcement">
                        {isSpanish ? 'Anuncio' : 'Announcement'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{isSpanish ? 'Tono' : 'Tone'}</Label>
                  <Select 
                    value={request.tone} 
                    onValueChange={(value) => setRequest({ ...request, tone: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">
                        {isSpanish ? 'Profesional' : 'Professional'}
                      </SelectItem>
                      <SelectItem value="casual">
                        {isSpanish ? 'Casual' : 'Casual'}
                      </SelectItem>
                      <SelectItem value="friendly">
                        {isSpanish ? 'Amigable' : 'Friendly'}
                      </SelectItem>
                      <SelectItem value="formal">
                        {isSpanish ? 'Formal' : 'Formal'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{isSpanish ? 'Longitud' : 'Length'}</Label>
                  <Select 
                    value={request.length} 
                    onValueChange={(value) => setRequest({ ...request, length: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">
                        {isSpanish ? 'Corta' : 'Short'}
                      </SelectItem>
                      <SelectItem value="medium">
                        {isSpanish ? 'Media' : 'Medium'}
                      </SelectItem>
                      <SelectItem value="long">
                        {isSpanish ? 'Larga' : 'Long'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{isSpanish ? 'Palabras Clave' : 'Keywords'}</Label>
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder={isSpanish ? 'Agregar palabra clave...' : 'Add keyword...'}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                  />
                  <Button onClick={handleAddKeyword} size="sm">
                    {isSpanish ? 'Agregar' : 'Add'}
                  </Button>
                </div>
                {request.keywords && request.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {request.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {keyword}
                        <button
                          onClick={() => handleRemoveKeyword(index)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hashtags"
                    checked={request.includeHashtags}
                    onCheckedChange={(checked) => 
                      setRequest({ ...request, includeHashtags: checked as boolean })
                    }
                  />
                  <Label htmlFor="hashtags">
                    {isSpanish ? 'Incluir hashtags' : 'Include hashtags'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cta"
                    checked={request.includeCallToAction}
                    onCheckedChange={(checked) => 
                      setRequest({ ...request, includeCallToAction: checked as boolean })
                    }
                  />
                  <Label htmlFor="cta">
                    {isSpanish ? 'Incluir llamada a la acción' : 'Include call to action'}
                  </Label>
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isLoading || !request.keywords?.length}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    {isSpanish ? 'Generando...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isSpanish ? 'Generar Contenido' : 'Generate Content'}
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">
                    {isSpanish ? 'Error al generar contenido' : 'Error generating content'}
                  </p>
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="space-y-4">
                  {suggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="relative">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {getPlatformIcon(suggestion.platform)}
                            </span>
                            <Badge className={getCategoryColor(suggestion.category)}>
                              {suggestion.category}
                            </Badge>
                            <Badge variant="outline">
                              {suggestion.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {Math.round(suggestion.confidence * 100)}%
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUseSuggestion(suggestion)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              {isSpanish ? 'Usar' : 'Use'}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">{suggestion.content}</p>
                        {suggestion.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {suggestion.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {suggestion.suggestedTime && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {isSpanish ? 'Sugerido para:' : 'Suggested for:'} {new Date(suggestion.suggestedTime).toLocaleString()}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {metadata && (
                <Card className="bg-gray-50">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {isSpanish ? 'Generado con:' : 'Generated with:'} {metadata.model}
                      </span>
                      <span>
                        {metadata.processingTime}ms
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedSuggestion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              {isSpanish ? 'Contenido Seleccionado' : 'Selected Content'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={selectedSuggestion.content}
              readOnly
              className="min-h-[100px]"
            />
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => handleCopyContent(selectedSuggestion.content)}
                variant="outline"
              >
                <Copy className="h-4 w-4 mr-2" />
                {isSpanish ? 'Copiar' : 'Copy'}
              </Button>
              <Button
                onClick={() => {
                  const optimized = optimizeForPlatform(selectedSuggestion.content, selectedSuggestion.platform);
                  console.log('Optimized content:', optimized);
                }}
                variant="outline"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {isSpanish ? 'Optimizar' : 'Optimize'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 