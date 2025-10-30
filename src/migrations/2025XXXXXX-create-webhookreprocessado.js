'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('webhookreprocessado', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        data: { type: Sequelize.JSONB, allowNull: false },
        data_criacao: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        cedente_id: { type: Sequelize.INTEGER, allowNull: false },
        kind: { type: Sequelize.STRING, allowNull: false },
        type: { type: Sequelize.STRING, allowNull: false },
        servico_id: { type: Sequelize.TEXT, allowNull: false }, 
        protocolo: { type: Sequelize.STRING, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('webhookreprocessado');
  },
};
