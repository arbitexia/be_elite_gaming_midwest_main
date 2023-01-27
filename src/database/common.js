import camelCaseString from 'lodash/camelCase';
import _knex from './knex';

export function transaction(fn) {
  return _knex.transaction(fn);
}

export function withTransaction(opts, fn) {
  if (opts && opts.transaction) {
    return fn(opts);
  }
  return transaction((trx) => fn({ ...opts, transaction: trx }));
}

export function queryBuilder(tableName, opts) {
  const trx = opts && opts.transaction;
  const builder = trx ? trx(tableName) : _knex(tableName);
  if (opts && opts.forUpdate) {
    return builder.forUpdate();
  }
  return builder;
}

export const Table = {
  ASSET: camelCaseString('assets'),
  GALLERY: camelCaseString('gallery'),
  USER: camelCaseString('users'),
  ROLE: camelCaseString('roles'),
  EMAIL_TEMPLATE: camelCaseString('email_templates'),
  VERIFICATION: camelCaseString('verifications'),
  LOCATION: camelCaseString('locations'),
  USER_LOCATION: camelCaseString('user_locations'),
  POINT: camelCaseString('points')
};

export const knex = _knex;
