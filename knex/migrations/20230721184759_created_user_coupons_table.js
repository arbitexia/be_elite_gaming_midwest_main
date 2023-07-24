/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('user_coupons', function (table) {
    table.increments();
    table.integer('user_id').references('id').inTable('users');
    table.integer('amount').defaultTo(0);
    table.enu('type', ['FREE', 'MATCH'], {
      useNative: true,
      enumName: 'user_coupon_type'
    });
    table.text('code');
    table.timestamp('expiration_date');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('user_coupons');
};
