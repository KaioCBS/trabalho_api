// src/controllers/protocoloController.js
const Joi = require('joi');
const protocoloService = require('../services/protocoloservice');

/**
 * Validação de datas e filtros conforme PDF:
 * - start_date e end_date obrigatórios (YYYY-MM-DD)
 * - start_date <= end_date
 * - intervalo máximo: 31 dias
 */
function validateDates(start_date, end_date) {
  const s = new Date(start_date);
  const e = new Date(end_date);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) {
    return 'Datas inválidas. Use YYYY-MM-DD.';
  }
  if (s > e) return 'start_date não pode ser maior que end_date.';
  const diffMs = e.getTime() - s.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  if (diffDays > 31) return 'Intervalo máximo permitido é de 31 dias.';
  return null;
}

const listSchema = Joi.object({
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
  product: Joi.string().valid('boleto', 'pagamento', 'pix').optional(),
  id: Joi.array().items(Joi.string()).optional(),
  kind: Joi.string().optional(),
  type: Joi.string().optional(),
});

async function listProtocolos(req, res) {
  const { error, value } = listSchema.validate(req.query, { abortEarly: false });
  if (error) {
    return res.status(422).json({ message: 'Validation failed', details: error.details.map(d => d.message) });
  }

  const dateErr = validateDates(value.start_date, value.end_date);
  if (dateErr) return res.status(422).json({ message: dateErr });

  try {
    const rows = await protocoloService.listProtocolos({
      start_date: value.start_date,
      end_date: value.end_date,
      product: value.product,
      id: value.id,
      kind: value.kind,
      type: value.type,
    });
    return res.json({ count: rows.length, data: rows });
  } catch (err) {
    console.error('listProtocolos error', err);
    return res.status(400).json({ message: 'Erro na listagem de protocolos.' });
  }
}

async function getProtocolo(req, res) {
  const uuid = req.params.uuid;
  if (!uuid) return res.status(400).json({ message: 'UUID obrigatório.' });

  try {
    const row = await protocoloService.getProtocoloByUuid(uuid);
    if (!row) return res.status(400).json({ message: 'Protocolo não encontrado.' });
    return res.json(row);
  } catch (err) {
    console.error('getProtocolo error', err);
    return res.status(400).json({ message: 'Erro ao consultar protocolo.' });
  }
}

module.exports = { listProtocolos, getProtocolo };
