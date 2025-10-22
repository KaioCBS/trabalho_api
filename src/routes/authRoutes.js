// src/routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { SoftwareHouse, Cedente } = require('../models');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// rota de login para gerar token
router.post('/login', async (req, res) => {
  const { cnpj_sh, token_sh, cnpj_cedente, token_cedente } = req.body;

  if (!cnpj_sh || !token_sh || !cnpj_cedente || !token_cedente) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const softwareHouse = await SoftwareHouse.findOne({ where: { cnpj: cnpj_sh, token: token_sh } });
    const cedente = await Cedente.findOne({ where: { cnpj: cnpj_cedente, token: token_cedente } });

    if (!softwareHouse || !cedente) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const payload = {
      softwareHouseId: softwareHouse.id,
      cedenteId: cedente.id,
      cnpj_sh,
      cnpj_cedente
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ message: 'Erro interno ao gerar token.' });
  }
});

module.exports = router;
