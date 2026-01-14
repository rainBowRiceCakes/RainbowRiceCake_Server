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
    
    const hotelCount = 50; // [수정] orders 시더와 맞추기 위해 30 -> 50으로 증설
    const records = [
      {
        krName: '노블스테이호텔',
        enName: 'NovleStay Hotel',
        manager: faker.person.fullName(),
        phone: '053-421-5007',
        status: true,
        address: '대구 중구 국채보상로123길 23',
        lat: '35.8717119717711',
        lng: '128.597279095498',
      },
      {
        krName: '토요코인 대구동성로점',
        enName: 'toyocoin',
        manager: faker.person.fullName(),
        phone: '053-428-1045',
        status: true,
        address: '대구 중구 동성로1길 15',
        lat: '35.8670087940219',
        lng: '128.594649534283',
      },
      {
        krName: '대구 메리어트 호텔',
        enName: 'Marriott Hotel',
        manager: faker.person.fullName(),
        phone: '053-327-7000',
        status: true,
        address: '대구 동구 동부로26길 6',
        lat: '35.8752175612884',
        lng: '128.627638855379',
      },
    ];
    
    for (let i = 1; i <= hotelCount; i++) {
      const krName = `${faker.company.name()} 호텔`;
      const enName = `${faker.word.adjective()} ${faker.company.name()} Hotel`;
      const randomLat = getRandomInRange(35.82405, 35.91405);
      const randomLng = getRandomInRange(128.53933, 128.64933);
      records.push({
        krName: krName,
        enName: enName,
        manager: faker.person.fullName(),
        phone: '000-3333-5555',
        status: true,
        address: '대구광역시 어딘가',
        lat: randomLat,
        lng: randomLng
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