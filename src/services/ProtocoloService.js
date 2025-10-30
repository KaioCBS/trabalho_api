const redis = require('../config/redis');
const { Op } = require('sequelize');
const { WebhookReprocessado } = require('../models');

class ProtocoloService {
  static async listar(filtros) {
    const { start_date, end_date, product, id, kind, type } = filtros;

    if (!start_date || !end_date) {
      throw { status: 400, message: 'Os campos start_date e end_date são obrigatórios.' };
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    const diff = (end - start) / (1000 * 60 * 60 * 24);

    if (diff < 0 || diff > 31) {
      throw { status: 400, message: 'Intervalo de datas inválido (máximo 31 dias).' };
    }

    const cacheKey = `protocolo:list:${JSON.stringify(filtros)}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const where = {
      data_criacao: { [Op.between]: [start, end] },
    };

    if (kind) where.kind = kind;
    if (type) where.type = type;
    if (id) where.servico_id = { [Op.like]: `%${id}%` };

    const protocolos = await WebhookReprocessado.findAll({ where });

    await redis.setEx(cacheKey, 86400, JSON.stringify(protocolos));

    return protocolos;
  }

  static async buscar(uuid) {
    const cacheKey = `protocolo:${uuid}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const protocolo = await WebhookReprocessado.findByPk(uuid);

    if (!protocolo) {
      throw { status: 400, message: 'Protocolo não encontrado.' };
    }

    if (protocolo.type === 'sent') {
      await redis.setEx(cacheKey, 3600, JSON.stringify(protocolo));
    }

    return protocolo;
  }
}

module.exports = ProtocoloService;
