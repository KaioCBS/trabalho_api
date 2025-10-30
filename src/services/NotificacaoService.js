const { Conta } = require('../models');

class NotificacaoService {
  static async obterConfiguracao(cedente, product) {
    // Busca conta vinculada ao produto
    const conta = await Conta.findOne({ where: { cedente_id: cedente.id, produto: product } });

    if (conta && conta.configuracao_notificacao) {
      return conta.configuracao_notificacao;
    }

    if (cedente.configuracao_notificacao) {
      return cedente.configuracao_notificacao;
    }

    return null;
  }
}

module.exports = NotificacaoService;
