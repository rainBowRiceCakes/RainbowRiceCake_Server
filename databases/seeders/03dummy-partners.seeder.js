/**
 * @file databases/seeders/03dummy-partnser.seeder.js
 * @description partners dummy data create
 * 251219 v1.0.0 wook init
 */
import { faker } from '@faker-js/faker';
import db from '../../app/models/index.js';
const { Partner } = db;
faker.locale = 'ko';
// 테이블명
// const tableName = 'partners';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up (queryInterface, Sequelize) {
    //레코드 정보
    const getRandomInRange = (min, max) =>
      Math.random() * (max - min) + min;
    const randomLat = getRandomInRange(35.82405, 35.91405);
    const randomLng = getRandomInRange(128.53933, 128.64933);

    const partnerCount = 150;

    const records = [];

    for (let i = 101; i <= partnerCount; i++) {
      records.push({
        userId: `${i}`,
        businessNum: `businessNum${i}`,
        krName: `올리브영${i}`,
        enName: `olive young${i}`,
        manager: faker.person.fullName(),
        phone: '000-1111-2222',
        status: 'RES',
        logoImg: '로고 이미지경로',
        address: '여긴 어딜까요',
        lat: randomLat,
        lng: randomLng
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