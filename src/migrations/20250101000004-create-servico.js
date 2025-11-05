'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('servicos', { // ✅ MUDAR para servicos
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
      convenio_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'Convenio',
          key: 'id'
        }
      },
      status: { 
        type: Sequelize.STRING, 
        allowNull: false 
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
    await queryInterface.dropTable('servicos'); // ✅ MUDAR para servicos
  }
};