import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Wrapper component for testing hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  it('provides authentication context', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('session');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('signUp');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('isAuthenticated');
    expect(result.current).toHaveProperty('loading');
  });

  it('initializes with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('provides login function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.login).toBe('function');
  });

  it('provides signUp function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.signUp).toBe('function');
  });

  it('provides logout function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.logout).toBe('function');
  });
}); 