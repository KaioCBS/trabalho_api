const jwt = require('jsonwebtoken');
const { SoftwareHouse, Cedente } = require('../models');
const jwtSecret = process.env.JWT_SECRET || 'supersecret-chave-jwt';

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, jwtSecret);
        
        const cedente = await Cedente.findOne({
          where: { id: decoded.id, status: 'ativo' },
          include: [{ model: SoftwareHouse, as: 'softwarehouse' }]
        });
        
        if (!cedente) {
          return res.status(401).json({ message: 'Cedente não encontrado.' });
        }
        
        req.context = {
          cedente: cedente,
          softwareHouse: cedente.softwarehouse
        };
        
        return next();
      } catch (err) {
        return res.status(401).json({ message: 'Token JWT inválido ou expirado.' });
      }
    }

    const getHeader = (name) => req.headers[name] || req.headers[`x-${name}`];

    const cnpjSh = getHeader('cnpj-sh');
    const tokenSh = getHeader('token-sh');
    const cnpjCedente = getHeader('cnpj-cedente');
    const tokenCedente = getHeader('token-cedente'); 

    if (!cnpjSh || !tokenSh || !cnpjCedente || !tokenCedente) {
      return res.status(401).json({
        message: 'Headers de autenticação obrigatórios não informados.',
      });
    }

    const softwareHouse = await SoftwareHouse.findOne({
      where: { cnpj: cnpjSh, token: tokenSh, status: 'ativo' },
    });

    if (!softwareHouse) {
      return res.status(401).json({ message: 'SoftwareHouse não autenticada.' });
    }

    const cedente = await Cedente.findOne({
      where: {
        cnpj: cnpjCedente,
        token: tokenCedente,
        status: 'ativo',
        softwarehouse_id: softwareHouse.id,
      },
      include: [{ model: SoftwareHouse, as: 'softwarehouse' }]
    });

    if (!cedente) {
      return res.status(401).json({ message: 'Cedente não autenticado.' });
    }

    req.context = {
      softwareHouse: softwareHouse,
      cedente: cedente
    };

    console.log('🔍 DEBUG - Context definido:', {
      hasCedente: !!req.context?.cedente,
      hasSoftwareHouse: !!req.context?.softwareHouse,
      cedenteId: req.context?.cedente?.id,
      cedenteCnpj: req.context?.cedente?.cnpj
    });

    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({ message: 'Erro interno na autenticação.' });
  }
};