/**
 * @file databases/seeders/02dummy-riders.seeder.js
 * @description riders dummy data create
 * 251219 v1.0.0 wook init
 * 260110 v2.0.0 sara update - faker import add
 */

// [수정] fakerKO를 사용하여 한글 데이터를 기본으로 설정
import { fakerKO as faker } from '@faker-js/faker'; 
// 임포트할 때 'fakerKO'를 'faker'라는 이름으로 가져와서 바로 사용
import db from '../../app/models/index.js';
import { BANK_NAMES } from '../../app/utils/toss/bankCodes.js';
const { Rider } = db;

// 테이블명
// const tableName = 'riders';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up (queryInterface, Sequelize) {
    //레코드 정보

  const getRandomBank = () => {
    const randomIndex = Math.floor(Math.random() * BANK_NAMES.length);
    return BANK_NAMES[randomIndex];
  };

    const riderCount = 100; // user 51~100번에 매칭

    const records = [
    ];

    for (let i = 51; i <= riderCount; i++) {
      records.push({
        /** @type {number} users 테이블의 PK와 매칭되는 외래키 (51~100) */
        userId: i, // [참고] 숫자 타입이므로 `${i}` 대신 i 권장
        licenseImg: `licenseImage${i}`,
        bank: getRandomBank(),
        bankNum: 1234567899,
        address: faker.location.street(),
        phone: '010-1234-5678',
        status: 'RES'
      });
    }

    // 데이터 생성 : queryInterface.bulkInsert(tableName, records, options)
    // await queryInterface.bulkInsert(tableName, records, {});
    await Rider.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tableName, records, options)
    // await queryInterface.bulkDelete(tableName, null, {});
    await Rider.destroy();
  }
};