import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import productRouter from './product';
import { products as seedProducts } from '../seedData';

let app: express.Express;

describe('Product API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/products', productRouter);
        // Reset products array to seed data for each test
        const productModule = require('./product');
        if (productModule.resetProducts) {
            productModule.resetProducts();
        }
    });

    it('should create a new product', async () => {
        const newProduct = {
            productId: 99,
            supplierId: 1,
            name: "Test Product",
            description: "A test product for unit testing",
            price: 199.99,
            sku: "TEST-001",
            unit: "piece",
            imgName: "test.png"
        };
        
        const response = await request(app).post('/products').send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newProduct);
    });

    it('should get all products', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('productId');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('description');
        expect(response.body[0]).toHaveProperty('price');
    });

    it('should get a product by ID', async () => {
        const response = await request(app).get('/products/1');
        expect(response.status).toBe(200);
        expect(response.body.productId).toBe(1);
        expect(response.body.name).toBe(seedProducts[0].name);
    });

    it('should update a product by ID', async () => {
        const updatedProduct = {
            ...seedProducts[0],
            name: 'Updated Product Name',
            price: 999.99
        };
        
        const response = await request(app).put('/products/1').send(updatedProduct);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Product Name');
        expect(response.body.price).toBe(999.99);
    });

    it('should delete a product by ID', async () => {
        const response = await request(app).delete('/products/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing product', async () => {
        const response = await request(app).get('/products/999');
        expect(response.status).toBe(404);
    });

    it('should return 404 when updating non-existing product', async () => {
        const updatedProduct = {
            productId: 999,
            supplierId: 1,
            name: "Non-existent Product",
            description: "This product does not exist",
            price: 99.99,
            sku: "NEX-001",
            unit: "piece",
            imgName: "nonexistent.png"
        };
        
        const response = await request(app).put('/products/999').send(updatedProduct);
        expect(response.status).toBe(404);
    });

    it('should return 404 when deleting non-existing product', async () => {
        const response = await request(app).delete('/products/999');
        expect(response.status).toBe(404);
    });

    it('should validate product data structure', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        
        response.body.forEach((product: any) => {
            expect(product).toHaveProperty('productId');
            expect(product).toHaveProperty('supplierId');
            expect(product).toHaveProperty('name');
            expect(product).toHaveProperty('description');
            expect(product).toHaveProperty('price');
            expect(product).toHaveProperty('sku');
            expect(product).toHaveProperty('unit');
            expect(product).toHaveProperty('imgName');
            expect(typeof product.productId).toBe('number');
            expect(typeof product.price).toBe('number');
        });
    });
});