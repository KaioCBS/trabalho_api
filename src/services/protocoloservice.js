// src/services/protocoloService.js
const cache = require('../cache');
const db = require('../models');
const { Op } = require('sequelize');
const WebhookReprocessado = db.WebhookReprocessado;

/**
 * Lista protocolos conforme filtros.
 * Filtros obrigatórios: start_date (YYYY-MM-DD) e end_date (YYYY-MM-DD).
 * Opcional: product, id (array), kind, type.
 *
 * Retorna array de registros.
 */
async function listProtocolos(filters) {
  const { start_date, end_date, product, id: ids, kind, type } = filters;

  const keyFilters = { start_date, end_date, product, ids, kind, type };
  const cacheKey = 'protocolo:list:' + JSON.stringify(keyFilters);

  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const where = {};
  // date range on data_criacao
  where.data_criacao = { [Op.between]: [new Date(start_date), new Date(end_date + 'T23:59:59.999Z')] };

  if (product) where['data'] = { [Op.ne]: null }; // keep broad; we'll filter by product later if stored inside data
  if (kind) where.kind = kind;
  if (type) where.type = type;

  // fetch candidates
  const rows = await WebhookReprocessado.findAll({ where, order: [['data_criacao', 'DESC']] , raw: true });

  // In-memory filtering for product and ids (servico_id stored as JSON-string)
  const result = rows.filter(r => {
    // check product if present: try to inspect r.data.product or r.data.product
    if (product) {
      try {
        const d = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
        if (!d || d.product !== product) return false;
      } catch (e) {
        return false;
      }
    }
    if (ids && Array.isArray(ids) && ids.length > 0) {
      try {
        const serv = typeof r.servico_id === 'string' ? JSON.parse(r.servico_id) : r.servico_id;
        // require that at least one of filter ids exist in serv array
        const any = ids.some(i => serv && serv.includes(i));
        if (!any) return false;
      } catch (e) {
        return false;
      }
    }
    return true;
  });

  // cache result for 1 day (86400s)
  await cache.set(cacheKey, result, 86400);
  return result;
}

/**
 * Busca protocolo por uuid.
 * Se encontrado e status === 'sent' (string), armazena cache por 1 hora.
 */
async function getProtocoloByUuid(uuid) {
  const cacheKey = 'protocolo:' + uuid;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const row = await WebhookReprocessado.findOne({ where: { id: uuid }, raw: true });
  if (!row) return null;

  // determine notification status returned in the response. The PDF espera que a resposta individual
  // contenha um campo 'status' com valor 'sent' para ser cacheável.
  // Aqui tentamos extrair status do row.data.status ou row.status.
  let notifStatus = null;
  try {
    if (row.data) {
      const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      notifStatus = d && d.status;
    }
  } catch (e) {
    // ignore
  }
  if (!notifStatus && row.status) notifStatus = row.status;

  if (String(notifStatus).toLowerCase() === 'sent') {
    await cache.set(cacheKey, row, 3600); // 1 hora
  }

  return row;
}

module.exports = { listProtocolos, getProtocoloByUuid };
