import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PackageService } from '@/services/package';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import type {
  EnhancedPackage,
  PackageStatus,
  PackageSearchFilters,
  PackageListResponse,
  PackageStatsResponse,
  CreatePackageRequest,
  UpdatePackageRequest
} from '@/types/package';

export type Package = Tables<'packages'>;
export type PackageInsert = TablesInsert<'packages'>;

export interface PackageFormData {
  tracking_number: string;
  carrier: Package['carrier'];
  customer_id: string;
  customer_name: string;
  size: Package['size'];
  special_handling: boolean;
  weight?: string;
  dimensions?: string;
  requires_signature: boolean;
  notes?: string;
}

// Enhanced package management state
interface UsePackagesState {
  packages: EnhancedPackage[];
  stats: PackageStatsResponse | null;
  isLoading: boolean;
  error: string | null;
  filters: PackageSearchFilters;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    hasMore: boolean;
  };
}

// Enhanced package management actions
interface UsePackagesActions {
  // Package CRUD operations
  createPackage: (request: CreatePackageRequest) => Promise<{ success: boolean; package?: EnhancedPackage; error?: string }>;
  updatePackage: (packageId: string, request: UpdatePackageRequest) => Promise<{ success: boolean; error?: string }>;
  updatePackageStatus: (packageId: string, status: PackageStatus, notes?: string) => Promise<{ success: boolean; error?: string }>;
  deletePackage: (packageId: string) => Promise<{ success: boolean; error?: string }>;

  // Package search and filtering
  searchPackages: (filters: PackageSearchFilters) => Promise<void>;
  clearFilters: () => void;
  setPage: (page: number) => void;

  // Package analytics
  refreshStats: () => Promise<void>;
  getPackageAnalytics: (startDate: string, endDate: string) => Promise<any>;

  // Package tracking
  getPackageHistory: (packageId: string) => Promise<any[]>;
  addTrackingEvent: (packageId: string, event: any) => Promise<{ success: boolean; error?: string }>;

  // Photo and document management
  uploadPackagePhotos: (packageId: string, photos: File[]) => Promise<{ success: boolean; error?: string }>;
  uploadPackageDocuments: (packageId: string, documents: File[]) => Promise<{ success: boolean; error?: string }>;

  // Utility functions
  refetch: () => Promise<void>;
  getPackagesByCustomerId: (customerId: string) => EnhancedPackage[];
  getTodayStats: () => { packagesReceived: number; pendingDeliveries: number; totalPackages: number };
}

