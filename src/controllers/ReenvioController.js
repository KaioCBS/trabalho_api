const ReenvioService = require('../services/ReenvioService');

class ReenvioController {
  static async reenviar(req, res, next) {
    try {
      const result = await ReenvioService.reenviar(req.body, req.context);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReenvioController;
