import { test, expect } from '@playwright/test';
import { createUniqueEmail } from '../helpers/test-data';

test.describe('Bidshop Checkout', () => {

  test('should place an order successfully', async ({ page }) => {
    await page.goto('/');

    // Register a new customer
    await page.getByTestId('nav-register').click();

    await page.getByTestId('register-name').fill('Checkout Test Customer');
    await page.getByTestId('register-email').fill(createUniqueEmail('checkout'));
    await page.getByTestId('register-password').fill('Password123');
    await page.getByTestId('register-submit').click();

    await expect(page.getByTestId('nav-logout')).toBeVisible();

    // Add a product to the cart
    const productCard = page.getByTestId('product-card-p-001');

    await productCard
      .getByRole('button', { name: 'Add to cart' })
      .click();

    await expect(page.getByTestId('nav-cart-count')).toHaveText('1');

    // Open cart
    await page.getByTestId('nav-cart').click();

    await expect(page.getByTestId('cart-table')).toBeVisible();

    await expect(
      page.getByTestId('cart-name-p-001')
    ).toHaveText('NZ Grass-Fed Beef Mince');

    // Continue to checkout
    await page.getByTestId('cart-checkout').click();

    await expect(
      page.getByRole('heading', { name: 'Checkout' })
    ).toBeVisible();

    await expect(page.getByTestId('checkout-form')).toBeVisible();

    // Verify checkout summary
    await expect(
      page.getByTestId('checkout-line-p-001')
    ).toContainText('NZ Grass-Fed Beef Mince');

    await expect(page.getByTestId('checkout-subtotal')).toBeVisible();
    await expect(page.getByTestId('checkout-gst')).toBeVisible();
    await expect(page.getByTestId('checkout-total')).toBeVisible();

    // Enter delivery details
    await page.getByTestId('checkout-address').fill('123 Queen Street');
    await page.getByTestId('checkout-city').fill('Auckland');
    await page.getByTestId('checkout-postcode').fill('1010');

    // Place order
    await page.getByTestId('checkout-submit').click();

    // Verify order confirmation
    await expect(
      page.getByRole('heading', { name: 'Order confirmed' })
    ).toBeVisible();

    await expect(
      page.getByTestId('order-confirmation')
    ).toContainText('Checkout Test Customer');

    await expect(
      page.getByTestId('order-id')
    ).toBeVisible();

    await expect(
      page.getByTestId('order-total')
    ).toBeVisible();
  });

});