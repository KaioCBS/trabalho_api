const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { sequelize } = require('./models');
const reenvioRoutes = require('./routes/reenvioRoutes');
const { login } = require('./controllers/authController');
const verifyToken = require('./middlewares/jwtAuth');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => res.json({ message: 'Tab API rodando' }));
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ postgres: 'ok' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/auth', authRoutes);

// 🔐 rotas protegidas com JWT (tudo em /api)
app.use('/api', verifyToken, reenvioRoutes);

// reset-database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function resetDatabase() {
  const sequelize = new Sequelize(
    process.env.DB_NAME || 'tra_api',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || '123456',
    {
      host: process.env.DB_HOST || 'tab_postgres',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      dialect: 'postgres',
      logging: console.log,
    }
  );

  try {
    console.log('🔄 Conectando ao banco...');
    await sequelize.authenticate();
    
    console.log('🗑️  Dropando todas as tabelas...');
    await sequelize.query('DROP SCHEMA public CASCADE;');
    await sequelize.query('CREATE SCHEMA public;');
    await sequelize.query('GRANT ALL ON SCHEMA public TO postgres;');
    await sequelize.query('GRANT ALL ON SCHEMA public TO public;');
    
    console.log('✅ Banco resetado com sucesso!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error);
    process.exit(1);
  }
}

resetDatabase();

// inicialização do servidor + sincronização do banco
(async () => {
  try {
    console.log('Conectando ao Postgres...');
    await sequelize.authenticate();
    console.log('✅ Conectado ao Postgres!');
    console.log('Sincronizando database...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database sincronizado!');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server rodando na porta ${PORT}`));
  } catch (err) {
    console.error('❌ Falha ao iniciar o app:', err);
    process.exit(1);
  }
})();


async function startServer() {
  try {
    console.log('Conectando ao Postgres...');
    await sequelize.authenticate();
    console.log('✅ Conectado ao Postgres!');
    console.log('Sincronizando database...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database sincronizado!');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server rodando na porta ${PORT}`));
  } catch (err) {
    console.error('❌ Falha ao iniciar o app:', err);
    process.exit(1);
  }
}

module.exports = app;

if (require.main === module) {
  startServer();
}
