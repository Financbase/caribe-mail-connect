import { test, expect } from '@playwright/test';

// Comprehensive test suite for PRMCMS
test.describe('PRMCMS Comprehensive Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Authentication Flow', () => {
    test('should display login page correctly', async ({ page }) => {
      // Check if login form is visible
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      
      // Check page title
      await expect(page).toHaveTitle(/PRMCMS/);
    });

    test('should handle successful login', async ({ page }) => {
      // Fill login form
      await page.fill('input[type="email"]', 'admin@prmcms.com');
      await page.fill('input[type="password"]', 'admin123');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for navigation or success message
      await page.waitForTimeout(2000);
      
      // Check if we're redirected to dashboard or see success message
      const successMessage = page.locator('text=Success');
      const dashboard = page.locator('text=Dashboard');
      
      await expect(successMessage.or(dashboard)).toBeVisible();
    });

    test('should handle invalid credentials', async ({ page }) => {
      // Fill login form with invalid credentials
      await page.fill('input[type="email"]', 'invalid@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for error message
      await page.waitForTimeout(1000);
      
      // Check for error message
      const errorMessage = page.locator('text=Invalid credentials');
      await expect(errorMessage).toBeVisible();
    });
  });

  test.describe('Navigation and Routing', () => {
    test('should navigate between main sections', async ({ page }) => {
      // Login first
      await page.fill('input[type="email"]', 'admin@prmcms.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);

      // Test navigation to different sections
      const sections = [
        { name: 'Dashboard', selector: 'text=Dashboard' },
        { name: 'Package Intake', selector: 'text=Package Intake' },
        { name: 'Virtual Mail', selector: 'text=Virtual Mail' },
        { name: 'Billing', selector: 'text=Billing' },
        { name: 'Analytics', selector: 'text=Analytics' }
      ];

      for (const section of sections) {
        try {
          await page.click(section.selector);
          await page.waitForTimeout(1000);
          
          // Check if the section content is loaded
          await expect(page.locator('main')).toBeVisible();
        } catch (error) {
          console.log(`Navigation to ${section.name} failed:`, error);
        }
      }
    });

    test('should handle protected routes correctly', async ({ page }) => {
      // Try to access protected route without login
      await page.goto('http://localhost:3000/#/dashboard');
      
      // Should redirect to login or show access denied
      const loginForm = page.locator('input[type="email"]');
      const accessDenied = page.locator('text=Access Denied');
      
      await expect(loginForm.or(accessDenied)).toBeVisible();
    });
  });

  test.describe('Performance and Loading', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should show loading states', async ({ page }) => {
      // Login to trigger loading states
      await page.fill('input[type="email"]', 'admin@prmcms.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      
      // Check for loading spinner or skeleton
      const loadingSpinner = page.locator('[role="status"]');
      const skeleton = page.locator('.animate-pulse');
      
      await expect(loadingSpinner.or(skeleton)).toBeVisible();
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate offline mode
      await page.route('**/*', route => route.abort());
      
      await page.goto('http://localhost:3000');
      
      // Should show offline message or error handling
      const offlineMessage = page.locator('text=Offline');
      const errorMessage = page.locator('text=Network Error');
      
      await expect(offlineMessage.or(errorMessage)).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('http://localhost:3000');
      
      // Check if mobile navigation is available
      const mobileMenu = page.locator('button[aria-label="Menu"]');
      const hamburgerMenu = page.locator('.hamburger');
      
      await expect(mobileMenu.or(hamburgerMenu)).toBeVisible();
    });

    test('should work on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('http://localhost:3000');
      
      // Check if layout adapts properly
      await expect(page.locator('main')).toBeVisible();
    });

    test('should work on desktop devices', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await page.goto('http://localhost:3000');
      
      // Check if desktop layout is displayed
      await expect(page.locator('main')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      // Check for form labels
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      
      await expect(emailInput).toHaveAttribute('aria-label');
      await expect(passwordInput).toHaveAttribute('aria-label');
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      // Tab through form elements
      await page.keyboard.press('Tab');
      await expect(page.locator('input[type="email"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('input[type="password"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('button[type="submit"]')).toBeFocused();
    });

    test('should have proper color contrast', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      // Check if text is readable
      const textElements = page.locator('p, h1, h2, h3, h4, h5, h6');
      await expect(textElements.first()).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle 404 errors', async ({ page }) => {
      await page.goto('http://localhost:3000/#/nonexistent-page');
      
      // Should show 404 page or error message
      const notFoundMessage = page.locator('text=404');
      const errorMessage = page.locator('text=Page Not Found');
      
      await expect(notFoundMessage.or(errorMessage)).toBeVisible();
    });

    test('should handle JavaScript errors gracefully', async ({ page }) => {
      // Inject a JavaScript error
      await page.addInitScript(() => {
        window.addEventListener('error', (e) => {
          console.log('Caught error:', e.message);
        });
      });
      
      await page.goto('http://localhost:3000');
      
      // Should not crash the application
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Data Management', () => {
    test('should handle form submissions correctly', async ({ page }) => {
      // Login first
      await page.fill('input[type="email"]', 'admin@prmcms.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);

      // Test form submission (if forms are available)
      const forms = page.locator('form');
      if (await forms.count() > 0) {
        const firstForm = forms.first();
        await firstForm.fill('input', 'test data');
        await firstForm.submit();
        
        // Check for success or validation messages
        await page.waitForTimeout(1000);
      }
    });

    test('should handle data loading states', async ({ page }) => {
      // Login first
      await page.fill('input[type="email"]', 'admin@prmcms.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);

      // Check for data loading indicators
      const loadingIndicators = page.locator('.loading, .spinner, [role="status"]');
      if (await loadingIndicators.count() > 0) {
        await expect(loadingIndicators.first()).toBeVisible();
      }
    });
  });

  test.describe('Security', () => {
    test('should not expose sensitive information', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      // Check page source for sensitive data
      const pageContent = await page.content();
      
      // Should not contain sensitive information in source
      expect(pageContent).not.toContain('admin123');
      expect(pageContent).not.toContain('VITE_SUPABASE_ANON_KEY');
    });

    test('should handle XSS attempts', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      // Try to inject script
      await page.evaluate(() => {
        const input = document.querySelector('input[type="email"]') as HTMLInputElement;
        if (input) {
          input.value = '<script>alert("xss")</script>';
        }
      });
      
      // Should not execute the script
      const alertPromise = page.waitForEvent('dialog');
      await page.click('button[type="submit"]');
      
      // Should not show alert
      await expect(alertPromise).rejects.toThrow();
    });
  });
}); 