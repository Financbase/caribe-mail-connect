import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NotificationRule {
  id: string;
  name: string;
  description?: string;
  location_id?: string;
  is_active: boolean;
  trigger_type: string;
  conditions: Record<string, any>;
  channels: Record<string, boolean>;
  template_id?: string;
  delay_minutes: number;
  schedule_config: Record<string, any>;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  description?: string;
  type: 'email' | 'sms' | 'whatsapp' | 'push';
  language: 'en' | 'es';
  subject?: string;
  content: string;
  variables: string[];
  variant_name: string;
  parent_template_id?: string;
  test_percentage: number;
  is_default: boolean;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationWorkflow {
  id: string;
  name: string;
  description?: string;
  category: 'package' | 'mailbox' | 'payment';
  is_system: boolean;
  steps: any[];
  is_active: boolean;
  location_id?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationAnalytics {
  id: string;
  date: string;
  location_id?: string;
  channel: string;
  total_sent: number;
  total_delivered: number;
  total_failed: number;
  total_opened: number;
  total_clicked: number;
  delivery_rate?: number;
  open_rate?: number;
  click_rate?: number;
  avg_response_time_minutes?: number;
  total_cost_cents: number;
  cost_per_message_cents?: number;
  template_id?: string;
  rule_id?: string;
}

export function useNotificationSystem() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notification rules
  const { data: rules, isLoading: rulesLoading } = useQuery({
    queryKey: ['notification-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as NotificationRule[];
    }
  });

  // Fetch notification templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['notification-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as NotificationTemplate[];
    }
  });

  // Fetch notification workflows
  const { data: workflows, isLoading: workflowsLoading } = useQuery({
    queryKey: ['notification-workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_workflows')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as NotificationWorkflow[];
    }
  });

  // Fetch notification analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['notification-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_analytics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data as NotificationAnalytics[];
    }
  });

  // Create notification rule
  const createRuleMutation = useMutation({
    mutationFn: async (rule: Omit<NotificationRule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('notification_rules')
        .insert([rule])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-rules'] });
      toast({
        title: 'Regla creada',
        description: 'La regla de notificación se ha creado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo crear la regla de notificación',
        variant: 'destructive',
      });
    }
  });

  // Update notification rule
  const updateRuleMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<NotificationRule> }) => {
      const { data, error } = await supabase
        .from('notification_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-rules'] });
      toast({
        title: 'Regla actualizada',
        description: 'La regla de notificación se ha actualizado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la regla de notificación',
        variant: 'destructive',
      });
    }
  });

  // Create notification template
  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('notification_templates')
        .insert([template])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
      toast({
        title: 'Plantilla creada',
        description: 'La plantilla de notificación se ha creado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo crear la plantilla de notificación',
        variant: 'destructive',
      });
    }
  });

  // Update notification template
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<NotificationTemplate> }) => {
      const { data, error } = await supabase
        .from('notification_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
      toast({
        title: 'Plantilla actualizada',
        description: 'La plantilla de notificación se ha actualizado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la plantilla de notificación',
        variant: 'destructive',
      });
    }
  });

  // Delete notification rule
  const deleteRuleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notification_rules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-rules'] });
      toast({
        title: 'Regla eliminada',
        description: 'La regla de notificación se ha eliminado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la regla de notificación',
        variant: 'destructive',
      });
    }
  });

  // Delete notification template
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notification_templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
      toast({
        title: 'Plantilla eliminada',
        description: 'La plantilla de notificación se ha eliminado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la plantilla de notificación',
        variant: 'destructive',
      });
    }
  });

  // Test notification
  const testNotificationMutation = useMutation({
    mutationFn: async ({ templateId, testData }: { templateId: string; testData: any }) => {
      const { data, error } = await supabase.functions.invoke('test-notification', {
        body: { templateId, testData }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Prueba enviada',
        description: 'La notificación de prueba se ha enviado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo enviar la notificación de prueba',
        variant: 'destructive',
      });
    }
  });

  return {
    // Data
    rules: rules || [],
    templates: templates || [],
    workflows: workflows || [],
    analytics: analytics || [],
    
    // Loading states
    rulesLoading,
    templatesLoading,
    workflowsLoading,
    analyticsLoading,
    
    // Mutations
    createRule: createRuleMutation.mutate,
    updateRule: updateRuleMutation.mutate,
    deleteRule: deleteRuleMutation.mutate,
    createTemplate: createTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate,
    testNotification: testNotificationMutation.mutate,
    
    // Loading states for mutations
    isCreatingRule: createRuleMutation.isPending,
    isUpdatingRule: updateRuleMutation.isPending,
    isDeletingRule: deleteRuleMutation.isPending,
    isCreatingTemplate: createTemplateMutation.isPending,
    isUpdatingTemplate: updateTemplateMutation.isPending,
    isDeletingTemplate: deleteTemplateMutation.isPending,
    isTesting: testNotificationMutation.isPending,
  };
}