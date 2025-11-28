"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    // 1. SOFTWARE HOUSE
    await queryInterface.bulkInsert("SoftwareHouses", [
      {
        id: 1,
        data_criacao: new Date(),
        cnpj: "11111111000111",
        token: "token-sh-teste",
        status: "ativo",
        configuracao_notificacao: JSON.stringify({
          ativado: true,
          url: "https://webhook.site/91aae5f9-4e9b-4fe7-a54f-ad2b11431cb9"
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // 2. CEDENTE
    await queryInterface.bulkInsert("Cedente", [
      {
        id: 1,
        data_criacao: new Date(),
        cnpj: "22222222000122",
        token: "token-cedente-teste",
        status: "ativo",
        configuracao_notificacao: JSON.stringify({
          boleto: { ativado: true },
          pagamento: { ativado: true },
          pix: { ativado: true },
        }),
        softwarehouse_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // 3. CONTAS
    await queryInterface.bulkInsert("Conta", [
      {
        id: 1,
        data_criacao: new Date(),
        banco_codigo: "001",
        produto: "boleto",
        cedente_id: 1,
        status: "ativo",
        configuracao_notificacao: JSON.stringify({
          ativado: true,
          url: "https://webhook.site/7eb3537a-8de7-41b3-b2a3-ecf7de3e09bf",
          disponivel: true,
          cancelado: true,
          pago: true,
          headers_adicionais: [{ "content-type": "application/json" }]
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        data_criacao: new Date(),
        banco_codigo: "001",
        produto: "pagamento",
        cedente_id: 1,
        status: "ativo",
        configuracao_notificacao: JSON.stringify({
          ativado: true,
          url: "https://webhook.site/f6204df1-8be9-414d-91c8-8ac9426b581c",
          disponivel: true,
          cancelado: true,
          pago: true,
          headers_adicionais: [{ "content-type": "application/json" }]
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        data_criacao: new Date(),
        banco_codigo: "001",
        produto: "pix",
        cedente_id: 1,
        status: "ativo",
        configuracao_notificacao: JSON.stringify({
          ativado: true,
          url: "https://webhook.site/e7263bc9-d38d-42bd-b396-6afa1ee5fbf6",
          disponivel: true,
          cancelado: true,
          pago: true,
          headers_adicionais: [{ "content-type": "application/json" }]
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // 4. CONVENIOS 
    await queryInterface.bulkInsert("Convenio", [
  {
    id: 1,
    numero_convenio: "9999",
    conta_id: 1,
    data_criacao: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    numero_convenio: "8888",
    conta_id: 2,
    data_criacao: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    numero_convenio: "7777",
    conta_id: 3,
    data_criacao: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
]);


    // 5. SERVIÇOS
    await queryInterface.bulkInsert("servicos", [
      // BOLETO
      { id: 1, convenio_id: 1, status: "REGISTRADO",  data_criacao: new Date(), created_at: new Date(), updated_at: new Date() },
      { id: 2, convenio_id: 1, status: "BAIXADO",     data_criacao: new Date(), created_at: new Date(), updated_at: new Date() },
      { id: 3, convenio_id: 1, status: "LIQUIDADO",   data_criacao: new Date(), created_at: new Date(), updated_at: new Date() },

      // PAGAMENTO
      { id: 4, convenio_id: 2, status: "SCHEDULED",   data_criacao: new Date(), created_at: new Date(), updated_at: new Date() },
      { id: 5, convenio_id: 2, status: "CANCELLED",   data_criacao: new Date(), created_at: new Date(), updated_at: new Date() },
      { id: 6, convenio_id: 2, status: "PAID",        data_criacao: new Date(), created_at: new Date(), updated_at: new Date() },

      // PIX
      { id: 7, convenio_id: 3, status: "ACTIVE",      data_criacao: new Date(), created_at: new Date(), updated_at: new Date() },
      { id: 8, convenio_id: 3, status: "REJECTED",    data_criacao: new Date(), created_at: new Date(), updated_at: new Date() },
      { id: 9, convenio_id: 3, status: "LIQUIDATED",  data_criacao: new Date(), created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("servicos", null, {});
    await queryInterface.bulkDelete("Convenio", null, {});
    await queryInterface.bulkDelete("Conta", null, {});
    await queryInterface.bulkDelete("Cedente", null, {});
    await queryInterface.bulkDelete("SoftwareHouses", null, {});
  },
};
