const { createReenvio } = require('../services/reenvioService');

async function postReenviar(req, res) {
  try {
    const payload = req.body;
    // validation inside service will throw with .status
    const result = await createReenvio(payload, { cedente: req.cedente || null });
    return res.status(201).json({ protocolo: result.protocolo });
  } catch (err) {
    console.error('❌ Erro no postReenviar:', err);
    const status = err.status || 500;
    const message = err.message || 'Erro interno no reenvio.';
    return res.status(status).json({ message });
  }
}

module.exports = { postReenviar };
