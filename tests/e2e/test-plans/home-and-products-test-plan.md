# Homepage and Products Page - Comprehensive Test Plan

## Executive Summary

This document defines comprehensive end-to-end test scenarios for the application's Homepage and Products page. Tests cover critical user journeys, UI elements, navigation, accessibility smoke checks, edge cases, and error handling. Each scenario is written to be independent and runnable in any order, assuming a blank/fresh state.

Assumptions:
- Tests run against a development instance where the database is seeded with default products (use `tests/e2e/seed.spec.ts` to prepare data).
- Test runner: Playwright (projects: chromium, firefox, webkit).
- Authenticated flows are out-of-scope for basic homepage/product browsing tests unless stated.
- Base URL points to the running app (set in Playwright config or via test fixtures).

Success criteria:
- All happy path scenarios complete without errors.
- Validation and negative scenarios trigger expected error messages or behaviors.
- Visual and structural elements render and are accessible (basic ARIA and keyboard checks).

---

## Test Structure

Each scenario contains:
- Title
- Seed/Starting state
- Step-by-step instructions
- Expected results
- Success/failure criteria

---

## Scenarios - Homepage

### H1: Homepage Loads Successfully (Happy Path)
Assumptions: Fresh state, server running, seeded products present.

Steps:
1. Navigate to `/` (homepage).
2. Wait for the main hero element and primary navigation to be visible.
3. Verify featured products carousel or hero banner is visible.
4. Verify primary navigation links (Home, Products, About, Login) are present and have valid hrefs.
5. Verify footer contains contact or copyright information.

Expected Results:
- Page loads within acceptable time (e.g., < 5s local dev).
- Hero/banner and at least one featured product are visible.
- Navigation links point to correct routes.
- No console errors are emitted during load (no uncaught exceptions).

Success Criteria: All verifications pass and there are no uncaught console errors.

Failure Conditions: Missing hero, navigation links broken, or JS errors on load.

---

### H2: Homepage Search Box Basic Functionality
Assumptions: Search input exists on homepage and products exist that match search terms.

Steps:
1. Navigate to `/`.
2. Locate the search input (placeholder e.g., "Search products...").
3. Type a valid product name or partial name (e.g., "widget") and press Enter or click search.
4. Verify page navigates to the Products page or displays inline search results/filter.
5. Verify at least one relevant product card is displayed and the search term is highlighted or used in filtering.

Expected Results:
- Search triggers results and displays relevant products.
- Search results show count or feedback (e.g., "Showing X results").

Success Criteria: Search returns expected product(s) and UX gives clear feedback.

Failure Conditions: No results for valid term, search UI unresponsive, or navigation to invalid URL.

---

### H3: Homepage Responsive and Accessibility Smoke Check
Assumptions: Page supports mobile layout; basic ARIA attributes present.

Steps:
1. Load homepage in desktop viewport.
2. Verify key interactive elements are focusable via keyboard (Tab through nav links, search box, CTA buttons).
3. Switch to a mobile viewport (e.g., 375x812) and reload the homepage.
4. Verify mobile nav (hamburger) toggles and contains expected links.
5. Run quick accessibility assertions: landmarks present (header, main, footer), images have alt text, form inputs have labels.

Expected Results:
- Keyboard navigation is functional.
- Mobile navigation opens and links are usable.
- No missing critical ARIA attributes or missing alt text for core images.

Success Criteria: Basic accessibility checks pass and responsive nav works.

Failure Conditions: Unfocusable interactive elements, missing alt attributes, or broken mobile nav.

---

## Scenarios - Products Page

### P1: Products Page Loads and Lists Products (Happy Path)
Assumptions: Products are seeded and public.

Steps:
1. Navigate to `/products` (or use the Products nav link from the homepage).
2. Wait for the product grid/list to render.
3. Verify at least 5 product cards appear (or a configurable minimum) and each includes an image, title, price, and "Add to Cart" (or "View") button.
4. Verify product links navigate to product detail pages.

Expected Results:
- Product list loads and meets minimum product count.
- Each card displays image, title, and price.
- Clicking a product title or image navigates to detail page.

Success Criteria: Product grid renders, content complete, and navigation works.

Failure Conditions: Empty product list when products seeded, missing key product info, broken links.

---

### P2: Product Filtering and Sorting
Assumptions: The page offers category filters and a sort dropdown (e.g., price, popularity).

Steps:
1. Navigate to `/products`.
2. Select a category filter (checkbox or link) with known products.
3. Assert that product list updates to show only products in that category.
4. Use the sort control to sort by price ascending.
5. Verify the first product's price is less-than-or-equal to the next product's price.

