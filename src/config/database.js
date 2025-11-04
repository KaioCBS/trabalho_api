require('dotenv').config();

// Config para desenvolvimento LOCAL (fora do Docker)
const isDocker = process.env.INSIDE_DOCKER !== 'true';

module.exports = {
  dialect: 'postgres',
  host: isDocker ? 'db' : 'localhost', // 'db' dentro do Docker, 'localhost' fora
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tra_api',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  define: {
    timestamps: true,
    underscored: true,
  },
  logging: false,
};