import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Auth from '../pages/Auth';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock Supabase client
jest.mock('../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

// Mock useAuth hook
const mockUseAuth = {
  user: null,
  loading: false,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
};

jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => mockUseAuth,
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

describe('Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Page', () => {
    it('should not have accessibility violations on login form', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations on sign up form', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      // Switch to sign up tab
      const signUpTab = container.querySelector('[role="tab"][aria-label*="Sign Up"]');
      if (signUpTab) {
        signUpTab.click();
      }

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading structure', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
      
      // Check for proper heading hierarchy (no skipped levels)
      for (let i = 1; i < headingLevels.length; i++) {
        expect(headingLevels[i] - headingLevels[i - 1]).toBeLessThanOrEqual(1);
      }
    });

    it('should have proper form labels and associations', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const inputs = container.querySelectorAll('input');
      inputs.forEach(input => {
        const id = input.getAttribute('id');
        const label = container.querySelector(`label[for="${id}"]`);
        
        if (input.type !== 'hidden') {
          expect(label).toBeTruthy();
          expect(label?.textContent).toBeTruthy();
        }
      });
    });

    it('should have proper ARIA attributes', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      // Check tablist structure
      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist).toBeTruthy();

      const tabs = container.querySelectorAll('[role="tab"]');
      const tabpanels = container.querySelectorAll('[role="tabpanel"]');
      
      expect(tabs.length).toBeGreaterThan(0);
      expect(tabpanels.length).toBeGreaterThan(0);
      expect(tabs.length).toBe(tabpanels.length);

      // Check that selected tab has proper attributes
      const selectedTab = container.querySelector('[role="tab"][aria-selected="true"]');
      expect(selectedTab).toBeTruthy();
    });

    it('should have proper color contrast', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      
      expect(results).toHaveNoViolations();
    });

    it('should have proper focus management', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      focusableElements.forEach(element => {
        const tabIndex = element.getAttribute('tabindex');
        if (tabIndex !== '-1') {
          expect(element).toHaveAttribute('tabindex');
        }
      });
    });

    it('should have proper alt text for images', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const images = container.querySelectorAll('img');
      images.forEach(img => {
        const alt = img.getAttribute('alt');
        expect(alt).toBeTruthy();
        expect(alt).not.toBe('');
      });
    });

    it('should have proper button labels', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        const ariaLabel = button.getAttribute('aria-label');
        const textContent = button.textContent?.trim();
        
        // Button should have either visible text or aria-label
        expect(ariaLabel || textContent).toBeTruthy();
      });
    });

    it('should have proper error message associations', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const inputs = container.querySelectorAll('input[aria-invalid="true"]');
      inputs.forEach(input => {
        const id = input.getAttribute('id');
        const errorMessage = container.querySelector(`[aria-describedby*="${id}"]`);
        expect(errorMessage).toBeTruthy();
      });
    });

    it('should have proper language attributes', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const html = container.querySelector('html');
      expect(html).toHaveAttribute('lang');
      
      const lang = html?.getAttribute('lang');
      expect(lang).toMatch(/^(en|es)/);
    });

    it('should have proper skip links', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const skipLinks = container.querySelectorAll('a[href^="#"]');
      let hasSkipLink = false;
      
      skipLinks.forEach(link => {
        const text = link.textContent?.toLowerCase();
        if (text?.includes('skip') || text?.includes('saltar')) {
          hasSkipLink = true;
        }
      });

      // Skip links are optional but recommended
      if (skipLinks.length > 0) {
        expect(hasSkipLink).toBe(true);
      }
    });

    it('should have proper form validation feedback', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const requiredInputs = container.querySelectorAll('input[required]');
      requiredInputs.forEach(input => {
        const ariaRequired = input.getAttribute('aria-required');
        expect(ariaRequired).toBe('true');
      });
    });

    it('should have proper loading states', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const loadingElements = container.querySelectorAll('[aria-busy="true"], [aria-live="polite"]');
      
      // Check that loading states have proper ARIA attributes
      loadingElements.forEach(element => {
        const busy = element.getAttribute('aria-busy');
        const live = element.getAttribute('aria-live');
        
        if (busy === 'true') {
          expect(live).toBe('polite');
        }
      });
    });

    it('should have proper keyboard navigation support', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const interactiveElements = container.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      interactiveElements.forEach(element => {
        const tabIndex = element.getAttribute('tabindex');
        const disabled = element.getAttribute('disabled');
        
        if (disabled !== 'true') {
          expect(tabIndex).not.toBe('-1');
        }
      });
    });

    it('should have proper screen reader support', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const results = await axe(container, {
        rules: {
          'landmark-one-main': { enabled: true },
          'page-has-heading-one': { enabled: true },
          'region': { enabled: true }
        }
      });
      
      expect(results).toHaveNoViolations();
    });
  });

  describe('Mobile Accessibility', () => {
    it('should have proper touch targets', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const touchTargets = container.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
      
      touchTargets.forEach(target => {
        const style = window.getComputedStyle(target);
        const width = parseFloat(style.width);
        const height = parseFloat(style.height);
        
        // Minimum touch target size should be 44x44 pixels
        expect(width).toBeGreaterThanOrEqual(44);
        expect(height).toBeGreaterThanOrEqual(44);
      });
    });

    it('should have proper viewport meta tag', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const viewportMeta = container.querySelector('meta[name="viewport"]');
      expect(viewportMeta).toBeTruthy();
      
      const content = viewportMeta?.getAttribute('content');
      expect(content).toContain('width=device-width');
      expect(content).toContain('initial-scale=1');
    });
  });

  describe('Internationalization Accessibility', () => {
    it('should support RTL languages', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const html = container.querySelector('html');
      const dir = html?.getAttribute('dir');
      
      // Should have dir attribute for RTL support
      expect(dir).toBeTruthy();
      expect(['ltr', 'rtl']).toContain(dir);
    });

    it('should have proper language switching', async () => {
      const { container } = render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const languageButton = container.querySelector('button[aria-label*="language"], button[aria-label*="idioma"]');
      expect(languageButton).toBeTruthy();
      
      const ariaLabel = languageButton?.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });
  });
}); 