import { test, expect } from '@playwright/test';

test.describe('Authentication & Authorization', () => {
  test('Staff authentication flow', async ({ page }) => {
    await page.goto('/auth/staff');
    await page.waitForLoadState('domcontentloaded');
    
    // Verify staff login page elements
    await expect(page.locator('h1')).toContainText('Iniciar sesión');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('Customer authentication flow', async ({ page }) => {
    await page.goto('/auth/customer');
    await page.waitForLoadState('domcontentloaded');
    
    // Verify customer login page
    await expect(page.locator('h1')).toContainText('Cliente');
    await expect(page.locator('text=Crear cuenta')).toBeVisible();
  });

  test('Password reset flow', async ({ page }) => {
    await page.goto('/auth/reset-password');
    await page.waitForLoadState('domcontentloaded');
    
    // Test password reset request
    await page.fill('input[type="email"]', 'user@example.com');
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('h3:has-text("Se ha enviado un correo de restablecimiento")')).toBeVisible();
  });

  test('Two-factor authentication', async ({ page }) => {
    // First, we need to be authenticated to access security settings
    // For now, let's test that the security page redirects to auth when not authenticated
    await page.goto('/security');
    await page.waitForLoadState('domcontentloaded');
    
    // Should redirect to auth page when not authenticated
    await expect(page.locator('text=Seleccione su tipo de acceso')).toBeVisible();
    
    // TODO: Add test for authenticated security page access
    // This would require setting up a mock authenticated session
  });
}); 