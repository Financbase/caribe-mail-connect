/**
 * Payment Processing Hook
 * Story 1.1: Unified Payment Integration
 * 
 * React hook for managing payment processing, methods, and billing
 * Integrates Stripe and ATH Móvil with subscription system
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PaymentService } from '@/services/payment';
import { StripeService } from '@/services/stripe';
import { ATHMovilService } from '@/services/ath-movil';
import type { 
  PaymentMethod,
  PaymentMethodType,
  PaymentResponse,
  PaymentRoutingConfig,
  SubscriptionBilling 
} from '@/types/payment';

// =====================================================
// PAYMENT HOOK TYPES
// =====================================================

interface UsePaymentState {
  paymentMethods: PaymentMethod[];
  subscriptionBilling: SubscriptionBilling | null;
  routingConfig: PaymentRoutingConfig | null;
  isLoading: boolean;
  error: string | null;
}

interface UsePaymentActions {
  // Payment methods
  addPaymentMethod: (type: PaymentMethodType, data: any) => Promise<PaymentMethod | null>;
  removePaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  refreshPaymentMethods: () => Promise<void>;
  
  // Payment processing
  processPayment: (amount: number, description: string, options?: any) => Promise<PaymentResponse>;
  retryFailedPayment: (paymentIntentId: string) => Promise<PaymentResponse>;
  
  // Billing management
  updateBillingAddress: (address: any) => Promise<boolean>;
  updatePaymentRoutingConfig: (config: Partial<PaymentRoutingConfig>) => Promise<boolean>;
  
  // Subscription billing
  createSubscriptionBilling: (planTier: string, interval?: 'month' | 'year') => Promise<boolean>;
  updateSubscriptionPlan: (planTier: string, interval?: 'month' | 'year') => Promise<boolean>;
  cancelSubscription: (cancelAtPeriodEnd?: boolean) => Promise<boolean>;
}

// =====================================================
// MAIN PAYMENT HOOK
// =====================================================

export function usePayment(): UsePaymentState & UsePaymentActions {
  const { subscription, enhancedUser } = useSubscription();
  
  // State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [subscriptionBilling, setSubscriptionBilling] = useState<SubscriptionBilling | null>(null);
  const [routingConfig, setRoutingConfig] = useState<PaymentRoutingConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // DATA FETCHING
  // =====================================================

  const fetchPaymentData = useCallback(async () => {
    if (!subscription || !enhancedUser) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch payment methods
      const methods = await PaymentService.getCustomerPaymentMethods(
        enhancedUser.id,
        subscription.id
      );
      setPaymentMethods(methods);

      // Fetch subscription billing
      const billing = await StripeService.getSubscriptionBilling(subscription.id);
      setSubscriptionBilling(billing);

      // Fetch routing configuration
      const routing = await PaymentService.getPaymentRoutingConfig(subscription.id);
      setRoutingConfig(routing);

    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load payment data');
    } finally {
      setIsLoading(false);
    }
  }, [subscription, enhancedUser]);

  // Fetch data when subscription changes
  useEffect(() => {
    fetchPaymentData();
  }, [fetchPaymentData]);

  // =====================================================
  // PAYMENT METHOD ACTIONS
  // =====================================================

  const addPaymentMethod = useCallback(async (
    type: PaymentMethodType,
    data: any
  ): Promise<PaymentMethod | null> => {
    if (!subscription || !enhancedUser) return null;

    try {
      setError(null);
      const paymentMethod = await PaymentService.addPaymentMethod(
        enhancedUser.id,
        subscription.id,
        type,
        data
      );

      if (paymentMethod) {
        setPaymentMethods(prev => [...prev, paymentMethod]);
      }

      return paymentMethod;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add payment method';
      setError(errorMessage);
      return null;
    }
  }, [subscription, enhancedUser]);

  const removePaymentMethod = useCallback(async (paymentMethodId: string): Promise<boolean> => {
    try {
      setError(null);
      // Implementation would call appropriate service based on payment method type
      // For now, just remove from local state
      setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove payment method';
      setError(errorMessage);
      return false;
    }
  }, []);

  const setDefaultPaymentMethod = useCallback(async (paymentMethodId: string): Promise<boolean> => {
    try {
      setError(null);
      // Update local state optimistically
      setPaymentMethods(prev => prev.map(pm => ({
        ...pm,
        is_default: pm.id === paymentMethodId
      })));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set default payment method';
      setError(errorMessage);
      return false;
    }
  }, []);

  const refreshPaymentMethods = useCallback(async (): Promise<void> => {
    await fetchPaymentData();
  }, [fetchPaymentData]);

  // =====================================================
  // PAYMENT PROCESSING ACTIONS
  // =====================================================

  const processPayment = useCallback(async (
    amount: number,
    description: string,
    options: any = {}
  ): Promise<PaymentResponse> => {
    if (!subscription || !enhancedUser) {
      return { success: false, error: 'No active subscription' };
    }

    try {
      setError(null);
      return await PaymentService.processPayment(
        subscription.id,
        amount,
        description,
        {
          customerId: enhancedUser.id,
          ...options
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [subscription, enhancedUser]);

  const retryFailedPayment = useCallback(async (paymentIntentId: string): Promise<PaymentResponse> => {
    if (!subscription) {
      return { success: false, error: 'No active subscription' };
    }

    try {
      setError(null);
      return await PaymentService.retryFailedPayment(
        subscription.id,
        paymentIntentId,
        'stripe' // Default to stripe for retries
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment retry failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [subscription]);

  // =====================================================
  // BILLING MANAGEMENT ACTIONS
  // =====================================================

  const updateBillingAddress = useCallback(async (address: any): Promise<boolean> => {
    try {
      setError(null);
      // Implementation would update billing address
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update billing address';
      setError(errorMessage);
      return false;
    }
  }, []);

  const updatePaymentRoutingConfig = useCallback(async (
    config: Partial<PaymentRoutingConfig>
  ): Promise<boolean> => {
    if (!subscription) return false;

    try {
      setError(null);
      const success = await PaymentService.updatePaymentRoutingConfig(subscription.id, config);
      
      if (success) {
        setRoutingConfig(prev => prev ? { ...prev, ...config } : null);
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update routing config';
      setError(errorMessage);
      return false;
    }
  }, [subscription]);

  // =====================================================
  // SUBSCRIPTION BILLING ACTIONS
  // =====================================================

  const createSubscriptionBilling = useCallback(async (
    planTier: string,
    interval: 'month' | 'year' = 'month'
  ): Promise<boolean> => {
    if (!subscription) return false;

    try {
      setError(null);
      const billing = await StripeService.createSubscriptionBilling(
        subscription.id,
        planTier as any,
        interval
      );
      
      setSubscriptionBilling(billing);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subscription billing';
      setError(errorMessage);
      return false;
    }
  }, [subscription]);

  const updateSubscriptionPlan = useCallback(async (
    planTier: string,
    interval?: 'month' | 'year'
  ): Promise<boolean> => {
    if (!subscription) return false;

    try {
      setError(null);
      return await StripeService.updateSubscriptionPlan(
        subscription.id,
        planTier as any,
        interval
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subscription plan';
      setError(errorMessage);
      return false;
    }
  }, [subscription]);

  const cancelSubscription = useCallback(async (
    cancelAtPeriodEnd: boolean = true
  ): Promise<boolean> => {
    if (!subscription) return false;

    try {
      setError(null);
      return await StripeService.cancelSubscription(subscription.id, cancelAtPeriodEnd);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
      setError(errorMessage);
      return false;
    }
  }, [subscription]);

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // State
    paymentMethods,
    subscriptionBilling,
    routingConfig,
    isLoading,
    error,
    
    // Actions
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    refreshPaymentMethods,
    processPayment,
    retryFailedPayment,
    updateBillingAddress,
    updatePaymentRoutingConfig,
    createSubscriptionBilling,
    updateSubscriptionPlan,
    cancelSubscription
  };
}

// =====================================================
// SPECIALIZED HOOKS
// =====================================================

/**
 * Hook for Stripe-specific payment operations
 */
