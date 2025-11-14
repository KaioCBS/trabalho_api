const jwt = require('jsonwebtoken');
const { SoftwareHouse, Cedente } = require('../models');
const jwtSecret = process.env.JWT_SECRET || 'supersecret-chave-jwt';

module.exports = {
  async login(req, res) {
    try {
      const { cnpj, token, tipo } = req.body;

      if (!cnpj || !token || !tipo) {
        return res.status(400).json({ message: 'Informe cnpj, token e tipo (sh ou cedente).' });
      }

      let user;

      if (tipo === 'sh') {
        user = await SoftwareHouse.findOne({ where: { cnpj, token, status: 'ativo' } });
      } else if (tipo === 'cedente') {
        user = await Cedente.findOne({ where: { cnpj, token, status: 'ativo' } });
      } else {
        return res.status(400).json({ message: 'Tipo inválido. Use "sh" ou "cedente".' });
      }

      if (!user) {
        return res.status(401).json({ message: 'CNPJ ou token inválidos.' });
      }

      const payload = {
        id: user.id,
        cnpj: user.cnpj,
        tipo,
      };

      const tokenJwt = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });

      return res.status(200).json({
        message: 'Login realizado com sucesso.',
        token: tokenJwt,
      });
    } catch (error) {
      console.error('Erro no AuthController.login:', error);
      return res.status(500).json({ message: 'Erro interno no login.' });
    }
  },
};
