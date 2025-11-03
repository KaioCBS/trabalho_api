'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('servico', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        data_criacao: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        convenio_id: { type: Sequelize.INTEGER, allowNull: false },
        status: { type: Sequelize.STRING, allowNull: false },
    });
  },
};
