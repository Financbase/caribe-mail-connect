import { Page } from '@playwright/test';

/**
 * Mock authentication utilities for E2E testing
 * These utilities simulate successful authentication without requiring real credentials
 */

export interface MockUser {
  id: string;
  email: string;
  role: 'staff' | 'admin' | 'customer' | 'driver';
  firstName: string;
  lastName: string;
}

export const MOCK_STAFF_USER: MockUser = {
  id: 'mock-staff-001',
  email: 'staff@test.prmcms.com',
  role: 'staff',
  firstName: 'Test',
  lastName: 'Staff'
};

export const MOCK_ADMIN_USER: MockUser = {
  id: 'mock-admin-001',
  email: 'admin@test.prmcms.com',
  role: 'admin',
  firstName: 'Test',
  lastName: 'Admin'
};

export const MOCK_CUSTOMER_USER: MockUser = {
  id: 'mock-customer-001',
  email: 'customer@test.prmcms.com',
  role: 'customer',
  firstName: 'Test',
  lastName: 'Customer'
};

/**
 * Mock successful authentication by setting up the browser state
 * This simulates what would happen after a successful login
 */
export async function mockSuccessfulLogin(page: Page, user: MockUser) {
  // Set up mock authentication state in localStorage/sessionStorage
  await page.evaluate((userData) => {
    // Mock Supabase session
    const mockSession = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: userData.id,
        email: userData.email,
        user_metadata: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role
        }
      }
    };

    // Store in localStorage (adjust based on your app's auth implementation)
    localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
    localStorage.setItem('prmcms.user', JSON.stringify(userData));
    localStorage.setItem('prmcms.authenticated', 'true');
    
    // Store in sessionStorage as backup
    sessionStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
    sessionStorage.setItem('prmcms.user', JSON.stringify(userData));
  }, user);

  // Set cookies if your app uses them for authentication
  await page.context().addCookies([
    {
      name: 'prmcms-auth',
      value: 'authenticated',
      domain: 'localhost',
      path: '/'
    },
    {
      name: 'prmcms-user-role',
      value: user.role,
      domain: 'localhost',
      path: '/'
    }
  ]);
}

/**
 * Mock authentication and navigate to dashboard
 */
export async function mockLoginAndNavigateToDashboard(page: Page, user: MockUser) {
  await mockSuccessfulLogin(page, user);
  
  // Navigate to dashboard based on user role
  const dashboardUrl = user.role === 'customer' ? '/customer-portal' : '/dashboard';
  await page.goto(dashboardUrl);
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
}

/**
 * Mock logout by clearing authentication state
 */
export async function mockLogout(page: Page) {
  try {
    // Navigate to a page first to ensure localStorage is available
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.evaluate(() => {
      // Clear localStorage
      try {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('prmcms.user');
        localStorage.removeItem('prmcms.authenticated');
      } catch (e) {
        // Ignore localStorage errors
      }

      // Clear sessionStorage
      try {
        sessionStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('prmcms.user');
      } catch (e) {
        // Ignore sessionStorage errors
      }
    });

    // Clear cookies
    await page.context().clearCookies();
  } catch (error) {
    // Ignore errors during cleanup
    console.log('Mock logout cleanup error (ignored):', error.message);
  }
}

/**
 * Check if user appears to be authenticated in the UI
 */
export async function isUserLoggedInUI(page: Page): Promise<boolean> {
  // Check for common authenticated UI elements
  const authIndicators = [
    '[data-testid="user-menu"]',
    '[data-testid="logout-button"]',
    '[data-testid="dashboard-header"]',
    'text=Dashboard',
    'text=Cerrar sesión',
    'text=Logout'
  ];

  for (const selector of authIndicators) {
    try {
      if (await page.locator(selector).isVisible({ timeout: 1000 })) {
        return true;
      }
    } catch {
      // Continue checking
    }
  }

  return false;
}

/**
 * Test authentication form validation without actual login
 */
export async function testFormValidation(page: Page, formType: 'staff' | 'customer') {
  const emailSelector = `[data-testid="${formType}-email-input"]`;
  const passwordSelector = `[data-testid="${formType}-password-input"]`;
  const submitSelector = `[data-testid="${formType}-login-submit"]`;

  // Test empty form submission
  await page.click(submitSelector);
  
  // Test invalid email format
  await page.fill(emailSelector, 'invalid-email');
  await page.fill(passwordSelector, 'password123');
  await page.click(submitSelector);
  
  // Test valid format but non-existent credentials
  await page.fill(emailSelector, 'test@example.com');
  await page.fill(passwordSelector, 'password123');
  await page.click(submitSelector);
  
  // The form should remain visible (no successful login)
  return page.locator(`[data-testid="${formType}-login-form"]`).isVisible();
}

/**
 * Simulate network conditions for authentication testing
 */
export async function simulateNetworkConditions(page: Page, condition: 'offline' | 'slow' | 'normal') {
  switch (condition) {
    case 'offline':
      await page.context().setOffline(true);
      break;
    case 'slow':
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 2000); // 2 second delay
      });
      break;
    case 'normal':
      await page.context().setOffline(false);
      await page.unroute('**/*');
      break;
  }
}

/**
 * Test role-based access control
 */
export async function testRoleBasedAccess(page: Page, user: MockUser, restrictedUrl: string) {
  await mockSuccessfulLogin(page, user);
  
  // Try to access restricted URL
  await page.goto(restrictedUrl);
  await page.waitForLoadState('networkidle');
  
  // Check if access was denied (should redirect or show error)
  const currentUrl = page.url();
  const hasAccessDenied = await page.locator('text=Access Denied').isVisible({ timeout: 1000 }).catch(() => false);
  
  return {
    currentUrl,
    hasAccessDenied,
    wasRedirected: !currentUrl.includes(restrictedUrl)
  };
}

/**
 * Comprehensive authentication test suite
 */
export async function runAuthenticationTestSuite(page: Page) {
  const results = {
    staffFormValidation: false,
    customerFormValidation: false,
    mockLoginWorks: false,
    roleBasedAccessWorks: false,
    logoutWorks: false
  };

  try {
    // Test staff form validation
    await page.goto('/auth/staff');
    results.staffFormValidation = await testFormValidation(page, 'staff');

    // Test customer form validation
    await page.goto('/auth/customer');
    results.customerFormValidation = await testFormValidation(page, 'customer');

    // Test mock login
    await mockLoginAndNavigateToDashboard(page, MOCK_STAFF_USER);
    results.mockLoginWorks = await isUserLoggedInUI(page);

    // Test role-based access (customer trying to access admin area)
    const accessTest = await testRoleBasedAccess(page, MOCK_CUSTOMER_USER, '/admin');
    results.roleBasedAccessWorks = accessTest.wasRedirected || accessTest.hasAccessDenied;

    // Test logout
    await mockLogout(page);
    await page.goto('/dashboard');
    results.logoutWorks = !await isUserLoggedInUI(page);

  } catch (error) {
    console.error('Authentication test suite error:', error);
  }

  return results;
}
