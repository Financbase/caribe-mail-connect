// Social Media Types for PRMCMS
// Comprehensive interfaces for social media features

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  profileImage: string;
  isConnected: boolean;
  isActive: boolean;
  lastSync: Date;
  followers: number;
  following: number;
  posts: number;
  engagementRate: number;
  accessToken?: string;
  refreshToken?: string;
  permissions: string[];
}

export type SocialPlatform = 
  | 'instagram' 
  | 'facebook' 
  | 'twitter' 
  | 'tiktok' 
  | 'whatsapp' 
  | 'linkedin' 
  | 'youtube';

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  mediaUrls: string[];
  scheduledTime?: Date;
  publishedTime?: Date;
  status: PostStatus;
  engagement: SocialEngagement;
  hashtags: string[];
  mentions: string[];
  location?: string;
  isSponsored: boolean;
  budget?: number;
  targetAudience?: string[];
  language: 'es' | 'en';
  translations?: Record<string, string>;
}

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed' | 'archived';

export interface SocialEngagement {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  impressions: number;
  reach: number;
  engagementRate: number;
}

export interface PostTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  mediaPlaceholders: string[];
  hashtags: string[];
  category: PostCategory;
  language: 'es' | 'en';
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
}

export type PostCategory = 
  | 'promotional' 
  | 'educational' 
  | 'community' 
  | 'announcement' 
  | 'customer_spotlight' 
  | 'behind_scenes';

export interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  platform: SocialPlatform;
  category: ResponseCategory;
  language: 'es' | 'en';
  isActive: boolean;
  usageCount: number;
}

export type ResponseCategory = 
  | 'greeting' 
  | 'support' 
  | 'inquiry' 
  | 'complaint' 
  | 'thank_you' 
  | 'general';

export interface SocialMention {
  id: string;
  platform: SocialPlatform;
  username: string;
  content: string;
  timestamp: Date;
  sentiment: Sentiment;
  isReplied: boolean;
  replyContent?: string;
  replyTime?: Date;
  priority: MentionPriority;
  tags: string[];
}

export type Sentiment = 'positive' | 'negative' | 'neutral' | 'mixed';
export type MentionPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SocialAnalytics {
  period: string;
  totalPosts: number;
  totalEngagement: number;
  totalReach: number;
  totalImpressions: number;
  averageEngagementRate: number;
  topPerformingPosts: SocialPost[];
  platformBreakdown: PlatformAnalytics[];
  audienceGrowth: AudienceGrowth[];
  bestPostingTimes: PostingTimeAnalytics[];
}

export interface PlatformAnalytics {
  platform: SocialPlatform;
  posts: number;
  engagement: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  followers: number;
  growth: number;
}

export interface AudienceGrowth {
  date: Date;
  followers: number;
  growth: number;
}

export interface PostingTimeAnalytics {
  dayOfWeek: number;
  hour: number;
  engagementRate: number;
  reach: number;
}

// Social Shipping Types
export interface SocialProduct {
  id: string;
  platform: SocialPlatform;
  productId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  isActive: boolean;
  inventory: number;
  category: string;
  tags: string[];
}

export interface WhatsAppMessage {
  id: string;
  phoneNumber: string;
  message: string;
  mediaUrl?: string;
  timestamp: Date;
  status: MessageStatus;
  isIncoming: boolean;
  customerId?: string;
  orderId?: string;
}

export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface SocialOrder {
  id: string;
  platform: SocialPlatform;
  orderId: string;
  customerId: string;
  products: SocialProduct[];
  total: number;
  currency: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: Address;
  trackingNumber?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Content Creation Types
export interface ImageEditor {
  id: string;
  originalImage: string;
  editedImage?: string;
  filters: ImageFilter[];
  adjustments: ImageAdjustments;
  overlays: ImageOverlay[];
  text: TextElement[];
  dimensions: ImageDimensions;
}

export interface ImageFilter {
  type: string;
  intensity: number;
}

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  sharpness: number;
}

export interface ImageOverlay {
  type: 'logo' | 'sticker' | 'frame';
  url: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  opacity: number;
}

export interface TextElement {
  text: string;
  font: string;
  size: number;
  color: string;
  position: { x: number; y: number };
  alignment: 'left' | 'center' | 'right';
  effects: TextEffect[];
}

export interface TextEffect {
  type: 'shadow' | 'outline' | 'gradient';
  properties: Record<string, any>;
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: string;
}

export interface HashtagSuggestion {
  hashtag: string;
  relevance: number;
  popularity: number;
  category: string;
  language: 'es' | 'en';
}

export interface BrandGuideline {
  id: string;
  name: string;
  description: string;
  colors: BrandColor[];
  fonts: BrandFont[];
  logos: BrandLogo[];
  voice: BrandVoice;
  doAndDont: DoAndDont[];
}

export interface BrandColor {
  name: string;
  hex: string;
  usage: string;
}

