import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Location = Tables<'locations'>;
export type LocationInsert = TablesInsert<'locations'>;
export type LocationStaff = Tables<'location_staff'>;
export type PackageTransfer = Tables<'package_transfers'>;

export interface LocationFormData {
  name: string;
  code: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone?: string;
  email?: string;
  is_primary?: boolean;
  status: Location['status'];
  operating_hours?: Record<string, any>;
  services_offered?: string[];
  pricing_tier?: string;
  notes?: string;
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Cache management
  const cacheKey = 'prmcms-locations-cache';
  const currentLocationKey = 'prmcms-current-location';

  // Load from cache on mount
  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    const cachedLocation = localStorage.getItem(currentLocationKey);
    
    if (cached) {
      try {
        const cachedLocations = JSON.parse(cached);
        setLocations(cachedLocations);
        console.log('Loaded locations from cache:', cachedLocations.length);
      } catch (err) {
        console.error('Error parsing cached locations:', err);
        localStorage.removeItem(cacheKey);
      }
    }

    if (cachedLocation) {
      try {
        const location = JSON.parse(cachedLocation);
        setCurrentLocation(location);
      } catch (err) {
        console.error('Error parsing cached current location:', err);
        localStorage.removeItem(currentLocationKey);
      }
    }
  }, []);

  // Save to cache whenever locations change
  useEffect(() => {
    if (locations.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify(locations));
    }
  }, [locations]);

  // Save current location to cache
  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem(currentLocationKey, JSON.stringify(currentLocation));
    }
  }, [currentLocation]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('locations')
        .select('*')
        .order('is_primary', { ascending: false })
        .order('name');

      if (fetchError) throw fetchError;

      setLocations(data || []);
      
      // Set current location to primary if not set
      if (!currentLocation && data && data.length > 0) {
        const primary = data.find(loc => loc.is_primary) || data[0];
        setCurrentLocation(primary);
      }

      console.log('Fetched locations:', data?.length);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  const createLocation = async (locationData: LocationFormData) => {
    try {
      setError(null);
      
      const { data, error: insertError } = await supabase
        .from('locations')
        .insert([{
          ...locationData,
          created_by: user?.id
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      setLocations(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating location:', err);
      setError(err instanceof Error ? err.message : 'Failed to create location');
      throw err;
    }
  };

  const updateLocation = async (locationId: string, locationData: Partial<LocationFormData>) => {
    try {
      setError(null);
      
      const { data, error: updateError } = await supabase
        .from('locations')
        .update({
          ...locationData,
          updated_by: user?.id
        })
        .eq('id', locationId)
        .select()
        .single();

      if (updateError) throw updateError;

      setLocations(prev => prev.map(loc => 
        loc.id === locationId ? data : loc
      ));

      // Update current location if it was updated
      if (currentLocation?.id === locationId) {
        setCurrentLocation(data);
      }

      return data;
    } catch (err) {
      console.error('Error updating location:', err);
      setError(err instanceof Error ? err.message : 'Failed to update location');
      throw err;
    }
  };

  const switchLocation = (location: Location) => {
    setCurrentLocation(location);
    console.log('Switched to location:', location.name);
  };

  const getLocationById = (id: string) => {
    return locations.find(location => location.id === id);
  };

  const getPrimaryLocation = () => {
    return locations.find(location => location.is_primary);
  };

  const getActiveLocations = () => {
    return locations.filter(location => location.status === 'active');
  };

  const transferPackage = async (packageId: string, fromLocationId: string, toLocationId: string, reason: string, notes?: string) => {
    try {
      setError(null);
      
      const { data, error: transferError } = await supabase
        .from('package_transfers')
        .insert([{
          package_id: packageId,
          from_location_id: fromLocationId,
          to_location_id: toLocationId,
          transfer_reason: reason,
          notes,
          initiated_by: user?.id
        }])
        .select()
        .single();

      if (transferError) throw transferError;

      return data;
    } catch (err) {
      console.error('Error transferring package:', err);
      setError(err instanceof Error ? err.message : 'Failed to transfer package');
      throw err;
    }
  };

  // Fetch locations when user is available
  useEffect(() => {
    if (user) {
      fetchLocations();
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('locations-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'locations' },
        () => {
          console.log('Locations changed, refetching...');
          fetchLocations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    locations,
    currentLocation,
    loading,
    error,
    createLocation,
    updateLocation,
    switchLocation,
    getLocationById,
    getPrimaryLocation,
    getActiveLocations,
    transferPackage,
    refetch: fetchLocations
  };
}