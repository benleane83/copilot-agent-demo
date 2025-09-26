import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import supplierRouter, { resetSuppliers } from './supplier';
import { suppliers as seedSuppliers } from '../seedData';

let app: express.Express;

describe('Supplier API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/suppliers', supplierRouter);
        resetSuppliers();
    });

    it('should create a new supplier', async () => {
        const newSupplier = {
            supplierId: 99,
            name: "Test Supplier Co.",
            description: "A test supplier for unit testing",
            contactPerson: "Test Person",
            email: "test@testsupplier.com",
            phone: "555-0199"
        };
        
        const response = await request(app).post('/suppliers').send(newSupplier);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newSupplier);
    });

    it('should get all suppliers', async () => {
        const response = await request(app).get('/suppliers');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedSuppliers.length);
        response.body.forEach((supplier: any, index: number) => {
            expect(supplier).toMatchObject(seedSuppliers[index]);
        });
    });

    it('should get a supplier by ID', async () => {
        const response = await request(app).get('/suppliers/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedSuppliers[0]);
    });

    it('should update a supplier by ID', async () => {
        const updatedSupplier = {
            ...seedSuppliers[0],
            name: 'Updated Supplier Name',
            description: 'Updated description for testing'
        };
        
        const response = await request(app).put('/suppliers/1').send(updatedSupplier);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Supplier Name');
        expect(response.body.description).toBe('Updated description for testing');
    });

    it('should delete a supplier by ID', async () => {
        const response = await request(app).delete('/suppliers/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing supplier', async () => {
        const response = await request(app).get('/suppliers/999');
        expect(response.status).toBe(404);
    });

    it('should return 404 when updating non-existing supplier', async () => {
        const updatedSupplier = {
            supplierId: 999,
            name: "Non-existent Supplier",
            description: "This supplier does not exist",
            contactPerson: "Ghost Person",
            email: "ghost@nowhere.com",
            phone: "555-0000"
        };
        
        const response = await request(app).put('/suppliers/999').send(updatedSupplier);
        expect(response.status).toBe(404);
    });

    it('should return 404 when deleting non-existing supplier', async () => {
        const response = await request(app).delete('/suppliers/999');
        expect(response.status).toBe(404);
    });

    it('should validate supplier data structure', async () => {
        const response = await request(app).get('/suppliers');
        expect(response.status).toBe(200);
        
        response.body.forEach((supplier: any) => {
            expect(supplier).toHaveProperty('supplierId');
            expect(supplier).toHaveProperty('name');
            expect(supplier).toHaveProperty('description');
            expect(supplier).toHaveProperty('contactPerson');
            expect(supplier).toHaveProperty('email');
            expect(supplier).toHaveProperty('phone');
            expect(typeof supplier.supplierId).toBe('number');
            expect(typeof supplier.name).toBe('string');
            expect(typeof supplier.email).toBe('string');
        });
    });
});