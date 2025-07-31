import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ComplianceNotification {
  id: string;
  type: 'deadline' | 'overdue' | 'reminder' | 'certification' | 'audit';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  related_item_id?: string;
  related_item_type?: string;
  due_date?: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  deadline_reminder_days: number;
  certification_reminder_days: number;
  audit_reminder_days: number;
  created_at: string;
  updated_at: string;
}

export const useComplianceNotifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['compliance-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch notification settings
  const { data: notificationSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('compliance_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-notifications'] });
    }
  });

  // Update notification settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<NotificationSettings>) => {
      const { data, error } = await supabase
        .from('notification_settings')
        .upsert(settings)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast({
        title: "Settings updated",
        description: "Your notification settings have been updated.",
      });
    }
  });

  // Generate compliance deadline notifications
  const generateDeadlineNotifications = async () => {
    const { data: checklist, error } = await supabase
      .from('compliance_checklist')
      .select('*')
      .neq('status', 'completed');

    if (error) throw error;

    const today = new Date();
    const notifications = [];

    for (const item of checklist) {
      const dueDate = new Date(item.due_date);
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilDue < 0) {
        // Overdue
        notifications.push({
          type: 'overdue',
          title: `Overdue: ${item.title}`,
          message: `The compliance item "${item.title}" is overdue by ${Math.abs(daysUntilDue)} days.`,
          priority: 'critical',
          related_item_id: item.id,
          related_item_type: 'compliance_checklist',
          due_date: item.due_date
        });
      } else if (daysUntilDue <= 7) {
        // Due within a week
        notifications.push({
          type: 'deadline',
          title: `Deadline Approaching: ${item.title}`,
          message: `The compliance item "${item.title}" is due in ${daysUntilDue} days.`,
          priority: daysUntilDue <= 3 ? 'high' : 'medium',
          related_item_id: item.id,
          related_item_type: 'compliance_checklist',
          due_date: item.due_date
        });
      }
    }

    return notifications;
  };

  // Generate certification expiry notifications
  const generateCertificationNotifications = async () => {
    const { data: certifications, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    const today = new Date();
    const notifications = [];

    for (const cert of certifications) {
      const expiryDate = new Date(cert.expiry_date);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry <= 30) {
        notifications.push({
          type: 'certification',
          title: `Certification Expiring: ${cert.name}`,
          message: `The certification "${cert.name}" expires in ${daysUntilExpiry} days.`,
          priority: daysUntilExpiry <= 7 ? 'high' : 'medium',
          related_item_id: cert.id,
          related_item_type: 'certification',
          due_date: cert.expiry_date
        });
      }
    }

    return notifications;
  };

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Get critical notifications
  const criticalNotifications = notifications.filter(n => n.priority === 'critical' && !n.is_read);

  // Get high priority notifications
  const highPriorityNotifications = notifications.filter(n => n.priority === 'high' && !n.is_read);

  return {
    // Data
    notifications,
    notificationSettings,
    unreadCount,
    criticalNotifications,
    highPriorityNotifications,
    
    // Loading states
    isLoadingNotifications,
    isLoadingSettings,
    
    // Mutations
    markAsRead: markAsReadMutation.mutate,
    updateSettings: updateSettingsMutation.mutate,
    generateDeadlineNotifications,
    generateCertificationNotifications,
    
    // Mutation loading states
    isMarkingAsRead: markAsReadMutation.isPending,
    isUpdatingSettings: updateSettingsMutation.isPending,
  };
}; 