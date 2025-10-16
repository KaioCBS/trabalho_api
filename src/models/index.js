const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const CedenteModel = require('./cedente');
const ContaModel = require('./conta');
const ConvenioModel = require('./convenio');
const ServicoModel = require('./servico');
const SoftwareHouseModel = require('./software_house');
const WebhookProcessadoModel = require('./webhook_processado');

const Cedente = CedenteModel(sequelize, Sequelize.DataTypes);
const Conta = ContaModel(sequelize, Sequelize.DataTypes);
const Convenio = ConvenioModel(sequelize, Sequelize.DataTypes);
const Servico = ServicoModel(sequelize, Sequelize.DataTypes);
const SoftwareHouse = SoftwareHouseModel(sequelize, Sequelize.DataTypes);
const WebhookProcessado = WebhookProcessadoModel(sequelize, Sequelize.DataTypes);

const db = {
  sequelize,
  Sequelize,
  Cedente,
  Conta,
  Convenio,
  Servico,
  SoftwareHouse,
  WebhookProcessado,
};

Object.values(db).forEach(model => {
  if (model && model.associate) model.associate(db);
});

module.exports = db;
