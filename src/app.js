const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(bodyParser.json());

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;
