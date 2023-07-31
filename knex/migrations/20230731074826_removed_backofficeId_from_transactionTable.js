/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  if (knex.schema.hasTable('transactions')) {
    await knex.schema.alterTable('transactions', function (table) {
      table.dropColumn('back_office_id');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