Expected Results:
- Filters narrow the product set correctly.
- Sorting orders products as expected and the UI indicates the active sort.

Success Criteria: Filter and sort controls produce deterministic result sets.

Failure Conditions: Filters do not apply, sort is unstable, or UI fails to reflect active state.

---

### P3: Product Cards - Add to Cart Interaction (Happy Path)
Assumptions: Cart UI exists and "Add to Cart" is available on product cards.

Steps:
1. Navigate to `/products`.
2. Identify a product card and click "Add to Cart".
3. Verify cart indicator (nav/cart icon) shows incremented count or displays a mini cart overlay.
4. Open the cart and verify product appears with correct name, unit price, quantity = 1, and subtotal.

Expected Results:
- Cart count increments and cart contents update accurately.
- No duplicate entries unless user adds multiple times.

Success Criteria: Cart behavior is accurate and UI feedback is immediate.

Failure Conditions: Cart does not update, wrong product added, or pricing mismatches.

---

### P4: Product Card - Out of Stock and Quantity Limits (Negative/Edge)
Assumptions: At least one product can be marked out-of-stock in seed data.

Steps:
1. Ensure a known product is flagged out-of-stock in seed data.
2. Navigate to `/products` and locate the out-of-stock product card.
3. Verify the card shows an "Out of Stock" indicator and the "Add to Cart" button is disabled or hidden.
4. For a product with a stock limit, attempt to add more than max quantity via product detail page or cart UI.

Expected Results:
- Out of stock products cannot be added to cart.
- Attempting to exceed stock limit yields a helpful validation message and prevents the action.

Success Criteria: System prevents adding out-of-stock items and enforces quantity caps.

Failure Conditions: Out-of-stock product added or no validation on quantity limits.

---

### P5: Product Pagination and Infinite Scroll (If applicable)
Assumptions: Products page supports pagination or infinite scroll.

Steps (Pagination):
1. Navigate to `/products` where dataset > page size.
2. Verify pagination controls (Next, Prev, page numbers) are present.
3. Click to go to page 2 and ensure new products load and URL updates with page parameter.

Steps (Infinite Scroll):
1. Navigate to `/products`.
2. Scroll to bottom of list and wait for additional products to load.
3. Verify newly loaded products append to the list.

Expected Results:
- Pagination or infinite scroll loads additional items predictably.

Success Criteria: Additional products load when requested and state reflects the current page.

Failure Conditions: No pagination controls, infinite scroll fails to load.

---

### P6: Products Page Accessibility and Keyboard Navigation
Assumptions: The products grid is keyboard-focusable and product cards have meaningful ARIA attributes.

Steps:
1. Load `/products` in desktop viewport.
2. Tab through product cards focusing buttons and links.
3. Activate a product detail via keyboard (Enter/Space) and verify navigation.
4. Check images have alt text and form controls (filters) have labels.

Expected Results:
- Keyboard navigation focuses interactive elements in logical order.
- Filter controls are labeled for screen readers.

Success Criteria: No critical accessibility failures for core user flows.

Failure Conditions: Unfocusable elements, missing labels, or unusable controls via keyboard.

---

## Test Data and Seeding

- Use `tests/e2e/seed.spec.ts` or a dedicated API seed route to ensure a predictable product set.
- Seed should include: several products across at least 2 categories, one out-of-stock product, at least 12 products for pagination tests, and at least one product with a low stock threshold for quantity tests.

---

## Test Implementation Notes

- Prefer Playwright tests under `tests/e2e` organized as `homepage.spec.ts` and `products.spec.ts`.
- Each scenario should be a separate `test()` so CI can isolate failures.
- Use fixtures to set baseURL and seed state before each test file runs.
- Include screenshot capture only on failure to aid debugging.
- Use `expect.poll()` where data may update asynchronously (e.g., cart count).

---

## Reporting and Acceptance

- Add basic metadata to each test `test.info().annotations` with category tags (smoke, regression, accessibility).
- Run full matrix across Chromium, Firefox, WebKit periodically; run Chromium for fast CI smoke tests.

---

## Next Steps

1. Confirm which flows require authenticated user coverage (e.g., saved carts, wishlist).
2. Create the Playwright test files: `homepage.spec.ts`, `products.spec.ts` under `tests/e2e`.
3. Implement seed fixtures or API hooks to create test data consistently.
4. Run locally and iterate on flaky checks (timings, network stubs).


---

End of Test Plan
