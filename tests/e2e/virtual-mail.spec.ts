import { test, expect } from '@playwright/test';

test.describe('Virtual Mail Services', () => {
  test.beforeEach(async ({ page }) => {
    // Login as staff
    await page.goto('/auth/staff');
    await page.fill('input[type="email"]', 'staff@test.com');
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('Mail scanning workflow', async ({ page }) => {
    await page.goto('/virtual-mail');
    
    // Verify virtual mail dashboard
    await expect(page.locator('h1')).toContainText('Correo Virtual');
    
    // Start scanning process
    await page.click('button:has-text("Escanear Correo")');
    
    // Select mailbox
    await page.selectOption('select[name="mailbox"]', 'MB-001');
    
    // Upload scanned mail
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'mail-scan.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('dummy pdf content')
    });
    
    // Add mail details
    await page.fill('input[name="sender"]', 'IRS');
    await page.selectOption('select[name="mailType"]', 'official');
    await page.click('button:has-text("Procesar")');
    
    // Verify success
    await expect(page.locator('text=Correo escaneado exitosamente')).toBeVisible();
  });

  test('Check deposit capture', async ({ page }) => {
    await page.goto('/virtual-mail');
    
    // Navigate to check deposit
    await page.click('button:has-text("Depósito de Cheques")');
    
    // Upload check images
    await page.setInputFiles('input[name="checkFront"]', {
      name: 'check-front.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('dummy image')
    });
    
    await page.setInputFiles('input[name="checkBack"]', {
      name: 'check-back.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('dummy image')
    });
    
    // Enter check details
    await page.fill('input[name="amount"]', '500.00');
    await page.fill('input[name="checkNumber"]', '1234');
    
    // Submit for processing
    await page.click('button:has-text("Procesar Depósito")');
    await expect(page.locator('text=Cheque procesado')).toBeVisible();
  });

  test('Mail forwarding request', async ({ page }) => {
    await page.goto('/virtual-mail');
    
    // Select mail piece
    await page.click('.mail-item:first-child');
    
    // Request forwarding
    await page.click('button:has-text("Reenviar")');
    
    // Fill forwarding address
    await page.fill('input[name="forwardAddress"]', '123 Main St, San Juan, PR 00901');
    await page.selectOption('select[name="shippingMethod"]', 'priority');
    
    // Confirm forwarding
    await page.click('button:has-text("Confirmar Reenvío")');
    await expect(page.locator('text=Reenvío programado')).toBeVisible();
  });

  test('Virtual mailbox analytics', async ({ page }) => {
    await page.goto('/virtual-mail');
    
    // Navigate to analytics
    await page.click('a:has-text("Analíticas")');
    
    // Verify analytics dashboard
    await expect(page.locator('h2:has-text("Estadísticas de Correo Virtual")')).toBeVisible();
    await expect(page.locator('.metric-card')).toHaveCount(4);
    
    // Check scanning metrics
    await expect(page.locator('text=Piezas Escaneadas')).toBeVisible();
    await expect(page.locator('text=Tiempo Promedio de Procesamiento')).toBeVisible();
  });
});