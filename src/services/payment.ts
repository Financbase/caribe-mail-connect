/**
 * Unified Payment Service
 * Story 1.1: Unified Payment Integration
 * 
 * Routes payments between Stripe (global) and ATH Móvil (Puerto Rico)
 * Implements hybrid payment strategy for SaaS + local market support
 */

import { supabase } from '@/integrations/supabase/client';
import { StripeService } from './stripe';
import { ATHMovilService } from './ath-movil';
import type { 
  PaymentMethodType,
  PaymentMethod,
  PaymentIntent,
  PaymentResponse,
  PaymentRoutingConfig,
  SubscriptionBilling 
} from '@/types/payment';
import type { EnhancedUser } from '@/types/subscription';

// =====================================================
// PAYMENT ROUTING LOGIC
// =====================================================

export class PaymentService {
  
  /**
   * Determine optimal payment method for customer
   */
  static async getOptimalPaymentMethod(
    customerId: string,
    subscriptionId: string,
    amount: number,
    customerLocation?: { country: string; state?: string }
  ): Promise<PaymentMethodType> {
    try {
      // Get payment routing configuration
      const routingConfig = await this.getPaymentRoutingConfig(subscriptionId);
      
      // Determine if customer is in Puerto Rico
      const isPuertoRico = customerLocation?.country === 'US' && 
                          (customerLocation?.state === 'PR' || customerLocation?.state === 'Puerto Rico');
      
      // Get customer's existing payment methods
      const paymentMethods = await this.getCustomerPaymentMethods(customerId, subscriptionId);
      
      // Apply routing logic
      if (isPuertoRico) {
        // Puerto Rico customers: prefer ATH Móvil for local market
        const hasATHMovil = paymentMethods.some(pm => pm.type === 'ath_movil' && pm.is_active);
        
        if (hasATHMovil && amount >= 1 && amount <= 1500) {
          return routingConfig.puerto_rico_primary_method;
        }
        
        // Fallback to Stripe for larger amounts or if no ATH Móvil
        return routingConfig.puerto_rico_fallback_methods[0] || 'stripe';
      } else {
        // International customers: prefer Stripe
        return routingConfig.international_primary_method;
      }
    } catch (error) {
      console.error('Error determining optimal payment method:', error);
      return 'stripe'; // Default fallback
    }
  }

  /**
   * Process payment with automatic routing
   */
  static async processPayment(
    subscriptionId: string,
    amount: number,
    description: string,
    options: {
      customerId: string;
      preferredMethod?: PaymentMethodType;
      paymentMethodId?: string;
      customerLocation?: { country: string; state?: string };
      metadata?: Record<string, any>;
    }
  ): Promise<PaymentResponse> {
    try {
      // Determine payment method if not specified
      const paymentMethod = options.preferredMethod || 
        await this.getOptimalPaymentMethod(
          options.customerId,
          subscriptionId,
          amount,
          options.customerLocation
        );

      // Route to appropriate payment processor
      switch (paymentMethod) {
        case 'stripe':
          return await StripeService.processSubscriptionPayment(
            subscriptionId,
            amount,
            options.paymentMethodId
          );
          
        case 'ath_movil':
          return await ATHMovilService.processPayment(
            subscriptionId,
            amount,
            description
          );
          
        default:
          return {
            success: false,
            error: `Unsupported payment method: ${paymentMethod}`
          };
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: 'Payment processing failed'
      };
    }
  }

