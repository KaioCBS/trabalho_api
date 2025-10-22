// src/services/protocoloService.js
const cache = require('../cache');
const db = require('../models');
const { Op } = require('sequelize');

const WebhookProcessado = db.WebhookProcessado;

async function listProtocolos(filters) {
  const { start_date, end_date, product, id: ids, kind, type } = filters;
  const cacheKey = 'protocolo:list:' + JSON.stringify(filters);
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const where = {};
  where.data_criacao = { [Op.between]: [new Date(start_date), new Date(end_date + 'T23:59:59.999Z')] };
  if (kind) where.kind = kind;
  if (type) where.type = type;

  const rows = await WebhookProcessado.findAll({ where, order: [['data_criacao','DESC']], raw: true });

  const result = rows.filter(r => {
    if (product) {
      try {
        const d = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
        if (!d || d.product !== product) return false;
      } catch (e) { return false; }
    }
    if (ids && Array.isArray(ids) && ids.length) {
      try {
        const serv = typeof r.servico_id === 'string' ? JSON.parse(r.servico_id) : r.servico_id;
        if (!serv) return false;
        const any = ids.some(i => serv.includes(i));
        if (!any) return false;
      } catch (e) { return false; }
    }
    return true;
  });

  await cache.set(cacheKey, result, 86400);
  return result;
}

async function getProtocoloByUuid(uuid) {
  const cacheKey = 'protocolo:' + uuid;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;
  const row = await WebhookProcessado.findOne({ where: { id: uuid }, raw: true });
  if (!row) return null;

  let notifStatus = null;
  try {
    if (row.data) {
      const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      notifStatus = d && d.status;
    }
  } catch (e) { }

  if (!notifStatus && row.status) notifStatus = row.status;
  if (String(notifStatus).toLowerCase() === 'sent') {
    await cache.set(cacheKey, row, 3600);
  }
  return row;
}

module.exports = { listProtocolos, getProtocoloByUuid };
