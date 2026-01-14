/**
 * @file databases/seeders/03dummy-partnser.seeder.js
 * @description partners dummy data create
 * 251219 v1.0.0 wook init
 */

import { fakerKO as faker } from '@faker-js/faker'; 
// 임포트할 때 'fakerKO'를 'faker'라는 이름으로 가져와서 바로 사용
import db from '../../app/models/index.js';
const { Partner } = db;
// faker.locale = 'ko'; // // 이 방식은 최신 버전에서 경고가 뜨거나 작동하지 않을 수 있음
// 테이블명
// const tableName = 'partners';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up (queryInterface, Sequelize) {
    //레코드 정보
    const getRandomInRange = (min, max) =>
      Math.random() * (max - min) + min;
    
    const partnerCount = 150;
    
    const records = [
      {
        userId: 101,
        businessNum: `businessNum101`,
        krName: `올리브영 대구중앙로점`,
        enName: `olive young`,
        manager: faker.person.fullName(),
        phone: '053-252-3428',
        status: 'RES',
        logoImg: 'http://localhost:3000/files/logos/main-logo180.svg',
        address: '대구 중구 중앙대로 388',
        lat: '35.8676862475724',
        lng: '128.593768895843'
      },
      {
        userId: 102,
        businessNum: `businessNum102`,
        krName: `다이소 대구동성로본점`,
        enName: `daiso`,
        manager: faker.person.fullName(),
        phone: '1522-4400',
        status: 'RES',
        logoImg: 'http://localhost:3000/files/logos/main-logo180.svg',
        address: '대구 중구 동성로 48-1',
        lat: '35.8711113143473',
        lng: '128.595852198507'
      },
      {
        userId: 103,
        businessNum: `businessNum103`,
        krName: `무신사 스탠다드 동성로점`,
        enName: `musinsa standard`,
        manager: faker.person.fullName(),
        phone: '0504-570-3477',
        status: 'RES',
        logoImg: 'http://localhost:3000/files/logos/main-logo180.svg',
        address: '대구 중구 동성로 25',
        lat: '35.869387888093',
        lng: '128.595084930713'
      },
      {
        userId: 104,
        businessNum: `businessNum104`,
        krName: `신세계백화점 대구점`,
        enName: `Shinsegae Department Store`,
        manager: faker.person.fullName(),
        phone: '1588-1234',
        status: 'RES',
        logoImg: 'http://localhost:3000/files/logos/main-logo180.svg',
        address: '대구 동구 동부로 149',
        lat: '35.8779406718693',
        lng: '128.629190024219',
      },
      {
        userId: 105,
        businessNum: `businessNum105`,
        krName: `나이키 동대구점`,
        enName: `nike`,
        manager: faker.person.fullName(),
        phone: '053-955-6336',
        status: 'RES',
        logoImg: 'http://localhost:3000/files/logos/main-logo180.svg',
        address: '대구 북구 신암로 107',
        lat: '35.8805179420092',
        lng: '128.611046892752',
      },
      {
        userId: 106,
        businessNum: `businessNum106`,
        krName: `포튼가먼트 대구점`,
        enName: `potengament`,
        manager: faker.person.fullName(),
        phone: '053-422-1227',
        status: 'RES',
        logoImg: 'http://localhost:3000/files/logos/main-logo180.svg',
        address: '대구 중구 동덕로 41',
        lat: '35.8587112513697',
        lng: '128.604650073804',
      },
    ];
    
    for (let i = 107; i <= partnerCount; i++) {
      const randomLat = getRandomInRange(35.82405, 35.91405);
      const randomLng = getRandomInRange(128.53933, 128.64933);
      records.push({
        userId: `${i}`,
        businessNum: `businessNum${i}`,
        krName: `올리브영${i}`,
        enName: `olive young${i}`,
        manager: faker.person.fullName(),
        phone: '000-1111-2222',
        status: 'RES',
        logoImg: 'http://localhost:3000/files/logos/main-logo180.svg',
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