/**
 * Enhanced Customer Types
 * Story 1.2: Enhanced Customer Management
 * 
 * Extends existing customer system with subscription context,
 * lifecycle management, segmentation, and communication features
 */

import type { Subscription } from './subscription';

// =====================================================
// ENHANCED CUSTOMER TYPES
// =====================================================

export type CustomerType = 'individual' | 'business' | 'act_60';
export type CustomerStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';
export type CustomerTier = 'standard' | 'premium' | 'vip' | 'enterprise';

export interface EnhancedCustomer {
  // Core customer fields (existing)
  id: string;
  user_id?: string;
  mailbox_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  business_name?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  customer_type: CustomerType;
  status: CustomerStatus;
  notes?: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  
  // Act 60 fields (existing)
  act_60_status?: boolean;
  act_60_decree_number?: string;
  act_60_expiration_date?: string;
  
  // VIP handling (existing)
  vip_handling_preferences?: Record<string, any>;
  priority_notification?: boolean;
  express_handling?: boolean;
  dedicated_support_contact?: string;
  special_pricing_tier?: string;
  
  // Location and subscription context (existing)
  location_id?: string;
  loyalty_points?: number;
  subscription_id?: string;
  
  // Enhanced fields for Story 1.2
  customer_tier: CustomerTier;
  lifecycle_stage: CustomerLifecycleStage;
  communication_preferences: CustomerCommunicationPreferences;
  segmentation_tags: string[];
  last_activity_at?: string;
  onboarding_completed: boolean;
  referral_source?: string;
  lifetime_value: number;
  risk_score: number;
  satisfaction_score?: number;
  
  // Computed fields
  total_packages?: number;
  active_packages?: number;
  monthly_spend?: number;
  engagement_score?: number;
}

// =====================================================
// CUSTOMER LIFECYCLE MANAGEMENT
// =====================================================

export type CustomerLifecycleStage = 
  | 'prospect'
  | 'new_customer'
  | 'onboarding'
  | 'active'
  | 'engaged'
  | 'at_risk'
  | 'dormant'
  | 'churned'
  | 'reactivated';

export interface CustomerLifecycleEvent {
  id: string;
  customer_id: string;
  event_type: CustomerLifecycleEventType;
  from_stage?: CustomerLifecycleStage;
  to_stage: CustomerLifecycleStage;
  triggered_by: 'system' | 'manual' | 'automation';
  trigger_data?: Record<string, any>;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export type CustomerLifecycleEventType =
  | 'stage_change'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'first_package'
  | 'engagement_increase'
  | 'engagement_decrease'
  | 'risk_identified'
  | 'churn_predicted'
  | 'reactivation_attempt'
  | 'manual_intervention';

// =====================================================
// CUSTOMER COMMUNICATION
// =====================================================

export interface CustomerCommunicationPreferences {
  email_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  push_notifications_enabled: boolean;
  
  // Communication frequency
  marketing_frequency: 'never' | 'weekly' | 'monthly' | 'quarterly';
  operational_notifications: boolean;
  package_notifications: boolean;
  billing_notifications: boolean;
  
  // Language and timing
  preferred_language: 'en' | 'es';
  preferred_contact_time: 'morning' | 'afternoon' | 'evening' | 'any';
  timezone: string;
  
  // Channel preferences by message type
  package_alerts_channel: 'email' | 'sms' | 'whatsapp' | 'push';
  billing_alerts_channel: 'email' | 'sms' | 'whatsapp' | 'push';
  marketing_channel: 'email' | 'sms' | 'whatsapp' | 'none';
}

export interface CustomerCommunication {
  id: string;
  customer_id: string;
  subscription_id?: string;
  
  // Communication details
  type: CustomerCommunicationType;
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app' | 'phone';
  subject?: string;
  content: string;
  template_id?: string;
  
  // Status and tracking
  status: 'draft' | 'scheduled' | 'sent' | 'delivered' | 'read' | 'failed';
  scheduled_at?: string;
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  failed_reason?: string;
  
  // Context and automation
  triggered_by: 'manual' | 'automation' | 'lifecycle' | 'event';
  automation_id?: string;
  event_data?: Record<string, any>;
  
  // Metadata
  metadata: Record<string, any>;
  created_at: string;
  created_by?: string;
}

export type CustomerCommunicationType =
  | 'welcome'
  | 'onboarding'
  | 'package_notification'
  | 'billing_reminder'
  | 'payment_confirmation'
  | 'service_update'
  | 'marketing'
  | 'retention'
  | 'reactivation'
  | 'feedback_request'
  | 'support'
  | 'compliance_reminder';

// =====================================================
// CUSTOMER SEGMENTATION
// =====================================================

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  subscription_id: string;
  
  // Segment criteria
  criteria: CustomerSegmentCriteria;
  
  // Segment metadata
  customer_count: number;
  last_updated_at: string;
  is_dynamic: boolean; // Auto-updates based on criteria
  
  // Automation settings
  automation_enabled: boolean;
  automation_rules?: CustomerSegmentAutomation[];
  
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by?: string;
}

