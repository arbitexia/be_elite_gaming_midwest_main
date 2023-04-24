/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.table('hash_codes', (table) => {
    table.dropColumn('model');
  });
  await knex.schema.table('hash_codes', (table) => {
    table.enu(
      'model',
      [
        'ACTIVITY',
        'USER',
        'CONFIG',
        'EMAIL_TEMPLATE',
        'ASSET',
        'GALLERY',
        'LOCATION',
        'POINT',
        'PRODUCT',
        'ROLE',
        'USE_LOCATION',
        'TABLET',
        'VERIFICATION',
        'REWARD',
        'TRANSACTION'
      ],
      {
        useNative: true,
        enumName: 'hash_code_model'
      }
    );
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.table('hash_codes', (table) => {
    table.dropColumn('model');
  });
};
