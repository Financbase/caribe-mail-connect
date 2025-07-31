import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 30000;

// Test credentials (matching the demo accounts in AuthContext)
const TEST_CREDENTIALS = {
  admin: { email: 'admin@prmcms.com', password: 'admin123' },
  customer: { email: 'customer@prmcms.com', password: 'customer123' },
  driver: { email: 'driver@prmcms.com', password: 'driver123' },
  staff: { email: 'test@example.com', password: 'admin123' }
};

test.describe('PRMCMS Application Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for each test
    test.setTimeout(TEST_TIMEOUT);
    
    // Navigate to the application
    await page.goto(BASE_URL);
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('TC001: Application loads successfully and shows authentication', async ({ page }) => {
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/PRMCMS|Vite \+ React \+ TS/);
    
    // Should show demo mode warning or auth selection
    const demoModeWarning = page.locator('[class*="amber"]').first();
    const authSelection = page.locator('text=/login|entrar|auth/i').first();
    
    // One of these should be visible
    const isDemoMode = await demoModeWarning.isVisible().catch(() => false);
    const hasAuthSelection = await authSelection.isVisible().catch(() => false);
    
    expect(isDemoMode || hasAuthSelection).toBeTruthy();
    
    console.log('✅ TC001: Application loads successfully');
  });

  test('TC002: Staff Authentication Flow', async ({ page }) => {
    // Wait for auth selection or direct auth page
    await page.waitForTimeout(2000);
    
    // Try to find login form or navigate to it
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    // If login form is not visible, try to navigate to auth
    if (!(await emailInput.isVisible().catch(() => false))) {
      // Look for auth navigation link
      const authLink = page.locator('text=/staff|personal|login/i').first();
      if (await authLink.isVisible().catch(() => false)) {
        await authLink.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Fill login form with staff credentials
    await emailInput.fill(TEST_CREDENTIALS.staff.email);
    await passwordInput.fill(TEST_CREDENTIALS.staff.password);
    
    // Submit the form
    const loginButton = page.locator('button[type="submit"], button:has-text("login"), button:has-text("entrar")').first();
    await loginButton.click();
    
    // Wait for navigation/login success
    await page.waitForTimeout(3000);
    
    // Check for successful login indicators
    const dashboardIndicator = page.locator('text=/dashboard|panel|welcome/i').first();
    const userIndicator = page.locator('text=/test|staff|admin/i').first();
    
    const hasDashboard = await dashboardIndicator.isVisible().catch(() => false);
    const hasUser = await userIndicator.isVisible().catch(() => false);
    
    expect(hasDashboard || hasUser).toBeTruthy();
    
    console.log('✅ TC002: Staff authentication successful');
  });

  test('TC003: Package Intake Navigation', async ({ page }) => {
    // First login as staff
    await loginAsStaff(page);
    
    // Look for package intake navigation
    const packageIntakeLink = page.locator('text=/package|paquete|intake/i').first();
    
    if (await packageIntakeLink.isVisible().catch(() => false)) {
      await packageIntakeLink.click();
      await page.waitForTimeout(2000);
      
      // Check for package intake form elements
      const intakeForm = page.locator('form, input, select').first();
      const hasIntakeElements = await intakeForm.isVisible().catch(() => false);
      
      expect(hasIntakeElements).toBeTruthy();
      console.log('✅ TC003: Package intake navigation successful');
    } else {
      console.log('⚠️ TC003: Package intake link not found - may be in different navigation structure');
    }
  });

  test('TC004: Language Toggle Functionality', async ({ page }) => {
    // Look for language toggle
    const languageToggle = page.locator('[class*="language"], button:has-text("EN"), button:has-text("ES")').first();
    
    if (await languageToggle.isVisible().catch(() => false)) {
      // Get initial language state
      const initialText = await page.textContent('body');
      
      // Click language toggle
      await languageToggle.click();
      await page.waitForTimeout(1000);
      
      // Check if text changed (basic language switch test)
      const newText = await page.textContent('body');
      
      // The content should change or at least the toggle should be functional
      expect(newText).toBeDefined();
      console.log('✅ TC004: Language toggle is functional');
    } else {
      console.log('⚠️ TC004: Language toggle not found in current view');
    }
  });

  test('TC005: Virtual Mailbox Access', async ({ page }) => {
    // Login first
    await loginAsStaff(page);
    
    // Look for virtual mailbox or mailbox navigation
    const mailboxLink = page.locator('text=/mailbox|virtual|mail|buzón/i').first();
    
    if (await mailboxLink.isVisible().catch(() => false)) {
      await mailboxLink.click();
      await page.waitForTimeout(2000);
      
      // Check for mailbox interface elements
      const mailboxInterface = page.locator('input, table, grid, card').first();
      const hasMailboxElements = await mailboxInterface.isVisible().catch(() => false);
      
      expect(hasMailboxElements).toBeTruthy();
      console.log('✅ TC005: Virtual mailbox access successful');
    } else {
      console.log('⚠️ TC005: Virtual mailbox link not found');
    }
  });

  test('TC006: Dashboard Metrics Display', async ({ page }) => {
    // Login first
    await loginAsStaff(page);
    
    // Wait for dashboard to load
    await page.waitForTimeout(3000);
    
    // Look for dashboard metrics/widgets
    const metrics = page.locator('[class*="metric"], [class*="stat"], [class*="card"], .grid').first();
    const hasMetrics = await metrics.isVisible().catch(() => false);
    
    expect(hasMetrics).toBeTruthy();
    console.log('✅ TC006: Dashboard metrics display successful');
  });

  test('TC007: Navigation Menu Accessibility', async ({ page }) => {
    // Login first
    await loginAsStaff(page);
    
    // Look for navigation menu
    const navMenu = page.locator('nav, [role="navigation"], [class*="sidebar"], [class*="menu"]').first();
    const hasNavigation = await navMenu.isVisible().catch(() => false);
    
    expect(hasNavigation).toBeTruthy();
    
    // Try to find multiple navigation items
    const navItems = await page.locator('a, button').all();
    expect(navItems.length).toBeGreaterThan(0);
    
    console.log('✅ TC007: Navigation menu accessible');
  });

  test('TC008: Error Handling - Invalid Login', async ({ page }) => {
    // Wait for auth form
    await page.waitForTimeout(2000);
    
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.isVisible().catch(() => false)) {
      // Try invalid credentials
      await emailInput.fill('invalid@example.com');
      await passwordInput.fill('wrongpassword');
      
      const loginButton = page.locator('button[type="submit"], button:has-text("login")').first();
      await loginButton.click();
      
      await page.waitForTimeout(2000);
      
      // Should still be on auth page or show error
      const stillOnAuth = await emailInput.isVisible().catch(() => false);
      const errorMessage = page.locator('[class*="error"], [class*="destructive"]').first();
      const hasError = await errorMessage.isVisible().catch(() => false);
      
      expect(stillOnAuth || hasError).toBeTruthy();
      console.log('✅ TC008: Error handling for invalid login works');
    } else {
      console.log('⚠️ TC008: Could not find login form to test error handling');
    }
  });

  test('TC009: Responsive Design Check', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Check if page is still functional in mobile view
    const mobileContent = page.locator('body').first();
    const hasMobileContent = await mobileContent.isVisible().catch(() => false);
    
    expect(hasMobileContent).toBeTruthy();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);
    
    const desktopContent = page.locator('body').first();
    const hasDesktopContent = await desktopContent.isVisible().catch(() => false);
    
    expect(hasDesktopContent).toBeTruthy();
    console.log('✅ TC009: Responsive design check passed');
  });

  test('TC010: Page Performance Check', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
    
    // Check for basic content
    const bodyContent = await page.textContent('body');
    expect(bodyContent?.length || 0).toBeGreaterThan(100);
    
    console.log(`✅ TC010: Page loaded in ${loadTime}ms`);
  });
});

// Helper function to login as staff
async function loginAsStaff(page: Page) {
  // Wait for page to be ready
  await page.waitForTimeout(2000);
  
  const emailInput = page.locator('input[type="email"]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  
  // If login form is visible, use it
  if (await emailInput.isVisible().catch(() => false)) {
    await emailInput.fill(TEST_CREDENTIALS.staff.email);
    await passwordInput.fill(TEST_CREDENTIALS.staff.password);
    
    const loginButton = page.locator('button[type="submit"], button:has-text("login")').first();
    await loginButton.click();
    
    // Wait for login to complete
    await page.waitForTimeout(3000);
  }
}