exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('users').insert([
        {
          first_name: 'Super',
          last_name: 'Admin',
          user_name: 'SuperAdmin',
          email: 'test@test.com',
          phone: '123456789',
          password: '$2b$10$amOEwtLSqh9HI2AQX6M.MerTBz1SaGH6FlnhUlxlTF0mlprdoHaYK',
          birthday: '1991/1/11',
          status: 'ACTIVATED',
          role_id: 5,
          created_at: new Date()
        }
      ])
    );
};
