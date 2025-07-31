import { test, expect } from '@playwright/test';

test.describe('Simple shadcn/ui Verification', () => {
  test('capture screenshots of shadcn components', async ({ page }) => {
    // Navigate and wait for auth page
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for any loading states to complete
    await page.waitForTimeout(5000);
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'screenshots/1-initial-load.png',
      fullPage: true 
    });

    // Check what's actually on the page
    const pageContent = await page.locator('body').innerHTML();
    console.log('Page HTML (first 500 chars):', pageContent.substring(0, 500));

    // Look for any form elements (login form)
    const forms = await page.locator('form').count();
    console.log(`Found ${forms} forms`);

    // Look for any buttons
    const allButtons = await page.locator('button').count();
    console.log(`Found ${allButtons} buttons total`);

    // Look for any input fields
    const inputs = await page.locator('input').count();
    console.log(`Found ${inputs} input fields`);

    // If we find a form, let's interact with it
    if (forms > 0) {
      await page.screenshot({ 
        path: 'screenshots/2-auth-form.png',
        fullPage: true 
      });

      // Try to find specific shadcn components
      const cards = await page.locator('div[class*="rounded"][class*="border"]').count();
      console.log(`Found ${cards} card-like elements`);

      // Check for Inter font
      const fontFamily = await page.evaluate(() => {
        const body = document.querySelector('body');
        return body ? window.getComputedStyle(body).fontFamily : 'not found';
      });
      console.log(`Font family: ${fontFamily}`);

      // Check CSS variables
      const cssVars = await page.evaluate(() => {
        const root = document.documentElement;
        const style = window.getComputedStyle(root);
        return {
          primary: style.getPropertyValue('--primary'),
          secondary: style.getPropertyValue('--secondary'),
          accent: style.getPropertyValue('--accent'),
          hasCSSVars: !!style.getPropertyValue('--primary')
        };
      });
      console.log('CSS Variables:', cssVars);

      // Try to fill login form if it exists
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      
      if (await emailInput.isVisible() && await passwordInput.isVisible()) {
        await emailInput.fill('demo@example.com');
        await passwordInput.fill('demo123');
        
        await page.screenshot({ 
          path: 'screenshots/3-filled-form.png',
          fullPage: true 
        });

        // Find and click login button
        const loginButton = page.locator('button[type="submit"]');
        if (await loginButton.isVisible()) {
          await loginButton.click();
          await page.waitForTimeout(3000);
          
          await page.screenshot({ 
            path: 'screenshots/4-after-login.png',
            fullPage: true 
          });
        }
      }
    }

    // Final screenshot
    await page.screenshot({ 
      path: 'screenshots/5-final-state.png',
      fullPage: true 
    });
  });
});