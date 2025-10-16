const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Tab API rodando' }));
app.get('/health', async (req, res) => {
  try { await sequelize.authenticate(); res.json({ postgres: 'ok' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

(async () => {
  try {
    console.log('Conectando ao Postgres...');
    await sequelize.authenticate();
    console.log(' Connectado ao Postgres!');
    console.log('Sincronizando database...');
    await sequelize.sync({ alter: true });
    console.log(' Database sincado!');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server rodando da porta ${PORT}`));
  } catch (err) {
    console.error('Falha ao startar o app:', err);
    process.exit(1);
  }
})();