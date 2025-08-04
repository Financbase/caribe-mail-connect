import { test, expect } from '@playwright/test';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.test' });

const BASE_URL = process.env.VITE_APP_URL || 'http://localhost:3000';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'TestPassword123!';

test.describe('Real User Flow Tests', () => {
  test('should complete user signup and login flow', async ({ page, browser }) => {
    // Generate unique test email
    const timestamp = Date.now();
    const testEmail = `testuser_${timestamp}@example.com`;
    
    // 1. Navigate to signup page
    await page.goto(`${BASE_URL}/signup`);
    await expect(page).toHaveTitle(/Sign Up/);
    
    // 2. Fill out signup form
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', TEST_PASSWORD);
    await page.fill('input[name="confirmPassword"]', TEST_PASSWORD);
    
    // 3. Submit form
    await Promise.all([
      page.waitForResponse(response => 
        response.url().includes('/auth/v1/signup') && 
        response.status() === 200
      ),
      page.click('button[type="submit"]')
    ]);
    
    // 4. Verify redirection to login or dashboard
    await expect(page).toHaveURL(new RegExp(`${BASE_URL}/(login|dashboard)`));
    
    // If redirected to login, perform login
    if (page.url().includes('/login')) {
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="password"]', TEST_PASSWORD);
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.click('button[type="submit"]')
      ]);
    }
    
    // 5. Verify successful login
    await expect(page).toHaveURL(new RegExp(`${BASE_URL}/dashboard`));
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // 6. Test logout
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(new RegExp(`${BASE_URL}/(login|$)`));
  });

  test('should handle login with invalid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Fill with invalid credentials
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Submit and verify error message
    await page.click('button[type="submit"]');
    
    // Check for error message
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Invalid login credentials');
  });
});
