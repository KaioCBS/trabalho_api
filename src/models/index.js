'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/database');

const db = {};

// ✅ Cria a instância do Sequelize corretamente
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    define: config.define,
  }
);

// ✅ Carrega automaticamente todos os models da pasta
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.js') && file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// ✅ Configura associações entre models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ✅ Exporta o objeto completo
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
