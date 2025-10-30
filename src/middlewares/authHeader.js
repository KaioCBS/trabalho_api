const { SoftwareHouse, Cedente } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const {
      'cnpj-sh': cnpjSh,
      'token-sh': tokenSh,
      'cnpj-cedente': cnpjCedente,
      'token-cedente': tokenCedente,
    } = req.headers;

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
      where: { cnpj: cnpjCedente, token: tokenCedente, status: 'ativo', softwarehouse_id: softwareHouse.id },
    });

    if (!cedente) {
      return res.status(401).json({ message: 'Cedente não autenticado.' });
    }

    // Armazena no request para uso posterior
    req.context = { softwareHouse, cedente };

    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({ message: 'Erro interno na autenticação.' });
  }
};
