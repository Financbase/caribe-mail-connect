// Social Media Mock Data for PRMCMS
// Comprehensive mock data for social media features

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
  SocialSettings
} from '@/types/social';

// Social Accounts
export const socialAccounts: SocialAccount[] = [
  {
    id: '1',
    platform: 'instagram',
    username: 'caribemailpr',
    displayName: 'Caribe Mail PR',
    profileImage: '/images/social/instagram-logo.png',
    isConnected: true,
    isActive: true,
    lastSync: new Date('2024-01-15T10:30:00Z'),
    followers: 2847,
    following: 156,
    posts: 342,
    engagementRate: 4.2,
    permissions: ['read', 'write', 'manage']
  },
  {
    id: '2',
    platform: 'facebook',
    username: 'caribemailpuertorico',
    displayName: 'Caribe Mail Puerto Rico',
    profileImage: '/images/social/facebook-logo.png',
    isConnected: true,
    isActive: true,
    lastSync: new Date('2024-01-15T09:15:00Z'),
    followers: 1892,
    following: 89,
    posts: 156,
    engagementRate: 3.8,
    permissions: ['read', 'write', 'manage']
  },
  {
    id: '3',
    platform: 'twitter',
    username: '@caribemailpr',
    displayName: 'Caribe Mail PR',
    profileImage: '/images/social/twitter-logo.png',
    isConnected: true,
    isActive: true,
    lastSync: new Date('2024-01-15T08:45:00Z'),
    followers: 1245,
    following: 234,
    posts: 89,
    engagementRate: 2.1,
    permissions: ['read', 'write']
  },
  {
    id: '4',
    platform: 'tiktok',
    username: '@caribemailpr',
    displayName: 'Caribe Mail PR',
    profileImage: '/images/social/tiktok-logo.png',
    isConnected: false,
    isActive: false,
    lastSync: new Date('2024-01-10T14:20:00Z'),
    followers: 0,
    following: 0,
    posts: 0,
    engagementRate: 0,
    permissions: []
  },
  {
    id: '5',
    platform: 'whatsapp',
    username: '+1787-555-0123',
    displayName: 'Caribe Mail WhatsApp',
    profileImage: '/images/social/whatsapp-logo.png',
    isConnected: true,
    isActive: true,
    lastSync: new Date('2024-01-15T11:00:00Z'),
    followers: 0,
    following: 0,
    posts: 0,
    engagementRate: 0,
    permissions: ['read', 'write']
  }
];

// Social Posts
export const socialPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'instagram',
    content: '🚚 ¡Nuevo servicio de entrega express disponible! Ahora entregamos en 2 horas en el área metropolitana. #CaribeMail #EntregaExpress #PuertoRico',
    mediaUrls: ['/images/posts/express-delivery.jpg'],
    publishedTime: new Date('2024-01-15T10:00:00Z'),
    status: 'published',
    engagement: {
      likes: 156,
      comments: 23,
      shares: 12,
      saves: 8,
      clicks: 45,
      impressions: 1200,
      reach: 890,
      engagementRate: 4.2
    },
    hashtags: ['#CaribeMail', '#EntregaExpress', '#PuertoRico', '#Delivery'],
    mentions: [],
    location: 'San Juan, Puerto Rico',
    isSponsored: false,
    language: 'es'
  },
  {
    id: '2',
    platform: 'facebook',
    content: 'We\'re excited to announce our new partnership with local businesses in Old San Juan! Supporting our community while providing excellent mail services. #LocalBusiness #PuertoRico #Community',
    mediaUrls: ['/images/posts/old-san-juan-partnership.jpg'],
    publishedTime: new Date('2024-01-14T15:30:00Z'),
    status: 'published',
    engagement: {
      likes: 89,
      comments: 15,
      shares: 8,
      saves: 3,
      clicks: 23,
      impressions: 650,
      reach: 420,
      engagementRate: 3.8
    },
    hashtags: ['#LocalBusiness', '#PuertoRico', '#Community', '#Partnership'],
    mentions: [],
    isSponsored: false,
    language: 'en'
  },
  {
    id: '3',
    platform: 'instagram',
    content: '📦 Behind the scenes: Our team preparing packages for Act 60 decree holders. Professional, secure, and reliable service you can trust! #Act60 #PuertoRico #MailService',
    mediaUrls: ['/images/posts/act60-preparation.jpg', '/images/posts/team-working.jpg'],
    scheduledTime: new Date('2024-01-16T09:00:00Z'),
    status: 'scheduled',
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      clicks: 0,
      impressions: 0,
      reach: 0,
      engagementRate: 0
    },
    hashtags: ['#Act60', '#PuertoRico', '#MailService', '#BehindTheScenes'],
    mentions: [],
    isSponsored: false,
    language: 'es'
  }
];

