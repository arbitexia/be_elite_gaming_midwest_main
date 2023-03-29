/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('tablets', (table) => {
    table.increments('id').primary();
    table.text('name');
    table.text('password');
    table.integer('location_id').references('id').inTable('locations');
    table.enu('status', ['ACTIVATED', 'DISABLED', 'ARCHIVED', 'VERIFY_PHONE', 'VERIFY_EMAIL'], {
      useNative: true,
      enumName: 'tablet_status'
    });
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('tablets');
};
