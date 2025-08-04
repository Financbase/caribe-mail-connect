import { test, expect } from '@playwright/test';

test.describe('Debug Authentication Pages', () => {
  test('Debug staff auth page', async ({ page }) => {
    await page.goto('/auth/staff');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot to see what's rendered
    await page.screenshot({ path: 'tests/screenshots/debug-staff-auth.png', fullPage: true });
    
    // Log the page content
    const content = await page.content();
    console.log('Staff auth page HTML length:', content.length);
    
    // Check what's actually on the page
    const title = await page.title();
    console.log('Page title:', title);
    
    // Look for any forms
    const forms = await page.locator('form').count();
    console.log('Number of forms found:', forms);
    
    // Look for any inputs
    const inputs = await page.locator('input').count();
    console.log('Number of inputs found:', inputs);
    
    // Look for any buttons
    const buttons = await page.locator('button').count();
    console.log('Number of buttons found:', buttons);
    
    // Check for specific text content
    const hasLoginText = await page.locator('text=Iniciar').count();
    console.log('Elements with "Iniciar" text:', hasLoginText);
    
    // Check for data-testid attributes
    const testIds = await page.locator('[data-testid]').count();
    console.log('Elements with data-testid:', testIds);
    
    // List all data-testid values
    const testIdElements = await page.locator('[data-testid]').all();
    for (const element of testIdElements) {
      const testId = await element.getAttribute('data-testid');
      console.log('Found data-testid:', testId);
    }
    
    // Check if we're on the right page
    const url = page.url();
    console.log('Current URL:', url);
    
    // This test should pass - we're just debugging
    expect(true).toBe(true);
  });

  test('Debug customer auth page', async ({ page }) => {
    await page.goto('/auth/customer');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot to see what's rendered
    await page.screenshot({ path: 'tests/screenshots/debug-customer-auth.png', fullPage: true });
    
    // Log the page content
    const content = await page.content();
    console.log('Customer auth page HTML length:', content.length);
    
    // Check what's actually on the page
    const title = await page.title();
    console.log('Page title:', title);
    
    // Look for any forms
    const forms = await page.locator('form').count();
    console.log('Number of forms found:', forms);
    
    // Look for any inputs
    const inputs = await page.locator('input').count();
    console.log('Number of inputs found:', inputs);
    
    // Look for any buttons
    const buttons = await page.locator('button').count();
    console.log('Number of buttons found:', buttons);
    
    // Check for specific text content
    const hasLoginText = await page.locator('text=Cliente').count();
    console.log('Elements with "Cliente" text:', hasLoginText);
    
    // Check for data-testid attributes
    const testIds = await page.locator('[data-testid]').count();
    console.log('Elements with data-testid:', testIds);
    
    // List all data-testid values
    const testIdElements = await page.locator('[data-testid]').all();
    for (const element of testIdElements) {
      const testId = await element.getAttribute('data-testid');
      console.log('Found data-testid:', testId);
    }
    
    // Check if we're on the right page
    const url = page.url();
    console.log('Current URL:', url);
    
    // This test should pass - we're just debugging
    expect(true).toBe(true);
  });

  test('Debug auth selection page', async ({ page }) => {
    await page.goto('/auth');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot to see what's rendered
    await page.screenshot({ path: 'tests/screenshots/debug-auth-selection.png', fullPage: true });
    
    // Check what's actually on the page
    const title = await page.title();
    console.log('Auth selection page title:', title);
    
    // Check for PRMCMS title
    const hasPRMCMS = await page.locator('text=PRMCMS').count();
    console.log('Elements with "PRMCMS" text:', hasPRMCMS);
    
    // Check for auth cards
    const staffCard = await page.locator('[data-testid="staff-auth-card"]').count();
    const customerCard = await page.locator('[data-testid="customer-auth-card"]').count();
    console.log('Staff auth card found:', staffCard);
    console.log('Customer auth card found:', customerCard);
    
    // Check if we're on the right page
    const url = page.url();
    console.log('Current URL:', url);
    
    // This test should pass - we're just debugging
    expect(true).toBe(true);
  });
});
