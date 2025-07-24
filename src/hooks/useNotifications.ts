import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface NotificationHookResult {
  notifications: any[];
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export function useNotifications(): NotificationHookResult {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscriptions for package events
    const packagesChannel = supabase
      .channel('package-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'packages'
        },
        (payload) => {
          console.log('New package received:', payload);
          
          // Show toast notification
          toast({
            title: 'New Package Received',
            description: `Package ${payload.new.tracking_number} for ${payload.new.customer_name}`,
          });

          // Add to notifications list
          const notification = {
            id: `pkg-${payload.new.id}`,
            type: 'package_received',
            title: 'New Package Received',
            message: `Package ${payload.new.tracking_number} received for ${payload.new.customer_name}`,
            timestamp: new Date().toISOString(),
            read: false,
            data: payload.new
          };

          setNotifications(prev => [notification, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'packages'
        },
        (payload) => {
          console.log('Package status updated:', payload);
          
          // Only notify for status changes to delivered
          if (payload.new.status === 'Delivered' && payload.old.status !== 'Delivered') {
            toast({
              title: 'Package Delivered',
              description: `Package ${payload.new.tracking_number} has been delivered`,
            });

            const notification = {
              id: `pkg-delivered-${payload.new.id}`,
              type: 'package_delivered',
              title: 'Package Delivered',
              message: `Package ${payload.new.tracking_number} has been delivered to ${payload.new.customer_name}`,
              timestamp: new Date().toISOString(),
              read: false,
              data: payload.new
            };

            setNotifications(prev => [notification, ...prev]);
          }
        }
      )
      .subscribe();

    // Set up customer change notifications
    const customersChannel = supabase
      .channel('customer-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'customers'
        },
        (payload) => {
          console.log('New customer added:', payload);
          
          toast({
            title: 'New Customer Added',
            description: `${payload.new.first_name} ${payload.new.last_name} has been added`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(packagesChannel);
      supabase.removeChannel(customersChannel);
    };
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    markAsRead,
    clearAll
  };
}