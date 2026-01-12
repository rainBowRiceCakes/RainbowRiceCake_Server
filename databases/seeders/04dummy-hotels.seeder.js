/**
 * @file databases/seeders/04dummy-hotels.seeder.js
 * @description hotels dummy data create
 * 251219 v1.0.0 wook init
 * 260110 v2.0.0 sara update - faker orders 시더와 맞추기 위해 30 -> 50으로 증설
 */

import { fakerKO as faker } from '@faker-js/faker'; 
// 임포트할 때 'fakerKO'를 'faker'라는 이름으로 가져와서 바로 사용
import db from '../../app/models/index.js';
const { Hotel } = db;

// faker.locale = 'ko'; // // 이 방식은 최신 버전에서 경고가 뜨거나 작동하지 않을 수 있음

// 테이블명
// const tableName = 'hotels';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up (queryInterface, Sequelize) {
    //레코드 정보
    const getRandomInRange = (min, max) =>
      Math.random() * (max - min) + min;
    const randomLat = getRandomInRange(35.82405, 35.91405);
    const randomLng = getRandomInRange(128.53933, 128.64933);

    const hotelCount = 50; // [수정] orders 시더와 맞추기 위해 30 -> 50으로 증설

    const records = [];

    for (let i = 1; i <= hotelCount; i++) {
      records.push({
        krName: `OO호텔${i}`,
        enName: `OOHotel${i}`,
        manager: faker.person.fullName(),
        phone: '000-3333-5555',
        status: true,
        address: '여긴 어딜까요',
        lat: getRandomInRange(35.82405, 35.91405), // [수정] 루프 안으로 이동
        lng: getRandomInRange(128.53933, 128.64933) // [수정] 루프 안으로 이동
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