export interface BrandFont {
  name: string;
  weights: number[];
  usage: string;
}

export interface BrandLogo {
  name: string;
  url: string;
  variants: string[];
  usage: string;
}

export interface BrandVoice {
  tone: string;
  personality: string;
  examples: string[];
}

export interface DoAndDont {
  type: 'do' | 'dont';
  description: string;
  example?: string;
}

// Social Proof Types
export interface SocialReview {
  id: string;
  platform: SocialPlatform;
  customerName: string;
  customerImage?: string;
  rating: number;
  review: string;
  timestamp: Date;
  isVerified: boolean;
  helpful: number;
  response?: string;
  responseTime?: Date;
  tags: string[];
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerImage?: string;
  customerTitle?: string;
  company?: string;
  testimonial: string;
  rating: number;
  isFeatured: boolean;
  isApproved: boolean;
  createdAt: Date;
  mediaUrl?: string;
  tags: string[];
}

export interface SocialShare {
  id: string;
  platform: SocialPlatform;
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
  shareCount: number;
  clickCount: number;
  createdAt: Date;
  isActive: boolean;
}

export interface ReferralProgram {
  id: string;
  customerId: string;
  referralCode: string;
  referredCustomers: ReferredCustomer[];
  totalEarnings: number;
  pendingEarnings: number;
  isActive: boolean;
  createdAt: Date;
}

export interface ReferredCustomer {
  id: string;
  name: string;
  email: string;
  signupDate: Date;
  firstOrderDate?: Date;
  commission: number;
  status: ReferralStatus;
}

export type ReferralStatus = 'pending' | 'qualified' | 'paid' | 'expired';

export interface InfluencerPartnership {
  id: string;
  influencerName: string;
  platform: SocialPlatform;
  username: string;
  followers: number;
  engagementRate: number;
  category: string;
  contactEmail: string;
  status: PartnershipStatus;
  campaignDetails: CampaignDetails;
  performance: PartnershipPerformance;
}

export type PartnershipStatus = 'prospecting' | 'contacted' | 'negotiating' | 'active' | 'completed' | 'declined';

export interface CampaignDetails {
  startDate: Date;
  endDate: Date;
  budget: number;
  deliverables: string[];
  requirements: string[];
}

export interface PartnershipPerformance {
  posts: number;
  reach: number;
  engagement: number;
  clicks: number;
  conversions: number;
  roi: number;
}

// Community Features Types
export interface CommunityForum {
  id: string;
  name: string;
  description: string;
  category: ForumCategory;
  topics: ForumTopic[];
  members: number;
  isActive: boolean;
  moderators: string[];
  rules: string[];
}

export type ForumCategory = 
  | 'general' 
  | 'shipping' 
  | 'customer_service' 
  | 'announcements' 
  | 'feedback' 
  | 'events';

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  lastReply?: Date;
  replies: number;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  tags: string[];
}

export interface PackageShare {
  id: string;
  customerId: string;
  customerName: string;
  packageImage: string;
  description: string;
  location: string;
  likes: number;
  comments: PackageComment[];
  createdAt: Date;
  isPublic: boolean;
  tags: string[];
}

export interface PackageComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
  likes: number;
}

export interface DeliveryGroup {
  id: string;
  name: string;
  description: string;
  location: string;
  members: DeliveryGroupMember[];
  packages: DeliveryGroupPackage[];
  isActive: boolean;
  createdAt: Date;
  schedule: DeliverySchedule;
}

export interface DeliveryGroupMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: Date;
  isAdmin: boolean;
}

export interface DeliveryGroupPackage {
  id: string;
  trackingNumber: string;
  recipientId: string;
  recipientName: string;
  status: PackageStatus;
  estimatedDelivery: Date;
  actualDelivery?: Date;
}

export type PackageStatus = 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed';

export interface DeliverySchedule {
  dayOfWeek: number;
  timeSlot: string;
  isActive: boolean;
}

export interface LocalEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  organizerId: string;
  organizerName: string;
  attendees: EventAttendee[];
  maxAttendees?: number;
  isPublic: boolean;
  category: EventCategory;
  tags: string[];
}

export interface EventAttendee {
  id: string;
  name: string;
  email: string;
  status: AttendanceStatus;
  rsvpDate: Date;
}

export type AttendanceStatus = 'going' | 'maybe' | 'not_going' | 'pending';
export type EventCategory = 'meetup' | 'workshop' | 'celebration' | 'announcement' | 'community';

// Social Media Settings
export interface SocialSettings {
  autoReply: boolean;
  autoReplyTemplate: string;
  mentionNotifications: boolean;
  postNotifications: boolean;
  analyticsEnabled: boolean;
  contentModeration: boolean;
  language: 'es' | 'en';
  timezone: string;
  businessHours: BusinessHours;
}

export interface BusinessHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
} 