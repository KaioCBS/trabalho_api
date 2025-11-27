const redis = require('../config/redis'); // Verifique se o caminho do seu arquivo redis.js está correto aqui
const { Op } = require('sequelize');
const { WebhookReprocessado } = require('../models');

class ProtocoloService {
  static async listar(filtros) {
    const { start_date, end_date, product, id, kind, type } = filtros;

    // Validação obrigatória de datas conforme regra do PDF
    if (!start_date || !end_date) {
      throw { status: 400, message: 'Os campos start_date e end_date são obrigatórios.' };
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    const diff = (end - start) / (1000 * 60 * 60 * 24);

    // Validação de intervalo máximo de 31 dias
    if (diff < 0 || diff > 31) {
      throw { status: 400, message: 'Intervalo de datas inválido (máximo 31 dias).' };
    }

    // Cache de listagem
    const cacheKey = `protocolo:list:${JSON.stringify(filtros)}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Construção da query
    const where = {
      data_criacao: { [Op.between]: [start, end] },
    };

    if (kind) where.kind = kind;
    if (type) where.type = type;
    if (id) where.servico_id = { [Op.like]: `%${id}%` };

    const protocolos = await WebhookReprocessado.findAll({ where });

    // Salva no cache por 1 dia (86400 segundos)
    await redis.setEx(cacheKey, 86400, JSON.stringify(protocolos));

    return protocolos;
  }

  static async buscar(uuid) {
    const cacheKey = `protocolo:${uuid}`;
    
    // Tenta buscar do cache primeiro
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Busca no banco de dados
    const protocolo = await WebhookReprocessado.findByPk(uuid);

    if (!protocolo) {
      throw { status: 400, message: 'Protocolo não encontrado.' };
    }

    // Correção: Removemos o 'if (protocolo.type === "sent")'
    // Como o registro existe no banco, assumimos que foi processado com sucesso.
    // Salva no cache por 1 hora (3600 segundos)
    await redis.setEx(cacheKey, 3600, JSON.stringify(protocolo));

    return protocolo;
  }
}

module.exports = ProtocoloService;