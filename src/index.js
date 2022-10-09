import 'core-js/stable';
import 'regenerator-runtime/runtime';
import logger from 'pino';
import config from '@/config';
import app from './app';

if (config.DEBUG) {
  const port = config.PORT || 8080;
  const server = app.listen(port, async () => {
    try {
      logger.info(`Service is listening on port: ${port}`);
    } catch (error) {
      logger.error(error);
    }
  });

  // Handle nodemon shutdown cleanly, otherwise the port might not
  // be freed before we start up again.
  process.once('SIGUSR2', () => {
    logger.warn('Got SIGUSR2, shutting down...');
    server.close(() => {
      logger.warn('Server shut down, exiting.');
      process.exit();
    });
  });
}

process.on('uncaughtException', (ex) => {
  logger.error(ex);
  process.exit(1);
});

export default app;
