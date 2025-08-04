/**
 * Comprehensive Application Workflows E2E Tests
 * Tests complete user journeys and critical business workflows
 */

import { test, expect, Page } from '@playwright/test';

// Test configuration
const TEST_TIMEOUT = 30000;

// Test data
const testUser = {
  email: 'workflow-test@example.com',
  password: 'TestPassword123!',
  name: 'Workflow Test User'
};

// Helper functions
async function loginUser(page: Page) {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', testUser.email);
  await page.fill('[data-testid="password-input"]', testUser.password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('**/dashboard');
}

async function createDocument(page: Page, title: string, content: string) {
  await page.click('[data-testid="new-document-button"]');
  await page.fill('[data-testid="document-title-input"]', title);
  await page.fill('[data-testid="document-content-editor"]', content);
  await page.click('[data-testid="save-document-button"]');
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
}

async function createEmailCampaign(page: Page, name: string, subject: string) {
  await page.click('[data-testid="new-campaign-button"]');
  await page.fill('[data-testid="campaign-name-input"]', name);
  await page.fill('[data-testid="campaign-subject-input"]', subject);
  await page.fill('[data-testid="campaign-content-editor"]', 'Test email content');
  await page.click('[data-testid="save-campaign-button"]');
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
}

test.describe('Complete User Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await loginUser(page);
  });

  test('Complete document management workflow', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT);

    // Navigate to documents
    await page.click('[data-testid="documents-nav-link"]');
    await expect(page).toHaveURL('**/documents');

    // Create new document
    const documentTitle = `Test Document ${Date.now()}`;
    await createDocument(page, documentTitle, 'This is test content for the document.');

    // Verify document appears in list
    await expect(page.locator(`[data-testid="document-item"]:has-text("${documentTitle}")`)).toBeVisible();

    // Edit document
    await page.click(`[data-testid="document-item"]:has-text("${documentTitle}")`);
    await page.click('[data-testid="edit-document-button"]');
    await page.fill('[data-testid="document-title-input"]', `${documentTitle} - Edited`);
    await page.click('[data-testid="save-document-button"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // Verify edit was saved
    await page.goto('/documents');
    await expect(page.locator(`[data-testid="document-item"]:has-text("${documentTitle} - Edited")`)).toBeVisible();

    // Delete document
    await page.click(`[data-testid="document-item"]:has-text("${documentTitle} - Edited")`);
    await page.click('[data-testid="delete-document-button"]');
    await page.click('[data-testid="confirm-delete-button"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // Verify document is deleted
    await page.goto('/documents');
    await expect(page.locator(`[data-testid="document-item"]:has-text("${documentTitle}")`)).not.toBeVisible();
  });

  test('Complete email campaign workflow', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT);

    // Navigate to campaigns
    await page.click('[data-testid="campaigns-nav-link"]');
    await expect(page).toHaveURL('**/campaigns');

    // Create new campaign
    const campaignName = `Test Campaign ${Date.now()}`;
    await createEmailCampaign(page, campaignName, 'Test Subject');

    // Verify campaign appears in list
    await expect(page.locator(`[data-testid="campaign-item"]:has-text("${campaignName}")`)).toBeVisible();

    // Add recipients
    await page.click(`[data-testid="campaign-item"]:has-text("${campaignName}")`);
    await page.click('[data-testid="add-recipients-button"]');
    await page.fill('[data-testid="recipient-email-input"]', 'recipient1@example.com');
    await page.click('[data-testid="add-recipient-button"]');
    await page.fill('[data-testid="recipient-email-input"]', 'recipient2@example.com');
    await page.click('[data-testid="add-recipient-button"]');
    await page.click('[data-testid="save-recipients-button"]');

    // Verify recipients were added
    await expect(page.locator('[data-testid="recipient-count"]')).toContainText('2');

    // Schedule campaign
    await page.click('[data-testid="schedule-campaign-button"]');
    await page.fill('[data-testid="schedule-date-input"]', '2024-12-31');
    await page.fill('[data-testid="schedule-time-input"]', '10:00');
    await page.click('[data-testid="confirm-schedule-button"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // Verify campaign is scheduled
    await expect(page.locator('[data-testid="campaign-status"]')).toContainText('Scheduled');
  });

  test('User profile and settings workflow', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT);

    // Navigate to profile
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="profile-link"]');
    await expect(page).toHaveURL('**/profile');

    // Update profile information
    await page.fill('[data-testid="name-input"]', 'Updated Test User');
    await page.selectOption('[data-testid="timezone-select"]', 'America/New_York');
    await page.click('[data-testid="save-profile-button"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // Change password
    await page.click('[data-testid="change-password-tab"]');
    await page.fill('[data-testid="current-password-input"]', testUser.password);
    await page.fill('[data-testid="new-password-input"]', 'NewPassword123!');
    await page.fill('[data-testid="confirm-new-password-input"]', 'NewPassword123!');
    await page.click('[data-testid="change-password-button"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // Update notification preferences
    await page.click('[data-testid="notifications-tab"]');
    await page.check('[data-testid="email-notifications-checkbox"]');
    await page.uncheck('[data-testid="push-notifications-checkbox"]');
    await page.click('[data-testid="save-notifications-button"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // Verify changes persist after page reload
    await page.reload();
    await expect(page.locator('[data-testid="name-input"]')).toHaveValue('Updated Test User');
  });

  test('Dashboard analytics and reporting workflow', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT);

    // Verify dashboard loads with analytics
    await expect(page.locator('[data-testid="analytics-overview"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-campaigns-stat"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-emails-stat"]')).toBeVisible();
    await expect(page.locator('[data-testid="open-rate-stat"]')).toBeVisible();

    // Filter analytics by date range
    await page.click('[data-testid="date-range-picker"]');
    await page.click('[data-testid="last-30-days-option"]');
    await page.click('[data-testid="apply-filter-button"]');

    // Verify charts update
    await expect(page.locator('[data-testid="analytics-chart"]')).toBeVisible();
    await page.waitForTimeout(2000); // Wait for chart to load

    // Export analytics report
    await page.click('[data-testid="export-report-button"]');
    await page.selectOption('[data-testid="export-format-select"]', 'pdf');
    await page.click('[data-testid="confirm-export-button"]');
    await expect(page.locator('[data-testid="export-success-message"]')).toBeVisible();

    // View detailed campaign analytics
    await page.click('[data-testid="view-campaign-analytics-button"]');
    await expect(page).toHaveURL('**/analytics/campaigns');
    await expect(page.locator('[data-testid="campaign-performance-table"]')).toBeVisible();
  });

  test('Search and filtering workflow', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT);

    // Test document search
    await page.click('[data-testid="documents-nav-link"]');
    await page.fill('[data-testid="search-input"]', 'test');
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();

    // Apply filters
    await page.selectOption('[data-testid="type-filter"]', 'email');
    await page.selectOption('[data-testid="status-filter"]', 'published');
    await page.click('[data-testid="apply-filters-button"]');

    // Verify filtered results
    await expect(page.locator('[data-testid="filtered-results"]')).toBeVisible();

    // Clear filters
    await page.click('[data-testid="clear-filters-button"]');
    await expect(page.locator('[data-testid="all-documents"]')).toBeVisible();

    // Test campaign search
    await page.click('[data-testid="campaigns-nav-link"]');
    await page.fill('[data-testid="search-input"]', 'newsletter');
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });

  test('Error handling and recovery workflow', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT);

    // Test network error handling
    await page.route('**/api/**', route => route.abort());
    
    await page.click('[data-testid="documents-nav-link"]');
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();

    // Test retry functionality
    await page.unroute('**/api/**');
    await page.click('[data-testid="retry-button"]');
    await expect(page.locator('[data-testid="documents-list"]')).toBeVisible();

    // Test form validation errors
    await page.click('[data-testid="new-document-button"]');
    await page.click('[data-testid="save-document-button"]'); // Save without required fields
    await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();

    // Fix validation errors
    await page.fill('[data-testid="document-title-input"]', 'Valid Title');
    await page.fill('[data-testid="document-content-editor"]', 'Valid content');
    await page.click('[data-testid="save-document-button"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('Mobile responsive workflow', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT);

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Test mobile navigation
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-nav-menu"]')).toBeVisible();
    
    await page.click('[data-testid="documents-mobile-link"]');
    await expect(page).toHaveURL('**/documents');

    // Test mobile document creation
    await page.click('[data-testid="mobile-new-document-button"]');
    await page.fill('[data-testid="document-title-input"]', 'Mobile Test Document');
    await page.fill('[data-testid="document-content-editor"]', 'Mobile content');
    await page.click('[data-testid="save-document-button"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // Test mobile search
    await page.click('[data-testid="mobile-search-button"]');
    await page.fill('[data-testid="search-input"]', 'mobile');
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });

  test('Accessibility workflow', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT);

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="skip-to-content"]')).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('[data-testid="main-content"]')).toBeFocused();

    // Test screen reader support
    await expect(page.locator('[data-testid="main-content"]')).toHaveAttribute('role', 'main');
    await expect(page.locator('[data-testid="navigation"]')).toHaveAttribute('role', 'navigation');

    // Test ARIA labels
    await expect(page.locator('[data-testid="search-input"]')).toHaveAttribute('aria-label');
    await expect(page.locator('[data-testid="user-menu"]')).toHaveAttribute('aria-expanded');

    // Test focus management
    await page.click('[data-testid="new-document-button"]');
    await expect(page.locator('[data-testid="document-title-input"]')).toBeFocused();
  });
});
