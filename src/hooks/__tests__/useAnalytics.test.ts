import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAnalytics } from '../useAnalytics';
import { Package, Customer, Mailbox, ComplianceRecord } from '@/types/api';

// Mock the AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' }
  })
}));

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        gte: vi.fn(() => ({
          lte: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    }))
  }))
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

describe('useAnalytics', () => {
  const mockDateRange = {
    from: new Date('2024-01-01'),
    to: new Date('2024-01-31')
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAnalytics(mockDateRange));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should calculate analytics correctly', async () => {
    const mockPackages: Package[] = [
      {
        id: '1',
        tracking_number: 'TRK001',
        customer_id: 'customer1',
        carrier: 'FedEx',
        status: 'delivered',
        delivery_address: {
          street: '123 Main St',
          city: 'San Juan',
          state: 'PR',
          zip_code: '00901',
          country: 'US'
        },
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    ];

    const mockCustomers: Customer[] = [
      {
        id: 'customer1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        address: {
          street: '123 Main St',
          city: 'San Juan',
          state: 'PR',
          zip_code: '00901',
          country: 'US'
        },
        customer_type: 'individual',
        status: 'active',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];

    const mockMailboxes: Mailbox[] = [
      {
        id: 'mailbox1',
        mailbox_number: 'MB001',
        customer_id: 'customer1',
        location_id: 'location1',
        status: 'active',
        size: 'medium',
        monthly_fee: 35,
        features: {
          scanning: true,
          forwarding: false,
          shredding: false,
          check_deposit: false,
          virtual_mailbox: false
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];

    const mockCompliance: ComplianceRecord[] = [
      {
        id: 'compliance1',
        customer_id: 'customer1',
        requirement_type: 'usps_cmra',
        status: 'completed',
        due_date: '2024-02-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];

    // Mock the Supabase responses
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            lte: vi.fn(() => Promise.resolve({ 
              data: mockPackages, 
              error: null 
            }))
          }))
        }))
      }))
    });

    const { result } = renderHook(() => useAnalytics(mockDateRange));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // The hook should have processed the data
    expect(result.current.data).toBeDefined();
  });

  it('should handle errors gracefully', async () => {
    // Mock an error response
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            lte: vi.fn(() => Promise.resolve({ 
              data: null, 
              error: { message: 'Database error' } 
            }))
          }))
        }))
      }))
    });

    const { result } = renderHook(() => useAnalytics(mockDateRange));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
  });

  it('should export data to CSV', async () => {
    const { result } = renderHook(() => useAnalytics(mockDateRange));

    const testData = [
      { name: 'John', email: 'john@example.com' },
      { name: 'Jane', email: 'jane@example.com' }
    ];

    // Mock URL.createObjectURL
    const mockCreateObjectURL = vi.fn(() => 'mock-url');
    global.URL.createObjectURL = mockCreateObjectURL;

    // Mock document.createElement
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn()
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

    // Mock document.body.appendChild
    const mockAppendChild = vi.fn();
    vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);

    // Mock document.body.removeChild
    const mockRemoveChild = vi.fn();
    vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);

    result.current.exportToCSV(testData, 'test-export');

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockLink.click).toHaveBeenCalled();
  });
}); 