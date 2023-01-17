const knex = require('knex');
const fs = require('fs');
const path = require('path');

exports.up = async (knex) => {
  const dumpSqlFile = path.resolve(__dirname, '../dump.sql');
  const initialSchema = fs.readFileSync(dumpSqlFile, 'utf-8');
  await knex.raw(initialSchema);
};

exports.down = async (knex) => {
  await knex.schema.dropSchema('public', true);
  await knex.schema.createSchema('public');
};
