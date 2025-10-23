const request = require('supertest');
const app = require('../src/index'); // exports app
jest.mock('../src/services/reenvioService');

const reenvioService = require('../src/services/reenvioService');

describe('POST /reenviar', () => {
  afterEach(() => jest.resetAllMocks());

  test('should return 201 and protocolo when payload is valid', async () => {
    reenvioService.createReenvio.mockResolvedValue({ protocolo: 'uuid-test-123' });

    const payload = {
      product: 'boleto',
      id: ['id1','id2'],
      kind: 'webhook',
      type: 'disponivel'
    };

    const res = await request(app)
      .post('/reenviar')
      .set('cnpj-sh', '123123123000123')
      .set('token-sh', 'token')
      .set('cnpj-cedente', '129129129000199')
      .set('token-cedente', 'token-cedente')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('protocolo', 'uuid-test-123');
  });

  test('should return 422 when payload invalid', async () => {
    reenvioService.createReenvio.mockImplementation(() => {
      const e = new Error('id deve ser um array de strings.');
      e.status = 422;
      throw e;
    });

    const payload = { product: 'boleto', id: 'not-array', kind: 'webhook', type: 'disponivel' };

    const res = await request(app)
      .post('/reenviar')
      .set('cnpj-sh', '123123123000123')
      .set('token-sh', 'token')
      .set('cnpj-cedente', '129129129000199')
      .set('token-cedente', 'token-cedente')
      .send(payload);

    expect(res.status).toBe(422);
  });
});
