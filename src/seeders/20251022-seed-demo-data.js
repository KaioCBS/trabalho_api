'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [softwareHouse] = await queryInterface.bulkInsert('SoftwareHouses', [{
      cnpj: '129129129000199',
      token: '123456',
      data_criacao: new Date(),
      status: 'ativo'
    }], { returning: ['id'] });

    await queryInterface.bulkInsert('Cedentes', [{
      cnpj: '12345678000199',
      token: '123456',
      softwarehouse_id: softwareHouse?.id || 1,
      data_criacao: new Date(),
      status: 'ativo'
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Cedentes', { cnpj: '12345678000199' });
    await queryInterface.bulkDelete('SoftwareHouses', { cnpj: '129129129000199' });
  }
};
