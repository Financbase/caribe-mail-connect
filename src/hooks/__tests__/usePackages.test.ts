import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { ReactNode } from 'react';
import { usePackages } from '../usePackages';

// Setup mock functions first (hoisted for vi.mock)
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockSingle = vi.fn();
const mockChannel = vi.fn();
const mockOn = vi.fn();
const mockSubscribe = vi.fn();
const mockUnsubscribe = vi.fn();
const mockRemoveChannel = vi.fn();

// Mock the AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
  useAuth: () => ({
    user: { id: 'user123', email: 'test@example.com' },
    signIn: vi.fn(),
    signOut: vi.fn(),
    loading: false
  })
}));

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: mockFrom,
    auth: {
      getSession: vi.fn(() => ({
        data: {
          session: {
            user: { id: 'user123' }
          }
        }
      }))
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        download: vi.fn(),
        remove: vi.fn()
      }))
    },
    channel: mockChannel,
    removeChannel: mockRemoveChannel
  }
}));

// Setup chainable mock returns after mocks are declared
mockFrom.mockReturnValue({
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
  eq: mockEq
});

mockSelect.mockReturnValue({
  order: mockOrder,
  single: mockSingle
});

mockInsert.mockReturnValue({
  select: mockSelect
});

mockUpdate.mockReturnValue({
  eq: mockEq
});

mockEq.mockReturnValue({
  select: mockSelect
});

mockOn.mockReturnValue({
  subscribe: mockSubscribe
});

mockChannel.mockReturnValue({
  on: mockOn
});

mockSubscribe.mockReturnValue({
  unsubscribe: mockUnsubscribe
});

describe('usePackages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Reset mock implementations
    mockOrder.mockResolvedValue({ data: [], error: null });
    mockSingle.mockResolvedValue({ data: null, error: null });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Package Retrieval', () => {
    it('should fetch packages on mount', async () => {
      const mockPackages = [
        {
          id: '1',
          tracking_number: 'PKG001',
          carrier: 'USPS',
          customer_id: 'cust1',
          customer_name: 'John Doe',
          status: 'Received',
          received_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          tracking_number: 'PKG002',
          carrier: 'FedEx',
          customer_id: 'cust2',
          customer_name: 'Jane Smith',
          status: 'Ready',
          received_at: '2024-01-02T00:00:00Z',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z'
        }
      ];

      mockOrder.mockResolvedValue({
        data: mockPackages,
        error: null
      });

      const { result } = renderHook(() => usePackages());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.packages).toHaveLength(2);
        expect(result.current.packages[0].tracking_number).toBe('PKG001');
      });
    });

    it('should handle fetch errors', async () => {
      const mockError = { message: 'Failed to fetch packages' };

      mockOrder.mockResolvedValue({
        data: null,
        error: mockError
      });

      const { result } = renderHook(() => usePackages());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Failed to fetch packages');
        expect(result.current.packages).toEqual([]);
      });
    });
  });

  describe('Package Filtering by Customer', () => {
    it('should filter packages by customer ID', async () => {
      const mockPackages = [
        {
          id: '1',
          tracking_number: 'PKG001',
          customer_id: 'cust1',
          customer_name: 'John Doe',
          status: 'Received',
          received_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          tracking_number: 'PKG002',
          customer_id: 'cust2',
          customer_name: 'Jane Smith',
          status: 'Ready',
          received_at: '2024-01-02T00:00:00Z'
        },
        {
          id: '3',
          tracking_number: 'PKG003',
          customer_id: 'cust1',
          customer_name: 'John Doe',
          status: 'Delivered',
          received_at: '2024-01-03T00:00:00Z'
        }
      ];

      mockOrder.mockResolvedValue({
        data: mockPackages,
        error: null
      });

      const { result } = renderHook(() => usePackages());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const customerPackages = result.current.getPackagesByCustomerId('cust1');
      expect(customerPackages).toHaveLength(2);
      expect(customerPackages[0].customer_id).toBe('cust1');
      expect(customerPackages[1].customer_id).toBe('cust1');
    });
  });

  describe('Package Creation', () => {
    it('should create a new package', async () => {
      const newPackage = {
        tracking_number: 'PKG999',
        carrier: 'USPS' as const,
        customer_id: 'cust1',
        customer_name: 'New Customer',
        size: 'medium' as const,
        special_handling: false,
        requires_signature: false
      };

      const mockCreatedPackage = {
        id: '999',
        tracking_number: 'PKG999',
        customer_id: 'cust1',
        customer_name: 'New Customer',
        carrier: 'USPS',
        status: 'Received',
        received_at: new Date().toISOString()
      };

      mockSingle.mockResolvedValue({
        data: mockCreatedPackage,
        error: null
      });

      const { result } = renderHook(() => usePackages());

      let createResult;
      await act(async () => {
        createResult = await result.current.createPackage(newPackage);
      });

      expect(createResult.success).toBe(true);
      expect(createResult.data).toEqual(expect.objectContaining({
        id: '999',
        tracking_number: 'PKG999'
      }));
    });

    it('should handle creation errors', async () => {
      const newPackage = {
        tracking_number: 'PKG999',
        carrier: 'USPS' as const,
        customer_id: 'cust1',
        customer_name: 'New Customer',
        size: 'medium' as const,
        special_handling: false,
        requires_signature: false
      };

      mockSingle.mockRejectedValue(
        new Error('Duplicate tracking number')
      );

      const { result } = renderHook(() => usePackages());

      let createResult;
      await act(async () => {
        createResult = await result.current.createPackage(newPackage);
      });

      expect(createResult.success).toBe(false);
      expect(createResult.error).toContain('queued for sync');
    });
  });

  describe('Package Status Updates', () => {
    it('should update package status', async () => {
      const mockUpdatedPackage = {
        id: '1',
        status: 'Delivered',
        delivered_at: new Date().toISOString(),
        delivered_by: 'user123'
      };

      mockSingle.mockResolvedValue({
        data: mockUpdatedPackage,
        error: null
      });

      const { result } = renderHook(() => usePackages());

      let updateResult;
      await act(async () => {
        updateResult = await result.current.updatePackageStatus('1', 'Delivered');
      });

      expect(updateResult.success).toBe(true);
    });

    it('should handle status update errors', async () => {
      mockSingle.mockRejectedValue(
        new Error('Package not found')
      );

      const { result } = renderHook(() => usePackages());

      let updateResult;
      await act(async () => {
        updateResult = await result.current.updatePackageStatus('999', 'Delivered');
      });

      expect(updateResult.success).toBe(false);
      expect(updateResult.error).toContain('queued for sync');
    });
  });

  describe('Statistics', () => {
    it('should calculate today stats', async () => {
      const today = new Date().toISOString().split('T')[0];
      const mockPackages = [
        {
          id: '1',
          tracking_number: 'PKG001',
          status: 'Received',
          received_at: `${today}T10:00:00Z`
        },
        {
          id: '2',
          tracking_number: 'PKG002',
          status: 'Ready',
          received_at: `${today}T11:00:00Z`
        },
        {
          id: '3',
          tracking_number: 'PKG003',
          status: 'Delivered',
          received_at: '2024-01-01T00:00:00Z'
        }
      ];

      mockOrder.mockResolvedValue({
        data: mockPackages,
        error: null
      });

      const { result } = renderHook(() => usePackages());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const stats = result.current.getTodayStats();
      
      expect(stats.packagesReceived).toBe(2);
      expect(stats.pendingDeliveries).toBe(2);
      expect(stats.totalPackages).toBe(3);
    });
  });
});
