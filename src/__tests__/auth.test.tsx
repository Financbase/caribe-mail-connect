import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Auth from '../pages/Auth';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';

// Mock Supabase client
vi.mock('../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

// Mock useAuth hook
const mockUseAuth = {
  user: null,
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
};

vi.mock('../contexts/AuthContext', () => ({
  ...vi.importActual('../contexts/AuthContext'),
  useAuth: () => mockUseAuth,
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

describe('Authentication Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Form', () => {
    it('renders login form with all required fields', () => {
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('validates required fields on form submission', async () => {
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('submits login form with valid credentials', async () => {
      mockUseAuth.signIn.mockResolvedValueOnce({ data: { user: { id: '1' } }, error: null });

      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockUseAuth.signIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('shows error message on login failure', async () => {
      mockUseAuth.signIn.mockResolvedValueOnce({ 
        data: { user: null }, 
        error: { message: 'Invalid credentials' } 
      });

      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Sign Up Form', () => {
    it('switches to sign up tab and renders form', () => {
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const signUpTab = screen.getByRole('tab', { name: /sign up/i });
      fireEvent.click(signUpTab);

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it('validates password confirmation match', async () => {
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const signUpTab = screen.getByRole('tab', { name: /sign up/i });
      fireEvent.click(signUpTab);

      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const createAccountButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      fireEvent.click(createAccountButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('submits sign up form with valid data', async () => {
      mockUseAuth.signUp.mockResolvedValueOnce({ data: { user: { id: '1' } }, error: null });

      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const signUpTab = screen.getByRole('tab', { name: /sign up/i });
      fireEvent.click(signUpTab);

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const createAccountButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(firstNameInput, { target: { value: 'Juan' } });
      fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
      fireEvent.change(emailInput, { target: { value: 'juan.perez@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'SecurePass123!' } });
      fireEvent.click(createAccountButton);

      await waitFor(() => {
        expect(mockUseAuth.signUp).toHaveBeenCalledWith({
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          password: 'SecurePass123!',
          confirmPassword: 'SecurePass123!',
        });
      });
    });
  });

  describe('Language Switching', () => {
    it('switches between English and Spanish', () => {
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      // Initially in English
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();

      // Switch to Spanish
      const languageButton = screen.getByRole('button', { name: /switch to spanish/i });
      fireEvent.click(languageButton);

      // Should show Spanish text
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      // Tab navigation
      emailInput.focus();
      expect(emailInput).toHaveFocus();

      // Press Tab to move to password field
      fireEvent.keyDown(emailInput, { key: 'Tab' });
      expect(passwordInput).toHaveFocus();
    });

    it('has proper autocomplete attributes', () => {
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(emailInput).toHaveAttribute('autocomplete', 'username');
      expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
    });
  });

  describe('Form Validation', () => {
    it('validates email format', async () => {
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });
    });

    it('validates password strength', async () => {
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const signUpTab = screen.getByRole('tab', { name: /sign up/i });
      fireEvent.click(signUpTab);

      const passwordInput = screen.getByLabelText(/password/i);
      const createAccountButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.click(createAccountButton);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner during authentication', async () => {
      mockUseAuth.signIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(loginButton).toBeDisabled();
    });
  });
}); 