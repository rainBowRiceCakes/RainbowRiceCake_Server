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
    const records = [
      {
        krName: 'OO호텔',
        enName: 'OOHotel',
        manager: '김 지배인',
        phone: '000-1111-1111',
        status: true,
        address: '여긴 어딜까요',
        lat: '56.7890',
        lng: '32.1098'
      },
      {
        krName: 'OO호텔',
        enName: 'OOHotel',
        manager: '양 지배인',
        phone: '000-3333-5555',
        status: false,
        address: '여긴 어딜까요',
        lat: '78.9012',
        lng: '54.3210'
      },
    ];

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