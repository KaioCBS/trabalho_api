// src/routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// login usando username e password
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // valida campos
  if (!username || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  // login fixo para ambiente de desenvolvimento/teste
  if (username !== 'admin' || password !== '123456') {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  try {
    // payload básico do token
    const payload = {
      user: username,
      softwareHouseId: 1,
      cedenteId: 1,
      cnpj_sh: '12345678000199',
      cnpj_cedente: '11111111000111'
    };

    // gera token JWT com expiração de 1h
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ message: 'Erro interno ao gerar token.' });
  }
});

module.exports = router;
