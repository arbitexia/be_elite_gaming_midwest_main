/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('campaign_histories', (table) => {
    table.increments('id').primary();
    table
      .integer('campaign_id')
      .references('campaigns.id')
      .onDelete('CASCADE')
      .deferrable('deferred');
    table.string('message_id');
    table.integer('victim_id');
    table.enu(
      'model',
      [
        'ASSET',
        'GALLERY',
        'LOCATION',
        'POINT',
        'PRODUCT',
        'ROLE',
        'USE_LOCATION',
        'USER',
        'VERIFICATION',
        'EMAIL_TEMPLATE',
        'REWARD',
        'TRANSACTION',
        'TABLET'
      ],
      { useNative: true, enumName: 'campaign_history_model' }
    );
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('campaign_histories');
};
