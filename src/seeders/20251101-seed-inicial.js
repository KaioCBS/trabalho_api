'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SoftwareHouses', [
      {
        id: 1,
        cnpj: '12345678000199',
        token: 'token_sh_teste',
        status: 'ativo',
        data_criacao: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});

    await queryInterface.bulkInsert('Cedente', [
      {
        id: 1,
        cnpj: '11222333000144',
        token: 'token_cedente_teste',
        softwarehouse_id: 1,
        status: 'ativo',
        data_criacao: new Date(),
        configuracao_notificacao: JSON.stringify({ url: 'https://webhook.site/teste' }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cedente', null, {});
    await queryInterface.bulkDelete('SoftwareHouses', null, {});
  },
};
