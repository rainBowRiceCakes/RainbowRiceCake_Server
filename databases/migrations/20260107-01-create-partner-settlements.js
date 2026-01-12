/**
 * @file databases/migrations/20260107-01-create-partner-settlements.js
 * @description partner settlements migration file
 * 260107 v1.0.0 wook 초기 생성
 */

import { DataTypes } from 'sequelize';

const tableName = 'partnerSettlements';

const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '정산 PK',
  },
  partnerId: {
    field: 'partner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '파트너 PK'
  },
  year: {
    field: 'year',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '정산 연도'
  },
  month: {
    field: 'month',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '정산 월'
  },
  totalAmount: {
    field: 'total_amount',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '총 정산금'
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'PENDING',
    comment: 'PENDING(대기), PAID(완납), FAILED(실패), CANCEL(취소)'
  },
  paymentMethod: {
    field: 'payment_method',
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'AUTO(빌링키), MANUAL(직접입금), VACCOUNT(계좌)'
  },
  paidAt: {
    field: 'paid_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '결제 성공 시각'
  },
  impUid: {
    field: 'imp_uid',
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '포트원 고유 결제 번호'
  },
  merchantUid: {
    field: 'merchant_uid',
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '인보이스 고유 주문 번호 (INV-YYYYMM-PK)'
  },
  failReason: {
    field: 'fail_reason',
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '결제 실패 사유'
  },
  paymentDueDate: {
    field: 'payment_due_date',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '결제 예정일',
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
  },
  deletedAt: {
    field: 'deleted_at',
    type: DataTypes.DATE,
    allowNull: true,
  },
};

const options = {
  charset: 'utf8mb4',
  collate: 'utf8mb4_bin',
  engine: 'InnoDB',
};

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, attributes, options);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  }
};