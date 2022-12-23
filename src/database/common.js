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
  USER: camelCaseString('users'),
  ROLE: camelCaseString('roles'),
  VERIFICATION: camelCaseString('verifications')
};

export const knex = _knex;
