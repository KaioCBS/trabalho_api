'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SoftwareHouses', {
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
    await queryInterface.dropTable('SoftwareHouses');
  }
};