export function useStripePayment() {
  const { subscription, enhancedUser } = useSubscription();
  
  const addStripePaymentMethod = useCallback(async (paymentMethodData: any) => {
    if (!subscription || !enhancedUser) return null;
    
    return await StripeService.addPaymentMethod(
      enhancedUser.id,
      subscription.id,
      paymentMethodData
    );
  }, [subscription, enhancedUser]);

  const getStripePaymentMethods = useCallback(async () => {
    if (!subscription || !enhancedUser) return [];
    
    return await StripeService.getPaymentMethods(enhancedUser.id, subscription.id);
  }, [subscription, enhancedUser]);

  return {
    addStripePaymentMethod,
    getStripePaymentMethods
  };
}

/**
 * Hook for ATH Móvil-specific payment operations
 */
export function useATHMovilPayment() {
  const { subscription, enhancedUser } = useSubscription();
  
  const addATHMovilPaymentMethod = useCallback(async (athMovilData: any) => {
    if (!subscription || !enhancedUser) return null;
    
    return await ATHMovilService.addPaymentMethod(
      enhancedUser.id,
      subscription.id,
      athMovilData
    );
  }, [subscription, enhancedUser]);

  const getATHMovilPaymentMethods = useCallback(async () => {
    if (!subscription || !enhancedUser) return [];
    
    return await ATHMovilService.getPaymentMethods(enhancedUser.id, subscription.id);
  }, [subscription, enhancedUser]);

  const verifyATHMovilAccount = useCallback(async (phoneNumber: string, accountName: string) => {
    return await ATHMovilService.verifyAccount(phoneNumber, accountName);
  }, []);

  return {
    addATHMovilPaymentMethod,
    getATHMovilPaymentMethods,
    verifyATHMovilAccount
  };
}
