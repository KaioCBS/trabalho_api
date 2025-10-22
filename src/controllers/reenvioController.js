// src/controllers/reenvioController.js
const { v4: uuidv4 } = require('uuid');
const { Protocolo } = require('../models');

// Exemplo de schema de validação (caso use Joi ou algo semelhante)
const Joi = require('joi');
const schema = Joi.object({
  tipo: Joi.string().required(),
  dados: Joi.object().required(),
});

async function postReenviar(req, res) {
  try {
    // 🔹 Validação básica do corpo da requisição
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        details: error.details.map((d) => d.message),
      });
    }

    const { tipo, dados } = req.body;

    // 🔹 Simula envio de dados (você pode substituir por sua lógica real de reenvio)
    console.log('📤 Reenviando dados para processamento:', { tipo, dados });

    // 🔹 Criação do registro de protocolo
    const novoProtocolo = await Protocolo.create({
      uuid: uuidv4(),
      produto: tipo,
      dados,
      data_envio: new Date(),
      status: 'processando',
      softwarehouse_id: req.softwareHouse ? req.softwareHouse.id : null,
      cedente_id: req.cedente ? req.cedente.id : null,
    });

    // 🔹 Retorna a resposta esperada
    return res.status(201).json({
      message: 'Reenvio iniciado com sucesso.',
      protocolo: novoProtocolo.uuid,
      status: novoProtocolo.status,
    });
  } catch (err) {
    console.error('❌ Erro no postReenviar:', err);
    return res.status(500).json({ message: 'Erro interno no reenvio.' });
  }
}

module.exports = { postReenviar, schema };
