export default {
  DEBUG: process.env.NODE_ENV !== 'production',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  PORT: process.env.POORT
};
