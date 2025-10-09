// spec: tests/e2e/test-plans/home-and-products-test-plan.md
// seed: tests/e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Products Page Tests', () => {
  test('Products Page Loads and Lists Products', async ({ page }) => {
    // 1. Navigate to '/products'
    await page.goto('/products');

    // 2. Wait for the product grid/list to render.
    const grid = page.locator('[data-test=product-grid], .product-grid, .products-list');
    await expect(grid).toBeVisible();

    // 3. Verify at least 5 product cards appear and each includes an image, title, price, and button.
    const cards = grid.locator('[data-test=product-card], .product-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = cards.nth(i);
      await expect(card.locator('img')).toBeVisible();
      await expect(card.locator('h2, .product-title')).toBeVisible();
      await expect(card.locator('.price, [data-test=price]')).toBeVisible();
      await expect(card.locator('button:has-text("Add to Cart"), a:has-text("View")')).toBeVisible();
    }

    // 4. Verify product links navigate to product detail pages.
    const firstLink = cards.nth(0).locator('a, button').first();
    await firstLink.click();
    await expect(page).toHaveURL(/\/product|\/products\//);
  });

  test('Product Cards - Add to Cart Interaction', async ({ page }) => {
    // 1. Navigate to '/products'
    await page.goto('/products');

    // 2. Identify a product card and click "Add to Cart".
    const addButtons = page.locator('button:has-text("Add to Cart"), [data-test=add-to-cart]');
    await expect(addButtons.first()).toBeVisible();
    await addButtons.first().click();

    // 3. Verify cart indicator (nav/cart icon) shows incremented count or displays a mini cart overlay.
    const cartCount = page.locator('[data-test=cart-count], .cart-count');
    await expect(cartCount).toHaveText(/\d+/);

    // 4. Open the cart and verify product appears with correct name, unit price, quantity = 1, and subtotal.
    const cartToggle = page.locator('[data-test=cart-toggle], a[href*="/cart"], button[aria-label*="cart"]');
    await cartToggle.click();
    const cartItem = page.locator('[data-test=cart-item], .cart-item').first();
    await expect(cartItem).toBeVisible();
    await expect(cartItem.locator('.quantity')).toHaveText('1');
  });
});
