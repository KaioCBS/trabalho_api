const Joi = require('joi');

function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(422).json({
        message: 'Validation failed',
        details: error.details.map(d => d.message),
      });
    }
    req.validated = value;
    next();
  };
}

module.exports = { validateBody };
