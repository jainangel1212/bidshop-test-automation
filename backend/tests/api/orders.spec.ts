import { test, expect } from '@playwright/test';
import { registerAndGetToken } from '../helpers/test-data';

test.describe('Orders API', () => {

  const customerDetails = {
    customer: {
      name: 'Test Customer',
      email: 'customer@example.com',
      address: '123 Test Street',
      city: 'Auckland',
      postcode: '1010'
    }
  };

  test('should create an order from items in the cart', async ({ request }) => {
    const token = await registerAndGetToken(request, 'Order Test Customer');

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

    const orderResponse = await request.post('/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: customerDetails
    });

    expect(orderResponse.status()).toBe(201);

    const order = await orderResponse.json();

    expect(order.id).toBeTruthy();
    expect(order.items).toHaveLength(1);
    expect(order.items[0].productId).toBe(product.id);
    expect(order.items[0].quantity).toBe(2);
    expect(order.status).toBe('CONFIRMED');

    const expectedLineTotal = Number((product.price * 2).toFixed(2));
    const expectedSubtotal = expectedLineTotal;
    const expectedGst = Number((expectedSubtotal * 0.15).toFixed(2));
    const expectedTotal = Number((expectedSubtotal + expectedGst).toFixed(2));

    expect(order.items[0].unitPrice).toBe(product.price);
    expect(order.items[0].lineTotal).toBe(expectedLineTotal);
    expect(order.subtotal).toBe(expectedSubtotal);
    expect(order.gst).toBe(expectedGst);
    expect(order.total).toBe(expectedTotal);

    expect(order.customer).toEqual(customerDetails.customer);

    const cartResponse = await request.get('/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(cartResponse.status()).toBe(200);

    const cart = await cartResponse.json();

    expect(cart.items).toHaveLength(0);
  });

  test('should return the authenticated customers orders', async ({ request }) => {
    const token = await registerAndGetToken(request, 'Order Test Customer');

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
        quantity: 1
      }
    });

    expect(addResponse.status()).toBe(201);

    const createOrderResponse = await request.post('/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: customerDetails
    });

    expect(createOrderResponse.status()).toBe(201);

    const response = await request.get('/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status()).toBe(200);

    const orders = await response.json();

    expect(orders.count).toBeGreaterThan(0);
    expect(orders.items.length).toBeGreaterThan(0);
  });

  test('should reject creating an order with an empty cart', async ({ request }) => {
    const token = await registerAndGetToken(request, 'Order Test Customer');

    const response = await request.post('/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: customerDetails
    });

    expect(response.status()).toBe(400);
  });

  test('should reject access to orders without authentication', async ({ request }) => {
    const response = await request.get('/orders');

    expect(response.status()).toBe(401);
  });

});