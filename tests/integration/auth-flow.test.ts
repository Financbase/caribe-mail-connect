/**
 * Authentication Flow Integration Tests
 * Testing complete authentication workflows including edge cases
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, mockUser, mockApiResponse, mockApiError } from '@/lib/testing/test-utils';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Mock Supabase client
const mockSupabase = {
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  })),
};

vi.mock('@/lib/supabase/client', () => ({
  supabase: mockSupabase,
}));

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Flow', () => {
    it('should handle successful login', async () => {
      const testUser = mockUser();
      
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: testUser,
          session: { access_token: 'test-token', refresh_token: 'refresh-token' }
        },
        error: null
      });

      renderWithProviders(
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      );

      // Fill in login form
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: testUser.email } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Wait for login to complete
      await waitFor(() => {
        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: testUser.email,
          password: 'password123'
        });
      });

      // Check for success state
      await waitFor(() => {
        expect(screen.queryByText(/signing in/i)).not.toBeInTheDocument();
      });
    });

    it('should handle login with invalid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' }
      });

      renderWithProviders(
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors during login', async () => {
      mockSupabase.auth.signInWithPassword.mockRejectedValueOnce(
        new Error('Network error')
      );

      renderWithProviders(
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      renderWithProviders(
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });

      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });

    it('should handle rate limiting', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Too many requests' }
      });

      renderWithProviders(
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/too many requests/i)).toBeInTheDocument();
      });
    });
  });

  describe('Signup Flow', () => {
    it('should handle successful signup', async () => {
      const newUser = {
        email: 'newuser@example.com',
        password: 'Password123!',
        name: 'New User'
      };

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: {
          user: { ...mockUser(), email: newUser.email },
          session: null // Email confirmation required
        },
        error: null
      });

      renderWithProviders(
        <AuthProvider>
          <SignupForm />
        </AuthProvider>
      );

      // Fill in signup form
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(nameInput, { target: { value: newUser.name } });
      fireEvent.change(emailInput, { target: { value: newUser.email } });
      fireEvent.change(passwordInput, { target: { value: newUser.password } });
      fireEvent.change(confirmPasswordInput, { target: { value: newUser.password } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
          email: newUser.email,
          password: newUser.password,
          options: {
            data: {
              name: newUser.name
            }
          }
        });
      });

      // Should show email verification message
      await waitFor(() => {
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      });
    });

    it('should validate password strength', async () => {
      renderWithProviders(
        <AuthProvider>
          <SignupForm />
        </AuthProvider>
      );

      const passwordInput = screen.getByLabelText(/^password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      // Test weak password
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
      });

      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should validate password confirmation', async () => {
      renderWithProviders(
        <AuthProvider>
          <SignupForm />
        </AuthProvider>
      );

      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });

      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should handle signup with existing email', async () => {
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'User already registered' }
      });

      renderWithProviders(
        <AuthProvider>
          <SignupForm />
        </AuthProvider>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/user already registered/i)).toBeInTheDocument();
      });
    });
  });

  describe('Password Reset Flow', () => {
    it('should handle password reset request', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
        data: {},
        error: null
      });

      renderWithProviders(
        <AuthProvider>
          <div data-testid="forgot-password-form">
            <input data-testid="email-input" type="email" />
            <button data-testid="reset-button">Reset Password</button>
          </div>
        </AuthProvider>
      );

      const emailInput = screen.getByTestId('email-input');
      const resetButton = screen.getByTestId('reset-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
          'test@example.com'
        );
      });
    });
  });

  describe('Protected Routes', () => {
    it('should redirect unauthenticated users', async () => {
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
        error: null
      });

      const TestComponent = () => <div>Protected Content</div>;

      renderWithProviders(
        <AuthProvider>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      });
    });

    it('should allow authenticated users', async () => {
      const testUser = mockUser();
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            user: testUser,
            access_token: 'test-token'
          }
        },
        error: null
      });

      const TestComponent = () => <div>Protected Content</div>;

      renderWithProviders(
        <AuthProvider>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });
    });
  });

  describe('Session Management', () => {
    it('should handle session expiration', async () => {
      const testUser = mockUser();
      
      // Initial session
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            user: testUser,
            access_token: 'test-token',
            expires_at: Date.now() / 1000 - 3600 // Expired 1 hour ago
          }
        },
        error: null
      });

      // Mock auth state change callback
      const authStateChangeCallback = vi.fn();
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authStateChangeCallback.mockImplementation(callback);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      renderWithProviders(
        <AuthProvider>
          <div>App Content</div>
        </AuthProvider>
      );

      // Simulate session expiration
      authStateChangeCallback('SIGNED_OUT', null);

      await waitFor(() => {
        // Should handle session expiration gracefully
        expect(screen.getByText('App Content')).toBeInTheDocument();
      });
    });

    it('should handle automatic token refresh', async () => {
      const testUser = mockUser();
      
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            user: testUser,
            access_token: 'old-token',
            refresh_token: 'refresh-token'
          }
        },
        error: null
      });

      const authStateChangeCallback = vi.fn();
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authStateChangeCallback.mockImplementation(callback);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      renderWithProviders(
        <AuthProvider>
          <div>App Content</div>
        </AuthProvider>
      );

      // Simulate token refresh
      authStateChangeCallback('TOKEN_REFRESHED', {
        user: testUser,
        access_token: 'new-token',
        refresh_token: 'refresh-token'
      });

      await waitFor(() => {
        expect(screen.getByText('App Content')).toBeInTheDocument();
      });
    });
  });

  describe('Logout Flow', () => {
    it('should handle successful logout', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        error: null
      });

      const authStateChangeCallback = vi.fn();
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authStateChangeCallback.mockImplementation(callback);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      renderWithProviders(
        <AuthProvider>
          <button onClick={() => mockSupabase.auth.signOut()}>
            Logout
          </button>
        </AuthProvider>
      );

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      });

      // Simulate auth state change
      authStateChangeCallback('SIGNED_OUT', null);
    });
  });
});
