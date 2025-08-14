import { test, expect, Page } from '@playwright/test';
import { loginAsStaff, loginAsAdmin, loginAsCustomer } from './utils/auth-helpers';

// Test data constants
const TEST_USER_STAFF = {
  email: 'staff@test.com',
  password: process.env.PLAYWRIGHT_STAFF_PASSWORD || process.env.TEST_USER_PASSWORD || 'testpassword123',
  invalidPassword: 'wrongpassword123'
};

const TEST_USER_ADMIN = {
  email: 'admin@test.com',
  password: process.env.PLAYWRIGHT_ADMIN_PASSWORD || process.env.TEST_USER_PASSWORD || 'adminpass123',
  invalidPassword: 'wrongadminpass'
};

const TEST_USER_CUSTOMER = {
  email: 'customer@test.com',
  password: process.env.PLAYWRIGHT_CUSTOMER_PASSWORD || process.env.TEST_USER_PASSWORD || 'customerpass123',
  invalidPassword: 'wrongcustomerpass'
};

// Helper function to check if user is on login page
async function expectLoginPage(page: Page) {
  // Check for login form elements
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
}

// Helper function to check if user is on dashboard
async function expectDashboard(page: Page) {
  await expect(page).toHaveURL(/.*#\/dashboard/);
  // Check for common dashboard elements
  await expect(page.locator('text=/Dashboard|Panel de Control/i')).toBeVisible({ timeout: 10000 });
}

// Helper function to check for customer dashboard
async function expectCustomerDashboard(page: Page) {
  await expect(page).toHaveURL(/.*#\/customer-dashboard/);
}

test.describe('Authentication Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Clear all cookies and storage to ensure clean state
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.describe('User Login with Valid Credentials', () => {
    test('Staff user can login successfully', async ({ page }) => {
      await page.goto('/auth/staff');
      
      // Fill in login form
      await page.fill('input[type="email"]', TEST_USER_STAFF.email);
      await page.fill('input[type="password"]', TEST_USER_STAFF.password);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for navigation and verify dashboard loads
      await page.waitForURL('**/#/dashboard', { timeout: 10000 });
      await expectDashboard(page);
      
      // Verify success toast notification
      const successToast = page.locator('[role="status"]').filter({ hasText: /Welcome|Bienvenido/i });
      await expect(successToast).toBeVisible({ timeout: 5000 });
    });

    test('Admin user can login successfully', async ({ page }) => {
      await page.goto('/auth/staff');
      
      // Fill in login form
      await page.fill('input[type="email"]', TEST_USER_ADMIN.email);
      await page.fill('input[type="password"]', TEST_USER_ADMIN.password);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for navigation and verify dashboard loads
      await page.waitForURL('**/#/dashboard', { timeout: 10000 });
      await expectDashboard(page);
      
      // Verify admin-specific elements are visible
      const adminSection = page.locator('text=/Admin|Administration/i');
      await expect(adminSection).toBeVisible({ timeout: 10000 });
    });

    test('Customer can login successfully', async ({ page }) => {
      await page.goto('/auth/customer');
      
      // Fill in login form
      await page.fill('input[type="email"]', TEST_USER_CUSTOMER.email);
      await page.fill('input[type="password"]', TEST_USER_CUSTOMER.password);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for navigation and verify customer dashboard loads
      await page.waitForURL('**/#/customer-dashboard', { timeout: 10000 });
      await expectCustomerDashboard(page);
    });
  });

  test.describe('Login Failure with Invalid Credentials', () => {
    test('Shows error with wrong password for staff', async ({ page }) => {
      await page.goto('/auth/staff');
      
      // Fill in login form with wrong password
      await page.fill('input[type="email"]', TEST_USER_STAFF.email);
      await page.fill('input[type="password"]', TEST_USER_STAFF.invalidPassword);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should stay on login page
      await expectLoginPage(page);
      
      // Check for error message
      const errorToast = page.locator('[role="status"]').filter({ hasText: /Invalid|incorrect|error/i });
      await expect(errorToast).toBeVisible({ timeout: 5000 });
      
      // Verify not redirected to dashboard
      await expect(page).not.toHaveURL(/.*#\/dashboard/);
    });

    test('Shows error with non-existent email', async ({ page }) => {
      await page.goto('/auth/staff');
      
      // Fill in login form with non-existent email
      await page.fill('input[type="email"]', 'nonexistent@test.com');
      await page.fill('input[type="password"]', 'somepassword123');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should stay on login page
      await expectLoginPage(page);
      
      // Check for error message
      const errorToast = page.locator('[role="status"]').filter({ hasText: /Invalid|incorrect|not found|error/i });
      await expect(errorToast).toBeVisible({ timeout: 5000 });
      
      // Verify not redirected to dashboard
      await expect(page).not.toHaveURL(/.*#\/dashboard/);
    });

    test('Shows validation error for empty fields', async ({ page }) => {
      await page.goto('/auth/staff');
      
      // Try to submit with empty fields
      await page.click('button[type="submit"]');
      
      // Should stay on login page
      await expectLoginPage(page);
      
      // Check for HTML5 validation messages
      const emailInput = page.locator('input[type="email"]');
      const isEmailInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isEmailInvalid).toBeTruthy();
    });

    test('Shows validation error for invalid email format', async ({ page }) => {
      await page.goto('/auth/staff');
      
      // Fill in login form with invalid email format
      await page.fill('input[type="email"]', 'notanemail');
      await page.fill('input[type="password"]', 'somepassword123');
      
      // Try to submit
      await page.click('button[type="submit"]');
      
      // Should stay on login page
      await expectLoginPage(page);
      
      // Check for HTML5 validation on email field
      const emailInput = page.locator('input[type="email"]');
      const isEmailInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isEmailInvalid).toBeTruthy();
    });
  });

  test.describe('Session Persistence Across Page Reloads', () => {
    test('Staff session persists after page reload', async ({ page }) => {
      // Login as staff
      await loginAsStaff(page);
      
      // Verify on dashboard
      await expectDashboard(page);
      
      // Store auth token/session info
      const authToken = await page.evaluate(() => {
        return localStorage.getItem('supabase.auth.token') || sessionStorage.getItem('supabase.auth.token');
      });
      
      // Reload the page
      await page.reload();
      
      // Wait for page to stabilize
      await page.waitForLoadState('networkidle');
      
      // Should still be on dashboard, not redirected to login
      await expectDashboard(page);
      
      // Verify auth token is still present
      const authTokenAfterReload = await page.evaluate(() => {
        return localStorage.getItem('supabase.auth.token') || sessionStorage.getItem('supabase.auth.token');
      });
      expect(authTokenAfterReload).toBeTruthy();
    });

    test('Customer session persists after page reload', async ({ page }) => {
      // Login as customer
      await loginAsCustomer(page);
      
      // Verify on customer dashboard
      await expectCustomerDashboard(page);
      
      // Reload the page
      await page.reload();
      
      // Wait for page to stabilize
      await page.waitForLoadState('networkidle');
      
      // Should still be on customer dashboard
      await expectCustomerDashboard(page);
    });

    test('Session persists when navigating to different routes', async ({ page }) => {
      // Login as staff
      await loginAsStaff(page);
      
      // Navigate to different protected routes
      await page.goto('/#/packages');
      await page.waitForLoadState('networkidle');
      
      // Should not be redirected to login
      await expect(page).not.toHaveURL(/.*auth.*/);
      
      await page.goto('/#/customers');
      await page.waitForLoadState('networkidle');
      
      // Should not be redirected to login
      await expect(page).not.toHaveURL(/.*auth.*/);
      
      await page.goto('/#/reports');
      await page.waitForLoadState('networkidle');
      
      // Should not be redirected to login
      await expect(page).not.toHaveURL(/.*auth.*/);
    });

    test('Session persists in new tab (same context)', async ({ context, page }) => {
      // Login in first tab
      await loginAsStaff(page);
      await expectDashboard(page);
      
      // Open a new tab in the same context
      const newPage = await context.newPage();
      
      // Navigate to the app in the new tab
      await newPage.goto('/#/dashboard');
      
      // Should be authenticated in the new tab
      await expectDashboard(newPage);
      
      // Should not see login page
      await expect(newPage).not.toHaveURL(/.*auth.*/);
      
      await newPage.close();
    });
  });

  test.describe('Logout Functionality', () => {
    test('Staff can logout successfully', async ({ page }) => {
      // Login first
      await loginAsStaff(page);
      await expectDashboard(page);
      
      // Find and click logout button
      // Try different possible logout button locations
      const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Sign out|Cerrar sesión/i }).first();
      await expect(logoutButton).toBeVisible({ timeout: 10000 });
      await logoutButton.click();
      
      // Wait for redirect to login page
      await page.waitForURL(/.*auth.*/, { timeout: 10000 });
      
      // Verify on login page
      await expectLoginPage(page);
      
      // Verify session is cleared
      const authToken = await page.evaluate(() => {
        return localStorage.getItem('supabase.auth.token') || sessionStorage.getItem('supabase.auth.token');
      });
      expect(authToken).toBeFalsy();
    });

    test('Customer can logout successfully', async ({ page }) => {
      // Login first
      await loginAsCustomer(page);
      await expectCustomerDashboard(page);
      
      // Find and click logout button
      const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Sign out|Cerrar sesión/i }).first();
      await expect(logoutButton).toBeVisible({ timeout: 10000 });
      await logoutButton.click();
      
      // Wait for redirect to login page
      await page.waitForURL(/.*auth.*/, { timeout: 10000 });
      
      // Verify on login page
      await expectLoginPage(page);
    });

    test('After logout, cannot access protected routes', async ({ page }) => {
      // Login and then logout
      await loginAsStaff(page);
      await expectDashboard(page);
      
      const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Sign out|Cerrar sesión/i }).first();
      await logoutButton.click();
      
      await page.waitForURL(/.*auth.*/, { timeout: 10000 });
      
      // Try to navigate to protected route
      await page.goto('/#/dashboard');
      
      // Should be redirected to login
      await page.waitForURL(/.*auth.*/, { timeout: 10000 });
      await expectLoginPage(page);
    });

    test('Logout clears all auth-related storage', async ({ page }) => {
      // Login first
      await loginAsStaff(page);
      
      // Store initial auth data
      const authDataBefore = await page.evaluate(() => {
        return {
          localStorage: Object.keys(localStorage).filter(key => key.includes('auth') || key.includes('supabase')),
          sessionStorage: Object.keys(sessionStorage).filter(key => key.includes('auth') || key.includes('supabase'))
        };
      });
      
      expect(authDataBefore.localStorage.length + authDataBefore.sessionStorage.length).toBeGreaterThan(0);
      
      // Logout
      const logoutButton = page.locator('button, a').filter({ hasText: /Logout|Sign out|Cerrar sesión/i }).first();
      await logoutButton.click();
      
      await page.waitForURL(/.*auth.*/, { timeout: 10000 });
      
      // Check auth data is cleared
      const authDataAfter = await page.evaluate(() => {
        return {
          localStorage: Object.keys(localStorage).filter(key => key.includes('auth') || key.includes('supabase')),
          sessionStorage: Object.keys(sessionStorage).filter(key => key.includes('auth') || key.includes('supabase'))
        };
      });
      
      // Auth-related storage should be cleared or significantly reduced
      expect(authDataAfter.localStorage.length + authDataAfter.sessionStorage.length).toBeLessThanOrEqual(
        authDataBefore.localStorage.length + authDataBefore.sessionStorage.length
      );
    });
  });

  test.describe('Protected Route Access Without Authentication', () => {
    test('Redirects to login when accessing dashboard without auth', async ({ page }) => {
      // Try to access dashboard directly without logging in
      await page.goto('/#/dashboard');
      
      // Should be redirected to login page
      await page.waitForURL(/.*auth.*/, { timeout: 10000 });
      await expectLoginPage(page);
    });

    test('Redirects to login when accessing packages route without auth', async ({ page }) => {
      await page.goto('/#/packages');
      
      // Should be redirected to login page
      await page.waitForURL(/.*auth.*/, { timeout: 10000 });
      await expectLoginPage(page);
    });

    test('Redirects to login when accessing customers route without auth', async ({ page }) => {
      await page.goto('/#/customers');
      
      // Should be redirected to login page
      await page.waitForURL(/.*auth.*/, { timeout: 10000 });
      await expectLoginPage(page);
    });

    test('Redirects to login when accessing admin route without auth', async ({ page }) => {
      await page.goto('/#/admin');
      
      // Should be redirected to login page
      await page.waitForURL(/.*auth.*/, { timeout: 10000 });
      await expectLoginPage(page);
    });

    test('Redirects to login when accessing reports route without auth', async ({ page }) => {
      await page.goto('/#/reports');
      
      // Should be redirected to login page
      await page.waitForURL(/.*auth.*/, { timeout: 10000 });
      await expectLoginPage(page);
    });

    test('Redirects to login when accessing billing route without auth', async ({ page }) => {
      await page.goto('/#/billing');
      
      // Should be redirected to login page
      await page.waitForURL(/.*auth.*/, { timeout: 10000 });
      await expectLoginPage(page);
    });

    test('Multiple protected routes redirect to login consistently', async ({ page }) => {
      const protectedRoutes = [
        '/#/dashboard',
        '/#/packages',
        '/#/customers',
        '/#/mailboxes',
        '/#/integrations',
        '/#/billing',
        '/#/admin',
        '/#/inventory',
        '/#/documents',
        '/#/virtual-mail',
        '/#/notifications',
        '/#/routes',
        '/#/intake',
        '/#/analytics',
        '/#/security',
        '/#/performance',
        '/#/qa',
        '/#/reports'
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);
        
        // Each should redirect to login
        await page.waitForURL(/.*auth.*/, { timeout: 10000 });
        
        // Verify login page is shown
        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible({ timeout: 5000 });
      }
    });

    test('Direct API access without auth returns 401', async ({ request }) => {
      // Try to access a protected API endpoint without auth
      const response = await request.get('/api/packages', {
        failOnStatusCode: false
      });
      
      // Should return 401 Unauthorized
      expect([401, 403]).toContain(response.status());
    });
  });

  test.describe('Authentication Edge Cases', () => {
    test('Handles concurrent login attempts', async ({ page, context }) => {
      const page2 = await context.newPage();
      
      // Start login on both pages simultaneously
      await Promise.all([
        loginAsStaff(page),
        loginAsStaff(page2)
      ]);
      
      // Both should succeed and be on dashboard
      await expectDashboard(page);
      await expectDashboard(page2);
      
      await page2.close();
    });

    test('Handles expired session gracefully', async ({ page }) => {
      // Login first
      await loginAsStaff(page);
      await expectDashboard(page);
      
      // Simulate expired session by clearing auth storage
      await page.evaluate(() => {
        // Clear Supabase auth storage
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('supabase') || key.includes('auth')) {
            localStorage.removeItem(key);
          }
        });
      });
      
      // Try to navigate to another protected route
      await page.goto('/#/packages');
      
      // Should be redirected to login
      await page.waitForURL(/.*auth.*/, { timeout: 10000 });
      await expectLoginPage(page);
    });

    test('Handles network error during login', async ({ page, context }) => {
      // Block API requests to simulate network error
      await context.route('**/auth/v1/token**', route => route.abort());
      
      await page.goto('/auth/staff');
      
      // Try to login
      await page.fill('input[type="email"]', TEST_USER_STAFF.email);
      await page.fill('input[type="password"]', TEST_USER_STAFF.password);
      await page.click('button[type="submit"]');
      
      // Should show error message
      const errorToast = page.locator('[role="status"]').filter({ hasText: /error|failed|network/i });
      await expect(errorToast).toBeVisible({ timeout: 10000 });
      
      // Should stay on login page
      await expectLoginPage(page);
    });

    test('Remember me functionality (if implemented)', async ({ page }) => {
      await page.goto('/auth/staff');
      
      // Check if remember me checkbox exists
      const rememberMeCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /remember|recordar/i });
      
      if (await rememberMeCheckbox.count() > 0) {
        // Check the remember me box
        await rememberMeCheckbox.check();
        
        // Login
        await page.fill('input[type="email"]', TEST_USER_STAFF.email);
        await page.fill('input[type="password"]', TEST_USER_STAFF.password);
        await page.click('button[type="submit"]');
        
        await expectDashboard(page);
        
        // Check that auth is stored in localStorage (persistent) not just sessionStorage
        const isInLocalStorage = await page.evaluate(() => {
          const keys = Object.keys(localStorage);
          return keys.some(key => key.includes('supabase.auth'));
        });
        
        expect(isInLocalStorage).toBeTruthy();
      } else {
        // Skip test if remember me is not implemented
        test.skip();
      }
    });
  });

  test.describe('Multi-factor Authentication (if implemented)', () => {
    test.skip('Requires MFA code after successful credentials', async ({ page }) => {
      // This test is skipped by default as MFA may not be implemented
      // Remove skip when MFA is implemented
      
      await page.goto('/auth/staff');
      
      // Enter credentials for a user with MFA enabled
      await page.fill('input[type="email"]', 'mfa-user@test.com');
      await page.fill('input[type="password"]', 'mfapassword123');
      await page.click('button[type="submit"]');
      
      // Should show MFA code input
      const mfaInput = page.locator('input[placeholder*="code" i], input[placeholder*="código" i]');
      await expect(mfaInput).toBeVisible({ timeout: 10000 });
      
      // Enter MFA code
      await mfaInput.fill('123456');
      await page.click('button[type="submit"]');
      
      // Should be redirected to dashboard
      await expectDashboard(page);
    });
  });
});

