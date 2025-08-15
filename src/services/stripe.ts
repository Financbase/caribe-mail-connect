/**
 * Stripe Integration Service
 * Story 1.1: Unified Payment Integration
 * 
 * Handles Stripe subscription billing and payment processing
 * Integrates with existing payment infrastructure and subscription system
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  Subscription, 
  SubscriptionPlanTier,
  SUBSCRIPTION_PLANS 
} from '@/types/subscription';
import type { 
  StripePaymentMethod,
  SubscriptionBilling,
  PaymentIntent,
  PaymentResponse 
} from '@/types/payment';

// =====================================================
// STRIPE CONFIGURATION
// =====================================================

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const STRIPE_API_VERSION = '2023-10-16';

// Lazy load Stripe to avoid SSR issues
let stripePromise: Promise<any> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = import('@stripe/stripe-js').then(({ loadStripe }) => {
      if (!STRIPE_PUBLISHABLE_KEY) {
        console.warn('Stripe publishable key not found');
        return null;
      }
      return loadStripe(STRIPE_PUBLISHABLE_KEY);
    });
  }
  return stripePromise;
};

// =====================================================
// STRIPE CUSTOMER MANAGEMENT
// =====================================================

export class StripeService {
  
  /**
   * Create or retrieve Stripe customer for subscription
   */
  static async createOrGetCustomer(subscriptionId: string, customerData: {
    email: string;
    name: string;
    phone?: string;
    address?: any;
  }): Promise<string> {
    try {
      // Check if customer already exists in subscription_billing
      const { data: existingBilling } = await supabase
        .from('subscription_billing')
        .select('stripe_customer_id')
        .eq('subscription_id', subscriptionId)
        .single();

      if (existingBilling?.stripe_customer_id) {
        return existingBilling.stripe_customer_id;
      }

      // Create new Stripe customer via Edge Function
      const { data, error } = await supabase.functions.invoke('stripe-customer', {
        body: {
          action: 'create',
          subscription_id: subscriptionId,
          customer_data: customerData
        }
      });

      if (error) throw error;

      return data.stripe_customer_id;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create Stripe customer');
    }
  }

  /**
   * Create subscription billing setup
   */
  static async createSubscriptionBilling(
    subscriptionId: string,
    planTier: SubscriptionPlanTier,
    billingInterval: 'month' | 'year' = 'month'
  ): Promise<SubscriptionBilling> {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-subscription', {
        body: {
          action: 'create',
          subscription_id: subscriptionId,
          plan_tier: planTier,
          billing_interval: billingInterval
        }
      });

      if (error) throw error;

      return data.subscription_billing;
    } catch (error) {
      console.error('Error creating subscription billing:', error);
      throw new Error('Failed to create subscription billing');
    }
  }

  /**
   * Add payment method to customer
   */
  static async addPaymentMethod(
    customerId: string,
    subscriptionId: string,
    paymentMethodData: {
      type: 'card';
      card?: any;
      billing_details?: any;
    }
  ): Promise<StripePaymentMethod> {
    try {
      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe not available');

      // Create payment method with Stripe
      const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod(paymentMethodData);
      
      if (stripeError) throw stripeError;

      // Save payment method to database via Edge Function
      const { data, error } = await supabase.functions.invoke('payment-method', {
        body: {
          action: 'add',
          customer_id: customerId,
          subscription_id: subscriptionId,
          stripe_payment_method_id: paymentMethod.id,
          payment_method_data: paymentMethod
        }
      });

      if (error) throw error;

      return data.payment_method;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw new Error('Failed to add payment method');
    }
  }

  /**
   * Process subscription payment
   */
  static async processSubscriptionPayment(
    subscriptionId: string,
    amount: number,
    paymentMethodId?: string
  ): Promise<PaymentResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          subscription_id: subscriptionId,
          amount: amount,
          payment_method_id: paymentMethodId,
          billing_type: 'subscription',
          payment_method_type: 'stripe'
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error processing subscription payment:', error);
      return {
        success: false,
        error: 'Failed to process payment'
      };
    }
  }

  /**
   * Handle payment confirmation (for 3D Secure, etc.)
   */
  static async confirmPayment(
    clientSecret: string,
    paymentMethodId?: string
  ): Promise<PaymentResponse> {
    try {
      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe not available');

      const { paymentIntent, error } = await stripe.confirmPayment({
        clientSecret,
        payment_method: paymentMethodId,
        return_url: `${window.location.origin}/billing/payment-success`
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: paymentIntent.status === 'succeeded',
        payment: paymentIntent as any // Will be properly typed by backend
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        error: 'Failed to confirm payment'
      };
    }
  }

  /**
   * Get subscription billing details
   */
  static async getSubscriptionBilling(subscriptionId: string): Promise<SubscriptionBilling | null> {
    try {
      const { data, error } = await supabase
        .from('subscription_billing')
        .select(`
          *,
          subscription:subscriptions(*)
        `)
        .eq('subscription_id', subscriptionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching subscription billing:', error);
      return null;
    }
  }

  /**
   * Get customer payment methods
   */
  static async getPaymentMethods(
    customerId: string,
    subscriptionId?: string
  ): Promise<StripePaymentMethod[]> {
    try {
      let query = supabase
        .from('payment_methods')
        .select('*')
        .eq('customer_id', customerId)
        .eq('type', 'stripe')
        .eq('is_active', true);

      if (subscriptionId) {
        query = query.eq('subscription_id', subscriptionId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  /**
   * Update subscription plan
   */
  static async updateSubscriptionPlan(
    subscriptionId: string,
    newPlanTier: SubscriptionPlanTier,
    billingInterval?: 'month' | 'year'
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-subscription', {
        body: {
          action: 'update',
          subscription_id: subscriptionId,
          plan_tier: newPlanTier,
          billing_interval: billingInterval
        }
      });

      if (error) throw error;

      return data.success;
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      return false;
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-subscription', {
        body: {
          action: 'cancel',
          subscription_id: subscriptionId,
          cancel_at_period_end: cancelAtPeriodEnd
        }
      });

      if (error) throw error;

      return data.success;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  }

  /**
   * Get upcoming invoice preview
   */
  static async getUpcomingInvoice(subscriptionId: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-invoice', {
        body: {
          action: 'preview',
          subscription_id: subscriptionId
        }
      });

      if (error) throw error;

      return data.invoice;
    } catch (error) {
      console.error('Error fetching upcoming invoice:', error);
      return null;
    }
  }

  /**
   * Retry failed payment
   */
  static async retryFailedPayment(
    subscriptionId: string,
    paymentIntentId: string
  ): Promise<PaymentResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-payment-retry', {
        body: {
          subscription_id: subscriptionId,
          payment_intent_id: paymentIntentId
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error retrying payment:', error);
      return {
        success: false,
        error: 'Failed to retry payment'
      };
    }
  }
}

// =====================================================
// STRIPE WEBHOOK HELPERS
// =====================================================

export class StripeWebhookService {
  
  /**
   * Handle Stripe webhook events
   */
  static async handleWebhookEvent(event: any): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-webhook', {
        body: {
          event: event
        }
      });

      if (error) throw error;

      return data.success;
    } catch (error) {
      console.error('Error handling Stripe webhook:', error);
      return false;
    }
  }
}