// Post Templates
export const postTemplates: PostTemplate[] = [
  {
    id: '1',
    name: 'Nuevo Servicio',
    description: 'Template para anunciar nuevos servicios',
    content: '🎉 ¡Estamos emocionados de anunciar nuestro nuevo servicio: {SERVICE_NAME}! {DESCRIPTION} #CaribeMail #NuevoServicio #PuertoRico',
    mediaPlaceholders: ['Foto del servicio'],
    hashtags: ['#CaribeMail', '#NuevoServicio', '#PuertoRico'],
    category: 'announcement',
    language: 'es',
    isActive: true,
    usageCount: 12
  },
  {
    id: '2',
    name: 'Customer Spotlight',
    description: 'Template to highlight customer success stories',
    content: '🌟 Customer Spotlight: {CUSTOMER_NAME} has been with us for {DURATION} and we love serving their mail needs! Thank you for trusting Caribe Mail! #CustomerSpotlight #PuertoRico #MailService',
    mediaPlaceholders: ['Customer photo or testimonial'],
    hashtags: ['#CustomerSpotlight', '#PuertoRico', '#MailService'],
    category: 'customer_spotlight',
    language: 'en',
    isActive: true,
    usageCount: 8
  },
  {
    id: '3',
    name: 'Behind the Scenes',
    description: 'Template para mostrar el trabajo interno',
    content: '🔧 Behind the scenes: {ACTIVITY_DESCRIPTION} Our team works hard to ensure your mail is handled with care! #BehindTheScenes #CaribeMail #PuertoRico',
    mediaPlaceholders: ['Team working photo'],
    hashtags: ['#BehindTheScenes', '#CaribeMail', '#PuertoRico'],
    category: 'behind_scenes',
    language: 'es',
    isActive: true,
    usageCount: 15
  }
];

// Response Templates
export const responseTemplates: ResponseTemplate[] = [
  {
    id: '1',
    name: 'Saludo General',
    content: '¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte hoy?',
    platform: 'instagram',
    category: 'greeting',
    language: 'es',
    isActive: true,
    usageCount: 45
  },
  {
    id: '2',
    name: 'General Greeting',
    content: 'Hello! Thank you for reaching out. How can we help you today?',
    platform: 'facebook',
    category: 'greeting',
    language: 'en',
    isActive: true,
    usageCount: 32
  },
  {
    id: '3',
    name: 'Soporte Técnico',
    content: 'Entendemos tu preocupación. Nuestro equipo técnico está revisando tu caso y te contactaremos pronto con una solución.',
    platform: 'twitter',
    category: 'support',
    language: 'es',
    isActive: true,
    usageCount: 18
  }
];

// Social Mentions
export const socialMentions: SocialMention[] = [
  {
    id: '1',
    platform: 'instagram',
    username: '@maria_garcia',
    content: '@caribemailpr ¡Excelente servicio! Mi paquete llegó antes de lo esperado. ¡Gracias!',
    timestamp: new Date('2024-01-15T11:30:00Z'),
    sentiment: 'positive',
    isReplied: true,
    replyContent: '¡Gracias María! Nos alegra saber que estás satisfecha con nuestro servicio. ¡Esperamos verte pronto!',
    replyTime: new Date('2024-01-15T11:45:00Z'),
    priority: 'medium',
    tags: ['positive', 'delivery', 'customer_satisfaction']
  },
  {
    id: '2',
    platform: 'twitter',
    username: '@juan_rodriguez',
    content: '@caribemailpr ¿Cuál es el estado de mi envío? Tracking number: TRK123456',
    timestamp: new Date('2024-01-15T10:15:00Z'),
    sentiment: 'neutral',
    isReplied: false,
    priority: 'high',
    tags: ['inquiry', 'tracking', 'urgent']
  },
  {
    id: '3',
    platform: 'facebook',
    username: 'Carlos López',
    content: 'Caribe Mail Puerto Rico - Very disappointed with the service. Package was damaged during delivery.',
    timestamp: new Date('2024-01-14T16:20:00Z'),
    sentiment: 'negative',
    isReplied: true,
    replyContent: 'We sincerely apologize for this issue. Please contact us directly at support@caribemail.com so we can resolve this immediately.',
    replyTime: new Date('2024-01-14T16:35:00Z'),
    priority: 'urgent',
    tags: ['complaint', 'damaged', 'urgent']
  }
];

