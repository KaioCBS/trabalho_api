'use strict';

const { v4: UUIDV4} = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   queryInterface.bulkInsert('exits', [
  {
    id: UUIDV4(),
    full_name: 'zezin',
    reason: 'test',
    ceated_at: new Date(),
  }
  ])
  },

  async down (queryInterface, Sequelize) {
     return queryInterface.bulkDelete('exits', null, {});
  }
};
