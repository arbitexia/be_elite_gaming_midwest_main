/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  if (knex.schema.hasTable('activities')) {
    await knex.schema.table('activities', function (table) {
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
          'EMAIL_TEMPLATE',
          'REWARD'
        ],
        { useNative: true, enumName: 'activity_model_new' }
      );
      table.enu(
        'type',
        ['CREATE', 'UPDATE', 'DELETE', 'CHECKIN', 'SIGNUP', 'LOGIN', 'GET', 'VIEW'],
        {
          useNative: true,
          enumName: 'request_type_new'
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
