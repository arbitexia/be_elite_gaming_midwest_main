/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.table('rewards', (table) => {
    table.integer('point_threshold');
    table.integer('coupon_threshold');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.table('rewards', (table) => {
    table.dropColumn('point_threshold');
    table.dropColumn('coupon_threshold');
  });
};
