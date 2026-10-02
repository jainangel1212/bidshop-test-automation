import { test, expect } from '@playwright/test';

test.describe('Products API', () => {

  test('should return the product catalogue', async ({ request }) => {
    const response = await request.get('/products');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.count).toBe(18);
    expect(body.items).toHaveLength(18);

    const product = body.items[0];

    expect(product.id).toBeTruthy();
    expect(product.name).toBeTruthy();
    expect(product.category).toBeTruthy();
    expect(typeof product.price).toBe('number');
    expect(typeof product.stock).toBe('number');
  });

});