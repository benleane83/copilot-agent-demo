import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import headquartersRouter, { resetHeadquarters } from './headquarters';
import { headquarters as seedHeadquarters } from '../seedData';

let app: express.Express;

describe('Headquarters API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/headquarters', headquartersRouter);
        resetHeadquarters();
    });

    it('should create a new headquarters', async () => {
        const newHeadquarters = {
            headquartersId: 99,
            name: "Test Headquarters",
            description: "A test headquarters for unit testing",
            address: "123 Test Street, Test City",
            contactPerson: "Test Manager",
            email: "test@testhq.com",
            phone: "555-0199"
        };
        
        const response = await request(app).post('/headquarters').send(newHeadquarters);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newHeadquarters);
    });

    it('should get all headquarters', async () => {
        const response = await request(app).get('/headquarters');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedHeadquarters.length);
        response.body.forEach((hq: any, index: number) => {
            expect(hq).toMatchObject(seedHeadquarters[index]);
        });
    });

    it('should get a headquarters by ID', async () => {
        const response = await request(app).get('/headquarters/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedHeadquarters[0]);
    });

    it('should update a headquarters by ID', async () => {
        const updatedHeadquarters = {
            ...seedHeadquarters[0],
            name: 'Updated Headquarters Name',
            description: 'Updated description for testing'
        };
        
        const response = await request(app).put('/headquarters/1').send(updatedHeadquarters);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Headquarters Name');
        expect(response.body.description).toBe('Updated description for testing');
    });

    it('should delete a headquarters by ID', async () => {
        const response = await request(app).delete('/headquarters/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing headquarters', async () => {
        const response = await request(app).get('/headquarters/999');
        expect(response.status).toBe(404);
    });

    it('should return 404 when updating non-existing headquarters', async () => {
        const updatedHeadquarters = {
            headquartersId: 999,
            name: "Non-existent HQ",
            description: "This headquarters does not exist",
            address: "999 Nowhere Street",
            contactPerson: "Ghost Manager",
            email: "ghost@nowhere.com",
            phone: "555-0000"
        };
        
        const response = await request(app).put('/headquarters/999').send(updatedHeadquarters);
        expect(response.status).toBe(404);
    });

    it('should return 404 when deleting non-existing headquarters', async () => {
        const response = await request(app).delete('/headquarters/999');
        expect(response.status).toBe(404);
    });

    it('should validate headquarters data structure', async () => {
        const response = await request(app).get('/headquarters');
        expect(response.status).toBe(200);
        
        response.body.forEach((hq: any) => {
            expect(hq).toHaveProperty('headquartersId');
            expect(hq).toHaveProperty('name');
            expect(hq).toHaveProperty('description');
            expect(hq).toHaveProperty('address');
            expect(hq).toHaveProperty('contactPerson');
            expect(hq).toHaveProperty('email');
            expect(hq).toHaveProperty('phone');
            expect(typeof hq.headquartersId).toBe('number');
            expect(typeof hq.name).toBe('string');
            expect(typeof hq.email).toBe('string');
        });
    });
});