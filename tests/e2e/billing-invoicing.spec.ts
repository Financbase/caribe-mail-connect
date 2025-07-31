import { test, expect } from '@playwright/test';

test.describe('Billing & Invoicing', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/auth/staff');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'adminpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('Create invoice manually', async ({ page }) => {
    await page.goto('/billing');
    
    // Create new invoice
    await page.click('button:has-text("Nueva Factura")');
    
    // Select customer
    await page.fill('input[name="customerSearch"]', 'Juan Pérez');
    await page.click('.customer-suggestion:first-child');
    
    // Add line items
    await page.click('button:has-text("Agregar Artículo")');
    await page.fill('input[name="description"]', 'Servicio de Buzón Virtual - Mensual');
    await page.fill('input[name="quantity"]', '1');
    await page.fill('input[name="price"]', '29.99');
    
    // Add another item
    await page.click('button:has-text("Agregar Artículo")');
    await page.fill('input[name="description-1"]', 'Escaneo de Correo');
    await page.fill('input[name="quantity-1"]', '15');
    await page.fill('input[name="price-1"]', '0.50');
    
    // Apply tax
    await page.selectOption('select[name="taxRate"]', '11.5');
    
    // Generate invoice
    await page.click('button:has-text("Generar Factura")');
    await expect(page.locator('text=Factura creada exitosamente')).toBeVisible();
  });

  test('Billing run automation', async ({ page }) => {
    await page.goto('/billing');
    
    // Navigate to billing runs
    await page.click('a:has-text("Corridas de Facturación")');
    
    // Create billing run
    await page.click('button:has-text("Nueva Corrida")');
    
    // Select billing period
    await page.selectOption('select[name="billingMonth"]', '2024-01');
    await page.selectOption('select[name="customerGroup"]', 'all');
    
    // Preview billing run
    await page.click('button:has-text("Vista Previa")');
    await expect(page.locator('text=125 facturas a generar')).toBeVisible();
    
    // Execute billing run
    await page.click('button:has-text("Ejecutar Corrida")');
    await expect(page.locator('.progress-bar')).toBeVisible();
  });

  test('Payment processing', async ({ page }) => {
    await page.goto('/billing');
    
    // Navigate to payments
    await page.click('a:has-text("Pagos")');
    
    // Record payment
    await page.click('button:has-text("Registrar Pago")');
    
    // Search invoice
    await page.fill('input[name="invoiceNumber"]', 'INV-2024-001');
    await page.click('button:has-text("Buscar")');
    
    // Enter payment details
    await page.fill('input[name="paymentAmount"]', '37.49');
    await page.selectOption('select[name="paymentMethod"]', 'credit_card');
    await page.fill('input[name="referenceNumber"]', 'CC-123456');
    
    // Process payment
    await page.click('button:has-text("Procesar Pago")');
    await expect(page.locator('text=Pago registrado')).toBeVisible();
  });

  test('Financial reports', async ({ page }) => {
    await page.goto('/billing');
    
    // Navigate to reports
    await page.click('a:has-text("Reportes Financieros")');
    
    // Generate revenue report
    await page.selectOption('select[name="reportType"]', 'revenue');
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="endDate"]', '2024-01-31');
    
    // Generate report
    await page.click('button:has-text("Generar Reporte")');
    
    // Verify report data
    await expect(page.locator('.revenue-chart')).toBeVisible();
    await expect(page.locator('text=Ingresos Totales')).toBeVisible();
    
    // Export report
    await page.click('button:has-text("Exportar PDF")');
  });

  test('Act 60 decree holder billing', async ({ page }) => {
    await page.goto('/billing');
    
    // Filter Act 60 customers
    await page.click('button:has-text("Filtros")');
    await page.check('input[name="act60Only"]');
    await page.click('button:has-text("Aplicar")');
    
    // Verify special pricing
    await expect(page.locator('text=Tarifa Act 60')).toBeVisible();
    
    // Create Act 60 invoice
    await page.click('button:has-text("Nueva Factura Act 60")');
    await expect(page.locator('text=Descuento Act 60 aplicado')).toBeVisible();
  });
});