module.exports = (error, req, res, next) => {
  console.error('🔥 Erro capturado pelo middleware global:', error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(error.status || 500).json({
    message: error.message || 'Erro interno no servidor.',
  });
};
