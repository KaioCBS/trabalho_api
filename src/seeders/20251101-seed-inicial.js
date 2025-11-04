'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar se já existe SoftwareHouse antes de inserir
    const existingSh = await queryInterface.sequelize.query(
      'SELECT id FROM "SoftwareHouses" WHERE cnpj = :cnpj',
      {
        replacements: { cnpj: '12345678000199' },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    if (existingSh.length === 0) {
      await queryInterface.bulkInsert('SoftwareHouses', [
        {
          cnpj: '12345678000199',
          token: 'token_sh_teste',
          status: 'ativo',
          data_criacao: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        },
      ], {});
    }

    // Verificar se já existe Cedente antes de inserir
    const existingCedente = await queryInterface.sequelize.query(
      'SELECT id FROM "Cedente" WHERE cnpj = :cnpj',
      {
        replacements: { cnpj: '11222333000144' },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    if (existingCedente.length === 0) {
      // Buscar ID da SoftwareHouse
      const shResult = await queryInterface.sequelize.query(
        'SELECT id FROM "SoftwareHouses" WHERE cnpj = :cnpj',
        {
          replacements: { cnpj: '12345678000199' },
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      );

      if (shResult.length > 0) {
        await queryInterface.bulkInsert('Cedente', [
          {
            cnpj: '11222333000144',
            token: 'token_cedente_teste',
            softwarehouse_id: shResult[0].id,
            status: 'ativo',
            data_criacao: new Date(),
            configuracao_notificacao: '{"url": "https://webhook.site/teste", "ativado": true, "headers_adicionais": [{"content-type": "application/json"}]}',
            created_at: new Date(),
            updated_at: new Date()
          },
        ], {});
      }
    }

    // Verificar se já existe Conta antes de inserir
    const existingConta = await queryInterface.sequelize.query(
      'SELECT id FROM "Conta" WHERE cedente_id = 1 AND produto = :produto',
      {
        replacements: { produto: 'boleto' },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    if (existingConta.length === 0) {
      await queryInterface.bulkInsert('Conta', [
        {
          produto: 'boleto',
          banco_codigo: '001',
          cedente_id: 1,
          status: 'ativo',
          data_criacao: new Date(),
          configuracao_notificacao: '{"url": "https://webhook.site/teste", "ativado": true}',
          created_at: new Date(),
          updated_at: new Date()
        },
      ], {});
    }

    // Verificar se já existe Convênio antes de inserir
    const existingConvenio = await queryInterface.sequelize.query(
      'SELECT id FROM "Convenio" WHERE numero_convenio = :numero',
      {
        replacements: { numero: 'CONV001' },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    if (existingConvenio.length === 0) {
      await queryInterface.bulkInsert('Convenio', [
        {
          numero_convenio: 'CONV001',
          conta_id: 1,
          data_criacao: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        },
      ], {});
    }

    // Verificar se já existem Serviços antes de inserir
    const existingServicos = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM "Servico" WHERE id IN (1, 2, 3)',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    if (existingServicos[0].count === '0') {
      await queryInterface.bulkInsert('Servico', [
        {
          id: 1,
          convenio_id: 1,
          status: 'REGISTRADO',
          data_criacao: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          convenio_id: 1,
          status: 'SCHEDULED',
          data_criacao: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          convenio_id: 1,
          status: 'ACTIVE',
          data_criacao: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        },
      ], {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Servico', null, {});
    await queryInterface.bulkDelete('Convenio', null, {});
    await queryInterface.bulkDelete('Conta', null, {});
    await queryInterface.bulkDelete('Cedente', null, {});
    await queryInterface.bulkDelete('SoftwareHouses', null, {});
  },
};