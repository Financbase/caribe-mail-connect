/**
 * Subscription and Multi-Tenant Types
 * Story 1.0: Hybrid Tenant Architecture
 * 
 * Defines TypeScript types for the subscription-based SaaS features
 * while preserving existing location-based architecture
 */

// =====================================================
// SUBSCRIPTION TYPES
// =====================================================

export type SubscriptionPlanTier = 'starter' | 'professional' | 'enterprise' | 'custom';

export type SubscriptionStatus = 
  | 'active' 
  | 'trialing' 
  | 'past_due' 
  | 'canceled' 
  | 'unpaid';

export interface Subscription {
  id: string;
  organization_name: string;
  plan_tier: SubscriptionPlanTier;
  
  // Stripe integration
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  
  // Subscription status and billing
  status: SubscriptionStatus;
  trial_ends_at?: string;
  current_period_start?: string;
  current_period_end?: string;
  
  // Organization settings
  settings: Record<string, any>;
  billing_email?: string;
  
  // Audit fields
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// =====================================================
// FEATURE ENTITLEMENTS
// =====================================================

export interface FeatureEntitlement {
  id: string;
  subscription_id: string;
  feature_key: string;
  is_enabled: boolean;
  usage_limit?: number; // null = unlimited
  current_usage: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Predefined feature keys for type safety
export type FeatureKey = 
  | 'unlimited_locations'
  | 'unlimited_customers'
  | 'advanced_analytics'
  | 'api_access'
  | 'custom_integrations'
  | 'bulk_email_campaigns'
  | 'sms_notifications'
  | 'whatsapp_integration'
  | 'loyalty_program'
  | 'referral_system'
  | 'custom_branding'
  | 'priority_support'
  | 'data_export'
  | 'audit_logs';

// =====================================================
// SUBSCRIPTION USERS (ORGANIZATION MEMBERSHIP)
// =====================================================

export type SubscriptionRole = 'owner' | 'admin' | 'member';

export type SubscriptionUserStatus = 'active' | 'inactive' | 'pending';

export interface SubscriptionUser {
  id: string;
  subscription_id: string;
  user_id: string;
  subscription_role: SubscriptionRole;
  status: SubscriptionUserStatus;
  invited_by?: string;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// ENHANCED USER TYPES
// =====================================================

// Existing user type (preserved)
export interface BaseUser {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'customer' | 'driver';
  location_id?: string;
}

// Enhanced user with subscription context
export interface EnhancedUser extends BaseUser {
  subscription_id?: string;
  subscription_role?: SubscriptionRole;
  subscription?: Subscription;
  entitlements?: FeatureEntitlement[];
}

// =====================================================
// ENHANCED LOCATION TYPES
// =====================================================

// Enhanced location with subscription context
export interface EnhancedLocation {
  id: string;
  name: string;
  code: string;
  subscription_id?: string;
  
  // Existing location fields preserved
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone?: string;
  email?: string;
  is_primary: boolean;
  status: 'active' | 'inactive' | 'maintenance';
  operating_hours: Record<string, any>;
  services_offered: string[];
  pricing_tier: string;
  coordinates?: any;
  timezone: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// =====================================================
// ENHANCED CUSTOMER TYPES
// =====================================================

// Enhanced customer with subscription context
export interface EnhancedCustomer {
  id: string;
  user_id?: string;
  mailbox_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  business_name?: string;
  
  // Address fields
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  
  // Customer classification
  customer_type: 'individual' | 'business';
  status: 'active' | 'inactive' | 'suspended';
  
  // Multi-tenant context
  location_id?: string;
  subscription_id?: string;
  
  // Audit fields
  notes?: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// PERMISSION CHECKING
// =====================================================

export interface PermissionContext {
  user: EnhancedUser;
  subscription?: Subscription;
  location_id?: string;
  resource_type: string;
  action: string;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  required_entitlement?: string;
  usage_limit_exceeded?: boolean;
}

// =====================================================
// SUBSCRIPTION PLAN DEFINITIONS
// =====================================================

export interface SubscriptionPlan {
  tier: SubscriptionPlanTier;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: FeatureKey[];
  limits: Record<string, number | null>; // null = unlimited
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
}

// Predefined subscription plans
export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanTier, SubscriptionPlan> = {
  starter: {
    tier: 'starter',
    name: 'Starter',
    description: 'Perfect for small mail carrier operations',
    price_monthly: 99,
    price_yearly: 990,
    features: ['unlimited_customers', 'basic_analytics', 'email_notifications'],
    limits: {
      locations: 1,
      monthly_emails: 1000,
      api_calls: 10000
    }
  },
  professional: {
    tier: 'professional',
    name: 'Professional',
    description: 'Ideal for growing mail carrier businesses',
    price_monthly: 299,
    price_yearly: 2990,
    features: [
      'unlimited_customers',
      'unlimited_locations',
      'advanced_analytics',
      'api_access',
      'bulk_email_campaigns',
      'sms_notifications',
      'loyalty_program'
    ],
    limits: {
      monthly_emails: 10000,
      api_calls: 100000
    }
  },
  enterprise: {
    tier: 'enterprise',
    name: 'Enterprise',
    description: 'Complete solution for large operations',
    price_monthly: 999,
    price_yearly: 9990,
    features: [
      'unlimited_customers',
      'unlimited_locations',
      'advanced_analytics',
      'api_access',
      'custom_integrations',
      'bulk_email_campaigns',
      'sms_notifications',
      'whatsapp_integration',
      'loyalty_program',
      'referral_system',
      'custom_branding',
      'priority_support',
      'data_export',
      'audit_logs'
    ],
    limits: {} // No limits
  },
  custom: {
    tier: 'custom',
    name: 'Custom',
    description: 'Tailored solution for specific needs',
    price_monthly: 0, // Custom pricing
    price_yearly: 0,
    features: [], // Custom features
    limits: {} // Custom limits
  }
};

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface SubscriptionResponse {
  subscription: Subscription;
  entitlements: FeatureEntitlement[];
  users: SubscriptionUser[];
  locations: EnhancedLocation[];
}

export interface FeatureCheckResponse {
  feature_key: string;
  is_enabled: boolean;
  usage_limit?: number;
  current_usage: number;
  usage_remaining?: number;
}

export interface UsageIncrementResponse {
  success: boolean;
  new_usage: number;
  limit_exceeded: boolean;
  usage_remaining?: number;
}
