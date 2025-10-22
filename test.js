const request = require('supertest');
const express = require('express');
const reenvioRoutes = require('../src/routes/reenvioRoutes');

const app = express();
app.use(express.json());
app.use('/api', reenvioRoutes);

describe('Reenvio endpoints (smoke)', () => {
  test('POST /api/reenviar missing headers -> 401', async () => {
    const res = await request(app)
      .post('/api/reenviar')
      .send({ product: 'boleto', id: ['1'], kind: 'webhook', type: 'disponivel' });
    expect(res.statusCode).toBe(401);
  });
});
