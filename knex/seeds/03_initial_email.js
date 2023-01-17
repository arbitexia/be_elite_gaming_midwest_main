const { loadEmailTemplateCSV } = require('../utils');

exports.seed = async (knex) => {
  const data = await loadEmailTemplateCSV();
  const insertData = data.map((el) => ({
    ...el,
    created_at: new Date()
  }));

  return knex('email_templates')
    .del()
    .then(function () {
      return knex('email_templates').insert(insertData);
    });
};
