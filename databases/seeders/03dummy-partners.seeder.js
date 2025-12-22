/**
 * @file databases/seeders/03dummy-partnser.seeder.js
 * @description partners dummy data create
 * 251219 v1.0.0 wook init
 */
import db from '../../app/models/index.js';
const { Partner } = db;

// 테이블명
// const tableName = 'partners';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up (queryInterface, Sequelize) {
    //레코드 정보
    const records = [
      {
        userId: 4,
        businessNum: 'img_path',
        storeKrName: 'OO은행',
        storeEnName: 'OOBank',
        manager: '김XX',
        phone: '000-1111-2222',
        status: 'res',
        logoImg: '로고 이미지경로',
        address: '여긴 어딜까요',
        lat: '12.3456',
        lng: '98.7654'
      },
      {
        userId: 5,
        businessNum: 'img_path',
        storeKrName: 'OO은행',
        storeEnName: 'OOBank',
        manager: '박XX',
        phone: '000-2222-3333',
        status: 'req',
        logoImg: '로고 이미지경로',
        address: '여긴 어딜까요',
        lat: '34.5678',
        lng: '76.5432'
      },
    ];

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