import { test, expect } from '@playwright/test';

test.describe('Customer Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Login as customer
    await page.goto('/portal/login');
    await page.fill('input[type="email"]', 'customer@test.com');
    await page.fill('input[type="password"]', 'customerpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/portal/dashboard');
  });

  test('Customer dashboard overview', async ({ page }) => {
    // Verify dashboard elements
    await expect(page.locator('h1')).toContainText('Mi Panel');
    
    // Check for key metrics
    await expect(page.locator('text=Paquetes Pendientes')).toBeVisible();
    await expect(page.locator('text=Correo Sin Leer')).toBeVisible();
    await expect(page.locator('text=Notificaciones')).toBeVisible();
  });

  test('Package tracking for customers', async ({ page }) => {
    // Search for package
    await page.fill('input[placeholder*="número de rastreo"]', 'CUST123456');
    await page.press('input[placeholder*="número de rastreo"]', 'Enter');
    
    // Verify tracking information
    await expect(page.locator('.tracking-timeline')).toBeVisible();
    await expect(page.locator('text=En Tránsito')).toBeVisible();
  });

  test('Document management', async ({ page }) => {
    await page.goto('/portal/documents');
    
    // Upload document
    await page.click('button:has-text("Subir Documento")');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'tax-form.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('dummy pdf content')
    });
    
    // Add document metadata
    await page.fill('input[name="documentName"]', 'Formulario W-2 2023');
    await page.selectOption('select[name="category"]', 'tax');
    await page.click('button:has-text("Guardar")');
    
    // Verify upload
    await expect(page.locator('text=Documento guardado')).toBeVisible();
  });

  test('Notification preferences', async ({ page }) => {
    await page.goto('/portal/notifications');
    
    // Configure notifications
    await page.check('input[name="emailNotifications"]');
    await page.check('input[name="smsNotifications"]');
    await page.uncheck('input[name="pushNotifications"]');
    
    // Set notification types
    await page.check('input[name="packageArrival"]');
    await page.check('input[name="mailScanned"]');
    
    // Save preferences
    await page.click('button:has-text("Guardar Preferencias")');
    await expect(page.locator('text=Preferencias actualizadas')).toBeVisible();
  });

  test('Mobile app features', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Emulate mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
    }
    
    await page.goto('/portal/mobile-features');
    
    // Test mobile-specific features
    await expect(page.locator('button:has-text("Escanear Código QR")')).toBeVisible();
    await expect(page.locator('button:has-text("Notificaciones Push")')).toBeVisible();
    
    // Test offline mode indicator
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();
  });
});