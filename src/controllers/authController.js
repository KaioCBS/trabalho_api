// src/controllers/authController.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Simulação de login — para testes locais
// Em produção, substitua por validação real (usuário no banco)
async function login(req, res) {
  const { username, password } = req.body;

  if (username !== 'admin' || password !== '123456') {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

  return res.json({
    message: 'Login bem-sucedido.',
    token,
  });
}

module.exports = { login };
