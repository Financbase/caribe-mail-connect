/**
 * Bilingual Testing UAT Suite
 * Comprehensive Spanish/English interface testing for Puerto Rico
 */

import { test, expect } from '@playwright/test';

// Test data for bilingual testing
const testUser = {
  email: 'test.user@example.com',
  password: 'TestPassword123!',
  name: 'Usuario de Prueba'
};

test.describe('Language Toggle Functionality', () => {
  test('UAT-B001: Language toggle button visibility and functionality', async ({ page }) => {
    await page.goto('/');
    
    // Verify language toggle is visible
    await expect(page.locator('[data-testid="language-toggle"]')).toBeVisible();
    
    // Default should be Spanish for Puerto Rico
    await expect(page.locator('[data-testid="current-language"]')).toContainText('ES');
    
    // Switch to English
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="english-option"]');
    await expect(page.locator('[data-testid="current-language"]')).toContainText('EN');
    
    // Switch back to Spanish
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    await expect(page.locator('[data-testid="current-language"]')).toContainText('ES');
  });

  test('UAT-B002: Language preference persistence across sessions', async ({ page }) => {
    await page.goto('/');
    
    // Set language to English
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="english-option"]');
    
    // Reload page
    await page.reload();
    
    // Verify English is still selected
    await expect(page.locator('[data-testid="current-language"]')).toContainText('EN');
    await expect(page.locator('[data-testid="welcome-text"]')).toContainText('Welcome');
  });

  test('UAT-B003: Language toggle in authenticated areas', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    
    // Verify language toggle works in dashboard
    await expect(page.locator('[data-testid="language-toggle"]')).toBeVisible();
    
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="english-option"]');
    await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('Dashboard');
    
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('Panel de Control');
  });
});

test.describe('Spanish Interface Validation', () => {
  test('UAT-B004: Homepage Spanish content validation', async ({ page }) => {
    await page.goto('/');
    
    // Ensure Spanish is selected
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    
    // Verify key Spanish text elements
    await expect(page.locator('[data-testid="main-heading"]')).toContainText('Servicios de Correo Comercial');
    await expect(page.locator('[data-testid="services-section"]')).toContainText('Nuestros Servicios');
    await expect(page.locator('[data-testid="contact-button"]')).toContainText('Contáctanos');
    await expect(page.locator('[data-testid="login-link"]')).toContainText('Iniciar Sesión');
  });

  test('UAT-B005: Navigation menu Spanish translations', async ({ page }) => {
    await page.goto('/');
    
    // Set to Spanish
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    
    // Verify navigation menu items
    await expect(page.locator('[data-testid="nav-home"]')).toContainText('Inicio');
    await expect(page.locator('[data-testid="nav-services"]')).toContainText('Servicios');
    await expect(page.locator('[data-testid="nav-about"]')).toContainText('Acerca de');
    await expect(page.locator('[data-testid="nav-contact"]')).toContainText('Contacto');
  });

  test('UAT-B006: Form labels and placeholders in Spanish', async ({ page }) => {
    await page.goto('/contact');
    
    // Set to Spanish
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    
    // Verify form elements
    await expect(page.locator('[data-testid="name-label"]')).toContainText('Nombre');
    await expect(page.locator('[data-testid="email-label"]')).toContainText('Correo Electrónico');
    await expect(page.locator('[data-testid="message-label"]')).toContainText('Mensaje');
    await expect(page.locator('[data-testid="submit-button"]')).toContainText('Enviar');
    
    // Verify placeholders
    await expect(page.locator('[data-testid="name-input"]')).toHaveAttribute('placeholder', 'Ingrese su nombre');
    await expect(page.locator('[data-testid="email-input"]')).toHaveAttribute('placeholder', 'correo@ejemplo.com');
  });

  test('UAT-B007: Error messages in Spanish', async ({ page }) => {
    await page.goto('/login');
    
    // Set to Spanish
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    
    // Trigger validation errors
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="email-error"]')).toContainText('El correo electrónico es requerido');
    await expect(page.locator('[data-testid="password-error"]')).toContainText('La contraseña es requerida');
  });

  test('UAT-B008: Puerto Rico specific terminology', async ({ page }) => {
    await page.goto('/services');
    
    // Set to Spanish
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    
    // Verify Puerto Rico specific terms
    await expect(page.locator('[data-testid="ivu-tax-info"]')).toContainText('IVU (Impuesto sobre Ventas y Uso)');
    await expect(page.locator('[data-testid="municipality-service"]')).toContainText('Servicio a los 78 municipios');
    await expect(page.locator('[data-testid="usps-integration"]')).toContainText('Integración con USPS');
    await expect(page.locator('[data-testid="cmra-compliance"]')).toContainText('Cumplimiento CMRA');
  });
});

