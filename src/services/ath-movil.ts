/**
 * ATH Móvil Integration Service
 * Story 1.1: Unified Payment Integration
 * 
 * Handles ATH Móvil payments for Puerto Rico market
 * Integrates with existing payment infrastructure and Epic 2 requirements
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  ATHMovilPaymentMethod,
  PaymentIntent,
  PaymentResponse 
} from '@/types/payment';

// =====================================================
// ATH MÓVIL CONFIGURATION
// =====================================================

const ATH_MOVIL_CONFIG = {
  // Production URLs
  PRODUCTION_API_URL: 'https://www.athmovil.com/api/business-account',
  PRODUCTION_PAYMENT_URL: 'https://www.athmovil.com/pay',
  
  // Sandbox URLs for testing
  SANDBOX_API_URL: 'https://sandbox.athmovil.com/api/business-account',
  SANDBOX_PAYMENT_URL: 'https://sandbox.athmovil.com/pay',
  
  // Environment detection
  IS_PRODUCTION: import.meta.env.VITE_APP_ENV === 'production',
  
  // Supported currencies
  SUPPORTED_CURRENCIES: ['USD'],
  
  // Minimum and maximum amounts
  MIN_AMOUNT: 1.00,
  MAX_AMOUNT: 1500.00
};

// =====================================================
// ATH MÓVIL SERVICE
// =====================================================

export class ATHMovilService {
  
  /**
   * Add ATH Móvil payment method for customer
   */
  static async addPaymentMethod(
    customerId: string,
    subscriptionId: string,
    athMovilData: {
      phone_number: string;
      account_name: string;
    }
  ): Promise<ATHMovilPaymentMethod> {
    try {
      // Validate phone number format (Puerto Rico)
      const phoneRegex = /^(\+1|1)?[789]\d{9}$/;
      if (!phoneRegex.test(athMovilData.phone_number.replace(/\D/g, ''))) {
        throw new Error('Invalid Puerto Rico phone number format');
      }

      // Verify ATH Móvil account via Edge Function
      const { data: verificationData, error: verificationError } = await supabase.functions.invoke('ath-movil-verify', {
        body: {
          phone_number: athMovilData.phone_number,
          account_name: athMovilData.account_name
        }
      });

      if (verificationError) throw verificationError;

      // Save payment method to database
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          customer_id: customerId,
          subscription_id: subscriptionId,
          type: 'ath_movil',
          phone_number: athMovilData.phone_number,
          account_name: athMovilData.account_name,
          is_verified: verificationData.verified,
          is_active: true,
          metadata: {
            verification_date: new Date().toISOString(),
            verification_method: 'api'
          }
        })
        .select()
        .single();

      if (error) throw error;

      return data as ATHMovilPaymentMethod;
    } catch (error) {
      console.error('Error adding ATH Móvil payment method:', error);
      throw new Error('Failed to add ATH Móvil payment method');
    }
  }

  /**
   * Process ATH Móvil payment
   */
  static async processPayment(
    subscriptionId: string,
    amount: number,
    description: string,
    phoneNumber?: string
  ): Promise<PaymentResponse> {
    try {
      // Validate amount
      if (amount < ATH_MOVIL_CONFIG.MIN_AMOUNT || amount > ATH_MOVIL_CONFIG.MAX_AMOUNT) {
        return {
          success: false,
          error: `Amount must be between $${ATH_MOVIL_CONFIG.MIN_AMOUNT} and $${ATH_MOVIL_CONFIG.MAX_AMOUNT}`
        };
      }

      // Process payment via Edge Function
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          subscription_id: subscriptionId,
          amount: amount,
          description: description,
          phone_number: phoneNumber,
          billing_type: 'subscription',
          payment_method_type: 'ath_movil'
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error processing ATH Móvil payment:', error);
      return {
        success: false,
        error: 'Failed to process ATH Móvil payment'
      };
    }
  }

  /**
   * Create ATH Móvil payment link
   */
  static async createPaymentLink(
    subscriptionId: string,
    amount: number,
    description: string,
    metadata: Record<string, any> = {}
  ): Promise<{ url: string; reference: string } | null> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-payment-link', {
        body: {
          amount: amount,
          currency: 'USD',
          description: description,
          paymentMethod: 'ath_movil',
          metadata: {
            ...metadata,
            subscription_id: subscriptionId,
            payment_source: 'subscription'
          }
        }
      });

      if (error) throw error;

      return {
        url: data.paymentLink,
        reference: data.linkId
      };
    } catch (error) {
      console.error('Error creating ATH Móvil payment link:', error);
      return null;
    }
  }

  /**
   * Check payment status
   */
  static async checkPaymentStatus(
    transactionId: string
  ): Promise<{ status: string; amount?: number; timestamp?: string } | null> {
    try {
      const { data, error } = await supabase.functions.invoke('ath-movil-status', {
        body: {
          transaction_id: transactionId
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error checking ATH Móvil payment status:', error);
      return null;
    }
  }

  /**
   * Get customer ATH Móvil payment methods
   */
  static async getPaymentMethods(
    customerId: string,
    subscriptionId?: string
  ): Promise<ATHMovilPaymentMethod[]> {
    try {
      let query = supabase
        .from('payment_methods')
        .select('*')
        .eq('customer_id', customerId)
        .eq('type', 'ath_movil')
        .eq('is_active', true);

      if (subscriptionId) {
        query = query.eq('subscription_id', subscriptionId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching ATH Móvil payment methods:', error);
      return [];
    }
  }

  /**
   * Verify ATH Móvil account
   */
  static async verifyAccount(
    phoneNumber: string,
    accountName: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('ath-movil-verify', {
        body: {
          phone_number: phoneNumber,
          account_name: accountName
        }
      });

      if (error) throw error;

      return data.verified;
    } catch (error) {
      console.error('Error verifying ATH Móvil account:', error);
      return false;
    }
  }

  /**
   * Process refund (if supported)
   */
  static async processRefund(
    transactionId: string,
    amount: number,
    reason: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('ath-movil-refund', {
        body: {
          transaction_id: transactionId,
          amount: amount,
          reason: reason
        }
      });

      if (error) throw error;

      return data.success;
    } catch (error) {
      console.error('Error processing ATH Móvil refund:', error);
      return false;
    }
  }

  /**
   * Get transaction history
   */
  static async getTransactionHistory(
    customerId: string,
    subscriptionId?: string,
    limit: number = 50
  ): Promise<any[]> {
    try {
      let query = supabase
        .from('payments')
        .select('*')
        .eq('customer_id', customerId)
        .eq('payment_method', 'ath_movil')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (subscriptionId) {
        query = query.eq('subscription_id', subscriptionId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching ATH Móvil transaction history:', error);
      return [];
    }
  }

  /**
   * Format phone number for ATH Móvil
   */
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digits
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Handle different formats
    if (digits.length === 10 && (digits.startsWith('7') || digits.startsWith('8') || digits.startsWith('9'))) {
      // Puerto Rico number without country code
      return `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      // US/PR number with country code
      return `+${digits}`;
    } else {
      // Return as-is if format is unclear
      return phoneNumber;
    }
  }

  /**
   * Validate Puerto Rico phone number
   */
  static isValidPuertoRicoPhone(phoneNumber: string): boolean {
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Puerto Rico numbers start with 7, 8, or 9 and are 10 digits total
    // Or 11 digits starting with 1 (US country code)
    if (digits.length === 10) {
      return /^[789]/.test(digits);
    } else if (digits.length === 11) {
      return /^1[789]/.test(digits);
    }
    
    return false;
  }

  /**
   * Get payment method display info
   */
  static getPaymentMethodDisplay(paymentMethod: ATHMovilPaymentMethod): {
    displayName: string;
    maskedPhone: string;
    icon: string;
  } {
    const phone = paymentMethod.phone_number;
    const maskedPhone = phone.length > 4 
      ? `***-***-${phone.slice(-4)}`
      : phone;

    return {
      displayName: `ATH Móvil - ${paymentMethod.account_name}`,
      maskedPhone,
      icon: 'ath-movil' // For icon component
    };
  }
}

// =====================================================
// ATH MÓVIL WEBHOOK HELPERS
// =====================================================

export class ATHMovilWebhookService {
  
  /**
   * Handle ATH Móvil webhook events
   */
  static async handleWebhookEvent(event: any): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('ath-movil-webhook', {
        body: {
          event: event
        }
      });

      if (error) throw error;

      return data.success;
    } catch (error) {
      console.error('Error handling ATH Móvil webhook:', error);
      return false;
    }
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    try {
      // ATH Móvil webhook signature verification logic
      // This would implement the specific signature verification required by ATH Móvil
      // For now, returning true as placeholder
      return true;
    } catch (error) {
      console.error('Error verifying ATH Móvil webhook signature:', error);
      return false;
    }
  }
}
