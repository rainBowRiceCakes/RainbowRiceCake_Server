/**
 * @file databases/seeders/05dummy-orders.seeder.js
 * @description orders dummy data create
 * 251219 v1.0.0 wook init
 */
import db from '../../app/models/index.js';
const { Order } = db;

// 테이블명
// const tableName = 'hotels';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up(queryInterface, Sequelize) {
    //레코드 정보
    const records = []

    const reqCount = 5
    const matchCount = 10
    const pickCount = 15
    const comCount = 20
    for (let i = 1; i <= reqCount; i++) {
      records.push({
        riderId: null, partnerId: i, hotelId: i,
        orderCode: 2026010454321+i,
        email: 'email@email.com', name: '정XX',
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'req'
      });
    }

    for (let i = 6; i <= matchCount; i++) {
      records.push({
        riderId: i, partnerId: i, hotelId: i,
        orderCode: 2026010454321+i,
        email: 'email@email.com', name: '정XX',
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'mat'
      });
    }

    for (let i = 11; i <= pickCount; i++) {
      records.push({
        riderId: i, partnerId: i, hotelId: i,
        orderCode: 2026010454321+i,
        email: 'email@email.com', name: '정XX',
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'pick'
      });
    }

    for (let i = 16; i <= comCount; i++) {
      records.push({
        riderId: i, partnerId: i, hotelId: i,
        orderCode: 2026010454321+i,
        email: 'email@email.com', name: '정XX',
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'com'
      });
    }

    // 데이터 생성 : queryInterface.bulkInsert(tableName, records, options)
    // await queryInterface.bulkInsert(tableName, records, {});
    await Order.bulkCreate(records);
  },

  async down(queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tableName, records, options)
    // await queryInterface.bulkDelete(tableName, null, {});
    await Order.destroy();
  }
};