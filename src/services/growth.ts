/**
 * Growth Service
 * Story 1.4: Integrated Growth Platform
 * 
 * Service for managing SaaS growth infrastructure, customer acquisition,
 * retention strategies, and integration with loyalty system
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  GrowthMetrics,
  ReferralProgram,
  CustomerSegment,
  GrowthCampaign,
  FunnelMetrics,
  RetentionAnalysis
} from '@/types/growth';

// =====================================================
// GROWTH SERVICE
// =====================================================

export class GrowthService {

  /**
   * Get comprehensive growth metrics
   */
  static async getGrowthMetrics(
    subscriptionId: string,
    timeRange: string = '30d'
  ): Promise<GrowthMetrics> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      // Calculate date range
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      // Get customer metrics
      const customerMetrics = await this.getCustomerMetrics(subscriptionId, startDate, endDate);
      
      // Get referral metrics
      const referralMetrics = await this.getReferralMetrics(subscriptionId, startDate, endDate);
      
      // Get loyalty metrics
      const loyaltyMetrics = await this.getLoyaltyMetrics(subscriptionId, startDate, endDate);
      
      // Get revenue metrics
      const revenueMetrics = await this.getRevenueMetrics(subscriptionId, startDate, endDate);
      
      // Get funnel metrics
      const funnelMetrics = await this.getFunnelMetrics(subscriptionId, startDate, endDate);

      return {
        total_customers: customerMetrics.total,
        customer_growth_rate: customerMetrics.growth_rate,
        active_referrals: referralMetrics.active_count,
        referral_growth_rate: referralMetrics.growth_rate,
        loyalty_members: loyaltyMetrics.total_members,
        retention_rate: customerMetrics.retention_rate,
        retention_improvement: customerMetrics.retention_improvement,
        revenue_growth_rate: revenueMetrics.growth_rate,
        monthly_revenue: revenueMetrics.monthly_total,
        engagement_score: loyaltyMetrics.engagement_score,
        funnel_metrics: funnelMetrics,
        time_range: timeRange,
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting growth metrics:', error);
      throw error;
    }
  }

  /**
   * Get referral programs
   */
  static async getReferralPrograms(subscriptionId: string): Promise<ReferralProgram[]> {
    try {
      const { data, error } = await supabase
        .from('referral_programs')
        .select(`
          *,
          referral_program_stats (
            total_referrals,
            successful_referrals,
            total_rewards_given
          )
        `)
        .eq('subscription_id', subscriptionId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(program => ({
        ...program,
        total_referrals: program.referral_program_stats?.total_referrals || 0,
        successful_referrals: program.referral_program_stats?.successful_referrals || 0,
        conversion_rate: program.referral_program_stats?.total_referrals > 0 
          ? (program.referral_program_stats.successful_referrals / program.referral_program_stats.total_referrals) * 100
          : 0
      })) || [];
    } catch (error) {
      console.error('Error getting referral programs:', error);
      return [];
    }
  }

  /**
   * Create referral program
   */
  static async createReferralProgram(
    subscriptionId: string,
    program: Omit<ReferralProgram, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ReferralProgram | null> {
    try {
      const { data, error } = await supabase
        .from('referral_programs')
        .insert({
          ...program,
          subscription_id: subscriptionId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating referral program:', error);
      return null;
    }
  }

  /**
   * Track referral conversion
   */
  static async trackReferralConversion(
    referralCode: string,
    newCustomerId: string,
    subscriptionId: string
  ): Promise<boolean> {
    try {
      // Find the referral
      const { data: referral, error: referralError } = await supabase
        .from('customer_referrals')
        .select('*')
        .eq('referral_code', referralCode)
        .eq('subscription_id', subscriptionId)
        .single();

      if (referralError || !referral) {
        console.error('Referral not found:', referralCode);
        return false;
      }

      // Update referral status
      const { error: updateError } = await supabase
        .from('customer_referrals')
        .update({
          referred_customer_id: newCustomerId,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', referral.id);

      if (updateError) throw updateError;

      // Award points to referrer (integrate with loyalty system)
      await this.awardReferralPoints(referral.referrer_customer_id, referral.program_id, subscriptionId);

      return true;
    } catch (error) {
      console.error('Error tracking referral conversion:', error);
      return false;
    }
  }

  /**
   * Get customer segments
   */
  static async getCustomerSegments(subscriptionId: string): Promise<CustomerSegment[]> {
    try {
      // This would implement customer segmentation logic
      // For now, return mock segments
      return [
        {
          id: 'high-value',
          name: 'High Value Customers',
          description: 'Customers with high lifetime value',
          criteria: { min_ltv: 1000 },
          customer_count: 150,
          growth_rate: 0.15
        },
        {
          id: 'loyal-members',
          name: 'Loyal Members',
          description: 'Active loyalty program participants',
          criteria: { loyalty_tier: ['gold', 'platinum'] },
          customer_count: 320,
          growth_rate: 0.25
        },
        {
          id: 'at-risk',
          name: 'At-Risk Customers',
          description: 'Customers with declining engagement',
          criteria: { last_activity: '30d', engagement_score: '<0.3' },
          customer_count: 85,
          growth_rate: -0.10
        }
      ];
    } catch (error) {
      console.error('Error getting customer segments:', error);
      return [];
    }
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private static async getCustomerMetrics(
    subscriptionId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      // Get total customers
      const { count: totalCustomers } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_id', subscriptionId);

      // Get new customers in period
      const { count: newCustomers } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_id', subscriptionId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Calculate growth rate
      const previousPeriodStart = new Date(startDate);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - (endDate.getDate() - startDate.getDate()));
      
      const { count: previousNewCustomers } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_id', subscriptionId)
        .gte('created_at', previousPeriodStart.toISOString())
        .lt('created_at', startDate.toISOString());

      const growthRate = previousNewCustomers > 0 
        ? ((newCustomers - previousNewCustomers) / previousNewCustomers) * 100
        : 0;

      return {
        total: totalCustomers || 0,
        new_in_period: newCustomers || 0,
        growth_rate: growthRate,
        retention_rate: 0.85, // Mock retention rate
        retention_improvement: 0.12 // Mock improvement
      };
    } catch (error) {
      console.error('Error getting customer metrics:', error);
      return { total: 0, new_in_period: 0, growth_rate: 0, retention_rate: 0.85, retention_improvement: 0.12 };
    }
  }

  private static async getReferralMetrics(
    subscriptionId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      const { count: activeReferrals } = await supabase
        .from('customer_referrals')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_id', subscriptionId)
        .eq('status', 'active');

      const { count: newReferrals } = await supabase
        .from('customer_referrals')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_id', subscriptionId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      return {
        active_count: activeReferrals || 0,
        new_in_period: newReferrals || 0,
        growth_rate: 15.5 // Mock growth rate
      };
    } catch (error) {
      console.error('Error getting referral metrics:', error);
      return { active_count: 0, new_in_period: 0, growth_rate: 0 };
    }
  }

  private static async getLoyaltyMetrics(
    subscriptionId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      const { count: loyaltyMembers } = await supabase
        .from('loyalty_points')
        .select('*', { count: 'exact', head: true })
        .gt('total_earned', 0);

      return {
        total_members: loyaltyMembers || 0,
        engagement_score: 0.78 // Mock engagement score
      };
    } catch (error) {
      console.error('Error getting loyalty metrics:', error);
      return { total_members: 0, engagement_score: 0.78 };
    }
  }

  private static async getRevenueMetrics(
    subscriptionId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      // Mock revenue metrics - would integrate with billing system
      return {
        monthly_total: 45000,
        growth_rate: 0.18
      };
    } catch (error) {
      console.error('Error getting revenue metrics:', error);
      return { monthly_total: 0, growth_rate: 0 };
    }
  }

  private static async getFunnelMetrics(
    subscriptionId: string,
    startDate: Date,
    endDate: Date
  ): Promise<FunnelMetrics> {
    try {
      // Mock funnel metrics - would implement actual funnel tracking
      return {
        visitors: { count: 10000, conversion_rate: 1.0 },
        signups: { count: 500, conversion_rate: 0.05 },
        trials: { count: 300, conversion_rate: 0.6 },
        customers: { count: 150, conversion_rate: 0.5 },
        loyal_customers: { count: 75, conversion_rate: 0.5 }
      };
    } catch (error) {
      console.error('Error getting funnel metrics:', error);
      return {
        visitors: { count: 0, conversion_rate: 0 },
        signups: { count: 0, conversion_rate: 0 },
        trials: { count: 0, conversion_rate: 0 },
        customers: { count: 0, conversion_rate: 0 },
        loyal_customers: { count: 0, conversion_rate: 0 }
      };
    }
  }

  private static async awardReferralPoints(
    customerId: string,
    programId: string,
    subscriptionId: string
  ): Promise<void> {
    try {
      // Get referral program details
      const { data: program } = await supabase
        .from('referral_programs')
        .select('referrer_reward')
        .eq('id', programId)
        .single();

      if (program?.referrer_reward) {
        // Award points via loyalty webhook
        await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/loyalty-webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            event: 'referral_completed',
            userId: customerId,
            data: {
              program_id: programId,
              points_awarded: program.referrer_reward
            }
          })
        });
      }
    } catch (error) {
      console.error('Error awarding referral points:', error);
    }
  }
}
