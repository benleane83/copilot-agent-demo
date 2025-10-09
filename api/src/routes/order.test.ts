import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderRouter, { resetOrders } from './order';
import { orders as seedOrders } from '../seedData';

let app: express.Express;

describe('Order API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/orders', orderRouter);
        resetOrders();
    });

    it('should create a new order', async () => {
        const newOrder = {
            orderId: 99,
            branchId: 1,
            orderDate: "2024-01-15",
            status: "pending",
            totalAmount: 999.99,
            notes: "Test order for unit testing"
        };
        
        const response = await request(app).post('/orders').send(newOrder);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newOrder);
    });

    it('should get all orders', async () => {
        const response = await request(app).get('/orders');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedOrders.length);
        response.body.forEach((order: any, index: number) => {
            expect(order).toMatchObject(seedOrders[index]);
        });
    });

    it('should get an order by ID', async () => {
        const response = await request(app).get('/orders/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedOrders[0]);
    });

    it('should update an order by ID', async () => {
        const updatedOrder = {
            ...seedOrders[0],
            status: 'completed',
            totalAmount: 1599.99,
            notes: 'Updated order for testing'
        };
        
        const response = await request(app).put('/orders/1').send(updatedOrder);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('completed');
        expect(response.body.totalAmount).toBe(1599.99);
        expect(response.body.notes).toBe('Updated order for testing');
    });

    it('should delete an order by ID', async () => {
        const response = await request(app).delete('/orders/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing order', async () => {
        const response = await request(app).get('/orders/999');
        expect(response.status).toBe(404);
    });

    it('should return 404 when updating non-existing order', async () => {
        const updatedOrder = {
            orderId: 999,
            branchId: 1,
            orderDate: "2024-01-15",
            status: "pending",
            totalAmount: 999.99,
            notes: "Non-existent order"
        };
        
        const response = await request(app).put('/orders/999').send(updatedOrder);
        expect(response.status).toBe(404);
    });

    it('should return 404 when deleting non-existing order', async () => {
        const response = await request(app).delete('/orders/999');
        expect(response.status).toBe(404);
    });

    it('should validate order data structure', async () => {
        const response = await request(app).get('/orders');
        expect(response.status).toBe(200);
        
        response.body.forEach((order: any) => {
            expect(order).toHaveProperty('orderId');
            expect(order).toHaveProperty('branchId');
            expect(order).toHaveProperty('orderDate');
            expect(order).toHaveProperty('status');
            expect(order).toHaveProperty('totalAmount');
            expect(order).toHaveProperty('notes');
            expect(typeof order.orderId).toBe('number');
            expect(typeof order.branchId).toBe('number');
            expect(typeof order.totalAmount).toBe('number');
            expect(typeof order.status).toBe('string');
        });
    });

    it('should handle different order statuses', async () => {
        const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        for (const status of statuses) {
            const orderWithStatus = {
                ...seedOrders[0],
                status: status
            };
            
            const response = await request(app).put('/orders/1').send(orderWithStatus);
            expect(response.status).toBe(200);
            expect(response.body.status).toBe(status);
        }
    });
});