'use strict';
const uuid = require('uuid')

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuid.v4(),
          phone_number: '0347334836',
          username: '0347334836',
          user_fullname: 'Nguyen Ngoc Tu',
          email: 'abc@gmail.com',
          password: '$2a$12$03dpaQkuS.ppSAEnzIBes.2sOFCfvxZ40NgLPcaQ1SEPaXctM9Edi',
          user_type: 'employee',
          country_code: '+84',
          count_verify: 0,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid.v4(),
          phone_number: '0394712245',
          username: '0394712245',
          user_fullname: 'Tran Tri Dung',
          email: 'abc1@gmail.com',
          password: '$2a$12$03dpaQkuS.ppSAEnzIBes.2sOFCfvxZ40NgLPcaQ1SEPaXctM9Edi',
          user_type: 'employee',
          country_code: '+84',
          count_verify: 0,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid.v4(),
          phone_number: '0969866406',
          username: '0969866406',
          user_fullname: 'Nguyen Hoang Phuong',
          email: 'abc123@gmail.com',
          password: '$2a$12$03dpaQkuS.ppSAEnzIBes.2sOFCfvxZ40NgLPcaQ1SEPaXctM9Edi',
          user_type: 'employee',
          count_verify: 0,
          country_code: '+84',
          created_at: new Date(),
          updated_at: new Date()
        },
      ],
      {
        returning: true,
      }
    )
    .then((users) => {
      queryInterface.bulkInsert(
        'employees',
        [
          {
            id: uuid.v4(),
            user_id: users[0].id,
            role_id: 1,
            status: 0,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: uuid.v4(),
            user_id: users[1].id,
            role_id: 1,
            status: 0,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: uuid.v4(),
            user_id: users[2].id,
            role_id: 1,
            status: 0,
            created_at: new Date(),
          updated_at: new Date()
          },
        ]
      )
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employees', null, {})
  }
};
