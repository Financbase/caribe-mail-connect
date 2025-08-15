/**
 * Pricing Service
 * Story 1: Clear Product Shape - Pricing Model
 * 
 * Defines subscription tiers, usage limits, pricing strategy,
 * and billing calculations for the SaaS platform
 */

import { supabase } from '@/integrations/supabase/client';

// =====================================================
// PRICING TYPES
// =====================================================

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  features: PricingFeature[];
  limits: UsageLimits;
  billing_cycle: 'monthly' | 'yearly' | 'both';
  trial_days: number;
  popular: boolean;
  enterprise_only: boolean;
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
}

export interface PricingFeature {
  name: string;
  description: string;
  included: boolean;
  limit?: number;
  unit?: string;
  highlight?: boolean;
}

export interface UsageLimits {
  users: number;
  customers: number;
  packages: number;
  storage_gb: number;
  api_requests_per_month: number;
  sms_notifications_per_month: number;
  email_notifications_per_month: number;
  integrations: number;
  custom_branding: boolean;
  priority_support: boolean;
  advanced_analytics: boolean;
  white_label: boolean;
}

export interface PricingCalculation {
  base_price: number;
  usage_overages: UsageOverage[];
  discounts: PricingDiscount[];
  taxes: TaxCalculation[];
  total_before_tax: number;
  total_tax: number;
  total_amount: number;
  currency: string;
  billing_period: 'monthly' | 'yearly';
}

export interface UsageOverage {
  feature: string;
  limit: number;
  usage: number;
  overage: number;
  rate_per_unit: number;
  overage_cost: number;
}

export interface PricingDiscount {
  type: 'percentage' | 'fixed' | 'trial';
  name: string;
  description: string;
  amount: number;
  applied_amount: number;
  valid_until?: string;
}

export interface TaxCalculation {
  type: 'vat' | 'sales_tax' | 'gst';
  rate: number;
  amount: number;
  jurisdiction: string;
}

// =====================================================
// PRICING TIERS DEFINITION
// =====================================================

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started with basic package management',
    price_monthly: 0,
    price_yearly: 0,
    currency: 'USD',
    billing_cycle: 'both',
    trial_days: 0,
    popular: false,
    enterprise_only: false,
    features: [
      { name: 'Package Management', description: 'Basic package tracking and management', included: true, limit: 10, unit: 'packages' },
      { name: 'Customer Management', description: 'Customer database and profiles', included: true, limit: 50, unit: 'customers' },
      { name: 'Email Notifications', description: 'Basic email notifications', included: true, limit: 100, unit: 'emails/month' },
      { name: 'Mobile App Access', description: 'Access to mobile applications', included: true },
      { name: 'Basic Support', description: 'Community support and documentation', included: true },
      { name: 'SMS Notifications', description: 'SMS alerts and notifications', included: false },
      { name: 'Advanced Analytics', description: 'Detailed reporting and insights', included: false },
      { name: 'API Access', description: 'REST API for integrations', included: false },
      { name: 'Custom Branding', description: 'Customize interface with your brand', included: false },
      { name: 'Priority Support', description: '24/7 priority customer support', included: false }
    ],
    limits: {
      users: 2,
      customers: 50,
      packages: 100,
      storage_gb: 1,
      api_requests_per_month: 0,
      sms_notifications_per_month: 0,
      email_notifications_per_month: 100,
      integrations: 0,
      custom_branding: false,
      priority_support: false,
      advanced_analytics: false,
      white_label: false
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Advanced features for growing businesses and teams',
    price_monthly: 29,
    price_yearly: 290, // 2 months free
    currency: 'USD',
    billing_cycle: 'both',
    trial_days: 14,
    popular: true,
    enterprise_only: false,
    stripe_price_id_monthly: 'price_professional_monthly',
    stripe_price_id_yearly: 'price_professional_yearly',
    features: [
      { name: 'Everything in Free', description: 'All features from the Free plan', included: true, highlight: true },
      { name: 'Unlimited Packages', description: 'No limit on package management', included: true },
      { name: 'Advanced Customer Management', description: 'Customer segmentation and analytics', included: true },
      { name: 'SMS Notifications', description: 'SMS alerts and notifications', included: true, limit: 1000, unit: 'SMS/month' },
      { name: 'Email Notifications', description: 'Unlimited email notifications', included: true },
      { name: 'API Access', description: 'Full REST API access', included: true, limit: 100000, unit: 'requests/month' },
      { name: 'Advanced Analytics', description: 'Detailed reporting and insights', included: true },
      { name: 'Custom Branding', description: 'Customize interface with your brand', included: true },
      { name: 'Integrations', description: 'Third-party service integrations', included: true, limit: 5, unit: 'integrations' },
      { name: 'Priority Support', description: 'Email and chat support', included: true },
      { name: 'White Label', description: 'Complete white label solution', included: false }
    ],
    limits: {
      users: 10,
      customers: 5000,
      packages: 999999,
      storage_gb: 50,
      api_requests_per_month: 100000,
      sms_notifications_per_month: 1000,
      email_notifications_per_month: 999999,
      integrations: 5,
      custom_branding: true,
      priority_support: true,
      advanced_analytics: true,
      white_label: false
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Complete solution for large organizations with custom needs',
    price_monthly: 99,
    price_yearly: 990, // 2 months free
    currency: 'USD',
    billing_cycle: 'both',
    trial_days: 30,
    popular: false,
    enterprise_only: true,
    stripe_price_id_monthly: 'price_enterprise_monthly',
    stripe_price_id_yearly: 'price_enterprise_yearly',
    features: [
      { name: 'Everything in Professional', description: 'All features from Professional plan', included: true, highlight: true },
      { name: 'Unlimited Users', description: 'No limit on team members', included: true },
      { name: 'Unlimited Everything', description: 'No limits on any features', included: true },
      { name: 'White Label Solution', description: 'Complete white label customization', included: true },
      { name: 'Advanced Integrations', description: 'Custom integrations and webhooks', included: true },
      { name: 'Dedicated Support', description: '24/7 phone and dedicated support', included: true },
      { name: 'Custom Development', description: 'Custom feature development', included: true },
      { name: 'SLA Guarantee', description: '99.9% uptime guarantee', included: true },
      { name: 'Advanced Security', description: 'SOC 2, HIPAA, and enterprise security', included: true },
      { name: 'Dedicated Infrastructure', description: 'Dedicated servers and resources', included: true },
      { name: 'Training & Onboarding', description: 'Dedicated training and onboarding', included: true }
    ],
    limits: {
      users: 999999,
      customers: 999999,
      packages: 999999,
      storage_gb: 999999,
      api_requests_per_month: 999999,
      sms_notifications_per_month: 999999,
      email_notifications_per_month: 999999,
      integrations: 999999,
      custom_branding: true,
      priority_support: true,
      advanced_analytics: true,
      white_label: true
    }
  }
];

