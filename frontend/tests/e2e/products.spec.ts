import { test, expect } from '@playwright/test';

// Products Page E2E tests

test.describe('Products Page', () => {
  test('should load and display products list', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('heading', { name: /products/i })).toBeVisible();
    await expect(page.getByTestId('product-list')).toBeVisible();
  });

  test('should display product details', async ({ page }) => {
    await page.goto('/products');
    const productCards = page.locator('[data-testid^="product-card-"]');
    await expect(productCards.first()).toBeVisible();
    await expect(productCards.first().getByRole('button', { name: /add to cart/i })).toBeVisible();
  });
});
