/**
 * @file databases/migrations/20251216-03-create-riders.js
 * @description riders migration file
 * 251216 v1.0.0 jun 초기 생성
 */

import { DataTypes } from 'sequelize';

// 테이블명
const tableName = 'riders';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '기사 PK',
  },
  userId: {
    field: 'user_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '유저 PK'
  },
  licenseImg: {
    field: 'license_img',
    type: DataTypes.STRING(250),
    allowNull: false,
    comment: '운전면허'
  },
  bank: {
    field: 'bank',
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: '은행 이름'
  },
  bankNum: {
    field: 'bank_num',
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: '계좌번호'
  },
  name: {
    field: 'name',
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '기사 이름'
  },
  phone: {
    field: 'phone',
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: '휴대폰 번호'
  },
  isWorking: {
    field: 'is_working',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '출근 여부'
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '상태(대기, 활동중, 반려)'
  },
  pickupAt: {
    field: 'pickup_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '픽업 시간'
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
