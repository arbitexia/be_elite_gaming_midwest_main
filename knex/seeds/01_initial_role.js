exports.seed = async (knex) => {
  // Deletes ALL existing entries
  return knex('roles')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('roles').insert([
        {
          name: 'Guest',
          short_code: 'GUEST',
          created_at: new Date()
        },
        {
          name: 'Customer',
          short_code: 'USER',
          created_at: new Date()
        },
        {
          name: 'Tablet',
          short_code: 'TABLET',
          created_at: new Date()
        },
        {
          name: 'Administrator',
          short_code: 'ADMIN',
          created_at: new Date()
        },
        {
          name: 'Super Admin',
          short_code: 'SUPER',
          created_at: new Date()
        }
      ])
    );
};
