/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  if (knex.schema.hasTable('activities')) {
    await knex.schema.alterTable('activities', function (table) {
      table.dropColumn('model');
      table.dropColumn('type');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
