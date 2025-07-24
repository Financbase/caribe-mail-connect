import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Integration {
  id: string;
  location_id: string | null;
  service_type: 'carrier' | 'payment' | 'accounting' | 'communication' | 'api';
  service_name: string;
  display_name: string;
  configuration: any;
  credentials: any;
  is_active: boolean;
  is_connected: boolean;
  last_sync_at: string | null;
  last_error: string | null;
  webhook_url: string | null;
  webhook_secret: string | null;
  rate_limit_per_minute: number;
  created_at: string;
  updated_at: string;
}

export interface IntegrationLog {
  id: string;
  integration_id: string;
  request_type: 'sync' | 'webhook' | 'api_call';
  endpoint: string | null;
  method: string | null;
  request_data: any;
  response_data: any;
  status_code: number | null;
  error_message: string | null;
  execution_time_ms: number | null;
  created_at: string;
}

export interface ApiKey {
  id: string;
  location_id: string | null;
  key_name: string;
  api_key: string;
  api_secret: string | null;
  permissions: string[];
  rate_limit_per_minute: number;
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface WebhookEndpoint {
  id: string;
  location_id: string | null;
  endpoint_name: string;
  url: string;
  secret: string;
  events: string[];
  is_active: boolean;
  last_delivery_at: string | null;
  delivery_attempts: number;
  created_at: string;
}

export function useIntegrations() {
  const queryClient = useQueryClient();

  // Fetch integrations
  const {
    data: integrations,
    isLoading: integrationsLoading,
    error: integrationsError,
  } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('service_type', { ascending: true })
        .order('display_name', { ascending: true });

      if (error) throw error;
      return data as Integration[];
    },
  });

  // Fetch integration logs
  const {
    data: integrationLogs,
    isLoading: logsLoading,
    error: logsError,
  } = useQuery({
    queryKey: ['integrationLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integration_logs')
        .select('*, integrations(display_name)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as (IntegrationLog & { integrations: { display_name: string } })[];
    },
  });

  // Fetch API keys
  const {
    data: apiKeys,
    isLoading: apiKeysLoading,
    error: apiKeysError,
  } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ApiKey[];
    },
  });

  // Fetch webhook endpoints
  const {
    data: webhookEndpoints,
    isLoading: webhooksLoading,
    error: webhooksError,
  } = useQuery({
    queryKey: ['webhookEndpoints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_endpoints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WebhookEndpoint[];
    },
  });

  // Update integration mutation
  const updateIntegrationMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Integration> & { id: string }) => {
      const { data, error } = await supabase
        .from('integrations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: 'Integration updated',
        description: 'The integration has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating integration',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Test integration connection
  const testConnectionMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      const { data, error } = await supabase.functions.invoke('test-integration', {
        body: { integrationId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, integrationId) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: 'Connection test completed',
        description: data.success ? 'Connection successful!' : 'Connection failed. Please check your credentials.',
        variant: data.success ? 'default' : 'destructive',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Connection test failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Generate API key mutation
  const generateApiKeyMutation = useMutation({
    mutationFn: async (apiKeyData: Omit<ApiKey, 'id' | 'api_key' | 'created_at'>) => {
      const { data, error } = await supabase.functions.invoke('generate-api-key', {
        body: apiKeyData,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      toast({
        title: 'API key generated',
        description: 'A new API key has been generated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error generating API key',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Create webhook endpoint mutation
  const createWebhookMutation = useMutation({
    mutationFn: async (webhookData: Omit<WebhookEndpoint, 'id' | 'secret' | 'created_at' | 'last_delivery_at' | 'delivery_attempts'>) => {
      const { data, error } = await supabase
        .from('webhook_endpoints')
        .insert([{ ...webhookData, secret: crypto.randomUUID() }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhookEndpoints'] });
      toast({
        title: 'Webhook created',
        description: 'The webhook endpoint has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating webhook',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Sync integration data
  const syncIntegrationMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      const { data, error } = await supabase.functions.invoke('sync-integration', {
        body: { integrationId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['integrationLogs'] });
      toast({
        title: 'Sync completed',
        description: 'Integration data has been synchronized successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Sync failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    // Data
    integrations: integrations || [],
    integrationLogs: integrationLogs || [],
    apiKeys: apiKeys || [],
    webhookEndpoints: webhookEndpoints || [],

    // Loading states
    integrationsLoading,
    logsLoading,
    apiKeysLoading,
    webhooksLoading,

    // Error states
    integrationsError,
    logsError,
    apiKeysError,
    webhooksError,

    // Actions
    updateIntegration: updateIntegrationMutation.mutate,
    testConnection: testConnectionMutation.mutate,
    generateApiKey: generateApiKeyMutation.mutate,
    createWebhook: createWebhookMutation.mutate,
    syncIntegration: syncIntegrationMutation.mutate,

    // Pending states
    isUpdatingIntegration: updateIntegrationMutation.isPending,
    isTestingConnection: testConnectionMutation.isPending,
    isGeneratingApiKey: generateApiKeyMutation.isPending,
    isCreatingWebhook: createWebhookMutation.isPending,
    isSyncingIntegration: syncIntegrationMutation.isPending,
  };
}