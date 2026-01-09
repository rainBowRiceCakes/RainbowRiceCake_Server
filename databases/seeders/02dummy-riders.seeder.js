/**
 * @file databases/seeders/02dummy-riders.seeder.js
 * @description riders dummy data create
 * 251219 v1.0.0 wook init
 */
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

    const riderCount = 100;

    const records = [
    ];

    for (let i = 51; i <= riderCount; i++) {
      records.push({
        userId: `${i}`,
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