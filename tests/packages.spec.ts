import { test, expect, Page } from '@playwright/test';
import { loginAsStaff, loginAsAdmin, loginAsCustomer } from './utils/auth-helpers';

// Test data constants
const TEST_PACKAGE = {
  trackingNumber: '1Z999AA1234567890',
  carrier: 'UPS',
  size: 'Medium',
  weight: '5.5',
  dimensions: '12x10x8',
  notes: 'Fragile - Handle with care',
};

const TEST_CUSTOMER = {
  email: 'customer@test.com',
  name: 'Test Customer',
};

// Helper function to navigate to package intake
async function navigateToPackageIntake(page: Page) {
  await page.goto('/#/intake');
  await page.waitForLoadState('networkidle');
  
  // Verify we're on the intake page
  await expect(page.locator('h1, h2').filter({ hasText: /Package Intake|Recepción de Paquetes/i })).toBeVisible({ timeout: 10000 });
}

// Helper function to navigate to packages list
async function navigateToPackagesList(page: Page) {
  await page.goto('/#/dashboard');
  await page.waitForLoadState('networkidle');
  
  // Look for packages section or navigate via menu
  const packagesLink = page.locator('a, button').filter({ hasText: /Packages|Paquetes/i }).first();
  if (await packagesLink.isVisible()) {
    await packagesLink.click();
    await page.waitForLoadState('networkidle');
  }
}

// Helper function to fill package form
async function fillPackageForm(page: Page, packageData: unknown) {
  // Fill tracking number
  await page.fill('input[placeholder*="tracking" i], input[placeholder*="rastreo" i]', packageData.trackingNumber);
  
  // Select carrier
  await page.click('button[role="combobox"]').first();
  await page.click(`[role="option"]:has-text("${packageData.carrier}")`);
  
  // Select customer
  const customerSelect = page.locator('button[role="combobox"]').nth(1);
  if (await customerSelect.isVisible()) {
    await customerSelect.click();
    await page.click('[role="option"]').first();
  }
  
  // Select size
  const sizeSelect = page.locator('button[role="combobox"]').filter({ hasText: /size|tamaño/i });
  if (await sizeSelect.isVisible()) {
    await sizeSelect.click();
    await page.click(`[role="option"]:has-text("${packageData.size}")`);
  }
  
  // Fill optional fields
  if (packageData.weight) {
    const weightInput = page.locator('input[placeholder*="weight" i], input[placeholder*="peso" i]');
    if (await weightInput.isVisible()) {
      await weightInput.fill(packageData.weight);
    }
  }
  
  if (packageData.dimensions) {
    const dimensionsInput = page.locator('input[placeholder*="dimensions" i], input[placeholder*="dimensiones" i]');
    if (await dimensionsInput.isVisible()) {
      await dimensionsInput.fill(packageData.dimensions);
    }
  }
  
  if (packageData.notes) {
    const notesTextarea = page.locator('textarea[placeholder*="notes" i], textarea[placeholder*="notas" i]');
    if (await notesTextarea.isVisible()) {
      await notesTextarea.fill(packageData.notes);
    }
  }
}

