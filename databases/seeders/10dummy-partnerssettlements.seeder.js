/**
 * @file databases/seeders/20260111-seed-partner-settlements.js
 */

import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const KST = "Asia/Seoul";

const tableName = 'partnerSettlements';

export default {
  async up(queryInterface, Sequelize) {

    const nowKST = dayjs().tz(KST);
    await queryInterface.bulkInsert(tableName, [
      {
        partner_id: 1,
        year: 2026,
        month: 1,
        total_amount: 550000,
        status: 'PENDING',
        merchant_uid: 'INV-202601-001',
        payment_due_date: nowKST.add(1, 'month').toDate(),
        created_at: nowKST.toDate(),
        updated_at: nowKST.toDate()
      },
      {
        partner_id: 2,
        year: 2026,
        month: 1,
        total_amount: 1250000,
        status: 'PAID',
        payment_method: 'AUTO',
        paid_at: nowKST.toDate(),
        imp_uid: 'imp_1234567890',
        merchant_uid: 'INV-202601-002',
        payment_due_date: nowKST.add(1, 'month').toDate(),
        created_at: nowKST.toDate(),
        updated_at: nowKST.toDate(),
      },
      {
        partner_id: 3,
        year: 2026,
        month: 1,
        total_amount: 300000,
        status: 'FAILED',
        payment_method: 'AUTO',
        merchant_uid: 'INV-202601-003',
        fail_reason: '잔액 부족 (Insufficient balance)',
        payment_due_date: nowKST.add(1, 'month').toDate(),
        created_at: nowKST.toDate(),
        updated_at: nowKST.toDate(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, null, {});
  }
};