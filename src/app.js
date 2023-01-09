import path from 'path';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import database from './database';
import routes from './routes';
import config from './config';

// Configure the utils before loading.
database.enableTracing();

// Setup the app.
const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://admin.elitegaming.rpatdev.com/',
      'https://customer.elitegaming.rpatdev.com/',
      'https://tablet.elitegaming.rpatdev.com/',
      'https://staging-elitegame.calj4kdsekpa.us-east-1.rds.amazonaws.com'
    ]
  })
);
app.use('/public', express.static(path.join(__dirname, '../public')));

if (!config.DEBUG) {
  app.set('trust proxy', 1);
  app.use(awsServerlessExpressMiddleware.eventContext());
}

// eslint-disable-next-line global-require
if (config.DEBUG) app.use(require('morgan')('dev'));

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  console.log(err);
  res.locals.messge = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
