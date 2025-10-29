'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable('exits',{
      id:{
        type: Sequelize.UUID,
        primaryKey: true,
      },
      full_name:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      reason:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at:{
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('exits');
  }
};
