/**
 * Analytics Management Hook
 * Story 1.5: Advanced Analytics & Reporting
 *
 * React hook for managing analytics dashboards, business intelligence,
 * real-time metrics, and data insights
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { AnalyticsService } from '@/services/analytics';
import { supabase } from '@/integrations/supabase/client';

// =====================================================
// ANALYTICS HOOK TYPES
// =====================================================

interface UseAnalyticsState {
  isLoading: boolean;
  error: string | null;
  timeRange: { from: Date; to: Date };
  refreshInterval: number; // minutes
}

interface UseAnalyticsActions {
  // Settings
  setTimeRange: (range: { from: Date; to: Date }) => void;
  setRefreshInterval: (interval: number) => void;
  refetch: () => Promise<void>;
}

// Legacy types for backward compatibility
export interface DateRange {
  from: Date;
  to: Date;
}

export interface AnalyticsData {
  // Key metrics
  totalPackages: number;
  packagesDelivered: number;
  activeCustomers: number;
  totalRevenue: number;
  mailboxOccupancy: number;
  daysSinceActivity: number;
}

// =====================================================
// MAIN ANALYTICS HOOK
// =====================================================

export function useAnalytics(): UseAnalyticsState & UseAnalyticsActions {
  const { subscription } = useSubscription();
  const { user } = useAuth();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });
  const [refreshInterval, setRefreshInterval] = useState(5); // 5 minutes

  // =====================================================
  // DATA FETCHING
  // =====================================================

  const refetch = useCallback(async () => {
    if (!subscription || !user) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate analytics data fetching
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [subscription, user]);

  // =====================================================
  // EFFECTS
  // =====================================================

  useEffect(() => {
    if (subscription && user) {
      refetch();
    }
  }, [subscription, user, refetch]);

  // Auto-refresh data based on interval
  useEffect(() => {
    if (!subscription || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      refetch();
    }, refreshInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [subscription, refreshInterval, refetch]);

  // =====================================================
  // RETURN ANALYTICS HOOK INTERFACE
  // =====================================================

  return {
    // State
    isLoading,
    error,
    timeRange,
    refreshInterval,

    // Actions
    setTimeRange,
    setRefreshInterval,
    refetch
  };
}