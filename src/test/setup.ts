import '@testing-library/jest-dom';
import { vi, afterEach, beforeEach } from 'vitest';

// Mock import.meta.env for Vite
(global as any).import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'test-key',
      VITE_GOOGLE_MAPS_API_KEY: 'test-google-maps-key'
    }
  }
};

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    })),
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      signInWithPassword: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null }))
    }
  }
}));

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: null,
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
  QueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn()
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children
}));

// Mock Capacitor
vi.mock('@capacitor/camera', () => ({
  Camera: {
    getPhoto: vi.fn(() => Promise.resolve({ webPath: 'test-image.jpg' }))
  }
}));

vi.mock('@capacitor/device', () => ({
  Device: {
    getInfo: vi.fn(() => Promise.resolve({ platform: 'web' }))
  }
}));

vi.mock('@capacitor/network', () => ({
  Network: {
    getStatus: vi.fn(() => Promise.resolve({ connected: true }))
  }
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Test isolation setup
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
  
  // Reset DOM
  document.body.innerHTML = '';
  
  // Clear any stored data
  localStorage.clear();
  sessionStorage.clear();
  
  // Reset fetch mock
  global.fetch = vi.fn();
});

afterEach(() => {
  // Clean up after each test
  vi.clearAllMocks();
  
  // Clear timers
  vi.clearAllTimers();
  
  // Reset DOM
  document.body.innerHTML = '';
  
  // Clear any stored data
  localStorage.clear();
  sessionStorage.clear();
});

// Global test utilities
export const createTestId = (component: string, testName: string) => 
  `test-${component}-${testName}`.toLowerCase().replace(/\s+/g, '-');

export const waitForElementToBeRemoved = (element: Element | null) => {
  return new Promise<void>((resolve) => {
    if (!element) {
      resolve();
      return;
    }
    
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect();
        resolve();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}; 