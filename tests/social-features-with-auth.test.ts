import { test, expect } from '@playwright/test';

// Comprehensive test suite for Social Media Features with authentication
test.describe('Social Media Features - With Authentication', () => {
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

  test('should display social media dashboard after login', async ({ page }) => {
    // Navigate to social page
    await page.goto('http://localhost:3000/#/social');
    
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

  test('should navigate between social media tabs', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
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

  test('should create a new social post', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    await page.locator('button[role="tab"]', { hasText: 'Publicaciones' }).click();
    await page.waitForSelector('text=Componer Publicación');
    
    // Select Instagram platform
    await page.locator('button', { hasText: 'Instagram' }).click();
    
    // Fill in post content
    await page.fill('textarea[placeholder="¿Qué quieres compartir hoy?"]', '¡Nuevo servicio de entrega express disponible! #CaribeMail #EntregaExpress');
    
    // Add hashtag
    await page.fill('input[placeholder="Agregar hashtag"]', 'PuertoRico');
    await page.press('input[placeholder="Agregar hashtag"]', 'Enter');
    
    // Verify hashtag was added
    await expect(page.locator('text=#PuertoRico')).toBeVisible();
    
    // Select date and time
    await page.click('button', { hasText: 'Seleccionar fecha' });
    await page.click('[data-testid="calendar-day"]'); // Select today's date
    
    // Schedule the post
    await page.click('button', { hasText: 'Programar Publicación' });
    
    // Verify post was scheduled
    await expect(page.locator('text=Publicación programada exitosamente')).toBeVisible();
  });

  test('should reply to a mention', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    await page.locator('button[role="tab"]', { hasText: 'Menciones' }).click();
    await page.waitForSelector('text=Total Menciones');
    
    // Click on first unreplied mention
    await page.locator('[data-testid="mention-card"]').first().click();
    
    // Wait for reply panel to appear
    await page.waitForSelector('[data-testid="reply-panel"]');
    
    // Fill in reply
    await page.fill('textarea[placeholder="Escribe tu respuesta..."]', '¡Gracias por tu comentario! Nos alegra saber que estás satisfecho con nuestro servicio.');
    
    // Send reply
    await page.click('button', { hasText: 'Responder' });
    
    // Verify reply was sent
    await expect(page.locator('text=Respuesta enviada exitosamente')).toBeVisible();
  });

  test('should view social analytics', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    await page.locator('button[role="tab"]', { hasText: 'Analíticas' }).click();
    await page.waitForSelector('text=Total Seguidores');
    
    // Verify analytics metrics
    await expect(page.locator('text=Total Seguidores')).toBeVisible();
    await expect(page.locator('text=Engagement Total')).toBeVisible();
    await expect(page.locator('text=Alcance Total')).toBeVisible();
    await expect(page.locator('text=Engagement Rate')).toBeVisible();
    
    // Verify platform breakdown
    await expect(page.locator('text=Rendimiento por Plataforma')).toBeVisible();
    await expect(page.locator('text=Distribución de Engagement')).toBeVisible();
  });

  test('should access community features', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    await page.locator('button[role="tab"]', { hasText: 'Comunidad' }).click();
    await page.waitForSelector('text=Foros Comunitarios');
    
    // Verify community features
    await expect(page.locator('text=Foros Comunitarios')).toBeVisible();
    await expect(page.locator('text=Eventos Locales')).toBeVisible();
    await expect(page.locator('text=Grupos de Entrega')).toBeVisible();
    await expect(page.locator('text=Compartir Paquetes')).toBeVisible();
  });

  test('should use post templates', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    await page.locator('button[role="tab"]', { hasText: 'Publicaciones' }).click();
    await page.waitForSelector('text=Componer Publicación');
    
    // Go to templates tab
    await page.locator('button[role="tab"]', { hasText: 'Plantillas' }).click();
    await page.waitForSelector('[data-testid="post-templates"]');
    
    // Click on first template
    await page.locator('[data-testid="template-card"]').first().click();
    
    // Verify template content is loaded
    await expect(page.locator('text=Nuevo Servicio')).toBeVisible();
    await expect(page.locator('text=#CaribeMail')).toBeVisible();
  });

  test('should filter mentions by platform and sentiment', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    await page.locator('button[role="tab"]', { hasText: 'Menciones' }).click();
    await page.waitForSelector('text=Total Menciones');
    
    // Filter by Instagram
    await page.selectOption('select[placeholder="Plataforma"]', 'instagram');
    
    // Filter by positive sentiment
    await page.selectOption('select[placeholder="Sentimiento"]', 'positive');
    
    // Verify filtered results
    await expect(page.locator('[data-testid="mention-card"]')).toHaveCount(1);
  });

  test('should export analytics data', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    await page.locator('button[role="tab"]', { hasText: 'Analíticas' }).click();
    await page.waitForSelector('text=Total Seguidores');
    
    // Click export button
    await page.click('button', { hasText: 'Exportar' });
    
    // Verify export options
    await expect(page.locator('text=Exportar como CSV')).toBeVisible();
    await expect(page.locator('text=Exportar como PDF')).toBeVisible();
  });

  test('should connect a new social account', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    await page.locator('button[role="tab"]', { hasText: 'Cuentas' }).click();
    await page.waitForSelector('text=Cuentas Conectadas');
    
    // Click connect new account button
    await page.click('button', { hasText: 'Conectar Nueva' });
    
    // Fill in account details
    await page.fill('input[placeholder="Username"]', 'testuser');
    await page.fill('input[placeholder="Access Token"]', 'test_token_123');
    
    // Connect account
    await page.click('button', { hasText: 'Conectar' });
    
    // Verify account was connected
    await expect(page.locator('text=Cuenta conectada exitosamente')).toBeVisible();
  });

  test('should manage response templates', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    await page.locator('button[role="tab"]', { hasText: 'Menciones' }).click();
    await page.waitForSelector('text=Total Menciones');
    
    // Click on a mention to open reply panel
    await page.locator('[data-testid="mention-card"]').first().click();
    await page.waitForSelector('[data-testid="reply-panel"]');
    
    // Use a response template
    await page.click('button', { hasText: 'Saludo General' });
    
    // Verify template content is loaded
    await expect(page.locator('text=¡Hola! Gracias por contactarnos')).toBeVisible();
  });

  test('should test mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    // Verify mobile layout
    await expect(page.locator('[data-testid="mobile-layout"]')).toBeVisible();
    
    // Test mobile navigation
    await page.locator('button[role="tab"]', { hasText: 'Dashboard' }).click();
    await expect(page.locator('[data-testid="mobile-dashboard"]')).toBeVisible();
  });

  test('should handle social media errors gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    await page.waitForSelector('text=Centro Social');
    
    // Simulate network error by going offline
    await page.context().setOffline(true);
    
    // Try to refresh data
    await page.click('button', { hasText: 'Actualizar' });
    
    // Verify error handling
    await expect(page.locator('text=Error de conexión')).toBeVisible();
    await expect(page.locator('text=Reintentar')).toBeVisible();
    
    // Go back online
    await page.context().setOffline(false);
  });

  test('should test social media performance', async ({ page }) => {
    await page.goto('http://localhost:3000/#/social');
    
    // Measure page load time
    const startTime = Date.now();
    await page.waitForSelector('text=Centro Social');
    const loadTime = Date.now() - startTime;
    
    // Verify page loads within acceptable time (5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    // Test smooth scrolling
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Verify no layout shifts
    await expect(page.locator('text=Centro Social')).toBeVisible();
  });
}); 