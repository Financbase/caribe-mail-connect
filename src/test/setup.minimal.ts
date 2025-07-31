import '@testing-library/jest-dom';
import { vi, afterEach, beforeEach } from 'vitest';

// Minimal mocks to reduce memory usage
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      signInWithPassword: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null }))
    }
  }
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Test isolation setup
beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
  document.body.innerHTML = '';
  localStorage.clear();
  sessionStorage.clear();
}); 