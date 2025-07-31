// Social Media Custom Hook for PRMCMS
// Comprehensive hook for managing all social media features

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  SocialAccount,
  SocialPost,
  PostTemplate,
  ResponseTemplate,
  SocialMention,
  SocialAnalytics,
  SocialProduct,
  WhatsAppMessage,
  SocialOrder,
  HashtagSuggestion,
  BrandGuideline,
  SocialReview,
  Testimonial,
  SocialShare,
  ReferralProgram,
  InfluencerPartnership,
  CommunityForum,
  PackageShare,
  DeliveryGroup,
  LocalEvent,
  SocialSettings,
  PostStatus,
  Sentiment,
  MentionPriority
} from '@/types/social';
import {
  socialAccounts,
  socialPosts,
  postTemplates,
  responseTemplates,
  socialMentions,
  socialAnalytics,
  socialProducts,
  whatsappMessages,
  socialOrders,
  hashtagSuggestions,
  brandGuidelines,
  socialReviews,
  testimonials,
  socialShares,
  referralPrograms,
  influencerPartnerships,
  communityForums,
  packageShares,
  deliveryGroups,
  localEvents,
  socialSettings,
  getSocialAccountByPlatform,
  getSocialPostsByPlatform,
  getPostTemplatesByCategory,
  getResponseTemplatesByPlatform,
  getMentionsByPriority,
  getHashtagSuggestionsByCategory
} from '@/data/socialData';

// Mock API functions (replace with actual API calls)
const mockApi = {
  // Social Accounts
  getSocialAccounts: async (): Promise<SocialAccount[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return socialAccounts;
  },

  connectSocialAccount: async (platform: string, credentials: any): Promise<SocialAccount> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newAccount: SocialAccount = {
      id: Date.now().toString(),
      platform: platform as any,
      username: credentials.username,
      displayName: credentials.displayName,
      profileImage: `/images/social/${platform}-logo.png`,
      isConnected: true,
      isActive: true,
      lastSync: new Date(),
      followers: 0,
      following: 0,
      posts: 0,
      engagementRate: 0,
      permissions: ['read', 'write']
    };
    return newAccount;
  },

  disconnectSocialAccount: async (accountId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock disconnect
  },

  // Social Posts
  getSocialPosts: async (platform?: string): Promise<SocialPost[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return platform ? getSocialPostsByPlatform(platform) : socialPosts;
  },

  createSocialPost: async (post: Omit<SocialPost, 'id' | 'engagement'>): Promise<SocialPost> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPost: SocialPost = {
      ...post,
      id: Date.now().toString(),
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        clicks: 0,
        impressions: 0,
        reach: 0,
        engagementRate: 0
      }
    };
    return newPost;
  },

  updateSocialPost: async (postId: string, updates: Partial<SocialPost>): Promise<SocialPost> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const post = socialPosts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    return { ...post, ...updates };
  },

  deleteSocialPost: async (postId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock delete
  },

  // Post Templates
  getPostTemplates: async (category?: string): Promise<PostTemplate[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return category ? getPostTemplatesByCategory(category) : postTemplates;
  },

  createPostTemplate: async (template: Omit<PostTemplate, 'id' | 'usageCount'>): Promise<PostTemplate> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTemplate: PostTemplate = {
      ...template,
      id: Date.now().toString(),
      usageCount: 0
    };
    return newTemplate;
  },

  // Response Templates
  getResponseTemplates: async (platform?: string): Promise<ResponseTemplate[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return platform ? getResponseTemplatesByPlatform(platform) : responseTemplates;
  },

  // Social Mentions
  getSocialMentions: async (priority?: string): Promise<SocialMention[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return priority ? getMentionsByPriority(priority) : socialMentions;
  },

  replyToMention: async (mentionId: string, reply: string): Promise<SocialMention> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const mention = socialMentions.find(m => m.id === mentionId);
    if (!mention) throw new Error('Mention not found');
    return {
      ...mention,
      isReplied: true,
      replyContent: reply,
      replyTime: new Date()
    };
  },

  // Social Analytics
  getSocialAnalytics: async (period?: string): Promise<SocialAnalytics> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return socialAnalytics;
  },

  // Social Products
  getSocialProducts: async (platform?: string): Promise<SocialProduct[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return platform ? socialProducts.filter(p => p.platform === platform) : socialProducts;
  },

  createSocialProduct: async (product: Omit<SocialProduct, 'id'>): Promise<SocialProduct> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newProduct: SocialProduct = {
      ...product,
      id: Date.now().toString()
    };
    return newProduct;
  },

  // WhatsApp Messages
  getWhatsAppMessages: async (): Promise<WhatsAppMessage[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return whatsappMessages;
  },

  sendWhatsAppMessage: async (message: Omit<WhatsAppMessage, 'id' | 'timestamp' | 'status'>): Promise<WhatsAppMessage> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newMessage: WhatsAppMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'sent'
    };
    return newMessage;
  },

  // Social Orders
  getSocialOrders: async (): Promise<SocialOrder[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return socialOrders;
  },

  // Hashtag Suggestions
  getHashtagSuggestions: async (category?: string): Promise<HashtagSuggestion[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return category ? getHashtagSuggestionsByCategory(category) : hashtagSuggestions;
  },

  // Social Reviews
  getSocialReviews: async (): Promise<SocialReview[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return socialReviews;
  },

  // Testimonials
  getTestimonials: async (): Promise<Testimonial[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return testimonials;
  },

  createTestimonial: async (testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Promise<Testimonial> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    return newTestimonial;
  },

  // Social Shares
  getSocialShares: async (): Promise<SocialShare[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return socialShares;
  },

  // Referral Programs
  getReferralPrograms: async (): Promise<ReferralProgram[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return referralPrograms;
  },

  // Influencer Partnerships
  getInfluencerPartnerships: async (): Promise<InfluencerPartnership[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return influencerPartnerships;
  },

  // Community Forums
  getCommunityForums: async (): Promise<CommunityForum[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return communityForums;
  },

  // Package Shares
  getPackageShares: async (): Promise<PackageShare[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return packageShares;
  },

  createPackageShare: async (share: Omit<PackageShare, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<PackageShare> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newShare: PackageShare = {
      ...share,
      id: Date.now().toString(),
      createdAt: new Date(),
      likes: 0,
      comments: []
    };
    return newShare;
  },

  // Delivery Groups
  getDeliveryGroups: async (): Promise<DeliveryGroup[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return deliveryGroups;
  },

  // Local Events
  getLocalEvents: async (): Promise<LocalEvent[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return localEvents;
  },

  createLocalEvent: async (event: Omit<LocalEvent, 'id'>): Promise<LocalEvent> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newEvent: LocalEvent = {
      ...event,
      id: Date.now().toString()
    };
    return newEvent;
  },

  // Social Settings
  getSocialSettings: async (): Promise<SocialSettings> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return socialSettings;
  },

  updateSocialSettings: async (settings: Partial<SocialSettings>): Promise<SocialSettings> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...socialSettings, ...settings };
  }
};

