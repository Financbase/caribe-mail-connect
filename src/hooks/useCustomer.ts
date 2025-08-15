/**
 * Enhanced Customer Management Hook
 * Story 1.2: Enhanced Customer Management
 * 
 * React hook for managing enhanced customer operations with subscription context,
 * lifecycle management, segmentation, and communication features
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { CustomerService } from '@/services/customer';
import type { 
  EnhancedCustomer,
  CustomerLifecycleStage,
  CustomerSearchFilters,
  CustomerListResponse,
  CustomerStatsResponse,
  CustomerAnalytics
} from '@/types/customer';

// =====================================================
// CUSTOMER HOOK TYPES
// =====================================================

interface UseCustomerState {
  customers: EnhancedCustomer[];
  currentCustomer: EnhancedCustomer | null;
  customerStats: CustomerStatsResponse | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
}

interface UseCustomerActions {
  // Customer CRUD
  searchCustomers: (filters: CustomerSearchFilters, page?: number) => Promise<void>;
  getCustomer: (customerId: string) => Promise<EnhancedCustomer | null>;
  refreshCustomers: () => Promise<void>;
  refreshCustomerStats: () => Promise<void>;
  
  // Lifecycle management
  updateLifecycleStage: (customerId: string, stage: CustomerLifecycleStage, notes?: string) => Promise<boolean>;
  
  // Analytics
  getCustomerAnalytics: (customerId: string) => Promise<CustomerAnalytics | null>;
  computeCustomerAnalytics: (customerId: string) => Promise<CustomerAnalytics | null>;
  
  // Pagination
  loadNextPage: () => Promise<void>;
  resetPagination: () => void;
}

// =====================================================
// MAIN CUSTOMER HOOK
// =====================================================

export function useCustomer(): UseCustomerState & UseCustomerActions {
  const { subscription } = useSubscription();
  
  // State
  const [customers, setCustomers] = useState<EnhancedCustomer[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<EnhancedCustomer | null>(null);
  const [customerStats, setCustomerStats] = useState<CustomerStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState<CustomerSearchFilters>({});

  // =====================================================
  // DATA FETCHING
  // =====================================================

  const searchCustomers = useCallback(async (
    filters: CustomerSearchFilters,
    page: number = 1
  ): Promise<void> => {
    if (!subscription) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add subscription filter
      const enhancedFilters = {
        ...filters,
        // Could add subscription_id filter here if needed
      };

      const response = await CustomerService.searchCustomers(enhancedFilters, page, 50);

      if (page === 1) {
        setCustomers(response.customers);
      } else {
        setCustomers(prev => [...prev, ...response.customers]);
      }

      setTotalCount(response.total_count);
      setHasMore(response.has_more);
      setCurrentPage(page);
      setCurrentFilters(enhancedFilters);

    } catch (err) {
      console.error('Error searching customers:', err);
      setError(err instanceof Error ? err.message : 'Failed to search customers');
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  const getCustomer = useCallback(async (customerId: string): Promise<EnhancedCustomer | null> => {
    try {
      setError(null);
      const customer = await CustomerService.getEnhancedCustomer(customerId);
      setCurrentCustomer(customer);
      return customer;
    } catch (err) {
      console.error('Error fetching customer:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customer');
      return null;
    }
  }, []);

  const refreshCustomers = useCallback(async (): Promise<void> => {
    await searchCustomers(currentFilters, 1);
  }, [searchCustomers, currentFilters]);

  const refreshCustomerStats = useCallback(async (): Promise<void> => {
    if (!subscription) return;

    try {
      setError(null);
      const stats = await CustomerService.getCustomerStats(subscription.id);
      setCustomerStats(stats);
    } catch (err) {
      console.error('Error fetching customer stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customer stats');
    }
  }, [subscription]);

  // =====================================================
  // LIFECYCLE MANAGEMENT
  // =====================================================

  const updateLifecycleStage = useCallback(async (
    customerId: string,
    stage: CustomerLifecycleStage,
    notes?: string
  ): Promise<boolean> => {
    try {
      setError(null);
      const success = await CustomerService.updateLifecycleStage(customerId, stage, notes, 'manual');
      
      if (success) {
        // Update local state
        setCustomers(prev => prev.map(customer => 
          customer.id === customerId 
            ? { ...customer, lifecycle_stage: stage }
            : customer
        ));

        if (currentCustomer?.id === customerId) {
          setCurrentCustomer(prev => prev ? { ...prev, lifecycle_stage: stage } : null);
        }
      }

      return success;
    } catch (err) {
      console.error('Error updating lifecycle stage:', err);
      setError(err instanceof Error ? err.message : 'Failed to update lifecycle stage');
      return false;
    }
  }, [currentCustomer]);

  // =====================================================
  // ANALYTICS
  // =====================================================

  const getCustomerAnalytics = useCallback(async (customerId: string): Promise<CustomerAnalytics | null> => {
    try {
      setError(null);
      return await CustomerService.getCustomerAnalytics(customerId);
    } catch (err) {
      console.error('Error fetching customer analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customer analytics');
      return null;
    }
  }, []);

  const computeCustomerAnalytics = useCallback(async (customerId: string): Promise<CustomerAnalytics | null> => {
    try {
      setError(null);
      return await CustomerService.computeCustomerAnalytics(customerId);
    } catch (err) {
      console.error('Error computing customer analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to compute customer analytics');
      return null;
    }
  }, []);

  // =====================================================
  // PAGINATION
  // =====================================================

  const loadNextPage = useCallback(async (): Promise<void> => {
    if (!hasMore || isLoading) return;
    await searchCustomers(currentFilters, currentPage + 1);
  }, [hasMore, isLoading, searchCustomers, currentFilters, currentPage]);

  const resetPagination = useCallback((): void => {
    setCurrentPage(1);
    setCustomers([]);
    setHasMore(false);
    setTotalCount(0);
  }, []);

  // =====================================================
  // INITIAL DATA LOADING
  // =====================================================

  useEffect(() => {
    if (subscription) {
      // Load initial customer data
      searchCustomers({}, 1);
      refreshCustomerStats();
    }
  }, [subscription]); // Only depend on subscription, not the functions to avoid infinite loops

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // State
    customers,
    currentCustomer,
    customerStats,
    isLoading,
    error,
    totalCount,
    hasMore,
    currentPage,
    
    // Actions
    searchCustomers,
    getCustomer,
    refreshCustomers,
    refreshCustomerStats,
    updateLifecycleStage,
    getCustomerAnalytics,
    computeCustomerAnalytics,
    loadNextPage,
    resetPagination
  };
}

// =====================================================
// SPECIALIZED CUSTOMER HOOKS
// =====================================================

/**
 * Hook for customer lifecycle management
 */
