import { expect, APIRequestContext } from '@playwright/test';

export const createUniqueEmail = (prefix = 'testuser') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}@example.com`;

export async function registerAndGetToken(
  request: APIRequestContext,
  name = 'Test Customer'
) {
  const response = await request.post('/auth/register', {
    data: {
      email: createUniqueEmail(),
      password: 'Password123',
      name
    }
  });

  expect(response.status()).toBe(201);

  const body = await response.json();

  return body.token;
}