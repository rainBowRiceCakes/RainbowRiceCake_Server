/**
 * @file databases/migrations/20251216-06-create-orders.js
 * @description orders migration file
 * 251216 v1.0.0 jun 초기 생성
 */

import { DataTypes } from 'sequelize';

// 테이블명
const tableName = 'orders';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '배송 PK',
  },
  userId: {
    field: 'user_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '유저 PK(email 받아 올 FK)'
  },
  riderId: {
    field: 'rider_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    comment: '기사 PK(배차 전 Null 상태)'
  },
  partnerId: {
    field: 'partner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '업체 PK(출발지)'
  },
  hotelId: {
    field: 'hotel_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '호텔 PK(도착지)'
  },
  price: {
    field: 'price',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '배송 요금'
  },
  reqTime: {
    field: 'req_time',
    type: DataTypes.DATE,
    allowNull: false,
    comment: '원하는 시간 도착'
  },
  img: {
    field: 'img',
    type: DataTypes.STRING(250),
    allowNull: true,
    comment: '짐 사진'
  },
  cntS: {
    field: 'cnt_s',
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'S사이즈 개수'
  },
  cntM: {
    field: 'cnt_m',
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'M사이즈 개수'
  },
  cntL: {
    field: 'cnt_l',
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'L사이즈 개수'
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '배송상태(waiting, matched, pickup, complete)'
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '작성일',
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '수정일',
  },
  deletedAt: {
    field: 'deleted_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '삭제일',
  },
};

// 옵션 설정
const options = {
  charset: 'utf8mb4', // 테이블 문자셋 설정(이모지 지원)
  collate: 'utf8mb4_bin', // 정렬 방식 설정(영어 대소문자 구분 정렬)
  engine: 'InnoDB', // 사용 엔진 설정
};

/** @type {import('sequelize-cli').Migration} */
export default {
  // 마이그레이션 실행 시 호출되는 메소드(스키마 생성, 수정)
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, attributes, options);
  },

  // 마이그레이션을 롤백 시 호출되는 메소드(스키마 제거, 수정)
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  }
};