  /**
   * Add payment method with automatic verification
   */
  static async addPaymentMethod(
    customerId: string,
    subscriptionId: string,
    paymentMethodType: PaymentMethodType,
    paymentMethodData: any
  ): Promise<PaymentMethod | null> {
    try {
      switch (paymentMethodType) {
        case 'stripe':
          return await StripeService.addPaymentMethod(
            customerId,
            subscriptionId,
            paymentMethodData
          );
          
        case 'ath_movil':
          return await ATHMovilService.addPaymentMethod(
            customerId,
            subscriptionId,
            paymentMethodData
          );
          
        default:
          throw new Error(`Unsupported payment method type: ${paymentMethodType}`);
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      return null;
    }
  }

  /**
   * Get all customer payment methods
   */
  static async getCustomerPaymentMethods(
    customerId: string,
    subscriptionId?: string
  ): Promise<PaymentMethod[]> {
    try {
      const [stripePaymentMethods, athMovilPaymentMethods] = await Promise.all([
        StripeService.getPaymentMethods(customerId, subscriptionId),
        ATHMovilService.getPaymentMethods(customerId, subscriptionId)
      ]);

      return [...stripePaymentMethods, ...athMovilPaymentMethods];
    } catch (error) {
      console.error('Error fetching customer payment methods:', error);
      return [];
    }
  }

  /**
   * Get payment routing configuration
   */
  static async getPaymentRoutingConfig(subscriptionId: string): Promise<PaymentRoutingConfig> {
    try {
      const { data, error } = await supabase
        .from('payment_routing_config')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Return default configuration if none exists
      if (!data) {
        return this.getDefaultPaymentRoutingConfig();
      }

      return {
        puerto_rico_customers: {
          primary: data.puerto_rico_primary_method,
          fallback: data.puerto_rico_fallback_methods
        },
        international_customers: {
          primary: data.international_primary_method,
          fallback: data.international_fallback_methods
        },
        subscription_payments: {
          preferred_methods: ['stripe', 'ath_movil'],
          auto_retry_enabled: data.subscription_auto_retry,
          retry_schedule: data.subscription_retry_schedule
        },
        minimum_amounts: data.minimum_amounts || {}
      };
    } catch (error) {
      console.error('Error fetching payment routing config:', error);
      return this.getDefaultPaymentRoutingConfig();
    }
  }

  /**
   * Update payment routing configuration
   */
  static async updatePaymentRoutingConfig(
    subscriptionId: string,
    config: Partial<PaymentRoutingConfig>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('payment_routing_config')
        .upsert({
          subscription_id: subscriptionId,
          puerto_rico_primary_method: config.puerto_rico_customers?.primary,
          puerto_rico_fallback_methods: config.puerto_rico_customers?.fallback,
          international_primary_method: config.international_customers?.primary,
          international_fallback_methods: config.international_customers?.fallback,
          subscription_auto_retry: config.subscription_payments?.auto_retry_enabled,
          subscription_retry_schedule: config.subscription_payments?.retry_schedule,
          minimum_amounts: config.minimum_amounts
        });

      return !error;
    } catch (error) {
      console.error('Error updating payment routing config:', error);
      return false;
    }
  }

  /**
   * Get default payment routing configuration
   */
  private static getDefaultPaymentRoutingConfig(): PaymentRoutingConfig {
    return {
      puerto_rico_customers: {
        primary: 'ath_movil',
        fallback: ['stripe']
      },
      international_customers: {
        primary: 'stripe',
        fallback: ['paypal']
      },
      subscription_payments: {
        preferred_methods: ['stripe', 'ath_movil'],
        auto_retry_enabled: true,
        retry_schedule: [1, 3, 7, 14] // Days between retries
      },
      minimum_amounts: {
        ath_movil: 1.00,
        stripe: 0.50
      }
    };
  }

  /**
   * Retry failed payment with fallback methods
   */
  static async retryFailedPayment(
    subscriptionId: string,
    paymentIntentId: string,
    originalMethod: PaymentMethodType
  ): Promise<PaymentResponse> {
    try {
      const routingConfig = await this.getPaymentRoutingConfig(subscriptionId);
      
      // Get fallback methods based on original method
      let fallbackMethods: PaymentMethodType[] = [];
      
      if (originalMethod === 'ath_movil') {
        fallbackMethods = routingConfig.puerto_rico_customers.fallback;
      } else if (originalMethod === 'stripe') {
        fallbackMethods = routingConfig.international_customers.fallback;
      }

      // Try each fallback method
      for (const method of fallbackMethods) {
        try {
          if (method === 'stripe') {
            const result = await StripeService.retryFailedPayment(subscriptionId, paymentIntentId);
            if (result.success) return result;
          }
          // Add other fallback method implementations as needed
        } catch (error) {
          console.warn(`Fallback payment method ${method} failed:`, error);
          continue;
        }
      }

      return {
        success: false,
        error: 'All payment methods failed'
      };
    } catch (error) {
      console.error('Error retrying failed payment:', error);
      return {
        success: false,
        error: 'Payment retry failed'
      };
    }
  }

  /**
   * Get payment history for subscription
   */
  static async getPaymentHistory(
    subscriptionId: string,
    limit: number = 50
  ): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          customer:customers(first_name, last_name, email),
          invoice:invoices(invoice_number, total_amount)
        `)
        .eq('subscription_id', subscriptionId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  /**
   * Calculate payment processing fees
   */
  static calculateProcessingFees(
    amount: number,
    paymentMethod: PaymentMethodType,
    isInternational: boolean = false
  ): { fee: number; net: number } {
    let feeRate = 0;
    let fixedFee = 0;

    switch (paymentMethod) {
      case 'stripe':
        feeRate = isInternational ? 0.039 : 0.029; // 3.9% international, 2.9% domestic
        fixedFee = 0.30;
        break;
      case 'ath_movil':
        feeRate = 0.025; // 2.5% for ATH Móvil
        fixedFee = 0;
        break;
      default:
        feeRate = 0.035; // Default 3.5%
        fixedFee = 0.30;
    }

    const fee = (amount * feeRate) + fixedFee;
    const net = amount - fee;

    return { fee, net };
  }
}
