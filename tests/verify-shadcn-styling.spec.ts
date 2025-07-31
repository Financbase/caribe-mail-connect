import { test, expect } from '@playwright/test';

test.describe('Verify shadcn/ui Styling', () => {
  test('check CSS is properly applied', async ({ page }) => {
    // Go to the app
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Check if CSS file is loaded
    const cssFiles = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map(link => ({
        href: link.href,
        loaded: link.sheet !== null
      }));
    });
    console.log('CSS Files:', cssFiles);

    // Check CSS variables
    const cssVariables = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = window.getComputedStyle(root);
      return {
        // Check our custom properties
        primary: computedStyle.getPropertyValue('--primary'),
        secondary: computedStyle.getPropertyValue('--secondary'),
        accent: computedStyle.getPropertyValue('--accent'),
        background: computedStyle.getPropertyValue('--background'),
        gradientOcean: computedStyle.getPropertyValue('--gradient-ocean'),
        gradientSunrise: computedStyle.getPropertyValue('--gradient-sunrise'),
        gradientTropical: computedStyle.getPropertyValue('--gradient-tropical'),
      };
    });
    console.log('CSS Variables:', cssVariables);

    // Take screenshot of initial state
    await page.screenshot({ 
      path: 'screenshots/css-test-1-initial.png',
      fullPage: true 
    });

    // Check if any element has gradient background
    const elementsWithGradients = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const gradientElements = [];
      
      allElements.forEach(el => {
        const bgImage = window.getComputedStyle(el).backgroundImage;
        if (bgImage && bgImage !== 'none' && bgImage.includes('gradient')) {
          gradientElements.push({
            tag: el.tagName,
            className: el.className,
            backgroundImage: bgImage
          });
        }
      });
      
      return gradientElements;
    });
    console.log('Elements with gradients:', elementsWithGradients);

    // Check specific components
    const authForm = page.locator('form').first();
    if (await authForm.isVisible()) {
      // Check if form has Card styling
      const formParent = await authForm.locator('..').first();
      const formStyles = await formParent.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          borderRadius: styles.borderRadius,
          backgroundColor: styles.backgroundColor,
          border: styles.border,
          boxShadow: styles.boxShadow
        };
      });
      console.log('Form container styles:', formStyles);
    }

    // Check buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const buttonStyles = await firstButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          backgroundImage: styles.backgroundImage,
          color: styles.color,
          borderRadius: styles.borderRadius,
          padding: styles.padding,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          boxShadow: styles.boxShadow,
          className: el.className
        };
      });
      console.log('Button styles:', buttonStyles);
      
      // Take screenshot of button
      await firstButton.screenshot({ path: 'screenshots/css-test-2-button.png' });
    }

    // Check if Inter font is loaded
    const fonts = await page.evaluate(() => {
      if ('fonts' in document) {
        return Array.from(document.fonts).map(font => ({
          family: font.family,
          status: font.status,
          style: font.style,
          weight: font.weight
        }));
      }
      return [];
    });
    console.log('Loaded fonts:', fonts);

    // Check body font
    const bodyFont = await page.evaluate(() => {
      const body = document.body;
      return window.getComputedStyle(body).fontFamily;
    });
    console.log('Body font-family:', bodyFont);

    // Create a test element to verify Tailwind is working
    await page.evaluate(() => {
      const testDiv = document.createElement('div');
      testDiv.className = 'bg-blue-500 text-white p-4 rounded-lg shadow-lg';
      testDiv.textContent = 'Tailwind Test';
      testDiv.id = 'tailwind-test';
      document.body.appendChild(testDiv);
    });

    await page.waitForTimeout(1000);

    // Check if test element has proper styles
    const testElement = page.locator('#tailwind-test');
    const testStyles = await testElement.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        padding: styles.padding,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow
      };
    });
    console.log('Tailwind test element styles:', testStyles);

    // Final screenshot
    await page.screenshot({ 
      path: 'screenshots/css-test-3-final.png',
      fullPage: true 
    });

    // Assertions
    expect(cssFiles.length).toBeGreaterThan(0);
    expect(bodyFont).toContain('Inter');
  });
});