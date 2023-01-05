require('dotenv').config();

export default {
  DEBUG: process.env.NODE_ENV !== 'production',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  FRONTEND_URL: process.env.FRONTEND_URL,
  APP_SECRET: process.env.APP_SECRET,
  PORT: process.env.POORT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_USER: process.env.DB_USER,
  AWS: {
    REGION: process.env.REGION,
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    ACCESS_SECRET_KEY: process.env.AWS_ACCESS_SECRET_KEY,
    SES: {
      SUPPORT_EMAIL: process.env.SUPPORT_EMAIL
    },
    S3_ASSET_BUCKET: process.env.S3_ASSET_BUCKET
  },
  TWILLIO: {
    ACCOUNT_SID: process.env.TWILLIO_ACCOUNT_SID,
    AUTH_TOKEN: process.env.TWILLIO_AUTH_TOKEN,
    MESSAGE_SID: process.env.TWILLIO_MESSAGE_SID
  }
};
