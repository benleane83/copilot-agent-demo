import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import deliveryRouter from './delivery';
import { deliveries as seedDeliveries } from '../seedData';

let app: express.Express;



// Helper to reset the in-memory deliveries array for test isolation
function resetDeliveries() {
  // @ts-ignore
  if (typeof deliveryRouter.__setDeliveries === 'function') {
    // @ts-ignore
    deliveryRouter.__setDeliveries([...seedDeliveries]);
  }
}

// Patch: Add a way to reset the deliveries array for test isolation
// @ts-ignore
if (!deliveryRouter.__setDeliveries) {
  // @ts-ignore
  deliveryRouter.__setDeliveries = (arr) => {
    // @ts-ignore
    const routerModule = require('./delivery');
    routerModule.deliveries = arr;
  };
}

describe('Delivery API', () => {
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/deliveries', deliveryRouter);
    resetDeliveries();
  });

  it('should create a new delivery', async () => {
    const newDelivery = {
      deliveryId: 3,
      supplierId: 1,
      status: 'pending',
      deliveryDate: '2025-10-14',
      orderDetailIds: [1, 2]
    };
    const response = await request(app).post('/deliveries').send(newDelivery);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newDelivery);
  });

  it('should get all deliveries', async () => {
    const response = await request(app).get('/deliveries');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(seedDeliveries.length);
  });

  it('should get a delivery by ID', async () => {
    const response = await request(app).get('/deliveries/1');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(seedDeliveries[0]);
  });

  it('should return 404 for non-existing delivery', async () => {
    const response = await request(app).get('/deliveries/999');
    expect(response.status).toBe(404);
  });

  it('should update a delivery by ID', async () => {
    const updatedDelivery = { ...seedDeliveries[0], status: 'delivered' };
    const response = await request(app).put('/deliveries/1').send(updatedDelivery);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedDelivery);
  });

  it('should return 404 when updating non-existing delivery', async () => {
    const response = await request(app).put('/deliveries/999').send({ status: 'delivered' });
    expect(response.status).toBe(404);
  });

  it('should delete a delivery by ID', async () => {
    const response = await request(app).delete('/deliveries/1');
    expect(response.status).toBe(204);
  });

  it('should return 404 when deleting non-existing delivery', async () => {
    const response = await request(app).delete('/deliveries/999');
    expect(response.status).toBe(404);
  });

  it('should update delivery status and run notifyCommand', async () => {
    const spy = vi.spyOn(require('child_process'), 'exec').mockImplementation((cmd, cb) => {
      if (typeof cb === 'function') {
        cb(null, 'notified!', '');
      }
      return undefined;
    });
    const response = await request(app)
      .put('/deliveries/1/status')
      .send({ status: 'in-transit', notifyCommand: 'echo notified' });
    expect(response.status).toBe(200);
    expect(response.body.delivery.status).toBe('in-transit');
    expect(response.body.commandOutput).toBe('notified!');
    spy.mockRestore();
  });

  it('should handle error in notifyCommand', async () => {
    const spy = vi.spyOn(require('child_process'), 'exec').mockImplementation((cmd, cb) => {
      if (typeof cb === 'function') {
        cb(new Error('fail'), '', 'fail');
      }
      return undefined;
    });
    const response = await request(app)
      .put('/deliveries/1/status')
      .send({ status: 'in-transit', notifyCommand: 'badcmd' });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('fail');
    spy.mockRestore();
  });
});
