const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { sequelize } = require('./models');
const reenvioRoutes = require('./routes/reenvioRoutes');
const { login } = require('./controllers/authController');
const verifyToken = require('./middlewares/jwtAuth');

const app = express();
app.use(cors());
app.use(express.json());

// rota pública de autenticação (gera JWT)
app.post('/auth/login', login);

// rota raiz e health check
app.get('/', (req, res) => res.json({ message: 'Tab API rodando' }));
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ postgres: 'ok' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔐 rotas protegidas com JWT (tudo em /api)
app.use('/api', verifyToken, reenvioRoutes);

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
