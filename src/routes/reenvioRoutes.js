// src/routes/reenvioRoutes.js
const express = require('express');
const router = express.Router();
const { postReenviar, schema: reenvioSchema } = require('../controllers/reenvioController');
const { listProtocolos, getProtocolo } = require('../controllers/protocoloController');
const { validateBody } = require('../middlewares/validation');
const headerAuth = require('../middlewares/headerAuth');

// Reenvio
router.post('/reenviar', headerAuth, validateBody(reenvioSchema), postReenviar);

// Listagem de protocolos
// Ex: GET /protocolo?start_date=2025-10-01&end_date=2025-10-15&product=boleto
router.get('/protocolo', headerAuth, listProtocolos);

// Consulta individual
router.get('/protocolo/:uuid', headerAuth, getProtocolo);

module.exports = router;
