import { test, expect } from '@playwright/test';
import { registerAndGetToken } from '../helpers/test-data';

test.describe('Cart API', () => {

  test('should add a product to the cart and retrieve it', async ({ request }) => {
    const token = await registerAndGetToken(request, 'Cart Test Customer');

    const productsResponse = await request.get('/products');
    expect(productsResponse.status()).toBe(200);

    const productsBody = await productsResponse.json();
    const product = productsBody.items[0];

    const addResponse = await request.post('/cart/items', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        productId: product.id,
        quantity: 2
      }
    });

    expect(addResponse.status()).toBe(201);

    const cartResponse = await request.get('/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(cartResponse.status()).toBe(200);

    const cart = await cartResponse.json();

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].productId).toBe(product.id);
    expect(cart.items[0].quantity).toBe(2);

    const expectedLineTotal = Number((product.price * 2).toFixed(2));

    expect(cart.items[0].unitPrice).toBe(product.price);
    expect(cart.items[0].lineTotal).toBe(expectedLineTotal);
    expect(cart.subtotal).toBe(expectedLineTotal);

    expect(cart.total).toBe(
      Number((cart.subtotal + cart.gst).toFixed(2))
    );
  });

  test('should update the quantity of an item in the cart', async ({ request }) => {
    const token = await registerAndGetToken(request, 'Cart Test Customer');

    const productsResponse = await request.get('/products');
    const productsBody = await productsResponse.json();
    const product = productsBody.items[0];

    await request.post('/cart/items', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        productId: product.id,
        quantity: 1
      }
    });

    const updateResponse = await request.patch(`/cart/items/${product.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        quantity: 3
      }
    });

    expect(updateResponse.status()).toBe(200);

    const cartResponse = await request.get('/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const cart = await cartResponse.json();

    expect(cart.items[0].quantity).toBe(3);
  });

  test('should remove an item from the cart', async ({ request }) => {
    const token = await registerAndGetToken(request, 'Cart Test Customer');

    const productsResponse = await request.get('/products');
    const productsBody = await productsResponse.json();
    const product = productsBody.items[0];

    await request.post('/cart/items', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        productId: product.id,
        quantity: 1
      }
    });

    const deleteResponse = await request.delete(`/cart/items/${product.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(deleteResponse.status()).toBe(200);

    const cartResponse = await request.get('/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const cart = await cartResponse.json();

    expect(cart.items).toHaveLength(0);
  });

  test('should reject access to the cart without authentication', async ({ request }) => {
    const response = await request.get('/cart');

    expect(response.status()).toBe(401);
  });

});