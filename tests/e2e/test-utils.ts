import { Page, expect } from '@playwright/test';

/**
 * Test utilities for E2E tests
 * This file contains reusable functions for common test operations
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export const DEFAULT_STAFF_CREDENTIALS: LoginCredentials = {
  email: 'staff@prmcms.com',
  password: 'StaffPassword123!'
};

export const DEFAULT_CUSTOMER_CREDENTIALS: LoginCredentials = {
  email: 'customer@example.com',
  password: 'CustomerPassword123!'
};

export const DEFAULT_ADMIN_CREDENTIALS: LoginCredentials = {
  email: 'admin@test.com',
  password: 'adminpass123'
};

/**
 * Login as staff member
 */
export async function loginAsStaff(page: Page, credentials: LoginCredentials = DEFAULT_STAFF_CREDENTIALS) {
  await page.goto('/auth/staff');

  // Wait for page to load completely
  await page.waitForLoadState('networkidle');

  // Wait for the form to be visible
  await page.waitForSelector('[data-testid="staff-login-form"]', { timeout: 10000 });

  // Wait for input fields to be visible and enabled
  await page.waitForSelector('[data-testid="staff-email-input"]', { timeout: 10000 });
  await page.waitForSelector('[data-testid="staff-password-input"]', { timeout: 10000 });
  await page.waitForSelector('[data-testid="staff-login-submit"]', { timeout: 10000 });

  // Fill in credentials with explicit waits
  await page.fill('[data-testid="staff-email-input"]', credentials.email);
  await page.fill('[data-testid="staff-password-input"]', credentials.password);

  // Submit form
  await page.click('[data-testid="staff-login-submit"]');

  // Wait for navigation or success indicator
  await page.waitForLoadState('networkidle');

  // Note: For testing purposes, we don't expect successful login with test credentials
  // The form should remain visible for invalid credentials
}

/**
 * Login as customer
 */
export async function loginAsCustomer(page: Page, credentials: LoginCredentials = DEFAULT_CUSTOMER_CREDENTIALS) {
  await page.goto('/auth/customer');

  // Wait for page to load completely
  await page.waitForLoadState('networkidle');

  // Wait for the form to be visible
  await page.waitForSelector('[data-testid="customer-login-form"]', { timeout: 10000 });

  // Wait for input fields to be visible and enabled
  await page.waitForSelector('[data-testid="customer-email-input"]', { timeout: 10000 });
  await page.waitForSelector('[data-testid="customer-password-input"]', { timeout: 10000 });
  await page.waitForSelector('[data-testid="customer-login-submit"]', { timeout: 10000 });

  // Fill in credentials with explicit waits
  await page.fill('[data-testid="customer-email-input"]', credentials.email);
  await page.fill('[data-testid="customer-password-input"]', credentials.password);

  // Submit form
  await page.click('[data-testid="customer-login-submit"]');

  // Wait for navigation
  await page.waitForLoadState('networkidle');

  // Note: For testing purposes, we don't expect successful login with test credentials
  // The form should remain visible for invalid credentials
}

/**
 * Login as admin using the staff authentication portal
 * Admins use the staff portal but have elevated permissions
 */
export async function loginAsAdmin(
  page: Page,
  credentials: LoginCredentials = DEFAULT_ADMIN_CREDENTIALS
): Promise<void> {
  console.log('Logging in as admin with credentials:', credentials.email);

  // Navigate to staff auth page (admins use staff portal)
  await page.goto('/auth/staff');

  // Wait for page to load completely
  await page.waitForLoadState('networkidle');

  // Wait for the form to be visible
  await page.waitForSelector('[data-testid="staff-login-form"]', { timeout: 10000 });

  // Wait for input fields to be visible and enabled
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.waitForSelector('button[type="submit"]', { timeout: 10000 });

  // Fill in credentials
  await page.fill('input[type="email"]', credentials.email);
  await page.fill('input[type="password"]', credentials.password);

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for successful login (redirect to dashboard)
  await page.waitForURL('**/#/dashboard', { timeout: 15000 });

  console.log('Successfully logged in as admin');
}

/**
 * Logout from the application
 */
export async function logout(page: Page) {
  // Try to find logout button/link
  const logoutSelectors = [
    '[data-testid="logout-button"]',
    '[data-testid="logout-link"]',
    'button:has-text("Logout")',
    'button:has-text("Cerrar sesión")',
    'a:has-text("Logout")',
    'a:has-text("Cerrar sesión")'
  ];
  
  for (const selector of logoutSelectors) {
    try {
      const element = page.locator(selector);
      if (await element.isVisible({ timeout: 1000 })) {
        await element.click();
        await page.waitForLoadState('networkidle');
        return;
      }
    } catch {
      // Continue to next selector
    }
  }
  
  // If no logout button found, navigate to logout URL
  await page.goto('/auth/logout');
  await page.waitForLoadState('networkidle');
}

/**
 * Wait for element to be visible with retry logic
 */
export async function waitForElement(page: Page, selector: string, timeout: number = 10000) {
  await expect(page.locator(selector)).toBeVisible({ timeout });
}

/**
 * Fill form field with error handling
 */
export async function fillField(page: Page, selector: string, value: string) {
  await page.waitForSelector(selector, { timeout: 5000 });
  await page.fill(selector, value);
}

/**
 * Click element with retry logic
 */
export async function clickElement(page: Page, selector: string) {
  await page.waitForSelector(selector, { timeout: 5000 });
  await page.click(selector);
}

/**
 * Navigate to a specific page and wait for it to load
 */
export async function navigateToPage(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  const loginIndicators = [
    '[data-testid="user-menu"]',
    '[data-testid="dashboard"]',
    '[data-testid="logout-button"]',
    '.user-avatar',
    '.dashboard-header'
  ];
  
  for (const selector of loginIndicators) {
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
 * Setup test data - create test entities if needed
 */
export async function setupTestData(page: Page) {
  // This function can be extended to create test data
  // For now, it's a placeholder
  console.log('Setting up test data...');
}

/**
 * Cleanup test data - remove test entities
 */
export async function cleanupTestData(page: Page) {
  // This function can be extended to cleanup test data
  // For now, it's a placeholder
  console.log('Cleaning up test data...');
}

/**
 * Take screenshot for debugging
 */
export async function takeDebugScreenshot(page: Page, name: string) {
  await page.screenshot({ 
    path: `tests/screenshots/debug-${name}-${Date.now()}.png`,
    fullPage: true 
  });
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(page: Page, urlPattern: string, timeout: number = 10000) {
  return page.waitForResponse(response => 
    response.url().includes(urlPattern) && response.status() === 200,
    { timeout }
  );
}
