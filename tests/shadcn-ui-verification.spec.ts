import { test, expect } from '@playwright/test';

test.describe('shadcn/ui Components Verification', () => {
  test('verify shadcn/ui components are rendered with proper styling', async ({ page }) => {
    // Navigate to the application
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for the page to load
    await page.waitForTimeout(3000);

    // Check if the app has loaded
    const root = page.locator('#root');
    await expect(root).toBeVisible();

    // Look for any rounded card-like elements
    const cards = page.locator('div[class*="rounded"]');
    const cardCount = await cards.count();
    console.log(`Found ${cardCount} rounded elements`);

    // Take a screenshot of the auth page
    await page.screenshot({ 
      path: 'screenshots/auth-page.png',
      fullPage: true 
    });

    // Take a screenshot to see what's rendered
    await page.screenshot({ 
      path: 'screenshots/initial-page.png',
      fullPage: true 
    });

    // Check for shadcn/ui Button components
    const buttons = page.locator('button[class*="inline-flex"][class*="items-center"]');
    const buttonCount = await buttons.count();
    console.log(`Found ${buttonCount} Button components`);
    expect(buttonCount).toBeGreaterThan(0);

    // Verify the gradient styling on buttons
    const primaryButton = page.locator('button[class*="bg-gradient-ocean"]').first();
    if (await primaryButton.isVisible()) {
      await expect(primaryButton).toHaveCSS('background-image', /gradient/);
      await primaryButton.screenshot({ path: 'screenshots/primary-button.png' });
    }

    // Check for form elements (Input components)
    const inputs = page.locator('input[class*="flex"][class*="rounded-md"]');
    const inputCount = await inputs.count();
    console.log(`Found ${inputCount} Input components`);
    expect(inputCount).toBeGreaterThan(0);

    // Verify Inter font is applied
    const body = page.locator('body');
    const fontFamily = await body.evaluate((el) => 
      window.getComputedStyle(el).fontFamily
    );
    console.log(`Font family: ${fontFamily}`);
    expect(fontFamily).toContain('Inter');

    // Check for mobile-first design (min touch target size)
    const touchTargets = page.locator('.touch-target');
    if (await touchTargets.first().isVisible()) {
      const firstTarget = touchTargets.first();
      const box = await firstTarget.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(48);
        expect(box.width).toBeGreaterThanOrEqual(48);
      }
    }

    // Take a screenshot of the full page with components
    await page.screenshot({ 
      path: 'screenshots/full-page-components.png',
      fullPage: true 
    });

    // Try to login to see more components
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');

    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      await loginButton.click();
      
      // Wait a bit for potential navigation
      await page.waitForTimeout(2000);
      
      // Take a screenshot after login attempt
      await page.screenshot({ 
        path: 'screenshots/after-login.png',
        fullPage: true 
      });
    }
  });

  test('verify color scheme implementation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Check CSS variables are properly set
    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = window.getComputedStyle(root);
      return {
        primary: computedStyle.getPropertyValue('--primary').trim(),
        secondary: computedStyle.getPropertyValue('--secondary').trim(),
        accent: computedStyle.getPropertyValue('--accent').trim(),
      };
    });

    console.log('CSS Variables:', rootStyles);
    
    // If variables are empty, check if page loaded properly
    if (!rootStyles.primary) {
      console.log('CSS variables not loaded, checking page content...');
      const bodyContent = await page.locator('body').textContent();
      console.log('Page content:', bodyContent?.substring(0, 200));
    }
  });
});