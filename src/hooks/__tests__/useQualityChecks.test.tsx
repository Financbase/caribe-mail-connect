import { renderHook, waitFor } from '@testing-library/react';
import { useQualityChecks } from '../useQualityChecks';
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

describe('useQualityChecks', () => {
  it('returns quality checks data structure', () => {
    const { result } = renderHook(() => useQualityChecks(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('checks');
    expect(result.current).toHaveProperty('auditResults');
    expect(result.current).toHaveProperty('photoVerifications');
    expect(result.current).toHaveProperty('deliveryAccuracy');
    expect(result.current).toHaveProperty('dataValidation');
    expect(result.current).toHaveProperty('customerServiceReviews');
  });

  it('provides loading states', () => {
    const { result } = renderHook(() => useQualityChecks(), {
      wrapper: createWrapper(),
    });

    expect(result.current.checks.isLoading).toBeDefined();
    expect(result.current.auditResults.isLoading).toBeDefined();
    expect(result.current.photoVerifications.isLoading).toBeDefined();
  });

  it('provides mutation functions', () => {
    const { result } = renderHook(() => useQualityChecks(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('createCheckMutation');
    expect(result.current).toHaveProperty('updateCheckMutation');
    expect(result.current).toHaveProperty('deleteCheckMutation');
    expect(result.current).toHaveProperty('createAuditResultMutation');
    expect(result.current).toHaveProperty('updateAuditResultMutation');
    expect(result.current).toHaveProperty('deleteAuditResultMutation');
  });

  it('handles error states', async () => {
    const { result } = renderHook(() => useQualityChecks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.checks.error).toBeDefined();
      expect(result.current.auditResults.error).toBeDefined();
      expect(result.current.photoVerifications.error).toBeDefined();
    });
  });

  it('provides data in correct format', async () => {
    const { result } = renderHook(() => useQualityChecks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(Array.isArray(result.current.checks.data)).toBe(true);
      expect(Array.isArray(result.current.auditResults.data)).toBe(true);
      expect(Array.isArray(result.current.photoVerifications.data)).toBe(true);
    });
  });

  it('provides refetch functions', () => {
    const { result } = renderHook(() => useQualityChecks(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.checks.refetch).toBe('function');
    expect(typeof result.current.auditResults.refetch).toBe('function');
    expect(typeof result.current.photoVerifications.refetch).toBe('function');
  });
}); 