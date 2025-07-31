import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  MessageSquare,
  Plus,
  Search,
  Filter,
  ThumbsUp,
  MessageCircle,
  Eye,
  Star,
  Award,
  Github,
  ExternalLink,
  TrendingUp,
  Calendar,
  Tag,
  User,
  Settings,
  BookOpen,
  Zap,
  Heart,
  Clock
} from 'lucide-react';
import { useDevelopers } from '@/hooks/useDevelopers';

interface DeveloperForum {
  id: string;
  title: string;
  content: string;
  author: string;
  author_avatar?: string;
  category: 'general' | 'api' | 'sdk' | 'integration' | 'bug' | 'feature';
  created_at: string;
  replies: number;
  views: number;
  status: 'open' | 'closed' | 'answered';
  tags: string[];
  votes: number;
  is_sticky?: boolean;
  is_announcement?: boolean;
}

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  requester: string;
  requester_avatar?: string;
  created_at: string;
  votes: number;
  status: 'pending' | 'in_progress' | 'completed' | 'declined';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  comments: number;
  estimated_effort?: string;
  target_release?: string;
}

interface DeveloperSpotlight {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  contribution: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  featured_at: string;
  achievements: string[];
}

export function CommunityHub() {
  const { developerForums, featureRequests, developerSpotlights, loading } = useDevelopers();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateFeatureOpen, setIsCreateFeatureOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Form states
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('general');
  const [newPostTags, setNewPostTags] = useState('');
  
  const [newFeatureTitle, setNewFeatureTitle] = useState('');
  const [newFeatureDescription, setNewFeatureDescription] = useState('');
  const [newFeatureCategory, setNewFeatureCategory] = useState('api');
  const [newFeaturePriority, setNewFeaturePriority] = useState('medium');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General Discussion' },
    { value: 'api', label: 'API Questions' },
    { value: 'sdk', label: 'SDK Support' },
    { value: 'integration', label: 'Integration Help' },
    { value: 'bug', label: 'Bug Reports' },
    { value: 'feature', label: 'Feature Requests' }
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'votes', label: 'Most Voted' },
    { value: 'replies', label: 'Most Replies' }
  ];

  const filteredForums = developerForums.filter(forum => {
    const matchesCategory = selectedCategory === 'all' || forum.category === selectedCategory;
    const matchesSearch = forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         forum.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredFeatures = featureRequests.filter(feature => {
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedForums = [...filteredForums].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'popular':
        return b.views - a.views;
      case 'votes':
        return b.votes - a.votes;
      case 'replies':
        return b.replies - a.replies;
      default:
        return 0;
    }
  });

  const sortedFeatures = [...filteredFeatures].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'popular':
        return b.votes - a.votes;
      case 'votes':
        return b.votes - a.votes;
      case 'replies':
        return b.comments - a.comments;
      default:
        return 0;
    }
  });

  const handleCreatePost = async () => {
    // Simulate creating a post
    console.log('Creating post:', { newPostTitle, newPostContent, newPostCategory, newPostTags });
    setIsCreatePostOpen(false);
    // Reset form
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('general');
    setNewPostTags('');
  };

  const handleCreateFeature = async () => {
    // Simulate creating a feature request
    console.log('Creating feature request:', { newFeatureTitle, newFeatureDescription, newFeatureCategory, newFeaturePriority });
    setIsCreateFeatureOpen(false);
    // Reset form
    setNewFeatureTitle('');
    setNewFeatureDescription('');
    setNewFeatureCategory('api');
    setNewFeaturePriority('medium');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'api':
        return 'bg-blue-100 text-blue-800';
      case 'sdk':
        return 'bg-green-100 text-green-800';
      case 'integration':
        return 'bg-purple-100 text-purple-800';
      case 'bug':
        return 'bg-red-100 text-red-800';
      case 'feature':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'answered':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando comunidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Developer Community</h3>
          <p className="text-sm text-muted-foreground">
            Connect with other developers, share knowledge, and get support
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Share your question, experience, or knowledge with the community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="post-title">Title</Label>
                  <Input
                    id="post-title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Enter a descriptive title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="post-category">Category</Label>
                  <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="post-content">Content</Label>
                  <Textarea
                    id="post-content"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={8}
                    placeholder="Write your post content here..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="post-tags">Tags (comma-separated)</Label>
                  <Input
                    id="post-tags"
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                    placeholder="api, javascript, webhooks"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost} disabled={!newPostTitle || !newPostContent}>
                  Create Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateFeatureOpen} onOpenChange={setIsCreateFeatureOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Request Feature
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Request New Feature</DialogTitle>
                <DialogDescription>
                  Suggest a new feature or improvement for PRMCMS
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="feature-title">Feature Title</Label>
                  <Input
                    id="feature-title"
                    value={newFeatureTitle}
                    onChange={(e) => setNewFeatureTitle(e.target.value)}
                    placeholder="Brief description of the feature"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="feature-category">Category</Label>
                    <Select value={newFeatureCategory} onValueChange={setNewFeatureCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api">API</SelectItem>
                        <SelectItem value="sdk">SDK</SelectItem>
                        <SelectItem value="ui">User Interface</SelectItem>
                        <SelectItem value="integration">Integration</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="feature-priority">Priority</Label>
                    <Select value={newFeaturePriority} onValueChange={setNewFeaturePriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="feature-description">Detailed Description</Label>
                  <Textarea
                    id="feature-description"
                    value={newFeatureDescription}
                    onChange={(e) => setNewFeatureDescription(e.target.value)}
                    rows={8}
                    placeholder="Describe the feature in detail, including use cases and benefits..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateFeatureOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFeature} disabled={!newFeatureTitle || !newFeatureDescription}>
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Community Members</span>
            </div>
            <p className="text-2xl font-bold">1,247</p>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Forum Posts</span>
            </div>
            <p className="text-2xl font-bold">{developerForums.length}</p>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Feature Requests</span>
            </div>
            <p className="text-2xl font-bold">{featureRequests.length}</p>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +15% this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Total Votes</span>
            </div>
            <p className="text-2xl font-bold">5,892</p>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +23% this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forum">Developer Forum</TabsTrigger>
          <TabsTrigger value="features">Feature Requests</TabsTrigger>
          <TabsTrigger value="spotlight">Developer Spotlight</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forum Posts */}
          <div className="space-y-4">
            {sortedForums.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author_avatar} />
                      <AvatarFallback>{post.author.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium hover:text-primary cursor-pointer">
                            {post.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-muted-foreground">by {post.author}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{formatRelativeTime(post.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {post.is_sticky && <Badge variant="outline">Sticky</Badge>}
                          {post.is_announcement && <Badge variant="outline">Announcement</Badge>}
                          <Badge className={getStatusColor(post.status)}>
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.replies}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.votes}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(post.category)}>
                            {post.category}
                          </Badge>
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {/* Feature Requests */}
          <div className="space-y-4">
            {sortedFeatures.map((feature) => (
              <Card key={feature.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={feature.requester_avatar} />
                      <AvatarFallback>{feature.requester.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium hover:text-primary cursor-pointer">
                            {feature.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-muted-foreground">by {feature.requester}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{formatRelativeTime(feature.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(feature.priority)}>
                            {feature.priority}
                          </Badge>
                          <Badge className={getStatusColor(feature.status)}>
                            {feature.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{feature.votes} votes</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{feature.comments} comments</span>
                          </span>
                          {feature.estimated_effort && (
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{feature.estimated_effort}</span>
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {feature.category}
                          </Badge>
                          {feature.target_release && (
                            <Badge variant="outline">
                              Target: {feature.target_release}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="spotlight" className="space-y-6">
          {/* Developer Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developerSpotlights.map((developer) => (
              <Card key={developer.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <Avatar className="h-20 w-20 mx-auto">
                      <AvatarImage src={developer.avatar} />
                      <AvatarFallback className="text-lg">{developer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-semibold text-lg">{developer.name}</h4>
                      <p className="text-sm text-muted-foreground">{developer.role}</p>
                      <p className="text-sm text-muted-foreground">{developer.company}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm">{developer.contribution}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {developer.achievements.map((achievement, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-2">
                      {developer.github_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={developer.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {developer.linkedin_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={developer.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Featured {formatDate(developer.featured_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          {/* Community Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Documentation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-primary hover:underline">Getting Started Guide</a></li>
                  <li><a href="#" className="text-primary hover:underline">API Reference</a></li>
                  <li><a href="#" className="text-primary hover:underline">Best Practices</a></li>
                  <li><a href="#" className="text-primary hover:underline">Tutorials</a></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Quick Links</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-primary hover:underline">Status Page</a></li>
                  <li><a href="#" className="text-primary hover:underline">Changelog</a></li>
                  <li><a href="#" className="text-primary hover:underline">Roadmap</a></li>
                  <li><a href="#" className="text-primary hover:underline">Support</a></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Community</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-primary hover:underline">Discord Server</a></li>
                  <li><a href="#" className="text-primary hover:underline">GitHub Discussions</a></li>
                  <li><a href="#" className="text-primary hover:underline">Twitter</a></li>
                  <li><a href="#" className="text-primary hover:underline">Blog</a></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 