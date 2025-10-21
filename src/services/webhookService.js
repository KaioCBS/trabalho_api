const axios = require('axios');
require('dotenv').config();

/**
 * Envia os dados de notificação simulando um webhook externo.
 * Retorna true em sucesso, ou lança erro em falha.
 */
async function enviarWebhook(payload, headers = {}) {
  const url = process.env.WEBHOOK_URL;
  if (!url) {
    console.warn('⚠️ WEBHOOK_URL não configurado no .env');
    return false;
  }

  try {
    const res = await axios.post(url, payload, { headers });
    console.log(`✅ Webhook enviado com sucesso (${res.status})`);
    return true;
  } catch (err) {
    console.error('❌ Falha ao enviar webhook:', err.message);
    throw new Error('Falha ao enviar webhook para destino.');
  }
}

module.exports = { enviarWebhook };
