import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type DeliveryRoute = Tables<'delivery_routes'> & {
  driver?: {
    user_id: string;
    first_name: string;
    last_name: string;
  } | null;
  deliveries?: Delivery[];
};

export type Delivery = Tables<'deliveries'> & {
  package?: {
    tracking_number: string;
    customer_name: string;
  } | null;
  customer?: {
    first_name: string;
    last_name: string;
    phone?: string;
  } | null;
};

export type DriverAssignment = Tables<'driver_assignments'> & {
  user?: {
    first_name: string;
    last_name: string;
  } | null;
};

export function useRoutes() {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [drivers, setDrivers] = useState<DriverAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const cacheKey = 'prmcms-routes-cache';

  // Load from cache on mount
  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        setRoutes(cachedData.routes || []);
        setDeliveries(cachedData.deliveries || []);
        setDrivers(cachedData.drivers || []);
      } catch (err) {
        console.error('Error parsing cached routes:', err);
        localStorage.removeItem(cacheKey);
      }
    }
  }, []);

  // Save to cache whenever data changes
  useEffect(() => {
    if (routes.length > 0 || deliveries.length > 0 || drivers.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify({ routes, deliveries, drivers }));
    }
  }, [routes, deliveries, drivers]);

  const fetchRoutes = async (date?: Date) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const filterDate = date || new Date();
      const dateString = filterDate.toISOString().split('T')[0];

      // Fetch routes with driver info
      const { data: routesData, error: routesError } = await supabase
        .from('delivery_routes')
        .select('*')
        .eq('date', dateString)
        .order('created_at', { ascending: true });

      if (routesError) throw routesError;

      // Fetch deliveries with package and customer info
      const { data: deliveriesData, error: deliveriesError } = await supabase
        .from('deliveries')
        .select(`
          *,
          package:packages (
            tracking_number,
            customer_name
          ),
          customer:customers (
            first_name,
            last_name,
            phone
          )
        `)
        .order('created_at', { ascending: true });

      if (deliveriesError) throw deliveriesError;

      // Fetch drivers
      const { data: driversData, error: driversError } = await supabase
        .from('driver_assignments')
        .select('*')
        .eq('status', 'active');

      if (driversError) throw driversError;

      // Get driver profiles separately
      const driverIds = driversData?.map(d => d.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', driverIds);

      // Get route drivers separately
      const routeDriverIds = routesData?.map(r => r.driver_id).filter(Boolean) || [];
      const { data: routeProfilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', routeDriverIds);

      // Combine data
      const driversWithProfiles = driversData?.map(driver => ({
        ...driver,
        user: profilesData?.find(p => p.user_id === driver.user_id) || null
      })) || [];

      const routesWithDrivers = routesData?.map(route => ({
        ...route,
        driver: routeProfilesData?.find(p => p.user_id === route.driver_id) || null,
        deliveries: deliveriesData?.filter(delivery => delivery.route_id === route.id) || []
      })) || [];

      setRoutes(routesWithDrivers);
      setDeliveries(deliveriesData || []);
      setDrivers(driversWithProfiles);
      setError(null);

    } catch (err) {
      console.error('Error fetching routes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const createRoute = async (routeData: {
    name: string;
    date: Date;
    driverId?: string;
    estimatedDuration?: number;
  }): Promise<{ success: boolean; error?: string; data?: DeliveryRoute }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('delivery_routes')
        .insert([{
          name: routeData.name,
          date: routeData.date.toISOString().split('T')[0],
          driver_id: routeData.driverId,
          estimated_duration: routeData.estimatedDuration,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const newRoute = { ...data, deliveries: [] };
      setRoutes(prev => [newRoute, ...prev]);

      return { success: true, data: newRoute };
    } catch (err) {
      console.error('Error creating route:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create route' 
      };
    }
  };

  const assignDriverToRoute = async (
    routeId: string,
    driverId: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('delivery_routes')
        .update({
          driver_id: driverId,
          updated_by: user.id
        })
        .eq('id', routeId);

      if (error) throw error;

      // Update local state
      setRoutes(prev => prev.map(route => 
        route.id === routeId 
          ? { ...route, driver_id: driverId }
          : route
      ));

      return { success: true };
    } catch (err) {
      console.error('Error assigning driver:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to assign driver' 
      };
    }
  };

  const addDeliveryToRoute = async (
    packageId: string,
    routeId: string,
    deliveryData: {
      customerId: string;
      address: string;
      city: string;
      zipCode: string;
      zone?: string;
      priority?: number;
      specialInstructions?: string;
      deliveryWindowStart?: string;
      deliveryWindowEnd?: string;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('deliveries')
        .insert([{
          package_id: packageId,
          route_id: routeId,
          customer_id: deliveryData.customerId,
          address_line1: deliveryData.address,
          city: deliveryData.city,
          zip_code: deliveryData.zipCode,
          zone: deliveryData.zone,
          priority: deliveryData.priority || 1,
          special_instructions: deliveryData.specialInstructions,
          delivery_window_start: deliveryData.deliveryWindowStart,
          delivery_window_end: deliveryData.deliveryWindowEnd,
          created_by: user.id
        }]);

      if (error) throw error;

      await fetchRoutes();
      return { success: true };
    } catch (err) {
      console.error('Error adding delivery to route:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to add delivery to route' 
      };
    }
  };

  const updateDeliveryStatus = async (
    deliveryId: string,
    status: string,
    notes?: string,
    proof?: unknown
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const updateData: any = {
        status,
        updated_by: user.id
      };

      if (status === 'delivered') {
        updateData.actual_delivery_time = new Date().toISOString();
      }

      if (notes) {
        updateData.delivery_notes = notes;
      }

      if (proof) {
        updateData.delivery_proof = proof;
      }

      const { error } = await supabase
        .from('deliveries')
        .update(updateData)
        .eq('id', deliveryId);

      if (error) throw error;

      // Update local state
      setDeliveries(prev => prev.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, ...updateData }
          : delivery
      ));

      return { success: true };
    } catch (err) {
      console.error('Error updating delivery status:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update delivery status' 
      };
    }
  };

  const recordDeliveryAttempt = async (
    deliveryId: string,
    status: 'failed' | 'delivered' | 'rescheduled',
    failureReason?: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Get current attempt count
      const delivery = deliveries.find(d => d.id === deliveryId);
      const attemptNumber = (delivery?.attempt_count || 0) + 1;

      // Record the attempt
      const { error: attemptError } = await supabase
        .from('delivery_attempts')
        .insert([{
          delivery_id: deliveryId,
          attempt_number: attemptNumber,
          status,
          failure_reason: failureReason,
          notes,
          driver_id: user.id
        }]);

      if (attemptError) throw attemptError;

      // Update delivery attempt count and status
      const deliveryStatus = status === 'delivered' ? 'delivered' : 
                           status === 'failed' ? 'failed' : 'pending';

      const { error: deliveryError } = await supabase
        .from('deliveries')
        .update({
          attempt_count: attemptNumber,
          status: deliveryStatus,
          updated_by: user.id
        })
        .eq('id', deliveryId);

      if (deliveryError) throw deliveryError;

      await fetchRoutes();
      return { success: true };
    } catch (err) {
      console.error('Error recording delivery attempt:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to record delivery attempt' 
      };
    }
  };

  const optimizeRoute = async (routeId: string): Promise<{ success: boolean; error?: string }> => {
    // Placeholder for route optimization logic
    // In a real implementation, this would use a routing service like Google Maps API
    // or implement a simple algorithm to optimize delivery order
    
    try {
      const route = routes.find(r => r.id === routeId);
      if (!route || !route.deliveries) {
        return { success: false, error: 'Route not found' };
      }

      // Simple optimization: sort by zone, then by priority
      const optimizedOrder = route.deliveries
        .sort((a, b) => {
          if (a.zone !== b.zone) {
            return (a.zone || '').localeCompare(b.zone || '');
          }
          return (b.priority || 1) - (a.priority || 1);
        })
        .map(d => d.id);

      const { error } = await supabase
        .from('delivery_routes')
        .update({
          route_order: optimizedOrder,
          updated_by: user.id
        })
        .eq('id', routeId);

      if (error) throw error;

      await fetchRoutes();
      return { success: true };
    } catch (err) {
      console.error('Error optimizing route:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to optimize route' 
      };
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [user]);

  // Set up real-time updates
  useEffect(() => {
    if (!user) return;

    const routesChannel = supabase
      .channel('routes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'delivery_routes'
        },
        () => fetchRoutes()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deliveries'
        },
        () => fetchRoutes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(routesChannel);
    };
  }, [user]);

  return {
    routes,
    deliveries,
    drivers,
    loading,
    error,
    createRoute,
    assignDriverToRoute,
    addDeliveryToRoute,
    updateDeliveryStatus,
    recordDeliveryAttempt,
    optimizeRoute,
    refetch: fetchRoutes
  };
}