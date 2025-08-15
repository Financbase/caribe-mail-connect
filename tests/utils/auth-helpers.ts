import { Page } from '@playwright/test';

// Helper function for other tests to use
export async function loginAsStaff(page: Page) {
  await page.goto('/auth/staff');
  await page.fill('input[type="email"]', 'staff@test.com');
  const staffPassword = process.env.PLAYWRIGHT_STAFF_PASSWORD || process.env.TEST_USER_PASSWORD || 'testpassword123';
  await page.fill('input[type="password"]', staffPassword);
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard (hash-based routing)
  await page.waitForURL('**/#/dashboard', { timeout: 10000 });
}

export async function loginAsAdmin(page: Page) {
  await page.goto('/auth/staff');
  await page.fill('input[type="email"]', 'admin@test.com');
  const adminPassword = process.env.PLAYWRIGHT_ADMIN_PASSWORD || process.env.TEST_USER_PASSWORD || 'adminpass123';
  await page.fill('input[type="password"]', adminPassword);
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard (hash-based routing)
  await page.waitForURL('**/#/dashboard', { timeout: 10000 });
}

export async function loginAsCustomer(page: Page, email: string = 'customer@test.com', password: string = process.env.PLAYWRIGHT_CUSTOMER_PASSWORD || process.env.TEST_USER_PASSWORD || 'customerpass123') {
  await page.goto('/auth/customer');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for navigation to customer dashboard
  await page.waitForURL('**/#/customer-dashboard', { timeout: 10000 });
}
