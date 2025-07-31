import { test, expect } from '@playwright/test';

test.describe('Reporting & Analytics', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/auth/staff');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'adminpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('Custom report builder', async ({ page }) => {
    await page.goto('/reports');
    
    // Create custom report
    await page.click('button:has-text("Crear Reporte")');
    
    // Configure report
    await page.fill('input[name="reportName"]', 'Análisis de Paquetes Mensual');
    await page.selectOption('select[name="reportType"]', 'package_analytics');
    
    // Select data fields
    await page.check('input[value="packageCount"]');
    await page.check('input[value="carrierBreakdown"]');
    await page.check('input[value="deliveryTime"]');
    await page.check('input[value="customerSatisfaction"]');
    
    // Set filters
    await page.click('button:has-text("Agregar Filtro")');
    await page.selectOption('select[name="filterField"]', 'dateRange');
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="endDate"]', '2024-01-31');
    
    // Generate report
    await page.click('button:has-text("Generar")');
    await expect(page.locator('.report-preview')).toBeVisible();
  });

  test('Real-time analytics dashboard', async ({ page }) => {
    await page.goto('/analytics');
    
    // Verify dashboard components
    await expect(page.locator('h1')).toContainText('Analíticas en Tiempo Real');
    
    // Check metric cards
    await expect(page.locator('.metric-card')).toHaveCount(8);
    
    // Verify charts
    await expect(page.locator('.package-volume-chart')).toBeVisible();
    await expect(page.locator('.revenue-chart')).toBeVisible();
    await expect(page.locator('.carrier-breakdown-chart')).toBeVisible();
    
    // Test date range selector
    await page.click('button:has-text("Últimos 7 días")');
    await page.click('text=Último mes');
    await expect(page.locator('text=Actualizando datos')).toBeVisible();
  });

  test('Performance metrics', async ({ page }) => {
    await page.goto('/performance');
    
    // View KPIs
    await expect(page.locator('text=KPIs Principales')).toBeVisible();
    
    // Check performance indicators
    await expect(page.locator('text=Tiempo de Procesamiento')).toBeVisible();
    await expect(page.locator('text=Satisfacción del Cliente')).toBeVisible();
    await expect(page.locator('text=Precisión de Entrega')).toBeVisible();
    
    // Drill down into metrics
    await page.click('.metric-card:has-text("Tiempo de Procesamiento")');
    await expect(page.locator('.detailed-metrics')).toBeVisible();
  });

  test('Scheduled reports', async ({ page }) => {
    await page.goto('/reports');
    
    // Navigate to schedules
    await page.click('a:has-text("Reportes Programados")');
    
    // Create schedule
    await page.click('button:has-text("Programar Reporte")');
    
    // Select report
    await page.selectOption('select[name="report"]', 'monthly-summary');
    
    // Configure schedule
    await page.selectOption('select[name="frequency"]', 'weekly');
    await page.selectOption('select[name="dayOfWeek"]', 'monday');
    await page.fill('input[name="time"]', '08:00');
    
    // Add recipients
    await page.fill('input[name="recipients"]', 'manager@test.com, supervisor@test.com');
    
    // Save schedule
    await page.click('button:has-text("Guardar")');
    await expect(page.locator('text=Programación guardada')).toBeVisible();
  });

  test('Business intelligence insights', async ({ page }) => {
    await page.goto('/intelligence');
    
    // View AI insights
    await expect(page.locator('h1')).toContainText('Inteligencia de Negocios');
    
    // Check predictive analytics
    await page.click('a:has-text("Análisis Predictivo")');
    await expect(page.locator('text=Predicción de Volumen')).toBeVisible();
    await expect(page.locator('text=Tendencias de Demanda')).toBeVisible();
    
    // View anomaly detection
    await page.click('a:has-text("Detección de Anomalías")');
    await expect(page.locator('.anomaly-alert')).toHaveCount(2);
    
    // Check recommendations
    await page.click('a:has-text("Recomendaciones")');
    await expect(page.locator('.recommendation-card')).toHaveCount(5);
  });
});