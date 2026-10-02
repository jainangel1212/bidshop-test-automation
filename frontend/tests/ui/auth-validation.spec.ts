import { test, expect } from '@playwright/test';

test.describe('Bidshop Authentication Validation', () => {

  test('should reject login with invalid credentials', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('nav-login').click();

    await expect(
      page.getByRole('heading', { name: 'Log in to Bidshop' })
    ).toBeVisible();

    await page.getByTestId('login-email').fill('invaliduser@example.com');
    await page.getByTestId('login-password').fill('WrongPassword123');

    await page.getByTestId('login-submit').click();

    await expect(
      page.getByTestId('login-error')
    ).toBeVisible();

    await expect(
      page.getByTestId('nav-login')
    ).toBeVisible();
  });

});