import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock data for testing
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  role: 'admin' as const,
  tenant_id: 'test-tenant',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockCustomer = {
  id: 'test-customer-id',
  email: 'customer@example.com',
  first_name: 'John',
  last_name: 'Doe',
  address: {
    street: '123 Main St',
    city: 'San Juan',
    state: 'PR',
    zip_code: '00901',
    country: 'US'
  },
  customer_type: 'individual' as const,
  status: 'active' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockPackage = {
  id: 'test-package-id',
  tracking_number: 'TRK001',
  customer_id: 'test-customer-id',
  carrier: 'FedEx',
  status: 'delivered' as const,
  delivery_address: {
    street: '123 Main St',
    city: 'San Juan',
    state: 'PR',
    zip_code: '00901',
    country: 'US'
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authValue?: {
    user: typeof mockUser | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
  };
  languageValue?: {
    language: 'en' | 'es';
    setLanguage: (lang: 'en' | 'es') => void;
  };
}

const AllTheProviders = ({ 
  children, 
  authValue = {
    user: mockUser,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn()
  },
  languageValue = {
    language: 'es' as const,
    setLanguage: vi.fn()
  }
}: { 
  children: React.ReactNode;
  authValue?: CustomRenderOptions['authValue'];
  languageValue?: CustomRenderOptions['languageValue'];
}) => {
  return (
    <AuthProvider value={authValue}>
      <LanguageProvider value={languageValue}>
        {children}
      </LanguageProvider>
    </AuthProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { authValue, languageValue, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders authValue={authValue} languageValue={languageValue}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock functions
export const mockSignIn = vi.fn();
export const mockSignOut = vi.fn();
export const mockSetLanguage = vi.fn();

// Test data factories
export const createMockCustomer = (overrides = {}) => ({
  ...mockCustomer,
  ...overrides
});

export const createMockPackage = (overrides = {}) => ({
  ...mockPackage,
  ...overrides
});

export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides
});

// Common test assertions
export const expectElementToBeInDocument = (element: HTMLElement) => {
  expect(element).toBeInTheDocument();
};

export const expectElementToHaveText = (element: HTMLElement, text: string) => {
  expect(element).toHaveTextContent(text);
};

export const expectElementToHaveClass = (element: HTMLElement, className: string) => {
  expect(element).toHaveClass(className);
};

// Async test helpers
export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(element).not.toBeInTheDocument();
};

export const waitForLoadingToFinish = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
}; 