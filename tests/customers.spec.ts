import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './utils/auth-helpers';

const TEST_CUSTOMER = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'johndoe@example.com',
  phone: '555-1234',
  business_name: 'Doe Enterprises',
  mailbox_number: 'MB123',
  address_line1: '123 Main St',
  address_line2: '',
  city: 'San Juan',
  state: 'PR',
  zip_code: '00901',
  country: 'US',
  customer_type: 'individual',
  notes: 'VIP customer'
};

// Helper function to navigate to customer management
async function navigateToCustomerManagement(page) {
  await page.goto('/#/customers');
  await page.waitForLoadState('networkidle');
}

test.describe('Customer Management Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    await loginAsAdmin(page);
  });

  test('Can add a new customer', async ({ page }) => {
    await navigateToCustomerManagement(page);

    // Click add customer button
    await page.click('text=Add New Customer');

    // Fill customer form
    await page.fill('input[name="first_name"]', TEST_CUSTOMER.first_name);
    await page.fill('input[name="last_name"]', TEST_CUSTOMER.last_name);
    await page.fill('input[name="email"]', TEST_CUSTOMER.email);
    await page.fill('input[name="phone"]', TEST_CUSTOMER.phone);
    await page.fill('input[name="business_name"]', TEST_CUSTOMER.business_name);
    await page.fill('input[name="mailbox_number"]', TEST_CUSTOMER.mailbox_number);
    await page.fill('input[name="address_line1"]', TEST_CUSTOMER.address_line1);
    await page.fill('input[name="city"]', TEST_CUSTOMER.city);
    await page.fill('input[name="state"]', TEST_CUSTOMER.state);
    await page.fill('input[name="zip_code"]', TEST_CUSTOMER.zip_code);
    await page.fill('input[name="customer_type"]', TEST_CUSTOMER.customer_type);
    await page.fill('textarea[name="notes"]', TEST_CUSTOMER.notes);

    // Click save
    await page.click('text=Create Customer');

    // Check for success message
    const successMessage = page.locator('text=Customer Created');
    await expect(successMessage).toBeVisible();
  });

  test('Can view customer list', async ({ page }) => {
    await navigateToCustomerManagement(page);

    // Check if customer list is visible
    const customerList = page.locator('ul[data-testid="customer-list"]');
    await expect(customerList).toBeVisible();
  });

  test('Can update customer information', async ({ page }) => {
    await navigateToCustomerManagement(page);

    // Click on a customer
    const customerItem = page.locator('li[data-testid="customer-item"]').first();
    await customerItem.click();

    // Change phone number
    await page.fill('input[name="phone"]', '555-5678');

    // Click save
    await page.click('text=Update Customer');

    // Check for success message
    const successMessage = page.locator('text=Customer Updated');
    await expect(successMessage).toBeVisible();
  });

  test('Can search for customers', async ({ page }) => {
    await navigateToCustomerManagement(page);

    // Enter search query
    await page.fill('input[type="search"]', 'Doe');

    // Check that results are filtered correctly
    const filteredCustomer = page.locator('li[data-testid="customer-item"]');
    await expect(filteredCustomer).toContainText('Doe');
  });

  test('Can link customer to packages', async ({ page }) => {
    await navigateToCustomerManagement(page);

    // Click on a customer
    const customerItem = page.locator('li[data-testid="customer-item"]').first();
    await customerItem.click();

    // Navigate to link packages
    await page.click('text=Link Packages');

    // Select a package
    const packageOption = page.locator('option').first();
    await packageOption.click();

    // Save package link
    await page.click('text=Link Package');

    // Check for confirmation
    const confirmationMessage = page.locator('text=Package Linked');
    await expect(confirmationMessage).toBeVisible();
  });

});