// Social Analytics
export const socialAnalytics: SocialAnalytics = {
  period: 'Last 30 days',
  totalPosts: 45,
  totalEngagement: 2847,
  totalReach: 15600,
  totalImpressions: 23400,
  averageEngagementRate: 3.8,
  topPerformingPosts: socialPosts.slice(0, 3),
  platformBreakdown: [
    {
      platform: 'instagram',
      posts: 25,
      engagement: 1567,
      reach: 8900,
      impressions: 13400,
      engagementRate: 4.2,
      followers: 2847,
      growth: 12
    },
    {
      platform: 'facebook',
      posts: 15,
      engagement: 987,
      reach: 5200,
      impressions: 7800,
      engagementRate: 3.8,
      followers: 1892,
      growth: 8
    },
    {
      platform: 'twitter',
      posts: 5,
      engagement: 293,
      reach: 1500,
      impressions: 2200,
      engagementRate: 2.1,
      followers: 1245,
      growth: 5
    }
  ],
  audienceGrowth: [
    { date: new Date('2024-01-01'), followers: 2800, growth: 0 },
    { date: new Date('2024-01-05'), followers: 2820, growth: 20 },
    { date: new Date('2024-01-10'), followers: 2835, growth: 15 },
    { date: new Date('2024-01-15'), followers: 2847, growth: 12 }
  ],
  bestPostingTimes: [
    { dayOfWeek: 1, hour: 9, engagementRate: 4.5, reach: 1200 },
    { dayOfWeek: 3, hour: 15, engagementRate: 4.2, reach: 1100 },
    { dayOfWeek: 5, hour: 10, engagementRate: 4.0, reach: 1000 }
  ]
};

// Social Products (Instagram Shopping)
export const socialProducts: SocialProduct[] = [
  {
    id: '1',
    platform: 'instagram',
    productId: 'IG_PROD_001',
    name: 'Express Delivery Service',
    description: 'Same-day delivery service for urgent packages',
    price: 25.00,
    currency: 'USD',
    images: ['/images/products/express-delivery.jpg'],
    isActive: true,
    inventory: 999,
    category: 'Services',
    tags: ['express', 'delivery', 'urgent']
  },
  {
    id: '2',
    platform: 'instagram',
    productId: 'IG_PROD_002',
    name: 'Virtual Mailbox Plan',
    description: 'Professional mail handling and scanning service',
    price: 49.99,
    currency: 'USD',
    images: ['/images/products/virtual-mailbox.jpg'],
    isActive: true,
    inventory: 999,
    category: 'Services',
    tags: ['virtual', 'mailbox', 'scanning']
  }
];

// WhatsApp Messages
export const whatsappMessages: WhatsAppMessage[] = [
  {
    id: '1',
    phoneNumber: '+1787-555-0123',
    message: 'Hola, necesito información sobre el servicio de buzón virtual',
    timestamp: new Date('2024-01-15T11:00:00Z'),
    status: 'read',
    isIncoming: true,
    customerId: 'CUST_001'
  },
  {
    id: '2',
    phoneNumber: '+1787-555-0123',
    message: '¡Hola! Te ayudo con información sobre nuestro servicio de buzón virtual. ¿Te gustaría que te envíe los detalles por email?',
    timestamp: new Date('2024-01-15T11:05:00Z'),
    status: 'delivered',
    isIncoming: false,
    customerId: 'CUST_001'
  }
];

