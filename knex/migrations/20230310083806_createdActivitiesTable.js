/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = async function (knex) {
  await knex.schema.createTable('activities', (table) => {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users');
    table.integer('victim_id');
    table.enu(
      'model',
      [
        'ASSET',
        'AWARD',
        'GALLERY',
        'LOCATION',
        'POINT',
        'PRODUCT',
        'ROLE',
        'USE_LOCATION',
        'USER',
        'VERIFICATION',
        'EMAIL_TEMPLATE'
      ],
      { useNative: true, enumName: 'activity_model' }
    );
    table.enu('type', ['CREATE', 'UPDATE', 'DELETE', 'AUTH'], {
      useNative: true,
      enumName: 'request_type'
    });
    table.jsonb('metadata');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('activities');
};
