import { test, expect } from '@playwright/test';

// Test suite for Social Media Features
test.describe('Social Media Features', () => {
           test.beforeEach(async ({ page }) => {
           // Navigate to the application
           await page.goto('http://localhost:5173');
    
    // Login with admin account
    await page.fill('input[type="email"]', 'admin@prmcms.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
             // Wait for login to complete - look for dashboard content
         await page.waitForSelector('text=Today\'s Stats', { timeout: 10000 });
  });

           test('should display social media dashboard', async ({ page }) => {
           // Navigate to social page
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

           test('should navigate to Accounts tab and display connected accounts', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Cuentas' }).click();
    await page.waitForSelector('[data-testid="accounts-overview"]', { timeout: 5000 });
    
    const accountsOverview = page.locator('[data-testid="accounts-overview"]');
    await expect(accountsOverview).toBeVisible();
    
    // Verify connected accounts are displayed
    await expect(page.locator('text=Instagram')).toBeVisible();
    await expect(page.locator('text=Facebook')).toBeVisible();
    await expect(page.locator('text=Twitter')).toBeVisible();
  });

           test('should navigate to Posts tab and display post scheduler', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Publicaciones' }).click();
    await page.waitForSelector('[data-testid="post-scheduler"]', { timeout: 5000 });
    
    const postScheduler = page.locator('[data-testid="post-scheduler"]');
    await expect(postScheduler).toBeVisible();
    
    // Verify post composition elements
    await expect(page.locator('text=Componer Publicación')).toBeVisible();
    await expect(page.locator('text=Plataformas')).toBeVisible();
    await expect(page.locator('text=Contenido')).toBeVisible();
    await expect(page.locator('text=Programación')).toBeVisible();
  });

           test('should create a new social post', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Publicaciones' }).click();
    await page.waitForSelector('[data-testid="post-scheduler"]');
    
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

           test('should navigate to Mentions tab and display mention monitor', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Menciones' }).click();
    await page.waitForSelector('[data-testid="mention-monitor"]', { timeout: 5000 });
    
    const mentionMonitor = page.locator('[data-testid="mention-monitor"]');
    await expect(mentionMonitor).toBeVisible();
    
    // Verify mention statistics
    await expect(page.locator('text=Total Menciones')).toBeVisible();
    await expect(page.locator('text=Sin Responder')).toBeVisible();
    await expect(page.locator('text=Urgentes')).toBeVisible();
    await expect(page.locator('text=Positivas')).toBeVisible();
    await expect(page.locator('text=Negativas')).toBeVisible();
  });

           test('should reply to a mention', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Menciones' }).click();
    await page.waitForSelector('[data-testid="mention-monitor"]');
    
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

           test('should navigate to Analytics tab and display social analytics', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Analíticas' }).click();
    await page.waitForSelector('[data-testid="social-analytics"]', { timeout: 5000 });
    
    const socialAnalytics = page.locator('[data-testid="social-analytics"]');
    await expect(socialAnalytics).toBeVisible();
    
    // Verify analytics metrics
    await expect(page.locator('text=Total Seguidores')).toBeVisible();
    await expect(page.locator('text=Engagement Total')).toBeVisible();
    await expect(page.locator('text=Alcance Total')).toBeVisible();
    await expect(page.locator('text=Engagement Rate')).toBeVisible();
    
    // Verify platform breakdown
    await expect(page.locator('text=Rendimiento por Plataforma')).toBeVisible();
    await expect(page.locator('text=Distribución de Engagement')).toBeVisible();
  });

           test('should navigate to Community tab and display community features', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Comunidad' }).click();
    await page.waitForSelector('[data-testid="community-features"]', { timeout: 5000 });
    
    const communityFeatures = page.locator('[data-testid="community-features"]');
    await expect(communityFeatures).toBeVisible();
    
    // Verify community sections
    await expect(page.locator('text=Foros Comunitarios')).toBeVisible();
    await expect(page.locator('text=Eventos Locales')).toBeVisible();
  });

           test('should use post templates', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Publicaciones' }).click();
    await page.waitForSelector('[data-testid="post-scheduler"]');
    
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
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Menciones' }).click();
    await page.waitForSelector('[data-testid="mention-monitor"]');
    
    // Filter by Instagram
    await page.selectOption('select[placeholder="Plataforma"]', 'instagram');
    
    // Filter by positive sentiment
    await page.selectOption('select[placeholder="Sentimiento"]', 'positive');
    
    // Verify filtered results
    await expect(page.locator('[data-testid="mention-card"]')).toHaveCount(1);
  });

           test('should export analytics data', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Analíticas' }).click();
    await page.waitForSelector('[data-testid="social-analytics"]');
    
    // Click export button
    await page.click('button', { hasText: 'Exportar' });
    
    // Verify export options
    await expect(page.locator('text=Exportar como CSV')).toBeVisible();
    await expect(page.locator('text=Exportar como PDF')).toBeVisible();
  });

           test('should change analytics date range', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Analíticas' }).click();
    await page.waitForSelector('[data-testid="social-analytics"]');
    
    // Change date range to last 7 days
    await page.selectOption('select', '7');
    
    // Verify date range changed
    await expect(page.locator('text=Últimos 7 días')).toBeVisible();
  });

           test('should connect a new social account', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Cuentas' }).click();
    await page.waitForSelector('[data-testid="accounts-overview"]');
    
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
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Menciones' }).click();
    await page.waitForSelector('[data-testid="mention-monitor"]');
    
    // Click on a mention to open reply panel
    await page.locator('[data-testid="mention-card"]').first().click();
    await page.waitForSelector('[data-testid="reply-panel"]');
    
    // Use a response template
    await page.click('button', { hasText: 'Saludo General' });
    
    // Verify template content is loaded
    await expect(page.locator('text=¡Hola! Gracias por contactarnos')).toBeVisible();
  });

           test('should view social proof features', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    // Navigate to social proof section (if available in main dashboard)
    await expect(page.locator('text=Reseñas Sociales')).toBeVisible();
    await expect(page.locator('text=Testimonios')).toBeVisible();
    await expect(page.locator('text=Programa de Referidos')).toBeVisible();
  });

           test('should access social shipping features', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    // Navigate to social shipping section
    await expect(page.locator('text=Instagram Shopping')).toBeVisible();
    await expect(page.locator('text=Facebook Marketplace')).toBeVisible();
    await expect(page.locator('text=WhatsApp Business')).toBeVisible();
  });

           test('should use content creation tools', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Publicaciones' }).click();
    await page.waitForSelector('[data-testid="post-scheduler"]');
    
    // Test hashtag suggestions
    await page.fill('textarea[placeholder="¿Qué quieres compartir hoy?"]', 'Nuevo servicio de entrega');
    await page.click('button', { hasText: '#' });
    
    // Verify hashtag suggestions appear
    await expect(page.locator('text=#CaribeMail')).toBeVisible();
    await expect(page.locator('text=#PuertoRico')).toBeVisible();
  });

           test('should access community features', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    await page.locator('button[role="tab"]', { hasText: 'Comunidad' }).click();
    await page.waitForSelector('[data-testid="community-features"]');
    
    // Verify community features
    await expect(page.locator('text=Foros Comunitarios')).toBeVisible();
    await expect(page.locator('text=Eventos Locales')).toBeVisible();
    await expect(page.locator('text=Grupos de Entrega')).toBeVisible();
    await expect(page.locator('text=Compartir Paquetes')).toBeVisible();
  });

           test('should view social media settings', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    // Click settings button
    await page.click('button', { hasText: 'Configuración' });
    
    // Verify settings options
    await expect(page.locator('text=Configuración Social')).toBeVisible();
    await expect(page.locator('text=Notificaciones')).toBeVisible();
    await expect(page.locator('text=Horarios de Negocio')).toBeVisible();
  });

           test('should test mobile responsiveness', async ({ page }) => {
           // Set mobile viewport
           await page.setViewportSize({ width: 375, height: 667 });
           
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
    // Verify mobile layout
    await expect(page.locator('[data-testid="mobile-layout"]')).toBeVisible();
    
    // Test mobile navigation
    await page.locator('button[role="tab"]', { hasText: 'Dashboard' }).click();
    await expect(page.locator('[data-testid="mobile-dashboard"]')).toBeVisible();
  });

           test('should handle social media errors gracefully', async ({ page }) => {
           await page.goto('http://localhost:5174/#/social');
    await page.waitForSelector('[data-testid="social-dashboard"]');
    
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
           await page.goto('http://localhost:5174/#/social');
    
    // Measure page load time
    const startTime = Date.now();
    await page.waitForSelector('[data-testid="social-dashboard"]');
    const loadTime = Date.now() - startTime;
    
    // Verify page loads within acceptable time (5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    // Test smooth scrolling
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Verify no layout shifts
    await expect(page.locator('[data-testid="social-dashboard"]')).toBeVisible();
  });
}); 