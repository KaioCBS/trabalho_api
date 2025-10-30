const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const redis = require('../config/redis');
const { WebhookReprocessado, Servico } = require('../models');
const NotificacaoService = require('./NotificacaoService');

class ReenvioService {
  /**
   * Reenvia notificações de webhook conforme regras do PDF.
   * @param {Object} params - Dados da requisição.
   * @param {Object} context - Contexto da autenticação (softwareHouse, cedente).
   */
  static async reenviar(params, context) {
    const { product, id, kind, type } = params;
    const { cedente } = context;

    // Validações de regras de negócio
    if (!['boleto', 'pagamento', 'pix'].includes(product)) {
      throw { status: 400, message: 'Produto inválido. Use boleto, pagamento ou pix.' };
    }

    if (!['webhook'].includes(kind)) {
      throw { status: 400, message: 'Kind inválido. Use apenas webhook.' };
    }

    if (!['disponivel', 'cancelado', 'pago'].includes(type)) {
      throw { status: 400, message: 'Type inválido. Use disponível, cancelado ou pago.' };
    }

    if (!Array.isArray(id) || id.length === 0) {
      throw { status: 400, message: 'Campo id deve ser um array de strings.' };
    }

    if (id.length > 30) {
      throw { status: 400, message: 'Limite de 30 IDs por requisição excedido.' };
    }

    // Gera um hash de cache baseado nos parâmetros
    const cacheKey = `reenviar:${product}:${type}:${JSON.stringify(id)}`;

    // Verifica se já foi processado recentemente
    const cached = await redis.get(cacheKey);
    if (cached) {
      throw { status: 429, message: 'Requisição duplicada detectada. Tente novamente após 1 hora.' };
    }

    // Verifica se todos os IDs existem e estão na situação correta
    const servicos = await Servico.findAll({ where: { id } });

    if (servicos.length !== id.length) {
      throw { status: 422, message: 'Um ou mais IDs de serviço são inválidos.' };
    }

    const statusMap = {
      boleto: { disponivel: 'REGISTRADO', cancelado: 'BAIXADO', pago: 'LIQUIDADO' },
      pagamento: { disponivel: 'SCHEDULED', cancelado: 'CANCELLED', pago: 'PAID' },
      pix: { disponivel: 'ACTIVE', cancelado: 'REJECTED', pago: 'LIQUIDATED' },
    };

    const situacaoEsperada = statusMap[product][type];

    const divergentes = servicos.filter((s) => s.status !== situacaoEsperada);
    if (divergentes.length > 0) {
      throw {
        status: 422,
        message: `Não foi possível gerar a notificação. A situação do ${product} diverge do tipo solicitado.`,
      };
    }

    // Busca configuração de notificação (prioridade: Conta > Cedente)
    const notificacao = await NotificacaoService.obterConfiguracao(cedente, product);

    if (!notificacao || !notificacao.ativado) {
      throw { status: 400, message: 'Configuração de notificação inativa.' };
    }

    // Simula envio do webhook
    const protocolo = uuidv4();
    const payload = {
      uuid: protocolo,
      kind,
      type,
      servicos: id,
      data: new Date(),
    };

    try {
      await axios.post(notificacao.url, payload, {
        headers: notificacao.headers_adicionais?.[0] || {
          'content-type': 'application/json',
        },
      });
    } catch (error) {
      throw { status: 400, message: 'Não foi possível gerar a notificação. Tente novamente mais tarde.' };
    }

    // Se chegou até aqui, salva no banco
    await WebhookReprocessado.create({
      id: protocolo,
      data: payload,
      cedente_id: cedente.id,
      kind,
      type,
      servico_id: JSON.stringify(id),
      protocolo,
    });

    // Grava no Redis por 1 hora
    await redis.setEx(cacheKey, 3600, 'true');

    return { protocolo, message: 'Webhook reenviado com sucesso.' };
  }
}

module.exports = ReenvioService;
