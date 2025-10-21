// src/controllers/reenvioController.js
const Joi = require('joi');
const reenvioService = require('../services/reenvioService');

const schema = Joi.object({
  product: Joi.string().valid('boleto', 'pagamento', 'pix').required(),
  id: Joi.array().items(Joi.string()).min(1).max(30).required(),
  kind: Joi.string().valid('webhook').required(),
  type: Joi.string().valid('disponivel', 'cancelado', 'pago').required(),
});

async function postReenviar(req, res) {
  try {
    const data = req.body;
    // já validado por middleware, mas reafirmar
    const result = await reenvioService.createReenvio(data, req.cedente);
    return res.status(201).json({ protocolo: result.protocolo });
  } catch (err) {
    if (err && err.status) {
      return res.status(err.status).json({ message: err.message, details: err.mismatched || null });
    }
    console.error('postReenviar error', err);
    return res.status(400).json({ message: 'Não foi possível gerar a notificação. Tente novamente mais tarde.' });
  }
}

module.exports = { postReenviar, schema };
