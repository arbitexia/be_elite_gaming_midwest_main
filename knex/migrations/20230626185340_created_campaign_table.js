/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('campaigns', (table) => {
    table.increments('id').primary();
    table.enu(
      'type',
      ['BIRTHDAY', 'APPRECIATION', 'REFERRAL', 'REWARDS', 'WELCOME', 'NEWSLETTER'],
      {
        useNative: true,
        enumName: 'campaign_type'
      }
    );
    table.enu('model', ['AUTO_PILOT', 'ON_DEMAND', 'INFORMATIONAL'], {
      useNative: true,
      enumName: 'campaign_model'
    });
    table.integer('offer').defaultTo(0);
    table.enu('offer_type', ['COUPON', 'POINT'], {
      useNative: true,
      enumName: 'offer_type'
    });
    table.integer('total').defaultTo(0);
    table.integer('redeemed').defaultTo(0);
    table.timestamp('start_date');
    table.timestamp('end_date');
    table.integer('status').defaultTo(0);
    table.integer('channels').defaultTo(0);
    table.timestamp('next_delivery');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('campaigns');
};
