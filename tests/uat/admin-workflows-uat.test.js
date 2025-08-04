/**
 * Admin Workflows UAT Test Suite
 * 20+ comprehensive test scenarios for admin functionality
 */

import { test, expect } from '@playwright/test';

// Test data for admin users
const adminUser = {
  email: 'admin@prmcms.com',
  password: 'AdminPassword123!',
  name: 'Administrator'
};

const staffUser = {
  email: 'staff@prmcms.com',
  password: 'StaffPassword123!',
  name: 'Staff Member',
  role: 'staff'
};

test.describe('User Management and Permissions (8 scenarios)', () => {
  test('UAT-A001: Admin login and dashboard access', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await expect(page).toHaveURL('/admin/dashboard');
    await expect(page.locator('[data-testid="admin-welcome"]')).toContainText('Panel de Administración');
    await expect(page.locator('[data-testid="user-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="package-count"]')).toBeVisible();
  });

  test('UAT-A002: Create new staff user', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/users');
    await page.click('[data-testid="add-user-button"]');
    await page.fill('[data-testid="user-name"]', 'Nuevo Empleado');
    await page.fill('[data-testid="user-email"]', 'nuevo.empleado@prmcms.com');
    await page.selectOption('[data-testid="user-role"]', 'staff');
    await page.selectOption('[data-testid="user-municipality"]', 'San Juan');
    await page.click('[data-testid="create-user-button"]');
    
    await expect(page.locator('[data-testid="user-created-success"]')).toContainText('Usuario creado exitosamente');
  });

  test('UAT-A003: Assign role-based permissions', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/users');
    await page.click('[data-testid="user-row"]').first();
    await page.click('[data-testid="edit-permissions-button"]');
    
    await page.check('[data-testid="permission-package-management"]');
    await page.check('[data-testid="permission-customer-service"]');
    await page.uncheck('[data-testid="permission-billing-management"]');
    await page.click('[data-testid="save-permissions-button"]');
    
    await expect(page.locator('[data-testid="permissions-updated"]')).toContainText('Permisos actualizados');
  });

  test('UAT-A004: Deactivate user account', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/users');
    await page.click('[data-testid="user-row"]').first();
    await page.click('[data-testid="deactivate-user-button"]');
    await page.click('[data-testid="confirm-deactivation"]');
    
    await expect(page.locator('[data-testid="user-deactivated"]')).toContainText('Usuario desactivado');
    await expect(page.locator('[data-testid="user-status"]')).toContainText('Inactivo');
  });

  test('UAT-A005: Reset user password', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/users');
    await page.click('[data-testid="user-row"]').first();
    await page.click('[data-testid="reset-password-button"]');
    await page.click('[data-testid="confirm-reset"]');
    
    await expect(page.locator('[data-testid="password-reset-success"]')).toContainText('Contraseña restablecida');
  });

  test('UAT-A006: View user activity logs', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/users');
    await page.click('[data-testid="user-row"]').first();
    await page.click('[data-testid="view-activity-button"]');
    
    await expect(page.locator('[data-testid="activity-log"]')).toBeVisible();
    await expect(page.locator('[data-testid="activity-entry"]').first()).toBeVisible();
  });

  test('UAT-A007: Bulk user operations', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/users');
    await page.check('[data-testid="user-checkbox"]').first();
    await page.check('[data-testid="user-checkbox"]').nth(1);
    await page.selectOption('[data-testid="bulk-action"]', 'send-notification');
    await page.click('[data-testid="apply-bulk-action"]');
    
    await expect(page.locator('[data-testid="bulk-action-success"]')).toContainText('Acción aplicada a usuarios seleccionados');
  });

  test('UAT-A008: Export user data', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/users');
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-users-button"]');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('users');
    expect(download.suggestedFilename()).toContain('.csv');
  });
});

