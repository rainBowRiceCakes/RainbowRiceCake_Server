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
    const records = [
      // ===== req =====
      {
        riderId: null, partnerId: 1, hotelId: 1,
        email: 'email', name: '정XX',
        price: 5000, cntS: 1,
        status: 'req'
      },
      {
        riderId: null, partnerId: 2, hotelId: 2,
        email: 'email', name: '정XX',
        price: 8000, cntM: 1,
        status: 'req'
      },
      {
        riderId: null, partnerId: 2, hotelId: 1,
        email: 'email', name: '정XX',
        price: 12000, cntL: 1,
        status: 'req'
      },

      // ===== mat =====
      {
        riderId: 1, partnerId: 1, hotelId: 2,
        driverId: 1,
        email: 'email', name: '정XX',
        price: 9000, cntS: 1,
        status: 'mat'
      },
      {
        riderId: 1, partnerId: 2, hotelId: 1,
        email: 'email', name: '정XX',
        price: 14000, cntM: 2,
        status: 'mat'
      },
      {
        riderId: 1, partnerId: 2, hotelId: 2,
        driverId: 1,
        email: 'email', name: '정XX',
        price: 16000, cntS: 1, cntM: 1,
        status: 'mat'
      },

      // ===== pick =====
      {
        riderId: 1, partnerId: 1, hotelId: 1,
        driverId: 2,
        email: 'email', name: '정XX',
        price: 18000, cntL: 2,
        status: 'pick'
      },
      {
        riderId: 2, partnerId: 2, hotelId: 2,
        driverId: 1,
        email: 'email', name: '정XX',
        price: 13000, cntS: 1, cntM: 1,
        status: 'pick'
      },

      // ===== com =====
      {
        riderId: 2, partnerId: 2, hotelId: 2,
        driverId: 2,
        email: 'email', name: '정XX',
        price: 20000, cntL: 2,
        status: 'com'
      },
      {
        riderId: 1, partnerId: 1, hotelId: 1,
        driverId: 1,
        email: 'email', name: '정XX',
        price: 15000, cntM: 2,
        status: 'com'
      },
      {
        riderId: 2, partnerId: 1, hotelId: 1,
        driverId: 1,
        email: 'email', name: '정XX',
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'com'
      }
    ];

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