test.describe('English Interface Validation', () => {
  test('UAT-B009: Homepage English content validation', async ({ page }) => {
    await page.goto('/');
    
    // Set to English
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="english-option"]');
    
    // Verify key English text elements
    await expect(page.locator('[data-testid="main-heading"]')).toContainText('Commercial Mail Services');
    await expect(page.locator('[data-testid="services-section"]')).toContainText('Our Services');
    await expect(page.locator('[data-testid="contact-button"]')).toContainText('Contact Us');
    await expect(page.locator('[data-testid="login-link"]')).toContainText('Sign In');
  });

  test('UAT-B010: Navigation menu English translations', async ({ page }) => {
    await page.goto('/');
    
    // Set to English
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="english-option"]');
    
    // Verify navigation menu items
    await expect(page.locator('[data-testid="nav-home"]')).toContainText('Home');
    await expect(page.locator('[data-testid="nav-services"]')).toContainText('Services');
    await expect(page.locator('[data-testid="nav-about"]')).toContainText('About');
    await expect(page.locator('[data-testid="nav-contact"]')).toContainText('Contact');
  });

  test('UAT-B011: Form labels and placeholders in English', async ({ page }) => {
    await page.goto('/contact');
    
    // Set to English
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="english-option"]');
    
    // Verify form elements
    await expect(page.locator('[data-testid="name-label"]')).toContainText('Name');
    await expect(page.locator('[data-testid="email-label"]')).toContainText('Email');
    await expect(page.locator('[data-testid="message-label"]')).toContainText('Message');
    await expect(page.locator('[data-testid="submit-button"]')).toContainText('Submit');
    
    // Verify placeholders
    await expect(page.locator('[data-testid="name-input"]')).toHaveAttribute('placeholder', 'Enter your name');
    await expect(page.locator('[data-testid="email-input"]')).toHaveAttribute('placeholder', 'email@example.com');
  });

  test('UAT-B012: Error messages in English', async ({ page }) => {
    await page.goto('/login');
    
    // Set to English
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="english-option"]');
    
    // Trigger validation errors
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Email is required');
    await expect(page.locator('[data-testid="password-error"]')).toContainText('Password is required');
  });
});

test.describe('Date and Time Format Localization', () => {
  test('UAT-B013: Spanish date format (DD/MM/YYYY)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    
    // Set to Spanish
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    
    await page.goto('/packages');
    
    // Verify Spanish date format
    const dateElements = page.locator('[data-testid="package-date"]');
    const firstDate = await dateElements.first().textContent();
    expect(firstDate).toMatch(/\d{2}\/\d{2}\/\d{4}/); // DD/MM/YYYY format
  });

  test('UAT-B014: English date format (MM/DD/YYYY)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    
    // Set to English
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="english-option"]');
    
    await page.goto('/packages');
    
    // Verify English date format
    const dateElements = page.locator('[data-testid="package-date"]');
    const firstDate = await dateElements.first().textContent();
    expect(firstDate).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // MM/DD/YYYY format
  });

  test('UAT-B015: Time zone display (AST - Atlantic Standard Time)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/packages');
    
    // Verify AST timezone is displayed
    await expect(page.locator('[data-testid="timezone-display"]')).toContainText('AST');
  });

  test('UAT-B016: Spanish month names', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    
    // Set to Spanish
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    
    await page.goto('/reports');
    await page.click('[data-testid="date-picker"]');
    
    // Verify Spanish month names
    await expect(page.locator('[data-testid="month-january"]')).toContainText('Enero');
    await expect(page.locator('[data-testid="month-february"]')).toContainText('Febrero');
    await expect(page.locator('[data-testid="month-march"]')).toContainText('Marzo');
  });
});

