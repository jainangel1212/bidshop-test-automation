import { test, expect } from '@playwright/test';

test.describe('Bidshop Shop', () => {

  test('should display the product catalogue', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        name: 'Fresh food, delivered to your kitchen.'
      })
    ).toBeVisible();

    await expect(page.getByTestId('filter-summary')).toHaveText('18 products');

    await expect(
      page.getByTestId('product-name-p-001')
    ).toHaveText('NZ Grass-Fed Beef Mince');
  });

  test('should search for a product', async ({ page }) => {
    await page.goto('/');

    const searchBox = page.getByTestId('filter-search');

    await searchBox.fill('Salmon');

    await expect(page.getByTestId('filter-summary')).toHaveText('1 product');

    await expect(
      page.getByTestId('product-name-p-004')
    ).toHaveText('Wild NZ King Salmon Fillet');

    await expect(
      page.getByTestId('product-name-p-001')
    ).not.toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('filter-category').selectOption('Dairy');

    await expect(page.getByTestId('filter-summary')).toHaveText('3 products');

    await expect(
      page.getByTestId('product-name-p-008')
    ).toHaveText('Anchor Full Cream Milk');

    await expect(
      page.getByTestId('product-name-p-009')
    ).toHaveText('Mainland Tasty Cheese Block');

    await expect(
      page.getByTestId('product-name-p-010')
    ).toHaveText('Puhoi Valley Greek Yoghurt');

    await expect(
      page.getByTestId('product-name-p-001')
    ).not.toBeVisible();
  });

  test('should navigate to login when a logged-out customer chooses to buy', async ({ page }) => {
    await page.goto('/');

    await page
      .getByTestId('product-login-p-001')
      .click();

    await expect(page).toHaveURL(/\/login$/);

    await expect(
      page.getByRole('heading', { name: 'Log in to Bidshop' })
    ).toBeVisible();
  });

});