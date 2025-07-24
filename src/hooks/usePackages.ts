import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPackages = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('received_at', { ascending: false });

      if (error) throw error;

      setPackages(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const createPackage = async (packageData: PackageFormData): Promise<{ success: boolean; error?: string; data?: Package }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('packages')
        .insert([{
          ...packageData,
          received_by: user.id,
          status: 'Received'
        }])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setPackages(prev => [data, ...prev]);
      
      return { success: true, data };
    } catch (err) {
      console.error('Error creating package:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create package' 
      };
    }
  };

  const updatePackageStatus = async (
    packageId: string, 
    status: Package['status']
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const updateData: any = { status };
      
      // Add delivered timestamp and user if status is delivered
      if (status === 'Delivered') {
        updateData.delivered_at = new Date().toISOString();
        updateData.delivered_by = user.id;
      }

      const { error } = await supabase
        .from('packages')
        .update(updateData)
        .eq('id', packageId);

      if (error) throw error;

      // Update local state
      setPackages(prev => prev.map(pkg => 
        pkg.id === packageId 
          ? { ...pkg, ...updateData }
          : pkg
      ));

      return { success: true };
    } catch (err) {
      console.error('Error updating package status:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update package status' 
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