/**
 * Growth Types
 * Story 1.4: Integrated Growth Platform
 * 
 * TypeScript types for growth platform, referral programs,
 * customer segments, and growth campaigns
 */

// =====================================================
// GROWTH METRICS TYPES
// =====================================================

export interface GrowthMetrics {
  total_customers: number;
  customer_growth_rate: number;
  active_referrals: number;
  referral_growth_rate: number;
  loyalty_members: number;
  retention_rate: number;
  retention_improvement: number;
  revenue_growth_rate: number;
  monthly_revenue: number;
  engagement_score: number;
  funnel_metrics: FunnelMetrics;
  time_range: string;
  last_updated: string;
}

export interface FunnelMetrics {
  visitors: FunnelStage;
  signups: FunnelStage;
  trials: FunnelStage;
  customers: FunnelStage;
  loyal_customers: FunnelStage;
}

export interface FunnelStage {
  count: number;
  conversion_rate: number;
}

// =====================================================
// REFERRAL PROGRAM TYPES
// =====================================================

export interface ReferralProgram {
  id: string;
  subscription_id: string;
  name: string;
  description: string;
  referrer_reward: number;
  referee_reward: number;
  reward_type: 'points' | 'discount' | 'credit';
  minimum_purchase?: number;
  expiry_days?: number;
  max_referrals_per_user?: number;
  is_active: boolean;
  total_referrals: number;
  successful_referrals: number;
  conversion_rate: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerReferral {
  id: string;
  subscription_id: string;
  program_id: string;
  referrer_customer_id: string;
  referred_customer_id?: string;
  referral_code: string;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  reward_given: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReferralReward {
  id: string;
  referral_id: string;
  customer_id: string;
  reward_type: 'points' | 'discount' | 'credit';
  reward_amount: number;
  status: 'pending' | 'awarded' | 'redeemed';
  awarded_at?: string;
  redeemed_at?: string;
  created_at: string;
}

// =====================================================
// CUSTOMER SEGMENT TYPES
// =====================================================

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  customer_count: number;
  growth_rate: number;
}

export interface SegmentCriteria {
  min_ltv?: number;
  max_ltv?: number;
  loyalty_tier?: string[];
  last_activity?: string;
  engagement_score?: string;
  purchase_frequency?: string;
  geographic_region?: string[];
  subscription_tier?: string[];
  custom_attributes?: Record<string, any>;
}

export interface CustomerSegmentMembership {
  id: string;
  segment_id: string;
  customer_id: string;
  joined_at: string;
  left_at?: string;
  is_active: boolean;
}

// =====================================================
// GROWTH CAMPAIGN TYPES
// =====================================================

export interface GrowthCampaign {
  id: string;
  subscription_id: string;
  name: string;
  description: string;
  type: 'referral' | 'loyalty' | 'retention' | 'acquisition' | 'engagement';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  target_segment_ids: string[];
  start_date: string;
  end_date?: string;
  budget?: number;
  goals: CampaignGoal[];
  performance: CampaignPerformance;
  created_at: string;
  updated_at: string;
}

export interface CampaignGoal {
  metric: string;
  target_value: number;
  current_value: number;
  unit: string;
}

export interface CampaignPerformance {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
  roi: number;
  click_through_rate: number;
  conversion_rate: number;
  cost_per_acquisition: number;
  customer_lifetime_value: number;
}

// =====================================================
// RETENTION ANALYSIS TYPES
// =====================================================

export interface RetentionAnalysis {
  subscription_id: string;
  period: string;
  cohort_data: CohortData[];
  retention_rates: RetentionRate[];
  churn_analysis: ChurnAnalysis;
  calculated_at: string;
}

export interface CohortData {
  cohort_month: string;
  customer_count: number;
  retention_by_month: number[];
}

export interface RetentionRate {
  period: string;
  rate: number;
  customer_count: number;
  churned_count: number;
}

export interface ChurnAnalysis {
  overall_churn_rate: number;
  churn_by_segment: SegmentChurnRate[];
  churn_reasons: ChurnReason[];
  at_risk_customers: number;
}

export interface SegmentChurnRate {
  segment_id: string;
  segment_name: string;
  churn_rate: number;
  customer_count: number;
}

export interface ChurnReason {
  reason: string;
  count: number;
  percentage: number;
}

// =====================================================
// LOYALTY INTEGRATION TYPES
// =====================================================

export interface LoyaltyGrowthMetrics {
  total_loyalty_members: number;
  loyalty_member_growth_rate: number;
  average_points_per_member: number;
  points_redemption_rate: number;
  tier_distribution: TierDistribution[];
  loyalty_driven_referrals: number;
  loyalty_retention_impact: number;
}

export interface TierDistribution {
  tier_name: string;
  member_count: number;
  percentage: number;
  average_engagement: number;
}

// =====================================================
// GROWTH AUTOMATION TYPES
// =====================================================

export interface GrowthAutomation {
  id: string;
  subscription_id: string;
  name: string;
  description: string;
  trigger_type: 'customer_signup' | 'referral_completed' | 'tier_upgrade' | 'inactivity_detected' | 'milestone_reached';
  trigger_conditions: AutomationCondition[];
  actions: AutomationAction[];
  is_active: boolean;
  execution_count: number;
  success_rate: number;
  created_at: string;
  updated_at: string;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
  logical_operator?: 'AND' | 'OR';
}

export interface AutomationAction {
  type: 'send_email' | 'award_points' | 'create_referral_code' | 'update_segment' | 'trigger_campaign';
  parameters: Record<string, any>;
  delay_minutes?: number;
}

// =====================================================
// ANALYTICS TYPES
// =====================================================

export interface GrowthAnalytics {
  subscription_id: string;
  time_period: string;
  customer_acquisition: AcquisitionMetrics;
  customer_retention: RetentionMetrics;
  revenue_growth: RevenueMetrics;
  engagement_metrics: EngagementMetrics;
  referral_performance: ReferralMetrics;
  loyalty_impact: LoyaltyImpactMetrics;
  calculated_at: string;
}

export interface AcquisitionMetrics {
  new_customers: number;
  acquisition_cost: number;
  acquisition_channels: ChannelMetrics[];
  conversion_funnel: FunnelMetrics;
}

export interface ChannelMetrics {
  channel: string;
  customers_acquired: number;
  cost: number;
  cost_per_acquisition: number;
  conversion_rate: number;
}

export interface RetentionMetrics {
  retention_rate: number;
  churn_rate: number;
  customer_lifetime_value: number;
  retention_by_cohort: CohortData[];
}

export interface RevenueMetrics {
  total_revenue: number;
  revenue_growth_rate: number;
  average_revenue_per_user: number;
  revenue_by_segment: SegmentRevenue[];
}

export interface SegmentRevenue {
  segment_id: string;
  segment_name: string;
  revenue: number;
  customer_count: number;
  average_revenue_per_customer: number;
}

export interface EngagementMetrics {
  daily_active_users: number;
  monthly_active_users: number;
  session_duration: number;
  feature_adoption_rates: FeatureAdoption[];
}

export interface FeatureAdoption {
  feature_name: string;
  adoption_rate: number;
  active_users: number;
}

export interface ReferralMetrics {
  total_referrals: number;
  successful_referrals: number;
  referral_conversion_rate: number;
  referral_revenue: number;
  top_referrers: TopReferrer[];
}

export interface TopReferrer {
  customer_id: string;
  customer_name: string;
  referral_count: number;
  successful_referrals: number;
  revenue_generated: number;
}

export interface LoyaltyImpactMetrics {
  loyalty_member_retention: number;
  non_loyalty_member_retention: number;
  loyalty_member_ltv: number;
  non_loyalty_member_ltv: number;
  points_to_revenue_ratio: number;
}
