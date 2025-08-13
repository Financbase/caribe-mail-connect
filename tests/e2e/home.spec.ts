import { test, expect } from '@playwright/test';

test('home page has PRMCMS title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/PRMCMS/);
});
