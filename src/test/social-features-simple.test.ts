import { test, expect } from '@playwright/test';

// Simple test suite for Social Media Features without login
test.describe('Social Media Features - Simple Test', () => {
  test('should display social media dashboard directly', async ({ page }) => {
    // Navigate directly to social page
    await page.goto('http://localhost:5173/#/social');
    
    // Wait for the page to load
    await page.waitForSelector('text=Centro Social', { timeout: 10000 });
    
    // Verify the dashboard is displayed
    const dashboard = page.locator('text=Centro Social');
    await expect(dashboard).toBeVisible();
    
    // Verify quick stats are present
    await expect(page.locator('text=Cuentas Conectadas')).toBeVisible();
    await expect(page.locator('text=Engagement Total')).toBeVisible();
    await expect(page.locator('text=Menciones Pendientes')).toBeVisible();
    await expect(page.locator('text=Publicaciones Programadas')).toBeVisible();
    
    // Verify tabs are present
    await expect(page.locator('button[role="tab"]', { hasText: 'Dashboard' })).toBeVisible();
    await expect(page.locator('button[role="tab"]', { hasText: 'Cuentas' })).toBeVisible();
    await expect(page.locator('button[role="tab"]', { hasText: 'Publicaciones' })).toBeVisible();
    await expect(page.locator('button[role="tab"]', { hasText: 'Menciones' })).toBeVisible();
    await expect(page.locator('button[role="tab"]', { hasText: 'Analíticas' })).toBeVisible();
    await expect(page.locator('button[role="tab"]', { hasText: 'Comunidad' })).toBeVisible();
  });

  test('should navigate between tabs', async ({ page }) => {
    await page.goto('http://localhost:5173/#/social');
    await page.waitForSelector('text=Centro Social');
    
    // Test Accounts tab
    await page.locator('button[role="tab"]', { hasText: 'Cuentas' }).click();
    await expect(page.locator('text=Cuentas Conectadas')).toBeVisible();
    
    // Test Posts tab
    await page.locator('button[role="tab"]', { hasText: 'Publicaciones' }).click();
    await expect(page.locator('text=Componer Publicación')).toBeVisible();
    
    // Test Mentions tab
    await page.locator('button[role="tab"]', { hasText: 'Menciones' }).click();
    await expect(page.locator('text=Total Menciones')).toBeVisible();
    
    // Test Analytics tab
    await page.locator('button[role="tab"]', { hasText: 'Analíticas' }).click();
    await expect(page.locator('text=Total Seguidores')).toBeVisible();
    
    // Test Community tab
    await page.locator('button[role="tab"]', { hasText: 'Comunidad' }).click();
    await expect(page.locator('text=Foros Comunitarios')).toBeVisible();
  });

  test('should display social media components', async ({ page }) => {
    await page.goto('http://localhost:5173/#/social');
    await page.waitForSelector('text=Centro Social');
    
    // Check for social media icons
    await expect(page.locator('svg[data-lucide="instagram"]')).toBeVisible();
    await expect(page.locator('svg[data-lucide="facebook"]')).toBeVisible();
    await expect(page.locator('svg[data-lucide="twitter"]')).toBeVisible();
    
    // Check for action buttons
    await expect(page.locator('button', { hasText: 'Nueva Publicación' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Configuración' })).toBeVisible();
  });
}); 