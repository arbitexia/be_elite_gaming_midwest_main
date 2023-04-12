/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.table('rewards', (table) => {
    table.integer('point');
    table.integer('coupon');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.table('rewards', (table) => {
    table.dropColumn('point');
    table.dropColumn('coupon');
  });
};
