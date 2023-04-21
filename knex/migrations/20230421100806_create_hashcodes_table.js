/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return knex.schema.createTable('hash_codes', function (table) {
    table.increments();
    table.text('name');
    table.text('model');
    table.text('field');
    table.text('description');
    table.enu('status', ['PENDING', 'PUBLISHED', 'ARCHIVED'], {
      useNative: true,
      enumName: 'hash_code_status'
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
  return knex.schema.dropTable('hash_codes');
};
