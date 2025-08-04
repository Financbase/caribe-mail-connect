import { test, expect } from '@playwright/test';

test.describe('Basic Authentication Testing', () => {
  
  test('Staff authentication page loads correctly', async ({ page }) => {
    await page.goto('/auth/staff');
    await page.waitForLoadState('networkidle');
    
    // Verify page title and basic structure
    await expect(page.locator('h1')).toContainText('PRMCMS');
    
    // Verify form elements are present
    await expect(page.locator('[data-testid="staff-login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="staff-email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="staff-password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="staff-login-submit"]')).toBeVisible();
    
    // Verify input types
    await expect(page.locator('[data-testid="staff-email-input"]')).toHaveAttribute('type', 'email');
    await expect(page.locator('[data-testid="staff-password-input"]')).toHaveAttribute('type', 'password');
  });

  test('Customer authentication page loads correctly', async ({ page }) => {
    await page.goto('/auth/customer');
    await page.waitForLoadState('networkidle');
    
    // Verify page title and basic structure
    await expect(page.locator('h1')).toContainText('PRMCMS');
    
    // Verify form elements are present
    await expect(page.locator('[data-testid="customer-login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="customer-email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="customer-password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="customer-login-submit"]')).toBeVisible();
    
    // Verify input types
    await expect(page.locator('[data-testid="customer-email-input"]')).toHaveAttribute('type', 'email');
    await expect(page.locator('[data-testid="customer-password-input"]')).toHaveAttribute('type', 'password');
  });

  test('Staff form accepts user input', async ({ page }) => {
    await page.goto('/auth/staff');
    await page.waitForLoadState('networkidle');
    
    // Fill in form fields
    await page.fill('[data-testid="staff-email-input"]', 'test@example.com');
    await page.fill('[data-testid="staff-password-input"]', 'password123');
    
    // Verify values were entered
    const emailValue = await page.inputValue('[data-testid="staff-email-input"]');
    const passwordValue = await page.inputValue('[data-testid="staff-password-input"]');
    
    expect(emailValue).toBe('test@example.com');
    expect(passwordValue).toBe('password123');
  });

  test('Customer form accepts user input', async ({ page }) => {
    await page.goto('/auth/customer');
    await page.waitForLoadState('networkidle');
    
    // Fill in form fields
    await page.fill('[data-testid="customer-email-input"]', 'customer@example.com');
    await page.fill('[data-testid="customer-password-input"]', 'password456');
    
    // Verify values were entered
    const emailValue = await page.inputValue('[data-testid="customer-email-input"]');
    const passwordValue = await page.inputValue('[data-testid="customer-password-input"]');
    
    expect(emailValue).toBe('customer@example.com');
    expect(passwordValue).toBe('password456');
  });

  test('Staff form submission works', async ({ page }) => {
    await page.goto('/auth/staff');
    await page.waitForLoadState('networkidle');
    
    // Fill in form with test credentials
    await page.fill('[data-testid="staff-email-input"]', 'test@example.com');
    await page.fill('[data-testid="staff-password-input"]', 'password123');
    
    // Submit form
    await page.click('[data-testid="staff-login-submit"]');
    
    // Wait for any response
    await page.waitForLoadState('networkidle');
    
    // Since we don't have valid credentials, we should still be on the auth page
    // This tests that the form submission doesn't crash the app
    const currentUrl = page.url();
    expect(currentUrl).toContain('/auth/staff');
    
    // Form should still be visible
    await expect(page.locator('[data-testid="staff-login-form"]')).toBeVisible();
  });

  test('Customer form submission works', async ({ page }) => {
    await page.goto('/auth/customer');
    await page.waitForLoadState('networkidle');
    
    // Fill in form with test credentials
    await page.fill('[data-testid="customer-email-input"]', 'test@example.com');
    await page.fill('[data-testid="customer-password-input"]', 'password123');
    
    // Submit form
    await page.click('[data-testid="customer-login-submit"]');
    
    // Wait for any response
    await page.waitForLoadState('networkidle');
    
    // Since we don't have valid credentials, we should still be on the auth page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/auth/customer');
    
    // Form should still be visible
    await expect(page.locator('[data-testid="customer-login-form"]')).toBeVisible();
  });

  test('Password visibility toggle works (if present)', async ({ page }) => {
    await page.goto('/auth/staff');
    await page.waitForLoadState('networkidle');
    
    const passwordInput = page.locator('[data-testid="staff-password-input"]');
    const toggleButton = page.locator('[data-testid="staff-password-toggle"]');
    
    // Initially should be password type
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Check if toggle button exists and click it
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      // Should change to text type
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click again to hide
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    } else {
      console.log('Password toggle button not found - this is acceptable');
    }
  });

  test('Form accessibility features', async ({ page }) => {
    await page.goto('/auth/staff');
    await page.waitForLoadState('networkidle');
    
    // Check for proper input attributes
    const emailInput = page.locator('[data-testid="staff-email-input"]');
    const passwordInput = page.locator('[data-testid="staff-password-input"]');
    
    // Inputs should have proper types
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Test keyboard navigation
    await emailInput.focus();
    await expect(emailInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(passwordInput).toBeFocused();
  });

  test('Auth selection page navigation', async ({ page }) => {
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
    
    // Should show auth selection page
    await expect(page.locator('h1')).toContainText('PRMCMS');
    
    // Check for staff and customer auth cards
    const staffCard = page.locator('[data-testid="staff-auth-card"]');
    const customerCard = page.locator('[data-testid="customer-auth-card"]');
    
    if (await staffCard.isVisible()) {
      await staffCard.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/auth/staff');
      
      // Go back to test customer card
      await page.goto('/auth');
      await page.waitForLoadState('networkidle');
    }
    
    if (await customerCard.isVisible()) {
      await customerCard.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/auth/customer');
    }
  });

  test('Form validation prevents empty submission', async ({ page }) => {
    await page.goto('/auth/staff');
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    await page.click('[data-testid="staff-login-submit"]');
    
    // Should still be on the same page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/auth/staff');
    
    // Form should still be visible
    await expect(page.locator('[data-testid="staff-login-form"]')).toBeVisible();
  });

  test('Navigation between auth types works', async ({ page }) => {
    // Start with staff auth
    await page.goto('/auth/staff');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="staff-login-form"]')).toBeVisible();
    
    // Navigate to customer auth
    await page.goto('/auth/customer');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="customer-login-form"]')).toBeVisible();
    
    // Navigate back to staff auth
    await page.goto('/auth/staff');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="staff-login-form"]')).toBeVisible();
  });
});
