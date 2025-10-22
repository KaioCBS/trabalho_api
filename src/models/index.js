const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const CedenteModel = require('./cedente');
const ContaModel = require('./conta');
const ConvenioModel = require('./convenio');
const ServicoModel = require('./servico');
const SoftwareHouseModel = require('./software_house');
const WebhookProcessadoModel = require('./webhook_processado');
const BoletoModel = require('./boleto');
const PagamentoModel = require('./pagamento');
const PixModel = require('./pix');

const Cedente = CedenteModel(sequelize, Sequelize.DataTypes);
const Conta = ContaModel(sequelize, Sequelize.DataTypes);
const Convenio = ConvenioModel(sequelize, Sequelize.DataTypes);
const Servico = ServicoModel(sequelize, Sequelize.DataTypes);
const SoftwareHouse = SoftwareHouseModel(sequelize, Sequelize.DataTypes);
const WebhookProcessado = WebhookProcessadoModel(sequelize, Sequelize.DataTypes);
const Boleto = BoletoModel(sequelize, Sequelize.DataTypes);
const Pagamento = PagamentoModel(sequelize, Sequelize.DataTypes);
const Pix = PixModel(sequelize, Sequelize.DataTypes);

const db = {
  sequelize,
  Sequelize,
  Cedente,
  Conta,
  Convenio,
  Servico,
  SoftwareHouse,
  WebhookProcessado,
  Boleto,
  Pagamento,
  Pix,
};

Object.values(db).forEach(model => {
  if (model && model.associate) model.associate(db);
});

module.exports = db;
