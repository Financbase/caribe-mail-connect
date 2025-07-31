// Loyalty System Types for PRMCMS

export interface LoyaltyPoints {
  id: string;
  userId: string;
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
  lastUpdated: Date;
  expiresAt?: Date;
}

export interface LoyaltyTier {
  id: string;
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  displayName: string;
  description: string;
  minPoints: number;
  maxPoints?: number;
  color: string;
  icon: string;
  benefits: TierBenefit[];
  upgradeRequirements: UpgradeRequirement[];
}

export interface TierBenefit {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  value?: number;
  type: 'percentage' | 'fixed' | 'feature';
}

export interface UpgradeRequirement {
  id: string;
  type: 'points' | 'shipments' | 'referrals' | 'reviews' | 'streak';
  value: number;
  description: string;
  progress: number;
  completed: boolean;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  category: RewardCategory;
  pointsCost: number;
  originalValue: number;
  currentValue: number;
  image: string;
  isAvailable: boolean;
  isLimited: boolean;
  maxRedemptions?: number;
  currentRedemptions: number;
  validFrom: Date;
  validUntil?: Date;
  partnerId?: string;
  partnerName?: string;
}

export type RewardCategory = 
  | 'shipping_credits'
  | 'service_upgrades'
  | 'partner_rewards'
  | 'gift_cards'
  | 'charitable_donations'
  | 'exclusive_events'
  | 'premium_features';

export interface RewardRedemption {
  id: string;
  userId: string;
  rewardId: string;
  reward: LoyaltyReward;
  pointsSpent: number;
  redeemedAt: Date;
  status: RedemptionStatus;
  activationCode?: string;
  expiresAt?: Date;
  usedAt?: Date;
}

export type RedemptionStatus = 'pending' | 'active' | 'used' | 'expired' | 'cancelled';

export interface PointsTransaction {
  id: string;
  userId: string;
  type: PointsTransactionType;
  amount: number;
  balance: number;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  expiresAt?: Date;
}

export type PointsTransactionType = 
  | 'shipment_earned'
  | 'referral_bonus'
  | 'social_share'
  | 'review_incentive'
  | 'birthday_bonus'
  | 'achievement_bonus'
  | 'streak_bonus'
  | 'challenge_completion'
  | 'reward_redemption'
  | 'points_expired'
  | 'admin_adjustment';

export interface LoyaltyAchievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  pointsReward: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  rarity: AchievementRarity;
  badgeImage: string;
}

export type AchievementCategory = 
  | 'shipments'
  | 'referrals'
  | 'social'
  | 'reviews'
  | 'streaks'
  | 'community'
  | 'special_events';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface LoyaltyChallenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  goal: number;
  currentProgress: number;
  pointsReward: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: Date;
  participants: number;
  maxParticipants?: number;
}

export type ChallengeType = 
  | 'shipment_count'
  | 'referral_count'
  | 'social_shares'
  | 'review_count'
  | 'streak_days'
  | 'community_contribution';

export interface LoyaltyStreak {
  id: string;
  userId: string;
  type: StreakType;
  currentStreak: number;
  longestStreak: number;
  lastActivity: Date;
  nextMilestone: number;
  milestoneReward: number;
}

export type StreakType = 'shipments' | 'logins' | 'reviews' | 'social_shares';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  points: number;
  tier: string;
  rank: number;
  achievements: number;
  streak: number;
}

export interface CommunityGoal {
  id: string;
  name: string;
  description: string;
  target: number;
  currentProgress: number;
  reward: CommunityReward;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  participants: number;
  contribution: number;
}

export interface CommunityReward {
  type: 'points' | 'feature' | 'event';
  value: number;
  description: string;
}

export interface LoyaltyAnalytics {
  totalPoints: number;
  averagePointsPerUser: number;
  topEarners: LeaderboardEntry[];
  popularRewards: LoyaltyReward[];
  tierDistribution: Record<string, number>;
  monthlyGrowth: number;
  redemptionRate: number;
  engagementScore: number;
}

export interface LoyaltySettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  birthdayReminders: boolean;
  achievementAlerts: boolean;
  challengeReminders: boolean;
  privacySettings: PrivacySettings;
}

export interface PrivacySettings {
  showOnLeaderboard: boolean;
  shareAchievements: boolean;
  allowReferrals: boolean;
  publicProfile: boolean;
}

export interface ReferralProgram {
  id: string;
  referrerId: string;
  referredEmail: string;
  status: ReferralStatus;
  pointsEarned: number;
  createdAt: Date;
  completedAt?: Date;
  referralCode: string;
}

export type ReferralStatus = 'pending' | 'registered' | 'completed' | 'expired';

export interface SocialShare {
  id: string;
  userId: string;
  platform: SocialPlatform;
  content: string;
  pointsEarned: number;
  sharedAt: Date;
  engagement?: number;
}

export type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'whatsapp';

export interface ReviewIncentive {
  id: string;
  userId: string;
  platform: ReviewPlatform;
  rating: number;
  review: string;
  pointsEarned: number;
  submittedAt: Date;
  verified: boolean;
}

export type ReviewPlatform = 'google' | 'facebook' | 'yelp' | 'trustpilot' | 'internal';

// API Response Types
export interface LoyaltyDashboardData {
  points: LoyaltyPoints;
  tier: LoyaltyTier;
  nextTier?: LoyaltyTier;
  recentTransactions: PointsTransaction[];
  availableRewards: LoyaltyReward[];
  achievements: LoyaltyAchievement[];
  activeChallenges: LoyaltyChallenge[];
  streaks: LoyaltyStreak[];
  leaderboard: LeaderboardEntry[];
  communityGoals: CommunityGoal[];
  analytics: LoyaltyAnalytics;
}

export interface LoyaltyState {
  loading: boolean;
  error: string | null;
  data: LoyaltyDashboardData | null;
  settings: LoyaltySettings | null;
} 