export interface CustomerSegmentCriteria {
  // Demographic criteria
  customer_types?: CustomerType[];
  customer_tiers?: CustomerTier[];
  lifecycle_stages?: CustomerLifecycleStage[];
  
  // Behavioral criteria
  min_packages_per_month?: number;
  max_packages_per_month?: number;
  min_lifetime_value?: number;
  max_lifetime_value?: number;
  min_loyalty_points?: number;
  
  // Engagement criteria
  min_engagement_score?: number;
  max_engagement_score?: number;
  last_activity_days_ago?: number;
  
  // Geographic criteria
  cities?: string[];
  states?: string[];
  zip_codes?: string[];
  
  // Custom criteria
  tags?: string[];
  custom_fields?: Record<string, any>;
}

export interface CustomerSegmentAutomation {
  id: string;
  trigger: 'segment_entry' | 'segment_exit' | 'periodic';
  action: CustomerSegmentAction;
  delay_hours?: number;
  conditions?: Record<string, any>;
  is_active: boolean;
}

export type CustomerSegmentAction =
  | 'send_email'
  | 'send_sms'
  | 'assign_tag'
  | 'remove_tag'
  | 'change_tier'
  | 'create_task'
  | 'trigger_workflow';

// =====================================================
// CUSTOMER ANALYTICS
// =====================================================

export interface CustomerAnalytics {
  customer_id: string;
  subscription_id: string;
  
  // Engagement metrics
  engagement_score: number;
  last_login_at?: string;
  total_logins: number;
  avg_session_duration: number;
  
  // Package metrics
  total_packages: number;
  packages_this_month: number;
  packages_last_month: number;
  avg_packages_per_month: number;
  
  // Financial metrics
  lifetime_value: number;
  monthly_spend: number;
  total_spend: number;
  avg_package_value: number;
  
  // Communication metrics
  emails_sent: number;
  emails_opened: number;
  emails_clicked: number;
  sms_sent: number;
  sms_delivered: number;
  
  // Satisfaction metrics
  satisfaction_score?: number;
  nps_score?: number;
  support_tickets: number;
  complaints: number;
  
  // Risk metrics
  risk_score: number;
  churn_probability: number;
  days_since_last_package: number;
  
  // Computed at
  computed_at: string;
}

// =====================================================
// CUSTOMER ONBOARDING
// =====================================================

export interface CustomerOnboarding {
  id: string;
  customer_id: string;
  subscription_id: string;
  
  // Onboarding progress
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  current_step: number;
  total_steps: number;
  completion_percentage: number;
  
  // Onboarding steps
  steps_completed: CustomerOnboardingStep[];
  next_step?: CustomerOnboardingStep;
  
  // Timeline
  started_at?: string;
  completed_at?: string;
  abandoned_at?: string;
  estimated_completion_date?: string;
  
  // Automation
  automated_reminders_enabled: boolean;
  last_reminder_sent_at?: string;
  
  created_at: string;
  updated_at: string;
}

export interface CustomerOnboardingStep {
  step_number: number;
  step_name: string;
  step_type: 'form' | 'verification' | 'tutorial' | 'action' | 'review';
  is_required: boolean;
  is_completed: boolean;
  completed_at?: string;
  data?: Record<string, any>;
  notes?: string;
}

// =====================================================
// CUSTOMER FEEDBACK
// =====================================================

export interface CustomerFeedback {
  id: string;
  customer_id: string;
  subscription_id: string;
  
  // Feedback details
  type: 'nps' | 'satisfaction' | 'feature_request' | 'complaint' | 'compliment' | 'suggestion';
  rating?: number; // 1-10 for NPS, 1-5 for satisfaction
  comment?: string;
  category?: string;
  
  // Context
  triggered_by?: string; // What prompted the feedback
  related_package_id?: string;
  related_service?: string;
  
  // Status and follow-up
  status: 'new' | 'reviewed' | 'responded' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  response?: string;
  resolution_notes?: string;
  
  // Metadata
  source: 'email' | 'sms' | 'app' | 'website' | 'phone' | 'in_person';
  metadata: Record<string, any>;
  
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

// =====================================================
// API TYPES
// =====================================================

export interface CustomerSearchFilters {
  query?: string;
  customer_types?: CustomerType[];
  customer_tiers?: CustomerTier[];
  lifecycle_stages?: CustomerLifecycleStage[];
  statuses?: CustomerStatus[];
  location_ids?: string[];
  segment_ids?: string[];
  tags?: string[];
  created_after?: string;
  created_before?: string;
  last_activity_after?: string;
  last_activity_before?: string;
}

export interface CustomerListResponse {
  customers: EnhancedCustomer[];
  total_count: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface CustomerStatsResponse {
  total_customers: number;
  active_customers: number;
  new_customers_this_month: number;
  customers_by_tier: Record<CustomerTier, number>;
  customers_by_stage: Record<CustomerLifecycleStage, number>;
  avg_engagement_score: number;
  avg_satisfaction_score: number;
  churn_rate: number;
}
