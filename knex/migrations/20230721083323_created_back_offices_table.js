/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('back_offices', function (table) {
    table.increments();
    table.integer('coupon');
    table.integer('checkin_threshold');
    table.integer('days');
    table.enu('type', ['FREE', 'MATCH'], {
      useNative: true,
      enumName: 'back_offices_type'
    });
    table.timestamp('expiration_date');
    table.text('code');
    table.integer('status').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('back_offices');
};