export function usePackages(): UsePackagesState & UsePackagesActions {
  const { user } = useAuth();
  const { subscription } = useSubscription();

  // Enhanced state management
  const [packages, setPackages] = useState<EnhancedPackage[]>([]);
  const [stats, setStats] = useState<PackageStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PackageSearchFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    totalCount: 0,
    hasMore: false
  });

  // Legacy state for backward compatibility
  const [loading, setLoading] = useState(true);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);

  // Cache management
  const cacheKey = 'prmcms-packages-cache';
  const queueKey = 'prmcms-sync-queue';

  // Load from cache on mount
  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const cachedPackages = JSON.parse(cached);
        setPackages(cachedPackages);
        console.log('Loaded packages from cache:', cachedPackages.length);
      } catch (err) {
        console.error('Error parsing cached packages:', err);
        localStorage.removeItem(cacheKey);
      }
    }

    const queuedOperations = localStorage.getItem(queueKey);
    if (queuedOperations) {
      try {
        setSyncQueue(JSON.parse(queuedOperations));
      } catch (err) {
        console.error('Error parsing sync queue:', err);
        localStorage.removeItem(queueKey);
      }
    }
  }, []);

  // Save to cache whenever packages change
  useEffect(() => {
    if (packages.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify(packages));
      console.log('Cached packages:', packages.length);
    }
  }, [packages]);

  // Save sync queue to localStorage
  useEffect(() => {
    localStorage.setItem(queueKey, JSON.stringify(syncQueue));
  }, [syncQueue]);

  const fetchPackages = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Fetching packages from database...');

      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          customers (
            first_name,
            last_name,
            mailbox_number
          )
        `)
        .order('received_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched packages:', data?.length || 0);
      setPackages(data || []);
      setError(null);

      // Process sync queue after successful fetch
      await processSyncQueue();

    } catch (err) {
      console.error('Error fetching packages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch packages');

      // If offline, use cached data
      if (err instanceof Error && err.message.includes('fetch')) {
        console.log('Using cached packages due to network error');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Process pending sync operations
  const processSyncQueue = async () => {
    if (syncQueue.length === 0) return;
    
    console.log('Processing sync queue:', syncQueue.length, 'operations');
    const processed = [];
    
    for (const operation of syncQueue) {
      try {
        switch (operation.type) {
          case 'create':
            await executeCreate(operation.data);
            break;
          case 'update':
            await executeUpdate(operation.packageId, operation.data);
            break;
        }
        processed.push(operation);
      } catch (err) {
        console.error('Failed to sync operation:', operation, err);
        // Keep failed operations in queue for next attempt
      }
    }
    
    // Remove successfully processed operations
    setSyncQueue(prev => prev.filter(op => !processed.includes(op)));
  };
  // Execute create operation
  const executeCreate = async (packageData: unknown) => {
    const { data, error } = await supabase
      .from('packages')
      .insert([packageData])
      .select(`
        *,
        customers (
          first_name,
          last_name,
          mailbox_number
        )
      `)
      .single();

    if (error) throw error;
    return data;
  };

  // Execute update operation
  const executeUpdate = async (packageId: string, updateData: unknown) => {
    const { data, error } = await supabase
      .from('packages')
      .update(updateData)
      .eq('id', packageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const createPackage = async (packageData: PackageFormData): Promise<{ success: boolean; error?: string; data?: Package }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const newPackageData = {
      ...packageData,
      received_by: user.id,
      status: 'Received' as const
    };

    try {
      console.log('Creating package:', packageData.tracking_number);
      const data = await executeCreate(newPackageData);
      
      // Update local state immediately
      setPackages(prev => [data, ...prev]);
      
      console.log('Package created successfully:', data.id);
      return { success: true, data };
      
    } catch (err) {
      console.error('Error creating package:', err);
      
      // Queue for offline sync
      const operation = {
        id: Date.now().toString(),
        type: 'create',
        data: newPackageData,
        timestamp: new Date().toISOString()
      };
      
      setSyncQueue(prev => [...prev, operation]);
      
      // Create optimistic update with temp ID
      const optimisticPackage = {
        id: `temp-${Date.now()}`,
        ...newPackageData,
        received_at: new Date().toISOString(),
        delivered_at: null,
        delivered_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Package;
      
      setPackages(prev => [optimisticPackage, ...prev]);
      
      return { 
        success: false, 
        error: 'Package queued for sync when online',
        data: optimisticPackage
      };
    }
  };

  const updatePackageStatus = async (
    packageId: string, 
    status: Package['status']
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const updateData: any = { status };
    
    // Add delivered timestamp and user if status is delivered
    if (status === 'Delivered') {
      updateData.delivered_at = new Date().toISOString();
      updateData.delivered_by = user.id;
    }

    try {
      console.log('Updating package status:', packageId, status);
      await executeUpdate(packageId, updateData);
      
      // Update local state
      setPackages(prev => prev.map(pkg => 
        pkg.id === packageId 
          ? { ...pkg, ...updateData }
          : pkg
      ));

      console.log('Package status updated successfully');
      return { success: true };
      
    } catch (err) {
      console.error('Error updating package status:', err);
      
      // Queue for offline sync
      const operation = {
        id: Date.now().toString(),
        type: 'update',
        packageId,
        data: updateData,
        timestamp: new Date().toISOString()
      };
      
      setSyncQueue(prev => [...prev, operation]);
      
      // Optimistic update
      setPackages(prev => prev.map(pkg => 
        pkg.id === packageId 
          ? { ...pkg, ...updateData }
          : pkg
      ));

      return { 
        success: false, 
        error: 'Update queued for sync when online'
      };
    }
  };

  const getPackagesByCustomerId = (customerId: string): Package[] => {
    return packages.filter(pkg => pkg.customer_id === customerId);
  };

  const getTodayStats = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayPackages = packages.filter(pkg =>
      pkg.received_at.startsWith(today)
    );

    return {
      packagesReceived: todayPackages.length,
      pendingDeliveries: packages.filter(pkg =>
        pkg.status === 'Ready' || pkg.status === 'Received'
      ).length,
      totalPackages: packages.length
    };
  }, [packages]);

  useEffect(() => {
    fetchPackages();
  }, [user]);

  // Set up real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('packages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'packages'
        },
        (payload) => {
          console.log('Package change received:', payload);
          // Refresh packages on any change
          fetchPackages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // =====================================================
  // ENHANCED PACKAGE MANAGEMENT FUNCTIONS
  // =====================================================

  const createEnhancedPackage = useCallback(async (request: CreatePackageRequest) => {
    if (!subscription) return { success: false, error: 'No active subscription' };

    try {
      setError(null);
      setIsLoading(true);

      const result = await PackageService.createPackage(request);

      if (result.success && result.package) {
        setPackages(prev => [result.package!, ...prev]);
        await refreshStats();
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create package';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  const updateEnhancedPackage = useCallback(async (packageId: string, request: UpdatePackageRequest) => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('packages')
        .update(request)
        .eq('id', packageId);

      if (updateError) throw updateError;

      // Update local state
      setPackages(prev => prev.map(pkg =>
        pkg.id === packageId ? { ...pkg, ...request } : pkg
      ));

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update package';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateEnhancedPackageStatus = useCallback(async (
    packageId: string,
    status: PackageStatus,
    notes?: string
  ) => {
    try {
      setError(null);

      const result = await PackageService.updatePackageStatus(packageId, status, notes);

      if (result.success) {
        // Update local state
        setPackages(prev => prev.map(pkg =>
          pkg.id === packageId ? { ...pkg, status } : pkg
        ));
        await refreshStats();
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update package status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const searchPackages = useCallback(async (searchFilters: PackageSearchFilters) => {
    if (!subscription) return;

    try {
      setIsLoading(true);
      setError(null);
      setFilters(searchFilters);

      const result = await PackageService.getPackages(
        subscription.id,
        searchFilters,
        pagination.page,
        pagination.pageSize
      );

      setPackages(result.packages);
      setPagination(prev => ({
        ...prev,
        totalCount: result.total_count,
        hasMore: result.has_more
      }));

    } catch (err) {
      console.error('Error searching packages:', err);
      setError(err instanceof Error ? err.message : 'Failed to search packages');
    } finally {
      setIsLoading(false);
    }
  }, [subscription, pagination.page, pagination.pageSize]);

  const refreshStats = useCallback(async () => {
    if (!subscription) return;

    try {
      const statsData = await PackageService.getPackageStats(subscription.id);
      setStats(statsData);
    } catch (err) {
      console.error('Error refreshing stats:', err);
    }
  }, [subscription]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // =====================================================
  // RETURN ENHANCED HOOK INTERFACE
  // =====================================================

  return {
    // Enhanced state
    packages,
    stats,
    isLoading,
    error,
    filters,
    pagination,

    // Enhanced actions
    createPackage: createEnhancedPackage,
    updatePackage: updateEnhancedPackage,
    updatePackageStatus: updateEnhancedPackageStatus,
    deletePackage: async () => ({ success: false, error: 'Not implemented' }),
    searchPackages,
    clearFilters,
    setPage,
    refreshStats,
    getPackageAnalytics: async () => null,
    getPackageHistory: async () => [],
    addTrackingEvent: async () => ({ success: false, error: 'Not implemented' }),
    uploadPackagePhotos: async () => ({ success: false, error: 'Not implemented' }),
    uploadPackageDocuments: async () => ({ success: false, error: 'Not implemented' }),

    // Legacy compatibility
    loading,
    getPackagesByCustomerId,
    getTodayStats,
    refetch: fetchPackages
  };
}