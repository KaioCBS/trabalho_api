const express = require('express');
const router = express.Router();

const authHeader = require('../middlewares/authHeader');
const validateRequest = require('../middlewares/validateRequest');
const ReenvioController = require('../controllers/ReenvioController');
const ProtocoloController = require('../controllers/ProtocoloController');
const Joi = require('joi');

// Schema de validação (para POST /reenviar)
const reenvioSchema = Joi.object({
  product: Joi.string().valid('boleto', 'pagamento', 'pix').required(),
  id: Joi.array().items(Joi.string()).max(30).required(),
  kind: Joi.string().valid('webhook').required(),
  type: Joi.string().valid('disponivel', 'cancelado', 'pago').required(),
});

// Rota de Reenvio
router.post('/reenviar',
  authHeader,
  validateRequest(reenvioSchema),
  ReenvioController.reenviar
);

// Rota de listagem de protocolos
router.get('/protocolo', authHeader, ProtocoloController.listar);

// Rota de consulta individual
router.get('/protocolo/:uuid', authHeader, ProtocoloController.buscar);

module.exports = router;
