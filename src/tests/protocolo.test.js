const request = require('supertest');
const app = require('../src/index');
jest.mock('../src/services/protocoloService');
const ps = require('../src/services/protocoloService');


describe('GET /protocolo', () => {
  afterEach(() => jest.resetAllMocks());

  test('should return 200 and results when filters valid', async () => {
    ps.listProtocolos.mockResolvedValue([{ protocolo: 'p1' }]);

    const res = await request(app)
      .get('/protocolo?start_date=2025-10-01&end_date=2025-10-15')
      .set('cnpj-sh', '123123123000123')
      .set('token-sh', 'token')
      .set('cnpj-cedente', '129129129000199')
      .set('token-cedente', 'token-cedente');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('should return 422 when dates missing', async () => {
    const res = await request(app)
      .get('/protocolo')
      .set('cnpj-sh', '123123123000123')
      .set('token-sh', 'token')
      .set('cnpj-cedente', '129129129000199')
      .set('token-cedente', 'token-cedente');

    expect(res.status).toBe(422);
  });
});