// Social Orders
export const socialOrders: SocialOrder[] = [
  {
    id: '1',
    platform: 'instagram',
    orderId: 'IG_ORD_001',
    customerId: 'CUST_001',
    products: [socialProducts[0]],
    total: 25.00,
    currency: 'USD',
    status: 'confirmed',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    shippingAddress: {
      street: '123 Calle Principal',
      city: 'San Juan',
      state: 'PR',
      zipCode: '00901',
      country: 'USA'
    }
  }
];

// Hashtag Suggestions
export const hashtagSuggestions: HashtagSuggestion[] = [
  { hashtag: '#CaribeMail', relevance: 0.95, popularity: 0.8, category: 'brand', language: 'es' },
  { hashtag: '#PuertoRico', relevance: 0.9, popularity: 0.9, category: 'location', language: 'es' },
  { hashtag: '#MailService', relevance: 0.85, popularity: 0.7, category: 'service', language: 'en' },
  { hashtag: '#Delivery', relevance: 0.8, popularity: 0.6, category: 'service', language: 'en' },
  { hashtag: '#Act60', relevance: 0.9, popularity: 0.5, category: 'specialized', language: 'en' },
  { hashtag: '#SanJuan', relevance: 0.85, popularity: 0.4, category: 'location', language: 'es' }
];

// Brand Guidelines
export const brandGuidelines: BrandGuideline = {
  id: '1',
  name: 'Caribe Mail Brand Guidelines',
  description: 'Complete brand guidelines for social media content',
  colors: [
    { name: 'Primary Blue', hex: '#0B5394', usage: 'Primary brand color' },
    { name: 'Sunrise Orange', hex: '#FF6B35', usage: 'Call-to-action buttons' },
    { name: 'Palm Green', hex: '#2ECC71', usage: 'Success states' }
  ],
  fonts: [
    { name: 'Inter', weights: [400, 500, 600, 700], usage: 'Primary font family' },
    { name: 'Montserrat', weights: [600, 700], usage: 'Headings' }
  ],
  logos: [
    { name: 'Primary Logo', url: '/images/brand/logo-primary.png', variants: ['color', 'white', 'black'], usage: 'Main brand logo' },
    { name: 'Icon', url: '/images/brand/icon.png', variants: ['color', 'white'], usage: 'Social media profiles' }
  ],
  voice: {
    tone: 'Professional yet friendly',
    personality: 'Reliable, efficient, community-focused',
    examples: [
      '¡Excelente servicio al cliente!',
      'We\'re here to help with all your mail needs',
      'Supporting Puerto Rico\'s business community'
    ]
  },
  doAndDont: [
    { type: 'do', description: 'Use Spanish and English content', example: 'Bilingual posts increase engagement' },
    { type: 'do', description: 'Show local Puerto Rican culture', example: 'Include local landmarks and events' },
    { type: 'dont', description: 'Use overly formal language', example: 'Avoid corporate jargon' },
    { type: 'dont', description: 'Ignore customer mentions', example: 'Always respond within 2 hours' }
  ]
};

// Social Reviews
export const socialReviews: SocialReview[] = [
  {
    id: '1',
    platform: 'facebook',
    customerName: 'María García',
    customerImage: '/images/customers/maria-garcia.jpg',
    rating: 5,
    review: 'Excelente servicio! Mi paquete llegó antes de lo esperado y en perfectas condiciones. El personal es muy amable y profesional.',
    timestamp: new Date('2024-01-14T15:30:00Z'),
    isVerified: true,
    helpful: 12,
    response: '¡Gracias María! Nos alegra saber que estás satisfecha con nuestro servicio.',
    responseTime: new Date('2024-01-14T16:00:00Z'),
    tags: ['delivery', 'customer_service', 'satisfaction']
  },
  {
    id: '2',
    platform: 'google',
    customerName: 'Carlos Rodríguez',
    customerImage: '/images/customers/carlos-rodriguez.jpg',
    rating: 4,
    review: 'Good service overall. The virtual mailbox feature is very convenient for my business. Would recommend!',
    timestamp: new Date('2024-01-13T10:15:00Z'),
    isVerified: true,
    helpful: 8,
    tags: ['virtual_mailbox', 'business', 'recommendation']
  }
];

