/**
 * @file databases/seeders/01dummy-users.seeder.js
 * @description users dummy data create
 * 251217 v1.0.0 wook init
 */
import db from '../../app/models/index.js';
const { User } = db;

// 테이블명
// const tableName = 'users';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up (queryInterface, Sequelize) {
    //레코드 정보
    const records = [
      {
        email: 'admin@admin.com',
        name: '테스트',
      },
      {
        email: 'dlv@dlv.com',
        name: '김기사',
      },
      {
        email: 'dlv2@dlv2.com',
        name: '박기사',
      },
      {
        email: 'ptn@ptn.com',
        name: '매니저1',
      },
      {
        email: 'ptn2@ptn2.com',
        name: '매니저2',
      },
      {
        email: 'common@common.com',
        name: '유저1',
      },
      {
        email: 'common2@common.com',
        name: '유저2',
      },
      {
        email: 'common3@common.com',
        name: '유저3',
      },
      {
        email: 'common4@common.com',
        name: '유저4',
      },
      {
        email: 'common5@common.com',
        name: '유저5',
      },
      {
        email: 'common6@common.com',
        name: '유저6',
      },
    ];

    // 데이터 생성 : queryInterface.bulkInsert(tableName, records, options)
    // await queryInterface.bulkInsert(tableName, records, {});
    await User.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tableName, records, options)
    // await queryInterface.bulkDelete(tableName, null, {});
    await User.destroy();
  }
};