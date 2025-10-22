// src/migrations/20251022-create-protocolos.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Protocolos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false },
      produto: { type: Sequelize.STRING, allowNull: false },
      dados: { type: Sequelize.JSONB, allowNull: true },
      data_envio: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'pendente' },
      softwarehouse_id: { type: Sequelize.INTEGER, allowNull: true },
      cedente_id: { type: Sequelize.INTEGER, allowNull: true },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Protocolos');
  }
};