export function useCustomerLifecycle(customerId?: string) {
  const { updateLifecycleStage } = useCustomer();
  const [lifecycleEvents, setLifecycleEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getLifecycleEvents = useCallback(async () => {
    if (!customerId) return;

    try {
      setIsLoading(true);
      // Implementation would fetch lifecycle events
      // For now, return empty array
      setLifecycleEvents([]);
    } catch (error) {
      console.error('Error fetching lifecycle events:', error);
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) {
      getLifecycleEvents();
    }
  }, [customerId, getLifecycleEvents]);

  return {
    lifecycleEvents,
    isLoading,
    updateLifecycleStage,
    refreshLifecycleEvents: getLifecycleEvents
  };
}

/**
 * Hook for customer analytics
 */
export function useCustomerAnalytics(customerId?: string) {
  const [analytics, setAnalytics] = useState<CustomerAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!customerId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await CustomerService.getCustomerAnalytics(customerId);
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  const computeAnalytics = useCallback(async () => {
    if (!customerId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await CustomerService.computeCustomerAnalytics(customerId);
      setAnalytics(data);
    } catch (err) {
      console.error('Error computing analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to compute analytics');
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) {
      fetchAnalytics();
    }
  }, [customerId, fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refreshAnalytics: fetchAnalytics,
    computeAnalytics
  };
}
