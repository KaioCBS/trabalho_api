'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Inserir SoftwareHouse
    const [softwareHouse] = await queryInterface.bulkInsert(
      'softwarehouses',
      [
        {
          id: 1,
          nome: 'Tech Solutions LTDA',
          cnpj: '12345678000199',
          token: 'token_softwarehouse_123',
          status: 'ativo',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true }
    );

    // Inserir Cedente vinculado à SoftwareHouse
    await queryInterface.bulkInsert('cedentes', [
      {
        id: 1,
        nome: 'Empresa Teste LTDA',
        cnpj: '99887766000111',
        token: 'token_cedente_abc',
        status: 'ativo',
        softwarehouse_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cedentes', null, {});
    await queryInterface.bulkDelete('softwarehouses', null, {});
  },
};
