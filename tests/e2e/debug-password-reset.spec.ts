import { test, expect } from '@playwright/test';

test.describe('Debug Password Reset', () => {
  test('Check password reset flow', async ({ page }) => {
    await page.goto('/auth/reset-password');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait a bit for the page to load
    await page.waitForTimeout(2000);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/debug-password-reset.png' });
    
    // Log the current URL
    console.log('Current URL:', page.url());
    
    // Check if we're on the reset password page
    const title = await page.locator('h1, h2, h3').first().textContent();
    console.log('Page title:', title);
    
    // Check for email input
    const emailInput = await page.locator('input[type="email"]');
    const emailInputExists = await emailInput.count() > 0;
    console.log('Email input exists:', emailInputExists);
    
    if (emailInputExists) {
      // Fill the email
      await emailInput.fill('test@example.com');
      console.log('Filled email input');
      
      // Find and click submit button
      const submitButton = await page.locator('button[type="submit"]');
      const submitButtonExists = await submitButton.count() > 0;
      console.log('Submit button exists:', submitButtonExists);
      
      if (submitButtonExists) {
        await submitButton.click();
        console.log('Clicked submit button');
        
        // Wait for response
        await page.waitForTimeout(3000);
        
        // Take another screenshot
        await page.screenshot({ path: 'test-results/debug-password-reset-after-submit.png' });
        
        // Check for success message
        const successText = await page.locator('text=Se ha enviado un correo de restablecimiento|Password reset email has been sent').count();
        console.log('Success text count:', successText);
        
        // Check for any success indicators
        const checkIcon = await page.locator('text=✓, .text-green-600, [data-testid="success"]').count();
        console.log('Success indicators count:', checkIcon);
        
        // Log all text content
        const bodyText = await page.locator('body').textContent();
        console.log('Body text after submit:', bodyText?.substring(0, 500));
      }
    }
  });
}); 