/**
 * @file databases/seeders/dummy-users.seeder.js
 * @description users dummy data create
 * 251217 v1.0.0 wook init
 */
import bcrypt from 'bcrypt';

// 테이블명
const tableName = 'users';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up (queryInterface, Sequelize) {
    //레코드 정보
    const records = [
      {
        email: 'admin@admin.com',
        password: bcrypt.hashSync('qwe12312', 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'dlv@dlv.com',
        password: bcrypt.hashSync('qwe12312', 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'dlv2@dlv2.com',
        password: bcrypt.hashSync('qwe12312', 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'ptn@ptn.com',
        password: bcrypt.hashSync('qwe12312', 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'ptn2@ptn2.com',
        password: bcrypt.hashSync('qwe12312', 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'common@common.com',
        password: await bcrypt.hash('qwe12312', 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'common2@common.com',
        password: await bcrypt.hash('qwe12312', 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'common3@common.com',
        password: await bcrypt.hash('qwe12312', 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'common4@common.com',
        password: await bcrypt.hash('qwe12312', 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'common5@common.com',
        password: await bcrypt.hash('qwe12312', 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'common6@common.com',
        password: await bcrypt.hash('qwe12312', 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // 데이터 생성 : queryInterface.bulkInsert(tableName, records, options)
    await queryInterface.bulkInsert(tableName, records, {});
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tableName, records, options)
    await queryInterface.bulkDelete(tableName, null, {});
  }
};