import { test, expect } from '@playwright/test';
import { createUniqueEmail } from '../helpers/test-data';

test.describe('Authentication API', () => {

  test('should register a new customer successfully', async ({ request }) => {
    const email = createUniqueEmail();

    const response = await request.post('/auth/register', {
      data: {
        email,
        password: 'Password123',
        name: 'Test Customer'
      }
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body.token).toBeTruthy();
    expect(body.user.email).toBe(email);
    expect(body.user.name).toBe('Test Customer');
  });

  test('should login with valid credentials', async ({ request }) => {
    const email = createUniqueEmail();
    const password = 'Password123';

    await request.post('/auth/register', {
      data: {
        email,
        password,
        name: 'Test Customer'
      }
    });

    const response = await request.post('/auth/login', {
      data: {
        email,
        password
      }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.token).toBeTruthy();
    expect(body.user.email).toBe(email);
  });

  test('should reject registration with an existing email', async ({ request }) => {
    const email = createUniqueEmail();

    const customer = {
      email,
      password: 'Password123',
      name: 'Test Customer'
    };

    const firstResponse = await request.post('/auth/register', {
      data: customer
    });

    expect(firstResponse.status()).toBe(201);

    const duplicateResponse = await request.post('/auth/register', {
      data: customer
    });

    expect(duplicateResponse.status()).toBe(409);
  });

  test('should reject registration with an invalid email', async ({ request }) => {
    const response = await request.post('/auth/register', {
      data: {
        email: 'invalid-email',
        password: 'Password123',
        name: 'Test Customer'
      }
    });

    expect(response.status()).toBe(400);
  });

  test('should reject registration when password is shorter than 6 characters', async ({ request }) => {
    const response = await request.post('/auth/register', {
      data: {
        email: createUniqueEmail(),
        password: '12345',
        name: 'Test Customer'
      }
    });

    expect(response.status()).toBe(400);
  });

  test('should reject login with incorrect credentials', async ({ request }) => {
    const email = createUniqueEmail();

    await request.post('/auth/register', {
      data: {
        email,
        password: 'Password123',
        name: 'Test Customer'
      }
    });

    const response = await request.post('/auth/login', {
      data: {
        email,
        password: 'WrongPassword'
      }
    });

    expect(response.status()).toBe(401);
  });

});