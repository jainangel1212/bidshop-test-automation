import { test, expect } from '@playwright/test';
import { createUniqueEmail } from '../helpers/test-data';

test.describe('Bidshop Cart Management', () => {

  test('should update product quantity in the cart', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('nav-register').click();

    await page.getByTestId('register-name').fill('Cart Management Customer');
    await page.getByTestId('register-email').fill(createUniqueEmail('cartmanage'));
    await page.getByTestId('register-password').fill('Password123');
    await page.getByTestId('register-submit').click();

    await expect(page.getByTestId('nav-logout')).toBeVisible();

    const productName = page.getByText('NZ Grass-Fed Beef Mince', {
      exact: true
    });

    const productCard = productName.locator('xpath=ancestor::article');

    await productCard
      .getByRole('button', { name: 'Add to cart' })
      .click();

    await expect(page.getByTestId('nav-cart-count')).toHaveText('1');

    await page.getByTestId('nav-cart').click();

    const cartRow = page
      .getByText('NZ Grass-Fed Beef Mince', { exact: true })
      .locator('xpath=ancestor::tr');

    const quantity = cartRow.locator('input[type="number"]');

    await quantity.fill('2');

    await expect(quantity).toHaveValue('2');

    await expect(page.getByTestId('nav-cart-count')).toHaveText('2');
  });

  test('should remove a product from the cart', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('nav-register').click();

    await page.getByTestId('register-name').fill('Cart Remove Customer');
    await page.getByTestId('register-email').fill(createUniqueEmail('cartremove'));
    await page.getByTestId('register-password').fill('Password123');
    await page.getByTestId('register-submit').click();

    await expect(page.getByTestId('nav-logout')).toBeVisible();

    const productName = page.getByText('NZ Grass-Fed Beef Mince', {
      exact: true
    });

    const productCard = productName.locator('xpath=ancestor::article');

    await productCard
      .getByRole('button', { name: 'Add to cart' })
      .click();

    await expect(page.getByTestId('nav-cart-count')).toHaveText('1');

    await page.getByTestId('nav-cart').click();

    const cartRow = page
      .getByText('NZ Grass-Fed Beef Mince', { exact: true })
      .locator('xpath=ancestor::tr');

    await cartRow.getByRole('button', { name: 'Remove' }).click();

    await expect(page.getByTestId('cart-empty')).toBeVisible();

    await expect(page.getByTestId('nav-cart-count')).not.toBeVisible();
  });

  test('should clear all products from the cart', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('nav-register').click();

    await page.getByTestId('register-name').fill('Cart Clear Customer');
    await page.getByTestId('register-email').fill(createUniqueEmail('cartclear'));
    await page.getByTestId('register-password').fill('Password123');
    await page.getByTestId('register-submit').click();

    await expect(page.getByTestId('nav-logout')).toBeVisible();

    const firstProduct = page
      .getByText('NZ Grass-Fed Beef Mince', { exact: true })
      .locator('xpath=ancestor::article');

    await firstProduct
      .getByRole('button', { name: 'Add to cart' })
      .click();

    const secondProduct = page
      .getByText('Free-Range Chicken Breast', { exact: true })
      .locator('xpath=ancestor::article');

    await secondProduct
      .getByRole('button', { name: 'Add to cart' })
      .click();

    await expect(page.getByTestId('nav-cart-count')).toHaveText('2');

    await page.getByTestId('nav-cart').click();

    await page.getByTestId('cart-clear').click();

    await expect(page.getByTestId('cart-empty')).toBeVisible();

    await expect(page.getByTestId('nav-cart-count')).not.toBeVisible();
  });

});