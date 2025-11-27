const axios = require('axios');
const { randomUUID } = require('crypto');
const redis = require('../config/redis');
// Importando todas as models necessárias para a busca com associações
const { WebhookReprocessado, Servico, Convenio, Conta } = require('../models'); 
const NotificacaoService = require('./NotificacaoService');
const logger = require('../config/logger');

class ReenvioService {
  static async reenviar(params, context) {
    // Normalizações e validações iniciais
    if (!params || Object.keys(params).length === 0) {
      throw { status: 400, message: 'Corpo da requisição vazio.' };
    }
    // Garante que 'id' é sempre um array de strings
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
      throw { status: 400, message: 'IDs dos serviços não informados.' };
    }
    
    if (id.length > 30) {
      throw { status: 400, message: 'O número máximo de serviços por requisição é 30.' };
    }
    
    const cacheKey = `reenvio:${cedente.id}:${product}:${kind}:${type}:${id.join(',')}`;

    if (await redis.get(cacheKey)) {
      throw { status: 429, message: 'Requisição idêntica enviada recentemente. Tente novamente mais tarde.' };
    }
    
    const statusMapping = {
  boleto: {
    disponivel: 'REGISTRADO',
    cancelado:  'BAIXADO',
    pago:       'LIQUIDADO'
  },
  pagamento: {
    disponivel: 'SCHEDULED',
    cancelado:  'CANCELLED',
    pago:       'PAID'
  },
  pix: {
    disponivel: 'ACTIVE',
    cancelado:  'REJECTED',
    pago:       'LIQUIDATED'
  }
};
if (!statusMapping[product] || !statusMapping[product][type]) {
  throw { status: 400, message: 'Não foi possível validar a situação esperada para este produto/type.' };
}

const situacaoEsperada = statusMapping[product][type];
    // Busca os serviços (sem filtrar pelo produto na query) e inclui Convenio->Conta
    const servicos = await Servico.findAll({
      where: { id: id },
      include: [
        {
          model: Convenio,
          as: 'convenio',
          required: true,
          include: [
            {
              model: Conta,
              as: 'conta',
              required: true,
              // OBS: removi where que filtrava por cedente_id e produto
            },
          ],
        },
      ],
      limit: id.length,
    });

    // Log para debug — mostre o que foi buscado
    logger.info(`ReenvioService: encontrados ${servicos.length} servicos para ids [${id.join(',')}]`);

    // Verifica se achou todos os ids pedidos
    if (servicos.length !== id.length) {
      logger.warn('ReenvioService: mismatch count - servicos encontrados:', servicos.map(s => ({
        id: s.id,
        convenio_id: s.convenio_id,
        conta_produto: s.convenio?.conta?.produto,
        conta_cedente_id: s.convenio?.conta?.cedente_id
      })));
      throw {
        status: 404,
        message: `Pelo menos um dos serviços não foi encontrado, não pertence a este cedente, ou não é do produto "${product}" solicitado.`
      };
    }

    // Agora valide que cada serviço pertence ao cedente correto e ao produto correto
    const servicosNaoDoCedenteOuProduto = servicos.filter(s => {
      const conta = s.convenio && s.convenio.conta;
      if (!conta) return true; // sem conta -> inválido
      if (String(conta.cedente_id) !== String(cedente.id)) return true; // não pertence ao cedente
      if (String(conta.produto) !== String(product)) return true; // produto diferente
      return false;
    });

    if (servicosNaoDoCedenteOuProduto.length > 0) {
      logger.warn('ReenvioService: servicos inválidos por cedente/produto:', servicosNaoDoCedenteOuProduto.map(s => ({
        id: s.id,
        conta_produto: s.convenio?.conta?.produto,
        conta_cedente_id: s.convenio?.conta?.cedente_id
      })));
      throw {
        status: 404,
        message: `Pelo menos um dos serviços não foi encontrado, não pertence a este cedente, ou não é do produto "${product}" solicitado.`
      };
    }

    // Validação de status (mantém sua lógica)
    const servicosInvalidos = servicos.filter(servico =>
      servico.status.trim().toUpperCase() !== situacaoEsperada
    );

    if (servicosInvalidos.length > 0) {
      logger.warn('ReenvioService: servicos com status inválido:', servicosInvalidos.map(s => ({ id: s.id, status: s.status })));
      throw {
        status: 422,
        message: `Não foi possível gerar a notificação. Pelo menos um dos serviços tem o status inválido para a requisição de "${product}". O status esperado era "${situacaoEsperada}".`,
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

      // Logging do reenvio
      logger.info(`🌐 Tentando reenviar webhook para: ${notificacao.url} com protocolo: ${protocolo}`);

      await axios.post(notificacao.url, payload, {
        headers: notificacao.headers_adicionais?.[0] || {
          'content-type': 'application/json',
        },
      });
      
      // Salva o protocolo de webhook reprocessado
      await WebhookReprocessado.create({
        cedente_id: cedente.id,
        kind,
        type,
        servico_id: id.join(','), 
        data: payload,
        protocolo: protocolo,
      });

      return { 
        status: 200, 
        message: 'Reenvio de webhook solicitado com sucesso.', 
        protocolo: protocolo 
      };
      
    } catch (error) {

      // Tratamento de erro de envio de webhook
      if (error.response) {
        // Erros de status HTTP do webhook
        logger.error(`❌ Falha no envio do webhook. Protocolo: ${protocolo}. Erro: Request failed with status code ${error.response.status}`);
      } else {
        // Erro de rede/conexão
        logger.error(`❌ Falha no envio do webhook. Protocolo: ${protocolo}. Erro: ${error.message}`);
      }
      logger.error(`Falha ao enviar webhook para ${notificacao.url}:`);

      await redis.del(cacheKey); // Remove do cache para permitir re-tentativa
      
      throw { status: 500, message: 'Não foi possível gerar a notificação devido a uma falha de serviço externo. Tente novamente mais tarde.' };
    }
  }
}

module.exports = ReenvioService;