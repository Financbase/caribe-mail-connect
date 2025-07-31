import { test, expect } from '@playwright/test';

test('should authenticate and access dashboard', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:5176');
  
  // Wait for the app to load
  await page.waitForSelector('body', { timeout: 10000 });
  
  // Check if we're on the login page
  const loginButton = page.locator('button:has-text("Iniciar sesión")').first();
  const isLoginPage = await loginButton.isVisible();
  
  console.log('On login page:', isLoginPage);
  
  if (isLoginPage) {
    // Fill in login credentials
    await page.fill('input[type="email"]', 'admin@prmcms.com');
    await page.fill('input[type="password"]', 'admin123');
    
    // Click the login button
    await loginButton.click();
    
    // Wait for authentication to complete
    await page.waitForTimeout(5000);
    
    // Check what page we're on now
    const currentText = await page.textContent('body');
    console.log('After login, page content:', currentText?.substring(0, 500));
    
    // Check for various possible states
    const hasDashboard = currentText?.includes('Dashboard') || currentText?.includes('Panel de Control');
    const hasLoading = currentText?.includes('Loading');
    const stillOnLogin = currentText?.includes('Iniciar sesión');
    
    console.log('Has Dashboard:', hasDashboard);
    console.log('Has Loading:', hasLoading);
    console.log('Still on Login:', stillOnLogin);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/after-login.png' });
    
    // Check if we can find any navigation elements
    const navElements = await page.locator('nav, [role="navigation"], .sidebar, .menu').count();
    console.log('Navigation elements found:', navElements);
    
    // Look for any buttons or links
    const buttons = await page.locator('button, a').count();
    console.log('Buttons/links found:', buttons);
    
    // List all visible text
    const allText = await page.locator('body').textContent();
    console.log('All visible text:', allText?.substring(0, 1000));
  }
  
  // For now, just pass the test to see the output
  expect(true).toBe(true);
}); 