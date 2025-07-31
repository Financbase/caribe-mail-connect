import { test, expect } from '@playwright/test';

// Test suite for International Shipping Features
test.describe('International Shipping Features', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173');
    
    // TODO: Add authentication setup here
    // For now, we'll assume the user is already authenticated
  });

  test('should display international dashboard', async ({ page }) => {
    // Navigate to international page
    await page.goto('http://localhost:5173/#/international');
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="international-dashboard"]', { timeout: 10000 });
    
    // Verify the dashboard is displayed
    const dashboard = page.locator('[data-testid="international-dashboard"]');
    await expect(dashboard).toBeVisible();
  });

  test('should display all international tabs', async ({ page }) => {
    await page.goto('http://localhost:5173/#/international');
    
    // Check for all expected tabs
    const expectedTabs = [
      'Dashboard',
      'Rate Calculator', 
      'Customs Forms',
      'Tracking',
      'Compliance',
      'Analytics'
    ];
    
    for (const tabName of expectedTabs) {
      const tab = page.getByRole('tab', { name: tabName });
      await expect(tab).toBeVisible();
    }
  });

  test('should calculate international rates', async ({ page }) => {
    await page.goto('http://localhost:5173/#/international');
    
    // Click on Rate Calculator tab
    await page.getByRole('tab', { name: 'Rate Calculator' }).click();
    
    // Wait for rate calculator to load
    await page.waitForSelector('[data-testid="rate-calculator"]');
    
    // Fill in rate calculation form
    await page.selectOption('[data-testid="origin-country"]', 'PR');
    await page.selectOption('[data-testid="destination-country"]', 'DO');
    await page.fill('[data-testid="weight"]', '5');
    await page.selectOption('[data-testid="service-type"]', 'express');
    await page.fill('[data-testid="declared-value"]', '100');
    
    // Click calculate button
    await page.click('[data-testid="calculate-rate"]');
    
    // Verify results are displayed
    await expect(page.locator('[data-testid="rate-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-rate"]')).toContainText('$');
  });

  test('should convert currencies', async ({ page }) => {
    await page.goto('http://localhost:5173/#/international');
    
    // Navigate to currency converter (if it's in a separate tab or section)
    // For now, we'll test the currency converter component directly
    
    // Fill in currency conversion form
    await page.fill('[data-testid="amount"]', '100');
    await page.selectOption('[data-testid="from-currency"]', 'USD');
    await page.selectOption('[data-testid="to-currency"]', 'EUR');
    
    // Click convert button
    await page.click('[data-testid="convert-currency"]');
    
    // Verify conversion result
    await expect(page.locator('[data-testid="conversion-result"]')).toBeVisible();
  });

  test('should display country regulations', async ({ page }) => {
    await page.goto('http://localhost:5173/#/international');
    
    // Select a country from the world map or dropdown
    await page.selectOption('[data-testid="country-selector"]', 'DO');
    
    // Verify country regulations are displayed
    await expect(page.locator('[data-testid="country-regulations"]')).toBeVisible();
    await expect(page.locator('[data-testid="import-duty"]')).toContainText('%');
    await expect(page.locator('[data-testid="transit-time"]')).toBeVisible();
  });

  test('should generate customs forms', async ({ page }) => {
    await page.goto('http://localhost:5173/#/international');
    
    // Click on Customs Forms tab
    await page.getByRole('tab', { name: 'Customs Forms' }).click();
    
    // Wait for customs forms generator to load
    await page.waitForSelector('[data-testid="customs-forms-generator"]');
    
    // Fill in package details
    await page.fill('[data-testid="sender-name"]', 'John Doe');
    await page.fill('[data-testid="sender-address"]', '123 Main St, San Juan, PR');
    await page.fill('[data-testid="recipient-name"]', 'Jane Smith');
    await page.fill('[data-testid="recipient-address"]', '456 Oak Ave, Santo Domingo, DO');
    await page.fill('[data-testid="package-description"]', 'Electronics');
    await page.fill('[data-testid="package-value"]', '150');
    
    // Generate form
    await page.click('[data-testid="generate-form"]');
    
    // Verify form is generated
    await expect(page.locator('[data-testid="generated-form"]')).toBeVisible();
  });

  test('should track international packages', async ({ page }) => {
    await page.goto('http://localhost:5173/#/international');
    
    // Click on Tracking tab
    await page.getByRole('tab', { name: 'Tracking' }).click();
    
    // Wait for tracking component to load
    await page.waitForSelector('[data-testid="international-tracking"]');
    
    // Enter tracking number
    await page.fill('[data-testid="tracking-number"]', 'INT123456789');
    
    // Click track button
    await page.click('[data-testid="track-package"]');
    
    // Verify tracking results
    await expect(page.locator('[data-testid="tracking-results"]')).toBeVisible();
  });

  test('should check compliance requirements', async ({ page }) => {
    await page.goto('http://localhost:5173/#/international');
    
    // Click on Compliance tab
    await page.getByRole('tab', { name: 'Compliance' }).click();
    
    // Wait for compliance component to load
    await page.waitForSelector('[data-testid="prohibited-items-database"]');
    
    // Search for an item
    await page.fill('[data-testid="item-search"]', 'electronics');
    
    // Click search button
    await page.click('[data-testid="search-items"]');
    
    // Verify search results
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });

  test('should display world map with shipping zones', async ({ page }) => {
    await page.goto('http://localhost:5173/#/international');
    
    // Wait for world map to load
    await page.waitForSelector('[data-testid="world-map"]');
    
    // Verify world map is displayed
    const worldMap = page.locator('[data-testid="world-map"]');
    await expect(worldMap).toBeVisible();
    
    // Check for shipping zones legend
    await expect(page.locator('[data-testid="shipping-zones-legend"]')).toBeVisible();
  });

  test('should display international analytics', async ({ page }) => {
    await page.goto('http://localhost:5173/#/international');
    
    // Click on Analytics tab
    await page.getByRole('tab', { name: 'Analytics' }).click();
    
    // Wait for analytics component to load
    await page.waitForSelector('[data-testid="international-analytics"]');
    
    // Verify analytics charts are displayed
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="destination-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="performance-metrics"]')).toBeVisible();
  });

  test('should handle mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:5173/#/international');
    
    // Verify the page is responsive
    await expect(page.locator('[data-testid="international-dashboard"]')).toBeVisible();
    
    // Check that tabs are accessible on mobile
    const tabs = page.locator('[role="tab"]');
    await expect(tabs.first()).toBeVisible();
  });

  test('should support bilingual functionality', async ({ page }) => {
    await page.goto('http://localhost:5173/#/international');
    
    // Switch to English
    await page.click('[data-testid="language-toggle"]');
    
    // Verify content is in English
    await expect(page.getByText('International Shipping')).toBeVisible();
    
    // Switch back to Spanish
    await page.click('[data-testid="language-toggle"]');
    
    // Verify content is in Spanish
    await expect(page.getByText('Envíos Internacionales')).toBeVisible();
  });
});

