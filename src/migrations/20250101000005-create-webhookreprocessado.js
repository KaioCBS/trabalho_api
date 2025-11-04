'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Inserir SoftwareHouse
    await queryInterface.bulkInsert('SoftwareHouses', [
      {
        cnpj: '12345678000199',
        token: 'token_sh_teste',
        status: 'ativo',
        data_criacao: new Date()
      },
    ], {});

    // Inserir Cedente
    await queryInterface.bulkInsert('Cedente', [
      {
        cnpj: '11222333000144',
        token: 'token_cedente_teste',
        softwarehouse_id: 1,
        status: 'ativo',
        data_criacao: new Date(),
        configuracao_notificacao: '{"url": "https://webhook.site/teste", "ativado": true, "headers_adicionais": [{"content-type": "application/json"}]}'
      },
    ], {});

    // Inserir Conta
    await queryInterface.bulkInsert('Conta', [
      {
        produto: 'boleto',
        banco_codigo: '001',
        cedente_id: 1,
        status: 'ativo',
        data_criacao: new Date(),
        configuracao_notificacao: '{"url": "https://webhook.site/teste", "ativado": true}'
      },
    ], {});

    // Inserir Convênio
    await queryInterface.bulkInsert('Convenio', [
      {
        numero_convenio: 'CONV001',
        conta_id: 1,
        data_criacao: new Date()
      },
    ], {});

    // Inserir Serviços para teste
    await queryInterface.bulkInsert('Servico', [
      {
        id: 1,
        convenio_id: 1,
        status: 'REGISTRADO',
        data_criacao: new Date()
      },
      {
        id: 2,
        convenio_id: 1,
        status: 'SCHEDULED',
        data_criacao: new Date()
      },
      {
        id: 3,
        convenio_id: 1,
        status: 'ACTIVE',
        data_criacao: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Servico', null, {});
    await queryInterface.bulkDelete('Convenio', null, {});
    await queryInterface.bulkDelete('Conta', null, {});
    await queryInterface.bulkDelete('Cedente', null, {});
    await queryInterface.bulkDelete('SoftwareHouses', null, {});
  },
};