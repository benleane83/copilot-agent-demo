import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import cartRoutes from './cart';

const app = express();
app.use(express.json());
app.use('/api/cart', cartRoutes);

describe('Cart Routes', () => {
  beforeEach(async () => {
    // Clear cart before each test by making a DELETE request for all items
    const getResponse = await request(app).get('/api/cart');
    const cart = getResponse.body;
    
    for (const item of cart.items) {
      await request(app).delete(`/api/cart/items/${item.productId}`);
    }
  });

  describe('GET /api/cart', () => {
    it('should return empty cart initially', async () => {
      const response = await request(app).get('/api/cart');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        items: [],
        subtotal: 0,
        total: 0,
        itemCount: 0
      });
    });
  });

  describe('POST /api/cart/items', () => {
    it('should add a new item to cart', async () => {
      const newItem = {
        productId: 1,
        quantity: 2
      };

      const response = await request(app)
        .post('/api/cart/items')
        .send(newItem);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].productId).toBe(1);
      expect(response.body.items[0].quantity).toBe(2);
      expect(response.body.itemCount).toBe(2);
    });

    it('should update quantity if item already exists in cart', async () => {
      const newItem = {
        productId: 1,
        quantity: 2
      };

      // Add item first time
      await request(app)
        .post('/api/cart/items')
        .send(newItem);

      // Add same item again
      const response = await request(app)
        .post('/api/cart/items')
        .send(newItem);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].quantity).toBe(4); // 2 + 2
      expect(response.body.itemCount).toBe(4);
    });

    it('should return 404 for non-existent product', async () => {
      const newItem = {
        productId: 99999,
        quantity: 1
      };

      const response = await request(app)
        .post('/api/cart/items')
        .send(newItem);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Product not found');
    });

    it('should return 400 for invalid quantity', async () => {
      const newItem = {
        productId: 1,
        quantity: 0
      };

      const response = await request(app)
        .post('/api/cart/items')
        .send(newItem);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Valid productId and quantity are required');
    });
  });

  describe('PUT /api/cart/items/:productId', () => {
    beforeEach(async () => {
      // Add an item to cart for testing updates
      await request(app)
        .post('/api/cart/items')
        .send({ productId: 1, quantity: 2 });
    });

    it('should update item quantity', async () => {
      const response = await request(app)
        .put('/api/cart/items/1')
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body.items[0].quantity).toBe(5);
      expect(response.body.itemCount).toBe(5);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .put('/api/cart/items/999')
        .send({ quantity: 5 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found in cart');
    });

    it('should return 400 for invalid quantity', async () => {
      const response = await request(app)
        .put('/api/cart/items/1')
        .send({ quantity: 0 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Valid quantity is required');
    });
  });

  describe('DELETE /api/cart/items/:productId', () => {
    beforeEach(async () => {
      // Add an item to cart for testing deletion
      await request(app)
        .post('/api/cart/items')
        .send({ productId: 1, quantity: 2 });
    });

    it('should remove item from cart', async () => {
      const response = await request(app)
        .delete('/api/cart/items/1');

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(0);
      expect(response.body.itemCount).toBe(0);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .delete('/api/cart/items/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found in cart');
    });
  });

  describe('POST /api/cart/checkout', () => {
    it('should create order from cart with items', async () => {
      // Add an item to cart first
      await request(app)
        .post('/api/cart/items')
        .send({ productId: 1, quantity: 2 });

      const response = await request(app)
        .post('/api/cart/checkout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('orderId');
      expect(response.body.message).toBe('Order created successfully');

      // Verify cart is cleared after checkout
      const cartResponse = await request(app).get('/api/cart');
      expect(cartResponse.body.items).toHaveLength(0);
    });

    it('should return 400 for empty cart', async () => {
      const response = await request(app)
        .post('/api/cart/checkout');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Cart is empty');
    });
  });
});