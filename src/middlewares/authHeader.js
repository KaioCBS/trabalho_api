const jwt = require('jsonwebtoken');
const { SoftwareHouse, Cedente } = require('../models');
const jwtSecret = process.env.JWT_SECRET || 'supersecret-chave-jwt';

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Try JWT first
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        return next();
      } catch (err) {
        return res.status(401).json({ message: 'Token JWT inválido ou expirado.' });
      }
    }

    // Legacy headers (cnpj-sh etc), accept x- prefix too
    const getHeader = (name) => req.headers[name] || req.headers[`x-${name}`];

    const cnpjSh = getHeader('cnpj-sh');
    const tokenSh = getHeader('token-sh');
    const cnpjCedente = getHeader('cnpj-cedente');
    const tokenCedente = getHeader('token-cedente');

    // Verifica se todos os campos obrigatórios estão presentes
    if (!cnpjSh || !tokenSh || !cnpjCedente || !tokenCedente) {
      return res.status(401).json({
        message: 'Headers de autenticação obrigatórios não informados.',
      });
    }

    // Valida SoftwareHouse
    const softwareHouse = await SoftwareHouse.findOne({
      where: { cnpj: cnpjSh, token: tokenSh, status: 'ativo' },
    });

    if (!softwareHouse) {
      return res.status(401).json({ message: 'SoftwareHouse não autenticada.' });
    }

    // Valida Cedente vinculado
    const cedente = await Cedente.findOne({
      where: {
        cnpj: cnpjCedente,
        token: tokenCedente,
        status: 'ativo',
        softwarehouse_id: softwareHouse.id,
      },
    });

    if (!cedente) {
      return res.status(401).json({ message: 'Cedente não autenticado.' });
    }

    // Armazena no request para uso posterior (compat com req.context prev)
    req.context = { softwareHouse, cedente };

    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({ message: 'Erro interno na autenticação.' });
  }
};
