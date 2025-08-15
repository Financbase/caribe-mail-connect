/**
 * Subscription Context
 * Story 1.0: Hybrid Tenant Architecture
 * 
 * Provides subscription and multi-tenant context throughout the application
 * while preserving existing authentication and location context
 */

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { 
  Subscription, 
  FeatureEntitlement, 
  EnhancedUser, 
  FeatureKey,
  SubscriptionResponse,
  FeatureCheckResponse 
} from '@/types/subscription';

// =====================================================
// SUBSCRIPTION CONTEXT TYPES
// =====================================================

interface SubscriptionContextType {
  // Subscription state
  subscription: Subscription | null;
  entitlements: FeatureEntitlement[];
  isLoading: boolean;
  error: string | null;
  
  // Enhanced user with subscription context
  enhancedUser: EnhancedUser | null;
  
  // Feature checking
  hasFeature: (featureKey: FeatureKey) => boolean;
  checkFeatureUsage: (featureKey: FeatureKey) => Promise<FeatureCheckResponse | null>;
  incrementFeatureUsage: (featureKey: FeatureKey, increment?: number) => Promise<boolean>;
  
  // Subscription management
  refreshSubscription: () => Promise<void>;
  switchSubscription: (subscriptionId: string) => Promise<void>;
}

// =====================================================
// CONTEXT CREATION
// =====================================================

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// =====================================================
// SUBSCRIPTION PROVIDER
// =====================================================

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { user, loading: authLoading } = useAuth();
  
  // Subscription state
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [entitlements, setEntitlements] = useState<FeatureEntitlement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced user with subscription context
  const [enhancedUser, setEnhancedUser] = useState<EnhancedUser | null>(null);

  // =====================================================
  // SUBSCRIPTION DATA FETCHING
  // =====================================================

  const fetchSubscriptionData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // For now, create a mock subscription to avoid database errors
      const mockSubscription: Subscription = {
        id: 'mock-subscription-1',
        user_id: user.id,
        status: 'active',
        plan_id: 'basic',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockEntitlements: FeatureEntitlement[] = [
        {
          feature_key: 'packages_unlimited',
          is_enabled: true,
          usage_limit: null,
          current_usage: 0
        }
      ];

      setSubscription(mockSubscription);
      setEntitlements(mockEntitlements);
      
      // Create enhanced user
      const enhancedUserData: EnhancedUser = {
        ...user,
        email: user.email || '',
        subscription_id: mockSubscription.id,
        subscription_role: 'admin',
        subscription: mockSubscription,
        entitlements: mockEntitlements
      };

      setEnhancedUser(enhancedUserData);
    } catch (err) {
      console.error('Error setting up subscription context:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscription');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // =====================================================
  // FEATURE CHECKING FUNCTIONS
  // =====================================================

  const hasFeature = (featureKey: FeatureKey): boolean => {
    const entitlement = entitlements.find(e => e.feature_key === featureKey);
    return entitlement?.is_enabled ?? false;
  };

  const checkFeatureUsage = async (featureKey: FeatureKey): Promise<FeatureCheckResponse | null> => {
    if (!subscription) return null;

    try {
      const { data, error } = await supabase
        .from('subscription_entitlements')
        .select('feature_key, is_enabled, usage_limit, current_usage')
        .eq('subscription_id', subscription.id)
        .eq('feature_key', featureKey)
        .single();

      if (error) {
        console.error('Error checking feature usage:', error);
        return null;
      }

      return {
        feature_key: data.feature_key,
        is_enabled: data.is_enabled,
        usage_limit: data.usage_limit,
        current_usage: data.current_usage,
        usage_remaining: data.usage_limit ? data.usage_limit - data.current_usage : undefined
      };
    } catch (err) {
      console.error('Error checking feature usage:', err);
      return null;
    }
  };

    const incrementFeatureUsage = async (featureKey: FeatureKey): Promise<boolean> => {
    try {
      // For now, just return true to avoid database function call errors
      console.log('Incrementing feature usage for:', featureKey);
      return true;
    } catch (err) {
      console.error('Error incrementing feature usage:', err);
      return false;
    }
  };

  // =====================================================
  // SUBSCRIPTION MANAGEMENT
  // =====================================================

  const refreshSubscription = async (): Promise<void> => {
    await fetchSubscriptionData();
  };

  const switchSubscription = async (subscriptionId: string): Promise<void> => {
    if (!user) return;

    try {
      // This would be used for users who belong to multiple organizations
      // For now, we'll just refresh the current subscription
      await fetchSubscriptionData();
    } catch (err) {
      console.error('Error switching subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch subscription');
    }
  };

  // =====================================================
  // EFFECTS
  // =====================================================

  // Fetch subscription data when user changes
  useEffect(() => {
    if (!authLoading) {
      fetchSubscriptionData();
    }
  }, [user, authLoading, fetchSubscriptionData]);

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const contextValue: SubscriptionContextType = {
    subscription,
    entitlements,
    isLoading: isLoading || authLoading,
    error,
    enhancedUser,
    hasFeature,
    checkFeatureUsage,
    incrementFeatureUsage,
    refreshSubscription,
    switchSubscription
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

// =====================================================
// FEATURE CHECKING HOOKS
// =====================================================

export function useFeature(featureKey: FeatureKey) {
  const { hasFeature, checkFeatureUsage, incrementFeatureUsage } = useSubscription();
  
  return {
    hasFeature: hasFeature(featureKey),
    checkUsage: () => checkFeatureUsage(featureKey),
    incrementUsage: (increment?: number) => incrementFeatureUsage(featureKey, increment)
  };
}

export function useFeatureGate(featureKey: FeatureKey) {
  const { hasFeature } = useSubscription();
  const isEnabled = hasFeature(featureKey);
  
  return {
    isEnabled,
    FeatureGate: ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => {
      if (isEnabled) {
        return <>{children}</>;
      }
      return <>{fallback || null}</>;
    }
  };
}
