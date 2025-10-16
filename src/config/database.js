const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME || 'tra_api', process.env.DB_USER || 'postgres', process.env.DB_PASS || '123456', {
  host: process.env.DB_HOST || 'tab_postgres',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
