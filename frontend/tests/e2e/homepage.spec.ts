import { test, expect } from '@playwright/test';

// Homepage E2E tests

test.describe('Homepage', () => {
  test('should load and display welcome message', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1, h2, h3')).toHaveText(/welcome/i, { useInnerText: true });
  });

  test('should display navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: /products/i })).toBeVisible();
  });
});
