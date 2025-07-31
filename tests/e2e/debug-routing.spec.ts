import { test, expect } from '@playwright/test';

test.describe('Debug Routing', () => {
  test('Check what is rendered on /auth/staff', async ({ page }) => {
    await page.goto('/auth/staff');
    await page.waitForLoadState('domcontentloaded');
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/debug-auth-staff.png' });
    
    // Log the page content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text on /auth/staff:', bodyText?.substring(0, 500));
    
    // Check if any h1 exists
    const h1Count = await page.locator('h1').count();
    console.log('Number of h1 elements:', h1Count);
    
    if (h1Count > 0) {
      const h1Text = await page.locator('h1').first().textContent();
      console.log('First h1 text:', h1Text);
    }
    
    // Check if any form elements exist
    const inputCount = await page.locator('input').count();
    console.log('Number of input elements:', inputCount);
  });

  test('Check what is rendered on /auth/customer', async ({ page }) => {
    await page.goto('/auth/customer');
    await page.waitForLoadState('domcontentloaded');
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/debug-auth-customer.png' });
    
    // Log the page content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text on /auth/customer:', bodyText?.substring(0, 500));
    
    // Check if any h1 exists
    const h1Count = await page.locator('h1').count();
    console.log('Number of h1 elements:', h1Count);
    
    if (h1Count > 0) {
      const h1Text = await page.locator('h1').first().textContent();
      console.log('First h1 text:', h1Text);
    }
  });

  test('Check what is rendered on /auth', async ({ page }) => {
    await page.goto('/auth');
    await page.waitForLoadState('domcontentloaded');
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/debug-auth.png' });
    
    // Log the page content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text on /auth:', bodyText?.substring(0, 500));
    
    // Check if any h1 exists
    const h1Count = await page.locator('h1').count();
    console.log('Number of h1 elements:', h1Count);
    
    if (h1Count > 0) {
      const h1Text = await page.locator('h1').first().textContent();
      console.log('First h1 text:', h1Text);
    }
  });
}); 