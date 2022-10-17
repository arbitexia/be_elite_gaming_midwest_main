export default {
  DEBUG: process.env.NODE_ENV !== 'production',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  PORT: process.env.POORT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_USER: process.env.DB_USER
};
