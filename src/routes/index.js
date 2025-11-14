const express = require('express');
const router = express.Router();

const authHeader = require('../middlewares/authHeader');
const validateRequest = require('../middlewares/validateRequest');
const ReenvioController = require('../controllers/ReenvioController');
const ProtocoloController = require('../controllers/ProtocoloController');
const AuthController = require('../controllers/AuthController');
const Joi = require('joi');

const reenvioSchema = Joi.object({
  product: Joi.string().valid('boleto', 'pagamento', 'pix').required(),
  id: Joi.alternatives().try(
    Joi.array().items(Joi.string()).max(30),
    Joi.string()
  ).required(),
  kind: Joi.string().valid('webhook').required(),
  type: Joi.string().valid('disponivel', 'cancelado', 'pago').required(),
});

// Health Check (Opcional)
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Webhook Reenviador API'
  });
});

// Rota de Login 
router.post('/auth/login', AuthController.login);

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