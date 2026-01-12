/**
 * @file databases/seeders/01dummy-admins.seeder.js
 * @description admins dummy data create
 * 251217 v1.0.0 wook init
 */
import bcrypt from 'bcrypt';
import db from '../../app/models/index.js';
const { Admin } = db;

// 테이블명
// const tableName = 'admins';

/** @type {import('sequelize-cli').Migration} */
export default {

  async up (queryInterface, Sequelize) {
    //레코드 정보
    const records = [
      {
        email: 'admin@admin.com',
        name: '어드민',
        password: bcrypt.hashSync('pwa505', 10),
      },
      {
        email: 'admin2@admin.com',
        name: '어드민2',
        password: bcrypt.hashSync('pwa505', 10),
      },
      {
        email: 'admin3@admin.com',
        name: '어드민3',
        password: bcrypt.hashSync('pwa505', 10),
      },
      {
        email: 'admin4@admin.com',
        name: '어드민4',
        password: bcrypt.hashSync('pwa505', 10),
      },
    ];

    // 데이터 생성 : queryInterface.bulkInsert(tableName, records, options)
    // await queryInterface.bulkInsert(tableName, records, {});
    await Admin.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tableName, records, options)
    // await queryInterface.bulkDelete(tableName, null, {});
    await Admin.destroy();
  }
};