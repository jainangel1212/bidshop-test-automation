import { test, expect } from '@playwright/test';
import { createUniqueEmail } from '../helpers/test-data';

test.describe('Bidshop Cart', () => {

  test('should add a product to the cart', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('nav-register').click();

    await page.getByTestId('register-name').fill('Cart Test Customer');
    await page.getByTestId('register-email').fill(createUniqueEmail('cartui'));
    await page.getByTestId('register-password').fill('Password123');
    await page.getByTestId('register-submit').click();

    await expect(page.getByTestId('nav-logout')).toBeVisible();

    const productName = page.getByText('NZ Grass-Fed Beef Mince', {
      exact: true
    });

    await expect(productName).toBeVisible();

    const productCard = productName.locator('xpath=ancestor::article');

    await productCard
      .getByRole('button', { name: 'Add to cart' })
      .click();

    await expect(
      productCard.getByText('Added to cart')
    ).toBeVisible();

    await expect(
      page.getByTestId('nav-cart-count')
    ).toHaveText('1');

    await page.getByTestId('nav-cart').click();

    await expect(
      page.getByText('NZ Grass-Fed Beef Mince', { exact: true })
    ).toBeVisible();
  });

});