export const useSocial = () => {
  const queryClient = useQueryClient();
  
  // State
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Queries
  const socialAccountsQuery = useQuery({
    queryKey: ['socialAccounts'],
    queryFn: mockApi.getSocialAccounts
  });

  const socialPostsQuery = useQuery({
    queryKey: ['socialPosts', selectedPlatform],
    queryFn: () => mockApi.getSocialPosts(selectedPlatform === 'all' ? undefined : selectedPlatform)
  });

  const postTemplatesQuery = useQuery({
    queryKey: ['postTemplates', selectedCategory],
    queryFn: () => mockApi.getPostTemplates(selectedCategory === 'all' ? undefined : selectedCategory)
  });

  const responseTemplatesQuery = useQuery({
    queryKey: ['responseTemplates'],
    queryFn: mockApi.getResponseTemplates
  });

  const socialMentionsQuery = useQuery({
    queryKey: ['socialMentions', selectedPriority],
    queryFn: () => mockApi.getSocialMentions(selectedPriority === 'all' ? undefined : selectedPriority)
  });

  const socialAnalyticsQuery = useQuery({
    queryKey: ['socialAnalytics'],
    queryFn: mockApi.getSocialAnalytics
  });

  const socialProductsQuery = useQuery({
    queryKey: ['socialProducts'],
    queryFn: mockApi.getSocialProducts
  });

  const whatsappMessagesQuery = useQuery({
    queryKey: ['whatsappMessages'],
    queryFn: mockApi.getWhatsAppMessages
  });

  const socialOrdersQuery = useQuery({
    queryKey: ['socialOrders'],
    queryFn: mockApi.getSocialOrders
  });

  const hashtagSuggestionsQuery = useQuery({
    queryKey: ['hashtagSuggestions'],
    queryFn: mockApi.getHashtagSuggestions
  });

  const socialReviewsQuery = useQuery({
    queryKey: ['socialReviews'],
    queryFn: mockApi.getSocialReviews
  });

  const testimonialsQuery = useQuery({
    queryKey: ['testimonials'],
    queryFn: mockApi.getTestimonials
  });

  const socialSharesQuery = useQuery({
    queryKey: ['socialShares'],
    queryFn: mockApi.getSocialShares
  });

  const referralProgramsQuery = useQuery({
    queryKey: ['referralPrograms'],
    queryFn: mockApi.getReferralPrograms
  });

  const influencerPartnershipsQuery = useQuery({
    queryKey: ['influencerPartnerships'],
    queryFn: mockApi.getInfluencerPartnerships
  });

  const communityForumsQuery = useQuery({
    queryKey: ['communityForums'],
    queryFn: mockApi.getCommunityForums
  });

  const packageSharesQuery = useQuery({
    queryKey: ['packageShares'],
    queryFn: mockApi.getPackageShares
  });

  const deliveryGroupsQuery = useQuery({
    queryKey: ['deliveryGroups'],
    queryFn: mockApi.getDeliveryGroups
  });

  const localEventsQuery = useQuery({
    queryKey: ['localEvents'],
    queryFn: mockApi.getLocalEvents
  });

  const socialSettingsQuery = useQuery({
    queryKey: ['socialSettings'],
    queryFn: mockApi.getSocialSettings
  });

  // Mutations
  const connectAccountMutation = useMutation({
    mutationFn: ({ platform, credentials }: { platform: string; credentials: any }) =>
      mockApi.connectSocialAccount(platform, credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialAccounts'] });
    }
  });

  const disconnectAccountMutation = useMutation({
    mutationFn: mockApi.disconnectSocialAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialAccounts'] });
    }
  });

  const createPostMutation = useMutation({
    mutationFn: mockApi.createSocialPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialPosts'] });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, updates }: { postId: string; updates: Partial<SocialPost> }) =>
      mockApi.updateSocialPost(postId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialPosts'] });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: mockApi.deleteSocialPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialPosts'] });
    }
  });

  const createTemplateMutation = useMutation({
    mutationFn: mockApi.createPostTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postTemplates'] });
    }
  });

  const replyToMentionMutation = useMutation({
    mutationFn: ({ mentionId, reply }: { mentionId: string; reply: string }) =>
      mockApi.replyToMention(mentionId, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMentions'] });
    }
  });

  const createProductMutation = useMutation({
    mutationFn: mockApi.createSocialProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialProducts'] });
    }
  });

  const sendWhatsAppMessageMutation = useMutation({
    mutationFn: mockApi.sendWhatsAppMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsappMessages'] });
    }
  });

  const createTestimonialMutation = useMutation({
    mutationFn: mockApi.createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    }
  });

  const createPackageShareMutation = useMutation({
    mutationFn: mockApi.createPackageShare,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packageShares'] });
    }
  });

  const createEventMutation = useMutation({
    mutationFn: mockApi.createLocalEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['localEvents'] });
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: mockApi.updateSocialSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialSettings'] });
    }
  });

  // Utility functions
  const getConnectedAccounts = useCallback(() => {
    return socialAccountsQuery.data?.filter(account => account.isConnected) || [];
  }, [socialAccountsQuery.data]);

  const getActiveAccounts = useCallback(() => {
    return socialAccountsQuery.data?.filter(account => account.isActive) || [];
  }, [socialAccountsQuery.data]);

  const getPostsByStatus = useCallback((status: PostStatus) => {
    return socialPostsQuery.data?.filter(post => post.status === status) || [];
  }, [socialPostsQuery.data]);

  const getScheduledPosts = useCallback(() => {
    return socialPostsQuery.data?.filter(post => post.status === 'scheduled') || [];
  }, [socialPostsQuery.data]);

  const getPublishedPosts = useCallback(() => {
    return socialPostsQuery.data?.filter(post => post.status === 'published') || [];
  }, [socialPostsQuery.data]);

  const getMentionsBySentiment = useCallback((sentiment: Sentiment) => {
    return socialMentionsQuery.data?.filter(mention => mention.sentiment === sentiment) || [];
  }, [socialMentionsQuery.data]);

  const getUnrepliedMentions = useCallback(() => {
    return socialMentionsQuery.data?.filter(mention => !mention.isReplied) || [];
  }, [socialMentionsQuery.data]);

  const getUrgentMentions = useCallback(() => {
    return socialMentionsQuery.data?.filter(mention => mention.priority === 'urgent') || [];
  }, [socialMentionsQuery.data]);

  const calculateTotalEngagement = useCallback(() => {
    return socialPostsQuery.data?.reduce((total, post) => total + post.engagement.likes + post.engagement.comments + post.engagement.shares, 0) || 0;
  }, [socialPostsQuery.data]);

  const calculateAverageEngagementRate = useCallback(() => {
    if (!socialPostsQuery.data?.length) return 0;
    const totalRate = socialPostsQuery.data.reduce((total, post) => total + post.engagement.engagementRate, 0);
    return totalRate / socialPostsQuery.data.length;
  }, [socialPostsQuery.data]);

  const getTopPerformingPosts = useCallback((limit: number = 5) => {
    return socialPostsQuery.data
      ?.sort((a, b) => b.engagement.engagementRate - a.engagement.engagementRate)
      .slice(0, limit) || [];
  }, [socialPostsQuery.data]);

  const getHashtagSuggestionsForContent = useCallback((content: string, limit: number = 10) => {
    // Simple hashtag suggestion logic
    const words = content.toLowerCase().split(' ');
    const suggestions = hashtagSuggestionsQuery.data?.filter(suggestion => 
      words.some(word => suggestion.hashtag.toLowerCase().includes(word.replace('#', '')))
    ) || [];
    return suggestions.slice(0, limit);
  }, [hashtagSuggestionsQuery.data]);

  const formatEngagementNumber = useCallback((number: number): string => {
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toString();
  }, []);

  const getPlatformIcon = useCallback((platform: string): string => {
    const icons: Record<string, string> = {
      instagram: '📷',
      facebook: '📘',
      twitter: '🐦',
      tiktok: '🎵',
      whatsapp: '💬',
      linkedin: '💼',
      youtube: '📺'
    };
    return icons[platform] || '📱';
  }, []);

  const getSentimentIcon = useCallback((sentiment: Sentiment): string => {
    const icons: Record<Sentiment, string> = {
      positive: '😊',
      negative: '😞',
      neutral: '😐',
      mixed: '🤔'
    };
    return icons[sentiment];
  }, []);

  const getPriorityColor = useCallback((priority: MentionPriority): string => {
    const colors: Record<MentionPriority, string> = {
      low: 'text-gray-500',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    };
    return colors[priority];
  }, []);

  return {
    // State
    selectedPlatform,
    setSelectedPlatform,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,

    // Data
    socialAccounts: socialAccountsQuery.data || [],
    socialPosts: socialPostsQuery.data || [],
    postTemplates: postTemplatesQuery.data || [],
    responseTemplates: responseTemplatesQuery.data || [],
    socialMentions: socialMentionsQuery.data || [],
    socialAnalytics: socialAnalyticsQuery.data,
    socialProducts: socialProductsQuery.data || [],
    whatsappMessages: whatsappMessagesQuery.data || [],
    socialOrders: socialOrdersQuery.data || [],
    hashtagSuggestions: hashtagSuggestionsQuery.data || [],
    brandGuidelines,
    socialReviews: socialReviewsQuery.data || [],
    testimonials: testimonialsQuery.data || [],
    socialShares: socialSharesQuery.data || [],
    referralPrograms: referralProgramsQuery.data || [],
    influencerPartnerships: influencerPartnershipsQuery.data || [],
    communityForums: communityForumsQuery.data || [],
    packageShares: packageSharesQuery.data || [],
    deliveryGroups: deliveryGroupsQuery.data || [],
    localEvents: localEventsQuery.data || [],
    socialSettings: socialSettingsQuery.data,

    // Loading states
    accountsLoading: socialAccountsQuery.isLoading,
    postsLoading: socialPostsQuery.isLoading,
    mentionsLoading: socialMentionsQuery.isLoading,
    analyticsLoading: socialAnalyticsQuery.isLoading,

    // Mutations
    connectAccountMutation,
    disconnectAccountMutation,
    createPostMutation,
    updatePostMutation,
    deletePostMutation,
    createTemplateMutation,
    replyToMentionMutation,
    createProductMutation,
    sendWhatsAppMessageMutation,
    createTestimonialMutation,
    createPackageShareMutation,
    createEventMutation,
    updateSettingsMutation,

    // Utility functions
    getConnectedAccounts,
    getActiveAccounts,
    getPostsByStatus,
    getScheduledPosts,
    getPublishedPosts,
    getMentionsBySentiment,
    getUnrepliedMentions,
    getUrgentMentions,
    calculateTotalEngagement,
    calculateAverageEngagementRate,
    getTopPerformingPosts,
    getHashtagSuggestionsForContent,
    formatEngagementNumber,
    getPlatformIcon,
    getSentimentIcon,
    getPriorityColor
  };
}; 