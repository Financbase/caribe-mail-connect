import { Page } from '@playwright/test';

// Helper function for other tests to use
export async function loginAsStaff(page: Page) {
  await page.goto('/auth/staff');
  await page.fill('input[type="email"]', 'staff@test.com');
  await page.fill('input[type="password"]', 'testpassword123');
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard (hash-based routing)
  await page.waitForURL('**/#/dashboard', { timeout: 10000 });
}

export async function loginAsAdmin(page: Page) {
  await page.goto('/auth/staff');
  await page.fill('input[type="email"]', 'admin@test.com');
  await page.fill('input[type="password"]', 'adminpass123');
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard (hash-based routing)
  await page.waitForURL('**/#/dashboard', { timeout: 10000 });
}

export async function loginAsCustomer(page: Page, email: string = 'customer@test.com', password: string = 'customerpass123') {
  await page.goto('/auth/customer');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for navigation to customer dashboard
  await page.waitForURL('**/#/customer-dashboard', { timeout: 10000 });
}
