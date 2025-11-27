'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
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

    await queryInterface.bulkInsert('Cedente', [
      {
        cnpj: '11222333000144',
        token: 'token_cedente_teste',
        softwarehouse_id: 1,
        status: 'ativo',
        data_criacao: now,
        configuracao_notificacao: '{"url": "https://webhook.site/91aae5f9-4e9b-4fe7-a54f-ad2b11431cb9", "ativado": true, "headers_adicionais": [{"content-type": "application/json"}]}',
        created_at: now,
        updated_at: now
      },
    ], {});

   await queryInterface.bulkInsert('Conta', [
  // CONTA 1: BOLETO
  {
    id: 1, // Se for auto-incrementável, remova o ID ou verifique a sequência
    produto: 'boleto',
    banco_codigo: '001',
    cedente_id: 1, // ID do Cedente
    status: 'ativo',
    data_criacao: now,
    configuracao_notificacao: '{"url": "https://webhook.site/7eb3537a-8de7-41b3-b2a3-ecf7de3e09bf", "ativado": true}',
    created_at: now,
    updated_at: now
  },
  // CONTA 2: PIX
  {
    id: 2, 
    produto: 'pix',
    banco_codigo: '001',
    cedente_id: 1, // ID do Cedente
    status: 'ativo',
    data_criacao: now,
    configuracao_notificacao: '{"url": "https://webhook.site/f6204df1-8be9-414d-91c8-8ac9426b581c", "ativado": true}',
    created_at: now,
    updated_at: now
  },
  // CONTA 3: PAGAMENTO
  {
    id: 3, 
    produto: 'pagamento',
    banco_codigo: '001',
    cedente_id: 1, // ID do Cedente
    status: 'ativo',
    data_criacao: now,
    configuracao_notificacao: '{"url": "https://webhook.site/e7263bc9-d38d-42bd-b396-6afa1ee5fbf6", "ativado": true}',
    created_at: now,
    updated_at: now
  },
], {});

// 2. INSERÇÃO DOS 3 CONVÊNIOS (GLOBAL)
await queryInterface.bulkInsert('Convenio', [
  {
    id: 1,
    numero_convenio: 'CONV001_BOLETO',
    conta_id: 1, // Liga à Conta Boleto
    data_criacao: now,
    created_at: now,
    updated_at: now
  },
  {
    id: 2,
    numero_convenio: 'CONV002_PIX',
    conta_id: 2, // Liga à Conta PIX
    data_criacao: now,
    created_at: now,
    updated_at: now
  },
  {
    id: 3,
    numero_convenio: 'CONV003_PAGAMENTO',
    conta_id: 3, // Liga à Conta Pagamento
    data_criacao: now,
    created_at: now,
    updated_at: now
  },
], {});

// 3. ATUALIZAÇÃO DOS SERVIÇOS (GLOBAL)
await queryInterface.bulkInsert('servicos', [
  // Exemplo BOLETO
  {
    id: 1,
    convenio_id: 1, // <-- Liga ao Convênio BOLETO (ID 1)
    status: 'DISPONIVEL', // <-- Status de teste comum
    data_criacao: now,
    created_at: now,
    updated_at: now
  },
  // Exemplo PIX
  {
    id: 7,
    convenio_id: 2, // <-- Liga ao Convênio PIX (ID 2)
    status: 'DISPONIVEL', // <-- Status de teste comum
    data_criacao: now,
    created_at: now,
    updated_at: now
  },
  // Exemplo PAGAMENTO
  {
    id: 8, // Use um novo ID, se necessário
    convenio_id: 3, // <-- Liga ao Convênio PAGAMENTO (ID 3)
    status: 'PAGO', // <-- Status de teste comum
    data_criacao: now,
    created_at: now,
    updated_at: now
  },
  // ... (Outros serviços)
], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('servicos', null, {});
    await queryInterface.bulkDelete('Convenio', null, {});
    await queryInterface.bulkDelete('Conta', null, {});
    await queryInterface.bulkDelete('Cedente', null, {});
    await queryInterface.bulkDelete('SoftwareHouses', null, {});
  },
};