/**
 * @file databases/seeders/01dummy-users.seeder.js
 * @description users dummy data create
 * 251217 v1.0.0 wook init
 */
import { faker } from '@faker-js/faker';
import db from '../../app/models/index.js';
const { User } = db;
faker.locale = 'ko';
// 테이블명
// const tableName = 'users';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up (queryInterface, Sequelize) {
    //레코드 정보
    const records = [];

    const userCount = 50;    // 일반 유저 수
    const riderCount = 50;   // 라이더 수
    const partnerCount = 50; // 파트너 수

    // 1. 일반 유저 (User) 생성
    // 생성 예시: user1@email.com, user2@email.com ...
    for (let i = 1; i <= userCount; i++) {
      records.push({
        email: `user${i}@email.com`,
        name: faker.person.fullName(),
        // role: 'USER', // DB에 role 컬럼이 있다면 주석 해제 후 사용
      });
    }

    // 2. 라이더 (Rider) 생성
    // 생성 예시: rider1@email.com, rider2@email.com ...
    for (let i = 1; i <= riderCount; i++) {
      records.push({
        email: `rider${i}@email.com`,
        name: faker.person.fullName(),
        role: 'DLV', // DB에 role 컬럼이 있다면 주석 해제 후 사용
      });
    }

    // 3. 파트너 (Partner) 생성
    // 생성 예시: partner1@email.com, partner2@email.com ...
    for (let i = 1; i <= partnerCount; i++) {
      records.push({
        email: `partner${i}@email.com`,
        name: faker.person.fullName(),
        role: 'PTN', // DB에 role 컬럼이 있다면 주석 해제 후 사용
      });
    }

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