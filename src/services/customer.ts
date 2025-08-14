/**
 * Enhanced Customer Service
 * Story 1.2: Enhanced Customer Management
 * 
 * Provides comprehensive customer management with subscription context,
 * lifecycle management, segmentation, and communication features
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  EnhancedCustomer,
  CustomerLifecycleStage,
  CustomerLifecycleEvent,
  CustomerCommunication,
  CustomerSegment,
  CustomerAnalytics,
  CustomerOnboarding,
  CustomerFeedback,
  CustomerSearchFilters,
  CustomerListResponse,
  CustomerStatsResponse
} from '@/types/customer';

// =====================================================
// ENHANCED CUSTOMER CRUD OPERATIONS
// =====================================================

export class CustomerService {
  
  /**
   * Get enhanced customer with analytics and lifecycle data
   */
  static async getEnhancedCustomer(customerId: string): Promise<EnhancedCustomer | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          customer_analytics(*),
          customer_onboarding(*),
          subscription:subscriptions(*)
        `)
        .eq('id', customerId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return this.enrichCustomerData(data);
    } catch (error) {
      console.error('Error fetching enhanced customer:', error);
      return null;
    }
  }

  /**
   * Search customers with advanced filters
   */
  static async searchCustomers(
    filters: CustomerSearchFilters,
    page: number = 1,
    pageSize: number = 50
  ): Promise<CustomerListResponse> {
    try {
      let query = supabase
        .from('customers')
        .select(`
          *,
          customer_analytics(engagement_score, lifetime_value, risk_score),
          packages(id, status)
        `, { count: 'exact' });

      // Apply filters
      if (filters.query) {
        query = query.or(`
          first_name.ilike.%${filters.query}%,
          last_name.ilike.%${filters.query}%,
          email.ilike.%${filters.query}%,
          mailbox_number.ilike.%${filters.query}%
        `);
      }

      if (filters.customer_types?.length) {
        query = query.in('customer_type', filters.customer_types);
      }

      if (filters.customer_tiers?.length) {
        query = query.in('customer_tier', filters.customer_tiers);
      }

      if (filters.lifecycle_stages?.length) {
        query = query.in('lifecycle_stage', filters.lifecycle_stages);
      }

      if (filters.statuses?.length) {
        query = query.in('status', filters.statuses);
      }

      if (filters.location_ids?.length) {
        query = query.in('location_id', filters.location_ids);
      }

      if (filters.tags?.length) {
        query = query.overlaps('segmentation_tags', filters.tags);
      }

      if (filters.created_after) {
        query = query.gte('created_at', filters.created_after);
      }

      if (filters.created_before) {
        query = query.lte('created_at', filters.created_before);
      }

      if (filters.last_activity_after) {
        query = query.gte('last_activity_at', filters.last_activity_after);
      }

      if (filters.last_activity_before) {
        query = query.lte('last_activity_at', filters.last_activity_before);
      }

      // Apply pagination
      const offset = (page - 1) * pageSize;
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      const enrichedCustomers = data?.map(customer => this.enrichCustomerData(customer)) || [];

      return {
        customers: enrichedCustomers,
        total_count: count || 0,
        page,
        page_size: pageSize,
        has_more: (count || 0) > offset + pageSize
      };
    } catch (error) {
      console.error('Error searching customers:', error);
      return {
        customers: [],
        total_count: 0,
        page,
        page_size: pageSize,
        has_more: false
      };
    }
  }

  /**
   * Update customer lifecycle stage
   */
  static async updateLifecycleStage(
    customerId: string,
    newStage: CustomerLifecycleStage,
    notes?: string,
    triggeredBy: 'system' | 'manual' | 'automation' = 'manual'
  ): Promise<boolean> {
    try {
      // Get current customer data
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('lifecycle_stage, subscription_id')
        .eq('id', customerId)
        .single();

      if (customerError) throw customerError;

      const fromStage = customer.lifecycle_stage;

      // Update customer lifecycle stage
      const { error: updateError } = await supabase
        .from('customers')
        .update({ 
          lifecycle_stage: newStage,
          last_activity_at: new Date().toISOString()
        })
        .eq('id', customerId);

      if (updateError) throw updateError;

      // Create lifecycle event
      await this.createLifecycleEvent({
        customer_id: customerId,
        subscription_id: customer.subscription_id,
        event_type: 'stage_change',
        from_stage: fromStage,
        to_stage: newStage,
        triggered_by: triggeredBy,
        notes
      });

      return true;
    } catch (error) {
      console.error('Error updating lifecycle stage:', error);
      return false;
    }
  }

  /**
   * Create lifecycle event
   */
  static async createLifecycleEvent(
    eventData: Omit<CustomerLifecycleEvent, 'id' | 'created_at'>
  ): Promise<CustomerLifecycleEvent | null> {
    try {
      const { data, error } = await supabase
        .from('customer_lifecycle_events')
        .insert(eventData)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating lifecycle event:', error);
      return null;
    }
  }

  /**
   * Get customer analytics
   */
  static async getCustomerAnalytics(customerId: string): Promise<CustomerAnalytics | null> {
    try {
      const { data, error } = await supabase
        .from('customer_analytics')
        .select('*')
        .eq('customer_id', customerId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Analytics don't exist, compute them
          return await this.computeCustomerAnalytics(customerId);
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      return null;
    }
  }

  /**
   * Compute customer analytics
   */
  static async computeCustomerAnalytics(customerId: string): Promise<CustomerAnalytics | null> {
    try {
      // Get customer data
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('subscription_id, created_at')
        .eq('id', customerId)
        .single();

      if (customerError) throw customerError;

      // Get package metrics
      const { data: packages } = await supabase
        .from('packages')
        .select('created_at, status')
        .eq('customer_id', customerId);

      // Get communication metrics
      const { data: communications } = await supabase
        .from('customer_communications')
        .select('channel, status, created_at')
        .eq('customer_id', customerId);

      // Compute metrics
      const totalPackages = packages?.length || 0;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const packagesThisMonth = packages?.filter(p => {
        const date = new Date(p.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).length || 0;

      const emailsSent = communications?.filter(c => c.channel === 'email').length || 0;
      const emailsOpened = communications?.filter(c => c.channel === 'email' && c.status === 'read').length || 0;

      // Calculate engagement score (simplified)
      const engagementScore = Math.min(100, Math.max(0, 
        (packagesThisMonth * 20) + 
        (emailsOpened / Math.max(1, emailsSent) * 30) + 
        (totalPackages > 0 ? 25 : 0)
      ));

      // Calculate risk score (simplified)
      const daysSinceLastPackage = packages?.length > 0 
        ? Math.floor((Date.now() - new Date(packages[packages.length - 1].created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      
      const riskScore = Math.min(100, Math.max(0, daysSinceLastPackage > 30 ? 50 + daysSinceLastPackage : 0));

      const analyticsData: Omit<CustomerAnalytics, 'id'> = {
        customer_id: customerId,
        subscription_id: customer.subscription_id,
        engagement_score: Math.round(engagementScore),
        total_packages: totalPackages,
        packages_this_month: packagesThisMonth,
        packages_last_month: 0, // Would need more complex calculation
        avg_packages_per_month: 0, // Would need historical data
        lifetime_value: 0, // Would need billing data
        monthly_spend: 0, // Would need billing data
        total_spend: 0, // Would need billing data
        avg_package_value: 0, // Would need billing data
        emails_sent: emailsSent,
        emails_opened: emailsOpened,
        emails_clicked: 0, // Would need click tracking
        sms_sent: communications?.filter(c => c.channel === 'sms').length || 0,
        sms_delivered: communications?.filter(c => c.channel === 'sms' && c.status === 'delivered').length || 0,
        support_tickets: 0, // Would need support system integration
        complaints: 0, // Would need feedback system integration
        risk_score: riskScore,
        churn_probability: riskScore / 100,
        days_since_last_package: daysSinceLastPackage,
        computed_at: new Date().toISOString(),
        last_login_at: null,
        total_logins: 0,
        avg_session_duration: 0,
        satisfaction_score: null,
        nps_score: null
      };

      // Insert analytics
      const { data, error } = await supabase
        .from('customer_analytics')
        .upsert(analyticsData)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error computing customer analytics:', error);
      return null;
    }
  }

  /**
   * Get customer statistics for dashboard
   */
  static async getCustomerStats(subscriptionId: string): Promise<CustomerStatsResponse> {
    try {
      // Get basic customer counts
      const { data: customers, error } = await supabase
        .from('customers')
        .select('customer_tier, lifecycle_stage, status, created_at')
        .eq('subscription_id', subscriptionId);

      if (error) throw error;

      const totalCustomers = customers?.length || 0;
      const activeCustomers = customers?.filter(c => c.status === 'active').length || 0;
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newCustomersThisMonth = customers?.filter(c => {
        const date = new Date(c.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).length || 0;

      // Count by tier
      const customersByTier = customers?.reduce((acc, customer) => {
        acc[customer.customer_tier] = (acc[customer.customer_tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Count by stage
      const customersByStage = customers?.reduce((acc, customer) => {
        acc[customer.lifecycle_stage] = (acc[customer.lifecycle_stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        total_customers: totalCustomers,
        active_customers: activeCustomers,
        new_customers_this_month: newCustomersThisMonth,
        customers_by_tier: customersByTier as any,
        customers_by_stage: customersByStage as any,
        avg_engagement_score: 0, // Would need analytics aggregation
        avg_satisfaction_score: 0, // Would need feedback aggregation
        churn_rate: 0 // Would need historical calculation
      };
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      return {
        total_customers: 0,
        active_customers: 0,
        new_customers_this_month: 0,
        customers_by_tier: {} as any,
        customers_by_stage: {} as any,
        avg_engagement_score: 0,
        avg_satisfaction_score: 0,
        churn_rate: 0
      };
    }
  }

  /**
   * Enrich customer data with computed fields
   */
  private static enrichCustomerData(customer: any): EnhancedCustomer {
    return {
      ...customer,
      total_packages: customer.packages?.length || 0,
      active_packages: customer.packages?.filter((p: any) => p.status === 'in_transit' || p.status === 'delivered').length || 0,
      monthly_spend: customer.customer_analytics?.[0]?.monthly_spend || 0,
      engagement_score: customer.customer_analytics?.[0]?.engagement_score || 0,
      customer_tier: customer.customer_tier || 'standard',
      lifecycle_stage: customer.lifecycle_stage || 'new_customer',
      communication_preferences: customer.communication_preferences || {
        email_enabled: true,
        sms_enabled: true,
        preferred_language: 'en'
      },
      segmentation_tags: customer.segmentation_tags || [],
      onboarding_completed: customer.onboarding_completed || false,
      lifetime_value: customer.lifetime_value || 0,
      risk_score: customer.risk_score || 0
    };
  }
}