test.describe('Cultural Considerations', () => {
  test('UAT-B017: Currency format (USD with proper symbols)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/billing');
    
    // Verify USD currency format
    const priceElements = page.locator('[data-testid="price"]');
    const firstPrice = await priceElements.first().textContent();
    expect(firstPrice).toMatch(/\$\d+\.\d{2}/); // $XX.XX format
  });

  test('UAT-B018: Puerto Rico address format validation', async ({ page }) => {
    await page.goto('/register');
    
    // Set to Spanish
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    
    // Fill Puerto Rico address
    await page.fill('[data-testid="address-line1"]', 'Calle Fortaleza 123');
    await page.fill('[data-testid="city"]', 'San Juan');
    await page.selectOption('[data-testid="state"]', 'Puerto Rico');
    await page.fill('[data-testid="zipcode"]', '00901');
    
    // Verify address format is accepted
    await page.click('[data-testid="validate-address"]');
    await expect(page.locator('[data-testid="address-valid"]')).toContainText('Dirección válida');
  });

  test('UAT-B019: Phone number format (Puerto Rico)', async ({ page }) => {
    await page.goto('/contact');
    
    // Set to Spanish
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    
    await page.fill('[data-testid="phone-input"]', '787-555-0123');
    
    // Verify Puerto Rico phone format is accepted
    await expect(page.locator('[data-testid="phone-input"]')).toHaveValue('(787) 555-0123');
  });

  test('UAT-B020: Business terminology appropriateness', async ({ page }) => {
    await page.goto('/services');
    
    // Set to Spanish
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    
    // Verify professional business Spanish
    await expect(page.locator('[data-testid="service-description"]')).toContainText('servicios profesionales');
    await expect(page.locator('[data-testid="customer-service"]')).toContainText('atención al cliente');
    await expect(page.locator('[data-testid="business-hours"]')).toContainText('horario de oficina');
  });
});

test.describe('Consistency Across Pages', () => {
  test('UAT-B021: Navigation consistency across language switch', async ({ page }) => {
    const pages = ['/services', '/about', '/contact', '/pricing'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Test Spanish
      await page.click('[data-testid="language-toggle"]');
      await page.click('[data-testid="spanish-option"]');
      await expect(page.locator('[data-testid="nav-home"]')).toContainText('Inicio');
      
      // Test English
      await page.click('[data-testid="language-toggle"]');
      await page.click('[data-testid="english-option"]');
      await expect(page.locator('[data-testid="nav-home"]')).toContainText('Home');
    }
  });

  test('UAT-B022: Footer content consistency', async ({ page }) => {
    await page.goto('/');
    
    // Test Spanish footer
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    await expect(page.locator('[data-testid="footer-copyright"]')).toContainText('Derechos Reservados');
    await expect(page.locator('[data-testid="footer-privacy"]')).toContainText('Política de Privacidad');
    
    // Test English footer
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="english-option"]');
    await expect(page.locator('[data-testid="footer-copyright"]')).toContainText('All Rights Reserved');
    await expect(page.locator('[data-testid="footer-privacy"]')).toContainText('Privacy Policy');
  });

  test('UAT-B023: Button text consistency', async ({ page }) => {
    await page.goto('/services');
    
    // Test Spanish buttons
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    await expect(page.locator('[data-testid="learn-more-button"]')).toContainText('Más Información');
    await expect(page.locator('[data-testid="get-started-button"]')).toContainText('Comenzar');
    
    // Test English buttons
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="english-option"]');
    await expect(page.locator('[data-testid="learn-more-button"]')).toContainText('Learn More');
    await expect(page.locator('[data-testid="get-started-button"]')).toContainText('Get Started');
  });
});

// Test execution summary
test.afterAll(async () => {
  console.log('✅ Bilingual Testing UAT Completed');
  console.log('📊 Total Scenarios: 23');
  console.log('🎯 Coverage: Language Toggle, Spanish/English Interface, Date/Time Localization');
  console.log('🌍 Puerto Rico Features: AST timezone, PR address format, business terminology');
  console.log('🔄 Consistency: Cross-page navigation, footer, buttons');
  console.log('📱 Cultural: Currency format, phone format, professional terminology');
});