// =====================================================
// PRICING SERVICE
// =====================================================

export class PricingService {

  /**
   * Get all pricing tiers
   */
  static getPricingTiers(): PricingTier[] {
    return PRICING_TIERS;
  }

  /**
   * Get specific pricing tier
   */
  static getPricingTier(tierId: string): PricingTier | null {
    return PRICING_TIERS.find(tier => tier.id === tierId) || null;
  }

  /**
   * Calculate pricing for subscription
   */
  static calculatePricing(
    tierId: string,
    billingCycle: 'monthly' | 'yearly',
    usage?: Partial<UsageLimits>,
    discountCodes?: string[]
  ): PricingCalculation | null {
    try {
      const tier = this.getPricingTier(tierId);
      if (!tier) return null;

      const basePrice = billingCycle === 'yearly' ? tier.price_yearly : tier.price_monthly;
      const usageOverages = this.calculateUsageOverages(tier, usage || {});
      const discounts = this.calculateDiscounts(basePrice, discountCodes || []);
      const totalBeforeTax = basePrice + usageOverages.reduce((sum, overage) => sum + overage.overage_cost, 0) - discounts.reduce((sum, discount) => sum + discount.applied_amount, 0);
      const taxes = this.calculateTaxes(totalBeforeTax, 'US'); // Default to US
      const totalTax = taxes.reduce((sum, tax) => sum + tax.amount, 0);

      return {
        base_price: basePrice,
        usage_overages: usageOverages,
        discounts,
        taxes,
        total_before_tax: totalBeforeTax,
        total_tax: totalTax,
        total_amount: totalBeforeTax + totalTax,
        currency: tier.currency,
        billing_period: billingCycle
      };
    } catch (error) {
      console.error('Error calculating pricing:', error);
      return null;
    }
  }

