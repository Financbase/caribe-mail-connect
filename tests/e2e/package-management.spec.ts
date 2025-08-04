import { test, expect } from '@playwright/test';
import { loginAsStaff } from './test-utils';

test.describe('Package Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as staff using helper function
    await loginAsStaff(page);
  });

  test('Package intake with barcode scanning', async ({ page }) => {
    await page.goto('/#/package-intake');
    
    // Verify package intake page
    await expect(page.locator('h1')).toContainText('Entrada de Paquetes');
    
    // Test manual entry
    await page.click('button:has-text("Entrada Manual")');
    
    // Fill package details
    await page.fill('input[name="trackingNumber"]', 'TEST123456789');
    await page.fill('input[name="recipientName"]', 'Juan Pérez');
    await page.selectOption('select[name="carrier"]', 'USPS');
    await page.fill('input[name="weight"]', '2.5');
    
    // Submit package
    await page.click('button:has-text("Registrar Paquete")');
    
    // Verify success
    await expect(page.locator('text=Paquete registrado exitosamente')).toBeVisible();
  });

  test('Package tracking and status updates', async ({ page }) => {
    await page.goto('/#/dashboard');
    
    // Search for package
    await page.fill('input[placeholder*="Buscar"]', 'TEST123456789');
    await page.press('input[placeholder*="Buscar"]', 'Enter');
    
    // Update package status
    await page.click('button:has-text("Actualizar Estado")');
    await page.selectOption('select[name="status"]', 'delivered');
    await page.click('button:has-text("Confirmar")');
    
    // Verify status update
    await expect(page.locator('text=Estado actualizado')).toBeVisible();
  });

  test('Bulk package operations', async ({ page }) => {
    await page.goto('/#/package-intake');
    
    // Test bulk import
    await page.click('button:has-text("Importación Masiva")');
    
    // Upload CSV file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'packages.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('tracking,recipient,carrier\nTEST001,Juan Pérez,USPS\nTEST002,María García,FedEx')
    });
    
    // Process import
    await page.click('button:has-text("Procesar")');
    await expect(page.locator('text=2 paquetes importados')).toBeVisible();
  });

  test('Package details and history', async ({ page }) => {
    await page.goto('/#/package-details/TEST123456789');
    
    // Verify package details
    await expect(page.locator('h1')).toContainText('Detalles del Paquete');
    
    // Check history timeline
    await expect(page.locator('text=Historial de Eventos')).toBeVisible();
    await expect(page.locator('.timeline-item')).toHaveCount(3);
  });
});