/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.table('email_templates', (table) => {
    table.dropColumn('use_for');
    table.dropColumn('body');
    table.enu('status', ['PENDING', 'PUBLISHED', 'ARCHIVED'], {
      useNative: true,
      enumName: 'email_template_status'
    });
    table.enu('type', ['DEFAULT', 'DYNAMIC'], {
      useNative: true,
      enumName: 'email_template_type'
    });
    table.text('attached_files');
    table.text('html_body');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.table('email_templates', (table) => {
    table.dropColumn('status');
    table.dropColumn('type');
    table.dropColumn('attached_files');
  });
};
