import { useState, useEffect } from 'react';
import { supabase, isSupabaseAvailable } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

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

// Mock data for demo mode
const mockPackages: Package[] = [
  {
    id: '1',
    tracking_number: '1Z999AA1234567890',
    carrier: 'UPS',
    customer_id: '1',
    customer_name: 'Juan Pérez',
    size: 'medium',
    special_handling: false,
    weight: '2.5 lbs',
    dimensions: '12x8x6 in',
    requires_signature: false,
    status: 'Received',
    received_at: new Date().toISOString(),
    delivered_at: null,
    received_by: 'demo-user',
    delivered_by: null,
    notes: 'Demo package',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    tracking_number: '9400100000000000000000',
    carrier: 'USPS',
    customer_id: '2',
    customer_name: 'María González',
    size: 'small',
    special_handling: true,
    weight: '1.2 lbs',
    dimensions: '8x6x4 in',
    requires_signature: true,
    status: 'Ready',
    received_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    delivered_at: null,
    received_by: 'demo-user',
    delivered_by: null,
    notes: 'Fragile items',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);
  const { user } = useAuth();

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

  const fetchPackages = async () => {
    if (!user) return;
    
    // If Supabase is not available, use mock data
    if (!isSupabaseAvailable()) {
      console.log('Using mock packages for demo mode');
      setPackages(mockPackages);
      setLoading(false);
      return;
    }
    
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
  };

  // Process pending sync operations
  const processSyncQueue = async () => {
    if (syncQueue.length === 0 || !isSupabaseAvailable()) return;
    
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
  const executeCreate = async (packageData: any) => {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not available');
    }

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
  const executeUpdate = async (packageId: string, updateData: any) => {
    if (!isSupabaseAvailable()) {
      throw new Error('Supabase not available');
    }

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
      
      // If Supabase is not available, create mock package
      if (!isSupabaseAvailable()) {
        const mockPackage: Package = {
          id: `demo-${Date.now()}`,
          ...newPackageData,
          received_at: new Date().toISOString(),
          delivered_at: null,
          delivered_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Package;
        
        setPackages(prev => [mockPackage, ...prev]);
        console.log('Created mock package:', mockPackage.id);
        return { success: true, data: mockPackage };
      }
      
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
      
      // If Supabase is not available, update mock data
      if (!isSupabaseAvailable()) {
        setPackages(prev => prev.map(pkg => 
          pkg.id === packageId 
            ? { ...pkg, ...updateData }
            : pkg
        ));
        console.log('Updated mock package status');
        return { success: true };
      }
      
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

  const getTodayStats = () => {
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
  };

  useEffect(() => {
    fetchPackages();
  }, [user]);

  // Set up real-time updates only if Supabase is available
  useEffect(() => {
    if (!user || !isSupabaseAvailable()) return;

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

  return {
    packages,
    loading,
    error,
    createPackage,
    updatePackageStatus,
    getPackagesByCustomerId,
    getTodayStats,
    refetch: fetchPackages
  };
}