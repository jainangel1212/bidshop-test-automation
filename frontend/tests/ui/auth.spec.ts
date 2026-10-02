import { test, expect } from '@playwright/test';
import { createUniqueEmail } from '../helpers/test-data';

test.describe('Bidshop Authentication', () => {

  test('should register a new customer', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Register' }).click();

    await expect(
      page.getByRole('heading', { name: 'Create a Bidshop account' })
    ).toBeVisible();

    const email = createUniqueEmail();

    await page.getByTestId('register-name').fill('UI Test Customer');
    await page.getByTestId('register-email').fill(email);
    await page.getByTestId('register-password').fill('Password123');

    await page.getByTestId('register-submit').click();

    await expect(
      page.getByTestId('nav-logout')
    ).toBeVisible();
  });

  test('should login successfully and navigate to the shop', async ({ page }) => {
    await page.goto('/');

    const email = createUniqueEmail('uilogin');
    const password = 'Password123';

    // Register customer first
    await page.getByRole('link', { name: 'Register' }).click();

    await page.getByTestId('register-name').fill('UI Login Customer');
    await page.getByTestId('register-email').fill(email);
    await page.getByTestId('register-password').fill(password);
    await page.getByTestId('register-submit').click();

    await expect(page.getByTestId('nav-logout')).toBeVisible();

    // Log out
    await page.getByTestId('nav-logout').click();

    await expect(page.getByTestId('nav-login')).toBeVisible();

    // Log in again
    await page.getByTestId('nav-login').click();

    await page.getByTestId('login-email').fill(email);
    await page.getByTestId('login-password').fill(password);
    await page.getByTestId('login-submit').click();

    // Verify successful login and return to shop
    await expect(page).toHaveURL('/');

    await expect(
      page.getByRole('heading', {
        name: 'Fresh food, delivered to your kitchen.'
      })
    ).toBeVisible();

    await expect(
      page.getByTestId('nav-user-name')
    ).toContainText('UI');

    await expect(
      page.getByTestId('nav-logout')
    ).toBeVisible();
  });

});