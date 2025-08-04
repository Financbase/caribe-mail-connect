import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './test-utils';

test.describe('Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin using helper function
    await loginAsAdmin(page);
  });

  test('Employee onboarding', async ({ page }) => {
    await page.goto('/employees');
    
    // Add new employee
    await page.click('button:has-text("Nuevo Empleado")');
    
    // Fill employee details
    await page.fill('input[name="firstName"]', 'Carlos');
    await page.fill('input[name="lastName"]', 'Rodríguez');
    await page.fill('input[name="email"]', 'carlos.rodriguez@test.com');
    await page.fill('input[name="phone"]', '787-555-0123');
    await page.selectOption('select[name="role"]', 'package_handler');
    await page.selectOption('select[name="location"]', 'san-juan');
    
    // Submit
    await page.click('button:has-text("Crear Empleado")');
    await expect(page.locator('text=Empleado creado exitosamente')).toBeVisible();
  });

  test('Time clock functionality', async ({ page }) => {
    await page.goto('/employees');
    
    // Navigate to time clock
    await page.click('a:has-text("Reloj de Tiempo")');
    
    // Clock in
    await page.fill('input[name="employeeId"]', 'EMP001');
    await page.click('button:has-text("Marcar Entrada")');
    await expect(page.locator('text=Entrada registrada')).toBeVisible();
    
    // Clock out
    await page.waitForTimeout(2000);
    await page.click('button:has-text("Marcar Salida")');
    await expect(page.locator('text=Salida registrada')).toBeVisible();
  });

  test('Shift scheduling', async ({ page }) => {
    await page.goto('/employees');
    
    // Navigate to scheduling
    await page.click('a:has-text("Horarios")');
    
    // Create new shift
    await page.click('button:has-text("Nuevo Turno")');
    await page.selectOption('select[name="employee"]', 'carlos-rodriguez');
    await page.fill('input[name="date"]', '2024-02-01');
    await page.selectOption('select[name="shiftType"]', 'morning');
    
    // Save shift
    await page.click('button:has-text("Guardar Turno")');
    await expect(page.locator('text=Turno programado')).toBeVisible();
  });

  test('Performance tracking', async ({ page }) => {
    await page.goto('/employees');
    
    // Navigate to performance
    await page.click('a:has-text("Desempeño")');
    
    // View employee metrics
    await page.selectOption('select[name="employee"]', 'carlos-rodriguez');
    
    // Verify performance metrics
    await expect(page.locator('text=Paquetes Procesados')).toBeVisible();
    await expect(page.locator('text=Tiempo Promedio')).toBeVisible();
    await expect(page.locator('text=Precisión')).toBeVisible();
    
    // Add performance note
    await page.click('button:has-text("Agregar Nota")');
    await page.fill('textarea[name="note"]', 'Excelente atención al cliente');
    await page.click('button:has-text("Guardar")');
  });

  test('Training module assignment', async ({ page }) => {
    await page.goto('/training');
    
    // Assign training
    await page.click('button:has-text("Asignar Entrenamiento")');
    await page.selectOption('select[name="employee"]', 'carlos-rodriguez');
    await page.check('input[value="package-handling-basics"]');
    await page.check('input[value="customer-service"]');
    
    // Set deadline
    await page.fill('input[name="deadline"]', '2024-02-15');
    
    // Assign
    await page.click('button:has-text("Asignar")');
    await expect(page.locator('text=Entrenamiento asignado')).toBeVisible();
  });
});