import { test, expect } from '@playwright/test';

// Comprehensive test suite for AI Content Features
test.describe('AI Content Features - With Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000/');
    
    // Wait for login form to appear
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    // Login with admin account
    await page.fill('input[type="email"]', 'admin@prmcms.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button', { hasText: 'Iniciar sesión' });
    
    // Wait for login to complete and dashboard to load
    await page.waitForSelector('text=Today\'s Stats', { timeout: 15000 });
  });

  test('should access AI content tab after login', async ({ page }) => {
    // Navigate to social page
    await page.goto('http://localhost:3000/#/social');
    
    // Wait for the page to load
    await page.waitForSelector('text=Centro Social', { timeout: 10000 });
    
    // Click on AI Content tab
    await page.locator('button[role="tab"]', { hasText: 'IA' }).click();
    
    // Wait for AI content to load
    await page.waitForSelector('text=Sugerencias de IA', { timeout: 10000 });
    
    // Verify AI content components are present
    await expect(page.locator('text=Sugerencias de IA')).toBeVisible();
    await expect(page.locator('text=Genera contenido optimizado')).toBeVisible();
    
    // Check for generator tab
    await expect(page.locator('button[role="tab"]', { hasText: 'Generador' })).toBeVisible();
    await expect(page.locator('button[role="tab"]', { hasText: 'Sugerencias' })).toBeVisible();
  });

  test('should generate AI content with parameters', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    // Navigate to AI Content tab
    await page.locator('button[role="tab"]', { hasText: 'IA' }).click();
    await page.waitForSelector('text=Sugerencias de IA');
    
    // Fill in content generation parameters
    await page.locator('select').first().click();
    await page.locator('text=Instagram').click();
    
    // Add keywords
    await page.fill('input[placeholder*="palabra clave"]', 'entrega express');
    await page.press('input[placeholder*="palabra clave"]', 'Enter');
    
    await page.fill('input[placeholder*="palabra clave"]', 'Puerto Rico');
    await page.press('input[placeholder*="palabra clave"]', 'Enter');
    
    // Select category
    await page.locator('select').nth(1).click();
    await page.locator('text=Promocional').click();
    
    // Select tone
    await page.locator('select').nth(2).click();
    await page.locator('text=Amigable').click();
    
    // Generate content
    await page.click('button', { hasText: 'Generar Contenido' });
    
    // Wait for generation to complete
    await page.waitForSelector('text=Generando...', { timeout: 5000 });
    await page.waitForSelector('text=Generar Contenido', { timeout: 10000 });
    
    // Switch to suggestions tab to see results
    await page.locator('button[role="tab"]', { hasText: 'Sugerencias' }).click();
    
    // Verify suggestions are generated
    await expect(page.locator('text=post')).toBeVisible();
    await expect(page.locator('text=hashtag')).toBeVisible();
  });

  test('should use AI-generated content', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    // Navigate to AI Content tab
    await page.locator('button[role="tab"]', { hasText: 'IA' }).click();
    await page.waitForSelector('text=Sugerencias de IA');
    
    // Generate some content first
    await page.fill('input[placeholder*="palabra clave"]', 'servicio confiable');
    await page.press('input[placeholder*="palabra clave"]', 'Enter');
    await page.click('button', { hasText: 'Generar Contenido' });
    
    // Wait for generation and switch to suggestions
    await page.waitForSelector('text=Generar Contenido', { timeout: 10000 });
    await page.locator('button[role="tab"]', { hasText: 'Sugerencias' }).click();
    
    // Use a suggestion
    await page.locator('button', { hasText: 'Usar' }).first().click();
    
    // Verify selected content is displayed
    await expect(page.locator('text=Contenido Seleccionado')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
    
    // Test copy functionality
    await page.locator('button', { hasText: 'Copiar' }).click();
  });

  test('should optimize content for different platforms', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    // Navigate to AI Content tab
    await page.locator('button[role="tab"]', { hasText: 'IA' }).click();
    await page.waitForSelector('text=Sugerencias de IA');
    
    // Test different platforms
    const platforms = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'];
    
    for (const platform of platforms) {
      // Select platform
      await page.locator('select').first().click();
      await page.locator(`text=${platform}`).click();
      
      // Add keywords
      await page.fill('input[placeholder*="palabra clave"]', 'test content');
      await page.press('input[placeholder*="palabra clave"]', 'Enter');
      
      // Generate content
      await page.click('button', { hasText: 'Generar Contenido' });
      await page.waitForSelector('text=Generar Contenido', { timeout: 10000 });
      
      // Switch to suggestions to verify platform-specific content
      await page.locator('button[role="tab"]', { hasText: 'Sugerencias' }).click();
      await expect(page.locator(`text=${platform}`)).toBeVisible();
      
      // Clear keywords for next iteration
      await page.locator('button[role="tab"]', { hasText: 'Generador' }).click();
      await page.locator('button', { hasText: '×' }).first().click();
    }
  });

  test('should handle different content categories', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    // Navigate to AI Content tab
    await page.locator('button[role="tab"]', { hasText: 'IA' }).click();
    await page.waitForSelector('text=Sugerencias de IA');
    
    // Test different categories
    const categories = [
      { name: 'Promocional', keywords: ['oferta', 'descuento'] },
      { name: 'Educativo', keywords: ['consejo', 'tip'] },
      { name: 'Comunidad', keywords: ['gracias', 'clientes'] }
    ];
    
    for (const category of categories) {
      // Select category
      await page.locator('select').nth(1).click();
      await page.locator(`text=${category.name}`).click();
      
      // Add category-specific keywords
      for (const keyword of category.keywords) {
        await page.fill('input[placeholder*="palabra clave"]', keyword);
        await page.press('input[placeholder*="palabra clave"]', 'Enter');
      }
      
      // Generate content
      await page.click('button', { hasText: 'Generar Contenido' });
      await page.waitForSelector('text=Generar Contenido', { timeout: 10000 });
      
      // Switch to suggestions to verify category-specific content
      await page.locator('button[role="tab"]', { hasText: 'Sugerencias' }).click();
      await expect(page.locator(`text=${category.name.toLowerCase()}`)).toBeVisible();
      
      // Clear keywords for next iteration
      await page.locator('button[role="tab"]', { hasText: 'Generador' }).click();
      for (let i = 0; i < category.keywords.length; i++) {
        await page.locator('button', { hasText: '×' }).first().click();
      }
    }
  });

  test('should toggle hashtags and call-to-action options', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    // Navigate to AI Content tab
    await page.locator('button[role="tab"]', { hasText: 'IA' }).click();
    await page.waitForSelector('text=Sugerencias de IA');
    
    // Add keywords
    await page.fill('input[placeholder*="palabra clave"]', 'servicio premium');
    await page.press('input[placeholder*="palabra clave"]', 'Enter');
    
    // Test with hashtags enabled
    await page.locator('input[type="checkbox"]').first().check();
    await page.click('button', { hasText: 'Generar Contenido' });
    await page.waitForSelector('text=Generar Contenido', { timeout: 10000 });
    
    // Switch to suggestions and verify hashtags
    await page.locator('button[role="tab"]', { hasText: 'Sugerencias' }).click();
    await expect(page.locator('text=hashtag')).toBeVisible();
    
    // Test with call-to-action enabled
    await page.locator('button[role="tab"]', { hasText: 'Generador' }).click();
    await page.locator('input[type="checkbox"]').nth(1).check();
    await page.click('button', { hasText: 'Generar Contenido' });
    await page.waitForSelector('text=Generar Contenido', { timeout: 10000 });
    
    // Switch to suggestions and verify call-to-action
    await page.locator('button[role="tab"]', { hasText: 'Sugerencias' }).click();
    await expect(page.locator('text=Contáctanos')).toBeVisible();
  });

  test('should display content confidence scores', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    // Navigate to AI Content tab
    await page.locator('button[role="tab"]', { hasText: 'IA' }).click();
    await page.waitForSelector('text=Sugerencias de IA');
    
    // Generate content
    await page.fill('input[placeholder*="palabra clave"]', 'entrega rápida');
    await page.press('input[placeholder*="palabra clave"]', 'Enter');
    await page.click('button', { hasText: 'Generar Contenido' });
    await page.waitForSelector('text=Generar Contenido', { timeout: 10000 });
    
    // Switch to suggestions
    await page.locator('button[role="tab"]', { hasText: 'Sugerencias' }).click();
    
    // Verify confidence scores are displayed
    const confidenceElements = page.locator('text=/\\d+%/');
    await expect(confidenceElements.first()).toBeVisible();
    
    // Verify confidence scores are reasonable (between 0-100%)
    const confidenceText = await confidenceElements.first().textContent();
    const confidenceValue = parseInt(confidenceText?.replace('%', '') || '0');
    expect(confidenceValue).toBeGreaterThan(0);
    expect(confidenceValue).toBeLessThanOrEqual(100);
  });

  test('should show generation metadata', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    // Navigate to AI Content tab
    await page.locator('button[role="tab"]', { hasText: 'IA' }).click();
    await page.waitForSelector('text=Sugerencias de IA');
    
    // Generate content
    await page.fill('input[placeholder*="palabra clave"]', 'servicio confiable');
    await page.press('input[placeholder*="palabra clave"]', 'Enter');
    await page.click('button', { hasText: 'Generar Contenido' });
    await page.waitForSelector('text=Generar Contenido', { timeout: 10000 });
    
    // Switch to suggestions
    await page.locator('button[role="tab"]', { hasText: 'Sugerencias' }).click();
    
    // Verify metadata is displayed
    await expect(page.locator('text=Generated with:')).toBeVisible();
    await expect(page.locator('text=ms')).toBeVisible();
  });

  test('should handle multiple keywords', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    // Navigate to AI Content tab
    await page.locator('button[role="tab"]', { hasText: 'IA' }).click();
    await page.waitForSelector('text=Sugerencias de IA');
    
    // Add multiple keywords
    const keywords = ['entrega', 'express', 'Puerto Rico', 'confiable', 'rápido'];
    
    for (const keyword of keywords) {
      await page.fill('input[placeholder*="palabra clave"]', keyword);
      await page.press('input[placeholder*="palabra clave"]', 'Enter');
    }
    
    // Verify all keywords are displayed as badges
    for (const keyword of keywords) {
      await expect(page.locator(`text=${keyword}`)).toBeVisible();
    }
    
    // Generate content
    await page.click('button', { hasText: 'Generar Contenido' });
    await page.waitForSelector('text=Generar Contenido', { timeout: 10000 });
    
    // Switch to suggestions
    await page.locator('button[role="tab"]', { hasText: 'Sugerencias' }).click();
    
    // Verify content includes keywords
    const contentElements = page.locator('text=entrega, express, Puerto Rico, confiable, rápido');
    await expect(contentElements.first()).toBeVisible();
  });

  test('should remove keywords', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    // Navigate to AI Content tab
    await page.locator('button[role="tab"]', { hasText: 'IA' }).click();
    await page.waitForSelector('text=Sugerencias de IA');
    
    // Add keywords
    await page.fill('input[placeholder*="palabra clave"]', 'keyword1');
    await page.press('input[placeholder*="palabra clave"]', 'Enter');
    await page.fill('input[placeholder*="palabra clave"]', 'keyword2');
    await page.press('input[placeholder*="palabra clave"]', 'Enter');
    
    // Verify keywords are added
    await expect(page.locator('text=keyword1')).toBeVisible();
    await expect(page.locator('text=keyword2')).toBeVisible();
    
    // Remove first keyword
    await page.locator('button', { hasText: '×' }).first().click();
    
    // Verify first keyword is removed
    await expect(page.locator('text=keyword1')).not.toBeVisible();
    await expect(page.locator('text=keyword2')).toBeVisible();
  });
}); 