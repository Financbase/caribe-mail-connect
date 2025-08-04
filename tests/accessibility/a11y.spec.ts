/**
 * Accessibility Testing Suite
 * Comprehensive accessibility tests for WCAG compliance
 */

import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Accessibility test configuration
const A11Y_CONFIG = {
  rules: {
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-management': { enabled: true },
    'aria-labels': { enabled: true },
    'heading-order': { enabled: true },
    'landmark-roles': { enabled: true }
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
};

// Helper functions
async function runAxeTest(page: Page, context?: string) {
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(A11Y_CONFIG.tags)
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
  
  if (context) {
    console.log(`✅ Accessibility test passed for: ${context}`);
  }
}

async function testKeyboardNavigation(page: Page, selectors: string[]) {
  // Start from the beginning
  await page.keyboard.press('Tab');
  
  for (const selector of selectors) {
    const element = page.locator(selector);
    await expect(element).toBeFocused();
    await page.keyboard.press('Tab');
  }
}

async function testScreenReaderContent(page: Page) {
  // Check for proper ARIA labels and descriptions
  const ariaElements = await page.locator('[aria-label], [aria-labelledby], [aria-describedby]').all();
  
  for (const element of ariaElements) {
    const ariaLabel = await element.getAttribute('aria-label');
    const ariaLabelledBy = await element.getAttribute('aria-labelledby');
    const ariaDescribedBy = await element.getAttribute('aria-describedby');
    
    if (ariaLabel) {
      expect(ariaLabel.trim()).not.toBe('');
    }
    
    if (ariaLabelledBy) {
      const labelElement = page.locator(`#${ariaLabelledBy}`);
      await expect(labelElement).toBeVisible();
    }
    
    if (ariaDescribedBy) {
      const descElement = page.locator(`#${ariaDescribedBy}`);
      await expect(descElement).toBeVisible();
    }
  }
}

test.describe('Accessibility Tests', () => {
  test('Dashboard accessibility compliance', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Run axe accessibility scan
    await runAxeTest(page, 'Dashboard');
    
    // Test keyboard navigation
    await testKeyboardNavigation(page, [
      '[data-testid="skip-to-content"]',
      '[data-testid="main-navigation"]',
      '[data-testid="user-menu"]',
      '[data-testid="search-input"]'
    ]);
    
    // Test screen reader content
    await testScreenReaderContent(page);
    
    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName);
      const level = parseInt(tagName.charAt(1));
      
      if (previousLevel > 0) {
        expect(level).toBeLessThanOrEqual(previousLevel + 1);
      }
      
      previousLevel = level;
    }
  });

  test('Login form accessibility', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Run axe accessibility scan
    await runAxeTest(page, 'Login Form');
    
    // Test form labels
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    
    await expect(emailInput).toHaveAttribute('aria-label');
    await expect(passwordInput).toHaveAttribute('aria-label');
    
    // Test keyboard navigation through form
    await page.keyboard.press('Tab');
    await expect(emailInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(passwordInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="login-button"]')).toBeFocused();
    
    // Test form submission with Enter key
    await emailInput.focus();
    await page.keyboard.press('Enter');
    // Should focus next field or submit form
    
    // Test error message accessibility
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.click('[data-testid="login-button"]');
    
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  test('Navigation accessibility', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Test skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('[data-testid="skip-to-content"]');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
    
    await page.keyboard.press('Enter');
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeFocused();
    
    // Test navigation landmarks
    await expect(page.locator('nav[role="navigation"]')).toBeVisible();
    await expect(page.locator('main[role="main"]')).toBeVisible();
    
    // Test navigation menu accessibility
    const navItems = page.locator('[data-testid="nav-item"]');
    const navCount = await navItems.count();
    
    for (let i = 0; i < navCount; i++) {
      const navItem = navItems.nth(i);
      await expect(navItem).toHaveAttribute('role', 'menuitem');
      
      const href = await navItem.getAttribute('href');
      if (href) {
        expect(href).not.toBe('#');
      }
    }
  });

  test('Data table accessibility', async ({ page }) => {
    await page.goto('/documents');
    await page.waitForLoadState('networkidle');
    
    // Run axe accessibility scan
    await runAxeTest(page, 'Data Table');
    
    // Test table structure
    const table = page.locator('[data-testid="documents-table"]');
    await expect(table).toHaveAttribute('role', 'table');
    
    // Test table headers
    const headers = page.locator('th');
    const headerCount = await headers.count();
    
    for (let i = 0; i < headerCount; i++) {
      const header = headers.nth(i);
      await expect(header).toHaveAttribute('scope');
    }
    
    // Test table caption
    const caption = page.locator('caption');
    if (await caption.count() > 0) {
      await expect(caption).toBeVisible();
    }
    
    // Test sortable columns
    const sortableHeaders = page.locator('[data-testid="sortable-header"]');
    const sortableCount = await sortableHeaders.count();
    
    for (let i = 0; i < sortableCount; i++) {
      const header = sortableHeaders.nth(i);
      await expect(header).toHaveAttribute('aria-sort');
      await expect(header).toHaveAttribute('tabindex', '0');
    }
  });

  test('Modal dialog accessibility', async ({ page }) => {
    await page.goto('/documents');
    await page.waitForLoadState('networkidle');
    
    // Open modal
    await page.click('[data-testid="new-document-button"]');
    
    const modal = page.locator('[data-testid="document-modal"]');
    await expect(modal).toBeVisible();
    
    // Test modal attributes
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(modal).toHaveAttribute('aria-labelledby');
    
    // Test focus trap
    const firstFocusable = page.locator('[data-testid="document-title-input"]');
    await expect(firstFocusable).toBeFocused();
    
    // Test escape key closes modal
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
    
    // Test focus restoration
    const triggerButton = page.locator('[data-testid="new-document-button"]');
    await expect(triggerButton).toBeFocused();
  });

  test('Form validation accessibility', async ({ page }) => {
    await page.goto('/documents');
    await page.click('[data-testid="new-document-button"]');
    
    // Submit form without required fields
    await page.click('[data-testid="save-document-button"]');
    
    // Test error messages
    const titleError = page.locator('[data-testid="title-error"]');
    await expect(titleError).toBeVisible();
    await expect(titleError).toHaveAttribute('role', 'alert');
    
    const titleInput = page.locator('[data-testid="document-title-input"]');
    await expect(titleInput).toHaveAttribute('aria-invalid', 'true');
    await expect(titleInput).toHaveAttribute('aria-describedby');
    
    // Test error message association
    const describedBy = await titleInput.getAttribute('aria-describedby');
    if (describedBy) {
      const errorElement = page.locator(`#${describedBy}`);
      await expect(errorElement).toBeVisible();
    }
  });

  test('Color contrast compliance', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Test color contrast using axe
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('[data-testid="main-content"]')
      .analyze();
    
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(contrastViolations).toHaveLength(0);
  });

  test('Focus indicators visibility', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Test focus indicators on interactive elements
    const interactiveElements = [
      '[data-testid="search-input"]',
      '[data-testid="user-menu"]',
      '[data-testid="documents-nav-link"]',
      '[data-testid="campaigns-nav-link"]'
    ];
    
    for (const selector of interactiveElements) {
      const element = page.locator(selector);
      await element.focus();
      
      // Check if focus indicator is visible
      const focusStyles = await element.evaluate(el => {
        const styles = window.getComputedStyle(el, ':focus');
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          outlineStyle: styles.outlineStyle,
          boxShadow: styles.boxShadow
        };
      });
      
      // Should have visible focus indicator
      const hasFocusIndicator = 
        focusStyles.outline !== 'none' ||
        focusStyles.outlineWidth !== '0px' ||
        focusStyles.boxShadow !== 'none';
      
      expect(hasFocusIndicator).toBe(true);
    }
  });

  test('Screen reader announcements', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Test live regions
    const liveRegions = page.locator('[aria-live]');
    const liveRegionCount = await liveRegions.count();
    
    for (let i = 0; i < liveRegionCount; i++) {
      const region = liveRegions.nth(i);
      const ariaLive = await region.getAttribute('aria-live');
      expect(['polite', 'assertive', 'off']).toContain(ariaLive);
    }
    
    // Test status messages
    await page.click('[data-testid="refresh-data-button"]');
    
    const statusMessage = page.locator('[data-testid="status-message"]');
    if (await statusMessage.count() > 0) {
      await expect(statusMessage).toHaveAttribute('role', 'status');
    }
  });

  test('Mobile accessibility', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Run axe accessibility scan for mobile
    await runAxeTest(page, 'Mobile Dashboard');
    
    // Test touch targets size
    const touchTargets = page.locator('button, a, [role="button"]');
    const targetCount = await touchTargets.count();
    
    for (let i = 0; i < Math.min(targetCount, 10); i++) {
      const target = touchTargets.nth(i);
      const boundingBox = await target.boundingBox();
      
      if (boundingBox) {
        // WCAG recommends minimum 44x44 pixels for touch targets
        expect(boundingBox.width).toBeGreaterThanOrEqual(44);
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      }
    }
    
    // Test mobile navigation
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    if (await mobileMenuButton.count() > 0) {
      await expect(mobileMenuButton).toHaveAttribute('aria-expanded');
      await expect(mobileMenuButton).toHaveAttribute('aria-controls');
    }
  });

  test('Reduced motion preferences', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check that animations are disabled or reduced
    const animatedElements = page.locator('[data-testid*="animated"], .animate-');
    const animatedCount = await animatedElements.count();
    
    for (let i = 0; i < animatedCount; i++) {
      const element = animatedElements.nth(i);
      const styles = await element.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          animationDuration: computed.animationDuration,
          transitionDuration: computed.transitionDuration
        };
      });
      
      // Animations should be disabled or very short
      expect(
        styles.animationDuration === '0s' || 
        styles.transitionDuration === '0s' ||
        styles.animationDuration === '0.01s' ||
        styles.transitionDuration === '0.01s'
      ).toBe(true);
    }
  });

  test('High contrast mode support', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Run accessibility scan in high contrast mode
    await runAxeTest(page, 'High Contrast Mode');
    
    // Test that content is still visible and accessible
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const navigation = page.locator('[data-testid="main-navigation"]');
    await expect(navigation).toBeVisible();
  });
});
