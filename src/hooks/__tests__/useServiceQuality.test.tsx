import { renderHook, waitFor } from '@testing-library/react';
import { useServiceQuality } from '../useServiceQuality';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Supabase client
jest.mock('../../integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        }))
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => Promise.resolve({ data: null, error: null })),
      delete: jest.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useServiceQuality', () => {
  it('returns service quality data structure', () => {
    const { result } = renderHook(() => useServiceQuality(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('metrics');
    expect(result.current).toHaveProperty('complaints');
    expect(result.current).toHaveProperty('compliance');
    expect(result.current).toHaveProperty('initiatives');
    expect(result.current).toHaveProperty('trends');
    expect(result.current).toHaveProperty('errorRates');
    expect(result.current).toHaveProperty('satisfaction');
  });

  it('provides loading states', () => {
    const { result } = renderHook(() => useServiceQuality(), {
      wrapper: createWrapper(),
    });

    expect(result.current.metrics.isLoading).toBeDefined();
    expect(result.current.complaints.isLoading).toBeDefined();
    expect(result.current.compliance.isLoading).toBeDefined();
  });

  it('provides mutation functions', () => {
    const { result } = renderHook(() => useServiceQuality(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('createMetricMutation');
    expect(result.current).toHaveProperty('updateMetricMutation');
    expect(result.current).toHaveProperty('deleteMetricMutation');
    expect(result.current).toHaveProperty('createComplaintMutation');
    expect(result.current).toHaveProperty('updateComplaintMutation');
    expect(result.current).toHaveProperty('deleteComplaintMutation');
  });

  it('handles error states', async () => {
    const { result } = renderHook(() => useServiceQuality(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.metrics.error).toBeDefined();
      expect(result.current.complaints.error).toBeDefined();
      expect(result.current.compliance.error).toBeDefined();
    });
  });

  it('provides data in correct format', async () => {
    const { result } = renderHook(() => useServiceQuality(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(Array.isArray(result.current.metrics.data)).toBe(true);
      expect(Array.isArray(result.current.complaints.data)).toBe(true);
      expect(Array.isArray(result.current.compliance.data)).toBe(true);
    });
  });
}); 