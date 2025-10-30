const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware para tratar JSON
app.use(bodyParser.json());

// Rotas principais
app.use('/api', routes);

// Middleware global de tratamento de erros
app.use(errorHandler);

module.exports = app;
