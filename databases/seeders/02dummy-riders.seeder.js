/**
 * @file databases/seeders/02dummy-riders.seeder.js
 * @description riders dummy data create
 * 251219 v1.0.0 wook init
 */
import db from '../../app/models/index.js';
const { Rider } = db;

// 테이블명
// const tableName = 'riders';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up (queryInterface, Sequelize) {
    //레코드 정보
    const records = [
      {
        userId: 2,
        licenseImg: 'img_path',
        bank: 'OO은행',
        bankNum: 1234567899,
        adress: '보험용 주소입니다',
        phone: '010-1234-5678',
        status: 'res'
      },
      {
        userId: 3,
        licenseImg: 'img_path',
        bank: 'OO은행',
        bankNum: 3123456789,
        adress: '보험용 주소입니다',
        phone: '010-9876-5432',
        status: 'req'
      },
    ];

    // 데이터 생성 : queryInterface.bulkInsert(tableName, records, options)
    // await queryInterface.bulkInsert(tableName, records, {});
    await Rider.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tableName, records, options)
    // await queryInterface.bulkDelete(tableName, null, {});
    await Rider.destroy();
  }
};