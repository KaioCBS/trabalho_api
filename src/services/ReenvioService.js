const axios = require('axios');
const { randomUUID } = require('crypto');
const redis = require('../config/redis');
const { WebhookReprocessado, Servico } = require('../models');
const NotificacaoService = require('./NotificacaoService');

class ReenvioService {
  static async reenviar(params, context) {
    // Normalizações e validações iniciais
    if (!params || Object.keys(params).length === 0) {
      throw { status: 400, message: 'Corpo da requisição vazio.' };
    }
    if (typeof params.id === 'string') params.id = [params.id];

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

    const cacheKey = `reenviar:${product}:${type}:${JSON.stringify(id)}`;

    let cached = await redis.get(cacheKey);
    if (cached) {
    throw { status: 429, message: 'Requisição duplicada . Tente novamente após 1 hora.' };
    }


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

    const notificacao = await NotificacaoService.obterConfiguracao(cedente, product);

    if (!notificacao || !notificacao.ativado) {
      throw { status: 400, message: 'Configuração de notificação inativa.' };
    }

    // Simula envio do webhook
    const protocolo = randomUUID(); 
    const payload = {
      uuid: protocolo,
      kind,
      type,
      servicos: id, 
      data: new Date(),
    };
    
    try {
      await redis.setEx(cacheKey, 3600, 'true');

      await axios.post(notificacao.url, payload, {
        headers: notificacao.headers_adicionais?.[0] || {
          'content-type': 'application/json',
        },
      });
      
    } catch (error) {

      await redis.del(cacheKey); 
      
      throw { status: 500, message: 'Não foi possível gerar a notificação devido a uma falha de serviço externo. Tente novamente mais tarde.' };
    }

    await WebhookReprocessado.create({
      id: protocolo,
      data: payload,
      cedente_id: cedente.id,
      kind,
      type,
      servico_id: JSON.stringify(id),
      protocolo,
    });
    

    return { protocolo, message: 'Webhook reenviado com sucesso.' };
  }
}

module.exports = ReenvioService;