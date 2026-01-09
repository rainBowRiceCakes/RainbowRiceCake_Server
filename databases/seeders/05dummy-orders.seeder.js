/**
 * @file databases/seeders/05dummy-orders.seeder.js
 * @description orders dummy data create
 * 251219 v1.0.0 wook init
 */
import { faker } from '@faker-js/faker';
import db from '../../app/models/index.js';
const { Order } = db;

// 테이블명
// const tableName = 'hotels';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up(queryInterface, Sequelize) {
    const getRandomInRange = (min, max) =>
      Math.random() * (max - min) + min;

    const start = new Date('2025-12-01T00:00:00');
    const end = new Date('2025-12-31T23:59:59');

    //레코드 정보
    const records = []
    
    const reqCount = 100
    const matchCount = 100
    const pickCount = 100
    const comCount = 100
    for (let i = 1; i <= reqCount; i++) {
      const randomNum = getRandomInRange(1, 50);
      const randomDate = faker.date.between(start, end);
      records.push({
        riderId: null, partnerId: randomNum, hotelId: randomNum,
        orderCode: 2026010454321+i,
        email: 'email@email.com', name: faker.person.fullName(),
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'req',
        createAt: randomDate,
      });
    }
    
    for (let i = 1; i <= matchCount; i++) {
      const randomNum = getRandomInRange(1, 50);
      const randomDate = faker.date.between(start, end);
      records.push({
        riderId: randomNum, partnerId: randomNum, hotelId: randomNum,
        orderCode: 2026010454321+i,
        email: 'email@email.com', name: '정XX',
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'mat',
        createAt: randomDate,
      });
    }
    
    for (let i = 1; i <= pickCount; i++) {
      const randomNum = getRandomInRange(1, 50);
      const randomDate = faker.date.between(start, end);
      records.push({
        riderId: randomNum, partnerId: randomNum, hotelId: randomNum,
        orderCode: 2026010454321+i,
        email: 'email@email.com', name: '정XX',
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'pick',
        createAt: randomDate,
      });
    }
    
    for (let i = 1; i <= comCount; i++) {
      const randomNum = getRandomInRange(1, 50);
      const randomDate = faker.date.between(start, end);
      records.push({
        riderId: randomNum, partnerId: randomNum, hotelId: randomNum,
        orderCode: 2026010454321+i,
        email: 'email@email.com', name: '정XX',
        price: 22000, cntS: 1, cntM: 1, cntL: 1,
        status: 'com',
        createAt: randomDate,
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