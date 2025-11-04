export default {
  secret: process.env.JWT_SECRET || 'supersecret-chave-jwt',
  expiresIn: '1d',
};
