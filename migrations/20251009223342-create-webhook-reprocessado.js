'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await queryInterface.createTable('WebhookReprocessados', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      data_criacao: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      },
      cedente_id: {
        type: Sequelize.INTEGER,
        allowNull: false
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
        allowNull: true 
      },
      protocolo: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    await queryInterface.addConstraint('WebhookReprocessados', {
      fields: ['cedente_id'],
      type: 'foreign key',
      name: 'fk_webhookreprocessados_cedentes',
      references: { table: 'Cedentes', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WebhookReprocessados');
  }
};
