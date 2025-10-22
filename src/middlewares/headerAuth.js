      const { SoftwareHouse, Cedente } = require('../models'); // ajuste o caminho se necessário

  async function headerAuth(req, res, next) {
    const headers = {
      'cnpj-sh': req.header('cnpj-sh'),
      'token-sh': req.header('token-sh'),
      'cnpj-cedente': req.header('cnpj-cedente'),
      'token-cedente': req.header('token-cedente'),
    };

    if (!headers['cnpj-sh'] || !headers['token-sh'] || !headers['cnpj-cedente'] || !headers['token-cedente']) {
      return res.status(401).json({ message: 'Missing authentication headers' });
    }

    try {
      const sh = await SoftwareHouse.findOne({
        where: { cnpj: headers['cnpj-sh'], token: headers['token-sh'] },
      });
      const ced = await Cedente.findOne({
        where: { cnpj: headers['cnpj-cedente'], token: headers['token-cedente'] },
      });

      if (!sh || !ced) {
        return res.status(401).json({ message: 'Invalid authentication headers' });
      }

      req.softwareHouse = sh;
      req.cedente = ced;
      next();
    } catch (err) {
      console.error('headerAuth error', err);
      return res.status(500).json({ message: 'Internal auth error' });
    }
  }

  module.exports = headerAuth;
