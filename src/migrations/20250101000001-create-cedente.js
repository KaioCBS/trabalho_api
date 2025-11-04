'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cedente', {
      id: { 
        type: Sequelize.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },
      data_criacao: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.NOW 
      },
      cnpj: { 
        type: Sequelize.STRING(14), 
        allowNull: false, 
        unique: true 
      },
      token: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      softwarehouse_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'SoftwareHouses',
          key: 'id'
        }
      },
      status: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      configuracao_notificacao: { 
        type: Sequelize.JSONB, 
        allowNull: true 
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cedente');
  }
};