import 'core-js/stable';
import 'regenerator-runtime/runtime';
import config from './config';
import app from './app';

if (config.DEBUG) {
  const port = config.PORT || 8080;
  const server = app.listen(port, async () => {
    try {
      console.info(`Service is listening on port: ${port}`);
    } catch (error) {
      console.error(error);
    }
  });

  // Handle nodemon shutdown cleanly, otherwise the port might not
  // be freed before we start up again.
  process.once('SIGUSR2', () => {
    console.warn('Got SIGUSR2, shutting down...');
    server.close(() => {
      console.warn('Server shut down, exiting.');
      process.exit();
    });
  });
}

process.on('uncaughtException', (ex) => {
  console.error(ex);
  process.exit(1);
});

export default app;
