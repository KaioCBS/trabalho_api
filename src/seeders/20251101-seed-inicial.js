'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // 1. Primeiro SoftwareHouse
    await queryInterface.bulkInsert('SoftwareHouses', [
      {
        cnpj: '12345678000199',
        token: 'token_sh_teste',
        status: 'ativo',
        data_criacao: now,
        created_at: now,
        updated_at: now
      },
    ], {});

    // 2. Depois Cedente
    await queryInterface.bulkInsert('Cedente', [
      {
        cnpj: '11222333000144',
        token: 'token_cedente_teste',
        softwarehouse_id: 1,
        status: 'ativo',
        data_criacao: now,
        configuracao_notificacao: '{"url": "https://webhook.site/teste", "ativado": true, "headers_adicionais": [{"content-type": "application/json"}]}',
        created_at: now,
        updated_at: now
      },
    ], {});

    // 3. Depois Conta
    await queryInterface.bulkInsert('Conta', [
      {
        produto: 'boleto',
        banco_codigo: '001',
        cedente_id: 1,
        status: 'ativo',
        data_criacao: now,
        configuracao_notificacao: '{"url": "https://webhook.site/134ddf82-5ad9-4011-998e-99fefc79edfb", "ativado": true}',
        created_at: now,
        updated_at: now
      },
    ], {});

    // 4. Depois Convênio
    await queryInterface.bulkInsert('Convenio', [
      {
        numero_convenio: 'CONV001',
        conta_id: 1,
        data_criacao: now,
        created_at: now,
        updated_at: now
      },
    ], {});

    // 5. Por último Serviços
    await queryInterface.bulkInsert('servicos', [
      {
        id: 1,
        convenio_id: 1,
        status: 'REGISTRADO',
        data_criacao: now,
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        convenio_id: 1,
        status: 'SCHEDULED',
        data_criacao: now,
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        convenio_id: 1,
        status: 'ACTIVE',
        data_criacao: now,
        created_at: now,
        updated_at: now
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // ✅ ORDEM CORRETA: do mais dependente para o menos dependente
    await queryInterface.bulkDelete('servicos', null, {});
    await queryInterface.bulkDelete('Convenio', null, {});
    await queryInterface.bulkDelete('Conta', null, {});
    await queryInterface.bulkDelete('Cedente', null, {});
    await queryInterface.bulkDelete('SoftwareHouses', null, {});
  },
};