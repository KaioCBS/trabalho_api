const ProtocoloService = require('../services/ProtocoloService');

class ProtocoloController {
  static async listar(req, res, next) {
    try {
      const protocolos = await ProtocoloService.listar(req.query);
      return res.status(200).json(protocolos);
    } catch (error) {
      next(error);
    }
  }

  static async buscar(req, res, next) {
    try {
      const protocolo = await ProtocoloService.buscar(req.params.uuid);
      return res.status(200).json(protocolo);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProtocoloController;
