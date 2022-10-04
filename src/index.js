import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { logHelper } from '@/helpers';
import config from '@/config';
import app from './app';

const DEBUG = config.NODE_ENV === 'development';

if (DEBUG) {
  const port = config.PORT || 8000;
  const server = app.listen(port, async () => {
    try {
      logHelper.info(`Service is listening on port: ${port}`);
    } catch (error) {
      logHelper.error(error);
    }
  });

  // Handle nodemon shutdown cleanly, otherwise the port might not
  // be freed before we start up again.
  process.once('SIGUSR2', () => {
    logHelper.warn('Got SIGUSR2, shutting down...');
    server.close(() => {
      logHelper.warn('Server shut down, exiting.');
      process.exit();
    });
  });
}

process.on('uncaughtException', (ex) => {
  logHelper.error(ex);
  process.exit(1);
});

export default app;
