const { createClient } = require('redis');

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on('error', (err) => console.error('❌ Erro no Redis:', err));
client.on('connect', () => console.log('✅ Redis conectado com sucesso!'));

client.connect();

module.exports = client;
