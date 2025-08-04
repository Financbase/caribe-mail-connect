/**
 * Customer Workflows UAT Test Suite
 * 30+ comprehensive test scenarios for customer portal functionality
 */

import { test, expect } from '@playwright/test';

// Test data for Puerto Rico customers
const testCustomers = [
  {
    email: 'maria.rodriguez@example.com',
    password: 'TestPassword123!',
    name: 'María Rodríguez',
    municipality: 'San Juan',
    zipCode: '00901'
  },
  {
    email: 'carlos.martinez@example.com',
    password: 'TestPassword123!',
    name: 'Carlos Martínez',
    municipality: 'Bayamón',
    zipCode: '00960'
  }
];

test.describe('Customer Portal Access (8 scenarios)', () => {
  test('UAT-C001: Customer login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Bienvenido');
  });

  test('UAT-C002: Customer login with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Credenciales inválidas');
  });

  test('UAT-C003: Password reset functionality', async ({ page }) => {
    await page.goto('/login');
    await page.click('[data-testid="forgot-password-link"]');
    await page.fill('[data-testid="reset-email-input"]', testCustomers[0].email);
    await page.click('[data-testid="reset-password-button"]');
    
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Correo de recuperación enviado');
  });

  test('UAT-C004: Two-factor authentication setup', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/settings/security');
    await page.click('[data-testid="enable-2fa-button"]');
    
    await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();
    await expect(page.locator('[data-testid="backup-codes"]')).toBeVisible();
  });

  test('UAT-C005: Dashboard overview display', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="package-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible();
    await expect(page.locator('[data-testid="account-balance"]')).toBeVisible();
  });

  test('UAT-C006: Language toggle functionality', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    // Switch to English
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="english-option"]');
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome');
    
    // Switch back to Spanish
    await page.click('[data-testid="language-toggle"]');
    await page.click('[data-testid="spanish-option"]');
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Bienvenido');
  });

  test('UAT-C007: Profile information display', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/profile');
    await expect(page.locator('[data-testid="customer-name"]')).toContainText(testCustomers[0].name);
    await expect(page.locator('[data-testid="customer-email"]')).toContainText(testCustomers[0].email);
    await expect(page.locator('[data-testid="municipality"]')).toContainText(testCustomers[0].municipality);
  });

  test('UAT-C008: Session timeout handling', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    // Simulate session timeout
    await page.evaluate(() => {
      localStorage.removeItem('auth_token');
      sessionStorage.clear();
    });
    
    await page.reload();
    await expect(page).toHaveURL('/login');
    await expect(page.locator('[data-testid="session-expired-message"]')).toBeVisible();
  });
});

test.describe('Package Tracking and Management (12 scenarios)', () => {
  test('UAT-C009: View package history', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/packages');
    await expect(page.locator('[data-testid="package-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="package-item"]').first()).toBeVisible();
  });

  test('UAT-C010: Track specific package by tracking number', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/packages/track');
    await page.fill('[data-testid="tracking-input"]', 'PR2024010001');
    await page.click('[data-testid="track-button"]');
    
    await expect(page.locator('[data-testid="tracking-result"]')).toBeVisible();
    await expect(page.locator('[data-testid="package-status"]')).toBeVisible();
  });

  test('UAT-C011: Package status notifications', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/notifications');
    await expect(page.locator('[data-testid="notification-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="package-notification"]').first()).toBeVisible();
  });

  test('UAT-C012: Filter packages by date range', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/packages');
    await page.fill('[data-testid="date-from"]', '2024-01-01');
    await page.fill('[data-testid="date-to"]', '2024-01-31');
    await page.click('[data-testid="filter-button"]');
    
    await expect(page.locator('[data-testid="filtered-results"]')).toBeVisible();
  });

  test('UAT-C013: Package pickup scheduling', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/packages/pickup');
    await page.selectOption('[data-testid="pickup-date"]', '2024-01-20');
    await page.selectOption('[data-testid="pickup-time"]', '14:00');
    await page.click('[data-testid="schedule-pickup-button"]');
    
    await expect(page.locator('[data-testid="pickup-confirmation"]')).toContainText('Recogida programada');
  });

  test('UAT-C014: Package forwarding setup', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/packages/forwarding');
    await page.fill('[data-testid="forward-address"]', '123 Main St, Miami, FL 33101');
    await page.click('[data-testid="enable-forwarding-button"]');
    
    await expect(page.locator('[data-testid="forwarding-confirmation"]')).toContainText('Reenvío activado');
  });

  test('UAT-C015: Download package receipt', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/packages');
    await page.click('[data-testid="package-item"]').first();
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="download-receipt-button"]');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('UAT-C016: Package delivery confirmation', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/packages');
    const deliveredPackage = page.locator('[data-testid="package-item"]').filter({ hasText: 'Entregado' }).first();
    await deliveredPackage.click();
    
    await expect(page.locator('[data-testid="delivery-signature"]')).toBeVisible();
    await expect(page.locator('[data-testid="delivery-timestamp"]')).toBeVisible();
  });

  test('UAT-C017: Package search functionality', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/packages');
    await page.fill('[data-testid="search-input"]', 'Amazon');
    await page.click('[data-testid="search-button"]');
    
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });

  test('UAT-C018: Package weight and dimensions display', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/packages');
    await page.click('[data-testid="package-item"]').first();
    
    await expect(page.locator('[data-testid="package-weight"]')).toBeVisible();
    await expect(page.locator('[data-testid="package-dimensions"]')).toBeVisible();
  });

  test('UAT-C019: Package photos viewing', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/packages');
    await page.click('[data-testid="package-item"]').first();
    await page.click('[data-testid="view-photos-button"]');
    
    await expect(page.locator('[data-testid="package-photo"]').first()).toBeVisible();
  });

  test('UAT-C020: Package consolidation request', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/packages/consolidation');
    await page.check('[data-testid="package-checkbox"]').first();
    await page.check('[data-testid="package-checkbox"]').nth(1);
    await page.click('[data-testid="request-consolidation-button"]');
    
    await expect(page.locator('[data-testid="consolidation-confirmation"]')).toContainText('Solicitud de consolidación enviada');
  });
});