// Test suite for API integration
test.describe('International API Integration', () => {
  test('should fetch exchange rates', async ({ page }) => {
    await page.goto('http://localhost:5173/#/international');
    
    // Mock API response for exchange rates
    await page.route('**/api/exchange-rates', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          USD: { EUR: 0.85, GBP: 0.73, JPY: 110.5 },
          EUR: { USD: 1.18, GBP: 0.86, JPY: 130.0 },
          lastUpdated: new Date().toISOString()
        })
      });
    });
    
    // Trigger exchange rate fetch
    await page.click('[data-testid="refresh-rates"]');
    
    // Verify rates are displayed
    await expect(page.locator('[data-testid="exchange-rates"]')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto('http://localhost:5173/#/international');
    
    // Mock API error
    await page.route('**/api/exchange-rates', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service temporarily unavailable' })
      });
    });
    
    // Trigger API call
    await page.click('[data-testid="refresh-rates"]');
    
    // Verify error message is displayed
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});

// Performance tests
test.describe('International Features Performance', () => {
  test('should load international dashboard within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:5173/#/international');
    await page.waitForSelector('[data-testid="international-dashboard"]');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle large datasets efficiently', async ({ page }) => {
    await page.goto('http://localhost:5173/#/international');
    
    // Mock large dataset
    await page.route('**/api/countries', async route => {
      const countries = Array.from({ length: 200 }, (_, i) => ({
        code: `C${i}`,
        name: `Country ${i}`,
        region: i % 5 === 0 ? 'Caribbean' : 'Latin America'
      }));
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(countries)
      });
    });
    
    // Verify the page handles large datasets without performance issues
    await expect(page.locator('[data-testid="country-selector"]')).toBeVisible();
  });
}); 