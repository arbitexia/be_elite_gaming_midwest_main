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
          email: 'super_admin@elitegame.com',
          phone: '',
          password: '$2b$10$amOEwtLSqh9HI2AQX6M.MerTBz1SaGH6FlnhUlxlTF0mlprdoHaYK',
          birthday: '1991/1/11',
          status: 'ACTIVATED',
          role_id: 5,
          created_at: new Date()
        },
        {
          first_name: 'Tablet',
          last_name: 'User',
          user_name: 'TabletUser',
          email: 'tablet@elitegame.com',
          phone: '',
          password: '$2b$10$amOEwtLSqh9HI2AQX6M.MerTBz1SaGH6FlnhUlxlTF0mlprdoHaYK',
          birthday: '1991/1/11',
          status: 'ACTIVATED',
          role_id: 3,
          created_at: new Date()
        },
        {
          first_name: 'Customer',
          last_name: 'User',
          user_name: 'CustomerUser',
          email: 'customer@elitegame.com',
          phone: '1112223333',
          password: '$2b$10$amOEwtLSqh9HI2AQX6M.MerTBz1SaGH6FlnhUlxlTF0mlprdoHaYK',
          birthday: '1991/1/11',
          status: 'ACTIVATED',
          role_id: 2,
          created_at: new Date()
        }
      ])
    );
};