  /**
   * Get recommended tier based on usage
   */
  static getRecommendedTier(usage: Partial<UsageLimits>): PricingTier {
    // Check if usage exceeds Professional limits
    const professionalTier = this.getPricingTier('professional')!;
    
    if (
      (usage.users && usage.users > professionalTier.limits.users) ||
      (usage.customers && usage.customers > professionalTier.limits.customers) ||
      (usage.storage_gb && usage.storage_gb > professionalTier.limits.storage_gb) ||
      (usage.api_requests_per_month && usage.api_requests_per_month > professionalTier.limits.api_requests_per_month)
    ) {
      return this.getPricingTier('enterprise')!;
    }

    // Check if usage exceeds Free limits
    const freeTier = this.getPricingTier('free')!;
    
    if (
      (usage.users && usage.users > freeTier.limits.users) ||
      (usage.customers && usage.customers > freeTier.limits.customers) ||
      (usage.packages && usage.packages > freeTier.limits.packages) ||
      (usage.storage_gb && usage.storage_gb > freeTier.limits.storage_gb) ||
      (usage.email_notifications_per_month && usage.email_notifications_per_month > freeTier.limits.email_notifications_per_month)
    ) {
      return professionalTier;
    }

    return freeTier;
  }

  /**
   * Calculate yearly savings
   */
  static calculateYearlySavings(tierId: string): number {
    const tier = this.getPricingTier(tierId);
    if (!tier) return 0;

    const monthlyTotal = tier.price_monthly * 12;
    const yearlyPrice = tier.price_yearly;
    
    return monthlyTotal - yearlyPrice;
  }

  /**
   * Get feature comparison matrix
   */
  static getFeatureComparison(): any {
    const tiers = this.getPricingTiers();
    const allFeatures = new Set<string>();
    
    // Collect all unique features
    tiers.forEach(tier => {
      tier.features.forEach(feature => {
        allFeatures.add(feature.name);
      });
    });

    // Create comparison matrix
    const comparison: any = {};
    
    Array.from(allFeatures).forEach(featureName => {
      comparison[featureName] = {};
      
      tiers.forEach(tier => {
        const feature = tier.features.find(f => f.name === featureName);
        comparison[featureName][tier.id] = {
          included: feature?.included || false,
          limit: feature?.limit,
          unit: feature?.unit,
          description: feature?.description
        };
      });
    });

    return comparison;
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private static calculateUsageOverages(tier: PricingTier, usage: Partial<UsageLimits>): UsageOverage[] {
    const overages: UsageOverage[] = [];
    
    // Define overage rates (per unit over limit)
    const overageRates = {
      users: 5, // $5 per additional user
      customers: 0.01, // $0.01 per additional customer
      packages: 0.005, // $0.005 per additional package
      storage_gb: 2, // $2 per additional GB
      api_requests_per_month: 0.0001, // $0.0001 per additional API request
      sms_notifications_per_month: 0.05, // $0.05 per additional SMS
      email_notifications_per_month: 0.001 // $0.001 per additional email
    };

    // Calculate overages for each metric
    Object.entries(usage).forEach(([key, value]) => {
      if (typeof value === 'number' && key in tier.limits && key in overageRates) {
        const limit = tier.limits[key as keyof UsageLimits] as number;
        const rate = overageRates[key as keyof typeof overageRates];
        
        if (value > limit) {
          const overage = value - limit;
          overages.push({
            feature: key,
            limit,
            usage: value,
            overage,
            rate_per_unit: rate,
            overage_cost: overage * rate
          });
        }
      }
    });

    return overages;
  }

  private static calculateDiscounts(basePrice: number, discountCodes: string[]): PricingDiscount[] {
    const discounts: PricingDiscount[] = [];
    
    // Mock discount codes
    const availableDiscounts = {
      'WELCOME20': { type: 'percentage' as const, amount: 20, name: 'Welcome Discount', description: '20% off first month' },
      'SAVE50': { type: 'fixed' as const, amount: 50, name: 'Fixed Discount', description: '$50 off' },
      'TRIAL': { type: 'trial' as const, amount: 100, name: 'Trial Discount', description: 'Free trial period' }
    };

    discountCodes.forEach(code => {
      const discount = availableDiscounts[code as keyof typeof availableDiscounts];
      if (discount) {
        const appliedAmount = discount.type === 'percentage' 
          ? (basePrice * discount.amount / 100)
          : Math.min(discount.amount, basePrice);

        discounts.push({
          ...discount,
          applied_amount: appliedAmount
        });
      }
    });

    return discounts;
  }

  private static calculateTaxes(amount: number, jurisdiction: string): TaxCalculation[] {
    const taxes: TaxCalculation[] = [];
    
    // Mock tax calculation based on jurisdiction
    const taxRates = {
      'US': { type: 'sales_tax' as const, rate: 8.5 },
      'EU': { type: 'vat' as const, rate: 20 },
      'CA': { type: 'gst' as const, rate: 13 }
    };

    const taxInfo = taxRates[jurisdiction as keyof typeof taxRates];
    if (taxInfo) {
      taxes.push({
        type: taxInfo.type,
        rate: taxInfo.rate,
        amount: amount * (taxInfo.rate / 100),
        jurisdiction
      });
    }

    return taxes;
  }
}