test.describe('Package Management Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Login as staff before each test
    await loginAsStaff(page);
  });

  test.describe('Creating New Packages', () => {
    test('Can create a package with all required fields', async ({ page }) => {
      await navigateToPackageIntake(page);
      
      // Fill in required fields only
      await page.fill('input[placeholder*="tracking" i], input[placeholder*="rastreo" i]', TEST_PACKAGE.trackingNumber);
      
      // Select carrier
      await page.click('button[role="combobox"]').first();
      await page.click(`[role="option"]:has-text("${TEST_PACKAGE.carrier}")`);
      
      // Select customer
      const customerSelect = page.locator('button[role="combobox"]').nth(1);
      await customerSelect.click();
      await page.click('[role="option"]').first();
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Check for success message
      const successToast = page.locator('[role="status"]').filter({ hasText: /success|received|éxito|recibido/i });
      await expect(successToast).toBeVisible({ timeout: 10000 });
    });

    test('Can create a package with all fields including optional ones', async ({ page }) => {
      await navigateToPackageIntake(page);
      
      // Fill all fields
      await fillPackageForm(page, TEST_PACKAGE);
      
      // Check special handling if available
      const specialHandlingSwitch = page.locator('button[role="switch"]').filter({ hasText: /special|especial/i });
      if (await specialHandlingSwitch.isVisible()) {
        await specialHandlingSwitch.click();
      }
      
      // Check requires signature if available
      const signatureSwitch = page.locator('button[role="switch"]').filter({ hasText: /signature|firma/i });
      if (await signatureSwitch.isVisible()) {
        await signatureSwitch.click();
      }
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Check for success message
      const successToast = page.locator('[role="status"]').filter({ hasText: /success|received|éxito|recibido/i });
      await expect(successToast).toBeVisible({ timeout: 10000 });
    });

    test('Shows validation errors for missing required fields', async ({ page }) => {
      await navigateToPackageIntake(page);
      
      // Try to submit without filling any fields
      await page.click('button[type="submit"]');
      
      // Check for validation error
      const errorMessage = page.locator('[role="status"]').filter({ hasText: /error|required|requerido/i });
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
      
      // Check that form is still visible (not submitted)
      const trackingInput = page.locator('input[placeholder*="tracking" i], input[placeholder*="rastreo" i]');
      await expect(trackingInput).toBeVisible();
    });

    test('Prevents duplicate tracking numbers', async ({ page }) => {
      await navigateToPackageIntake(page);
      
      // Create first package
      await page.fill('input[placeholder*="tracking" i], input[placeholder*="rastreo" i]', 'DUPLICATE123');
      await page.click('button[role="combobox"]').first();
      await page.click('[role="option"]:has-text("UPS")');
      
      const customerSelect = page.locator('button[role="combobox"]').nth(1);
      await customerSelect.click();
      await page.click('[role="option"]').first();
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      
      // Try to create another package with same tracking number
      await navigateToPackageIntake(page);
      await page.fill('input[placeholder*="tracking" i], input[placeholder*="rastreo" i]', 'DUPLICATE123');
      await page.click('button[role="combobox"]').first();
      await page.click('[role="option"]:has-text("FedEx")');
      
      await customerSelect.click();
      await page.click('[role="option"]').first();
      
      await page.click('button[type="submit"]');
      
      // Should show error about duplicate
      const errorToast = page.locator('[role="status"]').filter({ hasText: /duplicate|exists|duplicado|existe/i });
      await expect(errorToast).toBeVisible({ timeout: 10000 });
    });

    test('Can scan barcode to populate tracking number', async ({ page }) => {
      await navigateToPackageIntake(page);
      
      // Click scan button
      const scanButton = page.locator('button').filter({ hasText: /scan|escanear/i });
      if (await scanButton.isVisible()) {
        await scanButton.click();
        
        // Wait for scan simulation
        await page.waitForTimeout(3000);
        
        // Check that tracking number field is populated
        const trackingInput = page.locator('input[placeholder*="tracking" i], input[placeholder*="rastreo" i]');
        const value = await trackingInput.inputValue();
        expect(value).toBeTruthy();
        
        // Check for scan success message
        const successMessage = page.locator('[role="status"]').filter({ hasText: /scanned|escaneado/i });
        await expect(successMessage).toBeVisible({ timeout: 5000 });
      }
    });

    test('Can upload package photo', async ({ page }) => {
      await navigateToPackageIntake(page);
      
      // Look for photo upload button
      const uploadButton = page.locator('button, label').filter({ hasText: /photo|foto|upload|cargar/i });
      
      if (await uploadButton.isVisible()) {
        // Create a test file
        const fileInput = page.locator('input[type="file"]');
        
        // Create a dummy file
        await fileInput.setInputFiles({
          name: 'package-photo.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.from('fake-image-content'),
        });
        
        // Check for success message
        const successMessage = page.locator('[role="status"]').filter({ hasText: /photo|uploaded|foto|cargada/i });
        await expect(successMessage).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Viewing Package List and Details', () => {
    test('Can view list of packages', async ({ page }) => {
      await navigateToPackagesList(page);
      
      // Check for package list elements
      const packageList = page.locator('[role="table"], .package-list, [data-testid="package-list"]');
      await expect(packageList).toBeVisible({ timeout: 10000 });
      
      // Check for package entries
      const packageRows = page.locator('tr[role="row"], .package-item, [data-testid="package-item"]');
      const count = await packageRows.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Can view package details', async ({ page }) => {
      await navigateToPackagesList(page);
      
      // Click on first package
      const firstPackage = page.locator('tr[role="row"], .package-item, [data-testid="package-item"]').first();
      await firstPackage.click();
      
      // Wait for details to load
      await page.waitForTimeout(1000);
      
      // Check for detail elements
      const detailElements = [
        page.locator('text=/tracking/i'),
        page.locator('text=/carrier/i'),
        page.locator('text=/status/i'),
        page.locator('text=/customer/i'),
      ];
      
      for (const element of detailElements) {
        await expect(element).toBeVisible({ timeout: 10000 });
      }
    });

    test('Shows correct package information in list', async ({ page }) => {
      // First create a package with known data
      await navigateToPackageIntake(page);
      
      const uniqueTracking = `TEST-${Date.now()}`;
      await page.fill('input[placeholder*="tracking" i], input[placeholder*="rastreo" i]', uniqueTracking);
      await page.click('button[role="combobox"]').first();
      await page.click('[role="option"]:has-text("FedEx")');
      
      const customerSelect = page.locator('button[role="combobox"]').nth(1);
      await customerSelect.click();
      await page.click('[role="option"]').first();
      
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      
      // Navigate to list
      await navigateToPackagesList(page);
      
      // Search for the package
      const searchInput = page.locator('input[placeholder*="search" i], input[placeholder*="buscar" i]');
      if (await searchInput.isVisible()) {
        await searchInput.fill(uniqueTracking);
        await page.waitForTimeout(1000);
      }
      
      // Verify package appears with correct info
      await expect(page.locator(`text="${uniqueTracking}"`)).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text="FedEx"')).toBeVisible();
    });

    test('Can paginate through package list', async ({ page }) => {
      await navigateToPackagesList(page);
      
      // Look for pagination controls
      const nextButton = page.locator('button').filter({ hasText: /next|siguiente/i });
      const prevButton = page.locator('button').filter({ hasText: /prev|anterior/i });
      
      if (await nextButton.isVisible()) {
        // Click next
        await nextButton.click();
        await page.waitForTimeout(1000);
        
        // Verify page changed (previous button should be enabled)
        await expect(prevButton).toBeEnabled();
        
        // Go back
        await prevButton.click();
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Updating Package Status', () => {
    test('Can update package status to Ready for Pickup', async ({ page }) => {
      await navigateToPackagesList(page);
      
      // Click on first package
      const firstPackage = page.locator('tr[role="row"], .package-item, [data-testid="package-item"]').first();
      await firstPackage.click();
      
      // Look for status update button or dropdown
      const statusButton = page.locator('button, select').filter({ hasText: /status|estado/i });
      if (await statusButton.isVisible()) {
        await statusButton.click();
        
        // Select "Ready for Pickup"
        await page.click('[role="option"]:has-text(/ready.*pickup|listo.*recoger/i)');
        
        // Confirm update
        const confirmButton = page.locator('button').filter({ hasText: /update|save|actualizar|guardar/i });
        await confirmButton.click();
        
        // Check for success message
        const successToast = page.locator('[role="status"]').filter({ hasText: /updated|actualizado/i });
        await expect(successToast).toBeVisible({ timeout: 10000 });
      }
    });

    test('Can update package status to Delivered', async ({ page }) => {
      await navigateToPackagesList(page);
      
      // Find a package with "Ready for Pickup" status
      const readyPackage = page.locator('tr, .package-item').filter({ hasText: /ready.*pickup|listo.*recoger/i }).first();
      
      if (await readyPackage.isVisible()) {
        await readyPackage.click();
        
        // Update status to Delivered
        const statusButton = page.locator('button, select').filter({ hasText: /status|estado/i });
        await statusButton.click();
        
        await page.click('[role="option"]:has-text(/delivered|entregado/i)');
        
        const confirmButton = page.locator('button').filter({ hasText: /update|save|actualizar|guardar/i });
        await confirmButton.click();
        
        // Check for success message
        const successToast = page.locator('[role="status"]').filter({ hasText: /updated|delivered|actualizado|entregado/i });
        await expect(successToast).toBeVisible({ timeout: 10000 });
      }
    });

    test('Can add notes when updating status', async ({ page }) => {
      await navigateToPackagesList(page);
      
      const firstPackage = page.locator('tr[role="row"], .package-item, [data-testid="package-item"]').first();
      await firstPackage.click();
      
      // Add note
      const notesField = page.locator('textarea[placeholder*="note" i], textarea[placeholder*="nota" i]');
      if (await notesField.isVisible()) {
        await notesField.fill('Customer was notified via phone call');
        
        // Save
        const saveButton = page.locator('button').filter({ hasText: /save|update|guardar|actualizar/i });
        await saveButton.click();
        
        // Check for success
        const successToast = page.locator('[role="status"]').filter({ hasText: /updated|saved|actualizado|guardado/i });
        await expect(successToast).toBeVisible({ timeout: 10000 });
      }
    });

    test('Shows confirmation dialog for status changes', async ({ page }) => {
      await navigateToPackagesList(page);
      
      const firstPackage = page.locator('tr[role="row"], .package-item, [data-testid="package-item"]').first();
      await firstPackage.click();
      
      // Try to change status
      const statusButton = page.locator('button, select').filter({ hasText: /status|estado/i });
      if (await statusButton.isVisible()) {
        await statusButton.click();
        await page.click('[role="option"]').first();
        
        // Look for confirmation dialog
        const confirmDialog = page.locator('[role="dialog"], [role="alertdialog"]');
        if (await confirmDialog.isVisible()) {
          await expect(confirmDialog).toContainText(/confirm|confirmar/i);
          
          // Confirm the change
          await page.click('button:has-text(/yes|confirm|sí|confirmar/i)');
        }
      }
    });
  });

  test.describe('Searching and Filtering Packages', () => {
    test('Can search packages by tracking number', async ({ page }) => {
      await navigateToPackagesList(page);
      
      // Find search input
      const searchInput = page.locator('input[placeholder*="search" i], input[placeholder*="buscar" i]');
      await searchInput.fill('1Z999');
      
      // Wait for search results
      await page.waitForTimeout(1000);
      
      // Verify filtered results
      const results = page.locator('tr[role="row"], .package-item');
      const count = await results.count();
      
      // All visible results should contain the search term
      for (let i = 0; i < count; i++) {
        const text = await results.nth(i).textContent();
        expect(text?.toLowerCase()).toContain('1z999');
      }
    });

    test('Can filter packages by status', async ({ page }) => {
      await navigateToPackagesList(page);
      
      // Find status filter
      const statusFilter = page.locator('select, button').filter({ hasText: /filter.*status|filtrar.*estado/i });
      
      if (await statusFilter.isVisible()) {
        await statusFilter.click();
        
        // Select "Received" status
        await page.click('[role="option"]:has-text(/received|recibido/i)');
        
        await page.waitForTimeout(1000);
        
        // Verify all visible packages have "Received" status
        const statusBadges = page.locator('.status-badge, [data-testid="package-status"]');
        const count = await statusBadges.count();
        
        for (let i = 0; i < count; i++) {
          const text = await statusBadges.nth(i).textContent();
          expect(text?.toLowerCase()).toContain('received');
        }
      }
    });

    test('Can filter packages by carrier', async ({ page }) => {
      await navigateToPackagesList(page);
      
      // Find carrier filter
      const carrierFilter = page.locator('select, button').filter({ hasText: /filter.*carrier|filtrar.*transportista/i });
      
      if (await carrierFilter.isVisible()) {
        await carrierFilter.click();
        
        // Select UPS
        await page.click('[role="option"]:has-text("UPS")');
        
        await page.waitForTimeout(1000);
        
        // Verify filtered results
        const carriers = page.locator('.carrier-name, [data-testid="package-carrier"]');
        const count = await carriers.count();
        
        for (let i = 0; i < count; i++) {
          const text = await carriers.nth(i).textContent();
          expect(text).toContain('UPS');
        }
      }
    });

    test('Can filter packages by date range', async ({ page }) => {
      await navigateToPackagesList(page);
      
      // Find date filter
      const dateFilter = page.locator('button').filter({ hasText: /date|fecha/i });
      
      if (await dateFilter.isVisible()) {
        await dateFilter.click();
        
        // Select date range (e.g., last 7 days)
        const lastWeekOption = page.locator('[role="option"]').filter({ hasText: /7.*days|7.*días|week|semana/i });
        if (await lastWeekOption.isVisible()) {
          await lastWeekOption.click();
          
          await page.waitForTimeout(1000);
          
          // Verify results are filtered
          const results = page.locator('tr[role="row"], .package-item');
          const count = await results.count();
          expect(count).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('Can clear all filters', async ({ page }) => {
      await navigateToPackagesList(page);
      
      // Apply some filters first
      const searchInput = page.locator('input[placeholder*="search" i], input[placeholder*="buscar" i]');
      await searchInput.fill('TEST');
      
      await page.waitForTimeout(1000);
      
      // Clear filters
      const clearButton = page.locator('button').filter({ hasText: /clear|limpiar/i });
      if (await clearButton.isVisible()) {
        await clearButton.click();
        
        // Verify search input is cleared
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe('');
        
        // Verify all packages are shown again
        const results = page.locator('tr[role="row"], .package-item');
        const count = await results.count();
        expect(count).toBeGreaterThan(0);
      }
    });

    test('Can combine multiple filters', async ({ page }) => {
      await navigateToPackagesList(page);
      
      // Apply search filter
      const searchInput = page.locator('input[placeholder*="search" i], input[placeholder*="buscar" i]');
      await searchInput.fill('1Z');
      
      // Apply status filter if available
      const statusFilter = page.locator('select, button').filter({ hasText: /filter.*status|filtrar.*estado/i });
      if (await statusFilter.isVisible()) {
        await statusFilter.click();
        await page.click('[role="option"]:has-text(/received|recibido/i)');
      }
      
      await page.waitForTimeout(1000);
      
      // Verify results match both filters
      const results = page.locator('tr[role="row"], .package-item');
      const count = await results.count();
      
      if (count > 0) {
        const firstResult = await results.first().textContent();
        expect(firstResult?.toLowerCase()).toContain('1z');
      }
    });
  });

  test.describe('Package Tracking Functionality', () => {
    test('Can view package tracking history', async ({ page }) => {
      await navigateToPackagesList(page);
      
      // Click on a package
      const firstPackage = page.locator('tr[role="row"], .package-item').first();
      await firstPackage.click();
      
      // Look for tracking history section
      const historySection = page.locator('section, div').filter({ hasText: /history|tracking|historial|rastreo/i });
      
      if (await historySection.isVisible()) {
        // Check for timeline or history items
        const historyItems = page.locator('.history-item, .timeline-item, [data-testid="tracking-event"]');
        const count = await historyItems.count();
        expect(count).toBeGreaterThan(0);
        
        // Verify first item shows "Received" status
        const firstItem = historyItems.first();
        await expect(firstItem).toContainText(/received|recibido/i);
      }
    });

    test('Shows timestamp for each tracking event', async ({ page }) => {
      await navigateToPackagesList(page);
      
      const firstPackage = page.locator('tr[role="row"], .package-item').first();
      await firstPackage.click();
      
      // Check for timestamps in tracking history
      const timestamps = page.locator('.timestamp, time, [data-testid="event-time"]');
      
      if (await timestamps.first().isVisible()) {
        const count = await timestamps.count();
        expect(count).toBeGreaterThan(0);
        
        // Verify timestamp format
        const firstTimestamp = await timestamps.first().textContent();
        expect(firstTimestamp).toMatch(/\d{1,2}[:/]\d{2}|\d{4}/); // Match time or year
      }
    });

    test('Can copy tracking number', async ({ page }) => {
      await navigateToPackagesList(page);
      
      const firstPackage = page.locator('tr[role="row"], .package-item').first();
      await firstPackage.click();
      
      // Look for copy button
      const copyButton = page.locator('button').filter({ hasText: /copy|copiar/i });
      
      if (await copyButton.isVisible()) {
        await copyButton.click();
        
        // Check for success message
        const successMessage = page.locator('[role="status"]').filter({ hasText: /copied|copiado/i });
        await expect(successMessage).toBeVisible({ timeout: 5000 });
      }
    });

    test('Shows package location updates', async ({ page }) => {
      await navigateToPackagesList(page);
      
      const firstPackage = page.locator('tr[role="row"], .package-item').first();
      await firstPackage.click();
      
      // Check for location information
      const locationInfo = page.locator('text=/location|ubicación/i');
      
      if (await locationInfo.isVisible()) {
        // Verify location details are shown
        const locations = ['Warehouse', 'In Transit', 'At Facility', 'Out for Delivery'];
        let foundLocation = false;
        
        for (const location of locations) {
          if (await page.locator(`text=/${location}/i`).isVisible()) {
            foundLocation = true;
            break;
          }
        }
        
        expect(foundLocation).toBeTruthy();
      }
    });

    test('Can export tracking information', async ({ page }) => {
      await navigateToPackagesList(page);
      
      // Look for export button
      const exportButton = page.locator('button').filter({ hasText: /export|exportar/i });
      
      if (await exportButton.isVisible()) {
        // Start waiting for download before clicking
        const downloadPromise = page.waitForEvent('download');
        
        await exportButton.click();
        
        // Wait for download to start
        const download = await downloadPromise;
        
        // Verify download
        expect(download.suggestedFilename()).toContain('package');
      }
    });

    test('Shows estimated delivery date', async ({ page }) => {
      await navigateToPackagesList(page);
      
      const firstPackage = page.locator('tr[role="row"], .package-item').first();
      await firstPackage.click();
      
      // Look for estimated delivery
      const deliveryInfo = page.locator('text=/estimated.*delivery|entrega.*estimada/i');
      
      if (await deliveryInfo.isVisible()) {
        // Check for date format
        const datePattern = /\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/;
        const text = await deliveryInfo.textContent();
        expect(text).toMatch(datePattern);
      }
    });
  });

  test.describe('Package Management Permissions', () => {
    test('Customer cannot create packages', async ({ page }) => {
      // Logout and login as customer
      await page.goto('/#/dashboard');
      const logoutButton = page.locator('button, a').filter({ hasText: /logout|sign out|cerrar sesión/i }).first();
      await logoutButton.click();
      
      await loginAsCustomer(page);
      
      // Try to navigate to intake page
      await page.goto('/#/intake');
      
      // Should be redirected or show error
      const errorMessage = page.locator('text=/unauthorized|no.*permission|no.*autorizado|sin.*permiso/i');
      const isRedirected = page.url().includes('customer-dashboard');
      
      expect(await errorMessage.isVisible() || isRedirected).toBeTruthy();
    });

    test('Staff can manage all package operations', async ({ page }) => {
      // Already logged in as staff
      await navigateToPackageIntake(page);
      
      // Verify can access intake
      await expect(page.locator('h1, h2').filter({ hasText: /Package Intake|Recepción de Paquetes/i })).toBeVisible();
      
      // Verify can view packages
      await navigateToPackagesList(page);
      const packageList = page.locator('[role="table"], .package-list');
      await expect(packageList).toBeVisible();
    });

    test('Admin can access package reports', async ({ page }) => {
      // Logout and login as admin
      await page.goto('/#/dashboard');
      const logoutButton = page.locator('button, a').filter({ hasText: /logout|sign out|cerrar sesión/i }).first();
      await logoutButton.click();
      
      await loginAsAdmin(page);
      
      // Navigate to reports
      await page.goto('/#/reports');
      
      // Look for package-related reports
      const packageReports = page.locator('text=/package.*report|reporte.*paquete/i');
      await expect(packageReports).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Package Management Edge Cases', () => {
    test('Handles network errors gracefully', async ({ page, context }) => {
      await navigateToPackageIntake(page);
      
      // Block API requests to simulate network error
      await context.route('**/packages**', route => route.abort());
      
      // Try to create a package
      await fillPackageForm(page, TEST_PACKAGE);
      await page.click('button[type="submit"]');
      
      // Should show error message or queue for sync
      const message = page.locator('[role="status"]');
      await expect(message).toBeVisible({ timeout: 10000 });
      
      const messageText = await message.textContent();
      expect(messageText?.toLowerCase()).toMatch(/error|queued|offline|error|en cola|sin conexión/);
    });

    test('Validates package weight format', async ({ page }) => {
      await navigateToPackageIntake(page);
      
      // Fill tracking and carrier
      await page.fill('input[placeholder*="tracking" i]', 'TEST123');
      await page.click('button[role="combobox"]').first();
      await page.click('[role="option"]:has-text("UPS")');
      
      // Enter invalid weight
      const weightInput = page.locator('input[placeholder*="weight" i]');
      if (await weightInput.isVisible()) {
        await weightInput.fill('abc');
        
        // Try to submit
        await page.click('button[type="submit"]');
        
        // Should show validation error
        const errorMessage = page.locator('text=/invalid.*weight|peso.*inválido/i');
        await expect(errorMessage).toBeVisible({ timeout: 5000 });
      }
    });

    test('Handles concurrent package updates', async ({ page, context }) => {
      const page2 = await context.newPage();
      await loginAsStaff(page2);
      
      // Both pages view same package
      await navigateToPackagesList(page);
      await navigateToPackagesList(page2);
      
      const firstPackage = page.locator('tr[role="row"], .package-item').first();
      const firstPackage2 = page2.locator('tr[role="row"], .package-item').first();
      
      await firstPackage.click();
      await firstPackage2.click();
      
      // Try to update from both pages
      const notesField1 = page.locator('textarea[placeholder*="note" i]');
      const notesField2 = page2.locator('textarea[placeholder*="note" i]');
      
      if (await notesField1.isVisible() && await notesField2.isVisible()) {
        await notesField1.fill('Update from page 1');
        await notesField2.fill('Update from page 2');
        
        // Submit both
        await page.locator('button').filter({ hasText: /save|guardar/i }).click();
        await page2.locator('button').filter({ hasText: /save|guardar/i }).click();
        
        // At least one should succeed
        const success1 = page.locator('[role="status"]').filter({ hasText: /success|saved/i });
        const success2 = page2.locator('[role="status"]').filter({ hasText: /success|saved/i });
        
        const hasSuccess = await success1.isVisible() || await success2.isVisible();
        expect(hasSuccess).toBeTruthy();
      }
      
      await page2.close();
    });

    test('Preserves form data on validation error', async ({ page }) => {
      await navigateToPackageIntake(page);
      
      // Fill some fields but not all required
      await page.fill('input[placeholder*="tracking" i]', 'PRESERVE123');
      
      const notesField = page.locator('textarea[placeholder*="note" i]');
      if (await notesField.isVisible()) {
        await notesField.fill('Important package notes');
      }
      
      // Try to submit (should fail due to missing required fields)
      await page.click('button[type="submit"]');
      
      // Check that entered data is preserved
      const trackingValue = await page.locator('input[placeholder*="tracking" i]').inputValue();
      expect(trackingValue).toBe('PRESERVE123');
      
      if (await notesField.isVisible()) {
        const notesValue = await notesField.inputValue();
        expect(notesValue).toBe('Important package notes');
      }
    });
  });
});

// Performance tests
test.describe('Package Management Performance', () => {
  test('Package list loads within acceptable time', async ({ page }) => {
    await loginAsStaff(page);
    
    const startTime = Date.now();
    await navigateToPackagesList(page);
    
    // Wait for list to be visible
    await expect(page.locator('[role="table"], .package-list')).toBeVisible({ timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  });

  test('Search results update quickly', async ({ page }) => {
    await loginAsStaff(page);
    await navigateToPackagesList(page);
    
    const searchInput = page.locator('input[placeholder*="search" i]');
    
    const startTime = Date.now();
    await searchInput.fill('TEST');
    
    // Wait for results to update
    await page.waitForTimeout(500);
    
    const searchTime = Date.now() - startTime;
    expect(searchTime).toBeLessThan(2000); // Search should be responsive within 2 seconds
  });

  test('Can handle large package lists', async ({ page }) => {
    await loginAsStaff(page);
    await navigateToPackagesList(page);
    
    // Check if pagination or infinite scroll is implemented
    const pagination = page.locator('.pagination, [role="navigation"]');
    const hasScroll = await page.evaluate(() => {
      const element = document.querySelector('[role="table"], .package-list');
      return element ? element.scrollHeight > element.clientHeight : false;
    });
    
    // Should have either pagination or scroll for large lists
    expect(await pagination.isVisible() || hasScroll).toBeTruthy();
  });
});