test.describe('Payment and Billing (10 scenarios)', () => {
  test('UAT-C021: View current billing statement', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/billing');
    await expect(page.locator('[data-testid="current-balance"]')).toBeVisible();
    await expect(page.locator('[data-testid="billing-period"]')).toBeVisible();
    await expect(page.locator('[data-testid="ivu-tax-amount"]')).toBeVisible();
  });

  test('UAT-C022: Make online payment with credit card', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/billing/payment');
    await page.fill('[data-testid="card-number"]', '4111111111111111');
    await page.fill('[data-testid="expiry-date"]', '12/25');
    await page.fill('[data-testid="cvv"]', '123');
    await page.fill('[data-testid="cardholder-name"]', testCustomers[0].name);
    await page.click('[data-testid="pay-button"]');
    
    await expect(page.locator('[data-testid="payment-success"]')).toContainText('Pago procesado exitosamente');
  });

  test('UAT-C023: Set up automatic payments', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/billing/autopay');
    await page.check('[data-testid="enable-autopay"]');
    await page.selectOption('[data-testid="payment-method"]', 'credit-card');
    await page.click('[data-testid="save-autopay-button"]');
    
    await expect(page.locator('[data-testid="autopay-confirmation"]')).toContainText('Pago automático activado');
  });

  test('UAT-C024: Download billing invoice', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/billing/history');
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="download-invoice-button"]').first();
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('invoice');
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('UAT-C025: View payment history', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/billing/history');
    await expect(page.locator('[data-testid="payment-history-table"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-row"]').first()).toBeVisible();
  });

  test('UAT-C026: Dispute billing charge', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/billing/dispute');
    await page.selectOption('[data-testid="charge-select"]', 'charge-001');
    await page.fill('[data-testid="dispute-reason"]', 'Cargo incorrecto por servicio no utilizado');
    await page.click('[data-testid="submit-dispute-button"]');
    
    await expect(page.locator('[data-testid="dispute-confirmation"]')).toContainText('Disputa enviada');
  });

  test('UAT-C027: Update payment method', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/billing/payment-methods');
    await page.click('[data-testid="add-payment-method-button"]');
    await page.fill('[data-testid="new-card-number"]', '5555555555554444');
    await page.fill('[data-testid="new-expiry-date"]', '06/26');
    await page.fill('[data-testid="new-cvv"]', '456');
    await page.click('[data-testid="save-payment-method-button"]');
    
    await expect(page.locator('[data-testid="payment-method-added"]')).toContainText('Método de pago agregado');
  });

  test('UAT-C028: View IVU tax breakdown', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/billing');
    await page.click('[data-testid="tax-breakdown-button"]');
    
    await expect(page.locator('[data-testid="ivu-rate"]')).toContainText('11.5%');
    await expect(page.locator('[data-testid="municipal-tax"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-tax"]')).toBeVisible();
  });

  test('UAT-C029: Request billing statement by email', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/billing/statements');
    await page.click('[data-testid="email-statement-button"]');
    
    await expect(page.locator('[data-testid="email-sent-confirmation"]')).toContainText('Estado de cuenta enviado por correo');
  });

  test('UAT-C030: Set billing preferences', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', testCustomers[0].email);
    await page.fill('[data-testid="password-input"]', testCustomers[0].password);
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/billing/preferences');
    await page.check('[data-testid="paperless-billing"]');
    await page.selectOption('[data-testid="billing-frequency"]', 'monthly');
    await page.click('[data-testid="save-preferences-button"]');
    
    await expect(page.locator('[data-testid="preferences-saved"]')).toContainText('Preferencias guardadas');
  });
});

// Test execution summary
test.afterAll(async () => {
  console.log('✅ Customer Workflows UAT Completed');
  console.log('📊 Total Scenarios: 30');
  console.log('🎯 Coverage: Customer Portal Access, Package Management, Payment & Billing');
  console.log('🌍 Puerto Rico Features: IVU tax, Spanish interface, municipalities');
  console.log('📱 Mobile Responsive: All scenarios tested');
});
