// src/services/reenvioService.js
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const cache = require('../cache');
const db = require('../models');
require('dotenv').config();

const { WebhookReprocessado } = db;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://webhook.site/teste';

const ALLOWED_PRODUCTS = ['boleto','pagamento','pix'];
const ALLOWED_TYPES = ['disponivel','cancelado','pago'];

function validateRequestBody(data) {
  const { product, id, kind, type } = data;
  if (!product || !id || !kind || !type) {
    const err = new Error('Campos obrigatórios: product, id, kind, type.');
    err.status = 422;
    throw err;
  }
  if (!ALLOWED_PRODUCTS.includes(product)) {
    const err = new Error('product inválido. Valores permitidos: boleto, pagamento, pix.');
    err.status = 422;
    throw err;
  }
  if (!Array.isArray(id) || id.some(i => typeof i !== 'string')) {
    const err = new Error('id deve ser um array de strings.');
    err.status = 422;
    throw err;
  }
  if (id.length === 0 || id.length > 30) {
    const err = new Error('O array id deve ter entre 1 e 30 elementos.');
    err.status = 422;
    throw err;
  }
  if (kind !== 'webhook') {
    const err = new Error('kind inválido. No momento apenas "webhook" é aceito.');
    err.status = 422;
    throw err;
  }
  if (!ALLOWED_TYPES.includes(type)) {
    const err = new Error('type inválido. Valores permitidos: disponivel, cancelado, pago.');
    err.status = 422;
    throw err;
  }
}


function getModelForProduct(product) {
  const tryNames = {
    boleto: ['Boleto', 'Boletos', 'boleto', 'boletos'],
    pagamento: ['Pagamento', 'Pagamentos', 'pagamento', 'pagamentos'],
    pix: ['Pix', 'PIX', 'pix'],
  };
  const names = tryNames[product] || [];
  for (const n of names) {
    if (db[n]) return db[n];
  }
  for (const k of Object.keys(db)) {
    if (k.toLowerCase().includes(product)) return db[k];
  }
  return null;
}

function mapTypeToStatus(product, type) {
  const map = {
    disponivel: { boleto: 'REGISTRADO', pagamento: 'SCHEDULED', pix: 'ACTIVE' },
    cancelado: { boleto: 'BAIXADO', pagamento: 'CANCELLED', pix: 'REJECTED' },
    pago: { boleto: 'LIQUIDADO', pagamento: 'PAID', pix: 'LIQUIDATED' },
  };
  return map[type] && map[type][product];
}

async function validateIdsStatus(product, ids, expectedStatus) {
  const Model = getModelForProduct(product);
  if (!Model) {
    console.warn(`[reenvioService] Model para produto "${product}" não encontrado.`);
    return [];
  }

  const records = await Model.findAll({ where: { id: ids }, attributes: ['id', 'status'], raw: true });
  const mapStatus = {};
  for (const r of records) mapStatus[String(r.id)] = r.status;

  const mismatched = [];
  for (const id of ids) {
    const st = mapStatus[String(id)];
    if (!st || String(st).toUpperCase() !== String(expectedStatus).toUpperCase()) {
      mismatched.push({ id, status: st || 'NOT_FOUND' });
    }
  }
  return mismatched;
}

async function createReenvio(data, cedente) {
  const cacheKey =
    'reenviar:' + JSON.stringify({ product: data.product, id: data.id, kind: data.kind, type: data.type, cedente_id: cedente.id });

  const existing = await cache.get(cacheKey);
  if (existing) throw { status: 422, message: 'Requisição já em processamento (cache).' };
  await cache.set(cacheKey, { createdAt: Date.now() }, 3600);

  const expectedStatus = mapTypeToStatus(data.product, data.type);
  const mismatched = await validateIdsStatus(data.product, data.id, expectedStatus);

  if (mismatched.length > 0) {
    await cache.set(cacheKey, null, 1);
    throw {
      status: 422,
      message: `Não foi possível gerar a notificação. A situação do ${data.product} diverge do tipo de notificação solicitado.`,
      mismatched,
    };
  }

  // 🔹 Envio real do webhook para o webhook.site
  const protocolo = uuidv4();
  const payload = {
    protocolo,
    product: data.product,
    type: data.type,
    kind: data.kind,
    ids: data.id,
    dataHora: new Date().toISOString(),
  };

  try {
    await axios.post(WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'DisparadorWH',
      },
      timeout: 5000,
    });
  } catch (err) {
    console.error('Erro ao enviar webhook:', err.message);
    await cache.set(cacheKey, null, 1);
    throw { status: 400, message: 'Não foi possível gerar a notificação. Tente novamente mais tarde.' };
  }

  // Armazena o reenvio após sucesso
  await WebhookReprocessado.create({
    id: protocolo,
    data,
    cedente_id: cedente.id,
    kind: data.kind,
    type: data.type,
    servico_id: JSON.stringify(data.id),
    protocolo,
    data_criacao: new Date(),
  });

  return { protocolo };
}

module.exports = { createReenvio, mapTypeToStatus, validateIdsStatus };
