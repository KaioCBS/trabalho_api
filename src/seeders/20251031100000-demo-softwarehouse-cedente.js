'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Inserir SoftwareHouse
    await queryInterface.bulkInsert('softwarehouses', [
      {
        id: 1,
        cnpj: '12345678000100',
        token: 'token_sh_teste',
        status: 'ativo',
        data_criacao: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Inserir Cedente
    await queryInterface.bulkInsert('cedente', [
      {
        id: 1,
        cnpj: '11222333000181',
        token: 'token_cedente_teste',
        softwarehouse_id: 1,
        status: 'ativo',
        data_criacao: new Date(),
        configuracao_notificacao: JSON.stringify({
          url: 'https://exemplo.com/webhook',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cedente', null, {});
    await queryInterface.bulkDelete('softwarehouses', null, {});
  },
};
