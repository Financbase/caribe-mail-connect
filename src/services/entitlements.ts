/**
 * Entitlement System Service
 * Story 6: Billing Integration - Entitlement System
 * 
 * Database-driven feature entitlements tied to subscription plans
 * Controls access to features based on subscription tier and usage limits
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  SubscriptionPlanTier,
  SUBSCRIPTION_PLANS 
} from '@/types/subscription';

// =====================================================
// ENTITLEMENT TYPES
// =====================================================

export interface FeatureEntitlement {
  feature_name: string;
  enabled: boolean;
  usage_limit?: number;
  current_usage?: number;
  reset_period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  last_reset?: string;
}

export interface SubscriptionEntitlements {
  subscription_id: string;
  plan_tier: SubscriptionPlanTier;
  features: FeatureEntitlement[];
  usage_tracking: UsageTracking[];
  last_updated: string;
}

export interface UsageTracking {
  feature_name: string;
  usage_count: number;
  period_start: string;
  period_end: string;
  reset_period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

// =====================================================
// FEATURE DEFINITIONS
// =====================================================

const FEATURE_DEFINITIONS = {
  // Core Features
  'package_management': {
    name: 'Package Management',
    description: 'Create and manage packages',
    category: 'core'
  },
  'customer_management': {
    name: 'Customer Management',
    description: 'Manage customer database',
    category: 'core'
  },
  'basic_communications': {
    name: 'Basic Communications',
    description: 'Send basic notifications',
    category: 'core'
  },
  
  // Professional Features
  'advanced_analytics': {
    name: 'Advanced Analytics',
    description: 'Detailed analytics and reporting',
    category: 'professional'
  },
  'bulk_operations': {
    name: 'Bulk Operations',
    description: 'Bulk package and customer operations',
    category: 'professional'
  },
  'api_access': {
    name: 'API Access',
    description: 'REST API access',
    category: 'professional'
  },
  'custom_branding': {
    name: 'Custom Branding',
    description: 'Customize interface branding',
    category: 'professional'
  },
  
  // Enterprise Features
  'advanced_integrations': {
    name: 'Advanced Integrations',
    description: 'Third-party integrations',
    category: 'enterprise'
  },
  'white_label': {
    name: 'White Label',
    description: 'Complete white label solution',
    category: 'enterprise'
  },
  'priority_support': {
    name: 'Priority Support',
    description: '24/7 priority support',
    category: 'enterprise'
  },
  'custom_development': {
    name: 'Custom Development',
    description: 'Custom feature development',
    category: 'enterprise'
  },
  'dedicated_infrastructure': {
    name: 'Dedicated Infrastructure',
    description: 'Dedicated server resources',
    category: 'enterprise'
  },
  
  // Usage-based Features
  'sms_notifications': {
    name: 'SMS Notifications',
    description: 'Send SMS notifications',
    category: 'usage',
    usage_based: true
  },
  'email_notifications': {
    name: 'Email Notifications',
    description: 'Send email notifications',
    category: 'usage',
    usage_based: true
  },
  'storage_space': {
    name: 'Storage Space',
    description: 'File storage capacity',
    category: 'usage',
    usage_based: true
  },
  'api_requests': {
    name: 'API Requests',
    description: 'API request quota',
    category: 'usage',
    usage_based: true
  }
} as const;

// =====================================================
// PLAN ENTITLEMENTS
// =====================================================

const PLAN_ENTITLEMENTS: Record<SubscriptionPlanTier, FeatureEntitlement[]> = {
  'free': [
    { feature_name: 'package_management', enabled: true, usage_limit: 10 },
    { feature_name: 'customer_management', enabled: true, usage_limit: 50 },
    { feature_name: 'basic_communications', enabled: true, usage_limit: 100 },
    { feature_name: 'sms_notifications', enabled: true, usage_limit: 10, reset_period: 'monthly' },
    { feature_name: 'email_notifications', enabled: true, usage_limit: 100, reset_period: 'monthly' },
    { feature_name: 'storage_space', enabled: true, usage_limit: 100 }, // MB
    { feature_name: 'api_requests', enabled: false },
    { feature_name: 'advanced_analytics', enabled: false },
    { feature_name: 'bulk_operations', enabled: false },
    { feature_name: 'custom_branding', enabled: false },
    { feature_name: 'advanced_integrations', enabled: false },
    { feature_name: 'white_label', enabled: false },
    { feature_name: 'priority_support', enabled: false },
    { feature_name: 'custom_development', enabled: false },
    { feature_name: 'dedicated_infrastructure', enabled: false }
  ],
  
  'professional': [
    { feature_name: 'package_management', enabled: true, usage_limit: 1000 },
    { feature_name: 'customer_management', enabled: true, usage_limit: 5000 },
    { feature_name: 'basic_communications', enabled: true },
    { feature_name: 'advanced_analytics', enabled: true },
    { feature_name: 'bulk_operations', enabled: true },
    { feature_name: 'api_access', enabled: true },
    { feature_name: 'custom_branding', enabled: true },
    { feature_name: 'sms_notifications', enabled: true, usage_limit: 1000, reset_period: 'monthly' },
    { feature_name: 'email_notifications', enabled: true, usage_limit: 10000, reset_period: 'monthly' },
    { feature_name: 'storage_space', enabled: true, usage_limit: 10000 }, // MB
    { feature_name: 'api_requests', enabled: true, usage_limit: 100000, reset_period: 'monthly' },
    { feature_name: 'advanced_integrations', enabled: false },
    { feature_name: 'white_label', enabled: false },
    { feature_name: 'priority_support', enabled: false },
    { feature_name: 'custom_development', enabled: false },
    { feature_name: 'dedicated_infrastructure', enabled: false }
  ],
  
  'enterprise': [
    { feature_name: 'package_management', enabled: true },
    { feature_name: 'customer_management', enabled: true },
    { feature_name: 'basic_communications', enabled: true },
    { feature_name: 'advanced_analytics', enabled: true },
    { feature_name: 'bulk_operations', enabled: true },
    { feature_name: 'api_access', enabled: true },
    { feature_name: 'custom_branding', enabled: true },
    { feature_name: 'advanced_integrations', enabled: true },
    { feature_name: 'white_label', enabled: true },
    { feature_name: 'priority_support', enabled: true },
    { feature_name: 'custom_development', enabled: true },
    { feature_name: 'dedicated_infrastructure', enabled: true },
    { feature_name: 'sms_notifications', enabled: true, usage_limit: 50000, reset_period: 'monthly' },
    { feature_name: 'email_notifications', enabled: true, usage_limit: 500000, reset_period: 'monthly' },
    { feature_name: 'storage_space', enabled: true, usage_limit: 1000000 }, // MB
    { feature_name: 'api_requests', enabled: true, usage_limit: 10000000, reset_period: 'monthly' }
  ]
};

// =====================================================
// ENTITLEMENT SERVICE
// =====================================================

export class EntitlementService {

  /**
   * Get subscription entitlements
   */
  static async getSubscriptionEntitlements(subscriptionId: string): Promise<SubscriptionEntitlements | null> {
    try {
      // Get subscription details
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('plan_tier')
        .eq('id', subscriptionId)
        .single();

      if (subError || !subscription) {
        console.error('Subscription not found:', subError);
        return null;
      }

      // Get current usage tracking
      const { data: usageData, error: usageError } = await supabase
        .from('feature_usage_tracking')
        .select('*')
        .eq('subscription_id', subscriptionId);

      if (usageError) {
        console.error('Error fetching usage data:', usageError);
      }

      // Get plan entitlements
      const planEntitlements = PLAN_ENTITLEMENTS[subscription.plan_tier] || PLAN_ENTITLEMENTS.free;
      
      // Merge with current usage
      const featuresWithUsage = planEntitlements.map(entitlement => {
        const usage = usageData?.find(u => u.feature_name === entitlement.feature_name);
        return {
          ...entitlement,
          current_usage: usage?.usage_count || 0,
          last_reset: usage?.period_start
        };
      });

      return {
        subscription_id: subscriptionId,
        plan_tier: subscription.plan_tier,
        features: featuresWithUsage,
        usage_tracking: usageData || [],
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting subscription entitlements:', error);
      return null;
    }
  }

  /**
   * Check if feature is enabled for subscription
   */
  static async isFeatureEnabled(subscriptionId: string, featureName: string): Promise<boolean> {
    try {
      const entitlements = await this.getSubscriptionEntitlements(subscriptionId);
      if (!entitlements) return false;

      const feature = entitlements.features.find(f => f.feature_name === featureName);
      return feature?.enabled || false;
    } catch (error) {
      console.error('Error checking feature entitlement:', error);
      return false;
    }
  }

  /**
   * Check if feature usage is within limits
   */
  static async checkUsageLimit(subscriptionId: string, featureName: string): Promise<{
    allowed: boolean;
    current_usage: number;
    usage_limit?: number;
    remaining?: number;
  }> {
    try {
      const entitlements = await this.getSubscriptionEntitlements(subscriptionId);
      if (!entitlements) {
        return { allowed: false, current_usage: 0 };
      }

      const feature = entitlements.features.find(f => f.feature_name === featureName);
      if (!feature || !feature.enabled) {
        return { allowed: false, current_usage: 0 };
      }

      const currentUsage = feature.current_usage || 0;
      const usageLimit = feature.usage_limit;

      if (usageLimit === undefined) {
        // No limit - unlimited usage
        return { allowed: true, current_usage: currentUsage };
      }

      const remaining = usageLimit - currentUsage;
      return {
        allowed: remaining > 0,
        current_usage: currentUsage,
        usage_limit: usageLimit,
        remaining: Math.max(0, remaining)
      };
    } catch (error) {
      console.error('Error checking usage limit:', error);
      return { allowed: false, current_usage: 0 };
    }
  }

  /**
   * Track feature usage
   */
  static async trackUsage(
    subscriptionId: string, 
    featureName: string, 
    usageAmount: number = 1
  ): Promise<boolean> {
    try {
      // Check if usage is allowed first
      const usageCheck = await this.checkUsageLimit(subscriptionId, featureName);
      if (!usageCheck.allowed) {
        throw new Error(`Usage limit exceeded for feature: ${featureName}`);
      }

      // Get current period for the feature
      const entitlements = await this.getSubscriptionEntitlements(subscriptionId);
      const feature = entitlements?.features.find(f => f.feature_name === featureName);
      
      if (!feature) {
        throw new Error(`Feature not found: ${featureName}`);
      }

      const resetPeriod = feature.reset_period || 'monthly';
      const { periodStart, periodEnd } = this.calculatePeriod(resetPeriod);

      // Update or insert usage tracking
      const { error } = await supabase
        .from('feature_usage_tracking')
        .upsert({
          subscription_id: subscriptionId,
          feature_name: featureName,
          usage_count: (feature.current_usage || 0) + usageAmount,
          period_start: periodStart,
          period_end: periodEnd,
          reset_period: resetPeriod,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'subscription_id,feature_name,period_start'
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error tracking usage:', error);
      return false;
    }
  }

  /**
   * Reset usage for a period
   */
  static async resetUsage(subscriptionId: string, featureName?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('feature_usage_tracking')
        .delete()
        .eq('subscription_id', subscriptionId);

      if (featureName) {
        query = query.eq('feature_name', featureName);
      }

      // Only reset expired periods
      query = query.lt('period_end', new Date().toISOString());

      const { error } = await query;
      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error resetting usage:', error);
      return false;
    }
  }

  /**
   * Update subscription entitlements when plan changes
   */
  static async updateSubscriptionEntitlements(
    subscriptionId: string,
    newPlanTier: SubscriptionPlanTier
  ): Promise<boolean> {
    try {
      // Update subscription plan tier
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ 
          plan_tier: newPlanTier,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (updateError) throw updateError;

      // Reset usage tracking for features that have different limits
      await this.resetUsage(subscriptionId);

      return true;
    } catch (error) {
      console.error('Error updating subscription entitlements:', error);
      return false;
    }
  }

  /**
   * Get feature definitions
   */
  static getFeatureDefinitions() {
    return FEATURE_DEFINITIONS;
  }

  /**
   * Get plan entitlements
   */
  static getPlanEntitlements(planTier: SubscriptionPlanTier): FeatureEntitlement[] {
    return PLAN_ENTITLEMENTS[planTier] || PLAN_ENTITLEMENTS.free;
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private static calculatePeriod(resetPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly'): {
    periodStart: string;
    periodEnd: string;
  } {
    const now = new Date();
    let periodStart: Date;
    let periodEnd: Date;

    switch (resetPeriod) {
      case 'daily':
        periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodEnd.getDate() + 1);
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        periodStart = new Date(now);
        periodStart.setDate(now.getDate() - dayOfWeek);
        periodStart.setHours(0, 0, 0, 0);
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodEnd.getDate() + 7);
        break;
      case 'monthly':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case 'yearly':
        periodStart = new Date(now.getFullYear(), 0, 1);
        periodEnd = new Date(now.getFullYear() + 1, 0, 1);
        break;
      default:
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    return {
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString()
    };
  }
}
