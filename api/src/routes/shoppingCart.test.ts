import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import shoppingCartRouter, { resetCarts } from './shoppingCart';

let app: express.Express;

describe('Shopping Cart API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/cart', shoppingCartRouter);
        resetCarts();
    });

    it('should get an empty cart for new cartId', async () => {
        const response = await request(app).get('/cart/test-cart-1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            cartId: 'test-cart-1',
            items: [],
            totalAmount: 0
        });
    });

    it('should add a product to the cart', async () => {
        const response = await request(app)
            .post('/cart/test-cart-1/items')
            .send({ productId: 1, quantity: 2 });
        
        expect(response.status).toBe(200);
        expect(response.body.cartId).toBe('test-cart-1');
        expect(response.body.items.length).toBe(1);
        expect(response.body.items[0].productId).toBe(1);
        expect(response.body.items[0].quantity).toBe(2);
        expect(response.body.totalAmount).toBeGreaterThan(0);
    });

    it('should update quantity when adding same product again', async () => {
        // Add product first time
        await request(app)
            .post('/cart/test-cart-1/items')
            .send({ productId: 1, quantity: 2 });
        
        // Add same product again
        const response = await request(app)
            .post('/cart/test-cart-1/items')
            .send({ productId: 1, quantity: 3 });
        
        expect(response.status).toBe(200);
        expect(response.body.items.length).toBe(1);
        expect(response.body.items[0].quantity).toBe(5);
    });

    it('should update product quantity in cart', async () => {
        // Add product
        await request(app)
            .post('/cart/test-cart-1/items')
            .send({ productId: 1, quantity: 2 });
        
        // Update quantity
        const response = await request(app)
            .put('/cart/test-cart-1/items/1')
            .send({ quantity: 5 });
        
        expect(response.status).toBe(200);
        expect(response.body.items[0].quantity).toBe(5);
    });

    it('should remove product when quantity is set to 0', async () => {
        // Add product
        await request(app)
            .post('/cart/test-cart-1/items')
            .send({ productId: 1, quantity: 2 });
        
        // Set quantity to 0
        const response = await request(app)
            .put('/cart/test-cart-1/items/1')
            .send({ quantity: 0 });
        
        expect(response.status).toBe(200);
        expect(response.body.items.length).toBe(0);
        expect(response.body.totalAmount).toBe(0);
    });

    it('should remove a product from the cart', async () => {
        // Add product
        await request(app)
            .post('/cart/test-cart-1/items')
            .send({ productId: 1, quantity: 2 });
        
        // Remove product
        const response = await request(app)
            .delete('/cart/test-cart-1/items/1');
        
        expect(response.status).toBe(200);
        expect(response.body.items.length).toBe(0);
        expect(response.body.totalAmount).toBe(0);
    });

    it('should return 404 when removing non-existent product', async () => {
        const response = await request(app)
            .delete('/cart/test-cart-1/items/999');
        
        expect(response.status).toBe(404);
    });

    it('should empty the cart', async () => {
        // Add products
        await request(app)
            .post('/cart/test-cart-1/items')
            .send({ productId: 1, quantity: 2 });
        await request(app)
            .post('/cart/test-cart-1/items')
            .send({ productId: 2, quantity: 3 });
        
        // Empty cart
        const response = await request(app)
            .delete('/cart/test-cart-1');
        
        expect(response.status).toBe(200);
        expect(response.body.items.length).toBe(0);
        expect(response.body.totalAmount).toBe(0);
    });

    it('should calculate total amount correctly', async () => {
        // Add multiple products
        await request(app)
            .post('/cart/test-cart-1/items')
            .send({ productId: 1, quantity: 2 });
        const response = await request(app)
            .post('/cart/test-cart-1/items')
            .send({ productId: 2, quantity: 1 });
        
        expect(response.status).toBe(200);
        expect(response.body.items.length).toBe(2);
        expect(response.body.totalAmount).toBeGreaterThan(0);
    });

    it('should return 404 when adding non-existent product', async () => {
        const response = await request(app)
            .post('/cart/test-cart-1/items')
            .send({ productId: 99999, quantity: 1 });
        
        expect(response.status).toBe(404);
    });
});
