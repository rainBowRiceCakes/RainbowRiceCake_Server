/**
 * @file databases/seeders/03dummy-partnser.seeder.js
 * @description partners dummy data create
 * 251219 v1.0.0 wook init
 */
import db from '../../app/models/index.js';
const { Partner } = db;

// 테이블명
// const tableName = 'partners';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up (queryInterface, Sequelize) {
    //레코드 정보
    const partnerCount = 90;

    const records = [];

    for (let i = 71; i <= partnerCount; i++) {
      records.push({
        userId: `${i}`,
        businessNum: `businessNum${i}`,
        krName: 'OO은행',
        enName: 'OOBank',
        manager: '김XX',
        phone: '000-1111-2222',
        status: 'RES',
        logoImg: '로고 이미지경로',
        address: '여긴 어딜까요',
        lat: '33.3456',
        lng: '124.7654'
      });
    }

    // 데이터 생성 : queryInterface.bulkInsert(tableName, records, options)
    // await queryInterface.bulkInsert(tableName, records, {});
    await Partner.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tableName, records, options)
    // await queryInterface.bulkDelete(tableName, null, {});
    await Partner.destroy();
  }
};