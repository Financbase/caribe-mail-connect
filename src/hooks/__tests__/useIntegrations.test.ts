import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useIntegrations } from '../useIntegrations';
import { ApiError } from '@/types/api';

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      order: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  })),
  functions: {
    invoke: vi.fn(() => Promise.resolve({ data: { success: true }, error: null }))
  }
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: vi.fn()
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    data: null,
    isLoading: false,
    error: null,
    reset: vi.fn()
  })),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn()
  }))
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

describe('useIntegrations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useIntegrations());

    expect(result.current.integrations).toEqual([]);
    expect(result.current.integrationLogs).toEqual([]);
    expect(result.current.apiKeys).toEqual([]);
    expect(result.current.webhookEndpoints).toEqual([]);
    expect(result.current.integrationsLoading).toBe(false);
    expect(result.current.logsLoading).toBe(false);
    expect(result.current.apiKeysLoading).toBe(false);
    expect(result.current.webhooksLoading).toBe(false);
  });

  it('should fetch integrations successfully', async () => {
    const mockIntegrations = [
      {
        id: 'integration-1',
        location_id: 'location-1',
        service_type: 'carrier',
        service_name: 'FedEx',
        display_name: 'FedEx Integration',
        configuration: { apiUrl: 'https://api.fedex.com' },
        credentials: { apiKey: 'test-key' },
        is_active: true,
        is_connected: true,
        last_sync_at: '2024-01-15T10:00:00Z',
        last_error: null,
        webhook_url: 'https://prmcms.com/webhooks/fedex',
        webhook_secret: 'secret-123',
        rate_limit_per_minute: 100,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    ];

    // Mock the useQuery to return our test data
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: mockIntegrations,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    });

    const { result } = renderHook(() => useIntegrations());

    expect(result.current.integrations).toEqual(mockIntegrations);
    expect(result.current.integrationsLoading).toBe(false);
  });

  it('should handle integration fetch errors', () => {
    const mockError = new Error('Failed to fetch integrations');

    // Mock the useQuery to return an error
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError,
      refetch: vi.fn()
    });

    const { result } = renderHook(() => useIntegrations());

    expect(result.current.integrationsError).toBe(mockError);
  });

  it('should update integration successfully', async () => {
    const { result } = renderHook(() => useIntegrations());

    const updateData = {
      display_name: 'Updated FedEx Integration',
      is_active: false
    };

    // Mock successful mutation
    const { useMutation } = require('@tanstack/react-query');
    const mockMutate = vi.fn();
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null
    });

    await act(async () => {
      result.current.updateIntegration({ id: 'integration-1', ...updateData });
    });

    expect(mockMutate).toHaveBeenCalledWith({ id: 'integration-1', ...updateData });
  });

  it('should test integration connection', async () => {
    const { result } = renderHook(() => useIntegrations());

    // Mock successful mutation
    const { useMutation } = require('@tanstack/react-query');
    const mockMutate = vi.fn();
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null
    });

    await act(async () => {
      result.current.testConnection('integration-1');
    });

    expect(mockMutate).toHaveBeenCalledWith('integration-1');
  });

  it('should generate API key successfully', async () => {
    const { result } = renderHook(() => useIntegrations());

    const apiKeyData = {
      location_id: 'location-1',
      key_name: 'Test API Key',
      api_secret: null,
      permissions: ['read', 'write'],
      rate_limit_per_minute: 100,
      is_active: true,
      last_used_at: null,
      expires_at: null
    };

    // Mock successful mutation
    const { useMutation } = require('@tanstack/react-query');
    const mockMutate = vi.fn();
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null
    });

    await act(async () => {
      result.current.generateApiKey(apiKeyData);
    });

    expect(mockMutate).toHaveBeenCalledWith(apiKeyData);
  });

  it('should create webhook endpoint successfully', async () => {
    const { result } = renderHook(() => useIntegrations());

    const webhookData = {
      location_id: 'location-1',
      endpoint_name: 'Test Webhook',
      url: 'https://example.com/webhook',
      events: ['order.created', 'order.updated'],
      is_active: true
    };

    // Mock successful mutation
    const { useMutation } = require('@tanstack/react-query');
    const mockMutate = vi.fn();
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null
    });

    await act(async () => {
      result.current.createWebhook(webhookData);
    });

    expect(mockMutate).toHaveBeenCalledWith(webhookData);
  });

  it('should sync integration data', async () => {
    const { result } = renderHook(() => useIntegrations());

    // Mock successful mutation
    const { useMutation } = require('@tanstack/react-query');
    const mockMutate = vi.fn();
    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null
    });

    await act(async () => {
      result.current.syncIntegration('integration-1');
    });

    expect(mockMutate).toHaveBeenCalledWith('integration-1');
  });

  it('should handle mutation errors', async () => {
    const { result } = renderHook(() => useIntegrations());

    const mockError: ApiError = {
      code: 'INTEGRATION_UPDATE_FAILED',
      message: 'Failed to update integration',
      timestamp: new Date().toISOString()
    };

    // Mock mutation with error
    const { useMutation } = require('@tanstack/react-query');
    useMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: mockError
    });

    const { toast } = require('@/hooks/use-toast');

    // Trigger an action that would cause an error
    act(() => {
      result.current.updateIntegration({ id: 'integration-1', display_name: 'Test' });
    });

    // The toast should be called with error message
    expect(toast).toHaveBeenCalledWith({
      title: 'Error updating integration',
      description: mockError.message,
      variant: 'destructive'
    });
  });

  it('should show loading states during operations', () => {
    const { result } = renderHook(() => useIntegrations());

    // Mock loading state
    const { useMutation } = require('@tanstack/react-query');
    useMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null
    });

    expect(result.current.isUpdatingIntegration).toBe(true);
    expect(result.current.isTestingConnection).toBe(true);
    expect(result.current.isGeneratingApiKey).toBe(true);
    expect(result.current.isCreatingWebhook).toBe(true);
    expect(result.current.isSyncingIntegration).toBe(true);
  });

  it('should handle integration logs', () => {
    const mockLogs = [
      {
        id: 'log-1',
        integration_id: 'integration-1',
        request_type: 'sync',
        endpoint: '/api/sync',
        method: 'POST',
        request_data: { syncType: 'full' },
        response_data: { success: true },
        status_code: 200,
        error_message: null,
        execution_time_ms: 1500,
        created_at: '2024-01-15T10:00:00Z'
      }
    ];

    // Mock the useQuery to return logs
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: mockLogs,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    });

    const { result } = renderHook(() => useIntegrations());

    expect(result.current.integrationLogs).toEqual(mockLogs);
    expect(result.current.logsLoading).toBe(false);
  });

  it('should handle API keys data', () => {
    const mockApiKeys = [
      {
        id: 'key-1',
        location_id: 'location-1',
        key_name: 'Test API Key',
        api_key: 'test-api-key-123',
        api_secret: 'test-secret-456',
        permissions: ['read', 'write'],
        rate_limit_per_minute: 100,
        is_active: true,
        last_used_at: '2024-01-15T10:00:00Z',
        expires_at: null,
        created_at: '2024-01-01T00:00:00Z'
      }
    ];

    // Mock the useQuery to return API keys
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: mockApiKeys,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    });

    const { result } = renderHook(() => useIntegrations());

    expect(result.current.apiKeys).toEqual(mockApiKeys);
    expect(result.current.apiKeysLoading).toBe(false);
  });

  it('should handle webhook endpoints data', () => {
    const mockWebhooks = [
      {
        id: 'webhook-1',
        location_id: 'location-1',
        endpoint_name: 'Order Webhook',
        url: 'https://example.com/webhooks/orders',
        secret: 'webhook-secret-123',
        events: ['order.created', 'order.updated'],
        is_active: true,
        last_delivery_at: '2024-01-15T10:00:00Z',
        delivery_attempts: 5,
        created_at: '2024-01-01T00:00:00Z'
      }
    ];

    // Mock the useQuery to return webhooks
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: mockWebhooks,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    });

    const { result } = renderHook(() => useIntegrations());

    expect(result.current.webhookEndpoints).toEqual(mockWebhooks);
    expect(result.current.webhooksLoading).toBe(false);
  });
}); 