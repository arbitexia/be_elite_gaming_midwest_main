/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users');
    table.integer('reward_id').references('id').inTable('rewards');
    table.integer('location_id').references('id').inTable('locations');
    table.integer('assignee_id').references('id').inTable('users');
    table.enu('status', ['WAITING', 'ACCEPTED', 'DECLINED'], {
      useNative: true,
      enumName: 'new_transaction_status'
    });
    table.enu('type', ['POINT', 'COUPON'], {
      useNative: true,
      enumName: 'new_transaction_type'
    });
    table.double('amount');
    table.timestamp('accepted_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  return await knex.schema.dropTable('transactions');
};
