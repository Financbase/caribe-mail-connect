import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type IotDevice = Tables<'iot_devices'>;
export type PackageTrackingEvent = Tables<'package_tracking_events'>;
export type SensorReading = Tables<'sensor_readings'>;
export type DeliveryRoute = Tables<'delivery_routes'>;
export type RoutePackage = Tables<'route_packages'>;
export type IotAlert = Tables<'iot_alerts'>;
export type WebhookConfig = Tables<'webhook_configs'>;

export interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: Date;
}

export interface EnvironmentalData {
  temperature?: number;
  humidity?: number;
  shock_events: Array<{
    timestamp: Date;
    level: number;
    location?: LocationData;
  }>;
  thresholds?: {
    max_temperature?: number;
    min_temperature?: number;
    max_humidity?: number;
    max_shock?: number;
  };
}

export interface TrackingEvent {
  id: string;
  event_type: 'location_update' | 'status_change' | 'environmental_alert' | 'shock_detected' | 'temperature_alert' | 'delivery_milestone';
  event_data: any;
  location?: LocationData;
  timestamp: Date;
  device_id?: string;
  handler_id?: string;
  notes?: string;
}

export interface ChainOfCustodyEntry {
  timestamp: Date;
  handler_id: string;
  handler_name: string;
  action: string;
  location?: LocationData;
  notes?: string;
}

export interface PackageJourney {
  package_id: string;
  tracking_number: string;
  current_location: LocationData;
  estimated_delivery?: Date;
  status: string;
  events: TrackingEvent[];
  environmental_data: EnvironmentalData;
  chain_of_custody: ChainOfCustodyEntry[];
  qr_code?: string;
}

