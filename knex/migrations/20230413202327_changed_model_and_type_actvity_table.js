/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  if (knex.schema.hasTable('activities')) {
    await knex.schema.table('activities', (table) => {
      table.dropColumn('model');
      table.dropColumn('type');
    });
    await knex.schema.table('activities', function (table) {
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
        { useNative: true, enumName: 'update_request_model' }
      );
      table.enu(
        'type',
        [
          'CREATE',
          'UPDATE',
          'DELETE',
          'CHECKIN',
          'SIGNUP',
          'LOGIN',
          'GET',
          'VIEW',
          'REQUEST',
          'ACCEPT',
          'DECLINE'
        ],
        {
          useNative: true,
          enumName: 'update_request_type'
        }
      );
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.table('activities', (table) => {
    table.dropColumn('model');
    table.dropColumn('type');
  });
};
