import { test, expect } from '@playwright/test';

test.describe('IoT & Device Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/auth/staff');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'adminpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('IoT device registration', async ({ page }) => {
    await page.goto('/iot-monitoring');
    
    // Add new device
    await page.click('button:has-text("Agregar Dispositivo")');
    
    // Fill device details
    await page.fill('input[name="deviceId"]', 'IOT-TEMP-001');
    await page.fill('input[name="deviceName"]', 'Sensor de Temperatura - Almacén');
    await page.selectOption('select[name="deviceType"]', 'temperature');
    await page.selectOption('select[name="location"]', 'warehouse');
    
    // Configure thresholds
    await page.fill('input[name="minTemp"]', '60');
    await page.fill('input[name="maxTemp"]', '75');
    
    // Register device
    await page.click('button:has-text("Registrar")');
    await expect(page.locator('text=Dispositivo registrado')).toBeVisible();
  });

  test('Real-time monitoring dashboard', async ({ page }) => {
    await page.goto('/iot-monitoring');
    
    // Verify dashboard elements
    await expect(page.locator('h1')).toContainText('Monitoreo IoT');
    
    // Check device status cards
    await expect(page.locator('.device-card')).toHaveCount(5);
    
    // Verify real-time data
    await expect(page.locator('text=Temperatura Actual')).toBeVisible();
    await expect(page.locator('text=Humedad')).toBeVisible();
    await expect(page.locator('text=Estado de Energía')).toBeVisible();
  });

  test('Environmental alerts', async ({ page }) => {
    await page.goto('/iot-monitoring');
    
    // Navigate to alerts
    await page.click('a:has-text("Alertas")');
    
    // Create new alert rule
    await page.click('button:has-text("Nueva Regla")');
    
    // Configure alert
    await page.selectOption('select[name="metric"]', 'temperature');
    await page.selectOption('select[name="condition"]', 'greater_than');
    await page.fill('input[name="threshold"]', '80');
    await page.selectOption('select[name="severity"]', 'critical');
    
    // Set notification
    await page.check('input[name="emailAlert"]');
    await page.check('input[name="smsAlert"]');
    
    // Save rule
    await page.click('button:has-text("Guardar Regla")');
    await expect(page.locator('text=Regla creada')).toBeVisible();
  });

  test('Package tracking devices', async ({ page }) => {
    await page.goto('/devices');
    
    // Navigate to tracking devices
    await page.click('a:has-text("Dispositivos de Rastreo")');
    
    // Assign tracker to package
    await page.click('button:has-text("Asignar Rastreador")');
    await page.fill('input[name="trackingNumber"]', 'PKG123456');
    await page.selectOption('select[name="tracker"]', 'GPS-001');
    
    // Activate tracking
    await page.click('button:has-text("Activar")');
    await expect(page.locator('text=Rastreo activado')).toBeVisible();
    
    // View live tracking
    await page.click('button:has-text("Ver en Mapa")');
    await expect(page.locator('.tracking-map')).toBeVisible();
  });

  test('Mobile device management', async ({ page }) => {
    await page.goto('/devices');
    
    // Navigate to mobile devices
    await page.click('a:has-text("Dispositivos Móviles")');
    
    // Register employee device
    await page.click('button:has-text("Registrar Dispositivo")');
    await page.selectOption('select[name="employee"]', 'carlos-rodriguez');
    await page.selectOption('select[name="deviceType"]', 'tablet');
    await page.fill('input[name="deviceModel"]', 'iPad Pro 11');
    await page.fill('input[name="serialNumber"]', 'IPAD123456');
    
    // Install apps
    await page.check('input[value="prmcms-mobile"]');
    await page.check('input[value="barcode-scanner"]');
    
    // Register
    await page.click('button:has-text("Registrar")');
    await expect(page.locator('text=Dispositivo registrado')).toBeVisible();
  });
});