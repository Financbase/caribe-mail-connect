import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeOptions {
  table: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  onUpdate?: (data: any[]) => void;
  onError?: (error: any) => void;
}

interface RealTimeDataReturn<T> {
  data: T[];
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
  subscribe: () => void;
  unsubscribe: () => void;
}

export const useRealTimeData = <T = any>({
  table,
  filters,
  orderBy,
  limit,
  onUpdate,
  onError
}: RealTimeOptions): RealTimeDataReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table).select('*');

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { 
          ascending: orderBy.ascending !== false 
        });
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const { data: result, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setData(result || []);
      onUpdate?.(result || []);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setError(err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [table, filters, orderBy, limit, onUpdate, onError]);

  const handleRealtimeUpdate = useCallback((payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    setData(currentData => {
      let updatedData = [...currentData];

      switch (eventType) {
        case 'INSERT':
          updatedData = [newRecord, ...updatedData];
          break;
        case 'UPDATE':
          updatedData = updatedData.map(item => 
            (item as any).id === newRecord.id ? newRecord : item
          );
          break;
        case 'DELETE':
          updatedData = updatedData.filter(item => 
            (item as any).id !== oldRecord.id
          );
          break;
      }

      // Apply limit if specified
      if (limit && updatedData.length > limit) {
        updatedData = updatedData.slice(0, limit);
      }

      onUpdate?.(updatedData);
      return updatedData;
    });
  }, [limit, onUpdate]);

  const subscribe = useCallback(() => {
    if (subscription) {
      subscription.unsubscribe();
    }

    const newSubscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table },
        handleRealtimeUpdate
      )
      .subscribe();

    setSubscription(newSubscription);
  }, [table, handleRealtimeUpdate, subscription]);

  const unsubscribe = useCallback(() => {
    if (subscription) {
      subscription.unsubscribe();
      setSubscription(null);
    }
  }, [subscription]);

  useEffect(() => {
    fetchData();
    subscribe();

    return () => {
      unsubscribe();
    };
  }, [fetchData, subscribe, unsubscribe]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    subscribe,
    unsubscribe
  };
};

// Specialized hooks for common use cases
export const usePartners = () => {
  return useRealTimeData({
    table: 'business_partners',
    orderBy: { column: 'name', ascending: true }
  });
};

export const useSustainability = () => {
  return useRealTimeData({
    table: 'carbon_footprint',
    orderBy: { column: 'date', ascending: false },
    limit: 10
  });
};

export const usePartnerAnalytics = () => {
  return useRealTimeData({
    table: 'partner_analytics',
    orderBy: { column: 'created_at', ascending: false },
    limit: 20
  });
};

export const useGreenInitiatives = () => {
  return useRealTimeData({
    table: 'green_initiatives',
    orderBy: { column: 'created_at', ascending: false }
  });
};

// Real-time notifications hook
export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const notificationSubscription = supabase
      .channel('notifications')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const newNotification = payload.new;
          setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
          
          // Show browser notification if supported
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('PRMCMS', {
              body: newNotification.message,
              icon: '/favicon.ico'
            });
          }
        }
      )
      .subscribe();

    return () => {
      notificationSubscription.unsubscribe();
    };
  }, []);

  return notifications;
};

// Real-time activity feed hook
export const useActivityFeed = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const activitySubscription = supabase
      .channel('activity_feed')
      .on('postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          const activity = {
            id: `${payload.table}-${Date.now()}`,
            table: payload.table,
            event: payload.eventType,
            timestamp: new Date().toISOString(),
            data: payload.new || payload.old
          };

          setActivities(prev => [activity, ...prev.slice(0, 49)]);
        }
      )
      .subscribe();

    return () => {
      activitySubscription.unsubscribe();
    };
  }, []);

  return activities;
}; 