// Testimonials
export const testimonials: Testimonial[] = [
  {
    id: '1',
    customerName: 'Ana Martínez',
    customerImage: '/images/testimonials/ana-martinez.jpg',
    customerTitle: 'Business Owner',
    company: 'Martínez Consulting',
    testimonial: 'Caribe Mail has been essential for my business. Their virtual mailbox service allows me to manage my mail remotely while maintaining a professional image.',
    rating: 5,
    isFeatured: true,
    isApproved: true,
    createdAt: new Date('2024-01-10T14:20:00Z'),
    tags: ['business', 'virtual_mailbox', 'professional']
  },
  {
    id: '2',
    customerName: 'Roberto Silva',
    customerImage: '/images/testimonials/roberto-silva.jpg',
    customerTitle: 'Act 60 Decree Holder',
    company: 'Silva Investments',
    testimonial: 'As an Act 60 decree holder, I need reliable mail services. Caribe Mail has exceeded my expectations with their secure and efficient handling.',
    rating: 5,
    isFeatured: true,
    isApproved: true,
    createdAt: new Date('2024-01-08T11:45:00Z'),
    tags: ['act60', 'secure', 'efficient']
  }
];

// Social Shares
export const socialShares: SocialShare[] = [
  {
    id: '1',
    platform: 'facebook',
    url: 'https://caribemail.com/services/virtual-mailbox',
    title: 'Virtual Mailbox Service - Caribe Mail',
    description: 'Professional mail handling and scanning service for businesses and individuals',
    imageUrl: '/images/shares/virtual-mailbox-share.jpg',
    shareCount: 45,
    clickCount: 23,
    createdAt: new Date('2024-01-15T09:00:00Z'),
    isActive: true
  },
  {
    id: '2',
    platform: 'twitter',
    url: 'https://caribemail.com/act60-services',
    title: 'Act 60 Mail Services - Caribe Mail PR',
    description: 'Specialized mail services for Act 60 decree holders in Puerto Rico',
    imageUrl: '/images/shares/act60-services-share.jpg',
    shareCount: 23,
    clickCount: 12,
    createdAt: new Date('2024-01-14T16:30:00Z'),
    isActive: true
  }
];

// Referral Programs
export const referralPrograms: ReferralProgram[] = [
  {
    id: '1',
    customerId: 'CUST_001',
    referralCode: 'MARIA2024',
    referredCustomers: [
      {
        id: 'REF_001',
        name: 'Juan Pérez',
        email: 'juan.perez@email.com',
        signupDate: new Date('2024-01-10T10:00:00Z'),
        firstOrderDate: new Date('2024-01-12T14:30:00Z'),
        commission: 10.00,
        status: 'qualified'
      }
    ],
    totalEarnings: 10.00,
    pendingEarnings: 0,
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z')
  }
];

// Influencer Partnerships
export const influencerPartnerships: InfluencerPartnership[] = [
  {
    id: '1',
    influencerName: 'Isabella Torres',
    platform: 'instagram',
    username: '@isabella_torres_pr',
    followers: 45000,
    engagementRate: 3.8,
    category: 'Lifestyle & Business',
    contactEmail: 'isabella@email.com',
    status: 'active',
    campaignDetails: {
      startDate: new Date('2024-01-01T00:00:00Z'),
      endDate: new Date('2024-01-31T23:59:59Z'),
      budget: 2000,
      deliverables: ['3 Instagram posts', '2 Instagram stories', '1 Reel'],
      requirements: ['Include #CaribeMail', 'Tag @caribemailpr', 'Show virtual mailbox service']
    },
    performance: {
      posts: 2,
      reach: 89000,
      engagement: 3400,
      clicks: 450,
      conversions: 12,
      roi: 2.1
    }
  }
];

// Community Forums
export const communityForums: CommunityForum[] = [
  {
    id: '1',
    name: 'General Discussion',
    description: 'General discussions about mail services and Caribe Mail',
    category: 'general',
    topics: [],
    members: 156,
    isActive: true,
    moderators: ['admin@caribemail.com'],
    rules: [
      'Be respectful to other members',
      'No spam or promotional content',
      'Keep discussions relevant to mail services'
    ]
  },
  {
    id: '2',
    name: 'Act 60 Support',
    description: 'Support and discussions for Act 60 decree holders',
    category: 'customer_service',
    topics: [],
    members: 89,
    isActive: true,
    moderators: ['admin@caribemail.com', 'support@caribemail.com'],
    rules: [
      'Confidential information should be shared privately',
      'No legal advice - consult with professionals',
      'Share experiences and tips respectfully'
    ]
  }
];