test.describe('System Configuration (6 scenarios)', () => {
  test('UAT-A009: Configure service pricing', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/settings/pricing');
    await page.fill('[data-testid="mailbox-rental-price"]', '25.00');
    await page.fill('[data-testid="package-receiving-price"]', '5.00');
    await page.fill('[data-testid="forwarding-price"]', '15.00');
    await page.click('[data-testid="save-pricing-button"]');
    
    await expect(page.locator('[data-testid="pricing-updated"]')).toContainText('Precios actualizados');
  });

  test('UAT-A010: Configure IVU tax settings', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/settings/tax');
    await page.fill('[data-testid="ivu-rate"]', '11.5');
    await page.check('[data-testid="auto-calculate-ivu"]');
    await page.fill('[data-testid="suri-merchant-id"]', 'PR-CMRA-001');
    await page.click('[data-testid="save-tax-settings"]');
    
    await expect(page.locator('[data-testid="tax-settings-saved"]')).toContainText('Configuración de impuestos guardada');
  });

  test('UAT-A011: Configure notification templates', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/settings/notifications');
    await page.selectOption('[data-testid="template-select"]', 'package-arrival');
    await page.fill('[data-testid="email-subject"]', 'Paquete Recibido - {{tracking_number}}');
    await page.fill('[data-testid="email-body"]', 'Su paquete {{tracking_number}} ha llegado a nuestras instalaciones.');
    await page.click('[data-testid="save-template-button"]');
    
    await expect(page.locator('[data-testid="template-saved"]')).toContainText('Plantilla guardada');
  });

  test('UAT-A012: Configure business hours', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/settings/hours');
    await page.selectOption('[data-testid="monday-open"]', '08:00');
    await page.selectOption('[data-testid="monday-close"]', '17:00');
    await page.check('[data-testid="saturday-open-checkbox"]');
    await page.selectOption('[data-testid="saturday-open"]', '09:00');
    await page.selectOption('[data-testid="saturday-close"]', '13:00');
    await page.click('[data-testid="save-hours-button"]');
    
    await expect(page.locator('[data-testid="hours-saved"]')).toContainText('Horarios guardados');
  });

  test('UAT-A013: Configure municipality settings', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/settings/municipalities');
    await page.click('[data-testid="add-municipality-button"]');
    await page.fill('[data-testid="municipality-name"]', 'Cataño');
    await page.fill('[data-testid="municipality-code"]', 'CAT');
    await page.fill('[data-testid="municipal-tax-rate"]', '1.0');
    await page.click('[data-testid="save-municipality-button"]');
    
    await expect(page.locator('[data-testid="municipality-added"]')).toContainText('Municipio agregado');
  });

  test('UAT-A014: System backup configuration', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/settings/backup');
    await page.selectOption('[data-testid="backup-frequency"]', 'daily');
    await page.selectOption('[data-testid="backup-time"]', '02:00');
    await page.fill('[data-testid="retention-days"]', '30');
    await page.check('[data-testid="enable-offsite-backup"]');
    await page.click('[data-testid="save-backup-settings"]');
    
    await expect(page.locator('[data-testid="backup-settings-saved"]')).toContainText('Configuración de respaldo guardada');
  });
});

test.describe('Compliance Reporting (6 scenarios)', () => {
  test('UAT-A015: Generate CMRA compliance report', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/reports/compliance');
    await page.selectOption('[data-testid="report-type"]', 'cmra-quarterly');
    await page.selectOption('[data-testid="report-quarter"]', 'Q1-2024');
    await page.click('[data-testid="generate-report-button"]');
    
    await expect(page.locator('[data-testid="report-generated"]')).toContainText('Reporte generado');
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="download-report-button"]');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('cmra-compliance');
  });

  test('UAT-A016: Generate IVU tax report', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/reports/tax');
    await page.selectOption('[data-testid="tax-report-type"]', 'ivu-monthly');
    await page.selectOption('[data-testid="report-month"]', '2024-01');
    await page.click('[data-testid="generate-tax-report-button"]');
    
    await expect(page.locator('[data-testid="tax-report-generated"]')).toContainText('Reporte de IVU generado');
    await expect(page.locator('[data-testid="total-ivu-collected"]')).toBeVisible();
  });

  test('UAT-A017: Submit SURI tax report', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/reports/suri');
    await page.selectOption('[data-testid="suri-period"]', '2024-01');
    await page.click('[data-testid="submit-to-suri-button"]');
    
    await expect(page.locator('[data-testid="suri-submission-success"]')).toContainText('Reporte enviado a SURI');
    await expect(page.locator('[data-testid="suri-confirmation-number"]')).toBeVisible();
  });

  test('UAT-A018: View audit trail', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/audit');
    await page.fill('[data-testid="audit-date-from"]', '2024-01-01');
    await page.fill('[data-testid="audit-date-to"]', '2024-01-31');
    await page.selectOption('[data-testid="audit-action-type"]', 'all');
    await page.click('[data-testid="search-audit-button"]');
    
    await expect(page.locator('[data-testid="audit-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="audit-entry"]').first()).toBeVisible();
  });

  test('UAT-A019: Generate customer data report', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/reports/customers');
    await page.selectOption('[data-testid="customer-report-type"]', 'active-customers');
    await page.selectOption('[data-testid="municipality-filter"]', 'San Juan');
    await page.click('[data-testid="generate-customer-report"]');
    
    await expect(page.locator('[data-testid="customer-report-ready"]')).toContainText('Reporte de clientes generado');
  });

  test('UAT-A020: Schedule automated reports', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[data-testid="admin-email-input"]', adminUser.email);
    await page.fill('[data-testid="admin-password-input"]', adminUser.password);
    await page.click('[data-testid="admin-login-button"]');
    
    await page.goto('/admin/reports/schedule');
    await page.selectOption('[data-testid="scheduled-report-type"]', 'monthly-summary');
    await page.selectOption('[data-testid="schedule-frequency"]', 'monthly');
    await page.selectOption('[data-testid="schedule-day"]', '1');
    await page.fill('[data-testid="recipient-emails"]', 'admin@prmcms.com,manager@prmcms.com');
    await page.click('[data-testid="save-schedule-button"]');
    
    await expect(page.locator('[data-testid="schedule-saved"]')).toContainText('Programación de reporte guardada');
  });
});

// Test execution summary
test.afterAll(async () => {
  console.log('✅ Admin Workflows UAT Completed');
  console.log('📊 Total Scenarios: 20');
  console.log('🎯 Coverage: User Management, System Configuration, Compliance Reporting');
  console.log('🌍 Puerto Rico Features: IVU tax configuration, SURI integration, municipalities');
  console.log('🔒 Security: Role-based permissions, audit trails');
  console.log('📋 Compliance: CMRA reporting, tax compliance');
});