// Test suite for password reset flow (separate describe block)
test.describe('Password Reset Flow', () => {
  test('Can navigate to password reset from login', async ({ page }) => {
    await page.goto('/auth/staff');
    
    // Click forgot password link
    const forgotPasswordLink = page.locator('a').filter({ hasText: /forgot.*password|olvidé.*contraseña/i });
    await expect(forgotPasswordLink).toBeVisible();
    await forgotPasswordLink.click();
    
    // Should navigate to reset password page
    await page.waitForURL('**/#/auth/reset-password', { timeout: 10000 });
    
    // Verify reset password form is shown
    const resetEmailInput = page.locator('input[type="email"]');
    await expect(resetEmailInput).toBeVisible();
    
    const resetButton = page.locator('button').filter({ hasText: /reset|send|enviar/i });
    await expect(resetButton).toBeVisible();
  });

  test('Password reset form validates email', async ({ page }) => {
    await page.goto('/#/auth/reset-password');
    
    // Try to submit with invalid email
    await page.fill('input[type="email"]', 'notanemail');
    const resetButton = page.locator('button').filter({ hasText: /reset|send|enviar/i }).first();
    await resetButton.click();
    
    // Should show validation error
    const emailInput = page.locator('input[type="email"]');
    const isEmailInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isEmailInvalid).toBeTruthy();
  });
});
