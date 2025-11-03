require('dotenv').config();

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'tra_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tra_api',
  port: process.env.DB_PORT || 5432,
  define: {
    timestamps: true,
    underscored: true,
  },
  logging: false,
};
