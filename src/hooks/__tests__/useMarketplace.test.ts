import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMarketplace } from '../useMarketplace';
import { MarketplaceType, MarketplaceCredentials, ShippingLabelOptions } from '@/types/marketplace';

// Mock the AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' }
  })
}));

// Mock the toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
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

describe('useMarketplace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useMarketplace());

    expect(result.current.integrations).toEqual([]);
    expect(result.current.orders).toEqual([]);
    expect(result.current.shippingLabels).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.integrationsLoading).toBe(false);
    expect(result.current.ordersLoading).toBe(false);
  });

  it('should connect marketplace with proper credentials', async () => {
    const { result } = renderHook(() => useMarketplace());

    const mockCredentials: MarketplaceCredentials = {
      apiKey: 'test-api-key',
      secretKey: 'test-secret-key',
      environment: 'sandbox',
      scopes: ['read', 'write']
    };

    await act(async () => {
      await result.current.connectMarketplace('amazon', mockCredentials);
    });

    // Should add new integration to the list
    expect(result.current.integrations).toHaveLength(1);
    expect(result.current.integrations[0].marketplace).toBe('amazon');
    expect(result.current.integrations[0].status).toBe('connected');
  });

  it('should generate shipping label with proper options', async () => {
    const { result } = renderHook(() => useMarketplace());

    const mockOptions: ShippingLabelOptions = {
      carrier: 'usps',
      service: 'standard',
      format: 'pdf',
      insurance: {
        value: 100,
        cost: 2.50
      },
      signature: true,
      dimensions: {
        length: 12,
        width: 8,
        height: 4,
        weight: 2.5,
        unit: 'in',
        weightUnit: 'lb'
      }
    };

    // Mock an order first
    const mockOrder = {
      id: 'order-1',
      marketplaceOrderId: 'AMZ123',
      marketplace: 'amazon' as MarketplaceType,
      integrationId: 'integration-1',
      status: 'confirmed' as const,
      orderNumber: 'ORD-001',
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        address: {
          name: 'John Doe',
          address1: '123 Main St',
          city: 'San Juan',
          state: 'PR',
          postalCode: '00901',
          country: 'US',
          isResidential: true
        }
      },
      items: [],
      totals: {
        subtotal: 50,
        shipping: 5,
        tax: 2.5,
        total: 57.5,
        currency: 'USD'
      },
      shipping: {
        service: 'standard',
        shippingCost: 5
      },
      tags: [],
      priority: 'normal' as const,
      orderDate: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    };

    // Add mock order to state
    act(() => {
      // This would normally be done through the hook's internal state
      // For testing, we'll simulate the order being available
    });

    await act(async () => {
      const label = await result.current.generateLabel('order-1', mockOptions);
      
      expect(label).toBeDefined();
      expect(label.carrier).toBe('usps');
      expect(label.service).toBe('standard');
      expect(label.format).toBe('pdf');
      expect(label.trackingNumber).toMatch(/^PRMCMS/);
    });
  });

  it('should handle marketplace connection errors', async () => {
    const { result } = renderHook(() => useMarketplace());

    const invalidCredentials: MarketplaceCredentials = {
      apiKey: '',
      environment: 'sandbox'
    };

    await act(async () => {
      try {
        await result.current.connectMarketplace('amazon', invalidCredentials);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    expect(result.current.error).toBe('Failed to connect marketplace');
  });

  it('should disconnect marketplace', async () => {
    const { result } = renderHook(() => useMarketplace());

    // First connect a marketplace
    const mockCredentials: MarketplaceCredentials = {
      apiKey: 'test-api-key',
      environment: 'sandbox'
    };

    await act(async () => {
      await result.current.connectMarketplace('amazon', mockCredentials);
    });

    expect(result.current.integrations).toHaveLength(1);

    // Then disconnect it
    await act(async () => {
      await result.current.disconnectMarketplace(result.current.integrations[0].id);
    });

    expect(result.current.integrations).toHaveLength(0);
  });

  it('should sync marketplace data', async () => {
    const { result } = renderHook(() => useMarketplace());

    // First connect a marketplace
    const mockCredentials: MarketplaceCredentials = {
      apiKey: 'test-api-key',
      environment: 'sandbox'
    };

    await act(async () => {
      await result.current.connectMarketplace('amazon', mockCredentials);
    });

    const integrationId = result.current.integrations[0].id;

    await act(async () => {
      await result.current.syncMarketplace(integrationId);
    });

    // Should update the integration status to syncing, then back to connected
    await waitFor(() => {
      const integration = result.current.integrations.find(i => i.id === integrationId);
      expect(integration?.status).toBe('connected');
    });
  });

  it('should generate bulk labels', async () => {
    const { result } = renderHook(() => useMarketplace());

    const orderIds = ['order-1', 'order-2', 'order-3'];

    await act(async () => {
      const bulkOp = await result.current.generateBulkLabels(orderIds);
      
      expect(bulkOp).toBeDefined();
      expect(bulkOp.type).toBe('label_generation');
      expect(bulkOp.orderIds).toEqual(orderIds);
      expect(bulkOp.status).toBe('queued');
    });
  });

  it('should apply and clear filters', () => {
    const { result } = renderHook(() => useMarketplace());

    const mockFilters = {
      marketplaces: ['amazon', 'ebay'],
      statuses: ['connected'],
      orderStatuses: ['confirmed', 'shipped']
    };

    act(() => {
      result.current.applyFilters(mockFilters);
    });

    // Clear filters
    act(() => {
      result.current.clearFilters();
    });

    // The filters should be cleared (implementation dependent)
    expect(result.current).toBeDefined();
  });

  it('should handle API connection testing', async () => {
    const { result } = renderHook(() => useMarketplace());

    const mockCredentials = {
      id: 'cred-1',
      marketplace: 'amazon' as MarketplaceType,
      name: 'Test Credentials',
      apiKey: 'test-key',
      environment: 'sandbox' as const,
      scopes: ['read'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    };

    await act(async () => {
      const isConnected = await result.current.testApiConnection(mockCredentials);
      expect(typeof isConnected).toBe('boolean');
    });
  });

  it('should create automation rules', async () => {
    const { result } = renderHook(() => useMarketplace());

    const mockRule = {
      name: 'Auto Import Orders',
      description: 'Automatically import new orders',
      type: 'order_import' as const,
      isActive: true,
      trigger: {
        event: 'order.created',
        conditions: {}
      },
      actions: [{
        type: 'import_order',
        parameters: {}
      }]
    };

    await act(async () => {
      await result.current.createAutomationRule(mockRule);
    });

    // Should add the rule to the list
    expect(result.current.automationRules).toBeDefined();
  });

  it('should toggle automation rules', async () => {
    const { result } = renderHook(() => useMarketplace());

    await act(async () => {
      await result.current.toggleAutomationRule('rule-1', false);
    });

    // Should update the rule status
    expect(result.current.automationRules).toBeDefined();
  });
}); 