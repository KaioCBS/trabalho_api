'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WebhookReprocessado', {
      id: { 
        type: Sequelize.UUID, 
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4 
      },
      data: { 
        type: Sequelize.JSONB, 
        allowNull: false 
      },
      data_criacao: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.NOW 
      },
      cedente_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'Cedente',
          key: 'id'
        }
      },
      kind: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      type: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      servico_id: { 
        type: Sequelize.TEXT, 
        allowNull: false 
      },
      protocolo: { 
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
    await queryInterface.dropTable('WebhookReprocessado');
  }
};