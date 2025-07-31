import { test, expect } from '@playwright/test';

test.describe('Application Diagnostics', () => {
  test('Check if React app loads at all', async ({ page }) => {
    // Navigate to the root
    await page.goto('/');
    
    // Wait for basic page load
    await page.waitForLoadState('domcontentloaded');
    
    // Check for any JavaScript errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit and check what's actually on the page
    await page.waitForTimeout(5000);
    
    // Get page content
    const bodyText = await page.textContent('body');
    const title = await page.title();
    
    console.log('Page title:', title);
    console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));
    console.log('JavaScript errors:', errors);
    
    // Check if there's any React-related content
    const hasReactContent = bodyText?.includes('PRMCMS') || 
                           bodyText?.includes('Puerto Rico') || 
                           bodyText?.includes('Personal') ||
                           bodyText?.includes('Cliente');
    
    console.log('Has React content:', hasReactContent);
    
    // Basic assertion - just check that the page loaded something
    expect(bodyText).toBeTruthy();
    expect(title).toBeTruthy();
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/diagnostic.png' });
  });
  
  test('Check for specific React mounting', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check if React root element exists
    const reactRoot = await page.$('#root');
    console.log('React root element exists:', !!reactRoot);
    
    if (reactRoot) {
      const rootContent = await reactRoot.textContent();
      console.log('React root content:', rootContent?.substring(0, 200));
    }
    
    // Check for any div elements (React components)
    const divs = await page.$$('div');
    console.log('Number of div elements:', divs.length);
    
    // Check for loading spinner
    const loader = await page.$('.app-loader');
    console.log('Loading spinner present:', !!loader);
    
    await page.screenshot({ path: 'test-results/diagnostic-react.png' });
  });
}); 