require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'tab_db',
    host: process.env.DB_HOST || 'tab_postgres',
    dialect: 'postgres',
    logging: false
  }
};
