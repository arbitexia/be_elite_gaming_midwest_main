import knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import config from '@/config';

let dbConfig;

if (global.DB_JSON) {
  dbConfig = JSON.parse(global.DB_JSON);
} else {
  dbConfig = {
    client: 'pg',
    connection: {
      host: config.DB_HOST,
      port: config.DB_PORT,
      database: config.DB_NAME,
      password: config.DB_PASSWORD,
      user: config.DB_USER
    },
    pool: {
      min: parseInt(config.DB_MIN_POOL || 2, 10),
      max: parseInt(config.DB_MAX_POOL || 10, 10)
    }
  };
}

export default knex({
  ...dbConfig,
  ...knexSnakeCaseMappers()
});
