/**
 * Communication Management Hook
 * Story 1.3: Unified Communication System
 * 
 * React hook for managing multi-channel communications with customer preferences,
 * templates, workflows, and analytics
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { CommunicationService } from '@/services/communication';
import { supabase } from '@/integrations/supabase/client';
import type { 
  CommunicationTemplate,
  CommunicationWorkflow,
  CommunicationExecution,
  CommunicationAnalytics,
  SendCommunicationRequest,
  SendCommunicationResponse,
  CommunicationChannel,
  CommunicationType
} from '@/types/communication';

// =====================================================
// COMMUNICATION HOOK TYPES
// =====================================================

interface UseCommunicationState {
  templates: CommunicationTemplate[];
  workflows: CommunicationWorkflow[];
  recentCommunications: CommunicationExecution[];
  analytics: CommunicationAnalytics | null;
  isLoading: boolean;
  error: string | null;
}

interface UseCommunicationActions {
  // Communication sending
  sendCommunication: (request: SendCommunicationRequest) => Promise<SendCommunicationResponse>;
  
  // Template management
  getTemplates: (filters?: TemplateFilters) => Promise<void>;
  createTemplate: (template: Partial<CommunicationTemplate>) => Promise<CommunicationTemplate | null>;
  updateTemplate: (templateId: string, updates: Partial<CommunicationTemplate>) => Promise<boolean>;
  deleteTemplate: (templateId: string) => Promise<boolean>;
  
  // Workflow management
  getWorkflows: () => Promise<void>;
  createWorkflow: (workflow: Partial<CommunicationWorkflow>) => Promise<CommunicationWorkflow | null>;
  updateWorkflow: (workflowId: string, updates: Partial<CommunicationWorkflow>) => Promise<boolean>;
  deleteWorkflow: (workflowId: string) => Promise<boolean>;
  
  // Communication history
  getCommunicationHistory: (filters?: CommunicationFilters) => Promise<void>;
  
  // Analytics
  getAnalytics: (startDate: string, endDate: string) => Promise<void>;
  refreshAnalytics: () => Promise<void>;
}

interface TemplateFilters {
  category?: string;
  type?: CommunicationType;
  channel?: CommunicationChannel;
  language?: 'en' | 'es';
  is_active?: boolean;
}

interface CommunicationFilters {
  customer_id?: string;
  channel?: CommunicationChannel;
  type?: CommunicationType;
  status?: string;
  start_date?: string;
  end_date?: string;
}

// =====================================================
// MAIN COMMUNICATION HOOK
// =====================================================

export function useCommunication(): UseCommunicationState & UseCommunicationActions {
  const { subscription } = useSubscription();
  
  // State
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [workflows, setWorkflows] = useState<CommunicationWorkflow[]>([]);
  const [recentCommunications, setRecentCommunications] = useState<CommunicationExecution[]>([]);
  const [analytics, setAnalytics] = useState<CommunicationAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // COMMUNICATION SENDING
  // =====================================================

  const sendCommunication = useCallback(async (request: SendCommunicationRequest): Promise<SendCommunicationResponse> => {
    try {
      setError(null);
      return await CommunicationService.sendCommunication(request);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send communication';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // =====================================================
  // TEMPLATE MANAGEMENT
  // =====================================================

  const getTemplates = useCallback(async (filters: TemplateFilters = {}): Promise<void> => {
    if (!subscription) return;

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('communication_templates')
        .select('*')
        .eq('subscription_id', subscription.id);

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.channel) {
        query = query.eq('channel', filters.channel);
      }
      if (filters.language) {
        query = query.eq('language', filters.language);
      }
      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch templates');
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  const createTemplate = useCallback(async (template: Partial<CommunicationTemplate>): Promise<CommunicationTemplate | null> => {
    if (!subscription) return null;

    try {
      setError(null);

      const { data, error } = await supabase
        .from('communication_templates')
        .insert({
          ...template,
          subscription_id: subscription.id
        })
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => [data, ...prev]);
      return data as CommunicationTemplate;
    } catch (err) {
      console.error('Error creating template:', err);
      setError(err instanceof Error ? err.message : 'Failed to create template');
      return null;
    }
  }, [subscription]);

  const updateTemplate = useCallback(async (templateId: string, updates: Partial<CommunicationTemplate>): Promise<boolean> => {
    try {
      setError(null);

      const { error } = await supabase
        .from('communication_templates')
        .update(updates)
        .eq('id', templateId);

      if (error) throw error;

      setTemplates(prev => prev.map(template => 
        template.id === templateId ? { ...template, ...updates } : template
      ));

      return true;
    } catch (err) {
      console.error('Error updating template:', err);
      setError(err instanceof Error ? err.message : 'Failed to update template');
      return false;
    }
  }, []);

  const deleteTemplate = useCallback(async (templateId: string): Promise<boolean> => {
    try {
      setError(null);

      const { error } = await supabase
        .from('communication_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      setTemplates(prev => prev.filter(template => template.id !== templateId));
      return true;
    } catch (err) {
      console.error('Error deleting template:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete template');
      return false;
    }
  }, []);

  // =====================================================
  // WORKFLOW MANAGEMENT
  // =====================================================

  const getWorkflows = useCallback(async (): Promise<void> => {
    if (!subscription) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('communication_workflows')
        .select('*')
        .eq('subscription_id', subscription.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWorkflows(data || []);
    } catch (err) {
      console.error('Error fetching workflows:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows');
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  const createWorkflow = useCallback(async (workflow: Partial<CommunicationWorkflow>): Promise<CommunicationWorkflow | null> => {
    if (!subscription) return null;

    try {
      setError(null);

      const { data, error } = await supabase
        .from('communication_workflows')
        .insert({
          ...workflow,
          subscription_id: subscription.id
        })
        .select()
        .single();

      if (error) throw error;

      setWorkflows(prev => [data, ...prev]);
      return data as CommunicationWorkflow;
    } catch (err) {
      console.error('Error creating workflow:', err);
      setError(err instanceof Error ? err.message : 'Failed to create workflow');
      return null;
    }
  }, [subscription]);

  const updateWorkflow = useCallback(async (workflowId: string, updates: Partial<CommunicationWorkflow>): Promise<boolean> => {
    try {
      setError(null);

      const { error } = await supabase
        .from('communication_workflows')
        .update(updates)
        .eq('id', workflowId);

      if (error) throw error;

      setWorkflows(prev => prev.map(workflow => 
        workflow.id === workflowId ? { ...workflow, ...updates } : workflow
      ));

      return true;
    } catch (err) {
      console.error('Error updating workflow:', err);
      setError(err instanceof Error ? err.message : 'Failed to update workflow');
      return false;
    }
  }, []);

  const deleteWorkflow = useCallback(async (workflowId: string): Promise<boolean> => {
    try {
      setError(null);

      const { error } = await supabase
        .from('communication_workflows')
        .delete()
        .eq('id', workflowId);

      if (error) throw error;

      setWorkflows(prev => prev.filter(workflow => workflow.id !== workflowId));
      return true;
    } catch (err) {
      console.error('Error deleting workflow:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete workflow');
      return false;
    }
  }, []);

  // =====================================================
  // COMMUNICATION HISTORY
  // =====================================================

  const getCommunicationHistory = useCallback(async (filters: CommunicationFilters = {}): Promise<void> => {
    if (!subscription) return;

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('customer_communications')
        .select(`
          *,
          customer:customers(first_name, last_name, email)
        `)
        .eq('subscription_id', subscription.id);

      // Apply filters
      if (filters.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }
      if (filters.channel) {
        query = query.eq('channel', filters.channel);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.start_date) {
        query = query.gte('created_at', filters.start_date);
      }
      if (filters.end_date) {
        query = query.lte('created_at', filters.end_date);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setRecentCommunications(data || []);
    } catch (err) {
      console.error('Error fetching communication history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch communication history');
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  // =====================================================
  // ANALYTICS
  // =====================================================

  const getAnalytics = useCallback(async (startDate: string, endDate: string): Promise<void> => {
    if (!subscription) return;

    try {
      setIsLoading(true);
      setError(null);

      const analyticsData = await CommunicationService.getAnalytics(subscription.id, startDate, endDate);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  const refreshAnalytics = useCallback(async (): Promise<void> => {
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // Last 30 days
    await getAnalytics(startDate, endDate);
  }, [getAnalytics]);

  // =====================================================
  // INITIAL DATA LOADING
  // =====================================================

  useEffect(() => {
    if (subscription) {
      getTemplates();
      getWorkflows();
      getCommunicationHistory();
      refreshAnalytics();
    }
  }, [subscription]); // Only depend on subscription to avoid infinite loops

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // State
    templates,
    workflows,
    recentCommunications,
    analytics,
    isLoading,
    error,
    
    // Actions
    sendCommunication,
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    getCommunicationHistory,
    getAnalytics,
    refreshAnalytics
  };
}

// =====================================================
// SPECIALIZED COMMUNICATION HOOKS
// =====================================================

/**
 * Hook for template management
 */
export function useTemplates() {
  const { templates, getTemplates, createTemplate, updateTemplate, deleteTemplate, isLoading, error } = useCommunication();

  return {
    templates,
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    isLoading,
    error
  };
}

/**
 * Hook for workflow management
 */
export function useWorkflows() {
  const { workflows, getWorkflows, createWorkflow, updateWorkflow, deleteWorkflow, isLoading, error } = useCommunication();

  return {
    workflows,
    getWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    isLoading,
    error
  };
}

/**
 * Hook for communication analytics
 */
export function useCommunicationAnalytics() {
  const { analytics, getAnalytics, refreshAnalytics, isLoading, error } = useCommunication();

  return {
    analytics,
    getAnalytics,
    refreshAnalytics,
    isLoading,
    error
  };
}