// Package Shares
export const packageShares: PackageShare[] = [
  {
    id: '1',
    customerId: 'CUST_001',
    customerName: 'María García',
    packageImage: '/images/packages/package-1.jpg',
    description: '¡Mi paquete llegó perfecto! Gracias Caribe Mail por el excelente servicio de entrega express.',
    location: 'San Juan, PR',
    likes: 23,
    comments: [
      {
        id: '1',
        authorId: 'CUST_002',
        authorName: 'Carlos López',
        content: '¡Se ve genial! ¿Cuánto tiempo tardó en llegar?',
        timestamp: new Date('2024-01-15T12:30:00Z'),
        likes: 2
      }
    ],
    createdAt: new Date('2024-01-15T11:00:00Z'),
    isPublic: true,
    tags: ['delivery', 'express', 'satisfaction']
  }
];

// Delivery Groups
export const deliveryGroups: DeliveryGroup[] = [
  {
    id: '1',
    name: 'San Juan Express',
    description: 'Express delivery group for San Juan metropolitan area',
    location: 'San Juan, PR',
    members: [
      {
        id: 'MEMBER_001',
        name: 'María García',
        email: 'maria@email.com',
        phone: '+1787-555-0001',
        address: '123 Calle Principal, San Juan, PR 00901',
        joinDate: new Date('2024-01-01T00:00:00Z'),
        isAdmin: true
      }
    ],
    packages: [
      {
        id: 'PKG_001',
        trackingNumber: 'TRK123456',
        recipientId: 'MEMBER_001',
        recipientName: 'María García',
        status: 'delivered',
        estimatedDelivery: new Date('2024-01-15T14:00:00Z'),
        actualDelivery: new Date('2024-01-15T13:45:00Z')
      }
    ],
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    schedule: {
      dayOfWeek: 1,
      timeSlot: '14:00-16:00',
      isActive: true
    }
  }
];

// Local Events
export const localEvents: LocalEvent[] = [
  {
    id: '1',
    title: 'Caribe Mail Community Meetup',
    description: 'Join us for our monthly community meetup! Learn about new services, share feedback, and network with other customers.',
    location: 'Caribe Mail Office, San Juan',
    startDate: new Date('2024-01-25T18:00:00Z'),
    endDate: new Date('2024-01-25T20:00:00Z'),
    organizerId: 'ORG_001',
    organizerName: 'Caribe Mail Team',
    attendees: [
      {
        id: 'ATT_001',
        name: 'María García',
        email: 'maria@email.com',
        status: 'going',
        rsvpDate: new Date('2024-01-10T10:00:00Z')
      }
    ],
    maxAttendees: 50,
    isPublic: true,
    category: 'meetup',
    tags: ['community', 'meetup', 'networking']
  }
];

// Social Settings
export const socialSettings: SocialSettings = {
  autoReply: true,
  autoReplyTemplate: '¡Gracias por contactarnos! Te responderemos pronto.',
  mentionNotifications: true,
  postNotifications: true,
  analyticsEnabled: true,
  contentModeration: true,
  language: 'es',
  timezone: 'America/Puerto_Rico',
  businessHours: {
    monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    saturday: { isOpen: true, openTime: '09:00', closeTime: '15:00' },
    sunday: { isOpen: false }
  }
};

// Utility functions
export const getSocialAccountByPlatform = (platform: string): SocialAccount | undefined => {
  return socialAccounts.find(account => account.platform === platform);
};

export const getSocialPostsByPlatform = (platform: string): SocialPost[] => {
  return socialPosts.filter(post => post.platform === platform);
};

export const getPostTemplatesByCategory = (category: string): PostTemplate[] => {
  return postTemplates.filter(template => template.category === category);
};

export const getResponseTemplatesByPlatform = (platform: string): ResponseTemplate[] => {
  return responseTemplates.filter(template => template.platform === platform);
};

export const getMentionsByPriority = (priority: string): SocialMention[] => {
  return socialMentions.filter(mention => mention.priority === priority);
};

export const getHashtagSuggestionsByCategory = (category: string): HashtagSuggestion[] => {
  return hashtagSuggestions.filter(suggestion => suggestion.category === category);
}; 