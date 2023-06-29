/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.table('logs', (table) => {
    table.enu(
      'log_model',
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
        'TABLET',
        'CAMPAIGN'
      ],
      { useNative: true, enumName: 'updated_log_model' }
    );
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.table('logs', (table) => {
    table.dropColumn('log_model');
  });
};
