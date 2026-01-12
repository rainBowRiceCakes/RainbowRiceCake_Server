/**
 * @file databases/seeders/09dummy-settlement.seeder.js
 * @description settlement data create
 * 260107 v1.0.0 wook init
 */

import dayjs from 'dayjs';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const now = dayjs().toDate();

    await queryInterface.bulkInsert(
      'settlements',
      [
        {
          rider_id: 20,          // 실제 존재하는 rider PK로 맞춰줘
          year: 2025,
          month: 12,
          total_amount: 320000,
          status: 'REQ',        // 요청
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          rider_id: 20,
          year: 2025,
          month: 11,
          total_amount: 450000,
          status: 'RES',        // 완료
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          rider_id: 20,
          year: 2025,
          month: 10,
          total_amount: 280000,
          status: 'RES',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          rider_id: 20,
          year: 2025,
          month: 9,
          total_amount: 510000,
          status: 'RES',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('settlements', null, {});
  },
};