export function useIotTracking() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<IotDevice[]>([]);
  const [alerts, setAlerts] = useState<IotAlert[]>([]);
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Real-time tracking state
  const [activeTrackings, setActiveTrackings] = useState<Map<string, PackageJourney>>(new Map());
  const trackingIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const eventSource = useRef<EventSource | null>(null);

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchDevices();
      fetchAlerts();
      fetchRoutes();
      fetchWebhooks();
      setupRealtimeSubscription();
    }
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all tracking intervals
      trackingIntervals.current.forEach(interval => clearInterval(interval));
      trackingIntervals.current.clear();
      
      // Close event source
      if (eventSource.current) {
        eventSource.current.close();
      }
    };
  }, []);

  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('iot_devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (err) {
      console.error('Error fetching IoT devices:', err);
      setError('Failed to fetch IoT devices');
    }
  };

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('iot_alerts')
        .select(`
          *,
          packages (tracking_number, customer_name),
          iot_devices (device_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAlerts(data || []);
    } catch (err) {
      console.error('Error fetching IoT alerts:', err);
      setError('Failed to fetch alerts');
    }
  };

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_routes')
        .select(`
          *,
          route_packages (
            *,
            packages (tracking_number, customer_name, current_location)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoutes(data || []);
    } catch (err) {
      console.error('Error fetching delivery routes:', err);
      setError('Failed to fetch routes');
    }
  };

  const fetchWebhooks = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (err) {
      console.error('Error fetching webhooks:', err);
      setError('Failed to fetch webhooks');
    }
  };

  const setupRealtimeSubscription = () => {
    // Subscribe to real-time updates
    const packageTrackingSubscription = supabase
      .channel('package_tracking_events')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'package_tracking_events' },
        (payload) => {
          const event = payload.new as PackageTrackingEvent;
          updatePackageJourney(event.package_id, event);
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'packages' },
        (payload) => {
          const packageData = payload.new as any;
          if (packageData.tracking_enabled) {
            updatePackageLocation(packageData.id, packageData.current_location);
          }
        }
      )
      .subscribe();

    const alertsSubscription = supabase
      .channel('iot_alerts')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'iot_alerts' },
        (payload) => {
          const alert = payload.new as IotAlert;
          setAlerts(prev => [alert, ...prev.slice(0, 49)]);
        }
      )
      .subscribe();

    return () => {
      packageTrackingSubscription.unsubscribe();
      alertsSubscription.unsubscribe();
    };
  };

  const startTracking = useCallback(async (packageId: string) => {
    try {
      // Fetch package journey data
      const { data: packageData, error: packageError } = await supabase
        .from('packages')
        .select(`
          *,
          package_tracking_events (*),
          iot_devices (*)
        `)
        .eq('id', packageId)
        .single();

      if (packageError) throw packageError;

      // Fetch recent tracking events
      const { data: events, error: eventsError } = await supabase
        .from('package_tracking_events')
        .select('*')
        .eq('package_id', packageId)
        .order('timestamp', { ascending: true });

      if (eventsError) throw eventsError;

      // Create journey object
      const journey: PackageJourney = {
        package_id: packageId,
        tracking_number: packageData.tracking_number,
        current_location: packageData.current_location || { lat: 0, lng: 0 },
        estimated_delivery: packageData.estimated_delivery,
        status: packageData.status,
        events: events || [],
        environmental_data: packageData.environmental_data || { shock_events: [] },
        chain_of_custody: packageData.chain_of_custody || [],
        qr_code: packageData.qr_code
      };

      setActiveTrackings(prev => new Map(prev.set(packageId, journey)));

      // Start simulation if tracking is enabled
      if (packageData.tracking_enabled) {
        startTrackingSimulation(packageId, journey);
      }

      return journey;
    } catch (err) {
      console.error('Error starting tracking:', err);
      throw err;
    }
  }, []);

  const stopTracking = useCallback((packageId: string) => {
    // Clear tracking interval
    const interval = trackingIntervals.current.get(packageId);
    if (interval) {
      clearInterval(interval);
      trackingIntervals.current.delete(packageId);
    }

    // Remove from active trackings
    setActiveTrackings(prev => {
      const newMap = new Map(prev);
      newMap.delete(packageId);
      return newMap;
    });
  }, []);

  const startTrackingSimulation = useCallback((packageId: string, journey: PackageJourney) => {
    // Clear existing interval
    const existingInterval = trackingIntervals.current.get(packageId);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Start new simulation interval
    const interval = setInterval(() => {
      simulatePackageMovement(packageId, journey);
    }, 5000); // Update every 5 seconds

    trackingIntervals.current.set(packageId, interval);
  }, []);

  const simulatePackageMovement = useCallback(async (packageId: string, journey: PackageJourney) => {
    try {
      // Simulate location movement (Puerto Rico coordinates)
      const currentLocation = journey.current_location;
      const newLocation: LocationData = {
        lat: currentLocation.lat + (Math.random() - 0.5) * 0.001, // Small random movement
        lng: currentLocation.lng + (Math.random() - 0.5) * 0.001,
        accuracy: Math.floor(Math.random() * 10) + 5,
        timestamp: new Date()
      };

      // Simulate environmental readings
      const temperature = 20 + Math.random() * 15; // 20-35°C
      const humidity = 60 + Math.random() * 30; // 60-90%
      const shockLevel = Math.random() > 0.95 ? Math.random() * 20 : 0; // 5% chance of shock

      // Update package location
      await updatePackageLocation(packageId, newLocation);

      // Add environmental reading
      if (journey.environmental_data.shock_events.length < 10) {
        await addEnvironmentalReading(packageId, {
          temperature,
          humidity,
          shock_level: shockLevel
        });
      }

      // Simulate random events
      if (Math.random() > 0.98) { // 2% chance of event
        await simulateRandomEvent(packageId, journey);
      }

      // Update journey
      journey.current_location = newLocation;
      setActiveTrackings(prev => new Map(prev.set(packageId, journey)));

    } catch (err) {
      console.error('Error simulating package movement:', err);
    }
  }, []);

  const simulateRandomEvent = useCallback(async (packageId: string, journey: PackageJourney) => {
    const events = [
      { type: 'shock_detected', data: { level: Math.random() * 15 + 5 } },
      { type: 'temperature_alert', data: { temperature: 35 + Math.random() * 10 } },
      { type: 'delivery_milestone', data: { milestone: 'Out for delivery' } }
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    
    await addTrackingEvent(packageId, randomEvent.type as any, randomEvent.data);
  }, []);

  const updatePackageLocation = useCallback(async (packageId: string, location: LocationData) => {
    try {
      const { error } = await supabase
        .rpc('update_package_location', {
          p_package_id: packageId,
          p_lat: location.lat,
          p_lng: location.lng,
          p_accuracy: location.accuracy || 0
        });

      if (error) throw error;

      // Update active tracking
      setActiveTrackings(prev => {
        const journey = prev.get(packageId);
        if (journey) {
          journey.current_location = location;
          return new Map(prev.set(packageId, journey));
        }
        return prev;
      });

    } catch (err) {
      console.error('Error updating package location:', err);
    }
  }, []);

  const addTrackingEvent = useCallback(async (
    packageId: string, 
    eventType: PackageTrackingEvent['event_type'], 
    eventData: any,
    location?: LocationData
  ) => {
    try {
      const { data, error } = await supabase
        .rpc('add_tracking_event', {
          p_package_id: packageId,
          p_event_type: eventType,
          p_event_data: eventData,
          p_location: location,
          p_handler_id: user?.id
        });

      if (error) throw error;

      // Update active tracking
      setActiveTrackings(prev => {
        const journey = prev.get(packageId);
        if (journey) {
          const newEvent: TrackingEvent = {
            id: data,
            event_type: eventType,
            event_data: eventData,
            location,
            timestamp: new Date(),
            handler_id: user?.id
          };
          journey.events.push(newEvent);
          return new Map(prev.set(packageId, journey));
        }
        return prev;
      });

      return data;
    } catch (err) {
      console.error('Error adding tracking event:', err);
      throw err;
    }
  }, [user]);

  const addEnvironmentalReading = useCallback(async (
    packageId: string, 
    reading: { temperature?: number; humidity?: number; shock_level?: number }
  ) => {
    try {
      const device = devices.find(d => d.assigned_package_id === packageId);
      if (!device) return;

      const readings = [];
      
      if (reading.temperature !== undefined) {
        readings.push({
          device_id: device.id,
          package_id: packageId,
          reading_type: 'temperature',
          value: reading.temperature,
          unit: 'celsius',
          timestamp: new Date().toISOString()
        });
      }

      if (reading.humidity !== undefined) {
        readings.push({
          device_id: device.id,
          package_id: packageId,
          reading_type: 'humidity',
          value: reading.humidity,
          unit: 'percent',
          timestamp: new Date().toISOString()
        });
      }

      if (reading.shock_level !== undefined && reading.shock_level > 0) {
        readings.push({
          device_id: device.id,
          package_id: packageId,
          reading_type: 'shock',
          value: reading.shock_level,
          unit: 'g',
          timestamp: new Date().toISOString()
        });

        // Add to shock events
        setActiveTrackings(prev => {
          const journey = prev.get(packageId);
          if (journey) {
            journey.environmental_data.shock_events.push({
              timestamp: new Date(),
              level: reading.shock_level!,
              location: journey.current_location
            });
            return new Map(prev.set(packageId, journey));
          }
          return prev;
        });
      }

      if (readings.length > 0) {
        const { error } = await supabase
          .from('sensor_readings')
          .insert(readings);

        if (error) throw error;
      }

    } catch (err) {
      console.error('Error adding environmental reading:', err);
    }
  }, [devices]);

  const updatePackageJourney = useCallback((packageId: string, event: PackageTrackingEvent) => {
    setActiveTrackings(prev => {
      const journey = prev.get(packageId);
      if (journey) {
        const newEvent: TrackingEvent = {
          id: event.id,
          event_type: event.event_type,
          event_data: event.event_data,
          location: event.location,
          timestamp: new Date(event.timestamp),
          device_id: event.device_id,
          handler_id: event.handler_id,
          notes: event.notes
        };
        journey.events.push(newEvent);
        return new Map(prev.set(packageId, journey));
      }
      return prev;
    });
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('iot_alerts')
        .update({
          acknowledged_by: user?.id,
          acknowledged_at: new Date().toISOString(),
          status: 'acknowledged'
        })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged_by: user?.id, acknowledged_at: new Date().toISOString(), status: 'acknowledged' }
            : alert
        )
      );
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    }
  }, [user]);

  const resolveAlert = useCallback(async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('iot_alerts')
        .update({
          resolved_by: user?.id,
          resolved_at: new Date().toISOString(),
          status: 'resolved'
        })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, resolved_by: user?.id, resolved_at: new Date().toISOString(), status: 'resolved' }
            : alert
        )
      );
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  }, [user]);

  const createWebhook = useCallback(async (webhookData: Omit<WebhookConfig, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('webhook_configs')
        .insert({
          ...webhookData,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setWebhooks(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating webhook:', err);
      throw err;
    }
  }, [user]);

  const updateWebhook = useCallback(async (webhookId: string, updates: Partial<WebhookConfig>) => {
    try {
      const { data, error } = await supabase
        .from('webhook_configs')
        .update(updates)
        .eq('id', webhookId)
        .select()
        .single();

      if (error) throw error;

      setWebhooks(prev => 
        prev.map(webhook => 
          webhook.id === webhookId ? data : webhook
        )
      );

      return data;
    } catch (err) {
      console.error('Error updating webhook:', err);
      throw err;
    }
  }, []);

  const deleteWebhook = useCallback(async (webhookId: string) => {
    try {
      const { error } = await supabase
        .from('webhook_configs')
        .delete()
        .eq('id', webhookId);

      if (error) throw error;

      setWebhooks(prev => prev.filter(webhook => webhook.id !== webhookId));
    } catch (err) {
      console.error('Error deleting webhook:', err);
      throw err;
    }
  }, []);

  return {
    // State
    devices,
    alerts,
    routes,
    webhooks,
    activeTrackings: Array.from(activeTrackings.values()),
    loading,
    error,

    // Actions
    startTracking,
    stopTracking,
    updatePackageLocation,
    addTrackingEvent,
    addEnvironmentalReading,
    acknowledgeAlert,
    resolveAlert,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    fetchDevices,
    fetchAlerts,
    fetchRoutes,
    fetchWebhooks
  };
} 