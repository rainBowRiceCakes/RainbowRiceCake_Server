/**
 * @file databases/seeders/04dummy-hotels.seeder.js
 * @description hotels dummy data create
 * 251219 v1.0.0 wook init
 */
import db from '../../app/models/index.js';
const { Hotel } = db;

// 테이블명
// const tableName = 'hotels';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up (queryInterface, Sequelize) {
    //레코드 정보
    const partnerCount = 30;

    const records = [];

    for (let i = 1; i <= partnerCount; i++) {
      records.push({
        krName: 'OO호텔',
        enName: 'OOHotel',
        manager: '지배인',
        phone: '000-3333-5555',
        status: true,
        address: '여긴 어딜까요',
        lat: '34.9012',
        lng: '124.3210'
      });
    }
     


    // 데이터 생성 : queryInterface.bulkInsert(tableName, records, options)
    // await queryInterface.bulkInsert(tableName, records, {});
    await Hotel.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tableName, records, options)
    // await queryInterface.bulkDelete(tableName, null, {});
    await Hotel.destroy();
  }
};