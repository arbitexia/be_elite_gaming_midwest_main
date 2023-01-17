import { logHelper } from '@/helpers';
import { knex, Table, transaction } from './common';

let tracingEnabled = false;
function enableTracing() {
  if (!tracingEnabled) {
    knex.on('query', ({ sql, bindings }) => console.log(sql)); //logHelper.trace(sql, bindings));
  }
  tracingEnabled = true;
}

export default {
  knex,
  enableTracing,
  transaction,
  Table
};
