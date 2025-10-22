// src/controllers/protocoloController.js
const { Op } = require('sequelize');
const { Protocolo } = require('../models');

async function listProtocolos(req, res) {
  try {
    // espera query params start_date e end_date no formato YYYY-MM-DD
    const { start_date, end_date, product } = req.query;
    if (!start_date || !end_date) {
      return res.status(422).json({ message: 'Validation failed', details: ['"start_date" is required', '"end_date" is required'] });
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    // include end day until 23:59:59
    end.setHours(23,59,59,999);

    const where = {
      data_envio: { [Op.between]: [start, end] }
    };

    if (product) where.produto = product;

    const protocolos = await Protocolo.findAll({ where, order: [['data_envio', 'DESC']] });

    return res.json(protocolos);
  } catch (err) {
    console.error('Erro na listagem de protocolos:', err);
    return res.status(400).json({ message: 'Erro na listagem de protocolos.' });
  }
}

async function getProtocolo(req, res) {
  try {
    const { uuid } = req.params;
    const protocolo = await Protocolo.findOne({ where: { uuid } });
    if (!protocolo) return res.status(404).json({ message: 'Protocolo não encontrado.' });
    return res.json(protocolo);
  } catch (err) {
    console.error('Erro ao buscar protocolo:', err);
    return res.status(500).json({ message: 'Erro ao buscar protocolo.' });
  }
}

module.exports = { listProtocolos, getProtocolo };
